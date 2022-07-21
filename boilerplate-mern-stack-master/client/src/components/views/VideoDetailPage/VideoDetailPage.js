import React, { useEffect, useState } from 'react'
import {Row, Col, List, Avatar} from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comments from './Sections/Comments'
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    const variable = {videoId: videoId}

    const [VideoDetail, setVideoDetail] = useState([])
    const [CommentLists, setCommentLists] = useState([])


    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
        .then(res => {
            if(res.data.success) {
                setVideoDetail(res.data.video)
            }else{
                alert('비디오 정보를 가져오기 실패')
            }
        })

        Axios.post('/api/comment/getComments', variable)
        .then(response => {
            if (response.data.success) {
                console.log('response.data.comments',response.data.comments)
                setCommentLists(response.data.comments)
            } else {
                alert('eotrmf 정보를 가져오기 실패')
            }
        })

     
    },[])
    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }
    

    if(VideoDetail.writer){
        return (
            <Row gutter={[16,16]}>
                <Col lg={18} xs={24}>
                    <div style={{width: '100%', padding:'3rem 4rem'}}>
                        <video style={{width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

                        <List.Item actions={[
                            <LikeDislikes video videoId={videoId} userId={localStorage.getItem('userId')}  />,
                            <Subscribe userTo={VideoDetail.writer._id}/>
                        ]}>
                            
                            <List.Item.Meta 
                                avatar={<Avatar src={VideoDetail.writer.image}/>}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}/>
                        </List.Item>

                        <Comments CommentLists={CommentLists} postId={VideoDetail._id} key={VideoDetail._id+' '}
                         refreshFunction={updateComment} />
                    </div>


                </Col>
               
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    } else{
        return(
            <div>Loading....</div>
        )
    }
    
}

export default VideoDetailPage