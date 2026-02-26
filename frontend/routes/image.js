const axios = require('axios');
const express = require('express');
const router = express.Router();
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() }) 
const FormData = require("form-data")

router.post("/add", upload.single("image"), async (req, res) => {
    try {
    const form = new FormData()
    form.append("title", req.body.title)
    form.append("description", req.body.description)
    form.append("image", req.file.buffer, req.file.originalname)

    const image = await axios.post(process.env.BACKEND_URL + "/image/add", form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    })

    res.status(200).redirect("/")
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err.message })
  }
})


module.exports = router;
