const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({

    userId: {type : String, required: true},
    email: {type: String, required: true},
    token: {type: String, required: true}

}, {timestamps : true});

export default mongoose.models.forgotPassword || mongoose.model("forgotPassword", forgotPasswordSchema)
