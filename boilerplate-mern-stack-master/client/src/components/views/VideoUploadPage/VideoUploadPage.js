
import React, {useState} from 'react'
import {Typography, Button, Form, message, Input, Icon} from 'antd'
import Dropzone from 'react-dropzone'

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

function VideoUploadPage() {

  const [VideoTitle, setTitle] = useState('')
  const [VideoDescription, setDescription] = useState('')
  const [Private, setPrivate] = useState(0)
  const [Category, setCategory] = useState('Film & Animation')

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

  const onDrop = (files) =>{
    let formData = new FormData;
    const config = {
      header: {}
    }
    formData.append('file', files[0])
    Axios.post('/')
  }

  return (
    <div style={{ maxWidth : '700px', margin :'2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem'}}>
        <Title level ={2}> Upload video</Title>
      </div>
      <Form onSubmit>
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
          <div>
            <img src alt/>
          </div>
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
        <Button type='primary' size="large" onClick>
          Submit
        </Button>
        
      </Form>
    </div>
  )
}

VideoUploadPage.propTypes = {}

export default VideoUploadPage