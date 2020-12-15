import React from 'react'
import './Message.css'
import { Avatar } from "@material-ui/core";
import { useStateValue } from "./StateProvider";

function Message({ name, text, timestamp, profilePicSrc, uid }) {
  const [{ user }] = useStateValue();


  const dateToHoursMinutesString = (date) => {
    if (date) {
      const hoursMinutes = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: 'h23'
        //hour12: false,
      });
      return hoursMinutes;
    }
  };

  return (
    <div className={`message ${uid === user.uid && 'message__sender'} `}>
      {uid !== user.uid &&
        <Avatar src={profilePicSrc} />
      }
      <div className="message__info">
        <div className="message__name"> {name} </div>
        <div className="message__details">
          <div className="message__text"> {text} </div>
          <div className="message__timestamp">   {dateToHoursMinutesString(timestamp?.toDate())}</div>
        </div>
      </div>
    </div>
  )
}

export default Message
