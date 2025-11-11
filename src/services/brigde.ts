import { eq } from "drizzle-orm";
import { encodeFunctionData } from "viem";
import { HTTPException } from 'hono/http-exception'
import { envConfig } from "@/env";
import { MintRequest } from "@/schemas";
import { db, bridgeJobs } from "@/db";
import { lensPublic, lensWallet } from "@/clients/lensClient";
import { BRIDGE_MINTER_ABI } from "@/abi";
import { InternalServerError, NotFoundError } from "@/lib/custorm-exceptions";

const getBridgeStatus = async (id: string) => {
    try {
        const rows = await db.select().from(bridgeJobs).where(eq(bridgeJobs.id, id));
        if (rows.length === 0) {
            throw new NotFoundError("Bridge job not found");
        }
        return rows[0];
    } catch (error) {
        console.error("Error getting bridge status:", error);
        throw new InternalServerError();
    }
};

const mint = async (mintData: MintRequest) => {
    const { to, amount, srcTxHash, srcChainId, srcNonce } = mintData;

    let jobResult = null;
    try {
        const [job] = await db.insert(bridgeJobs).values({
            direction: "BSC2LENS",
            srcChainId: srcChainId,
            dstChainId: envConfig.LENS_CHAIN_ID,
            tokenAddress: envConfig.LENS_WRAPPED_ADDRESS!,
            to: to,
            amount: amount.toString(), // hoặc bigint column
            srcTxHash: srcTxHash,
            srcNonce: srcNonce,
            status: "pending",
        }).returning();

        jobResult = job;

        const data = encodeFunctionData({
            abi: BRIDGE_MINTER_ABI as any,
            functionName: "mintTo",
            args: [
                to as `0x${string}`,
                amount,
                srcTxHash as `0x${string}`,
                BigInt(srcChainId),
                BigInt(srcNonce)
            ],
        });

        const hash = await lensWallet.sendTransaction({
            to: envConfig.LENS_MINTER_ADDRESS as `0x${string}`,
            data
        });

        await db.update(bridgeJobs).set({
            dstTxHash: hash,
            status: "relayed"
        }).where(eq(bridgeJobs.id, job.id));

        const receipt = await lensPublic.waitForTransactionReceipt({ hash });

        await db.update(bridgeJobs).set({
            status: receipt.status === "success" ? "completed" : "failed"
        }).where(eq(bridgeJobs.id, job.id));

        return {
            bridgeJob: job,
            txHash: hash
        };
    } catch (e: any) {
        console.error("Error during minting process:", e);
        if (jobResult) {
            await db.update(bridgeJobs).set({
                status: "failed",
                error: String(e?.message ?? e)
            }).where(eq(bridgeJobs.id, jobResult.id));
        }
        throw new HTTPException(500, { message: "Internal Server Error" } );
    }
};

export default {
    getBridgeStatus,
    mint
};