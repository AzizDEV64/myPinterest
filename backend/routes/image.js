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

router.get("/feed",async (req,res) => {
    try {
        const limit = 10;
        let images = await Image.find({}).limit(limit)
        res.json(Response.successResponse({images}))
    } catch (error) {
        res.status(Response.errorResponse(error).code).json(Response.errorResponse(error))
    }
})
router.post("/images",async (req,res) => {
    try {
        const limit = 10;
        const page = req.body.page
        const skip = page * limit
        let images = await Image.find({}).skip(skip).limit(limit)
        console.log(images)
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
        let image = await Image.create({title:body.title, description:body.description,imageURL:uploadResult.secure_url, publicId:uploadResult.public_id})
        res.status(HTTP_CODES.CREATED).json(Response.successResponse({success:true}))
    } catch (error) {
        res.status(Response.errorResponse(error).code).json(Response.errorResponse(error))
    }
})
router.put("/update/:id",upload.single("image"),async (req,res) => {
    let body = req.body
    const id = req.params.id
    try {
        let image = await Image.findById(id)
        if (!image) throw new CustomError(HTTP_CODES.INT_SERVER_ERROR, "Image not found", "Image not found")
        let updateObj = {
            title:body.title,
            description:body.description
        }
        let uploadResult
        if(req.file){
            uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: "myPinterest" },(error, uploadResult) => {
                    if (error) {
                        return reject(error)
                    }
                    return resolve(uploadResult)
                }).end(req.file.buffer)
            })
            await cloudinary.uploader.destroy(image.publicId)
            updateObj.imageURL = uploadResult.secure_url
            updateObj.publicId = uploadResult.public_id
        }
        
        await Image.findByIdAndUpdate(id,updateObj)
        
        res.status(HTTP_CODES.CREATED).json(Response.successResponse({success:true}))
    } catch (error) {
        res.status(Response.errorResponse(error).code).json(Response.errorResponse(error))
    }
})
router.delete("/delete/:id",upload.single("image"),async (req,res) => {
    const id = req.params.id
    try {
        let image = await Image.findById(id)
        if (!image) throw new CustomError(HTTP_CODES.INT_SERVER_ERROR, "Image not found", "Image not found")
        
        await cloudinary.uploader.destroy(image.publicId)

        await Image.findByIdAndDelete(id)
        
        res.status(HTTP_CODES.CREATED).json(Response.successResponse({success:true}))
    } catch (error) {
        res.status(Response.errorResponse(error).code).json(Response.errorResponse(error))
    }
})
module.exports = router