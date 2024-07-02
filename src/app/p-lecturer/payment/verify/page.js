"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppProvider } from '@/components/context/AppProviders';


const verify = () => {
    const router = useRouter();

    // console.log("Hello verify--->", router.query)

    const { token, signData } = useAppProvider();
    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // const { token } = router.query;

                if (token) {
                    const response = await fetch('/api/lecturer/payment/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ Token: token, SignData: signData }),
                    });

                    const data = await response.json();
                    console.log(data);
                    if (data.resCode === 0) {
                        alert('Payment successful');
                    } else {
                        alert('Payment failed');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        verifyPayment();
    }, []);

    return <div>Verifying payment...</div>;
};

export default verify;
