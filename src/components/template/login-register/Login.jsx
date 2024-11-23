

import { useAppProvider } from '@/components/context/AppProviders';
import { valiadtePassword, valiadtePhone } from '@/utils/auth';
import { authTypes } from '@/utils/constants'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { IoMdArrowRoundForward } from 'react-icons/io'
import { toast } from 'react-toastify';
import { Button, Input, Spinner, Tooltip } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/utils/icon';
import { BsFillQuestionCircleFill } from "react-icons/bs";
import secureLocalStorage from 'react-secure-storage';


function Login({ role, SetAuthTypesForm }) {
    const { phone, setPhone } = useAppProvider();
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isInvalidPhone, setIsInvalidPhone] = useState(false)
    const [isInvalidPassword, setIsInvalidPassword] = useState(false)
    const toggleVisibility = () => setIsVisible(!isVisible);
    const router = useRouter();

    useEffect(() => {


        setPassword(secureLocalStorage.getItem("hash_foj23ndas34dahsd2syt43fdkd"));
        setPassword(secureLocalStorage.getItem("hash_pjoijfgdf4gfgsdfsd456fxpo"));
    }, []);

    const handleForgotPassword = async () => {
        if (!phone) {
            setIsInvalidPhone(true)
            toast.error("برای دریافت رمز شماره همراه را وارد نمایید");
            return false;
        }
        if (!valiadtePhone(phone?.trim())) {
            setIsInvalidPhone(true)
            toast.error("شماره همراه معتبر نمی باشد");
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/forgot-password/sendsms", {
                method: "POST",
                header: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone,
                    role: role.name,
                })
            });

            const data = await response.json();
            if (data.status == 200) {
                toast.success(data.message)
                SetAuthTypesForm(authTypes.FORGOTPASS);
            } else {
                toast.info(data.message)
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }


    }
    const loginHandler = async (event) => {
        event.preventDefault();

        if (!valiadtePhone(phone?.trim())) {
            setIsInvalidPhone(true)
            toast.error("شماره همراه صحیح نمی باشد");
            return false;
        }

        if (!password?.trim()) {
            setIsInvalidPassword(true)
            toast.error("رمز عبور را وارد نمایید");
            return false;
        }

        if (!valiadtePassword(password?.trim())) {
            setIsInvalidPassword(true)
            toast.error("رمز عبور ترکیبی از حرف و عدد می باشد");
            return false;
        }
        setIsLoadingLogin(true);
        try {
            const res = await fetch("api/auth/login", {
                method: "POST",
                header: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({ phone, password, role: role.name })
            });

            const data = await res.json();
            
            if (data.status == 200) {
                toast.success(data.message);
                secureLocalStorage.setItem("hash_foj23ndas34dahsd2syt43fdkd", phone);
                secureLocalStorage.setItem("hash_pjoijfgdf4gfgsdfsd456fxpo", password);
                if (role.name == 'modir') {
                    router.push("/p-modir");
                } else if (role.name == 'admin') {
                    router.push("/p-admin");
                } else if (role.name == 'lecturer') {
                    router.push("/p-lecturer");
                }
                else {
                    toast.info("صفحه ای برای این عنوان ایجاد نشده است")
                }

            } else {
                toast.error(data.message);
            }
            setIsLoadingLogin(false);
        } catch (error) {
            setIsLoadingLogin(false);
            toast.error("خطای ناشناخته")
        }

    }

    return (

        <div>
            <div className="min-w-64 w-80 h-96">
                <span className="bg-btn-secondary m-2 rounded-full w-6 h-6 cursor-pointer flex-center" >
                    <IoMdArrowRoundForward onClick={() => SetAuthTypesForm(authTypes.ROLES)} />
                </span>
                <span className=" text-header-font-color md:mb-12 flex-center mb-8 ">{`ورود به پنل کاربری  `}
                    <span className=' mr-1 text-slate-700 bg-slate-200 px-1 rounded-md'>{role.title}</span>
                </span>
                <div className="w-full" >
                    <form className="w-full " onSubmit={() => loginHandler(event)} >

                        <Input
                            label="شماره همراه"
                            inputProps={{ maxLength: 11 }}
                            isInvalid={isInvalidPhone}
                            size='sm'
                            // maxLength={11}
                            // placeholder="ترکیب حروف و اعداد"
                            errorMessage="شماره همراه 11 رقمی"
                            type="text"
                            name="UserName"
                            className="max-w-xs "
                            value={phone} onChange={(event) => setPhone(event.target.value)} />
                        {/* <input type="password" placeholder="رمز عبور" className="input-text  mt-4" value={password} onChange={() => setPassword(event.target.value)} /> */}
                        <Input
                            label="رمز عبور"

                            isInvalid={isInvalidPassword}
                            size='sm'
                            // placeholder="ترکیب حروف و اعداد"
                            errorMessage="  ترکیب حروف و اعداد و حداقل 8 کاراکتر"
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
                            name="Password"
                            className="max-w-xs mt-4  "
                            value={password} onChange={(event) => setPassword(event.target.value)}
                        />
                        <div className='relative flex items-center justify-center  mt-8 gap-x-2'>
                            <Button type='submit' isLoading={isLoadingLogin} tabIndex={1} className="w-full bg-btn-primary text-white   py-2 rounded-full" onClick={() => loginHandler(event)}>ورود</Button>
                            <Tooltip
                                // color="danger"
                                content="فراموشی رمز عبور "
                            >
                                <span className='flex-center relative mx-4'>
                                    <BsFillQuestionCircleFill className='w-6 h-6 text-gray-500 absolute cursor-pointer ' onClick={() => handleForgotPassword()} />
                                    {
                                        isLoading && <Spinner className='absolute' />
                                    }
                                    {/* <Button className='cursor-pointer w-6 h-6 bg-transparent' isLoading={isLoading}>

                                    </Button> */}
                                </span>
                            </Tooltip>
                        </div>
                        <button className="w-full bg-btn-secondary text-btn-font-secondary   py-2 rounded-full mt-4" onClick={() => SetAuthTypesForm(authTypes.REGISTER)}>ثبت نام</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login