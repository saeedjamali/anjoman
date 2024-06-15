"use client"

import React from 'react'
import { RiMenuFoldLine } from "react-icons/ri";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useUserProvider } from '@/components/context/UserProvider';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function Navbar() {
    const { showSidebar, setShowSideBar, modir, admin } = useUserProvider();
    const router = useRouter();
    const logoutHandler = async () => {
        const response = await fetch("/api/auth/logout");
        router.refresh();
        toast.success("خارج شدید")
    }
    return (
        <div className='w-full h-12  flex-center bg-header text-header-font-color'>
            <div className='px-4 py-2  flex-1 flex items-center justify-start'>
                <button className='text-[1.2rem] cursor-pointer' onClick={() => setShowSideBar(prev => !prev)}>
                    {showSidebar ? <RiMenuFoldLine /> : <RiMenuUnfoldLine />}
                </button>
                <span className='mr-4 font-iranyekan text-[12px]'>{modir?.name || admin?.name} خوش آمدید</span>
            </div>
            <button className='ml-4 p-2 cursor-pointer' onClick={logoutHandler}>
                <RiLogoutCircleLine />
            </button>
        </div>
    )
}

export default Navbar