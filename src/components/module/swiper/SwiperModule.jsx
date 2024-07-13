"use client"

import React, { useState } from 'react'

// Swiper components, modules and styles
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// core version + navigation, pagination modules:
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure
} from "@nextui-org/react";
import Image from 'next/image';



function SwiperModule({ data }) {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [date, setDate] = useState("")
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const showNews = (title, body, image, date) => {
        setTitle(title);
        setDate(date);
        setBody(body);
        setImage(image)
        onOpen()
    }
    return (

        <section className=" overflow-hidden">
            <div>
                <ul >
                    <Swiper
                        navigation
                        pagination={{ type: "bullets", clickable: true }}
                        autoplay={true}
                        loop={true}
                        modules={[Autoplay, Navigation, Pagination]}
                        className="  xl:h-[470px] lg:h-[400px] md:h-[250px]  xl:w-[560px]  lg:w-[500px] md:w-[440px] overscroll-x-none rounded-lg p"
                    >
                        {data.map(({ id, image, tagline, title, buttons, date }) => (

                            <SwiperSlide key={id}>

                                <div
                                    className="h-full w-full absolute left-0 top-0"
                                    style={{
                                        background: `url(/images/burst.svg) center center / cover scroll no-repeat`,
                                    }}
                                ></div>
                                <div className="h-full w-full absolute left-0 top-0 bg-black opacity-10"></div>
                                <div className="relative z-10 h-full flex items-center justify-center ">
                                    <div className="text-center p-16 flex flex-col justify-between items-center gap-16">
                                        <p className="text-3xl md:text-2xl lg:text-3xl font-bold text-white">
                                            {title}
                                        </p>
                                        <p className="md:text-sm  font-semibold text-white">
                                            {tagline ? tagline?.slice(0, 150) + "..." : null}
                                        </p>
                                        <Button className='bg-white text-secondary-800' onClick={() => showNews(title, tagline, image, date)}>
                                            مشاهده جزییات
                                        </Button>


                                        {buttons?.length > 0 ? (
                                            <p className=" bg-gray-800 inline-block px-9 py-2 rounded-full text-white mt-10 lg:mt-20">
                                                {/* <SliderButtons buttons={buttons} /> */}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </ul>
            </div>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
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
                                <span className='text-[16px] '>
                                    {title}
                                </span>
                                <span className='text-[8px]'>
                                    تاریخ خبر : {date}
                                </span>
                            </ModalHeader>
                            <ModalBody >

                                <p className='text-right justify-start text-justify'>
                                    {body}
                                </p>
                                <div className='w-full flex-center '>
                                    {image ?
                                        <Image className="w-[100%] h-96 my-2" src={image} width={500} height={500} alt="info" />
                                        : null

                                    }
                                </div>
                            </ModalBody>
                            <ModalFooter >
                                <Button color="foreground" variant="light" onPress={onClose}>
                                    بستن
                                </Button>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </section>

    )
}

export default SwiperModule