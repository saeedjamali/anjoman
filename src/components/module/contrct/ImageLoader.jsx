"use client"
import { Spinner } from '@nextui-org/react';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaCloudDownloadAlt } from 'react-icons/fa'

function ImageLoader({ imageUrl, code }) {
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true)
        const getImage = async () => {
            try {
                const response = await fetch(`/api/modir/contract/getimage/${imageUrl}/${code}`)
                // const data =  response;
                // console.log("data from image Loader", response)
                setImage(response.url)
            } catch (error) {
                toast.error("خطا زمان دریافت تصاویر ")
                console.log("whats that error image loader---->", error)
            }
        }
        getImage();
        setIsLoading(false)
    }
        , []);
    return (
        <div>
            <div
                // key={index}
                className="relative flex items-center justify-start "
            >
                <img
                    src={image}
                    alt=""
                    width="100"
                    height="48"
                    className="w-16 h-16 rounded-md"
                />
                <Link
                    download
                    target="_blank"
                    href={image}
                    className=" text-white bg-blue-200 rounded-full w-8 h-8 flex-center absolute right-[25%] "
                >
                    <FaCloudDownloadAlt className="text-[24px] cursor-pointer" />
                    {isLoading && <Spinner />}
                </Link>

            </div>
        </div>
    )
}

export default ImageLoader
