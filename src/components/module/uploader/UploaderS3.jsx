import React, { useState, useEffect } from 'react';
import { S3 } from 'aws-sdk';
import { Spinner } from '@nextui-org/react';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [permanentLink, setPermanentLink] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [allFiles, setAllFiles] = useState([]);
    const [buckets, setBuckets] = useState([]);
    const [isLoading, setIsLoading] = useState(false)


    const ACCESSKEY = "e2c7tvlpu1emh69e";                    // or process.env.LIARA_ACCESS_KEY;
    const SECRETKEY = "31e6d7e6-659f-417c-a468-d292eb536e08";                    //  or process.env.LIARA_SECRET_KEY;
    const ENDPOINT = "https://storage.iran.liara.space" //   or process.env.LIARA_ENDPOINT;
    const BUCKET = "peyvand";                //    or process.env.LIARA_BUCKET_NAME;

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

    const fetchAllFiles = async () => {
        const s3 = new S3({
            accessKeyId: ACCESSKEY,
            secretAccessKey: SECRETKEY,
            endpoint: ENDPOINT,
        });

        try {
            const response = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
            setAllFiles(response.Contents);
        } catch (error) {
            console.error('Error fetching files: ', error);
        }
    };

    useEffect(() => {
        fetchBuckets();
        fetchAllFiles();
    }, [permanentLink]);

    const handleFileChange = (event) => {

        setFile(event.target.files[0]);
        setError(null);
        // setUploadLink(null);
        setPermanentLink(null);

    };

    const handleUpload = async (event) => {
        setIsLoading(true)
        setFile(event.target.files[0]);
        setError(null);
        // setUploadLink(null);
        setPermanentLink(null);
        try {
            if (!event.target.files[0]) {
                setError('Please select a file');
                return;
            }
            const s3 = new S3({
                accessKeyId: ACCESSKEY,
                secretAccessKey: SECRETKEY,
                endpoint: ENDPOINT,
            });

            const params = {
                Bucket: BUCKET,
                Key: event.target.files[0].name,
                Body: event.target.files[0],
            };

            const response = await s3.upload(params).promise();
            // const signedUrl = s3.getSignedUrl('getObject', {
            //     Bucket: BUCKET,
            //     Key: file.name,
            //     Expires: 3600,
            // });

            // setUploadLink(signedUrl);

            // Get permanent link

            const permanentSignedUrl = s3.getSignedUrl('getObject', {
                Bucket: BUCKET,
                Key: event.target.files[0].name,
                Expires: 31536000, // 1 year
            });

            setPermanentLink([...permanentLink, permanentSignedUrl]);
            // Update list of uploaded files
            setUploadedFiles((prevFiles) => [...prevFiles, response]);

            // Update list of all files
            fetchAllFiles();

            setIsLoading(false)

           
        } catch (error) {
            setError('Error uploading file: ' + error.message);
        }
    };

    const handleShowFiles = () => {
    };

    const handleDeleteFile = async (file) => {
        try {
            const s3 = new S3({
                accessKeyId: ACCESSKEY,
                secretAccessKey: SECRETKEY,
                endpoint: ENDPOINT,
            });

            await s3.deleteObject({ Bucket: BUCKET, Key: file.Key }).promise();

            // Update the list of uploaded files
            setUploadedFiles((prevFiles) =>
                prevFiles.filter((uploadedFile) => uploadedFile.Key !== file.Key)
            );

            // Update list of all files
            fetchAllFiles();

        } catch (error) {
            console.error('Error deleting file: ', error);
        }
    };






    return (
        <div className="upload-container">
            <h1>Upload File to S3</h1>
            <input className="upload-button bg-green-300 m-4" type="file" onChange={handleUpload} />
            <button className="upload-button bg-green-300 m-4" onClick={handleUpload} disabled={!file}>
                Upload
                {isLoading && <Spinner />}

            </button>
            <div>
                {permanentLink?.map(image => {
                    <img src={image} width={64} height={64} alt='pic' />
                })}
            </div>

            {permanentLink && (
                <h3 className="success-message bg-green-300 m-4">
                    Permanent Link:{' '}
                    <a href={permanentLink} className='bg-purple-500 m-4' target="_blank" rel="noopener noreferrer">
                        Permanent Link
                    </a>
                </h3>
            )}
            <button className="show-files-button bg-green-300 m-4" onClick={handleShowFiles}>
                Show Uploaded Files
            </button>
            {uploadedFiles.length > 0 && (
                <div className='bg-green-300 m-4'>
                    <h2>Uploaded Files:</h2>
                    <ul>
                        {uploadedFiles.map((uploadedFile) => {
                            const s3 = new S3({
                                accessKeyId: ACCESSKEY,
                                secretAccessKey: SECRETKEY,
                                endpoint: ENDPOINT,
                            });

                            return (
                                <li key={uploadedFile.Key}>
                                    {uploadedFile.Key}{' '}
                                    <a
                                        href={s3.getSignedUrl('getObject', {
                                            Bucket: BUCKET,
                                            Key: uploadedFile.Key,
                                            Expires: 3600,
                                        })}
                                        download
                                    >
                                        Download
                                    </a>{' '}
                                    <button className='bg-purple-500 m-4' onClick={() => handleDeleteFile(uploadedFile)}>
                                        Delete
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
            {allFiles.length > 0 && (
                <div className='bg-green-300 m-4'>
                    <h2>All Files:</h2>
                    <ul>
                        {allFiles.map((file) => {
                            const s3 = new S3({
                                accessKeyId: ACCESSKEY,
                                secretAccessKey: SECRETKEY,
                                endpoint: ENDPOINT,
                            });

                            return (
                                <li className='bg-purple-500 m-4' key={file.Key}>
                                    {file.Key}{' '}
                                    <a
                                        href={s3.getSignedUrl('getObject', {
                                            Bucket: BUCKET,
                                            Key: file.Key,
                                            Expires: 3600,
                                        })}
                                        download
                                    >
                                        Download
                                    </a>{' '}
                                    <button onClick={() => handleDeleteFile(file)}>
                                        Delete
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
            {error && <p className="error-message">{error}</p>}
            <div className='bg-green-300 m-4'>
                <h2>Buckets:</h2>
                <ul>
                    {buckets.map((bucket) => (
                        <li key={bucket.Name}>{bucket.Name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


export default Upload;