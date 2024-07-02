
"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Verify = () => {
  useEffect(() => {
    const verifyPayment = async () => {
      try {

          const response = await fetch('/api/lecturer/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          console.log(data);
          if (data.ResCode === 0) {
            alert('Payment successful');
          } else {
            alert('Payment failed');
          }
      } catch (error) {
        console.error(error);
      }
    };

    verifyPayment();
  }, []);

  return <div>Verifying payment...</div>;
};

export default Verify;