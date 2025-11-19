import { eq } from "drizzle-orm";
import { db, bridgeJobs } from "@/db";
import { FEE_PERCENTAGE, MIN_TOKEN_PER_TX } from "@/core/constants";
import { InternalServerError, NotFoundError, BadRequestError } from "@/lib/custorm-exceptions";

const getBridgeStatus = async (id: string) => {
    try {
        const rows = await db.select().from(bridgeJobs).where(eq(bridgeJobs.id, id));
        if (rows.length === 0) {
            throw new NotFoundError("Bridge job not found");
        }
        return rows[0];
    } catch (error) {
        console.error("Error getting bridge status:", error);
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new InternalServerError();
    }
};

const estimateFee = async (data: {
    amount: number;
}) => {
    try {
        if (data.amount < MIN_TOKEN_PER_TX) {
            throw new BadRequestError(`Amount must be at least ${MIN_TOKEN_PER_TX} tokens`);
        }
        const totalFee = (data.amount * FEE_PERCENTAGE) / 100;
        const totalReceiveAmount = data.amount - totalFee;
        return {
            feePercentage: FEE_PERCENTAGE.toString(),
            estimatedFee: totalFee.toString(),
            totalReceiveAmount: totalReceiveAmount.toString()
        };
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error;
        }
        throw new InternalServerError();
    }
};

export default {
    getBridgeStatus,
    estimateFee,
};