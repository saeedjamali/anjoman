
import { authTypes } from '@/utils/constants'
import React, { useState } from 'react'
import { IoMdArrowRoundForward } from 'react-icons/io'
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'
import { useAppProvider } from '@/components/context/AppProviders';
import { Button } from '@nextui-org/react';

function Sms({ SetAuthTypesForm, role }) {
    const [isLoading, setIsLoading] = useState(false)
    const { phone, password, identifier, year } = useAppProvider();
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const finishTimer = () => {
        SetAuthTypesForm(authTypes.REGISTER);
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

                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    header: {
                        "content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        phone,
                        password,
                        role: role.name,
                        identifier,
                        year
                    })
                });

                const data = await response.json();

                if (data.status == 201) {
                  
                    if (role.name == 'modir') {
                        router.push("/p-modir");
                        toast.success(data.message);
                    } else if (role.name == 'admin') {
                        router.push("/p-admin");
                        toast.success(data.message);
                        // toast.info(" ایجاد شد")
                    }
                    else {
                        toast.info("صفحه ای برای این عنوان ایجاد نشده است")
                    }

                } else {
                    toast.error(data.message);
                }

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
            <div className="min-w-64 md:w-80 flex flex-col h-96">
                <span className="bg-btn-secondary m-2 rounded-full w-6 h-6 cursor-pointer flex-center" onClick={() => SetAuthTypesForm(authTypes.REGISTER)}>
                    <IoMdArrowRoundForward />
                </span>
                <div className="w-full flex-1 flex flex-col "  >
                    <form className="w-full flex-1 flex-col-center " onSubmit={(event) => handleVerifyOtp(event)} >
                        <span className="font-shabnam text-header-font-color md:mb-12 flex-center mt-8 w-full text-center">{`کد ارسالی به شماره همراه خود را در این قسمت وارد کنید`}</span>
                        <input type="number" placeholder="کد اعتبارسنجی" className="input-text  text-center" value={otp} onChange={(event) => setOtp(event.target.value)} />

                        {/* <span className='font-iranyekan text-[12px] mt-6'> زمان باقی مانده : </span> */}
                        <Button isLoading={isLoading} type='submit' className="w-full bg-btn-primary text-white font-iranyekan text-[16px] py-2 rounded-full mt-12 flex-center" onClick={event => handleVerifyOtp(event)} >
                            <span className='flex-1'>اعتبارسنجی و ثبت نام</span>
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

export default Sms