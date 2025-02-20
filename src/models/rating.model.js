import mongoose,{Schema} from "mongoose";

const ratingSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    mechanicId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Mechanic", 
        required: true 
    },
    bookingId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Booking", 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, max: 5 
    },
    review: { 
        type: String, 
        required: true 
    }
},{
    timestamps:true
})

export const Rating = mongoose.model("Rating",ratingSchema); 