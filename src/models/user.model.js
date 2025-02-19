import mongoose,{Schema} from "mongoose";


const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,
            required:true
        },
        coverImage:{
            typeof:String,
        },
        orderHistory:[
            {
                type: Schema.Types.ObjectId,
                ref:"Mechanic"
            }
        ],
        password:{
            type:String,
            required:[true,'Password is required']
        },
        refreshToken:{
            type:String
        },
        address:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        }


    },{
        timestamps:true
    }
)

export const User = mongoose.model("User",userSchema)