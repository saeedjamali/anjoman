"use client"

import React, { useState } from 'react'
import { IoIosArrowDropdownCircle } from 'react-icons/io';

function Notification() {
  const [isShowNotification, setIsShowNotification] = useState(true);

  return (
    <div>
      <div className='w-full border-2 border-slate-100 mt-2 '>
        <div className='flex items-center  bg-slate-100 p-2' onClick={() => setIsShowNotification(prev => !prev)}>
          <span className=' w-full flex text-[12px]'>اطلاعیه</span>
          <IoIosArrowDropdownCircle />
        </div>
        {isShowNotification &&
          <div className='w-full p-2 h-96 bg-slate-200 flex-center'>
            <span>اطلاعیه ای وجود ندارد</span>
          </div>
        }
      </div >
    </div >
  )
}

export default Notification