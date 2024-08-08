import React, { useContext } from 'react'
import RegisterAndLoginForm from './RegisterAndLoginForm.jsx'
import { UserContext } from './UserContext.jsx'
import ChatUser from './ChatUser.jsx';

const Route = () => {
  const { userName, userID } = useContext(UserContext);




  return (
    <>
      {userName ? <ChatUser /> : <RegisterAndLoginForm />}
    </>
  )
}

export default Route;
