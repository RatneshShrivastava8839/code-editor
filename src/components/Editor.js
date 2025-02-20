import React, { useEffect, useRef } from 'react';
import CodeMirror, { on } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { Socket } from 'socket.io-client';
import ACTIONS from '../Actions';
const Editor = ({socketRef,roomID,onCodeChange}) => {
  const editorRef = useRef(null);
    useEffect(()=>{
      async function init(){
        editorRef.current = CodeMirror.fromTextArea(document.getElementById('realtimeEditor'),{
          mode:{name:'javascript', json:true},
          theme:'dracula',
          autoCloseTags:true,
          autoCloseBrackets:true,
          lineNumbers:true,
        });
        
        editorRef.current.on('change',(instance,changes)=>{
          // console.log('changes',changes);
          const {origin} = changes;
          const code = instance.getValue();
          onCodeChange(code);
          if(origin!=='setValue'){
            socketRef.current.emit(ACTIONS.CODE_CHANGE,{
              roomID,
              code,
            });
          }
        })
      
        // editorRef.current.setValue('console.log("Hello World")');
      }
      init();
    },[]);
    useEffect(()=>{
      if(socketRef.current){
        socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
          if(code!==null){
            editorRef.current.setValue(code);
          }
        });
      }
      return ()=>{
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    },[socketRef.current]);
      return (
          <textarea  id='realtimeEditor'></textarea>
      );
    };

export default Editor;
