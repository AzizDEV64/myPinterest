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
        trim: true,
        match: /^https?:\/\/.+/
    },
    publicId: {
        type: String,
        trim: true
    }
},{
    versionKey:false,
    timestamps:true
})

module.exports = mongoose.model("image", imageSchema)