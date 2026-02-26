const express = require('express');
const router = express.Router();
const fs = require("fs")
const axios = require("axios")

router.get("/",async (req,res) => {
  const response = await axios.get(process.env.BACKEND_URL+"/image")
  res.render("index",{images:response.data.data.images})
})

let routes = fs.readdirSync(__dirname)
for (let route of routes) {
  if (route.includes(".js") && route != "index.js")
    router.use('/' + route.split(".")[0],  require("./" + route));
}

module.exports = router;
