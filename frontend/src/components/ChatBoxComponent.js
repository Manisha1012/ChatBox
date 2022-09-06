import { useState, useEffect } from 'react';
import Moment from 'react-moment';
import {useSelector} from "react-redux";
import { BsFillPencilFill, BsFillReplyFill, BsFillArchiveFill, BsPencil, BsFillXCircleFill } from "react-icons/bs";

import { w3cwebsocket as W3CWebSocket } from 'websocket';
const client = new W3CWebSocket('ws://localhost:5000');

function ChatBoxComponent(){

    const loginInfo = useSelector((state) => state.loginInfo);

    /* --------------- CHAT VAR & FUNCTIONS ------------ */

    const [typingEvt, setTypingEvt] = useState([]);
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [editMsgId, setEditMsgId] = useState(null);
    const [replyMsgId, setReplyMsgId] = useState(null);


    useEffect(() => {
      const interval = setInterval(() => {
        setTypingEvt([]);
      }, 500);
      return () => clearInterval(interval);
    }, [typingEvt]);

    //client connection confirmation
    client.onopen = () => {
        console.log('WebSocket Client Connected.');
    };

    //got message from server
    client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);        
        switch(dataFromServer.type){
          case "typing":            
            setTypingEvt([dataFromServer]);
            break;
          case "message":
            setMessageList([...messageList, dataFromServer]);
            setMessage('');
            break;
          case "updateMessage":
            messageList[dataFromServer.mid] = dataFromServer;
            setMessageList(messageList);
            setMessage('');
            setEditMsgId(null);
            break;
          case "replyMessage":
            setMessageList([...messageList, dataFromServer]);
            setMessage('');
            setReplyMsgId(null);
            console.log(messageList);
            break;
          case "delmessage":
            let msgLi = messageList.filter((_, ind) => ind !== dataFromServer.mid);
            setMessageList(msgLi);
            break;
          default:
            break;
        }
    };
    
    const typeMessage = (e) => {
        let msg = e.target.value;
        //send event from client to server
        client.send(JSON.stringify({
          type: "typing",
          uid: loginInfo.uid,
          uname: loginInfo.uname
        }));
        setMessage(msg);
    }

    const onSendMessage = (e)=> {
        e.preventDefault();
       
        //send messsage from client to server
        if(editMsgId != null){
          setReplyMsgId(null);
          client.send(JSON.stringify({
              type: "updateMessage",
              mid: editMsgId,
              eventType: 1,
              mes: message,
              uid: loginInfo.uid,
              uname: loginInfo.uname,
              msgtime: new Date()
          }));
        } else if(replyMessage != null) {
          setEditMsgId(null);
          client.send(JSON.stringify({
              type: "replyMessage",
              mid: replyMsgId,
              eventType: 2,
              mes: message,
              uid: loginInfo.uid,
              uname: loginInfo.uname,
              msgtime: new Date()
          }));
      } else {
        client.send(JSON.stringify({
            type: "message",
            mes: message,
            uid: loginInfo.uid,
            uname: loginInfo.uname,
            msgtime: new Date()
        }));
      }
    }

    const removeMessage = (index) => {      
      let msgLi = messageList.filter((_, ind) => ind !== index);
      setMessageList(msgLi);
      client.send(JSON.stringify({
          type: "delmessage",
          mid: index
      }));
    }

    const editMessage = (index) => {      
      let msgToBeEdited = messageList.filter((_, ind) => ind == index);
      setMessage(msgToBeEdited[0].mes);   
      setEditMsgId(index);   
    }

    const removeEditMsgId = () => {
      setEditMsgId(null);
      setMessage('');
    }

    const replyMessage = (index) => {      
      setReplyMsgId(index);  
    }

    const removeReplyMsgId = () =>{
      setReplyMsgId(null);
    }

    return (<>
    <div className="msger">
        <div className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> SimpleChat
          </div>
          <div className="msger-header-options">
            <span><i className="fas fa-cog"></i></span>
          </div>
        </div>

        <div className="msger-chat">
          {messageList.map((msg, i) => msg.uid == loginInfo.uid ? 
            
            <div key={i} className="msg right-msg">
                <div className="msg-img"></div>

                <div className="msg-bubble">
                  <div className="msg-info">
                    <div className="msg-info-name">{msg.uname}</div>
                    <div className="msg-info-time"><Moment format="hh:mm a">{msg.msgtime}</Moment> {msg.mid != null && msg.eventType == 1 ? <BsPencil/> : ''}</div>
                  </div>

                  <div className="msg-text">
                  {msg.mid != null && msg.eventType == 2 ? <div><q>{messageList[msg.mid].mes} <br/>Message from {messageList[msg.mid].uname} at <Moment format="d M Y hh:mm a">{messageList[msg.mid].msgtime}</Moment></q><hr/><br/></div> : ''}
                  {msg.mes}
                  </div>
                </div>
                <div>
                  <span><BsFillPencilFill onClick={() => editMessage(i)}/> </span>
                  <span><BsFillArchiveFill onClick={() => removeMessage(i)}/> </span>
                  <span><BsFillReplyFill onClick={() => replyMessage(i) }/> </span>
                </div>
              </div>   
              : 
              <div key={i} className="msg left-msg">                
                <div className="msg-img"></div>

                <div className="msg-bubble">
                  <div className="msg-info">
                    <div className="msg-info-name">{msg.uname}</div>
                    <div className="msg-info-time"><Moment format="hh:mm a">{msg.msgtime}</Moment> {msg.mid != null && msg.eventType == 1 ? <BsPencil/> : ''}</div>
                  </div>

                  <div className="msg-text">
                    {msg.mid != null && msg.eventType == 2 ? <div><q>{messageList[msg.mid].mes} <br/>Message from {messageList[msg.mid].uname} at <Moment format="d M Y hh:mm a">{messageList[msg.mid].msgtime}</Moment></q><hr/><br/></div> : ''}
                    {msg.mes}
                  </div>
                </div>
                <div>
                  <span><BsFillReplyFill onClick={() => replyMessage(i) }/> </span>
                </div>
              </div> 
                       
          )}
          </div>

        {typingEvt.length && typingEvt[0].uid != loginInfo.uid ? <p>{typingEvt[0].uname} is typing..</p> : ''}
        {replyMsgId != null ? <div><q>{messageList[replyMsgId].mes} <br/>Message from {messageList[replyMsgId].uname} at <Moment format="d M Y hh:mm a">{messageList[replyMsgId].msgtime}</Moment></q><BsFillXCircleFill onClick={() => removeReplyMsgId()}/></div>: ''}
        <form className="msger-inputarea">
          {editMsgId != null ? <span className='remove-editing-msg'><BsFillXCircleFill onClick={() => removeEditMsgId()}/></span> : ''}
          <input type="text" className="msger-input" placeholder="Type message..." value={message} onChange={typeMessage}/>
          <button type="submit" className="msger-send-btn" onClick={onSendMessage}>Send</button>
        </form>
      </div>
    </>);
}

export default ChatBoxComponent;