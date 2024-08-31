import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
      type:String,
      required:true,
      unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        enum:['male','female'],
    },
    about:{type:String, default:''},
    followers:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],

    following:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    posts:[{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
}, {timestamps:true});
export const User = mongoose.model("User", userModel);