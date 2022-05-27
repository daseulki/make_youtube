const express = require('express');
const router = express.Router();
const { Video } = require("../models/video");

const { auth } = require("../middleware/auth");
const multer = require('multer')

//=================================
//             Video
//=================================


router.post("/uploadfiles", (req, res) => {

   
});


module.exports = router;
