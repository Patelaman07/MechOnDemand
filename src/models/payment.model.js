import mongoose,{Schema} from "mongoose";

const paymentSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    bookingId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Booking", 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        enum: ["UPI", "Card", "Cash"], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "failed", "successful"], 
        default: "pending" 
    },
    transactionId: { 
        type: String, 
        required: true, 
        unique: true 
    }
},{
    timestamps:true
})

export const Payment = mongoose.model("Payment",paymentSchema)