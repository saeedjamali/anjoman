"use client"

import { useUserProvider } from '@/components/context/UserProvider';
import { valiadtePrsCode } from '@/utils/auth';
import { generalCondition } from '@/utils/constants';
import { convertTopersian, traverse } from '@/utils/convertnumtopersian';
import { CheckIcon, NotificationIcon } from '@/utils/icon';
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Image, Input, Link } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io'
import { ToastContainer, toast } from 'react-toastify';
import PublicCondition from './PublicCondition';



function LectureInformation() {
    const { user } = useUserProvider();
    const { phone, identifier, isActive, isBan } = user;
    const [history, setHistory] = useState([]);
    const [currentYearHistory, setCurrentYearHistory] = useState(null);
    const [year, setYear] = useState("1403-1404");
    const [name, setName] = useState("");
    const [phoneInp, setPhoneInp] = useState(phone);
    const [prsCode, setPrsCode] = useState("");
    const [meliCode, setMeliCode] = useState(identifier);
    const [occuptionState, setOccuptionState] = useState(0);
    const [organ, setOrgan] = useState(0);
    const [isAcademic, setOsAcademic] = useState(null);
    const [typeAcademic, setTypeAcademic] = useState(0);
    const [introDoc, setIntroDoc] = useState("");
    const [province, setProvince] = useState({});
    const [Region, setRegion] = useState({});
    const [cityName, setCityName] = useState("");
    const [degree, setDegree] = useState(0);
    const [field, setField] = useState({});
    const [degreeDoc, setDegreeDoc] = useState({});
    const [isCertificateBefore, setIsCertificateBefore] = useState(false);
    const [certificateDoc, setCertificateDoc] = useState("");
    const [age, setAge] = useState(null);
    const [isAccepted, setIsAccepted] = useState(null);
    const [status, setStatus] = useState(0);

    //? Status
    const [isNewRegister, setIsNewRegister] = useState(false);
    const [isGeneralCondition, setIsGeneralCondition] = useState(false);
    const [isPersonalInformation, setIsPersonalInformation] = useState(false);
    const [isUploadedDocument, setIsUploadedDocument] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        setPhoneInp(phone);
        setMeliCode(identifier);

        const getHistory = async () => {
            try {
                const response = await fetch(`/api/lecturer/${phone}`);
                const data = await response.json();
                console.log(data)
                if (data.status == 200) {
                    setHistory(lectureFound);
                } else {
                    toast.info(data.message)
                }
            } catch (error) {
                toast.error("خطای ناشناخته")
            }
        }

        getHistory();

        setCurrentYearHistory(history.filter(item => item.year == year));
    }, [phone]);


    const submitHandler = () => {
        if (currentYearHistory.length != 0) {
            toast.info("شما قبلا ثبت نام نموده اید، از قسمت تاریخچه امکان مشاهده سوابق ثبت نام وجود دارد ")
        }
        setIsNewRegister(true);
        setIsGeneralCondition(false)
    }

    const submitGeneralCondition = () => {
        setIsGeneralCondition(true);
    }
    const submitPersonalInfoation = () => {
        setIsPersonalInformation(true);
    }

    const submitUploadedDocument = () => {
        setIsUploadedDocument(true);
    }

    return (
        <div >
            <ToastContainer
                bodyClassName={() => " flex-center text-sm font-white font-iranyekan p-3"}
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
                    <span className=' w-full flex text-[12px]'>اطلاعات مدرس</span>

                    {/* <span className={isActive == 0 ? 'text-orange-500 ' : isActive == 1 ? ' text-green-500 ' : 'text-red-500'}>
                        {!isShowAdminInformation ?
                            <IoIosArrowDropdownCircle /> : <IoIosArrowDropupCircle />
                        }
                    </span> */}
                </div>

                <div className='w-full p-2'>
                    <form >
                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>

                            <div className='relative mt-2 flex justify-end col-span-1'>
                                {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                <Input
                                    type="number"
                                    label="کد ملی"
                                    labelPlacement={"inside"}
                                    value={meliCode} onChange={(event) => setMeliCode(event.target.value)} placeholder='کد ملی' ></Input>
                            </div>
                            <div className='relative mt-2 flex justify-end col-span-1'>
                                {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                <Input
                                    type="number"
                                    label="شماره همراه"
                                    labelPlacement={"inside"}
                                    value={phone} onChange={(event) => setPhoneInp(event.target.value)} placeholder='شماره تماس' ></Input>
                            </div>


                        </div>

                        {!isNewRegister &&
                            <div className='flex items-center justify-end mt-4'>
                                <div className='flex-1'>
                                    {currentYearHistory?.length != 0 && <span className='font-iranyekan text-[12px] text-green-500'>{`ثبت نام فعال برای سال تحصیلی ${year} دارید.`}</span>}
                                </div>
                                <div>
                                    {/* <button className='mt-2 bg-red-500 text-white p-2 rounded-md text-[12px]' onClick={() => editHandler(event)} >ویرایش مشخصات</button> */}
                                    <Button className={`mt-2  bg-blue-600  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitHandler(event)}>ثبت نام مدرسین</Button>
                                </div>
                            </div>
                        }
                        <div className='flex flex-col justify-start mt-4'>
                            {isNewRegister &&
                                <Card >
                                    <CardHeader className="flex gap-3 bg-blue-500 text-white">
                                        <p className="text-md ">شرایط عمومی</p>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody className='text-[12px] items-start gap-y-4'>
                                        {
                                            generalCondition.map(item =>
                                                <PublicCondition isGeneralCondition={isGeneralCondition} condition={item} />
                                            )
                                        }


                                    </CardBody>
                                    <Divider />
                                    {
                                        !isGeneralCondition &&

                                        <CardFooter className='flex items-end justify-end'>
                                            <Button className={`mt-2  bg-blue-500  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitGeneralCondition(event)}>تایید شرایط عمومی</Button>

                                        </CardFooter>
                                    }
                                </Card>

                            }

                            {
                                isGeneralCondition &&
                                <Card className='my-4'>
                                    <CardHeader className="flex gap-3 bg-blue-500 text-white">
                                        <p className="text-lg ">ثبت مشخصات فردی</p>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody className='text-[12px] items-start gap-y-4'>
                                        <div className='relative mt-2 flex justify-end col-span-1'>
                                            {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                            <Input
                                                type="number"
                                                label="کد ملی"
                                                labelPlacement={"inside"}
                                                value={meliCode} onChange={(event) => setMeliCode(event.target.value)} placeholder='کد ملی' ></Input>
                                        </div>
                                        <div className='relative mt-2 flex justify-end col-span-1'>
                                            {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                            <Input
                                                type="number"
                                                label="شماره همراه"
                                                labelPlacement={"inside"}
                                                value={phone} onChange={(event) => setPhoneInp(event.target.value)} placeholder='شماره تماس' ></Input>
                                        </div>

                                    </CardBody>
                                    <Divider />
                                    {
                                        !isPersonalInformation &&

                                        <CardFooter className='flex items-end justify-end'>
                                            <Button className={`mt-2  bg-blue-600  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitPersonalInfoation(event)}>تایید مشخصات فردی</Button>

                                        </CardFooter>
                                    }
                                </Card>
                            }

                            {
                                isPersonalInformation &&
                                <Card className='my-4'>
                                    <CardHeader className="flex gap-3 bg-blue-500 text-white">
                                        <p className="text-lg ">بارگذاری مدارک مورد نیاز</p>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody className='text-[12px] items-start gap-y-4'>
                                        {
                                            generalCondition.map(item =>
                                                <PublicCondition isGeneralCondition={isGeneralCondition} condition={item} />
                                            )
                                        }


                                    </CardBody>
                                    <Divider />
                                    {
                                        !isUploadedDocument &&

                                        <CardFooter className='flex items-end justify-end'>
                                            <Button isLoading={isLoading} className={`mt-2  bg-green-500  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitUploadedDocument(event)}>تایید نهایی</Button>

                                        </CardFooter>
                                    }
                                </Card>
                            }
                        </div>
                    </form>
                </div>

            </div >
        </div >
    )
}

export default LectureInformation