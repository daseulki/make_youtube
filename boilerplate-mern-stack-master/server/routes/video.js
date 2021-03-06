const express = require('express');
const router = express.Router();
const { Video } = require("../models/video");

const { auth } = require("../middleware/auth");
const multer = require('multer')
var ffmpeg = require('fluent-ffmpeg')
const { Subscriber } = require("../models/Subscriber");

//multer config
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

const upload = multer({storage}).single("file")

//=================================
//             Video
//=================================


router.post("/uploads", (req, res) => {
   //비디오를 서버에 저장
   upload(req, res, err => {
       if(err){
           return res.json({success: false, err})
       } 
        return res.json({ success: true, url: res.req.file.path, fileName:res.req.file.filename })
   })
});

router.post("/thumbnails", (req, res) => {
    //썸네일 생성하고 비디오 duration 가져오기 
    let thumbsFilePath ="";
    let fileDuration ="";

    //비디오 정보 갖고왔음 
    ffmpeg.ffprobe(req.body.filePath, (err, metadata) => {
        // console.log(err)
        // console.dir(metadata);
        // console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 ㅅㅐㅇ성 
    ffmpeg(req.body.filePath)
        .on('filenames', (filenames) => {
            console.log('Will generate ' + filenames.join(', '))
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', () => {
            console.log('Screenshots taken');
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
        })
        .screenshots({
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            filename:'thumbnail-%b.png'
        });
 });

//비디오를 DB에서 get 
router.get('/getVideos',(req, res) =>{
    //model 정의시 type: Schema로 정의된 모든 데이터를 불러오는 조건 => populate(값이름) 메소드 호출
    Video.find().populate('writer').exec((err,videos) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({success: true, videos})
    })
 })


//비디오 정보들을 저장
router.post('/uploadVideo',(req, res) =>{
    const video = new Video(req.body) //Video 모델의 모든 정보들을 다 가져옴
    video.save((err, doc) => {
        if (err) return res.json({success: false, err})
        res.status(200).json({success: true})
    })
 })

 
router.post("/getVideoDetail", (req, res) => {
    Video.findOne({ "_id" : req.body.videoId })
    .populate('writer')
    .exec((err, video) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, video })
    })
});


router.post("/getSubscriptionVideos", (req, res) => {
    Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((err, subscribers)=> {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];

        subscribers.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })


        //Need to Fetch all of the Videos that belong to the Users that I found in previous step. 
        Video.find({ writer: { $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
    })
});
 
module.exports = router;
