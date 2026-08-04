import express from "express";
import { confirmPayment } from "./enrollment.controller.js";


const router = express.Router();

router.post('/confirm-antom-payment', confirmPayment)


export default router;