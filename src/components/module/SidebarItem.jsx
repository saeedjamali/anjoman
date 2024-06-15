
import Link from 'next/link'
import React, { useState } from 'react'
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io'

function SidebarItem({ title, subMenu, children }) {

    const [isSubMenu, setIsSubMenu] = useState(false);
    return (
        <div>
            <li className='sidebar_item '>
                <div className='flex items-center' onClick={() => setIsSubMenu((prev) => !prev)}>
                    {children}
                    <Link className='w-full flex text-[14px]' href=''>{title}</Link>
                    {isSubMenu ? <span><IoIosArrowDropupCircle /></span> : <span><IoIosArrowDropdownCircle /></span>}
                </div>
                {isSubMenu && <ul className='mt-2 pr-2'>

                    {
                        subMenu?.map((sm) =>
                            <li className='bg-header p-2 border-b-[1px] border-b-gray-300'>
                                <Link className='w-full flex text-[12px]' href={sm.url}>{sm?.title}</Link>
                            </li>
                        )
                    }

                    {/* <li className='bg-header p-2 border-b-[1px] border-b-gray-300'>زیر منو 1</li>
                    <li className='bg-header p-2 border-b-[1px] border-b-gray-300'>زیر منو 1</li>
                    <li className='bg-header p-2 border-b-[1px] border-b-gray-300'>زیر منو 1</li> */}

                </ul>}
            </li>
        </div>
    )
}

export default SidebarItem