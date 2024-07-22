"use client"

import ImageLoaderCard from '@/components/module/user/ImageLoaderCard'
import { Button, Divider } from '@nextui-org/react'
import React, { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
function ExamCard({ image, lecturer, region }) {


    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ExamCard',
        onAfterPrint: () => console.log('Printed PDF successfully!'),
        copyStyles: true
    });


    return (
        <div dir="rtl" className=' bg-white' >
            <div dir="rtl" className=' bg-white m-4 mt-8' ref={componentRef}>


                <div dir="rtl" className='p-4 border-slate-700 border-2 rounded-md bg-white m-4' >
                    <div className='flex items-center justify-center w-full p-4'>
                        <div>
                            <img
                                src={"images/anjomanlogo.png"}
                                alt=""
                                width="100"
                                height="100"
                                className="rounded-sm"
                            />

                        </div>

                        <div className='flex-1 items-center justify-center text-center font-bold'>
                            <p>جمهوری اسلامی ایران</p>
                            <p>وزارت آموزش و پرورش</p>
                            <p>اداره کل آموزش و پرورش خراسان رضوی</p>
                            <p>کارت ورود به جلسه آزمون جذب مدرسین آموزش خانواده</p>
                        </div>
                        <div>
                            <ImageLoaderCard
                                imageUrl={image}
                                code={"profile"}
                            />
                        </div>
                    </div>
                    <Divider className='my-4' />
                    <div className='grid grid-cols-2 gap-2'>
                        <div className='col-span-1 grid grid-cols-2 border-1 border-slate-500 p-2 text-right flex-center'>
                            <p className='col-span-1 p-2 text-black font-bold text-[14px]'>شماره داوطلبی :</p>
                            <p className='col-span-1 bg-slate-300 text-black p-2 text-center  text-[14px]'>{lecturer.seatCode} </p>

                        </div>
                        <div className='col-span-1 grid grid-cols-2 border-1  border-slate-500 p-2  text-right flex-center'>
                            <p className='col-span-1 p-2 text-black font-bold text-[14px]'>نام و نام خانوادگی  :</p>
                            <p className='col-span-1 bg-slate-300 text-black p-2 text-center text-[14px]'>{lecturer.name} </p>

                        </div>
                        <div className='col-span-1 grid grid-cols-2 border-1  border-slate-500 p-2  text-right flex-center'>
                            <p className='col-span-1 p-2 text-black font-bold text-[14px]'>شماره ملی : </p>
                            <p className='col-span-1 bg-slate-300 text-black p-2 text-center text-[14px]'>{lecturer.meliCode} </p>

                        </div>
                        <div className='col-span-1 grid grid-cols-2 border-1  border-slate-500 p-2  text-right flex-center'>
                            <p className='col-span-1 p-2 text-black font-bold text-[14px]'>منطقه محل خدمت :</p>
                            <p className='col-span-1 bg-slate-300 text-black p-2 text-center text-[14px]'>{region} </p>

                        </div>
                    </div>

                    <Divider className='my-4' />
                    <div className='grid grid-cols-2 gap-2'>
                        <div className='col-span-1 grid grid-cols-2 border-1  border-slate-500 p-2  text-right flex-center'>
                            <p className='col-span-1 p-2 text-black font-bold text-[14px]'>نام حوزه آزمون :</p>
                            <p className='col-span-1 bg-slate-300 text-black p-2 text-center text-[14px]'>{!lecturer.testCenter ? " در انتظار تخصیص توسط استان" : lecturer?.testCenter?.name} </p>

                        </div>
                        <div className='col-span-1 grid grid-cols-2 border-1  border-slate-500 p-2  text-right flex-center'>
                            <p className='col-span-1 p-2 text-black font-bold text-[14px]'>تلفن :</p>
                            <p className='col-span-1 bg-slate-300 text-black p-2 text-center text-[14px]'>{!lecturer.testCenter ? " در انتظار تخصیص توسط استان" : lecturer?.testCenter?.phone} </p>

                        </div>
                        <div className='col-span-2 grid grid-cols-4 border-1  border-slate-500 p-2  text-right flex-center'>
                            <p className='col-span-1 p-2 text-black font-bold text-[14px]'>آدرس  :</p>
                            <p className='col-span-3 bg-slate-300 text-black p-2 text-center text-[14px]'>{!lecturer.testCenter ? " در انتظار تخصیص توسط استان" : lecturer?.testCenter?.address} </p>

                        </div>

                    </div>
                    <Divider className='my-4' />
                    <div className='flex flex-col items-start text-right font-bold text-[14px] justify-start'>
                        <p>شروع آزمون روز جمعه راس ساعت 9 صبح پنج مرداد ماه 1403</p>

                        <p>
                            همراه داشتن کارت شناسایی معتبر مانند کارت ملی یا کارت پرسنلی الزام می باشد.
                        </p>
                        <p>همراه داشتن مداد، پاک کن و خودکار ( آبی یا مشکی ) ضروری می‌باشد.
                        </p>
                        <p>
                            آزمون دارای نمره منفی می‌باشد
                        </p>
                        <p>
                            جهت رفع نقص کارت ورود به جلسه به کارشناسی انجمن اولیا و مربیان اداره محل خدمت خود مراجعه کنید
                        </p>
                        <p>
                            حداکثر یک ساعت قبل از شروع آزمون در محل آزمون حضور یابید. ضروریست داوطلب حوزه آزمون خود را از روز قبل شناسایی نماید.
                        </p>
                        <p>
                            اسامی پذیرفته شدگان جهت حضور در مرحله مصاحبه از طریق سامانه انجمن اولیا و مربیان استان خراسان رضوی به نشانی https://peyvand.razaviedu.ir/ اطلاع رسانی خواهد شد.
                        </p>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-end m-2'>
                <Button Button className='bg-blue-500 text-white text-[12px] h-auto py-2 ' onClick={handlePrint
                }>چاپ کارت</Button>
            </div>
        </div>

    )
}

export default ExamCard