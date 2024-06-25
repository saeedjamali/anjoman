"use client"

import React, { useEffect, useState } from 'react'
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io'
import { validateNoStd } from "@/utils/auth"

import dynamic from "next/dynamic"
import { toast } from 'react-toastify'
import { toFarsiNumber } from '@/utils/convertnumtopersian'

const Map = dynamic(() => import('@/components/module/Map'), { ssr: false })


function SchoolInformation({ unit, user }) {

    const [provinceName, setProvinceName] = useState(unit.provinceName);
    const [provinceCode, setProvinceCode] = useState(unit.provinceCode);
    const [regionCode, setRegionCode] = useState(unit.regionCode);
    const [regionName, setRegionName] = useState(unit.regionName);
    const [schoolCode, setSchoolCode] = useState(unit.schoolCode);
    const [schoolName, setSchoolName] = useState(unit.schoolName);
    const [schoolType, setSchoolType] = useState(unit.schoolType);
    const [schoolTypeCode, setSchoolTypeCode] = useState(unit.schoolTypeCode);
    const [schoolGrade, setSchoolGrade] = useState(unit.schoolGrade);
    const [schoolGradeCode, setSchoolGradeCode] = useState(unit.schoolGradeCode);
    const [schoolgeo, setSchoolgeo] = useState(unit.schoolgeo);
    const [schoolgender, setSchoolgender] = useState(unit.schoolgender);
    const [schoolClass, setSchoolClass] = useState(unit.schoolClass);
    const [female, setFemale] = useState(unit.female);
    const [male, setMale] = useState(unit.male);
    const [address, setAddress] = useState(unit.schoolAddress);
    const [lng, setLng] = useState(unit.lng || "59.60649396574567");
    const [lat, setLat] = useState(unit.lat || "36.29779692242873");
    const [year, setYear] = useState(unit.year);
    const [isConfirm, setIsConfirm] = useState(unit.isConfirm);
    const [edit, setEdit] = useState(false);
    const [isShowMSchoolInformation, setIsShowSchoolInformation] = useState(false);



    useEffect(() => {
        getAddress();
    }, [lat]);
    const getAddress = async () => {
        try {
            const response = await fetch(
                `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
                {
                    method: "GET",
                    headers: {
                        "Api-Key": "service.74ea7f4d3a0e47f8831623c57f9c3ac9",
                    },
                }
            );
            const data = await response.json();
            if (data.status == "OK") {
                const address = data.formatted_address;
                setAddress(address);
            }
        } catch (error) {
            console.log("error in catch get address-->", error);
        }
    };

    const editHandler = (event) => {
        event.preventDefault();
        setEdit(prev => !prev);
    }


    const submitHandler = async (event) => {
        event.preventDefault();
        if (!validateNoStd(male) || !validateNoStd(female)) {
            toast.error("اطلاعات تعداد دانش آموز بدرستی وارد نشده است");
            return false
        }
        if (!lat) {
            toast.error("موقعیت جغرافیایی بطور دقیق در نقشه مشخص شود");
            return false
        }
        //Update unit in ModirUnit 

        try {

            if (unit.male == male && unit.female == female && unit.lat == lat && unit.lng == lng) {
                toast.info("اطلاعات واحد سازمانی تغییر نکرده است")
                setEdit(false);
                return false
            }
            const response = await fetch(`/api/modirunit/update/${user._id}/${unit._id}`, {
                method: "PUT",
                body: JSON.stringify({
                    male, female, lat, lng, address, schoolCode
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await response.json();
            if (data.status == 200) {
                toast.success(data.message);
                setEdit(false);
                setIsConfirm(0);
                //? بجای رفرش صفحه در فرانت ست کردم / در پایگاه آپدیت شده
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("خطای ناشناخته");
        }

    }

    return (
        <div>
            <div className='w-full border-2 border-slate-100 mt-2 '>
                <div className='flex items-center  bg-slate-100 p-2' onClick={() => setIsShowSchoolInformation(prev => !prev)}>
                    <p className=' w-full flex text-[12px]'>{`  اطلاعات واحد سازمانی ${schoolName}   - سال تحصیلی ${year}`} </p>
                    <span className={isConfirm == 0 ? 'text-orange-500 ' : isConfirm == 1 ? ' text-green-500 ' : 'text-red-500'}>

                        {!isShowMSchoolInformation ?
                            <IoIosArrowDropdownCircle /> : <IoIosArrowDropupCircle />
                        }
                    </span>
                </div>
                {isShowMSchoolInformation &&
                    <div className='w-full p-2'>
                        <form className=''>
                            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24'>نام منطقه</span>
                                    <input className='input-text-information mt-2' value={regionName} disabled type='text' placeholder='منطقه' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24'>نام واحد سازمانی</span>
                                    <input className='input-text-information mt-2' value={schoolName} disabled type='text' placeholder='نام واحد سازمانی' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24'>وضعیت مدرسه</span>
                                    <input className='input-text-information mt-2' value={schoolgeo} disabled type='text' placeholder='وضعیت مدرسه' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24'>جنسیت</span>
                                    <input className='input-text-information mt-2' value={schoolgender} disabled type='text' placeholder='جنسیت' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24'>ماهیت اداره</span>
                                    <input className='input-text-information mt-2' value={schoolType} disabled type='text' placeholder='ماهیت' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24'>دوره تحصیلی</span>
                                    <input className='input-text-information mt-2' value={schoolGrade} disabled type='text' placeholder='دوره تحصیلی' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className={`text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24 ${edit ? 'border-green-300' : ''}`}>تعداد دانش آموزان دختر</span>
                                    <input className={`input-text-information mt-2 ${edit ? 'border-green-300' : ''}`} value={female} name='maleno' type='number' disabled={!edit && true} onChange={() => setFemale(event.target.value)} placeholder='تعداد دانش آموز دختر' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className={`text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24 ${edit ? 'border-green-300' : ''}`}>تعداد دانش آموزان پسر</span>
                                    <input className={`input-text-information mt-2 ${edit ? 'border-green-300' : ''}`} value={male} name='maleno' type='number' disabled={!edit && true} onChange={() => setMale(event.target.value)} placeholder='تعداد دانش آموز پسر' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className={`text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24 ${edit ? 'border-green-300' : ''}`}>موقعیت جغرافیایی</span>
                                    <input className={`input-text-information mt-2 ${edit ? 'border-green-300' : ''}`} name='maleno' type='text' disabled value={`${Number(lng).toFixed(5)} , ${Number(lat).toFixed(5)} `} placeholder='موقعیت جغرافیایی' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2 w-24'>سال تحصیلی</span>
                                    <input className='input-text-information mt-2' value={year} name='maleno' disabled type='text' placeholder='سال تحصیلی' ></input>
                                </div>
                                <div className='relative mt-2 flex justify-end xl:col-span-2 col-span-1'>
                                    <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2 w-24'>آدرس واحد</span>
                                    <input className='input-text-information mt-2' value={address} name='maleno' onChange={(e) => setAddress(e.target.value)} type='text' placeholder='آدرس واحد سازمانی' ></input>
                                </div>
                            </div>
                            <div className='w-full  mt-4 rounded-md bg-green-600 z-10 '>
                                <Map setLat={setLat} setLng={setLng} lng={lng} lat={lat} />
                            </div>
                            <div className='flex items-center justify-end mt-8'>
                                <div className='flex-1'>
                                    {isConfirm == 0 && <span className=' text-[12px] text-orange-500'>وضعیت  : درحال بررسی</span>}
                                    {isConfirm == 1 && <span className=' text-[12px] text-green-500'>وضعیت : تایید شده</span>}
                                    {isConfirm == 2 && <span className=' text-[12px] text-red-500'>وضعیت  : رد شده</span>}
                                </div>
                                <div>
                                    <button className='mt-2 bg-red-500 text-white p-2 rounded-md text-[12px]' onClick={() => editHandler(event)}>ویرایش مشخصات</button>
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

export default SchoolInformation