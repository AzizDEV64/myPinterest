const mongoose = require("mongoose")

const imageSchema = mongoose.Schema( {
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    imageURL: {
        type: String,
        required: true,
        trim: true,
        match: /^https?:\/\/.+/
    }
},{
    versionKey:false,
    timestamps:{
    createdAt:"created_at",
    updatedAt:"updated_at"
}})

module.exports = mongoose.model("image", imageSchema)