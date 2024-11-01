

const mongoose = require("mongoose");

const VerificationTokenSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref:'User',
        required: false,
    },
    VerificationToken_token: {
        type: String,
        required: true,
    },
    expires: { type: Date,  required: false, },
});

const VerificationTokenModel = mongoose.model("VerificationToken", VerificationTokenSchema);


module.exports =VerificationTokenModel