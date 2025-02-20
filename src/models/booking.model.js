import mongoose,{Schema} from "mongoose";

const bookingSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    mechanicId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Mechanic",
        required:true
    },
    serviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service",
        required:true
    },
    category:{
        type:String,
        required:true
    },
    deviceDetails: {
        brand: String,
        model: String,
        issue: String
    },
    status: { 
        type: String, 
        enum: ["pending", "accepted", "in-progress", "completed", "cancelled"], 
        default: "pending" 
    },
    scheduledTime: { 
        type: Date, 
        required: true 
    },
    completedTime: { 
        type: Date,
        required:true 
    },
    price: { 
        type: Number, 
        required: true
    },
    paymentStatus: { 
        type: String, 
        enum: ["pending", "paid", "refunded"], 
        default: "pending" 
    },
    paymentMethod: { 
        type: String, 
        enum: ["UPI", "Card", "Cash"], 
        required: true 
    }   
},
{
    timestamps:true
})

export const Booking = mongoose.model("Booking",bookingSchema);