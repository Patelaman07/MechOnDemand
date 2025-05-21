import mongoose, { Schema } from "mongoose";


const userSchema = new Schema(
    {
        fullName: {
            type: String,
            default: ""
        },
        name: {
            type: String,
            required: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        phone: {
            type: Number,
            default: 0,
            unique: true
        },
        role: {
            type: String,
            default: "user"
        },
        address: [
            {
                street: String,
                city: String,
                state: String,
                zip: String
            }
        ],
        location: {
            type: {
                type: String,    // GeoJSON type
                enum: ['Point'], // Sirf 'Point' allowed hai
                
            },
            coordinates: {
                type: [Number],  // Array of numbers [longitude, latitude]
                
            },
        },
        avatar: {
            type: String,
            default: ""

        },

        userBookingHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Booking"
            }
        ],
        refreshToken: {
            type: String
        },
        otp: {
            type: String,
            default: ""
        },
        otpExpireAt: {
            type: Number,
            default: 0
        }

    }, {
    timestamps: true
}
)

export const User = mongoose.model("User", userSchema)