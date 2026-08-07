import express from "express";
import { confirmPayment, createPendingOrder, getAllEnrollmentsForAdmin, getMyEnrolledCourses } from "./enrollment.controller.js";
import { verifyToken } from "../../middleware/authMiddleware.js";


const router = express.Router();

router.post('/create-pending', createPendingOrder);
router.post('/confirm-antom-payment', confirmPayment);
router.get('/user-enrollment', getAllEnrollmentsForAdmin)
router.get('/my-courses', verifyToken, getMyEnrolledCourses);


export default router;