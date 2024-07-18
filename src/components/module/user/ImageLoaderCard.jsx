"use client"
import { Spinner } from '@nextui-org/react';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaCloudDownloadAlt } from 'react-icons/fa'

function ImageLoaderCard({ imageUrl, code }) {
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true)
        const getImage = async () => {
            try {
                const response = await fetch(`/api/user/getimage/${imageUrl}/${code}`)
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
                className="relative flex-center w-16 h-20 rounded-sm"
            >
                <img
                    src={image}
                    alt=""
                    width="100"
                    height="100"
                    className="w-16 h-20 rounded-md"
                />


            </div>
        </div>
    )
}

export default ImageLoaderCard
