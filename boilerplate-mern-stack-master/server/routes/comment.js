const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");


//=================================
//             Comment
//=================================

router.post("/saveComment", (req, res) => {//코멘트 저장~~~ 
   const comment = new Comment(req.body) 

   comment.save((err, comment) => {
    if(err){
        return res.json({success:false, err})
    } else{
        Comment.find({'_id': comment._id })
        .populate('writer')
        .exec((err,result) => {
            if(err){
                return res.json({success:false, err})
            } else{ 
                return res.status(200).json({success: true, result})
            }
        })
    }
   })

});


router.post("/getComments", (req, res) => {

    Comment.find({ "postId": req.body.videoId })
        .populate('writer')
        .exec((err, comments) => {
            if (err) {
                return res.status(400).send(err)
            }else{ 
                res.status(200).json({ success: true, comments })
            }
        })

});

module.exports = router;
