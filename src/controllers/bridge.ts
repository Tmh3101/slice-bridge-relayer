import type { Context } from "hono";
import { MintRequestSchema } from "@/schemas";
import bridgeService from "../services/brigde";

const getBridgeStatus = async (c: Context) => {
    try {
        const id = c.req.param("id");
        if (!id) {
            return c.json({ error: "Missing bridge job ID" }, 400);
        }
        const result = await bridgeService.getBridgeStatus(id);
        return c.json({
            status: "success",
            data: result
        });
    } catch (error) {
        return c.json({ error: "Failed to fetch bridge status" }, 500);
    }
};

const mint = async (c: Context) => {
    const body = await c.req.json();
    try {
        const parsed = MintRequestSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({ error: "Invalid request data", details: parsed.error }, 400);
        }
        const result = await bridgeService.mint(parsed.data);
        return c.json(result);
    } catch (error) {
        return c.json({ error: "Invalid request body" }, 400);
    }
}

export default {
    getBridgeStatus,
    mint
};
