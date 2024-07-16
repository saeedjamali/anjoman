import ImageLoaderCard from '@/components/module/user/ImageLoaderCard'
import { Divider } from '@nextui-org/react'
import React from 'react'

function ExamCard({ image, lecturer, region }) {
    return (
        <div>
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
                <div className='col-span-1 grid grid-cols-2 border-1 p-2  '>
                    <p className='col-span-1 p-2'>شماره داوطلبی :</p>
                    <p className='col-span-1 bg-slate-100 text-black p-2 text-center'>150326 </p>

                </div>
                <div className='col-span-1 grid grid-cols-2 border-1 p-2  '>
                    <p className='col-span-1 p-2'>نام و نام خانوادگی داوطلب :</p>
                    <p className='col-span-1 bg-slate-100 text-black p-2 text-center'>{lecturer.name} </p>

                </div>
                <div className='col-span-1 grid grid-cols-2 border-1 p-2  '>
                    <p className='col-span-1 p-2'>شماره ملی : </p>
                    <p className='col-span-1 bg-slate-100 text-black p-2 text-center'>{lecturer.meliCode} </p>

                </div>
                <div className='col-span-1 grid grid-cols-2 border-1 p-2  '>
                    <p className='col-span-1 p-2'>منطقه محل خدمت :</p>
                    <p className='col-span-1 bg-slate-100 text-black p-2 text-center'>{region} </p>

                </div>
            </div>

            <Divider className='my-4' />
            <div className='grid grid-cols-2 gap-2'>
                <div className='col-span-1 grid grid-cols-2 border-1 p-2  '>
                    <p className='col-span-1 p-2'>نام حوزه آزمون :</p>
                    <p className='col-span-1 bg-slate-100 text-black p-2 text-center'>{lecturer.name} </p>

                </div>
                <div className='col-span-1 grid grid-cols-2 border-1 p-2  '>
                    <p className='col-span-1 p-2'>تلفن :</p>
                    <p className='col-span-1 bg-slate-100 text-black p-2 text-center'>{lecturer.name} </p>

                </div>
                <div className='col-span-2 grid grid-cols-4 border-1 p-2  '>
                    <p className='col-span-1 p-2'>آدرس  :</p>
                    <p className='col-span-3 bg-slate-100 text-black p-2 text-center'>{lecturer.name} </p>

                </div>

            </div>
            <Divider className='my-4' />
            <div className='flex flex-col items-center justify-center text-center font-bold'>
                <p>شروع آزمون روز دوشنبه راس ساعت 8 صبح یازدهم تیرماه 1403</p>
                <p>حداکثر یک ساعت قبل از شروع آزمون در محل آزمون حضور یابید.ضروریست داوطلب حوزه آزمون خود را از روز قبل شناسایی نمابد.</p>
                {/* <p>جهت رفع هرگونه رفع نقص احتمالی در مشخصات فردی با کارشناس منطقه </p> */}
                <p>اسامی پذیرفته شدگان از طریق سامانه پیوند اطلاعرسانی خواهد شد.</p>
            </div>
        </div>
    )
}

export default ExamCard