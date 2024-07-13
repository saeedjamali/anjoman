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
    useDisclosure,
} from "@nextui-org/react";
import Image from 'next/image';


function SwiperText({ data }) {

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
        // console.log("Title==>", title)
    }
    return (

        <section className=" overflow-hidden">
            <div>
                <ul >
                    <Swiper
                        // navigation
                        // pagination={{ type: "bullets", clickable: true }}
                        autoplay={true}
                        loop={true}
                        modules={[Autoplay]}
                        className=" h-[64px]  w-full overscroll-x-none rounded-lg p"
                    >
                        {data.map(({ id, image, tagline, title, buttons, date }) => (

                            <SwiperSlide key={id}>

                                <div className="h-full w-full absolute left-0 top-0 bg-primary-600 opacity-20"></div>
                                <div className="relative z-10 h-full flex items-center justify-center ">
                                    <div className="text-center p-4 w-full flex justify-between items-center gap-4 cursor-pointer" onClick={() => showNews(title, tagline, image, date)}>
                                        <p className="text-[14px] font-bold text-secondary-800 flex-1">
                                            {title}
                                        </p>
                                        {/* <p className="text-[10px]  text-secondary-600 flex-1">
                                            {tagline}
                                        </p> */}



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
                    header: " border-[#292f46] text-white bg-primary_color ",
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
                                <span className='text-[8px] font-iranSans'>
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

export default SwiperText