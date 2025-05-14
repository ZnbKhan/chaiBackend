import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema(
   {
     susbcriber:{
        type: Schema.Types.ObjectId, //one who is subscribing
        ref:"User"
     },
     channel:{
        type:Schema.Types.ObjectId, //channel toh ek user hi h
        ref:"User"
     }
}, {timestamps:true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)