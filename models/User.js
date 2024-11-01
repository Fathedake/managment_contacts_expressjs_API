const mongoose = require("mongoose");
const AccountModel=require("./Account")
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    fistname: {
        type: String,
        required: false,
    },
    lastname: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        lowercase: true, index: true
    },
    password: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        required: false,
    },
    emailVerified: { type: Date,  required: false, },
    role:{
        type:String,
        required:true,
        default:"customer",
    }
},{
    timestamps: false,
    versionKey: false,
    toJSON: {
      transform(doc, ret){
        ret.id = ret._id
        delete ret._id
      }
    }});

const UserModel = mongoose.model("User",UserSchema);


module.exports =UserModel