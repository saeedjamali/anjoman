"use client"

import { useUserProvider } from '@/components/context/UserProvider';
import { valiadtePrsCode } from '@/utils/auth';
import { generalCondition } from '@/utils/constants';
import { convertTopersian, traverse } from '@/utils/convertnumtopersian';
import { CheckIcon, NotificationIcon } from '@/utils/icon';
import { Autocomplete, AutocompleteItem, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Divider, Image, Input, Link, Radio, RadioGroup } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io'
import { ToastContainer, toast } from 'react-toastify';
import PublicCondition from './PublicCondition';
import ImageUploader from '@/components/module/uploader/ImageUploader';

const maxFileSize = 1000000; //100KB
const acceptType = "jpg";

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
    const [province, setProvince] = useState({});
    const [region, setRegion] = useState({});
    const [cityName, setCityName] = useState("");
    const [degree, setDegree] = useState(0);
    const [field, setField] = useState({});
    const [isCertificateBefore, setIsCertificateBefore] = useState(false);
    const [age, setAge] = useState(null);
    const [isAccepted, setIsAccepted] = useState(null);
    const [status, setStatus] = useState(0);
    const [degreeDoc, setDegreeDoc] = useState([]);
    const [introDoc, setIntroDoc] = useState([]);
    const [certificateDoc, setCertificateDoc] = useState([]);


    //? Status
    const [isNewRegister, setIsNewRegister] = useState(false);
    const [isGeneralCondition, setIsGeneralCondition] = useState(false);
    const [isPersonalInformation, setIsPersonalInformation] = useState(false);
    const [isUploadedDocument, setIsUploadedDocument] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    //? Provinces , Region , Field , Degree
    const [provinces, setProvinces] = useState([]);
    const [regions, setRegions] = useState([]);
    const [fields, setFields] = useState([]);
    const [degrees, setDegrees] = useState([]);


    useEffect(() => {

        setPhoneInp(phone);
        setMeliCode(identifier);

        const getHistory = async () => {
            try {
                const response = await fetch(`/api/lecturer/${phone}`);
                const data = await response.json();
                console.log(data)
                if (data.status == 200) {
                    setHistory(data.lectureFound);
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


    useEffect(() => {
        getRegions(province);
        if (!province) {
            setRegions([])

        }
    }, [province])

    const getProvinces = async () => {
        try {
            const response = await fetch(`/api/base/province/getall`);
            const data = await response.json();

            if (data.status == 200) {
                setProvinces(data.provinces.sort((a, b) => a.code - b.code));
            } else {
                toast.info(data.message)
            }
        } catch (error) {
            toast.error("خطای ناشناخته")
        }
    }
    const getFields = async () => {
        try {
            const response = await fetch(`/api/base/field/getall/`);
            const data = await response.json();
            console.log(data)
            if (data.status == 200) {
                setFields(data.fields);
            } else {
                toast.info(data.message)
            }
        } catch (error) {
            toast.error("خطای ناشناخته")
        }
    }

    const getDegrees = async () => {
        try {
            const response = await fetch(`/api/base/degree/getall/`);
            const data = await response.json();
            console.log(data)
            if (data.status == 200) {
                setDegrees(data.degrees);
            } else {
                toast.info(data.message)
            }
        } catch (error) {
            toast.error("خطای ناشناخته")
        }
    }

    const getRegions = async (provinceCode) => {
        try {
            const response = await fetch(`/api/region/province/${provinceCode}`);
            const data = await response.json();

            if (data.status == 200) {
                setRegions(data.regions.sort((a, b) => a.regionCode - b.regionCode));
            } else {
                console.log(data.message)
            }
        } catch (error) {
            toast.error("خطای ناشناخته")
        }
    }

    const submitHandler = () => {
        setIsLoading(true);
        if (currentYearHistory.length != 0) {
            toast.info("شما قبلا ثبت نام نموده اید، از قسمت تاریخچه امکان مشاهده سوابق ثبت نام وجود دارد ")
        }
        getProvinces();
        getFields();
        getDegrees();
        setIsNewRegister(true);
        setIsGeneralCondition(false)
        setIsLoading(false);
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

    const submitUpdatedDocument = () => {
        setIsPersonalInformation(false);
        setIsUploadedDocument(false)
    }
    const onChangeDegreeDoc = (imageList, addUpdateIndex) => {
        // data for submit
        if (imageList.length > 1) {
            toast.info("صرفا امکان بارگذاری یک تصویر وجود دارد");
        }
        setDegreeDoc(imageList);
    };


    const onChangeIntroDoc = (imageList, addUpdateIndex) => {
        // data for submit
        if (imageList.length > 1) {
            toast.info("صرفا امکان بارگذاری یک تصویر وجود دارد");
        }
        setIntroDoc(imageList);
    };

    const onChangeCertificateDoc = (imageList, addUpdateIndex) => {
        // data for submit
        if (imageList.length > 1) {
            toast.info("صرفا امکان بارگذاری یک تصویر وجود دارد");
        }
        setCertificateDoc(imageList);
    };


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
                                    <Button isLoading={isLoading} className={`mt-2  bg-blue-600  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitHandler(event)}>ثبت نام مدرسین</Button>
                                </div>
                            </div>
                        }
                        <div className='flex flex-col justify-start mt-4'>
                            {/* //? بررسی شرایط عمومی */}
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

                            {/* //? ثبت مشخصات فردی */}
                            {
                                isGeneralCondition &&
                                <Card className='my-4'>
                                    <CardHeader className="flex gap-3 bg-blue-500 text-white">
                                        <p className="text-lg ">ثبت مشخصات فردی</p>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody >
                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                <Input
                                                    disabled={isPersonalInformation}
                                                    type="text"
                                                    label="نام و نام خانوادگی"
                                                    labelPlacement={"inside"}
                                                    value={name} onChange={(event) => setName(event.target.value)} ></Input>
                                            </div>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                <Input
                                                    disabled={isPersonalInformation}
                                                    type="number"
                                                    label="کد ملی"
                                                    labelPlacement={"inside"}
                                                    value={meliCode} onChange={(event) => setMeliCode(event.target.value)} ></Input>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                <Input
                                                    disabled={isPersonalInformation}
                                                    type="number"
                                                    label="سن"
                                                    labelPlacement={"inside"}
                                                    value={age} onChange={(event) => setAge(event.target.value)} ></Input>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                    <RadioGroup
                                                        isDisabled={isPersonalInformation}
                                                        className='flex-1 justify-start items-start p-2 text-[14px]'
                                                        label="وضعیت اشتغال"
                                                        orientation="horizontal"
                                                        value={occuptionState}
                                                        onValueChange={setOccuptionState}
                                                    >
                                                        <Radio value="1" size="sm">شاغل</Radio>
                                                        <Radio value="2" size="sm">بازنشسته</Radio>


                                                    </RadioGroup>
                                                </div>
                                            </div>
                                            <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                    <RadioGroup
                                                        isDisabled={isPersonalInformation}
                                                        className='flex-1 justify-start items-start p-2 text-[14px]'
                                                        label="سازمان محل خدمت"
                                                        orientation="horizontal"
                                                        value={organ}
                                                        onValueChange={setOrgan}
                                                    >
                                                        <Radio value="1" size="sm">آموزش و پرورش</Radio>
                                                        <Radio value="2" size="sm">دانشگاه(عضو هیئت علمی می باشم)</Radio>
                                                        <Radio value="3" size="sm">حوزه علمیه</Radio>


                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            {organ == 1 ?

                                                <div className='relative mt-2 flex justify-start col-span-1'>
                                                    {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                    <Input
                                                        disabled={isPersonalInformation}
                                                        type="number"
                                                        label="کد پرسنلی"
                                                        labelPlacement={"inside"}
                                                        value={prsCode} onChange={(event) => setPrsCode(event.target.value)} ></Input>
                                                </div>
                                                : organ == 2 ?
                                                    <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                        <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                            <RadioGroup
                                                                isDisabled={isPersonalInformation}
                                                                className='flex-1 justify-start items-start p-2 text-[14px]'
                                                                label="رتبه دانشگاهی"
                                                                orientation="horizontal"
                                                                value={typeAcademic}
                                                                onValueChange={setTypeAcademic}
                                                            >
                                                                <Radio value="1" size="sm">استادیار</Radio>
                                                                <Radio value="2" size="sm">دانشیار</Radio>

                                                            </RadioGroup>
                                                        </div>
                                                    </div> : null

                                            }
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                <Autocomplete
                                                    isDisabled={isPersonalInformation}
                                                    labelPlacement={"inline"}
                                                    backdrop="blur"
                                                    isRequired
                                                    size='md'
                                                    color="default"
                                                    errorMessage="انتخاب استان"
                                                    // label="استان"
                                                    placeholder='استان'
                                                    className="col-span-1"
                                                    defaultItems={provinces}
                                                    selectedKey={province}

                                                    onSelectionChange={async (key) => {
                                                        setProvince(key);

                                                        // console.log(key)

                                                    }}
                                                >
                                                    {(item) => (
                                                        <AutocompleteItem key={item.code}>
                                                            {item.name}
                                                        </AutocompleteItem>
                                                    )}
                                                </Autocomplete>

                                            </div>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                <Autocomplete
                                                    isDisabled={isPersonalInformation}
                                                    labelPlacement={"inline"}
                                                    backdrop="blur"
                                                    isRequired
                                                    size='md'
                                                    color="default"
                                                    errorMessage='انتخاب منطقه'
                                                    placeholder='منطقه'
                                                    className=" col-span-1"
                                                    defaultItems={regions}
                                                    selectedKey={region}
                                                    onSelectionChange={async (key) => {
                                                        setRegion(key);

                                                        // console.log(key)

                                                    }}
                                                >
                                                    {(item) => (
                                                        <AutocompleteItem key={item.regionCode}>
                                                            {item.regionName}
                                                        </AutocompleteItem>
                                                    )}
                                                </Autocomplete>

                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            <div className='relative mt-2 flex justify-start items-start text-right col-span-1'>
                                                <Autocomplete
                                                isDisabled={isPersonalInformation}
                                                    labelPlacement={"inline"}
                                                    backdrop="blur"
                                                    isRequired
                                                    size='md'
                                                    color="default"
                                                    errorMessage='انتخاب مدرک تحصیلی'
                                                    placeholder='مدرک تحصیلی'
                                                    className=" col-span-1"
                                                    defaultItems={degrees}
                                                    selectedKey={degree}
                                                    onSelectionChange={async (key) => {
                                                        setDegree(key);

                                                        // console.log(key)

                                                    }}
                                                >
                                                    {(item) => (
                                                        <AutocompleteItem key={item.code}>
                                                            {item.name}
                                                        </AutocompleteItem>
                                                    )}
                                                </Autocomplete>

                                            </div>
                                            <div className='relative mt-2 flex justify-start items-start text-right col-span-1'>
                                                <Autocomplete
                                                isDisabled={isPersonalInformation}
                                                    labelPlacement={"inline"}
                                                    backdrop="blur"
                                                    isRequired
                                                    size='md'
                                                    color="default"
                                                    errorMessage='انتخاب رشته تحصیلی'
                                                    placeholder='رشته تحصیلی'
                                                    className=" col-span-1"
                                                    defaultItems={fields}
                                                    selectedKey={field}
                                                    onSelectionChange={async (key) => {
                                                        setField(key);

                                                        // console.log(key)

                                                    }}
                                                >
                                                    {(item) => (
                                                        <AutocompleteItem key={item.code}>
                                                            {item.name}
                                                        </AutocompleteItem>
                                                    )}
                                                </Autocomplete>

                                            </div>
                                        </div>

                                        <div className='relative mt-2  flex justify-start items-start text-right col-span-2'>
                                            <Checkbox isDisabled={isPersonalInformation} size='sm' isSelected={isCertificateBefore} onValueChange={setIsCertificateBefore} radius="md">دارای گواهی نامه مدرسی آموزش خانواده(در سنوات قبل) می باشم.</Checkbox>
                                        </div>
                                        <div className='relative mt-2  flex justify-start items-start text-right col-span-2'>
                                            <Checkbox isDisabled={isPersonalInformation} size='sm' isSelected={isAccepted} onValueChange={setIsAccepted} radius="md">دارای مدرک دکتری در آموزش و پرورش و یا عضو هیئت علمی در دانشگاه با رتبه استادیار یا دانشیار یا سطح چهار تخصصی حوزه های علمیه می باشم. </Checkbox>
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
                            {/* //? بارگذاری مدارک مورد نیاز */}
                            {
                                isPersonalInformation &&
                                <Card className='my-4'>
                                    <CardHeader className="flex gap-3 bg-blue-500 text-white">
                                        <p className="text-lg ">بارگذاری مدارک مورد نیاز</p>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody className='text-[12px] items-start gap-y-4'>
                                        <div className='w-full  relative mt-2 flex justify-between item-center col-span-2'>
                                            <div className='flex-center text-[14px]'>بارگذاری تصویر مدرک تحصیلی</div>
                                            <div className="gap-2">
                                                <ImageUploader
                                                    imageItems={degreeDoc}
                                                    onChange={onChangeDegreeDoc}
                                                    maxNumber={1}
                                                    acceptType={acceptType}
                                                    maxFileSize={maxFileSize}
                                                    user={user}

                                                />
                                            </div>

                                        </div>

                                        <div className='w-full  relative mt-2 flex justify-between item-center col-span-2'>
                                            <div className='flex-center text-[14px]'>بارگذاری معرفی نامه معتبر از دانشگاه یا حوزه علمیه</div>
                                            <div className="gap-2">
                                                <ImageUploader
                                                    imageItems={introDoc}
                                                    onChange={onChangeIntroDoc}
                                                    maxNumber={1}
                                                    acceptType={acceptType}
                                                    maxFileSize={maxFileSize}
                                                    user={user}

                                                />
                                            </div>

                                        </div>
                                        <div className='w-full  relative mt-2 flex justify-between item-center col-span-2'>
                                            <div className='flex-center text-[14px]'>بارگذاری تصویر گواهی نامه مدرسی آموزشی خانواده سنوات قبل</div>
                                            <div className="gap-2">
                                                <ImageUploader
                                                    imageItems={certificateDoc}
                                                    onChange={onChangeCertificateDoc}
                                                    maxNumber={1}
                                                    acceptType={acceptType}
                                                    maxFileSize={maxFileSize}
                                                    user={user}

                                                />
                                            </div>

                                        </div>


                                    </CardBody>
                                    <Divider />
                                    {
                                        !isUploadedDocument &&

                                        <CardFooter className='flex items-end justify-end'>
                                            <Button className={`mt-2  bg-gray-500  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitUpdatedDocument(event)}>بازگشت به مرحله قبل</Button>
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