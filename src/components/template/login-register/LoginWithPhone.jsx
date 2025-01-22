import { useAppProvider } from '@/components/context/AppProviders';
import { valiadteMeliCode, valiadtePassword, valiadtePhone, valiadtePrsCode } from '@/utils/auth';
import { authTypes, roles, year } from '@/utils/constants'
import {
    Button, Checkbox, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@nextui-org/react';
import { Input } from "@nextui-org/react";
import React, { useRef, useState } from 'react'
import { IoMdArrowRoundForward } from 'react-icons/io'
import { toast } from 'react-toastify';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/utils/icon';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { InputOtp } from '@heroui/input-otp';

function LoginWithPhone({ SetAuthTypesForm, role }) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isInvalidPhone, setIsInvalidPhone] = useState(false)
    const [isInvalidPassword, setIsInvalidPassword] = useState(false)
    const [isInvalidIdentifier, setIsInvalidIdentifier] = useState(false)
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingReport, setIsLoadingReport] = useState(false)
    const [isSendSms, setIsSendSms] = useState(false)
    const [isAuth, setIsAuth] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const [prs, setPrs] = useState(null)
    const [prsCode, setPrsCode] = useState(null)
    const [identifier, setIdentifier] = useState(null)
    const [report, setReport] = useState(null)
    const [result, setResult] = useState(null)
    const [isPrint, setIsPrint] = useState(false)


    const finishTimer = () => {
        setIsSendSms(false)
    }



    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Report',
        onAfterPrint: () => console.log('Printed PDF successfully!'),
        copyStyles: true
    });

    const { phone,
        setPhone,

        password,
        setPassword } = useAppProvider();
    const [waitForSendOtpCode, setWaitForSendOtpCode] = useState(false);

    const handleRegister = async (event) => {

        // event.preventDefault();
        // toast.info("زمان تکمیل فرم به اتمام رسیده است.")
        // return;

        setOtp("")
        if (!valiadtePrsCode(prsCode?.trim())) {
            setIsInvalidIdentifier(true)
            toast.error("کد پرسنلی باید 8 رقمی وارد شود");
            return false
        }

        if (!valiadteMeliCode(identifier?.trim())) {
            setIsInvalidIdentifier(true)
            toast.error("کد ملی باید 10 رقمی وارد شود");
            return false
        }


        if (!valiadtePhone(phone?.trim())) {
            toast.error("شماره همراه وارد شده صحیح نمی باشد.");
            setWaitForSendOtpCode(false);
            setIsInvalidPhone(true)
            return false
        }




        setWaitForSendOtpCode(true);
        const res = await fetch(`/api/quran/prs/${prsCode}/${identifier}/${phone}`);
        const data = await res.json();
        if (data.status == 200) {
            // console.log("Data is --->", data)
            setPrs(data.prs)
            const res = await fetch("/api/auth/sms/sendP", {
                method: "POST",
                header: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({ phone })
            });
            const dataP = await res.json();
            if (dataP.status == 200) {
                setIsSendSms(true)
                toast.info("کد به شماره همراه ثبت شده ارسال شد.");
            } else {
                toast.error("خطا در ارسال کد")
            }
            setWaitForSendOtpCode(false);


        } else {

            toast.error(data.message);
            setWaitForSendOtpCode(false);
        }
        setWaitForSendOtpCode(false);
        setIsInvalidPhone(false)
        setIsInvalidPassword(false)
        setIsInvalidIdentifier(false)

    }

    const handleVerifyOtp = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            const res = await fetch("/api/auth/sms/verify", {
                method: "POST",
                header: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({ phone, code: otp })
            });
            const data = await res.json();

            if (data.status == 200) {
                setIsAuth(true)
                setIsSubmit(prs.result)


            } else if (res.status == 201) {
                toast.success("کد ارسالی منقضی شده است");
            } else {
                toast.error("کد ارسالی صحیح نمی باشد.");
            }
            setIsLoading(false)
        } catch (error) {

            setIsLoading(false)

        }
    }

    const handleSubmit = async (event) => {
        // console.log("isSubmit--->", isSubmit)
        event.preventDefault();
        setIsLoading(true)
        try {
            const res = await fetch("/api/quran/prs/update", {
                method: "PUT",
                header: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({ ...prs, phone, result: isSubmit })
            });
            const data = await res.json();

            if (data.status == 200) {
                // setIsAuth(false)
                // setIsSendSms(false);
                setPrs({ ...prs, result: isSubmit })
                onOpen()
                setIsPrint(true)
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
            setIsLoading(false)
        } catch (error) {

            setIsLoading(false)

        }
    }

    const handleExit = () => {
        setIsAuth(false)
        setIsSendSms(false);
    }

    const handleReport = async () => {
        setIsLoadingReport(true);
        try {



            const res = await fetch("/api/prs/getall", {
                method: "POST",
                header: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({ role: prs.role })
            });
            const dataPrs = await res.json();
            setReport(dataPrs.result.report.sort((a, b) => a.regCode - b.regCode))
            setResult(dataPrs.result)

            setIsLoadingReport(false)
        } catch (error) {

            setIsLoadingReport(false)

        }
        onOpen();
    }

    return (
        <div>
            <div className="min-w-64 flex flex-col h-full min-h-[440px]">
                <div className="w-full flex-1" >
                    {!isSendSms && !isAuth &&
                        <div className="w-full flex flex-col justify-around items-center" >

                            <div className="w-full space-y-2">
                                <Input
                                    label="کد پرسنلی"
                                    inputProps={{ maxLength: 8 }}
                                    isInvalid={isInvalidIdentifier}
                                    size='sm'
                                    // maxLength={11}
                                    // placeholder="ترکیب حروف و اعداد"
                                    errorMessage="کد پرسنلی 8 رقم می باشد"
                                    type="number"

                                    value={prsCode} onChange={() => setPrsCode(event.target.value)}
                                    classNames={{
                                        label: "text-black/80 dark:text-white/90",
                                        input: [
                                            "bg-transparent",
                                            "text-black/90 dark:text-lime-800",
                                            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                                        ],
                                        innerWrapper: "bg-transparent",
                                        inputWrapper: [

                                            "bg-default-200/50",


                                            "group-data-[focus=true]:bg-default-200/50",
                                            "dark:group-data-[focus=true]:bg-default/60",
                                            "!cursor-text",
                                        ],
                                    }} />

                                <Input
                                    label="کد ملی"
                                    inputProps={{ maxLength: 10 }}
                                    isInvalid={isInvalidIdentifier}
                                    size='sm'
                                    // maxLength={11}
                                    // placeholder="ترکیب حروف و اعداد"
                                    errorMessage="کد ملی 10 رقم می باشد"
                                    type="number"
                                    // className="max-w-xs "
                                    value={identifier} onChange={() => setIdentifier(event.target.value)}
                                    classNames={{
                                        label: "text-black/50 dark:text-white/90",
                                        input: [
                                            "bg-transparent",
                                            "text-black/90 dark:text-white/90",
                                            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                                        ],
                                        innerWrapper: "bg-transparent",
                                        inputWrapper: [
                                            "shadow-xl",
                                            "bg-default-200/50",
                                            "dark:bg-default/60",
                                            "backdrop-blur-xl",
                                            "backdrop-saturate-200",
                                            "hover:bg-default-200/70",
                                            "dark:hover:bg-default/70",
                                            "group-data-[focus=true]:bg-default-200/50",
                                            "dark:group-data-[focus=true]:bg-default/60",
                                            "!cursor-text",
                                        ],
                                    }}
                                />


                                <Input
                                    label="شماره همراه"
                                    inputProps={{ maxLength: 11 }}
                                    isInvalid={isInvalidPhone}
                                    size='sm'
                                    // maxLength={11}
                                    // placeholder="ترکیب حروف و اعداد"
                                    errorMessage="شماره همراه 11 رقمی"
                                    type="number"

                                    value={phone} onChange={(event) => setPhone(event.target.value)}

                                    classNames={{
                                        label: "text-black/50 dark:text-white/90",
                                        input: [
                                            "bg-transparent",
                                            "text-black/90 dark:text-white/90",
                                            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                                        ],
                                        innerWrapper: "bg-transparent",
                                        inputWrapper: [
                                            "shadow-xl",
                                            "bg-default-200/50",
                                            "dark:bg-default/60",
                                            "backdrop-blur-xl",
                                            "backdrop-saturate-200",
                                            "hover:bg-default-200/70",
                                            "dark:hover:bg-default/70",
                                            "group-data-[focus=true]:bg-default-200/50",
                                            "dark:group-data-[focus=true]:bg-default/60",
                                            "!cursor-text",
                                        ],
                                    }} />
                                {/* <input type="password" placeholder="رمز عبور" className="input-text  mt-4" value={password} onChange={() => setPassword(event.target.value)} /> */}

                            </div>
                            <Button isLoading={waitForSendOtpCode} type='submit' className="w-full bg-emerald-600 text-white text-[16px] py-2 rounded-lg  flex-center mt-12 " onClick={() => handleRegister(event)}>
                                ارسال کد یکبار مصرف
                            </Button>


                        </div>


                    }
                    {isSendSms && !isAuth &&
                        <form className="w-full flex-1 flex-col-center  min-h-[420px] " onSubmit={(event) => handleVerifyOtp(event)} >
                            <span className=" text-emerald-950 mb-8 mt-4 lg:mb-12 flex-center w-full text-center text-[14px]">{`کد ارسالی به شماره همراه خود را در این قسمت وارد کنید`}</span>
                            {/* <input type="number" placeholder="کد اعتبارسنجی" className="input-text  text-center" value={otp} onChange={(event) => setOtp(event.target.value)} /> */}
                            <div className="flex flex-col items-center justify-center gap-2 text-center" dir="ltr">

                                <InputOtp variant={"faded"} length={5} value={otp} onValueChange={setOtp} errorMessage="کد ارسالی نامعتبر است" color={"default"} classNames={{

                                    segmentWrapper: "gap-x-2",
                                    segment: [
                                        "relative",
                                        "h-10",
                                        "w-10",
                                        "border-1",
                                        "border-green-900",
                                        // "bg-green-900"

                                    ],
                                }} />
                            </div>
                            {/* <span className=' text-[12px] mt-6'> زمان باقی مانده : </span> */}
                            <Button isLoading={isLoading} type='submit' className="w-full  text-white  text-[16px] py-2 rounded-lg mt-12 flex-center bg-emerald-600" onClick={event => handleVerifyOtp(event)} >
                                <span className='flex-1 text-[14px]'>اعتبارسنجی و ورود</span>
                                <span className="ml-2 text-[10px]">
                                    <CountdownCircleTimer
                                        size={32}
                                        strokeWidth={2}
                                        isPlaying
                                        duration={120}
                                        colors={["#22c55e", "#052e16"]}
                                        colorsTime={[120, 60]}
                                        onComplete={finishTimer}
                                    >
                                        {({ remainingTime }) => remainingTime}
                                    </CountdownCircleTimer>
                                </span>
                            </Button>
                            <Button type='submit' className="w-full bg-btn-secondary text-black  text-[16px] py-2 rounded-lg mt-4 flex-center" onClick={() => setIsSendSms(false)} >
                                <span className='flex-1 text-[14px] text-emerald-950'>بازگشت به مرحله قبل</span>
                                <span className="ml-2 text-[10px]">

                                </span>
                            </Button>
                        </form>
                    }

                    {isAuth &&
                        <form className="w-full gap-4 space-y-4 text-right flex flex-col justify-between min-h-[420px]" >
                            <div>
                                <p className='text-right text-[14px] text-emerald-800 '>همکار محترم {prs.gender == "مرد" ? "جناب آقای " : " سرکار خانم"} {prs.name} {prs.family} خوش آمدید</p>

                                {/* <input type="password" placeholder="رمز عبور" className="input-text  mt-4" value={password} onChange={() => setPassword(event.target.value)} /> */}
                                <div className='relative mt-2  flex justify-start items-start text-right'>
                                    <Checkbox size='sm' isSelected={isSubmit} onValueChange={setIsSubmit} radius="md" >
                                        <p className='text-[12px] text-justify'>اینجانب تمایل به دریافت ابلاغیه قران و نماز را دارم
                                        </p>

                                    </Checkbox>
                                </div>
                                {/* {isPrint &&
                                    <div className=''>

                                        <PrintableComponent ref={componentRef} prs={prs} />
                                    </div>
                                } */}
                                {/* <ImageWithText
                                    imageSrc="/images/quran/eblaq.jpg"
                                    altText="Example Image"
                                    text={prs.name+" "+prs.family}
                                    textPosition={{ top: '32%', left: '38%' }} // Adjust position as needed
                                /> */}
                            </div>
                            {/* isDisabled={!isSubmit} */}
                            <div>
                                <Button isLoading={isLoading} isDisabled={!isSubmit} type='submit' className="w-full bg-emerald-900  text-white text-[16px] py-2 rounded-full mt-8 flex-center " onClick={() => handleSubmit(event)}>
                                    مشاهده و چاپ ابلاغیه
                                </Button>
                                {/* <Button isLoading={isLoading} isDisabled={!isSubmit} type='submit' className="w-full bg-emerald-900  text-white text-[16px] py-2 rounded-full  mt-4 flex-center " onClick={handlePrint}>
                                    چاپ
                                </Button> */}
                                <Button type='submit' color='danger' className="w-full  text-white text-[16px] py-2 rounded-full mt-4 flex-center " onClick={() => handleExit(event)}>
                                    خروج
                                </Button>
                            </div>

                        </form>

                    }

                    {isAuth && prs?.role == "9998" &&
                        <Button isLoading={isLoadingReport} type='submit' color='primary' className="w-full  text-white text-[16px] py-2 rounded-full mt-4 flex-center " onClick={() => handleReport(event)}>
                            {isLoadingReport ? " در حال تولید گزارش " : "مشاهده گزارش "}
                        </Button>
                    }
                </div>

            </div>

            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}

                size='5xl'
                radius="lg"
                classNames={{
                    body: "bg-white",
                    backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                    base: "border-[#292f46] bg-slate-500 text-black",
                    header: " border-[#292f46] text-white  bg-primary_color ",
                    footer: " border-[#292f46] bg-white",
                    closeButton: "hover:bg-white/5 active:bg-white/10 ",
                }}
            >
                <ModalContent className=' '>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col justify-between items-start bg-sky-900 ">
                                مشاهده و چاپ ابلاغیه
                            </ModalHeader>
                            <ModalBody className='overflow-auto scroll-auto max-h-[450px] bg-sky-100'>

                                <div dir="rtl" className=' bg-white min-h-[450px]' >
                                    <div dir="rtl" className=" bg-white  relative" ref={componentRef}>

                                        <img src={"/images/quran/eblaq.jpg"} width={100} height={100} className=' w-full bg-cover rounded-sm '>

                                        </img>
                                        <div className='absolute top-[33%] right-[50%] z-10 h-24 font-iranNastaliq text-[12px] md:text-[20px] text-gray-700 font-bold'>{prs.name} {prs.family}</div>
                                        <div className='absolute top-[36.5%] right-[29%] z-10 h-24  text-[10px] md:text-[12px] font-iranSans  text-gray-700 font-bold'>{prs.prs}</div>
                                        <div className='absolute top-[36.5%] right-[47%] z-10 h-24 font-iranNastaliq text-[12px] md:text-[20px] text-gray-700 font-bold'>{prs.province}</div>
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter className='bg-slate-100'>
                                <Button
                                    isLoading={isLoadingReport}
                                    onClick={handlePrint}
                                    color="success"
                                    className='text-white bg-emerald-900'
                                >
                                    چاپ / دانلود
                                </Button>

                                <Button color="foreground" variant="light" onPress={onClose}>
                                    بستن
                                </Button>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div >
    )
}

export default LoginWithPhone