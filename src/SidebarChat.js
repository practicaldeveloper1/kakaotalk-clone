import React, { useEffect, useState } from 'react'
import './SidebarChat.css'
import { Avatar } from '@material-ui/core'
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom'
import db from "./firebase";
import notificationAudio from './audio/kakaotalk.mp3'
import { useStateValue } from './StateProvider'

function SidebarChat({ id, name }) {

  const { roomId } = useParams();
  const [messages, setMessages] = useState('');
  const [seed, setSeed] = useState('');
  const [audio] = useState(new Audio(notificationAudio));
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [{ user }] = useStateValue();


  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
    let cleanUp;
    if (id) {
      cleanUp = db.collection('rooms')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) =>
            doc.data()))
          setInitialDataFetched(true);
        }
        );
    }
    return () => cleanUp();
  }, [])


  useEffect(() => {
    if (initialDataFetched) {
      if (messages[0]?.uid !== user.uid) {
        audio.play();
      }
    }
  }, [messages])

  const dateToDateMonthString = (date) => {
    const options = { day: 'numeric', month: 'long' };
    if (date) {
      const dateMonthYearString = date.toLocaleDateString([], options);
      return dateMonthYearString;
    }
  }

  return (
    <Link to={`/rooms/${id}`}>
      <div className={`sidebarChat ${id === roomId && "active"} `}>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.text}</p>
        </div>
        <div className="sidebarChat__timestamp">
          {dateToDateMonthString(
            messages[0]?.timestamp?.toDate()
          )}
        </div>
      </div>
    </Link>
  )
}

export default SidebarChat
