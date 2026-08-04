import mongoose from "mongoose";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import Enrollment from "./enrollment.model.js";

export const confirmPayment = catchAsync(async (req, res) => {
    const { orderId, courseId, userEmail, userName, proofId, gateway } = req.body;

    if (!orderId || !courseId || !userEmail || !proofId) {
        throw new AppError(400, "Missing required fields for enrollment confirmation");
    }

    const existingEnrollment = await Enrollment.findOne({ orderId });

    if (existingEnrollment) {
        return res.status(200).json({
            success: true,
            message: "Payment already processed and recorded",
            data: existingEnrollment,
        });
    }

    const newEnrollment = await Enrollment.create({
        orderId,
        courseId,
        userEmail: userEmail || "",
        userName: userName || 'Guest',
        proofId,
        gateway: gateway || 'Antom',
        paymentStatus: 'SUCCESS',
        isAccessGranted: true
    });

    return res.status(201).json({
        success: true,
        message: "Payment proof saved successfully",
        data: newEnrollment,
    });
});