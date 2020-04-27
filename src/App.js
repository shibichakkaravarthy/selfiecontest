import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'
import { Input, Button, } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons'
import axios from 'axios'

function App() {

  const [file, setFile] = useState({})
  const [mobile, setMobile] = useState('')
  const [user, setUser] = useState(false)
  const [mobileTextBox, setTextBox] = useState(false)
  const [userStatus, setUserStatus] = useState({ msg: '', type: '', visible: false })
  
  const onInput = (event) => {
    console.log('file', event.target.files[0])
    setFile(event.target.files[0])
  }

  const onMobileSubmit = () => {
    axios.post('http://ec2-15-206-194-148.ap-south-1.compute.amazonaws.com:3000/member/getMemberByMobile', { mobile })
    .then(member => {
      setUserStatus({ msg: `Hi ${member.data.name}! Upload your Selfie Below`, type: 'green', visible: true })
      setUser(member.data)
      setTextBox(!mobileTextBox)
      console.log('member', member.data)
    })
    .catch(err => {
      setUserStatus({ msg: `Error! Please ask in Bill Counter`, type: 'red', visible: true })
      setTimeout(() => {
        setUserStatus({ msg: ``, type: '', visible: false })
      }, 4000)
    })
  }

  const onPhotoUpload = () => {
    let selfie = new FormData()

    selfie.append('photo', file)
    selfie.append('memberId', user._id)

    axios.post('http://ec2-15-206-194-148.ap-south-1.compute.amazonaws.com:3000/selfie/add', selfie, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(selfie => {
      alert('Selfie Added')
    })
    .catch(err => {
      alert(err)
    })
  }

  return (
    <div className="App">
      <div>
        <div className="headname">Arumaii Foods & Icecreams</div>
        <div className="title">Selfie Contest</div>
      </div>

      <div className='card' >
        <div className="label">Mobile Number</div>
        <Input placeholder="Mobile Number" disabled={mobileTextBox} type='number' className='input' onChange={event => setMobile(event.target.value)} />

        {
          (userStatus.visible)
          ?
          <div style={{ color: userStatus.type, padding: '10px', fontSize: '18px' }} >{userStatus.msg}</div>
          :
          null
        }

        {
          (!mobileTextBox)
          ?
          <div style={{ margin: '15px' }} >
            <Button type="primary" shape="round" size='large' onClick={() => onMobileSubmit()} >Verify</Button>
          </div>
          :
          null
        }
        
        {
          (mobileTextBox)
          ?
          <div>
            <div className="label">Upload Photo</div>
            <Input className='input' type="file" capture="user" accept="image/*" onChange={file => onInput(file)}  />
            <div style={{ margin: '15px' }} >
              <Button shape="round" size='large' onClick={() => onPhotoUpload()} >Upload</Button>
            </div>
          </div>
          :
          null
        }
      </div>
    </div>
  );
}

export default App;
