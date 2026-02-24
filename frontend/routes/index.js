const express = require('express');
const router = express.Router();
const fs = require("fs")

router.get("/",(req,res) => {
  res.render("index")
})

let routes = fs.readdirSync(__dirname)
/* GET home page. */
for (let route of routes) {
  if (route.includes(".js") && route != "index.js")
    router.use('/' + route.split(".")[0],  require("./" + route));
}

module.exports = router;
