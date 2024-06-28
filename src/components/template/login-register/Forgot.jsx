
import { authTypes } from '@/utils/constants'
import React, { useState } from 'react'
import { IoMdArrowRoundForward } from 'react-icons/io'
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'
import { useAppProvider } from '@/components/context/AppProviders';
import { Button } from '@nextui-org/react';

function Forgot({ SetAuthTypesForm, role }) {
    const [isLoading, setIsLoading] = useState(false)
    const { phone, password, identifier, year } = useAppProvider();
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const finishTimer = () => {
        SetAuthTypesForm(authTypes.LOGIN);
    }

    const handleVerifyOtp = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            const res = await fetch("/api/auth/forgot-password/verifysms", {
                method: "POST",
                header: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({ phone, code: otp })
            });
            const data = await res.json();

            if (data.status == 200) {
                SetAuthTypesForm(authTypes.RESETPASS)




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
    return (
        <div className='h-full'>
            <div className="min-w-64 w-80 flex flex-col h-96">
                <span className="bg-btn-secondary m-2 rounded-full w-6 h-6 cursor-pointer flex-center" onClick={() => SetAuthTypesForm(authTypes.LOGIN)}>
                    <IoMdArrowRoundForward />
                </span>
                <div className="w-full flex-1 flex flex-col "  >
                    <form className="w-full flex-1 flex-col-center " onSubmit={(event) => handleVerifyOtp(event)} >
                        <span className=" text-header-font-color mb-8 mt-4 lg:mb-12 flex-center w-full text-center text-[14px]">{`کد ارسالی به شماره همراه خود را در این قسمت وارد کنید`}</span>
                        <input type="number" placeholder="کد اعتبارسنجی" className="input-text  text-center" value={otp} onChange={(event) => setOtp(event.target.value)} />

                        {/* <span className='text-[12px] mt-6'> زمان باقی مانده : </span> */}
                        <Button isLoading={isLoading} type='submit' className="w-full bg-btn-primary text-white text-[16px] py-2 rounded-full mt-12 flex-center" onClick={event => handleVerifyOtp(event)} >
                            <span className='flex-1 text-[14px]'>اعتبارسنجی و تغییر رمز</span>
                            <span className="ml-3 text-[10px]">
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
                    </form>
                </div>
                <div className="w-full flex-center mt-6 gap-x-2">
                    <span className="w-3 h-3 bg-btn-secondary inline-block rounded-full"></span>
                    <span className="w-3 h-3 bg-btn-primary inline-block rounded-full"></span>
                    <span className="w-3 h-3 bg-btn-secondary inline-block rounded-full"></span>
                </div>
            </div>
        </div>
    )
}

export default Forgot