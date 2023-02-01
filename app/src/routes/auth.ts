import { Router } from "express";
import Joi from "joi";
import Validate from "../middlewares/Validate";
import Login from "../controllers/Auth/Login";
import Register from "../controllers/Auth/Register";

const router = Router();

// Joi validation schema
const schema = {
  signup: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirm: Joi.string().required().equal(Joi.ref("password")),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// Routes for login 
router.post("/auth/login", Validate.body(schema.login), Login.login);
router.post("/auth/forgotPassword", Login.sendForgotPassword);
router.post("/auth/resetPassword", Login.resetPassword);
router.get('/auth/renewToken/:id', Login.renewToken);

// Routes for register
router.post("/auth/signup", Validate.body(schema.signup), Register.signup);
router.get("/verify/:id/:hash", Register.verify);
router.post("/auth/resendEmail", Register.resend);


export default router;
