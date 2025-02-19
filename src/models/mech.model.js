import mongoose ,{Schema} from "mongoose";

const mechanicSchema = new Schema(
    {
        fullname:{
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
        phoneNumber:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
        certificate:{
            type:String, // cloudnery url
            required:true,
        },
        specialities:[
            {
                type:String,
                required:true
            }
        ]
    },{
        timestamps:true
    }
)

export const Mechanic = mongoose.model("Mechanic",mechanicSchema)