import { Hono } from "hono";
import bridgeController from "../controllers/bridge";

const bridgeRoutes = new Hono();

bridgeRoutes.get("status/:id", bridgeController.getBridgeStatus);
bridgeRoutes.get("estimate-fee", bridgeController.estimateFee);

export default bridgeRoutes;