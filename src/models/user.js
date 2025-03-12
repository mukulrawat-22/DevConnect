const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
   
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    lowercase:true,
    required: true,
   unique: true,
   trim: true,
   validate(value){
    if(!validator.isEmail(value)){
      throw new Error("Invalid Email" + value);
    }
   }
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    validate(value){
      if(!["male","female", "others"].includes(value)){
        throw new Error("Gender data is not valid");
      }
    }
  },
  about:{
    type: String,
    maxLength: 200,
    trim: true,
    default: "Hello, I am a developer"
  },
  skills:{
    type:[String],
  },
 
},
{
  timestamps: true,
}
);
module.exports= mongoose.model("User", userSchema);


