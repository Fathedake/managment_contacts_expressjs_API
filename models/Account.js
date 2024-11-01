const mongoose = require("mongoose");


const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: false,
    },
    provider: {
        type: String,
        required: true,
    },
    providerAccountId: {
        type: String,
        required: true,
    },
    access_token: {
        type: String,
        required: false,
    },
    expires_at: {
        type: Number,
        required: false,
    },
    token_type: {
        type: String,
    },
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

const AccountModel = mongoose.model("Account", AccountSchema);

module.exports = AccountModel