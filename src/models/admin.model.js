import mongoose ,{Schema} from "mongoose";

const adminSchema = new Schema({
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    totalUsers: { 
        type: Number, 
        default: 0 
    },
    totalMechanics: { 
        type: Number, 
        default: 0 
    },
    totalEarnings: { 
        type: Number, default: 0 
    },
    totalBookings: { 
        type: Number, 
        default: 0 
    },
    mostPopularServices: [{ 
        type: String 
    }]
},{
    timestamps:true
})

export const Admin = mongoose.model("Admin",adminSchema);