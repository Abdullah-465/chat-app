import React from 'react'

const Avatar = ({ username, userId, online }) => {
  const colors = ['bg-red-400', 'bg-yellow-400', 'bg-purple-400', 'bg-green-400', 'bg-blue-400',]
  const userIdBase10 = parseInt(userId, 16)
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div className={'w-8 h-8 relative rounded-full text-center flex items-center justify-center font-bold ' + color}>
      {username[0].toUpperCase()}
      {online &&
        <div className='absolute w-3 h-3 bg-green-500 bottom-5 left-6 border border-white rounded-full '></div>
      }
      {!online &&
        <div className='absolute w-3 h-3 bg-gray-500 bottom-5 left-6 border border-white rounded-full '></div>
      }
    </div>
  )
}

export default Avatar
