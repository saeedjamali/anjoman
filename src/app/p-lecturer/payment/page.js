"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

function page() {


    const [resCode, setResCode] = useState();
    const [amount, setAmount] = useState();
    const [description, setDescription] = useState();
    const [retrivalRefNo, setRetrivalRefNo] = useState();
    const [orderId, setOrderId] = useState();
    const [systemTraceNo, setSystemTraceNo] = useState();
    console.log("data--->", "asdasdasd")
    useEffect(() => {

        const veifyPayment = async () => {
            try {
                const response = await fetch("https://sadad.shaparak.ir/api/v0/Advice/Verify");
                const data = await response.json();
                console.log("data--->", data)
            } catch (error) {
                toast.error("خطا در فراخوانی اطلاعات")
            }
        }
        veifyPayment();
    }, [])
    return (
        <div className='w-full h-screen flex-center'>

            <Card className="min-w-[600px]">
                <CardHeader className="flex gap-3 bg-blue-500">

                    <div className="flex text-white">
                        <p className="text-md">اطلاعات پرداختی</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className='w-full gap-y-2'>
                    <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                        <p className='w-[30%] flex-center bg-blue-300 p-4 '>
                            نتیجه تراکنش
                        </p>
                        <p className='w-[70%] flex-center p-4'>
                            موفقیت آمیز
                        </p>
                    </div>
                    <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                        <p className='w-[30%] flex-center bg-blue-300 p-4 '>
                            مبلغ تراکنش
                        </p>
                        <p className='w-[70%] flex-center p-4'>
                            2500000
                        </p>
                    </div>
                    <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                        <p className='w-[30%] flex-center bg-blue-300 p-4 '>
                            شرح نتیجه تراکنش
                        </p>
                        <p className='w-[70%] flex-center p-4'>
                            موفقیت آمیز
                        </p>
                    </div>
                    <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                        <p className='w-[30%] flex-center bg-blue-300 p-4 '>
                            شماره مرجع پیگیری
                        </p>
                        <p className='w-[70%] flex-center p-4'>
                            1231231
                        </p>
                    </div>
                    <div className='flex items-center justify-start border-[1px] border-blue-300 rounded-md'>
                        <p className='w-[30%] flex-center bg-blue-300 p-4 '>
                            شناسه ثبت نام
                        </p>
                        <p className='w-[70%] flex-center p-4'>
                            1231231
                        </p>
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className='flex items-end justify-center'>
                    <Link
                        href="https://peyvand.razaviedu.ir/p-lecturer"
                    >
                        بازگشت به صفحه اصلی
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default page