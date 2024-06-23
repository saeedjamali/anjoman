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
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";

const maxFileSize = 1000000; //100KB
const acceptType = "jpg";

function LectureInformation() {
    const { user } = useUserProvider();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [action, setAction] = useState(0); //? 1 : submit   ---- 2 : payment
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
    const [isAcademic, setOsAcademic] = useState(false);
    const [typeAcademic, setTypeAcademic] = useState(0);
    const [province, setProvince] = useState(null);
    const [region, setRegion] = useState(null);
    const [degree, setDegree] = useState(0);
    const [field, setField] = useState(0);
    const [provinceObj, setProvinceObj] = useState(null);
    const [regionObj, setRegionObj] = useState(null);
    const [degreeObj, setDegreeObj] = useState(null);
    const [fieldObj, setFieldObj] = useState(null);

    const [cityName, setCityName] = useState("");
    const [isCertificateBefore, setIsCertificateBefore] = useState(false);
    const [age, setAge] = useState(0);
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
    const [notCompletePersonalInformation, setNotCompletePersonalInformatio] = useState(true);
    const [error, setError] = useState([]);
    //? Provinces , Region , Field , Degree
    const [provinces, setProvinces] = useState([]);
    const [regions, setRegions] = useState([]);
    const [fields, setFields] = useState([]);
    const [degrees, setDegrees] = useState([]);


    useEffect(() => {

        setPhoneInp(phone);
        setMeliCode(identifier);
        setYear("1403-1404");

        const getHistory = async () => {
            try {
                const response = await fetch(`/api/lecturer/${phone}`);
                const data = await response.json();
                console.log(data)
                if (data.status == 200) {
                    setHistory(data.lectureFound);
                    console.log("year--->", year)
                    setCurrentYearHistory([...data.lectureFound]?.filter(item => item.year == year));
                } else {

                    toast.info(data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error("خطای ناشناخته")
            }
        }

        getHistory();

    }, [phone]);


    useEffect(() => {
        getRegions(province);
        // setRegions(prev => [...regions, { regionCode: 1, regionName: ' مقدس' }])

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
                data.regions.push({ regionCode: 1, regionName: 'مشهد مقدس', provinceCode: 16, provinceName: 'خراسان رضوی' })
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
        let str = [];
        console.log("name--->", name)
        if (!name) {
            str.push('نام خانوادگی تکمیل شود');
            setNotCompletePersonalInformatio(true)

        }
        console.log("name organ--->", organ)
        if (organ == 0) {
            str.push('محل خدمت مشخص شود')
            setNotCompletePersonalInformatio(true)
        }

        console.log("name organ--->", prsCode)

        if (organ == 1 && !valiadtePrsCode(prsCode)) {
            str.push('کد پرسنلی با دقت تکمیل شود')
            setNotCompletePersonalInformatio(true)
        }
        if (organ == 2 && !typeAcademic) {
            str.push('مرتبه دانشگاهی مشخص شود');
            setNotCompletePersonalInformatio(true)
        }

        if (!age) {
            str.push('سن وارد شود');
            setNotCompletePersonalInformatio(true)
        }

        console.log("name age--->", age)

        if (age < 30) {
            str.push('حداقل شرط سنی رعایت نشده است')
            setNotCompletePersonalInformatio(true)
        }

        if (occuptionState == 0) {
            str.push('وضعیت اشتغال مشخص شود')
            setNotCompletePersonalInformatio(true)
        }

        console.log("name province--->", province)
        if (!province) {
            str.push('استان مشخص شود')
            setNotCompletePersonalInformatio(true)
        }
        console.log("name region--->", region)
        if (!region) {
            str.push('منطقه مشخص شود')
            setNotCompletePersonalInformatio(true)
        }
        if (!degree) {
            str.push('مدرك مشخص شود')
            setNotCompletePersonalInformatio(true)
        }
        if (!field) {
            str.push('رشته تحصيلي مشخص شود')
            setNotCompletePersonalInformatio(true)
        }
        console.log("name------>", str)
        setError(str)
        if (str.length == 0) {
            setNotCompletePersonalInformatio(false)
            setIsPersonalInformation(true);
        }
        // if (!notCompletePersonalInformation) {
        //     setIsPersonalInformation(true);
        // }
    }

    const submitDocument = () => {
        // console.log("hhooooo", degreeDoc)
        // console.log("hhooooo", introDoc)
        // console.log("hhooooo", certificateDoc)
        let str = [];
        if (degreeDoc.length == 0) {
            str.push('تصوير مربوط به مدرك تحصيلي بارگذاري نشده است')
        }
        if (introDoc.length == 0 && (organ == 2 || organ == 3)) {
            str.push('تصوير معرفي نامه بارگذاري نشده است')
        }
        if (certificateDoc.length == 0 && isCertificateBefore) {
            str.push('تصوير گواهي مدرسي سنوات قبل بارگذاري نشده است')
        }
        setError(str);
        if (str.length == 0 && (isAccepted || isCertificateBefore)) {
            setAction(1);
            onOpen()
        } else if (str.length == 0 && !isAccepted && !isCertificateBefore) {
            setAction(2)
            onOpen()
        }
        // هsetIsUploadedDocument(true);
    }



    const submitUpdatedDocument = () => {
        setNotCompletePersonalInformatio(true)
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
            return
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

    const registerLecturer = async () => {
        setIsLoading(true);


        console.log("info province-->", provinceObj)
        console.log("info province region-->", regionObj)
        console.log("info degree-->", degreeObj)
        console.log("info field-->", fieldObj)
        try {
            const formData = new FormData();
            for (const image of introDoc) {
                formData.append("introDoc", image.file);
            }
            for (const image of degreeDoc) {
                formData.append("degreeDoc", image.file);
            }
            for (const image of certificateDoc) {
                formData.append("certificateDoc", image.file);
            }

            formData.append("year", year);
            formData.append("name", name);
            formData.append("phone", phone);
            formData.append("prsCode", prsCode);
            formData.append("meliCode", meliCode);
            formData.append("occuptionState", occuptionState);
            formData.append("organ", organ);
            formData.append("isAcademic", isAcademic);
            formData.append("typeAcademic", typeAcademic);
            formData.append("isCertificateBefore", isCertificateBefore);
            formData.append("age", age);
            formData.append("isAccepted", isAccepted);
            formData.append("user", user._id);
            formData.append("status", status);
            formData.append("payment", action);
            formData.append("province", JSON.stringify(provinceObj));
            formData.append("region", JSON.stringify(regionObj));
            formData.append("degree", JSON.stringify(degreeObj));
            formData.append("field", JSON.stringify(fieldObj))
            console.log("introDoc", introDoc)
            console.log("degreeDoc", degreeDoc)
            console.log("certificateDoc", certificateDoc)


            const res = await fetch("/api/lecturer/register", {
                method: "POST",
                header: { "Content-Type": "multipart/form-data" },
                body: formData,
            });
            const data = await res.json();
            if (data.status == 201) {
                toast.success(data.message);
                onClose();
                location.reload();
            } else {
                toast.info(data.message);
            }


        } catch (error) {
            console.log("error in catch add lecturer -> ", error);
            toast.error("خطای ناشناخته");
        }
        setIsLoading(false);
    }
    console.log("currentYearHistory", currentYearHistory)
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
                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-2'>

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
                                                    tabIndex={1}
                                                    disabled={isPersonalInformation}
                                                    type="text"
                                                    size='md'
                                                    label="نام و نام خانوادگی"
                                                    labelPlacement={"inside"}
                                                    value={name} onChange={(event) => setName(event.target.value)} ></Input>
                                            </div>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                <Input
                                                    tabIndex={2}
                                                    disabled={true}
                                                    size='md'
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

                                                    disabled={true}
                                                    type="text"
                                                    label="سال تحصیلی"
                                                    size='md'
                                                    labelPlacement={"inside"}
                                                    value={year} ></Input>
                                            </div>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                <Input
                                                    tabIndex={3}
                                                    disabled={isPersonalInformation}
                                                    type="number"
                                                    label="سن"
                                                    size='md'
                                                    labelPlacement={"inside"}
                                                    value={age} onChange={(event) => setAge(event.target.value)} ></Input>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                    <RadioGroup
                                                        tabIndex={4}
                                                        isDisabled={isPersonalInformation}
                                                        className='flex justify-between items-start p-2 text-[14px]'
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
                                                        tabIndex={5}
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
                                                        tabIndex={6}
                                                        disabled={isPersonalInformation}
                                                        type="number"
                                                        size='md'
                                                        label="کد پرسنلی"
                                                        labelPlacement={"inside"}
                                                        value={prsCode} onChange={(event) => setPrsCode(event.target.value)} ></Input>
                                                </div>
                                                : organ == 2 ?
                                                    <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                        <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                            <RadioGroup
                                                                tabIndex={7}
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
                                        <div className='grid grid-cols-1 md:grid-cols-2 mt-2  md:gap-4'>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                <Autocomplete
                                                    tabIndex={8}
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
                                                        setProvinceObj(provinces.filter(item => item.code == key)[0])

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
                                                    tabIndex={9}
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
                                                        setRegionObj(regions.filter(item => item.regionCode == key)[0])
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
                                        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
                                            <div className='relative mt-2 flex justify-start items-start text-right col-span-1'>
                                                <Autocomplete
                                                    tabIndex={10}
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
                                                        setDegreeObj(degrees.filter(item => item.code == key)[0])
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
                                                    tabIndex={11}
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
                                                        setFieldObj(fields.filter(item => item.code == key)[0])
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
                                            <Checkbox tabIndex={12} isDisabled={isPersonalInformation} size='sm' isSelected={isCertificateBefore} onValueChange={setIsCertificateBefore} radius="md">دارای گواهی نامه مدرسی آموزش خانواده(در سنوات قبل) می باشم.</Checkbox>
                                        </div>
                                        <div className='relative mt-2  flex justify-start items-start text-right col-span-2'>
                                            <Checkbox tabIndex={13} isDisabled={isPersonalInformation} size='sm' isSelected={isAccepted} onValueChange={setIsAccepted} radius="md">دارای مدرک دکتری در آموزش و پرورش و یا عضو هیئت علمی در دانشگاه با رتبه استادیار یا دانشیار یا سطح چهار تخصصی حوزه های علمیه می باشم. </Checkbox>
                                        </div>

                                    </CardBody>
                                    <Divider />
                                    {
                                        !isPersonalInformation &&

                                        <CardFooter className='flex items-center justify-between'>
                                            <div className='gap-2  space-y-1 items-start text-[12px] text-right'>
                                                {
                                                    error.map(item =>
                                                        <Chip className='text-red-500 text-[12px] ml-1 mt-1' endContent={<NotificationIcon className={'text-red-800'} size={12} />} >{item}</Chip>
                                                    )
                                                }

                                            </div>
                                            <Button tabIndex={14} className={`w-48 bg-blue-600  text-white rounded-md text-[12px]`} onClick={() => submitPersonalInfoation(event)}>تایید مشخصات فردی</Button>

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

                                        {(organ == 2 || organ == 3) &&
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
                                        }
                                        {
                                            isCertificateBefore &&
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
                                        }


                                    </CardBody>
                                    <Divider />
                                    {
                                        !isUploadedDocument &&

                                        <CardFooter className='flex items-center justify-between'>
                                            <div className='gap-2  space-y-1 items-start text-[12px] text-right flex-1'>
                                                {
                                                    error.map(item =>
                                                        <Chip className='text-red-500 text-[12px] ml-1 mt-1' endContent={<NotificationIcon className={'text-red-800'} size={12} />} >{item}</Chip>
                                                    )
                                                }

                                            </div>
                                            <div className='items-end justify-end'>
                                                <Button className={`mt-2  bg-gray-500  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitUpdatedDocument(event)}>بازگشت به مرحله قبل</Button>
                                                {
                                                    (isCertificateBefore || isAccepted) ?
                                                        <Button className={`mt-2  bg-green-500  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitDocument(1)}>ذخیره و ارسال</Button>
                                                        :
                                                        <Button className={`mt-2  bg-green-500  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitDocument(2)}>انتقال به درگاه پرداخت</Button>
                                                }

                                            </div>

                                        </CardFooter>
                                    }
                                </Card>
                            }
                        </div>
                    </form>
                </div>

            </div >
            {
                //? 1 : submit  2: payment
                action == 1 ?
                    <Modal
                        backdrop="opaque"
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        radius="lg"
                        classNames={{
                            body: "py-6 bg-white",
                            backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                            base: "border-[#292f46] bg-slate-500 text-black",
                            header: " border-[#292f46] text-white  bg-primary_color ",
                            footer: " border-[#292f46] bg-white",
                            closeButton: "hover:bg-white/5 active:bg-white/10 ",
                        }}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col justify-between items-start ">
                                        تایید نهایی ثبت نام
                                    </ModalHeader>
                                    <ModalBody >

                                        <p className='justify-stretch items-baseline text-justify'>
                                            ضمن تشکر از همراهی شما همکار گرامی ، یادآور می شود اطلاعات پس از تایید نهایی قابل ویرایش نخواهد بود،لطفا پیش از تایید دقت لازم بعمل آورید
                                        </p>
                                    </ModalBody>
                                    <ModalFooter >
                                        <Button color="foreground" variant="light" onPress={onClose}>
                                            بستن
                                        </Button>
                                        <Button
                                            isLoading={isLoading} onClick={registerLecturer} color="success" variant="light"
                                        >
                                            تایید نهایی
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    :
                    <Modal
                        backdrop="opaque"
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        radius="lg"
                        classNames={{
                            body: "py-6 bg-white",
                            backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                            base: "border-[#292f46] bg-slate-500 text-black",
                            header: " border-[#292f46] text-white  bg-primary_color ",
                            footer: " border-[#292f46] bg-white",
                            closeButton: "hover:bg-white/5 active:bg-white/10 ",
                        }}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col justify-between items-start ">
                                        انتقال به درگاه پرداخت
                                    </ModalHeader>
                                    <ModalBody >
                                        مبلغ قابل پرداخت : 250 هزار تومان

                                    </ModalBody>
                                    <ModalFooter >
                                        <Button color="foreground" variant="light" onPress={onClose}>
                                            بستن
                                        </Button>
                                        <Button color="primary" variant="light" onPress={onClose}>
                                            پرداخت
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
            }


        </div >
    )
}

export default LectureInformation