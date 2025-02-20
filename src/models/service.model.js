import mongoose,{Schema} from "mongoose";

const serviceSchema = new Schema({
    serviceName: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    basePrice: { 
        type: Number, 
        required: true 
    },
    estimatedTime: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        enum: ["Vehicle Repair", "Electronics Repair", "Electrical Work"], 
        required: true 
    },
    image: { 
        type: String, 
        required:true
    }

},{
    timestamps:true
})

export const Service = mongoose.model("Servic",serviceSchema);
