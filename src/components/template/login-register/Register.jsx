import { useAppProvider } from '@/components/context/AppProviders';
import { valiadteMeliCode, valiadtePassword, valiadtePhone, valiadteRegionCode, valiadteSchoolCode } from '@/utils/auth';
import { authTypes, roles, year } from '@/utils/constants'
import { Button } from '@nextui-org/react';
import { Input } from "@nextui-org/react";
import React, { useState } from 'react'
import { IoMdArrowRoundForward } from 'react-icons/io'
import { toast } from 'react-toastify';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/utils/icon';


function Register({ SetAuthTypesForm, role }) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isInvalidPhone, setIsInvalidPhone] = useState(false)
    const [isInvalidPassword, setIsInvalidPassword] = useState(false)
    const [isInvalidIdentifier, setIsInvalidIdentifier] = useState(false)
    const toggleVisibility = () => setIsVisible(!isVisible);


    //? Identifier
    //* Modir : school code
    //* Admin : region code
    //* Lecturer : meli code
    const { phone,
        setPhone,
        identifier,
        setIdentifier,
        password,
        setPassword } = useAppProvider();
    const [waitForSendOtpCode, setWaitForSendOtpCode] = useState(false);

    const handleRegister = async (event) => {

        event.preventDefault();
        const currentYear = year.find(y => y.currentYear);

        if (role == roles.MODIR) {
            if (!valiadteSchoolCode(identifier.trim())) {
                setIsInvalidIdentifier(true)
                toast.error("کد واحد سازمانی باید 8 رقمی باشد.");
                return false
            }

            if (!valiadtePhone(phone?.trim())) {
                toast.error("شماره همراه صحیح نمی باشد.");
                setWaitForSendOtpCode(false);
                setIsInvalidPhone(true)
                return false
            }
            if (!valiadtePassword(password?.trim())) {
                setIsInvalidPassword(true)
                toast.error("رمز عبور باید 8 رقمی و شامل یک حرف و یک عدد باشد");
                setWaitForSendOtpCode(false);
                return false
            }



            setWaitForSendOtpCode(true);
            const res = await fetch(`/api/unit/${identifier}/${currentYear.name}`);
            const data = await res.json();
            if (data.status == 200) {
                //Fetch data from user model for duplicate user register
                // ......
                const response = await fetch(`/api/user/${phone}/${role.name}/${identifier}`);
                const datares = await response.json();
                if (datares.status == 200) {

                    // check in done... --> send OPT

                    const res = await fetch("/api/auth/sms/send", {
                        method: "POST",
                        header: {
                            "content-Type": "application/json"
                        },
                        body: JSON.stringify({ phone })
                    });
                    const data = await res.json();
                    if (data.status == 200) {
                        SetAuthTypesForm(authTypes.SMS);
                        toast.info("کد به شماره همراه ثبت شده ارسال شد.");
                    } else {
                        toast.error("خطا در ارسال کد")
                    }
                    setWaitForSendOtpCode(false);
                } else {
                    toast.error(datares.message);
                    setWaitForSendOtpCode(false);
                }

            } else {

                toast.error("چنین کد واحد سازمانی فعالی در سال تحصیلی جاری وجود ندارد");
                setWaitForSendOtpCode(false);
            }
            setWaitForSendOtpCode(false);
            setIsInvalidPhone(false)
            setIsInvalidPassword(false)
            setIsInvalidIdentifier(false)

        }

        if (role == roles.ADMIN) {
            if (!valiadteRegionCode(identifier.trim())) {
                toast.error("کد منطقه باید 4 رقمی باشد.");
                setIsInvalidIdentifier(true)
                return false
            }
            if (!valiadtePhone(phone?.trim())) {
                toast.error("شماره همراه صحیح نمی باشد.");
                setIsInvalidPhone(true)
                return false
            }

            if (!valiadtePassword(password?.trim())) {
                toast.error("رمز عبور باید 8 رقمی و شامل یک حرف و یک عدد باشد");
                setIsInvalidPassword(true)
                return false
            }



            try {
                setWaitForSendOtpCode(true);
                const res = await fetch(`/api/region/${identifier}`);
                const data = await res.json();
                if (data.status == 200) {
                    //toast.success(data.message)
                    const response = await fetch(`/api/user/${phone}/${role.name}/${identifier}`);
                    const datares = await response.json();
                    if (datares.status == 200) {
                        // check in done... --> send OPT

                        const res = await fetch("/api/auth/sms/send", {
                            method: "POST",
                            header: {
                                "content-Type": "application/json"
                            },
                            body: JSON.stringify({ phone })
                        });
                        const data = await res.json();
                        // console.log("Data Response --->", data);
                        if (data.status == 200) {
                            SetAuthTypesForm(authTypes.SMS);
                            toast.info("کد به شماره همراه ثبت شده ارسال شد.");
                        } else {
                            toast.error("خطا در ارسال کد")
                        }
                        setWaitForSendOtpCode(false);

                    } else {
                        toast.error(datares.message)
                        setWaitForSendOtpCode(false);
                    }

                } else {
                    toast.error(data.message)
                }
                setWaitForSendOtpCode(false);

                setIsInvalidPhone(false)
                setIsInvalidPassword(false)
                setIsInvalidIdentifier(false)
            } catch (error) {
                toast.error("خطای ناشناحته")
                setWaitForSendOtpCode(false);
            }

        }



        if (role == roles.LECTURER) {
            if (!valiadteMeliCode(identifier.trim())) {
                setIsInvalidIdentifier(true)
                toast.error("کد ملی باید 10 رقمی باشد.");
                return false
            }

            if (!valiadtePhone(phone?.trim())) {
                toast.error("شماره همراه صحیح نمی باشد.");
                setWaitForSendOtpCode(false);
                setIsInvalidPhone(true)
                return false
            }
            if (!valiadtePassword(password?.trim())) {
                setIsInvalidPassword(true)
                toast.error("رمز عبور باید 8 رقمی و شامل یک حرف و یک عدد باشد");
                setWaitForSendOtpCode(false);
                return false
            }



            setWaitForSendOtpCode(true);


            const response = await fetch(`/api/user/${phone}/${role.name}/${identifier}`);
            const datares = await response.json();
            if (datares.status == 200) {

                // check in done... --> send OPT

                const res = await fetch("/api/auth/sms/send", {
                    method: "POST",
                    header: {
                        "content-Type": "application/json"
                    },
                    body: JSON.stringify({ phone })
                });
                const data = await res.json();
                if (data.status == 200) {
                    SetAuthTypesForm(authTypes.SMS);
                    toast.info("کد به شماره همراه ثبت شده ارسال شد.");
                } else {
                    toast.error("خطا در ارسال کد")
                }
                setWaitForSendOtpCode(false);
            } else {
                toast.error(datares.message);
                setWaitForSendOtpCode(false);
            }


            setWaitForSendOtpCode(false);
            setIsInvalidPhone(false)
            setIsInvalidPassword(false)
            setIsInvalidIdentifier(false)

        }

    }

    return (
        <div>
            <div className="min-w-64 w-80 flex flex-col h-96">
                <span className="bg-btn-secondary m-2 rounded-full w-6 h-6 cursor-pointer flex-center " onClick={() => SetAuthTypesForm(authTypes.LOGIN)}>
                    <IoMdArrowRoundForward />
                </span>
                <div className="w-full flex-1" >
                    <span className=" text-header-font-color md:mb-8 flex-center mb-6">{`ثبت نام ${role.title}`}</span>
                    <form className="w-full" >
                        {role == roles.MODIR &&
                            <Input
                                label="کد واحد سازمانی"
                                inputProps={{ maxLength: 8 }}
                                isInvalid={isInvalidIdentifier}
                                size='sm'
                                // maxLength={11}
                                // placeholder="ترکیب حروف و اعداد"
                                errorMessage="کد واحد سازمانی 8 رقم می باشد"
                                type="number"
                                className="max-w-xs "
                                value={identifier} onChange={() => setIdentifier(event.target.value)} />
                            // <input type="number" placeholder="کد واحد سازمانی" maxLength={8} minLength={8} className="input-text" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
                        }
                        {role == roles.ADMIN &&
                            <Input
                                label="کد منطقه"
                                inputProps={{ maxLength: 8 }}
                                isInvalid={isInvalidIdentifier}
                                size='sm'
                                // maxLength={11}
                                // placeholder="ترکیب حروف و اعداد"
                                errorMessage="کد منطقه 4 رقم می باشد"
                                type="number"
                                className="max-w-xs "
                                value={identifier} onChange={() => setIdentifier(event.target.value)} />
                            // <input type="number" placeholder="کد منطقه" className="input-text" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
                        }
                        {role == roles.LECTURER &&
                            <Input
                                label="کد ملی"
                                inputProps={{ maxLength: 8 }}
                                isInvalid={isInvalidIdentifier}
                                size='sm'
                                // maxLength={11}
                                // placeholder="ترکیب حروف و اعداد"
                                errorMessage="کد ملی 10 رقمی"
                                type="number"
                                className="max-w-xs "
                                value={identifier} onChange={() => setIdentifier(event.target.value)} />
                        }
                        {role == roles.SHERKAT &&
                            <input type="number" placeholder="کد شرکت" className="input-text" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
                        }

                        {/* <input type="number" placeholder="شماره همراه" className="input-text mt-4" value={phone} onChange={(event) => setPhone(event.target.value)} />
                        <input type="password" placeholder="رمز عبور" className="input-text  mt-4" value={password} onChange={(event) => setPassword(event.target.value)} /> */}

                        <Input
                            label="شماره همراه"
                            inputProps={{ maxLength: 11 }}
                            isInvalid={isInvalidPhone}
                            size='sm'
                            // maxLength={11}
                            // placeholder="ترکیب حروف و اعداد"
                            errorMessage="شماره همراه 11 رقمی"
                            type="number"
                            className="max-w-xs "
                            value={phone} onChange={(event) => setPhone(event.target.value)} />
                        {/* <input type="password" placeholder="رمز عبور" className="input-text  mt-4" value={password} onChange={() => setPassword(event.target.value)} /> */}
                        <Input
                            label="رمز عبور انتخابی"
                            description="این رمز برای ورود های بعدی استفاده خواهد شد"
                            isInvalid={isInvalidPassword}
                            size='sm'
                            // placeholder="ترکیب حروف و اعداد"
                            errorMessage="ترکیب حروف و اعداد و حداقل 8 کاراکتر"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="max-w-xs  "
                            value={password} onChange={(event) => setPassword(event.target.value)}
                        />
                        <Button isLoading={waitForSendOtpCode} type='submit' className="w-full bg-btn-primary text-white text-[16px] py-2 rounded-full mt-4 flex-center " onClick={() => handleRegister(event)}>
                            ارسال کد یکبار مصرف
                        </Button>
                    </form>
                </div>
                <div className="w-full flex-center mt-6 gap-x-2 mb-4">
                    <span className="w-3 h-3 bg-btn-primary inline-block rounded-full"></span>
                    <span className="w-3 h-3 bg-btn-secondary inline-block rounded-full"></span>
                    <span className="w-3 h-3 bg-btn-secondary inline-block rounded-full"></span>
                </div>
            </div>
        </div>
    )
}

export default Register