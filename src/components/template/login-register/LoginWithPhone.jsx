import { useAppProvider } from '@/components/context/AppProviders';
import { valiadteMeliCode, valiadtePassword, valiadtePhone, valiadtePrsCode, valiadteRegionCode, valiadteSchoolCode } from '@/utils/auth';
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
    const [report, setReport] = useState(null)
    const [result, setResult] = useState(null)
    const [prss, setPrss] = useState(null)
    const { regions, setRegions } = useState(null);

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
        identifier,
        setIdentifier,
        password,
        setPassword } = useAppProvider();
    const [waitForSendOtpCode, setWaitForSendOtpCode] = useState(false);

    const handleRegister = async (event) => {

        event.preventDefault();

        if (!valiadtePrsCode(identifier.trim())) {
            setIsInvalidIdentifier(true)
            toast.error("کد پرسنلی باید 8 رقمی وارد شود");
            return false
        }

        if (!valiadtePhone(phone?.trim())) {
            toast.error("شماره همراه وارد شده صحیح نمی باشد.");
            setWaitForSendOtpCode(false);
            setIsInvalidPhone(true)
            return false
        }




        setWaitForSendOtpCode(true);
        const res = await fetch(`/api/prs/${identifier}/${phone}`);
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
            const res = await fetch("/api/prs/update", {
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
            <div className="min-w-64 flex flex-col h-auto min-h-80">
                <div className="w-full flex-1" >
                    {!isSendSms && !isAuth &&
                        <form className="w-full" >

                            <Input
                                label="کد پرسنلی"
                                inputProps={{ maxLength: 8 }}
                                isInvalid={isInvalidIdentifier}
                                size='sm'
                                // maxLength={11}
                                // placeholder="ترکیب حروف و اعداد"
                                errorMessage="کد پرسنلی 8 رقم می باشد"
                                type="number"
                                // className="max-w-xs "
                                value={identifier} onChange={() => setIdentifier(event.target.value)} />


                            <Input
                                label="شماره همراه"
                                inputProps={{ maxLength: 11 }}
                                isInvalid={isInvalidPhone}
                                size='sm'
                                // maxLength={11}
                                // placeholder="ترکیب حروف و اعداد"
                                errorMessage="شماره همراه 11 رقمی"
                                type="number"
                                className="mt-8 "
                                value={phone} onChange={(event) => setPhone(event.target.value)} />
                            {/* <input type="password" placeholder="رمز عبور" className="input-text  mt-4" value={password} onChange={() => setPassword(event.target.value)} /> */}

                            <Button isLoading={waitForSendOtpCode} type='submit' className="w-full bg-btn-primary text-white text-[16px] py-2 rounded-full mt-8 flex-center " onClick={() => handleRegister(event)}>
                                ارسال کد یکبار مصرف
                            </Button>


                        </form>


                    }
                    {isSendSms && !isAuth &&
                        <form className="w-full flex-1 flex-col-center " onSubmit={(event) => handleVerifyOtp(event)} >
                            <span className=" text-header-font-color mb-8 mt-4 lg:mb-12 flex-center w-full text-center text-[14px]">{`کد ارسالی به شماره همراه خود را در این قسمت وارد کنید`}</span>
                            <input type="number" placeholder="کد اعتبارسنجی" className="input-text  text-center" value={otp} onChange={(event) => setOtp(event.target.value)} />

                            {/* <span className=' text-[12px] mt-6'> زمان باقی مانده : </span> */}
                            <Button isLoading={isLoading} type='submit' className="w-full bg-btn-primary text-white  text-[16px] py-2 rounded-full mt-12 flex-center" onClick={event => handleVerifyOtp(event)} >
                                <span className='flex-1 text-[14px]'>اعتبارسنجی و ورود</span>
                                <span className="ml-2 text-[10px]">
                                    <CountdownCircleTimer
                                        size={32}
                                        strokeWidth={2}
                                        isPlaying
                                        duration={120}
                                        colors={["#8080FF", "#2AD4FF"]}
                                        colorsTime={[120, 60]}
                                        onComplete={finishTimer}
                                    >
                                        {({ remainingTime }) => remainingTime}
                                    </CountdownCircleTimer>
                                </span>
                            </Button>
                            <Button type='submit' className="w-full bg-btn-secondary text-black  text-[16px] py-2 rounded-full mt-4 flex-center" onClick={() => setIsSendSms(false)} >
                                <span className='flex-1 text-[14px]'>بازگشت به مرحله قبل</span>
                                <span className="ml-2 text-[10px]">

                                </span>
                            </Button>
                        </form>
                    }

                    {isAuth &&
                        <form className="w-full gap-4 space-y-4 " >

                            <Input
                                label="کد پرسنلی"
                                inputProps={{ maxLength: 8 }}
                                isInvalid={isInvalidIdentifier}
                                size='sm'
                                isDisabled
                                type="number"
                                color='primary'
                                className='text-black'
                                value={prs?.prsCode} />


                            <Input
                                label="کد ملی"
                                inputProps={{ maxLength: 8 }}
                                isInvalid={isInvalidIdentifier}
                                size='sm'
                                isDisabled
                                type="number"
                                color='primary'
                                value={prs?.meliCodee} />



                            <Input
                                label="نام و نام خانوادگی"
                                isInvalid={isInvalidIdentifier}
                                size='sm'
                                isDisabled
                                color='primary'
                                type="text"

                                value={prs?.name + " " + prs?.family} />

                            <Input
                                label="وضعیت اشتغال"
                                isInvalid={isInvalidIdentifier}
                                size='sm'
                                isDisabled
                                type="text"
                                color='primary'
                                value={prs.status == 1 ? "شاغل" : prs.status == 2 ? "بازنشسته" : "نامشخص"} onChange={() => setIdentifier(event.target.value)} />


                            <Input
                                label="منطقه"
                                isInvalid={isInvalidIdentifier}
                                size='sm'
                                isDisabled
                                type="text"
                                color='primary'
                                value={prs?.regCode + " - " + prs?.regName} />
                            <Input
                                label="وضعیت فعلی بیمه عمر "
                                isInvalid={isInvalidIdentifier}
                                size='sm'
                                isDisabled
                                type="text"
                                color={prs?.result ? 'danger' : 'success'}
                                value={prs?.result ? "غیرفعال" : " فعال"} />


                            {/* <input type="password" placeholder="رمز عبور" className="input-text  mt-4" value={password} onChange={() => setPassword(event.target.value)} /> */}
                            <div className='relative mt-2  flex justify-start items-start text-right'>
                                <Checkbox size='sm' isSelected={isSubmit} onValueChange={setIsSubmit} radius="md" >
                                    <p className='text-[12px] text-justify'>
                                        اینجانب با اطلاع و آگاهی کامل از شرایط قرارداد بیمه عمر مکمل1404-1403( حق بیمه سالانه4/801/824ریال و پرداخت غرامت نقص عضو،ازکارافتادگی در اثر حوادث و فوت700/000/000ریال)  انصراف خود را از این بیمه اعلام می نمایم.
                                    </p>

                                </Checkbox>
                            </div>
                            {/* isDisabled={!isSubmit} */}
                            <Button isLoading={isLoading} type='submit' color='success' className="w-full  text-white text-[16px] py-2 rounded-full mt-8 flex-center " onClick={() => handleSubmit(event)}>
                                تایید
                            </Button>
                            <Button type='submit' color='danger' className="w-full  text-white text-[16px] py-2 rounded-full mt-8 flex-center " onClick={() => handleExit(event)}>
                                خروج
                            </Button>

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
                                گزارش آماری
                            </ModalHeader>
                            <ModalBody className='overflow-auto scroll-auto max-h-[450px]'>

                                <div dir="rtl" className=' bg-white' >
                                    <div dir="rtl" className=' bg-white p-4 ' ref={componentRef}>

                                        <p className='font-bold my-8 text-center'> گزارش آماری انصراف از بیمه عمر استان خراسان رضوی
                                            <span className='text-[12px] '> (تاریخ گزارش : {new Date().toLocaleString('fa-IR')})</span>
                                        </p>

                                        <div className='grid grid-cols-3 gap-4 font-bold m-8 ring-1 ring-black rounded-md p-4'>
                                            <div className='p-4 col-span-1 bg-slate-300 rounded-lg flex flex-col'>
                                                <p className='text-center'>کل پرسنل</p>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex flex-col'>
                                                        <span className='mt-4'> کل : {result?.allShaqel + result?.allBaz} </span>

                                                        <span className='mt-4'> انصراف: {result?.allcancelShaqel + result?.allCancelBaz} </span>
                                                    </div>
                                                    <span className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white'>
                                                        {(((result?.allcancelShaqel + result?.allCancelBaz) / (result?.allShaqel + result?.allBaz)) * 100).toFixed(2)} %
                                                    </span>
                                                </div>

                                            </div>
                                            <div className='p-4 col-span-1 bg-slate-300 rounded-lg flex flex-col'>
                                                <p className='text-center'>شاغلین</p>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex flex-col'>
                                                        <span className='mt-4'> کل : {result?.allShaqel} </span>
                                                        <span className='mt-4'> انصراف: {result?.allcancelShaqel} </span>
                                                    </div>
                                                    <span className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white'>
                                                        {(((result?.allcancelShaqel) / (result?.allShaqel)) * 100).toFixed(2)} %
                                                    </span>
                                                </div>

                                            </div>
                                            <div className='p-4 col-span-1 bg-slate-300 rounded-lg flex flex-col'>
                                                <p className='text-center'>بازنشسته</p>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex flex-col'>
                                                        <span className='mt-4'> کل : {result?.allBaz} </span>
                                                        <span className='mt-4'> انصراف: {result?.allCancelBaz} </span>
                                                    </div>
                                                    <span className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white '>
                                                        {(((result?.allCancelBaz) / (result?.allBaz)) * 100).toFixed(2)} %
                                                    </span>
                                                </div>

                                            </div>



                                        </div>
                                        <Table className='' isStriped aria-label="Example static collection table " >
                                            <TableHeader>
                                                <TableColumn >منطقه</TableColumn>
                                                <TableColumn > نام منطقه </TableColumn>
                                                <TableColumn > شاغل</TableColumn>
                                                <TableColumn >انصرافی</TableColumn>
                                                <TableColumn > بازنشسته</TableColumn>
                                                <TableColumn >انصرافی</TableColumn>
                                                <TableColumn >کل</TableColumn>
                                                <TableColumn >انصرافی</TableColumn>
                                                <TableColumn >درصد انصراف</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {report.map(item => {
                                                    return (
                                                        <TableRow TableRow key="1">
                                                            <TableCell>{item.regCode}</TableCell>
                                                            <TableCell className='text-[12px] '>{item.regName}</TableCell>
                                                            <TableCell>{item.countShaqelPrs}</TableCell>
                                                            <TableCell>{item.countCancelShaqelPrs}</TableCell>
                                                            <TableCell>{item.countBazPrs}</TableCell>
                                                            <TableCell>{item.countCancelBazPrs}</TableCell>
                                                            <TableCell>{item.countBazPrs + item.countShaqelPrs}</TableCell>
                                                            <TableCell>{item.countCancelShaqelPrs + item.countCancelBazPrs}</TableCell>
                                                            <TableCell>% {((item.countCancelBazPrs + item.countCancelShaqelPrs) / (item.countBazPrs + item.countShaqelPrs) * 100).toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    )
                                                })

                                                }



                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    isLoading={isLoadingReport}
                                    onClick={handlePrint}
                                    color="success"
                                    variant="light"
                                >
                                    چاپ گزارش
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