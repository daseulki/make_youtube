import React, {useEffect, useState} from 'react'
import Axios from 'axios';
import { Button } from 'antd';

function Subscribe(props) {

    const userTo = props.userTo
    const userFrom = props.userFrom

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    const subscribeNumberVariables = { userTo, userFrom }

    useEffect(()=>{

        Axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables)
        .then( (res) => {
            if(res.data.success){
                console.log('asdfasdf',res.data)
                setSubscribeNumber(res.data.subscribeNumber)
            }else{
                alert('구독자 수 정보 못 갖고옴')
            }
        })

        Axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
        .then( (res) => {
            if(res.data.success){
                setSubscribed(res.data.subscribed)
            }else{
                alert('내가 뭐 구독하는지 못차즘')
            }
        })
 
    },[])

    const onSubscribe = () =>{ // 이거 내가 로그인 상태일때만 해야되는거아님??

        if(Subscribed){ // 구독중이면 구독 취소 활성화 
            Axios.post('/api/subscribe/unSubscribe', subscribeNumberVariables)
            .then(res => {
                if(res.data.success) {
                    setSubscribeNumber(SubscribeNumber-1);
                    setSubscribed(!Subscribed)
                    // setVideoDetail(res.data.video)
                }else{
                    alert('구독 취소 실패')
                }
             })
        }else {
            Axios.post('/api/subscribe/subscribe', subscribeNumberVariables)
            .then(res => {
                if(res.data.success) {
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed)
                }else{
                    alert('구독 실패') 
                }
             })
        }
    }


    return (
        <div>
             {SubscribeNumber} 명 구독중.. &nbsp;&nbsp;
            <Button type={ Subscribed? 'default' : "primary" } 
            onClick={onSubscribe}>
                { Subscribed? '구독 중' : '구독 하기'}
            </Button>
        </div>

    )

}

export default Subscribe