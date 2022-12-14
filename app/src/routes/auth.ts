import { Router } from "express";
import Login from "../controllers/Auth/Login";
import Register from "../controllers/Auth/Register";
import Validate from "../middlewares/Validate";
import Joi from "joi";
const router = Router();

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

router.post("/auth/login", Validate.body(schema.login), Login.login);
router.post("/auth/forgotPassword", Login.sendForgotPassword);
router.post("/auth/resetPassword", Login.resetPassword);
router.get('/auth/renewToken/:id', Login.renewToken);


router.post("/auth/signup", Validate.body(schema.signup), Register.signup);
router.get("/verify/:id/:hash", Register.verify);
router.post("/auth/resendEmail", Register.resend);


export default router;
