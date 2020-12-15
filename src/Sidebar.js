import React, { useState, useEffect } from 'react'
import './Sidebar.css'
import { faCog, faPlus, faMusic, faSearch, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { faUser, faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@material-ui/core";
import SidebarChat from './SidebarChat';
import db from "./firebase";
import firebase from "firebase";


function Sidebar() {

  const [rooms, setRooms] = useState([]);


  useEffect(() => {
    const cleanUp = db
      .collection("rooms")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setRooms(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return () => cleanUp();
  }, []);

  const createChat = () => {
    const roomName = prompt("Please enter a name for the chat room");
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

  }
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__headerLeft">
          <h2>Chats</h2>
        </div>
        <div className="sidebar__headerRight">
          <IconButton >
            <FontAwesomeIcon icon={faSearch} />
          </IconButton>
          <IconButton onClick={createChat}>
            <FontAwesomeIcon icon={faPlus} />
          </IconButton>
          <IconButton >
            <FontAwesomeIcon icon={faMusic} />
          </IconButton>
          <IconButton >
            <FontAwesomeIcon icon={faCog} />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__chats">

        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}

      </div>

      <div className="sidebar__footer">
        <IconButton>
          <FontAwesomeIcon icon={faUser} />
        </IconButton>

        <IconButton>
          <FontAwesomeIcon icon={faComment} />
        </IconButton>

        <IconButton>
          <FontAwesomeIcon icon={faSearch} />
        </IconButton>

        <IconButton>
          <FontAwesomeIcon icon={faEllipsisH} />
        </IconButton>
      </div>
    </div>
  )
}

export default Sidebar
