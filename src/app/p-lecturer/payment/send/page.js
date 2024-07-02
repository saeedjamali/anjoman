"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button } from "@nextui-org/react";
import { useAppProvider } from '@/components/context/AppProviders';

function page() {


    const [merchantId, setMerchantId] = useState("000000140332725");
    const [terminalId, setTerminalId] = useState("24073676");

    const [merchantKey, setMerchantKey] = useState("KTje3RNIhbijwGG2p69YQraFN5errUTV");
    const [amount, setAmount] = useState(10000);
    const [orderId, setOrderId] = useState(Math.floor(Math.random() * 100000000000) + 10000000000);
    const { setToken, setSignData } = useAppProvider();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/lecturer/payment/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount,
                    orderId: orderId,
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
            console.log(data);
            const token = data.data.Token;
            const signData = data.signData;
            setToken(token);
            setSignData(signData);
            window.location.href = `https://sadad.shaparak.ir/Purchase?token=${token}`;
        } catch (error) {
            console.error(error);
        }
    };
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
                    <Button className="bg-green-600" onClick={handleSubmit}>پرداخت</Button>
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