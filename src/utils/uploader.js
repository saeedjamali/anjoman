import React, { useState, useEffect } from "react";
import { CloudDirectory, S3 } from "aws-sdk";
import { Spinner } from "@nextui-org/react";

const ACCESSKEY = "e2c7tvlpu1emh69e"; // or process.env.LIARA_ACCESS_KEY;
const SECRETKEY = "31e6d7e6-659f-417c-a468-d292eb536e08"; //  or process.env.LIARA_SECRET_KEY;
const ENDPOINT = "https://storage.iran.liara.space"; //   or process.env.LIARA_ENDPOINT;
const BUCKET = "peyvand"; //    or process.env.LIARA_BUCKET_NAME;

const handleUpload = async (
  file,
  setPermanentLink,
  permanentLinks,
  setError
) => {
  setIsLoading(true);
  setError(null);
  // setUploadLink(null);
  setPermanentLink(null);
  //   console.log("File->", file);
  try {
    if (!file) {
      setError("فایل بارگذاری شود");
      return;
    }
    const s3 = new S3({
      accessKeyId: ACCESSKEY,
      secretAccessKey: SECRETKEY,
      endpoint: ENDPOINT,
    });

    const params = {
      Bucket: BUCKET,
      Key: file.name,
      Body: file,
    };

    const response = await s3.upload(params).promise();

    // Get permanent link

    const permanentSignedUrl = s3.getSignedUrl("getObject", {
      Bucket: BUCKET,
      Key: file.name,
      Expires: 31536000, // 1 year
    });

    setIsLoading(false);
    setPermanentLink([...permanentLinks, permanentSignedUrl]);
  } catch (error) {
    setError("Error uploading file: " + error.message);
  }

};

const handleDeleteFile = async (file) => {
  try {
    const s3 = new S3({
      accessKeyId: ACCESSKEY,
      secretAccessKey: SECRETKEY,
      endpoint: ENDPOINT,
    });
    await s3.deleteObject({ Bucket: BUCKET, Key: file.Key }).promise();
    // console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file: ", error);
  }
};

export { handleUpload, handleDeleteFile };
