"use client"

import { valiadtePrsCode } from '@/utils/auth';
import { convertTopersian, toFarsiNumber, traverse } from '@/utils/convertnumtopersian';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io'
import { ToastContainer, toast } from 'react-toastify';



function ModirInformation({ modir }) {

    const { name, phone, prsCode, meliCode, isActive } = modir;
    const [isShowModirInformation, setIsModriInformation] = useState(true);
    const [nameInp, setNameInp] = useState(name)
    const [phoneInp, setPhoneInp] = useState(phone)
    const [prsCodeInp, setPrsCodeInp] = useState(prsCode)
    const [meliCodeInp, setMeliCodeInp] = useState(meliCode)
    const [isActiveState, setIsActiveState] = useState(isActive);
    const [edit, setEdit] = useState(false);
    const [isClient, setIsClient] = useState(false)
    const router = useRouter();

    if (isClient) {
        // Check if document is finally loaded
        traverse(document.getElementsByTagName('body')[0]);
        // localizeNumbers(document.getElementsByTagName('body')[0]);
    }

    useEffect(() => {
        setIsClient(true)
    }, [isShowModirInformation])
    useEffect(() => {

        setNameInp(name);
        setPhoneInp(phone);
        setPrsCodeInp(prsCode);
        setMeliCodeInp(meliCode);

    }, [modir]);

    const editHandler = (event) => {
        event.preventDefault();
        setEdit(prev => !prev);
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        if (!valiadtePrsCode(prsCodeInp)) {
            toast.error("كد پرسنلي معتبر نمي باشد")
            return
        }
        try {
            if (modir.name == nameInp && modir.prsCode == prsCodeInp && modir.meliCode == meliCodeInp) {
                toast.info("اطلاعات پرسنل بدون تغییر باقی ماند")
                setEdit(false);
                return false
            }


            const response = await fetch("/api/modir/update", {
                method: "PUT",
                body: JSON.stringify({
                    user: modir.user, prsCode: prsCodeInp, meliCode: meliCodeInp, name: nameInp
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await response.json();
            if (data.status == 200) {
                toast.success(data.message);
                setEdit(false);
                setIsActiveState(0);
                // location.reload();

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("مجدد وارد شوید");
            router.push("/")

        }

    }
    return (
        <div  >
            <ToastContainer
                bodyClassName={() => " flex-center text-sm font-white  p-3"}
                position="top-left"
                rtl={true}
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className='w-full border-2 border-slate-100 mt-2 '>
                <div className='flex items-center  bg-slate-100 p-2' onClick={() => setIsModriInformation(prev => !prev)}>
                    <span className=' w-full flex text-[12px]'>اطلاعات مدیر</span>
                    <span className={isActiveState == 0 ? 'text-orange-500 ' : isActiveState == 1 ? ' text-green-500 ' : 'text-red-500'}>

                        {!isShowModirInformation ?
                            <IoIosArrowDropdownCircle /> : <IoIosArrowDropupCircle />
                        }
                    </span>

                </div>
                {isShowModirInformation &&
                    <div className='w-full p-2 '>
                        <form >
                            <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24'>نام و نام خانوادگی</span>
                                    <input className={`input-text-information mt-2  ${edit ? 'border-green-300' : ''}`} value={nameInp} onChange={(event) => setNameInp(event.target.value)} disabled={!edit && true} type='text' placeholder='نام و نام خانوادگی' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24'>کد پرسنلی</span>
                                    <input className={`input-text-information mt-2 ${edit ? 'border-green-300' : ''}`} value={prsCodeInp} onChange={(event) => setPrsCodeInp(event.target.value)} disabled={!edit && true} type='text' placeholder='کد پرسنلی' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24'>کد ملی</span>
                                    <input className={`input-text-information mt-2   ${edit ? 'border-green-300' : ''}`} value={meliCodeInp} onChange={(event) => setMeliCodeInp(event.target.value)} disabled={!edit && true} type='text' placeholder='کد ملی' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24'>شماره همراه</span>
                                    <input className='input-text-information mt-2' value={phone} disabled type='text' placeholder='شماره همراه' ></input>
                                </div>

                            </div>

                            <div className='flex items-center justify-end mt-4'>
                                <div className='flex-1'>
                                    {isActiveState == 1 && <span className='font-iranyekan text-[12px] text-green-500'>وضعیت : تایید شده</span>}
                                    {isActiveState == 0 && <span className='font-iranyekan text-[12px] text-orange-500'>وضعیت  : درحال بررسی</span>}
                                    {isActiveState == 2 && <span className='font-iranyekan text-[12px] text-red-500'>وضعیت  : رد شده</span>}
                                </div>
                                <div>
                                    <button className='mt-2 bg-red-500 text-white p-2 rounded-md text-[12px]' onClick={() => editHandler(event)} >ویرایش مشخصات</button>
                                    <button className={`mt-2 ${edit ? ' bg-green-500 ' : 'bg-gray-400'}  text-white p-2 rounded-md text-[12px] mr-2`} disabled={!edit && true} onClick={() => submitHandler(event)}>تایید</button>
                                </div>
                            </div>
                        </form>
                    </div>
                }
            </div >
        </div >
    )
}

export default ModirInformation