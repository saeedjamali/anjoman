"use client"

import { useUserProvider } from '@/components/context/UserProvider';
import { valiadtePrsCode } from '@/utils/auth';
import { generalCondition } from '@/utils/constants';
import { convertTopersian, traverse } from '@/utils/convertnumtopersian';
import { CheckIcon, NotificationIcon } from '@/utils/icon';
import { Autocomplete, AutocompleteItem, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Divider, Image, Input, Link, Radio, RadioGroup, Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io'
import { ToastContainer, toast } from 'react-toastify';
import PublicCondition from './PublicCondition';
import ImageUploader from '@/components/module/uploader/ImageUploader';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css"
import { FaMoneyBillTransfer } from "react-icons/fa6";
import transition from "react-element-popper/animations/transition";
import { MdOutlineCancel } from "react-icons/md";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { BiSolidDetail } from "react-icons/bi";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import ImageLoader from '@/components/module/contrct/ImageLoader';
import ImageLoaderLecturer from '@/components/module/contrct/ImageLoaderLecturer';
import { useAppProvider } from '@/components/context/AppProviders';

const maxFileSize = 300000; //100KB
const acceptType = "jpg";

function LectureInformation() {
    const { user } = useUserProvider();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [payment, setPayment] = useState(0); //? 1 : submit   ---- 2 : payment
    const [comment, setComment] = useState("");
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
    const [isAcademic, setIsAcademic] = useState(false);
    const [typeAcademic, setTypeAcademic] = useState(0);
    const [govermental, setGovermental] = useState(0);
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
    const [ageText, setAgeText] = useState("");
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
    const [beforeRegistered, setBeforeRegistered] = useState(false);
    const [seeHistory, setSeeHistory] = useState(false);
    const [actionType, setActionType] = useState(0)
    const [isLoadingForModalbtn, setIsLoadingForModalbtn] = useState(false)
    //? 1: register without payment    2:register and payment     3: remove     4: payment 

    //? Provinces , Region , Field , Degree
    const [provinces, setProvinces] = useState([]);
    const [regions, setRegions] = useState([]);
    const [fields, setFields] = useState([]);
    const [degrees, setDegrees] = useState([]);

    //? Paynment 
    const merchantId = "000000140332725";
    const terminalId = "24073676";
    const merchantKey = "KTje3RNIhbijwGG2p69YQraFN5errUTV";
    const [amount, setAmount] = useState(2500000);
    // const [amount, setAmount] = useState(10000);
    const [bill, setBill] = useState(null)
    // const [orderId, setOrderId] = useState(Math.floor(Math.random() * 100000000000) + 10000000000);
    const { setToken, setSignData } = useAppProvider();


    const handleSubmit = async (e) => {
        e.preventDefault();
        let orderId = Number(phone + '' + (Math.floor(Math.random() * 1000000) + 100000));
        // setOrderId(Number(phone + '' + (Math.floor(Math.random() * 1000000) + 100000)))
        // console.log("orderId --->", orderId)

        try {
            const orderIdPostResponse = await fetch("/api/lecturer/payment/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId,
                    userId: history._id,
                    year: history.year

                }),
            });
            const orderIdUpdatedData = await orderIdPostResponse.json();
            // console.log("orderIdUpdatedData--->", orderIdUpdatedData)
            if (orderIdUpdatedData.status == 201) {
                // console.log(orderIdUpdatedData.message)
                // console.log(orderIdUpdatedData.orderId);
                const response = await fetch("/api/lecturer/payment/send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount,
                        orderId: orderIdUpdatedData.orderId,
                        LocalDateTime: new Date().toISOString(),
                        MultiIdentityData: {
                            MultiIdentityRows: [
                                {
                                    IbanNumber: "IR940100004060031203656180",
                                    Amount: amount,
                                    PaymentIdentity: "365030160127560001401591600106",
                                },
                            ],
                        },
                        MerchantId: merchantId,
                        TerminalId: terminalId,
                        merchantKey,
                    }),
                });

                const data = await response.json();
                // console.log("ResCode from token", data);
                if (data.ResCode == 0) {
                    const token = data.Token;
                    const signData = data.signData;
                    setToken(token);
                    setSignData(signData);
                    window.location.href = `https://sadad.shaparak.ir/Purchase?token=${token}`;

                } else {
                    console.log(data.Description)
                    toast.info("خطا در ارتباط با درگاه بانک - دقایقی دیگر تلاش کنید")
                }


            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitTest = async (e) => {
        e.preventDefault();
        let orderId = Number(phone + '' + (Math.floor(Math.random() * 1000000) + 100000));
        // setOrderId(Number(phone + '' + (Math.floor(Math.random() * 1000000) + 100000)))
        // console.log("orderId --->", orderId)

        try {
            const orderIdPostResponse = await fetch("/api/lecturer/payment/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId,
                    userId: history._id,
                    year: history.year

                }),
            });
            const orderIdUpdatedData = await orderIdPostResponse.json();
            // console.log("orderIdUpdatedData--->", orderIdUpdatedData)
            if (orderIdUpdatedData.status == 201) {
                // console.log(orderIdUpdatedData.message)
                // console.log(orderIdUpdatedData.orderId);
                const response = await fetch("/api/lecturer/payment/send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: 10000,
                        orderId: orderIdUpdatedData.orderId,
                        LocalDateTime: new Date().toISOString(),
                        MultiIdentityData: {
                            MultiIdentityRows: [
                                {
                                    IbanNumber: "IR940100004060031203656180",
                                    Amount: 10000,
                                    PaymentIdentity: "365030160127560001401591600106",
                                },
                            ],
                        },
                        MerchantId: merchantId,
                        TerminalId: terminalId,
                        merchantKey,
                    }),
                });

                const data = await response.json();
                console.log("ResCode from token", data);
                if (data.ResCode == 0) {
                    const token = data.Token;
                    const signData = data.signData;
                    setToken(token);
                    setSignData(signData);
                    window.location.href = `https://sadad.shaparak.ir/Purchase?token=${token}`;

                } else {
                    console.log(data.Description)
                    toast.info("خطا در ارتباط با درگاه بانک - دقایقی دیگر تلاش کنید")
                }


            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {

        setPhoneInp(phone);
        setMeliCode(identifier);
        setYear("1403-1404");

        const getHistory = async () => {
            try {
                const response = await fetch(`/api/lecturer/${phone}/${year}`);
                const data = await response.json();
                // console.log("data---->", data)
                if (data.status == 200) {
                    setHistory(data.lectureFound);
                    setBill(data?.paymentFounded)
                    setBeforeRegistered(true)
                    // setCurrentYearHistory([...data.lectureFound]?.filter(item => item.year == year));
                } else {

                    toast.info(data.message)
                }
            } catch (error) {
                console.log(error)
                // toast.error("خطای ناشناخته")
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


    useEffect(() => {

        if (history.length != 0) {

            setPayment(history.payment)
            setComment(history.comment)
            setYear(history.year)
            setName(history.name)
            setPrsCode(history.prsCode)
            setMeliCode(history.meliCode)
            setOccuptionState(history.occuptionState)
            setOrgan(history.organ)
            setIsAcademic(history.isAcademic)
            setTypeAcademic(history.typeAcademic)
            setGovermental(history.govermental)

            setProvinceObj(history.province)
            setRegionObj(history.Region)
            setDegreeObj(history.degree)
            setFieldObj(history.field)
            setIsCertificateBefore(history.isCertificateBefore)
            setAge(history.age)
            setIsAccepted(history.isAccepted)
            setStatus(history.status)
            // setDegreeDoc(history.degreeDoc)
            setIntroDoc(history.introDoc)
            setCertificateDoc(history.certificateDoc);


        }
    }, [beforeRegistered]);

    const getProvinces = async () => {
        try {
            const response = await fetch(`/api/base/province/getall/${6598}`);
            const data = await response.json();

            if (data.status == 200) {
                setProvinces(data.provinces.sort((a, b) => a.code - b.code));
            } else {
                toast.info(data.message)
            }
        } catch (error) {
            console.error("خطای ناشناخته")
        }
    }
    const getFields = async () => {
        try {
            const response = await fetch(`/api/base/field/getall/${6598}`);
            const data = await response.json();

            if (data.status == 200) {
                setFields(data.fields);
            } else {
                toast.info(data.message)
            }
        } catch (error) {
            console.error("خطای ناشناخته")
        }
    }

    const getDegrees = async () => {
        try {
            const response = await fetch(`/api/base/degree/getall/${6598}`);
            const data = await response.json();

            if (data.status == 200) {
                setDegrees(data.degrees);
            } else {
                toast.info(data.message)
            }
        } catch (error) {
            console.error("خطای ناشناخته")
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
                // toast.error(data.message)
            }
        } catch (error) {

            console.error("خطای ناشناخته")
        }
    }

    const submitHandler = () => {
        setIsLoading(true);
        if (beforeRegistered) {
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

        if (!name) {
            str.push('نام خانوادگی تکمیل شود');
            setNotCompletePersonalInformatio(true)

        }

        if (organ == 0) {
            str.push('محل خدمت مشخص شود')
            setNotCompletePersonalInformatio(true)
        }


        if (organ == 1 && !valiadtePrsCode(prsCode)) {
            str.push('کد پرسنلی با دقت تکمیل شود')
            setNotCompletePersonalInformatio(true)
        }
        if (organ == 2 && !typeAcademic) {
            str.push('مرتبه دانشگاهی مشخص شود');
            setNotCompletePersonalInformatio(true)
        }

        if (organ == 2 && !govermental) {
            str.push('نوع دانشگاه مشخص شود');
            setNotCompletePersonalInformatio(true)
        }

        if (!age) {
            str.push('تاریخ تولد وارد شود');
            setNotCompletePersonalInformatio(true)
        }


        // if (age < 30) {
        //     str.push('حداقل شرط سنی(30) رعایت نشده است')
        //     setNotCompletePersonalInformatio(true)
        // }

        if (occuptionState == 0) {
            str.push('وضعیت اشتغال مشخص شود')
            setNotCompletePersonalInformatio(true)
        }

        if (!province) {
            str.push('استان مشخص شود')
            setNotCompletePersonalInformatio(true)
        }
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
        if (isAccepted && !((organ == 2) ||
            (organ == 3 && degree == 4) ||
            (organ == 1 && degree == 2))) {
            str.push('مدرک و سازمان مجدد بررسی شود')
            setNotCompletePersonalInformatio(true)
        }
        setError(str)
        if (str.length == 0) {
            setNotCompletePersonalInformatio(false)
            setIsPersonalInformation(true);
        }
        // if (!notCompletePersonalInformation) {
        //     setIsPersonalInformation(true);
        // }
    }

    const submitDocument = (type) => {

        let str = [];
        // if (degreeDoc.length == 0) {
        //     str.push('تصوير مربوط به مدرك تحصيلي بارگذاري نشده است')
        // }
        if (introDoc?.length == 0 && (organ == 2 || organ == 3)) {
            str.push('تصوير معرفي نامه بارگذاري نشده است')
        }
        if (certificateDoc?.length == 0 && isCertificateBefore) {
            str.push('تصوير گواهي مدرسي سنوات قبل بارگذاري نشده است')
        }
        setError(str);
        if (str.length == 0 && (isAccepted || isCertificateBefore) && type == 1) {
            setActionType(1); // For modal
            setPayment(1);    // free
            setStatus(1)
            onOpen()
        } else if (str.length == 0 && !isAccepted && !isCertificateBefore && type == 2) {
            setActionType(2)
            setPayment(2);  // Payment
            setStatus(4)  // wiating for payment
            onOpen()
        }
        // هsetIsUploadedDocument(true);
    }



    const submitUpdatedDocument = () => {
        setNotCompletePersonalInformatio(true)
        setIsPersonalInformation(false);
        setIsUploadedDocument(false)
    }
    // const onChangeDegreeDoc = (imageList, addUpdateIndex) => {
    //     // data for submit
    //     if (imageList.length > 1) {
    //         toast.info("صرفا امکان بارگذاری یک تصویر وجود دارد");
    //     }
    //     setDegreeDoc(imageList);
    // };


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



        try {
            const formData = new FormData();
            if (introDoc) {
                for (const image of introDoc) {
                    formData.append("introDoc", image.file);
                }
            }
            // for (const image of degreeDoc) {
            //     formData.append("degreeDoc", image.file);
            // }
            if (certificateDoc) {
                for (const image of certificateDoc) {
                    formData.append("certificateDoc", image.file);
                }
            }

            if (organ == 2) {
                setIsAcademic(true)
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
            formData.append("govermental", govermental);
            formData.append("isCertificateBefore", isCertificateBefore);
            formData.append("age", age);
            formData.append("isAccepted", isAccepted);
            formData.append("user", user._id);
            formData.append("status", status);
            formData.append("payment", payment);
            formData.append("province", JSON.stringify(provinceObj));
            formData.append("region", JSON.stringify(regionObj));
            formData.append("degree", JSON.stringify(degreeObj));
            formData.append("field", JSON.stringify(fieldObj))


            const res = await fetch("/api/lecturer/register", {
                method: "POST",
                header: { "Content-Type": "multipart/form-data" },
                body: formData,
            });
            const data = await res.json();
            if (data.status == 201) {
                toast.success(data.message);
                onClose();
                if (status == 1) {
                    location.reload();
                } else if (status == 4) {
                    location.reload();
                    // toast.success("هدایت به درگاه پرداخت")
                    // moveToPayment();
                }
            } else {
                toast.info(data.message);
            }
            setIsLoading(false);
            onClose();


        } catch (error) {
            console.log("error in catch add lecturer -> ", error);
            toast.error("خطای ناشناخته");
            setIsLoading(false);
            onClose();
        }

    }

    const submitPayment = () => {
        // toast.info("در حال انتقال به درگاه پرداخت")
        setActionType(4)
        onOpen()
    }

    const submitRemoveDocument = () => {
        setActionType(3)
        onOpen()
        // toast.error("لغو ثبت نام")
    }


    const moveToPaymentTest = () => {
        setActionType(4)
        onOpen()
        // toast.info("در حال حاضر درگاه غیرفعال می باشد ، زمان فعالسازي درگاه از طریق پيامك اطلاعرساني خواهد شد")
    }
    const moveToPayment = () => {
        // setActionType(4)
        // onOpen()
        toast.info("در حال حاضر درگاه غیرفعال می باشد ، زمان فعالسازي درگاه از طریق پيامك اطلاعرساني خواهد شد")
    }

    const removeRegister = async () => {
        setIsLoadingForModalbtn(true);
        try {
            const response = await fetch(`/api/lecturer/remove/${history._id}`, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.info(data.message)
                location.reload()
            } else {
                toast.error(data.message)
            }
            setIsLoadingForModalbtn(false)
            // router.push("/p-modir/uniform/contract")
        } catch (error) {
            console.log("error from remove lecturer Handler --->", error)
            setIsLoadingForModalbtn(false)
        }
        onClose();

    }

    function handleChange(value) {
        //تغییرات روی تاریخ رو اینجا اعمال کنید'
        const date = new DateObject(value);
        // console.log("data is --->", date?.format?.("D MMMM YYYY"))

        if (value) {
            setAge(date.format());
            setAgeText(date?.format?.("D MMMM YYYY"));
        } else {
            setAge("")
            setAgeText("")
        }
    }

    const showBill = () => {
        setActionType(5);
        onOpen();
    }

    return (
        <div >
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
            <div className='w-full border-2 border-slate-100 mt-2 rounded-md'>
                <div className='flex items-center  bg-slate-100 p-2' >
                    <span className=' w-full flex text-[12px]'>اطلاعات متقاضی</span>

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
                            <div className='flex flex-col gap-y-4 md:gap-y-0 md:flex-row mt-4'>
                                <div className='flex-1 flex items-center justify-start'>
                                    {/* <span className='text-[14px] p-2'></span> */}
                                    {

                                        //? status == 1  ثبت نام شده
                                        //? status == 2  قبولی در مضاحبه
                                        //? status == 3  رد شده
                                        //? status == 4  در انتظار پرداخت
                                        beforeRegistered ? (
                                            history.status == 1 ?
                                                <Chip color='primary'>
                                                    <span className='text-[12px] text-white'>{`ثبت نام فعال برای سال تحصیلی ${history.year} `}</span>
                                                </Chip> :
                                                history.status == 2 ?
                                                    <Chip color='success'>
                                                        <span className=' text-[12px] text-white'>{`قبولی در مصاحبه`}</span>
                                                    </Chip> : history.status == 3 ?
                                                        <Chip color='danger'>
                                                            <span className=' text-[12px] text-white'>{`رد مصاحبه`}</span>
                                                        </Chip> : history.status == 4 ?
                                                            <Chip color='warning'>
                                                                <span className=' text-[12px] text-white'>{`در انتظار پرداخت`}</span>
                                                            </Chip> : <Chip color='warning'>
                                                                <span className=' text-[12px] text-white'>{`نامشخص`}</span>
                                                            </Chip>
                                        ) :

                                            <Chip color='primary'>
                                                <span className=' text-[12px] text-white '>{`ثبت نام فعال برای سال تحصیلی ${year} ندارید`}</span>
                                            </Chip>
                                    }
                                </div>
                                <div className='flex items-center justify-end'>
                                    {/* <button className='mt-2 bg-red-500 text-white p-2 rounded-md text-[12px]' onClick={() => editHandler(event)} >ویرایش مشخصات</button> */}

                                    {
                                        beforeRegistered && history.status == 4 &&


                                        <div className='flex items-center justify-end'>

                                            <Button className={` bg-blue-500  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => moveToPaymentTest()}>انتقال به درگاه پرداخت</Button>

                                            <Button className={`hidden md:flex  bg-red-500  text-white p-2 rounded-md text-[10px] md:text-[12px] mr-2`} onClick={() => submitRemoveDocument(event)}>لغو ثبت نام</Button>

                                            <div className='flex-center justify-center md:hidden mr-2 cursor-pointer' onClick={() => submitRemoveDocument(event)}>
                                                <MdDeleteOutline className='bg-red-500 p-1 text-[36px] text-white rounded-full flex ' />
                                            </div>

                                        </div>


                                    }
                                    {
                                        beforeRegistered && history.status == 4 && history.phone == "09151208032" &&


                                        < div className='items-end justify-end'>
                                            <Button className={`  bg-yellow-500  text-white p-2 rounded-md text-[10px] md:text-[12px] mr-2`} onClick={(e) => handleSubmitTest(e)}> (آزمایشی)انتقال به درگاه پرداخت</Button>
                                        </div>




                                    }
                                    {
                                        beforeRegistered && history.payment == 2 && history.status == 1 &&
                                        <div className='flex items-center justify-end'>
                                            <Tooltip
                                                showArrow={true}
                                                color="primary"
                                                content="مشاهده سابقه تراکنش"
                                            >
                                                <Button className='hidden relative md:flex-center text-[10px] md:text-[12px] text-white bg-green-600 mr-2 p-2 cursor-pointer rounded-md' onClick={showBill}>
                                                    اطلاعات پرداخت
                                                    {/* <FaMoneyBillTransfer /> */}
                                                </Button>
                                            </Tooltip>
                                            <div className='flex-center justify-center md:hidden mr-2 cursor-pointer' onClick={showBill}>
                                                <FaMoneyBillTransfer className='bg-green-500 p-1 text-[36px] text-white rounded-full flex ' />
                                            </div>

                                        </div>

                                    }
                                    {beforeRegistered ?
                                        <>
                                            <Button className={`hidden md:flex  bg-green-600  text-white p-2 rounded-md text-[10px] md:text-[12px] mr-2`} onClick={() => setSeeHistory(prev => !prev)}>اطلاعات ثبت نام</Button>

                                            <div className='flex-center justify-center md:hidden mr-2 cursor-pointer' onClick={() => setSeeHistory(prev => !prev)}>
                                                <BiSolidDetail className='bg-green-500 p-1 text-[36px] text-white rounded-full flex ' />
                                            </div>
                                        </>
                                        :
                                        <Button className={` bg-blue-600  text-white p-2 rounded-md text-[10px] md:text-[12px] mr-2`} onClick={() => submitHandler(event)}>ثبت نام مدرسین</Button>
                                    }

                                </div>
                            </div>
                        }
                        {!beforeRegistered &&
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
                                        <CardHeader className="flex gap-3 bg-blue-500 text-white z-20">
                                            <p className="text-lg ">ثبت مشخصات فردی</p>
                                        </CardHeader>
                                        <Divider />
                                        <CardBody >
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

                                                    <Input

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

                                                    <Input
                                                        tabIndex={1}
                                                        disabled={isPersonalInformation}
                                                        type="text"
                                                        size='md'
                                                        label="نام و نام خانوادگی"
                                                        labelPlacement={"inside"}
                                                        value={name} onChange={(event) => setName(event.target.value)} ></Input>
                                                </div>
                                                <div className='z-30 relative mt-2 flex flex-col justify-start items-center col-span-1 bg-gray-100 rounded-md  '>
                                                    {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                    <div className='flex items-center justify-start w-full'>
                                                        <span className='mr-2 mt-2 text-[14px] text-gray-600 '>تاریخ تولد</span>
                                                        <span className='mr-2 mt-2 text-[10px] text-gray-400'>(متولدین قبل 13730701)</span>
                                                    </div>
                                                    <div tabIndex={2}>
                                                        <DatePicker

                                                            type='false'
                                                            dateSeparator="-"
                                                            title='انتخاب کنید'
                                                            zIndex={100}
                                                            style={{
                                                                backgroundColor: "aliceblue",
                                                                height: "24px",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                                padding: "3px 10px"
                                                            }}
                                                            // containerStyle={{
                                                            //     width: "70%"
                                                            // }}
                                                            className="teal rmdp-prime"
                                                            fixMainPosition="bottom"
                                                            maxDate={"1373/07/01"}
                                                            minDate={"1320/07/01"}
                                                            currentDate={"1373/07/01"}
                                                            showOtherDays
                                                            calendar={persian}
                                                            locale={persian_fa}
                                                            calendarPosition="bottom-right"
                                                            value={age || "1373/07/01"}
                                                            onChange={handleChange}


                                                        />
                                                        <span className='mr-2 text-[10px]'>
                                                            {ageText}
                                                        </span>
                                                    </div>
                                                    {/*                                                   
                                                    <Input
                                                        tabIndex={3}
                                                        disabled={isPersonalInformation}
                                                        type="number"
                                                        label="سن"
                                                        size='md'
                                                        labelPlacement={"inside"}
                                                        value={age} onChange={(event) => setAge(event.target.value)} ></Input>
                                                         */}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                                <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                    <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                        <RadioGroup
                                                            tabIndex={3}
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
                                                            <Radio value="2" size="sm">عضو هیات علمی دانشگاه</Radio>
                                                            <Radio value="3" size="sm">حوزه علمیه</Radio>


                                                        </RadioGroup>
                                                    </div>
                                                </div>
                                            </div>

                                            {organ == 1 ?
                                                <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                                    <div className='relative mt-2 flex justify-start col-span-1'>
                                                        {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                        <Input
                                                            tabIndex={4}
                                                            disabled={isPersonalInformation}
                                                            type="number"
                                                            size='md'
                                                            label="کد پرسنلی"
                                                            labelPlacement={"inside"}
                                                            value={prsCode} onChange={(event) => setPrsCode(event.target.value)} ></Input>
                                                    </div>
                                                </div>
                                                : organ == 2 ?
                                                    <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>

                                                        <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                            <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                                <RadioGroup
                                                                    tabIndex={5}
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
                                                        </div>
                                                        <div className=' relative mt-2 flex justify-start col-span-1 '>

                                                            <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                                <RadioGroup
                                                                    tabIndex={6}
                                                                    isDisabled={isPersonalInformation}
                                                                    className='flex-1 justify-start items-start p-2 text-[14px]'
                                                                    label="نوع دانشگاه"
                                                                    orientation="horizontal"
                                                                    value={govermental}
                                                                    onValueChange={setGovermental}
                                                                >
                                                                    <Radio value="1" size="sm">دولتی</Radio>
                                                                    <Radio value="2" size="sm">غیردولتی</Radio>

                                                                </RadioGroup>
                                                            </div>
                                                        </div>

                                                    </div> : null

                                            }

                                            <div className='grid grid-cols-1 mt-2 md:grid-cols-2   md:gap-4'>
                                                <div className='relative flex justify-start col-span-1'>
                                                    <Autocomplete
                                                        tabIndex={7}
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

                                                        }}
                                                    >
                                                        {(item) => (
                                                            <AutocompleteItem key={item.code}>
                                                                {item.name}
                                                            </AutocompleteItem>
                                                        )}
                                                    </Autocomplete>

                                                </div>
                                                <div className='relative flex justify-start col-span-1'>
                                                    <Autocomplete
                                                        tabIndex={8}
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
                                                <div className='relative flex justify-start items-start text-right col-span-1'>
                                                    <Autocomplete
                                                        tabIndex={9}
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


                                                        }}
                                                    >
                                                        {(item) => (
                                                            <AutocompleteItem key={item.code}>
                                                                {item.name}
                                                            </AutocompleteItem>
                                                        )}
                                                    </Autocomplete>

                                                </div>
                                                <div className='relative flex justify-start items-start text-right col-span-1'>
                                                    <Autocomplete
                                                        tabIndex={10}
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
                                                <Checkbox tabIndex={11} isDisabled={isPersonalInformation} size='sm' isSelected={isCertificateBefore} onValueChange={setIsCertificateBefore} radius="md">دارای گواهی نامه مدرسی آموزش خانواده(در سنوات قبل) می باشم.</Checkbox>
                                            </div>
                                            <div className='relative mt-2  flex justify-start items-start text-right col-span-2'>
                                                <Checkbox tabIndex={12} isDisabled={isPersonalInformation} size='sm' isSelected={isAccepted} onValueChange={setIsAccepted} radius="md">دارای مدرک دکتری در آموزش و پرورش و یا عضو هیئت علمی در دانشگاه با رتبه استادیار یا دانشیار یا سطح چهار تخصصی حوزه های علمیه می باشم. </Checkbox>
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
                                            {/* <div className='w-full  relative mt-2 flex justify-between item-center col-span-2'>
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

                                            </div> */}
                                            {!(organ == 2 || organ == 3 || isCertificateBefore) &&
                                                <div className='w-full flex-center'>
                                                    با توجه به بند های انتخاب شده نیازی به بارگذاری مدرک نیست
                                                </div>
                                            }


                                            {(organ == 2 || organ == 3) &&
                                                <div className='w-full  relative mt-2 flex justify-between item-center col-span-2'>
                                                    <div className='flex-center text-[14px] items-center justify-start text-right'>بارگذاری معرفی نامه معتبر از دانشگاه یا حوزه علمیه</div>
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
                                                    <div className='flex-center text-[14px] items-center justify-start text-right'>بارگذاری تصویر گواهی نامه مدرسی آموزشی خانواده سنوات قبل</div>
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
                                                            <Button className={`mt-2  bg-green-500  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitDocument(1)}>تایید</Button>
                                                            :
                                                            <Button className={`mt-2  bg-green-500  text-white p-2 rounded-md text-[12px] mr-2`} onClick={() => submitDocument(2)}>تایید</Button>
                                                    }

                                                </div>

                                            </CardFooter>
                                        }
                                    </Card>
                                }
                            </div>}
                        {seeHistory && beforeRegistered &&
                            <div className='flex flex-col justify-start mt-4'>
                                {/* //? بررسی شرایط عمومی */}

                                <Card >
                                    <CardHeader className="flex gap-3 bg-blue-500 text-white">
                                        <p className="text-md ">شرایط عمومی</p>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody className='text-[12px] items-start gap-y-4'>
                                        {
                                            generalCondition.map(item =>
                                                <PublicCondition isGeneralCondition={true} condition={item} />
                                            )
                                        }


                                    </CardBody>
                                    <Divider />

                                </Card>



                                {/* //? ثبت مشخصات فردی */}


                                <Card className='my-4'>
                                    <CardHeader className="flex gap-3 bg-blue-500 text-white">
                                        <p className="text-lg ">مشاهده مشخصات فردی</p>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody >
                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                <Input

                                                    disabled={true}
                                                    type="text"
                                                    label="سال تحصیلی"
                                                    size='md'
                                                    labelPlacement={"inside"}
                                                    value={history.year} ></Input>

                                            </div>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                <Input

                                                    disabled={true}
                                                    size='md'
                                                    type="number"
                                                    label="کد ملی"
                                                    labelPlacement={"inside"}
                                                    value={history.meliCode}  ></Input>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                <Input
                                                    tabIndex={1}
                                                    disabled={true}
                                                    type="text"
                                                    size='md'
                                                    label="نام و نام خانوادگی"
                                                    labelPlacement={"inside"}
                                                    value={history.name}  ></Input>
                                            </div>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                <Input
                                                    tabIndex={2}
                                                    disabled={true}
                                                    type="text"
                                                    label="تاریخ تولد"
                                                    size='md'
                                                    labelPlacement={"inside"}
                                                    value={history.age}  ></Input>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                    <RadioGroup
                                                        tabIndex={3}
                                                        isDisabled={true}
                                                        className='flex justify-between items-start p-2 text-[14px]'
                                                        label="وضعیت اشتغال"
                                                        orientation="horizontal"
                                                        value={history.occuptionState + ''}

                                                    >
                                                        <Radio value="1" size="sm">شاغل</Radio>
                                                        <Radio value="2" size="sm">بازنشسته</Radio>


                                                    </RadioGroup>
                                                </div>
                                            </div>
                                            <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                <div className="bg-stone-100 rounded-lg w-full items-start justify-start text-right">
                                                    <RadioGroup
                                                        tabIndex={5}
                                                        isDisabled={true}
                                                        className='flex-1 justify-start items-start p-2 text-[14px] text-right'
                                                        label="سازمان محل خدمت"

                                                        orientation="horizontal"
                                                        value={history.organ + ''}

                                                    >
                                                        <Radio value="1" size="sm">آموزش و پرورش</Radio>
                                                        <Radio value="2" size="sm">عضو هیات علمی دانشگاه</Radio>
                                                        <Radio value="3" size="sm">حوزه علمیه</Radio>


                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </div>

                                        {organ == 1 ?
                                            <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                                <div className='relative mt-2 flex justify-start col-span-1'>
                                                    {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                                                    <Input
                                                        tabIndex={6}
                                                        disabled={true}
                                                        type="number"
                                                        size='md'
                                                        label="کد پرسنلی"
                                                        labelPlacement={"inside"}
                                                        value={history.prsCode}  ></Input>
                                                </div>
                                            </div>
                                            : organ == 2 ?
                                                <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                                    <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                        <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                            <RadioGroup
                                                                tabIndex={7}
                                                                isDisabled={true}
                                                                className='flex-1 justify-start items-start p-2 text-[14px]'
                                                                label="رتبه دانشگاهی"
                                                                orientation="horizontal"
                                                                value={history.typeAcademic + ''}

                                                            >
                                                                <Radio value="1" size="sm">استادیار</Radio>
                                                                <Radio value="2" size="sm">دانشیار</Radio>

                                                            </RadioGroup>
                                                        </div>
                                                    </div>
                                                    <div className=' relative mt-2 flex justify-start col-span-1 '>
                                                        <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                                                            <RadioGroup
                                                                tabIndex={7}
                                                                isDisabled={true}
                                                                className='flex-1 justify-start items-start p-2 text-[14px]'
                                                                label="رتبه دانشگاهی"
                                                                orientation="horizontal"
                                                                value={history.govermental + ''}

                                                            >
                                                                <Radio value="1" size="sm">دولتی</Radio>
                                                                <Radio value="2" size="sm">غیردولتی</Radio>

                                                            </RadioGroup>
                                                        </div>
                                                    </div>
                                                </div> : null

                                        }

                                        <div className='grid grid-cols-1 md:grid-cols-2  md:gap-4'>
                                            <div className='relative mt-2 flex justify-start col-span-1'>

                                                <Input
                                                    tabIndex={6}
                                                    disabled={true}
                                                    type="text"
                                                    size='md'
                                                    label="استان"
                                                    labelPlacement={"inside"}
                                                    value={provinceObj?.name}  ></Input>

                                            </div>
                                            <div className='relative mt-2 flex justify-start col-span-1'>
                                                <Input
                                                    tabIndex={6}
                                                    disabled={true}
                                                    type="text"
                                                    size='md'
                                                    label="منطقه"
                                                    labelPlacement={"inside"}
                                                    value={regionObj?.regionName}  ></Input>

                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
                                            <div className='relative mt-2 flex justify-start items-start text-right col-span-1'>
                                                <Input
                                                    tabIndex={6}
                                                    disabled={true}
                                                    type="text"
                                                    size='md'
                                                    label="مدرک تحصیلی"
                                                    labelPlacement={"inside"}
                                                    value={degreeObj?.name}  ></Input>


                                            </div>
                                            <div className='relative mt-2 flex justify-start items-start text-right col-span-1'>
                                                <Input
                                                    tabIndex={6}
                                                    disabled={true}
                                                    type="text"
                                                    size='md'
                                                    label="رشته تحصیلی"
                                                    labelPlacement={"inside"}
                                                    value={fieldObj?.name}  ></Input>

                                            </div>
                                        </div>

                                        <div className='relative mt-4  flex justify-start items-start text-right col-span-2'>
                                            <Checkbox tabIndex={12} isDisabled={true} size='sm' defaultSelected={history.isCertificateBefore} radius="md">دارای گواهی نامه مدرسی آموزش خانواده(در سنوات قبل) می باشم.</Checkbox>
                                        </div>
                                        <div className='relative my-2  flex justify-start items-start text-right col-span-2'>
                                            <Checkbox tabIndex={13} isDisabled={true} size='sm' defaultSelected={history.isAccepted} radius="md">دارای مدرک دکتری در آموزش و پرورش و یا عضو هیئت علمی در دانشگاه با رتبه استادیار یا دانشیار یا سطح چهار تخصصی حوزه های علمیه می باشم. </Checkbox>
                                        </div>

                                    </CardBody>
                                    <Divider />

                                </Card>

                                {/* //?  مدارک مورد نیاز */}

                                <Card className='my-4'>
                                    <CardHeader className="flex gap-3 bg-blue-500 text-white">
                                        <p className="text-lg "> مدارک بارگذاری شده</p>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody className='text-[12px] items-start gap-y-4'>
                                        {/* <div className='w-full  relative mt-2 flex justify-between item-start col-span-2'>
                                            <div className='flex items-center justify-start text-[14px] text-right'> تصویر مدرک تحصیلی</div>
                                            <div className="gap-2  ">
                                                {history.degreeDoc?.map(
                                                    (image, index) => (
                                                        <div key={index}>
                                                            <ImageLoaderLecturer
                                                                imageUrl={image}
                                                                code={"degree"}
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                        </div> */}
                                        {!(history.organ == 2 || history.organ == 3 || history.isCertificateBefore) &&
                                            <div className='w-full flex-center'>
                                                با توجه به بند های انتخاب شده مدرکی بارگذاری نشده است
                                            </div>
                                        }

                                        {(history.organ == 2 || history.organ == 3) &&
                                            <div className='w-full  relative mt-2 flex justify-between item-center col-span-2'>
                                                <div className='flex-center text-[14px] text-right'> تصویر معرفی نامه بارگذاری شده</div>
                                                <div className="gap-2  ">
                                                    {history.introDoc?.map(
                                                        (image, index) => (
                                                            <div key={index}>
                                                                <ImageLoaderLecturer
                                                                    imageUrl={image}
                                                                    code={"intro"}
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                            </div>
                                        }
                                        {
                                            history.isCertificateBefore &&
                                            <div className='w-full  relative mt-2 flex justify-between item-center col-span-2'>
                                                <div className='flex-center text-[14px] text-right'> تصویر گواهی نامه مدرسی آموزشی خانواده سنوات قبل</div>
                                                <div className="gap-2  ">
                                                    {history.certificateDoc?.map(
                                                        (image, index) => (
                                                            <div key={index}>
                                                                <ImageLoaderLecturer
                                                                    imageUrl={image}
                                                                    code={"certificate"}
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                            </div>
                                        }


                                    </CardBody>
                                    <Divider />

                                </Card>



                                {history.status == 1 && history.payment == 2 &&
                                    <Card >
                                        <CardHeader className="flex gap-3 bg-blue-500">

                                            <div className="flex text-white">
                                                <p className="text-md">اطلاعات پرداختی</p>
                                            </div>
                                        </CardHeader>
                                        <Divider />
                                        <CardBody className='w-full gap-y-2 text-[12px] md:text-[14px] lg:text-[16px]'>

                                            <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                                                <p className='w-[40%] text-right text-white bg-blue-400 p-4 '>
                                                    نتیجه تراکنش
                                                </p>
                                                <p className='w-[60%] flex-center p-4'>
                                                    {bill?.resCode == 0 ? 'تراکنش موفق' : 'تراکنش ناموفق'}
                                                </p>
                                            </div>
                                            <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                                                <p className='w-[40%] text-right text-white bg-blue-400 p-4 '>
                                                    مبلغ تراکنش
                                                </p>
                                                <p className='w-[60%] flex-center p-4'>
                                                    {bill?.amount}
                                                </p>
                                            </div>
                                            <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                                                <p className='w-[40%] text-right text-white bg-blue-400 p-4 '>
                                                    شرح نتیجه تراکنش
                                                </p>
                                                <p className='w-[60%] flex-center p-4'>
                                                    {bill?.description}
                                                </p>
                                            </div>
                                            <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                                                <p className='w-[40%] text-right text-white bg-blue-400 p-4 '>
                                                    شماره مرجع تراکنش
                                                </p>
                                                <p className='w-[60%] flex-center p-4'>
                                                    {bill?.retrivalRefNo}
                                                </p>
                                            </div>
                                            <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                                                <p className='w-[40%] text-right text-white bg-blue-400 p-4 '>
                                                    شناسه پیگیری
                                                </p>
                                                <p className='w-[60%] flex-center p-4'>
                                                    {bill?.systemTraceNo}                                                                    </p>
                                            </div>
                                        </CardBody>

                                    </Card>
                                }
                                <Card className='my-4'>
                                    <CardHeader className={`flex gap-3  text-white text-right ${status == 1 ? ' bg-blue-500 ' : status == 2 ? ' bg-green-500' : status == 3 ? ' bg-red-500' : status == 4 ? ' bg-purple-500' : ' hidden'} `}>
                                        <p className="text-lg ">{` توضیحات : ${history.comment} `}</p>
                                    </CardHeader>
                                </Card>


                            </div>}
                    </form>
                </div>

            </div >
            {
                //? 1 : submit  2: payment
                actionType == 1 ?
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
                    : actionType == 2 ?
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
                                        <ModalBody>
                                            <p className='justify-stretch items-baseline text-justify'>
                                                ضمن تشکر از همراهی شما همکار گرامی ، یادآور می شود اطلاعات پس از تایید نهایی قابل ویرایش نخواهد بود،لطفا پیش از تایید دقت لازم بعمل آورید
                                            </p>
                                            <p className="text-blue-500">
                                                پس از پرداخت مبلغ ثبت نام شما نهایی خواهد شد

                                            </p>
                                        </ModalBody>
                                        <ModalFooter >
                                            <Button color="foreground" variant="light" onPress={onClose}>
                                                بستن
                                            </Button>
                                            <Button isLoading={isLoading} onClick={registerLecturer} color="primary" variant="light" >
                                                تایید نهایی
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal> :

                        actionType == 4 ?
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
                                                <div className='text-[12px] '>
                                                    <span className='text-gray-800'>شماره همراه شما :</span>
                                                    <span className='text-blue-500'> {phone}</span>
                                                </div>
                                                <div className='text-[12px] mt-2'>
                                                    <span className='text-gray-800'>مبلغ قابل پرداخت :</span>
                                                    <span className='text-blue-500'> 250 هزار تومان</span>
                                                </div>
                                                <p className='text-[16px] mt-4'>آیا مایل به ادامه فرایند می باشید؟</p>

                                            </ModalBody>
                                            <ModalFooter >
                                                <Button color="foreground" variant="light" onPress={onClose}>
                                                    بستن
                                                </Button>
                                                <Button isLoading={isLoading} onClick={handleSubmit} color="primary" variant="light" onPress={onClose}>
                                                    انتقال به درگاه پرداخت
                                                </Button>
                                            </ModalFooter>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                            : actionType == 3 ?
                                <Modal
                                    backdrop="opaque"
                                    isOpen={isOpen}
                                    onOpenChange={onOpenChange}
                                    radius="lg"
                                    classNames={{
                                        body: "py-6 bg-white",
                                        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                                        base: "border-[#292f46] bg-slate-500 text-black",
                                        header: " border-[#292f46] text-white  bg-red-500 ",
                                        footer: " border-[#292f46] bg-white",
                                        closeButton: "hover:bg-white/5 active:bg-white/10 ",
                                    }}
                                >
                                    <ModalContent>
                                        {(onClose) => (
                                            <>
                                                <ModalHeader className="flex flex-col justify-between items-start ">
                                                    لغو ثبت نام
                                                </ModalHeader>
                                                <ModalBody >
                                                    با این اقدام ثبت نام جاری شما حذف خواهد شد؟

                                                </ModalBody>
                                                <ModalFooter >
                                                    <Button color="foreground" variant="light" onPress={onClose}>
                                                        بستن
                                                    </Button>
                                                    <Button isLoading={isLoadingForModalbtn} onClick={() => removeRegister()} color="danger" variant="light" >
                                                        تایید
                                                    </Button>
                                                </ModalFooter>
                                            </>
                                        )}
                                    </ModalContent>
                                </Modal> :
                                actionType == 5 ?
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
                                            // closeButton: "hover:bg-white/5 active:bg-white/10 ",
                                        }}
                                    >
                                        <ModalContent>
                                            {(onClose) => (
                                                <>
                                                    {/* <ModalHeader className="flex flex-col justify-between items-start ">
                                                        صورتحساب پرداخت شما
                                                    </ModalHeader> */}
                                                    <ModalBody >
                                                        <Card >
                                                            <CardHeader className="flex gap-3 bg-blue-500">

                                                                <div className="flex text-white">
                                                                    <p className="text-md">اطلاعات پرداختی</p>
                                                                </div>
                                                            </CardHeader>
                                                            <Divider />
                                                            <CardBody className='w-full gap-y-2 text-[12px] md:text-[14px] '>

                                                                <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                                                                    <p className='w-[40%] text-right text-white bg-blue-400 p-4 '>
                                                                        نتیجه تراکنش
                                                                    </p>
                                                                    <p className='w-[60%] flex-center p-4'>
                                                                        {bill?.resCode == 0 ? 'تراکنش موفق' : 'تراکنش ناموفق'}
                                                                    </p>
                                                                </div>
                                                                <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                                                                    <p className='w-[40%] text-right text-white bg-blue-400 p-4 '>
                                                                        مبلغ تراکنش
                                                                    </p>
                                                                    <p className='w-[60%] flex-center p-4'>
                                                                        {`${bill?.amount} ریال`}
                                                                    </p>
                                                                </div>
                                                                <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                                                                    <p className='w-[40%] text-right text-white bg-blue-400 p-4 '>
                                                                        شرح نتیجه تراکنش
                                                                    </p>
                                                                    <p className='w-[60%] flex-center p-4'>
                                                                        {bill?.description}
                                                                    </p>
                                                                </div>
                                                                <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                                                                    <p className='w-[40%] text-right text-white bg-blue-400 p-4 '>
                                                                        شماره مرجع تراکنش
                                                                    </p>
                                                                    <p className='w-[60%] flex-center p-4'>
                                                                        {bill?.retrivalRefNo}
                                                                    </p>
                                                                </div>
                                                                <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                                                                    <p className='w-[40%] text-right text-white bg-blue-400 p-4 '>
                                                                        شناسه پیگیری
                                                                    </p>
                                                                    <p className='w-[60%] flex-center p-4'>
                                                                        {bill?.systemTraceNo}                                                                    </p>
                                                                </div>
                                                            </CardBody>
                                                            <Divider />
                                                            <CardFooter className='flex items-end justify-center'>
                                                                <Button color="foreground" variant="light" onPress={onClose}>
                                                                    بستن
                                                                </Button>
                                                            </CardFooter>
                                                        </Card>
                                                    </ModalBody>

                                                </>
                                            )}
                                        </ModalContent>
                                    </Modal> : null
            }


        </div >
    )
}

export default LectureInformation