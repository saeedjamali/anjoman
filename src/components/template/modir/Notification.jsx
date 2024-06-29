"use client"

import React, { useState } from 'react'
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import {

  Card,
  CardBody,
  CardFooter,
  CardHeader,

  Chip,
  Divider,
  Image,

} from "@nextui-org/react";
import Link from 'next/link';
function Notification() {
  const [isShowNotification, setIsShowNotification] = useState(true);

  return (
    <div className='rounded-md'>
      <div className='w-full border-2 border-slate-100 mt-2  rounded-md'>
        <div className='flex items-center  bg-slate-100 p-2' onClick={() => setIsShowNotification(prev => !prev)}>
          <span className=' w-full flex text-[12px]'>تابلو اعلانات</span>
          <IoIosArrowDropdownCircle />
        </div>
        {isShowNotification &&
          <div className='w-full p-2 h-96 bg-slate-200 items-start justify-center'>
            <div className='w-full '>

              <Card className='rounded-md flex lg:flex-row flex-col h-auto' >
                <CardHeader className="lg:w-[30%] w-full bg-gray-500 text-white rounded-sm">
                  <p className="text-[12px] flex items-center justify-center text-center w-full">
                    کانال اطلاعرسانی انجمن اولیا و مربیان
                  </p>
                </CardHeader>

                <CardBody className='lg:w-[70%]  w-full bg-white flex items-center justify-start text-[12px] '>
                  <p className='text-gray-700 text-right'>
                    جهت دریافت مقالات منتخب مجلات پیوند (یکی از منابع ازمون) به کانال انجمن اولیا و مربیان در پیام رسان شاد مراجعه نمایید به آدرس :
                  </p>
                  <Link href="https://shad.ir/anjoman_khr" className='w-full justify-end mt-4 p-4'>https://shad.ir/anjoman_khr</Link>

                </CardBody>

              </Card>
            </div>
            {/* <span>اطلاعیه ای وجود ندارد</span> */}
          </div>
        }
      </div >
    </div >
  )
}

export default Notification