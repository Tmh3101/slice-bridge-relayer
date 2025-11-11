import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { MintRequestSchema } from "@/schemas";
import bridgeController from "../controllers/bridge";

const bridgeRoutes = new Hono();

bridgeRoutes.get("status/:id", bridgeController.getBridgeStatus);
bridgeRoutes.post("mint", zValidator("json", MintRequestSchema), bridgeController.mint);

export default bridgeRoutes;