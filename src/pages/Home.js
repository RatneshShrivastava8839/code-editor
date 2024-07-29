import React, { useState } from 'react'
import toast from 'react-hot-toast';
import {v4 as uuidV4} from 'uuid'
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    const [roomID , setRoomId] = useState('');
    const [username , setusername] = useState('');
    const img_link = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1biOZ0Dwzgw_eCPjPDvh6AgT7bwHUusgz-g&s"
    const createNewRoom =(e)=>{
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    }
    const joinRoom= ()=>{
        if(!roomID || !username){
            toast.error('ROOM ID & username is required')
            return ;
        }
        // redirect 
        navigate(`/editor/${roomID}`,{state:{username,},})
    }
    const handleInput = (e)=>{
        if(e.key === 'Enter'){
            joinRoom();
    }
}
    return (
    <div className='homePageWrapper'>
        <div className="formWrapper">
            <img className='logo' src={img_link} alt="" />
            <h4 className='mainLabel'>Paste Invitation Room ID</h4>
            <div className="inputGroup">
                <input type="text" className="inputBox" placeholder='ROOM ID' onChange={(e)=>setRoomId(e.target.value)} value={roomID} onKeyUp={handleInput}/>
                <input type="text" className="inputBox" placeholder='USERNAME'  onChange={(e)=>setusername(e.target.value)} value={username} onKeyUp={handleInput}/>
            </div>
            <button onClick={joinRoom} className="btn joinBtn">Join</button>
        <span className='createInfo'>If you don't have an invite then creat &nbsp; 
            <a onClick={createNewRoom} href="" className='createNewBtn'>new room</a>
        </span>
        </div>
    {/* <footer className="footer"><h4>create by Ratnesh Shrivastava</h4></footer> */}
    </div>
  )
}

export default Home