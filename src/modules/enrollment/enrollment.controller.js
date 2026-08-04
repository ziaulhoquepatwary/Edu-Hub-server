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

export const getMyEnrolledCourses = catchAsync(async (req, res) => {
    const userEmail = req.user.email;

    const enrolledCourses = await Enrollment.aggregate([
        {
            $match: {
                userEmail: userEmail,
                paymentStatus: 'SUCCESS'
            }
        },
        {
            $addFields: {
                courseObjectId: { $toObjectId: "$courseId" }
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "courseObjectId",
                foreignField: "_id",
                as: "courseDetails"
            }
        },
        {
            $unwind: "$courseDetails"
        },
        {
            $project: {
                // Enrollment Collection এর ফিল্ডসমূহ
                _id: 1,
                orderId: 1,
                courseId: 1,
                userEmail: 1,
                userName: 1,
                proofId: 1,
                gateway: 1,
                paymentStatus: 1,
                isAccessGranted: 1,
                createdAt: 1,

                // Course Collection এর নির্দিষ্ট ফিল্ডসমূহ
                "courseDetails._id": 1,
                "courseDetails.title": 1,
                "courseDetails.category": 1,
                "courseDetails.image": 1,
                "courseDetails.price": 1,
                "courseDetails.duration": 1,
                "courseDetails.tags": 1,
                "courseDetails.level": 1,
                "courseDetails.whatYouWillLearn": 1,
                "courseDetails.certificateProvided": 1,
                "courseDetails.ratingsAverage": 1
            }
        }
    ]);

    if (!enrolledCourses || enrolledCourses.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No enrolled courses found",
            data: [],
        });
    }

    return res.status(200).json({
        success: true,
        message: "Enrolled courses retrieved successfully",
        data: enrolledCourses,
    });
});