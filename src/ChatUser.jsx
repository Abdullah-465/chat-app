import React, { useContext, useEffect, useRef, useState } from 'react'
import Logo from './Logo';
import _ from 'lodash';
import { UserContext } from './UserContext';
import axios from 'axios';
import Contacts from './Contacts';
import './ChatUser.css'

const ChatUser = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectUserId, setSelectUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesBoxRef = useRef();
  const { userName, userID, setUserName, setUserId } = useContext(UserContext);

  useEffect(() => {
    connectToWs()
  }, [])

  function connectToWs() {
    const ws = new WebSocket('ws://localhost:4040/')
    console.log(ws); // this is the console of the ws so review it in console for better understanding  
    setWs(ws)
    ws.addEventListener('message', messageHandler)
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Trying to connect to Ws.....');
        connectToWs()
      }, 1000)
    })
  }

  function messageHandler(e) {
    const messageData = JSON.parse(e.data)
    if ('online' in messageData) {
      showOnlinePeople(messageData.online)
    }
    else if ('text' in messageData) {
      setMessages(prev => ([...prev, { ...messageData }]))
    }

  }

  
  function showOnlinePeople(peopleArray) {
    const people = {};
    // console.log(peopleArray);
    peopleArray.forEach(({ userId, username }) => {
      if (username !== userName) {
        people[userId] = username;
      }
    });
    setOnlinePeople(people)
  }

  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      submitMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,

      })
    }
  }

  function submitMessage(e, file = null) {

    if (e) e.preventDefault();
    console.log('message sent....');
    ws.send(JSON.stringify({
      message: {
        sender: userID,
        recepient: selectUserId,
        text: newMessageText,
        file,
      }
    }))
    setNewMessageText('')
    setMessages(prev => ([...prev, {
      text: newMessageText,
      sender: userID,
      recepient: selectUserId,
      _id: Date.now()
    }]))
    if (file) {
      axios.get('/messages/' + selectUserId).then((res) => {
        return res.data;
      }).then((data) => {
        setMessages(data)
      })
    }
    else{
      setNewMessageText('')
    setMessages(prev => ([...prev, {
      text: newMessageText,
      sender: userID,
      recepient: selectUserId,
      _id: Date.now()
    }]))
    }
    
  }


  

  const messagesWithoutDupes = _.uniqBy(messages, '_id');

  useEffect(() => {
    const div = messagesBoxRef.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  useEffect(() => {
    axios.get('/people').then((res) => {
      const offlinePeopleArr = res.data.filter(p => p._id !== userID).filter(p => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeopleAll = {};
      offlinePeopleArr.forEach(p => {
        offlinePeopleAll[p._id] = p.username;
      });

      setOfflinePeople(offlinePeopleAll);
      setSelectedUsername(res.data);
    })
  }, [onlinePeople])

  useEffect(() => {
    if (selectUserId) {
      axios.get('/messages/' + selectUserId).then((res) => {
        return res.data;
      }).then((data) => {
        setMessages(data)
      })
    }
  }, [selectUserId])

  function logoutHandler() {
    axios.post('/logout').then((res) => {
      setUserId(null);
      setUserName(null);
      setWs(null)
      console.log(res.data);
    })
  }

  return (
    <div className='flex h-screen'>
      <div className='bg-blue-50 w-1/3 flex flex-col'>
        <div className='flex-grow'>
          <Logo />
          {Object.keys(onlinePeople).map((userId) => {
            // console.log(userId);
            // console.log(offlinePeople);
            return (
              <Contacts
                id={userId}
                online={true}
                username={onlinePeople[userId]}
                onClick={() => setSelectUserId(userId)}
                selected={userId === selectUserId}
                key={userId}
              />
            )
          })}
          {Object.keys(offlinePeople).map((userId) => {
            return (
              <Contacts
                id={userId}
                online={false}
                username={offlinePeople[userId]}
                onClick={() => setSelectUserId(userId)}
                selected={userId === selectUserId}
                key={userId}
              />
            )
          })}
        </div>
        <div className='items-center  flex justify-between px-4 py-2 border-t'>
          <div className='flex items-center gap-1'>
            <div className=' border-2 rounded-full p-1  bg-blue-500 text-white'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
            <span>
              {userName}
            </span>
          </div>
          <button
            onClick={logoutHandler}
            className='text-white p-1 text-bold border rounded-full bg-blue-500'>
            <span title='Logout'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ">
                <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5A.75.75 0 0 1 10 2ZM5.404 4.343a.75.75 0 0 1 0 1.06 6.5 6.5 0 1 0 9.192 0 .75.75 0 1 1 1.06-1.06 8 8 0 1 1-11.313 0 .75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <div className='bg-blue-100 w-2/3 flex flex-col pb-3 '>
        <div className='flex-grow '>
          {!selectUserId && (
            <div className='h-full flex items-center justify-center'>
              <div className='text-gray-400 '>&larr; select a person from sidebar</div>
            </div>
          )}
          {!!selectUserId && (
            <div className='relative  h-full'>
              <div className='  overflow-y-scroll  absolute inset-0 '>
                <div className='border border-b bg-blue-50 px-5 py-4 font-mono sticky top-0'>
                  {selectedUsername
                    .filter(user => user._id === selectUserId)
                    .map(user => (
                      <p key={user._id}>
                        {user.username.charAt(0).toUpperCase() + user.username.slice(1)}

                      </p>
                    ))}
                </div>
                <div className='px-3 pb-3'>
                  {messagesWithoutDupes.map(msg => {
                    return <div key={msg._id} className={(msg.sender === userID ? 'text-left' : 'text-right')}>
                      <div className={"text-left inline-block p-2 my-1 rounded-md text-sm " + (msg.sender === userID ? 'bg-white text-black' : 'bg-blue-500 text-white')}>
                        {msg.text}
                        {msg.file && (
                          <div>
                            <a target='_blank' className='underline flex items-center gap-1' href={axios.defaults.baseURL + '/uploads/' + msg.file}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                              </svg>
                              {msg.file}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  })}
                  <div ref={messagesBoxRef}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        {!!selectUserId && (
          <form className='flex mx-2 gap-2 ' onSubmit={submitMessage}>
            <input
              value={newMessageText}
              onChange={ev => setNewMessageText(ev.target.value)}
              type="text" placeholder='Type your message here'
              className='border rounded-md p-2 flex-grow bg-white'
            />
            <label type='button' className='bg-blue-200 cursor-pointer p-2 rounded-md border border-blue-200 text-gray-700'>
              <input type="file" className='hidden' onChange={sendFile} />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
              </svg>
            </label>
            <button type='submit' className='p-2 bg-blue-500 border rounded-md  text-white'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ChatUser
