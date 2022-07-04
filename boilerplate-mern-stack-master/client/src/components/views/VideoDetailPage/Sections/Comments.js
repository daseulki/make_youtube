import React, {useEffect, useState} from 'react'
import { Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'; //Redux Hook
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
const { TextArea } = Input;


function Comments(props) {
    const user = useSelector(state => state.user) //local 스토리지 말고 redux hook 에서 갖고온거 
    const [Comment, setComment] = useState("")

    const handleClick = (e) => { //onChange에 넣어줘서 textarea에 세팅되는거임..
        setComment(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault(); //항상 그렇듯이 기본 동작 막아버리기 

        const variables = {
            content: Comment,
            writer: user.userData._id,
            postId: props.postId
        }

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setComment("")
                    props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
            })


    }

    return (
        <div>
            <br />
            <p> 댓글 보기 </p>
            <hr />
            {/* 댓글 리스트 */}

            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment 
                        comment={comment} postId={props.postId} 
                        refreshFunction={props.refreshFunction} />
                        <ReplyComment 
                        CommentLists={props.CommentLists} postId={props.postId} 
                        parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}

            {/* FORM  */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={Comment}
                    placeholder="댓글을 남겨 주세용"
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>

        </div>
    )
}

export default Comments