import mongoose,{Schema} from "mongoose";


const userSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:[true,'Password is required']
        },
        phone:{
            type:Number,
            default:0,
            unique:true
        },
       
        address: {
            street: String,
            city: String,
            state: String,
            zip: String
        },
        avatar:{
            type:String,
            default:""
            
        },
       
        userBookingHistory:[
            {
                type: Schema.Types.ObjectId,
                ref:"Booking"
            }
        ],
        role:{
            type:String,
            default:""
        },
        refreshToken:{
            type:String
        },
        otp:{
            type:String,
            default:""
        },
        otpExpireAt:{
            type:Number,
            default:0
        }
        
    },{
        timestamps:true
    }
)

export const User = mongoose.model("User",userSchema)