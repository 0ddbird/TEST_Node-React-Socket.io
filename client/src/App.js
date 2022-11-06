
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'

const socket = io('http://localhost:3001');

function App() {
  const [room, setRoom] = useState('')
  const [inRoom, setInRoom] = useState(false);
  const [message, setMessage] = useState('')
  const [receivedMessage, setReceivedMessage] = useState('')
  
   useEffect(() => {
    if (inRoom) {
      socket.emit('join_room', { room })
    }

    return () => {
      if (inRoom) {
        socket.emit('leave room', { room })
      }
    }
  })

  useEffect(() => {
    socket.on('receive message', payload => {
      setReceivedMessage(payload.message)
    })
  }, []) //only re-run the effect if new message comes in

  const handleNewMessage = () => {
    socket.emit('new message', { room, message })
  }

  return (
    <div className='app'>
        <h1>{ inRoom ? `You are currently in room ${room}` : `Please join a room to start chatting` }</h1>

        <div className='room-connect'>
          { !inRoom &&
            <label>Room
              <input value={room} onChange={(e) => setRoom(e.target.value)}/>
            </label>
          }
          <button onClick={() => setInRoom(!inRoom)}>{inRoom ? `Leave Room` : `Enter Room`}</button>
        </div>

        { inRoom &&
        <div className='messages'>
          <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={handleNewMessage}>Send message</button>
          <div>{receivedMessage}</div>
        </div>
        }
    </div>
  )
}
export default App