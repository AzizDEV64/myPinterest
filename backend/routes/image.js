const router = require("express").Router()
const { HTTP_CODES } = require("../config/enum")
const Image = require("../db/models/Image")
const CustomError = require("../lib/Error")
const Response = require("../lib/Response")
const multer = require("multer")
const cloudinary = require('cloudinary').v2
const upload = multer({ storage: multer.memoryStorage() })
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})

router.get("/",async (req,res) => {
    try {
        let images = await Image.find({})
        res.json(Response.successResponse({images}))
    } catch (error) {
        res.status(Response.errorResponse(error).code).json(Response.errorResponse(error))
    }
})
router.post("/add",upload.single("image"),async (req,res) => {
    let body = req.body
    try {
        if(!req.file) throw new CustomError(HTTP_CODES.INT_SERVER_ERROR, "there is no file", "there is no file")
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: "myPinterest" },(error, uploadResult) => {
                if (error) {
                    return reject(error)
                }
                return resolve(uploadResult)
            }).end(req.file.buffer)
        })
        console.log(uploadResult)
        let image = await Image.create({title:body.title, description:body.description,imageURL:uploadResult.secure_url})
        res.status(HTTP_CODES.CREATED).json(Response.successResponse({success:true}))
    } catch (error) {
        res.status(Response.errorResponse(error).code).json(Response.errorResponse(error))
    }
})


module.exports = router