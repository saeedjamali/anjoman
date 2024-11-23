"use client"
import Link from 'next/link'
import React from 'react'
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";
import SidebarItem from './SidebarItem';
import { useUserProvider } from '../context/UserProvider';
import { IoMdCloseCircle } from "react-icons/io";
import { AdminIcon, DashboardIcon, FormShirt, ModirIcon, PowerIcon, SchoolBus, SchoolFormDress } from '@/utils/icon';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { MdOutlineDashboard } from "react-icons/md";
import { PiShirtFoldedLight } from "react-icons/pi";
import { BsBusFront } from "react-icons/bs";
import { GiTeacher } from "react-icons/gi";
function Sidebar() {
    const { showSidebar, setShowSideBar,
        user,
        modir,
        units,
        admin,
        region } = useUserProvider();

    // // console.log("first user---->", user)
    // console.log("first modir---->", modir)
    // // console.log("first units---->", units)
    // console.log("first admin---->", admin)
    // // console.log("first region---->", region)
    return (

        <div className={`w-full absolute top-0 right-0   md:relative  h-screen md:w-64 lg:w-80 p-2   ${showSidebar && ' hidden '} z-50 `} >
            <div div className='w-full h-full bg-header overflow-hidden z-10 rounded-md' >
                <div className='h-14 flex-center'>
                    <span className=' text-[12px] text-center'>اداره کل آموزش و پرورش خراسان رضوی</span>
                </div>
                <div className='h-full overflow-y-auto scroll-smooth'>
                    <ul className='p-2  text-[14px] w-full'>

                        <li className='sidebar_item rounded-md'>
                            <div className='flex items-center' >

                                {
                                    user.role == 'modir' && <Link className='w-full flex' href={`/p-modir`}>
                                        <span className='pl-2 flex-center'>
                                            <MdOutlineDashboard />
                                        </span>
                                        داشبورد
                                    </Link>
                                }
                                {
                                    user.role == 'admin' && <Link className='w-full flex' href={`/p-admin`}>
                                        <span className='pl-2 flex-center'>
                                            <MdOutlineDashboard />
                                        </span>
                                        داشبورد
                                    </Link>
                                }
                                {
                                    user.role == 'lecturer' && <Link className='w-full flex' href={`/p-lecturer`}>
                                        <span className='pl-2 flex-center'>
                                            <MdOutlineDashboard />
                                        </span>
                                        داشبورد
                                    </Link>
                                }
                            </div>

                        </li>


                        {admin?.isActive == 1 && user.role == 'admin' && admin.level == 999 &&
                            <div className=''>
                                < SidebarItem title='تنظیمات سیستم' subMenu={[
                                    { title: 'مدیریت کاربران', url: '/p-manager/users' }, //? کل کاربران اعم از مدیر یا ادمین
                                    { title: 'مدیریت مدارس', url: '/p-manager/school' },
                                    { title: 'مدیریت شرکت ها', url: '/p-manager/company' },
                                    { title: 'مدیریت مناطق', url: '/p-manager/region' },
                                    { title: 'مدیریت کارشناسان', url: '/p-manager/admin' }, //? مدیریت جدول ادمین
                                    { title: 'مدیریت منطقه - شرکت', url: '/p-manager/regcompany' },
                                    { title: 'مدیریت محصولات', url: '/p-manager/pricelist' }]}>
                                    <span className='pl-2 flex-center'>
                                        <MdOutlineAdminPanelSettings />
                                    </span>

                                </SidebarItem>
                            </div>

                        }

                        {admin?.isActive == 1 && user.role == 'admin' && (admin.level == 2 || admin.level == 3 || admin.level == 999) &&
                            <SidebarItem title='پنل مدیریتی ستادی' subMenu={[
                                { title: 'مدیریت کارشناسان', url: '/p-admin/admin' }, //? مدیریت کارشناسان در استان و ستاد
                                { title: 'مدیریت کاربران', url: '/p-admin/users' }, //? مدیریت کاربران با نقش مدیر برحسب منطقه - استان
                                { title: 'تایید مدیران', url: '/p-admin/modirs' },
                                { title: 'تایید مدیر - مدرسه', url: '/p-admin/modirunits' }]} >
                                <span className='pl-2 flex-center'>
                                    <GrUserManager />
                                </span>
                            </SidebarItem>

                        }
                        {admin?.isActive == 1 && user.role == 'admin' && admin.level == 1 &&
                            <SidebarItem title='پنل مدیریتی منطقه' subMenu={[
                                { title: 'مدیریت کاربران', url: '/p-admin/users' }, //? مدیریت کاربران با نقش مدیر برحسب منطقه - استان
                                { title: 'تایید مدیران', url: '/p-admin/modirs' },
                                { title: 'تایید مدیر - مدرسه', url: '/p-admin/modirunits' }]} >
                                <span className='pl-2 flex-center'>
                                    <GrUserManager />
                                </span>
                            </SidebarItem>
                        }
                        
                        {
                            admin?.isActive == 1 && user.role == "admin" && (admin.level == 1 || admin.level == 2 || admin.level == 3 || admin.level == 11 || admin.level == 999) &&
                            <SidebarItem title='لباس فرم' subMenu={[{ title: 'تایید قرارداد', url: '/p-admin/contract' }]} >
                                <span className='pl-2 flex-center'>
                                    <PiShirtFoldedLight />
                                </span>
                            </SidebarItem>
                        }
                        {
                            admin?.isActive == 1 && user.role == "admin" && (admin.level == 2 || admin.level == 3 || admin.level == 999) &&
                            <SidebarItem title='مدرس آموزش خانواده' subMenu={[{ title: 'درخواست ها', url: '/p-admin/lecturer' }]} >
                                <span className='pl-2 flex-center'>
                                    <GiTeacher />
                                </span>
                            </SidebarItem>
                        }
                        {
                            // modir?.isActive == 1 && user.role == "modir" &&
                            user.role == "modir" &&
                            <SidebarItem title='لباس فرم' subMenu={[{ title: 'قرارداد', url: '/p-modir/uniform/contract' }]}
                            >
                                <span className='pl-2 flex-center'>
                                    <PiShirtFoldedLight />

                                </span>
                            </SidebarItem>
                        }
                        {/* {modir?.isActive == 1 && user.role == "modir" &&
                            <SidebarItem title='سرویس مدارس' subMenu={[{ title: 'قرارداد', url: '/p-modir' }]} >
                                <span className='pl-2 flex-center'>
                                    <BsBusFront />

                                </span>
                            </SidebarItem>

                        } */}
                        {modir?.isActive == 1 && modir?.role == "modir" &&
                            <SidebarItem title='دوره های آمورشی' subMenu={[{ title: 'قرارداد', url: '/p-modir' }, { title: 'شرکت ها', url: '/p-modir' }]} />

                        }
                    </ul>
                </div>
            </div >


            {!showSidebar && <span className='flex-center   rounded-full absolute bottom-20 right-[46%] md:hidden' onClick={() => setShowSideBar(true)}><IoMdCloseCircle className='w-12 h-12 text-gray-600' /></span>}
        </div>
    )
}

export default Sidebar