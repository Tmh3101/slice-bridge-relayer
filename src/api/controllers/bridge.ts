import type { Context } from "hono";
import bridgeService from "../services/brigde";
import { AppError } from "@/lib/custorm-exceptions";
import { SuccessResponse } from "@/lib/custorm-response";

const getBridgeStatus = async (c: Context) => {
    try {
        const id = c.req.param("id");
        if (!id) {
            return c.json({ error: "Missing bridge job ID" }, 400);
        }
        const result = await bridgeService.getBridgeStatus(id);
        return c.json(new SuccessResponse(200, "Bridge job fetched successfully", result));
    } catch (error) {
        if (error instanceof AppError) {
            return c.json({ code: error.code, message: error.message }, error.status);
        }
        return c.json({ error: "Failed to fetch bridge status" }, 500);
    }
};

const estimateFee = async (c: Context) => {
    try {
        const amount = c.req.query("amount");
        if (!amount) {
            return c.json({ error: "Missing amount parameter" }, 400);
        }
        const result = await bridgeService.estimateFee({ amount: parseInt(amount, 10) });
        return c.json(new SuccessResponse(200, "Fee estimated successfully", result));
    } catch (error) {
        if (error instanceof AppError) {
            return c.json({ code: error.code, message: error.message }, error.status);
        }
        return c.json({ error: "Failed to estimate fee" }, 500);
    }
};

export default {
    getBridgeStatus,
    estimateFee,
};
