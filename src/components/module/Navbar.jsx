"use client"

import React, { useEffect, useState } from 'react'
import { RiMenuFoldLine } from "react-icons/ri";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useUserProvider } from '@/components/context/UserProvider';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { CgProfile } from "react-icons/cg";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import ImageProfileUploader from './uploader/ImageProfileUploader';
import ImageLoaderProfile from './user/ImageLoaderProfile';
const maxFileSize = 500000; //100KB
const acceptType = "jpg";

function Navbar() {
    const { showSidebar, setShowSideBar, modir, admin, user, showArrow } = useUserProvider();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState([]);

    const logoutHandler = async () => {
        const response = await fetch("/api/auth/logout");
        router.refresh();
        toast.success("خارج شدید")
    }

    useEffect(() => {

    }, []);
    const onChangeProfileImage = (imageList, addUpdateIndex) => {
        // data for submit
        if (imageList.length > 1) {
            toast.info("صرفا امکان بارگذاری یک تصویر وجود دارد");
            return
        }
        setProfileImage(imageList);
    };

    const showModal = () => {
        onOpen();
        console.log("User------>", user)
    }

    const setProfile = async () => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            if (profileImage) {
                for (const image of profileImage) {
                    formData.append("profileImage", image.file);
                }
            }
            formData.append("id", user._id);
            formData.append("phone", user.phone);
            const res = await fetch("/api/user/profile", {
                method: "POST",
                header: { "Content-Type": "multipart/form-data" },
                body: formData,
            });
            const data = await res.json();
            if (data.status == 201) {
                toast.success(data.message);
                onClose();

                location.reload();

            } else {
                toast.info(data.message);
            }
            setIsLoading(false);
        } catch (error) {
            console.log("error in catch add image profile -> ", error);
            toast.error("خطای ناشناخته");
            setIsLoading(false);
            onClose();
        }
    }
    return (
        <>

            <div className='w-full h-12  flex-center bg-header text-header-font-color rounded-t-md'>
                <div className='px-4 py-2  flex-1 flex items-center justify-start'>
                    <button className='text-[1.2rem] cursor-pointer' onClick={() => setShowSideBar(prev => !prev)}>
                        {showSidebar ? <RiMenuFoldLine /> : <RiMenuUnfoldLine />}
                    </button>
                    <span className='mr-4 text-[12px] text-gray-800'>{modir?.name || admin?.name} خوش آمدید</span>
                </div>
                <div className='flex-center'>

                    <div className='relative flex-center'>
                        {showArrow &&
                            <div className='absolute top-6 ml-2 rotate-180 z-10'>
                                <img
                                    src={"images/arrow.gif"}
                                    alt=""
                                    width="100"
                                    height="100"
                                    className="w-16 h-16 rounded-full"
                                />
                            </div>
                        }

                        {user.profile.length!=0 ?
                            <div className="gap-2 ml-2 cursor-pointer" onClick={showModal}>
                                {user.profile?.map(
                                    (image, index) => (
                                        <div key={index}>
                                            <ImageLoaderProfile
                                                imageUrl={image}
                                                code={"profile"}
                                            />
                                        </div>
                                    )
                                )}
                            </div> : 
                            <button className='ml-2 p-2 cursor-pointer text-[20px]' onClick={showModal}>
                                <CgProfile />
                            </button>
                        }
                    </div>

                    <button className='ml-4 p-2 cursor-pointer  text-[20px]' onClick={logoutHandler}>
                        <RiLogoutCircleLine />
                    </button>
                </div>
            </div>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                radius="lg"
                classNames={{
                    body: "py-6 bg-white",
                    backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                    base: "border-[#292f46] bg-slate-700 text-[#a8b0d3]",
                    header: " border-[#292f46]  bg-primary_color text-white",
                    footer: " border-[#292f46] bg-white",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-md">
                                تصویر پروفایل
                            </ModalHeader>
                            <ModalBody >

                                <p>
                                    حجم تصویر حداکثر 500 کیلوبایت باشد.
                                </p>
                                <p>
                                    پسوند فایل Jpg باشد.
                                </p>
                                <div className="gap-2 mt-4 flex justify-center bg-slate-100 rounded-md p-4">
                                    <div className='flex '>
                                        <ImageProfileUploader
                                            imageItems={profileImage}
                                            onChange={onChangeProfileImage}
                                            maxNumber={1}
                                            acceptType={acceptType}
                                            maxFileSize={maxFileSize}
                                        // user={user}

                                        />
                                    </div>

                                </div>

                            </ModalBody>
                            <ModalFooter >
                                <Button
                                    color="foreground"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    بستن
                                </Button>
                                <Button isLoading={isLoading}
                                    className="bg-btn-primary shadow-lg shadow-indigo-500/20 text-white flex-center"
                                    onPress={() => setProfile()}
                                >
                                    بروزرسانی
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default Navbar