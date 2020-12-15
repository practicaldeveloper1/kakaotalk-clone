import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import './Chat.css'
import { faArrowLeft, faBars, faMicrophone, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faPlusSquare, faGrin } from "@fortawesome/free-regular-svg-icons";
import { IconButton } from '@material-ui/core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DateBubble from './DateBubble';
import { useStateValue } from './StateProvider'
import Message from './Message';
import db from './firebase';
import firebase from "firebase"



function Chat() {
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputEnabled, setInputEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [{ user }] = useStateValue();

  useEffect(() => {

    const cleanUp = db.collection('rooms')
      .doc(roomId)
      .onSnapshot(snapshot => {
        if (snapshot.data()) {
          setInputEnabled(true);
          setRoomName(snapshot.data()?.name)
        }
      }
      )

    const cleanUp2 = db
      .collection("rooms")
      .doc(roomId)
      .collection('messages')
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map(doc =>
            doc.data()))
      );
    return () => {
      cleanUp();
      cleanUp2()
    }


  }, [roomId])

  useEffect(() => {
    messagesEndRef.current.scrollIntoView();

  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection('rooms').doc(roomId).collection('messages').add({
      text: inputRef.current.value,
      name: user.displayName,
      uid: user.uid,
      profilePicSrc: user.photoURL,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    inputRef.current.value = "";

  }

  return (
    <div className="chat">
      <div className="chat__header">
        <IconButton>
          <FontAwesomeIcon icon={faArrowLeft} />
        </IconButton>
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
        </div>
        <IconButton>
          <FontAwesomeIcon icon={faSearch} />
        </IconButton>
        <IconButton>
          <FontAwesomeIcon icon={faBars} />
        </IconButton>
      </div>

      <div className="chat__body">

        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const showDate = ((prevMessage?.timestamp?.toDate().getDate() !== message.timestamp?.toDate().getDate()) || (prevMessage?.timestamp?.toDate().getMonth() !== message.timestamp?.toDate().getMonth()) || prevMessage?.timestamp?.toDate().getYear() !== message.timestamp?.toDate().getYear())
          return (
            <React.Fragment key={message.timestamp + message.name} >
              { showDate && <DateBubble date={message.timestamp?.toDate()} />}
              <Message
                uid={message.uid}
                name={message.name}
                text={message.text}
                timestamp={message.timestamp}
                profilePicSrc={message.profilePicSrc} />
            </React.Fragment>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat__footer">
        <IconButton>
          <FontAwesomeIcon icon={faPlusSquare} />
        </IconButton>
        <form>
          <input ref={inputRef} type="text" disabled={!inputEnabled} />
          <button onClick={sendMessage} />
        </form>


        <IconButton>
          <FontAwesomeIcon icon={faGrin} />
        </IconButton>

        <IconButton>
          <FontAwesomeIcon icon={faMicrophone} />
        </IconButton>

      </div>
    </div>


  )
}

export default Chat
