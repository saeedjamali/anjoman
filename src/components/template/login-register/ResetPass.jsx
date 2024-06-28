

import { useAppProvider } from '@/components/context/AppProviders';
import { valiadtePassword, valiadtePhone } from '@/utils/auth';
import { authTypes } from '@/utils/constants'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoMdArrowRoundForward } from 'react-icons/io'
import { toast } from 'react-toastify';
import { Button, Input, Tooltip } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/utils/icon';
import { BsFillQuestionCircleFill } from "react-icons/bs";


function ResetPass({ role, SetAuthTypesForm }) {
    const { phone, setPhone } = useAppProvider();
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleRepeat, setIsVisibleRepeat] = useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = useState(false)
    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleVisibilityRepeat = () => setIsVisibleRepeat(!isVisibleRepeat);

    const handleResetPassword = async () => {
        if (!valiadtePassword(password?.trim())) {
            setIsInvalidPassword(true)
            toast.error("رمز عبور باید 8 رقمی و شامل یک حرف و یک عدد باشد");

            return false
        }

        if (password !== passwordRepeat) {
            toast.error("رمز عبور و تکرار یکسان نمی باشد");
            return false
        }

        try {
            setIsLoading(true)
            const response = await fetch(`api/auth/forgot-password/resetpass`, {
                method: "POST",
                header: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({ phone, role: role.name, password })
            });
            const data = await response.json()
            if (data.status == 201) {
                toast.success(data.message)
                SetAuthTypesForm(authTypes.LOGIN);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("خطای ناشناخته")
            setIsLoading(false)
        }
        setIsLoading(false)
    }



    return (

        <div>
            <div className="min-w-64 w-80 h-96">
                <span className="bg-btn-secondary m-2 rounded-full w-6 h-6 cursor-pointer flex-center" >
                    <IoMdArrowRoundForward onClick={() => SetAuthTypesForm(authTypes.ROLES)} />
                </span>
                <span className="font-shabnamBold text-header-font-color md:mb-12 flex-center mb-8 ">رمز عبور جدید</span>
                <div className="w-full" >
                    <form className="w-full " >

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
                            className="max-w-xs mt-4  "
                            value={password} onChange={(event) => setPassword(event.target.value)}
                        />
                        <Input
                            label="تکرار رمز عبور"
                            size='sm'
                            // placeholder="ترکیب حروف و اعداد"

                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibilityRepeat}>
                                    {isVisibleRepeat ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisibleRepeat ? "text" : "password"}
                            className="max-w-xs mt-4  "
                            value={passwordRepeat} onChange={(event) => setPasswordRepeat(event.target.value)}
                        />
                        <Button isLoading={isLoading} type='submit' color="primary" className="w-full text-white   py-2 rounded-full mt-12" onClick={() => handleResetPassword()}>تایید</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPass