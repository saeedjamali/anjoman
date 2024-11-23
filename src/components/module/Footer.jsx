"use client"
import React from 'react'
import { RiLogoutCircleLine, RiMenuFoldLine } from 'react-icons/ri'
import { MdCastForEducation } from "react-icons/md";
import { year } from '@/utils/constants'
import { useUserProvider } from '@/components/context/UserProvider';
function Footer() {
    const { showSidebar, setShowSideBar, modir, admin } = useUserProvider();
    const currentYear = year.find(y => y.currentYear);
    return (
        <div className='w-full h-10 bg-footer flex-center text-header-font-color rounded-b-md'>
            <div className='px-4 py-2  flex-1 flex items-center justify-start'>
                <span className='text-[1.2rem] cursor-pointer'><MdCastForEducation /></span>
                <div className='mr-4 font-iranyekanBold text-[12px] text-center flex items-center justify-between w-full'>
                    <div>
                        <span>سال تحصیلی  </span>
                        <span className='text-right'>
                            {currentYear.name}
                        </span>
                    </div>
                    <span className='mr-4 text-[10px]'> نقش : {modir ? 'مدیر ' : admin?.level == 1 ? 'کارشناس منطقه' : admin?.level == 2 ? 'کارشناس استان' : admin?.level == 3 ? 'کارشناس ستاد' : admin?.level == 999 ? 'مدیر سیستم' :admin?.level == 11 ? 'شرکت'  : 'مدرس دوره آموزش خانواده'} </span>

                </div>
            </div>
            <button className='ml-4 p-2 cursor-pointer font-iranyekanBold text-[12px] '>

            </button>
        </div>
    )
}

export default Footer