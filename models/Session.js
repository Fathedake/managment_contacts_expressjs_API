const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  session_token: {
    type: String,
    required: true,
    unique: true,

  },
  expires: { type: Date, required: false, },
}, {
  timestamps: false,
  versionKey: false,
  id: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
});

const SessionModel = mongoose.model("Session", SessionSchema);


module.exports = SessionModel