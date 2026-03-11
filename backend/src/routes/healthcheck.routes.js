import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";

const router = Router();//make the router




router.route("/healthcheck").get(
  (req, res, next) => {
    console.log("Incoming health check request...");
    next(); // Move to userRegisterValidator
  },
  verifyJWT,
  verifyRole("admin"),
  healthCheck
);



export default router;
