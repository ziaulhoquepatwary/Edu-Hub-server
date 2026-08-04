import mongoose, { Schema, model } from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true
        },
        courseId: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            default: 'Guest'
        },
        proofId: {
            type: String,
            required: true
        },
        gateway: {
            type: String,
            default: 'Antom'
        },
        paymentStatus: {
            type: String,
            default: 'SUCCESS'
        },
        isAccessGranted: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;