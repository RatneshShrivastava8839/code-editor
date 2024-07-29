import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
// import { reactNavigator } from 'react'
const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomID } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));
            function handleErrors(err) {
                console.log('socket error', err);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }
            socketRef.current.emit(ACTIONS.JOIN, 
                roomID,
                location.state?.username,
            );

            socketRef.current.on(ACTIONS.JOINED,
                ({clients,username,socketId}) => {
                if(username!==location.state?.username){
                    toast.success(`${username} joined the room`);
                    // console.log('new user joined',username);
                }
                // console.log('clients',clients,socketId,username);
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE,{
                    code:codeRef.current,
                    socketId,
                });
            });

            socketRef.current.on(ACTIONS.DISCONNECTED,
                ({socketId,username})=>{
                toast.success(`${username} left the room.`);
                setClients((prev)=>{
                    return prev.filter((client)=>client.socketId!==socketId);
                })
            })
        };
        init();
        return ()=>{
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        }
    }, []);
    const img_link = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1biOZ0Dwzgw_eCPjPDvh6AgT7bwHUusgz-g&s"

    async function copyRoomID(){
        try{
            await navigator.clipboard.writeText(roomID);
            toast.success('Room ID copied');
        }
        catch(err){
            toast.error('Failed to copy room ID');
    }
    }
    function leaveRoom(){
        reactNavigator('/');
    }
    if(!location.state) {
        return <Navigate to="/" />;
    }
    return (
        <div className='mainWrap'>
            <div className="aside">
                <div className="asideInner">
                    <div className="second_logo">
                        <img className='logo_img' src={img_link} alt="" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => <Client key={client.socketId} username={client.username} />)}
                    </div>
                </div>
                <button className='btn copyBtn' onClick={copyRoomID}>Copy ROOM ID</button>
                <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
            </div>
            <div className="editorWrap">
                <Editor socketRef={socketRef} roomID={roomID} onCodeChange={(code)=>{codeRef.current = code;}}/>
            </div>
        </div>
    )
}

export default EditorPage