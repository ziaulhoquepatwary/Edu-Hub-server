import express from "express";
import { confirmPayment, getMyEnrolledCourses } from "./enrollment.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";


const router = express.Router();

router.post('/confirm-antom-payment', confirmPayment);
router.get('/my-courses', verifyToken, getMyEnrolledCourses);


export default router;