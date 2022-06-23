const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");


//=================================
//             Subscribe
//=================================

router.post("/subscribeNumber", (req, res) => {//영상의 구독자 수 확인 
    Subscriber.find({'userTo': req.body.userTo})
    .exec((err,subscribe)=>{ //subscribe에는 userTo를 구독하는 모든 케이스 정보가 있음 
        if(err){
            return res.status(400).send(err)
        } else{
            return res.status(200).json({success:true, subscribeNumber: subscribe.length, subscribe})
        }
    })

});

router.post("/subscribed", (req, res) => {  //내가 구독중인지 확인 
    Subscriber.find({'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err,subscribe)=>{ //subscribe에는 userTo를 구독하는 모든 케이스 정보가 있음 
        if(err){
            return res.status(400).send(err)
        } else{
            let result = false;
            if(subscribe.length !== 0){
                result = true;
            } 
            return res.status(200).json({success:true, subscribed: result})
        }
    })

});

router.post("/unSubscribe", (req, res) => { //구독 해제 
    Subscriber.findOneAndDelete({'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err,doc)=>{ 
        if(err){
            return res.status(400).json({success:false, err})
        } else{
            return res.status(200).json({success:true, doc})
        }
    })

});

router.post("/subscribe", (req, res) => {//구독 
    const subscribe = new Subscriber(req.body)
    console.log(subscribe)
    subscribe.save((err,doc)=>{ //subscribe에는 userTo를 구독하는 모든 케이스 정보가 있음 
        if(err){
            return res.json({success:false, err})

        } else{
            let result = false;
            if(subscribe.length !== 0){
                result = true;
            } 
            return res.status(200).json({success:true})
        }
    })

});



module.exports = router;
