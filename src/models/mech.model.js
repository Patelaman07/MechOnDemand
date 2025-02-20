import mongoose ,{Schema} from "mongoose";

const mechanicSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            index:true,
            trim:true
        },
        password:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        phone:{
            type:Number,
            required:true
        },
        address: {
            street: String,
            city: String,
            state: String,
            zip: String
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        skills: [
            { 
                type: String, 
                required: true 
            }
        ],
        experience: { 
            type: String, 
            required: true 
        },
        availability: { 
            type: Boolean, 
            default: true 
        },
        location: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        },
        serviceCategories: [
            { 
                type: String, 
                enum: ["Vehicle Repair", "Electronics Repair", "Electrical Work"] 
            }
        ],
        pricing: { 
            type: Map, 
            of: Number 
        },
        earnings: { 
            type: Number, 
            default: 0 
        },
        verified: { 
            type: Boolean, 
            default: false 
        },
        profileImage: { 
            type: String, 
           required:true
        },
    },{
        timestamps:true
    }
)

export const Mechanic = mongoose.model("Mechanic",mechanicSchema)