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

    if (req.file) {
      form.append("image", req.file.buffer, req.file.originalname)
    } else if (req.body.imageURL) {
      const imgResponse = await axios.get(req.body.imageURL, { responseType: 'arraybuffer' })
      const contentType = imgResponse.headers['content-type'] || 'image/jpeg'
      const ext = contentType.split('/')[1] || 'jpg'
      const filename = 'internet-image.' + ext.split(';')[0]
      form.append("image", Buffer.from(imgResponse.data), { filename, contentType })
    }

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
router.post("/update", upload.single("image"), async (req, res) => {
  try {
    const form = new FormData()
    form.append("title", req.body.title)
    form.append("description", req.body.description)

    if (req.file) {
      form.append("image", req.file.buffer, req.file.originalname)
    } else if (req.body.imageURL) {
      const imgResponse = await axios.get(req.body.imageURL, { responseType: 'arraybuffer' })
      const contentType = imgResponse.headers['content-type'] || 'image/jpeg'
      const ext = contentType.split('/')[1] || 'jpg'
      const filename = 'internet-image.' + ext.split(';')[0]
      form.append("image", Buffer.from(imgResponse.data), { filename, contentType })
    }

    const image = await axios.put(process.env.BACKEND_URL + "/image/update/" + req.body.imageId, form, {
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
router.post("/delete", async (req, res) => {
  try {


    await axios.delete(process.env.BACKEND_URL + "/image/delete/" + req.body.imageId, {
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
