
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import ImageUploading from "react-images-uploading";
import { MdOutlineModeEdit } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Button } from '@nextui-org/react';
import { CloudDirectory, S3 } from "aws-sdk";
import { toast } from 'react-toastify';

const ACCESSKEY = "e2c7tvlpu1emh69e"; // or process.env.LIARA_ACCESS_KEY;
const SECRETKEY = "31e6d7e6-659f-417c-a468-d292eb536e08"; //  or process.env.LIARA_SECRET_KEY;
const ENDPOINT = "https://storage.iran.liara.space"; //   or process.env.LIARA_ENDPOINT;
const BUCKET = "peyvand"; //    or process.env.LIARA_BUCKET_NAME;

function ImageUploader({ imageItems, onChange, maxNumber, acceptType, maxFileSize, user, setImageUrls, imageUrlList }) {
    const [error, setError] = useState(null);
    const [result, setResult] = useState(false);
    const [buckets, setBuckets] = useState([]);
    // const [permanentLinks, setPermanentLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const fetchBuckets = async () => {
        const s3 = new S3({
            accessKeyId: ACCESSKEY,
            secretAccessKey: SECRETKEY,
            endpoint: ENDPOINT,
        });
        try {
            const response = await s3.listBuckets().promise();
            setBuckets(response.Buckets);
        } catch (error) {
            console.error('Error fetching buckets: ', error);
        }
    };

    useEffect(() => {
        fetchBuckets();
    }, [setImageUrls]);

    const handleShowFiles = () => {
        // console.log('List of uploaded files:', uploadedFiles);
    };
    const handleUpload = async () => {
        setIsLoading(true);
        setResult(false)
        setError(null);
        setImageUrls(null);
        try {
            const s3 = new S3({
                accessKeyId: ACCESSKEY,
                secretAccessKey: SECRETKEY,
                endpoint: ENDPOINT,
            });
            let imageUrls = []
            imageItems.map(async (image) => {

                const params = {
                    Bucket: BUCKET,
                    Key: user._id + image.file?.name,
                    Body: image.file,
                };

                const response = await s3.upload(params).promise();
                const permanentSignedUrl = s3.getSignedUrl("getObject", {
                    Bucket: BUCKET,
                    Key: user._id + image.file?.name,
                    Expires: 12614400, // 4 year
                });
                imageUrls.push(permanentSignedUrl)
                setIsLoading(false)
                setResult(true)
                setImageUrls(imageUrls);
            })

        } catch (error) {
            setResult(false)
            toast.error("خطا در بارگذاری تصاویر")
            setError("Error uploading file: " + error.message);

        }
        // setIsLoading(false);

    };
    return (
        <div>

            <ImageUploading
                multiple
                value={imageItems}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
                acceptType={[acceptType]}
                maxFileSize={maxFileSize} // Byte
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                    errors,
                }) => (
                    // write your building UI
                    <div className="flex flex-col w-full ">
                        {errors && <div className="flex w-full">
                            <div className="flex flex-col justify-between">
                                <div >
                                    {errors && (
                                        <div>
                                            {errors.maxNumber && (
                                                <span className="text-red-500 text-[14px]">
                                                    امکان بارگذاری حداکثر{" "}
                                                    {maxNumber} تصویر وجود دارد
                                                </span>
                                            )}
                                            {errors.acceptType && (
                                                <span className="text-red-500 text-[14px]">
                                                    نوع فایل مجاز Jpg می باشد
                                                </span>
                                            )}
                                            {errors.maxFileSize && (
                                                <span className="text-red-500 text-[14px]">
                                                    حداکثر حجم فایل {maxFileSize / 1000}{" "}
                                                    کیلوبایت می باشد
                                                </span>
                                            )}
                                            {/* {errors.resolution && <span className='text-red-500 text-[14px]'>Selected file is not match your desired resolution</span>} */}
                                        </div>
                                    )}
                                    {/* <button
                                        className="bg-green-400 px-2 rounded-md"
                                        onClick={(event) => uploadServerHandler(event)}
                                    >
                                        ارسال به پایگاه
                                    </button> */}
                                    {/* <button
                                      className="bg-red-500 text-gray-200 text-[14px] rounded-md  px-2 justify-end"
                                      onClick={onImageRemoveAll}
                                    >
                                      حذف تمام تصاویر
                                    </button> */}
                                </div>
                            </div>
                        </div>}
                        <div className="flex  items-center justify-between w-full">

                            <div className="flex justify-between  flex-1">
                                {/* <div>
                                    {imageUrlList?.map(image =>
                                        <img src={image} width={64} height={64} alt='pic' />
                                    )}
                                </div> */}
                                <div className='flex gap-2'>
                                    {


                                        imageList.length == 0 ? (
                                            <span className="text-red-500">
                                                {" "}
                                                انتخاب نشده
                                            </span>
                                        ) : (
                                            imageList.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="relative flex items-center w-16 h-16 "
                                                >
                                                    <div className="flex-1 ">
                                                        <img
                                                            src={image.data_url}
                                                            alt=""
                                                            width="100"
                                                            height="100"
                                                            className="w-16 h-16 rounded-md"
                                                        />
                                                    </div>

                                                    {!result &&
                                                        <div className=" text-[12px]  w-16 absolute  top-1 flex items-center justify-center">
                                                            <button
                                                                className="bg-green-300 rounded-md p-[4px] text-white font-bold text-md"
                                                                onClick={() => onImageUpdate(index)}
                                                            >
                                                                <MdOutlineModeEdit />
                                                            </button>
                                                            <button
                                                                className="bg-red-300 rounded-md p-[4px] text-white font-bold text-md mr-2"
                                                                onClick={() => {
                                                                    setIsLoading(false)
                                                                    onImageRemove(index)
                                                                }}
                                                            >
                                                                <CiTrash />
                                                            </button>
                                                        </div>

                                                    }
                                                </div>
                                            ))

                                        )}
                                </div>

                               {/* //? Liara Uploader */}
                                {/* {imageList.length != 0 &&
                                    <div className='flex items-center justify-center h-16 mr-4 cursor-pointer'>

                                        {!result ?
                                            <Button className="relative bg-green-500 text-[12px] px-2 py-[1px] text-white"
                                                onClick={() => handleUpload()} isLoading={isLoading}>
                                                <div className="flex-1 flex-center">تایید</div>

                                            </Button>
                                            :
                                            <Button className="relative bg-blue-500 text-[12px] px-2 py-[1px] text-white cursor-not-allowed"
                                                isDisabled isLoading={isLoading}
                                            >
                                                <div className="flex-1 flex-center">ثبت شد</div>
                                            </Button>}
                                    </div>} */}
                            </div>

                            <div
                                className={` flex items-start justify-center  cursor-pointer ${isDragging ? "bg-orange-200" : null
                                    } `}

                            >
                                <div className=" flex-1 flex-center rounded-md ">
                                    {!result && <Button className="bg-transparent">
                                        <FaCloudUploadAlt className='text-xl text-blue-500' onClick={onImageUpload}
                                            {...dragProps} />

                                    </Button>}
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }
            </ImageUploading >
        </div >
    )
}

export default ImageUploader