
import React, {useState} from 'react'
import {Typography, Button, Form, message, Input, Icon} from 'antd'
import Axios from 'axios'
import Dropzone from 'react-dropzone'
import { useSelector } from "react-redux";


const { TextArea } = Input
const { Title } = Typography

const PrivateOption = [
  {value:0, label: 'Private'},
  {value:1, label: 'Public'}
]
const CategoryOption = [
  {value:0, label: 'Film & Animation'},
  {value:1, label: 'Auto & Vehicles'},
  {value:2, label: 'Pets & Animals'},
  {value:3, label: 'Music'},

]

function VideoUploadPage(props) {
  const user = useSelector(state => state.user);

  const [VideoTitle, setTitle] = useState('')
  const [VideoDescription, setDescription] = useState('')
  const [Private, setPrivate] = useState(0)
  const [Category, setCategory] = useState('Film & Animation')
  const [FilePath, setFilePath] = useState("")
  const [Duration, setDuration] = useState("")
  const [ThumbnailPath, setThumbnailPath] = useState("")


  const onTitleChange = (e) => {
    setTitle(e.currentTarget.value)
  }  
  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value)
  }
  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value)
  }
  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value)
  }
  
  const onSubmit = (e) => {

    e.preventDefault();

    if (user.userData && !user.userData.isAuth) {
        return alert('Please Log in First')
    }

    if (VideoTitle === "" || VideoDescription === "" ||
        Category === "" || FilePath === "" ||
        Duration === "" || ThumbnailPath === "") {
        return alert('Please first fill all the fields')
    }

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: VideoDescription,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath
    }

    Axios.post('/api/video/uploadVideo', variables)
        .then(res => {
          if (res.data.success) {
              alert('video Uploaded Successfully')
              props.history.push('/')
          } else {
              alert('Failed to upload video')
          }
      })

}
  const onDrop = (files) => {
    let formData = new FormData;
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }
    formData.append('file', files[0])
    Axios.post('/api/video/uploads', formData, config)
    .then(res => {
      console.log(res.data)
      if (res.data.success) {

        let variable = {
          filePath: res.data.url,
          fileName: res.data.fileName
        }
        setFilePath(res.data.filePath)

        //gerenate thumbnail with this filepath ! 

        Axios.post('/api/video/thumbnails', variable)
          .then(response => {
              if (response.data.success) {
                console.log(response)
                  setDuration(response.data.fileDuration)
                  setThumbnailPath(response.data.thumbsFilePath)
              } else {
                  alert('Failed to make the thumbnails');
              }
          })
      } else {
        alert('failed to save the video in server')
      }
    })
  }

  return (
    <div style={{ maxWidth : '700px', margin :'2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem'}}>
        <Title level ={2}> Upload video</Title>
      </div>
      <Form  onSubmit={onSubmit}>
        <div style={{ display : 'flex', justifyContent: 'space-between'}}>
          {/*  Drop zone  */}

          <Dropzone 
          onDrop = {onDrop}
          multiple = {false}
          maxSize = {10000000}
          >
            {({ getRootProps, getInputProps}) => (
              <div style={{ width:'300px', height:'240px', border:'1px solid lightgray', display:'flex',
              alignItems:'center', justifyContent:'center'}} {...getRootProps()}>
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem'}} />

              </div>
            )
            }
          </Dropzone>
          {/*  Thumbnail zone  */}
          { ThumbnailPath &&
          <div>
            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"/>
          </div>
          }
        </div>
        <br/><br/>
        <label> Title </label><br/>
        
        <Input 
        onChange={onTitleChange}
        value={VideoTitle} />
        <br/><br/>

        <label> Description </label><br/>
        <TextArea 
        onChange={onDescriptionChange} 
        value={VideoDescription} />
        <br/><br/>

        <select onChange={onPrivateChange}
        value={Private}>
          {PrivateOption.map((item, index) => (
            <option key={index} value ={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br/><br/>
        <select onChange={onCategoryChange}
        value={Category}>

          {CategoryOption.map((item, index) => (
            <option key={index} value ={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br/><br/>
        <Button type='primary' size="large"  onClick={onSubmit} >
          Submit
        </Button>
        
      </Form>
    </div>
  )
}

VideoUploadPage.propTypes = {}

export default VideoUploadPage