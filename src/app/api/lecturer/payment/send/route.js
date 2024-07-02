

// const request = require("request");

import { useAppProvider } from "@/components/context/AppProviders";
import crypto from 'crypto';
export async function POST(req) {
    // console.log("Bodyy--->")
    const body = await req.json();
    try {
        let {
            amount,
            orderId,
            MultiIdentityData,
            MerchantId,
            TerminalId,
            merchantKey,
        } = body;

        const LocalDateTime = new Date().toISOString();
        const signData = `${TerminalId};${orderId};${amount}`;
        const keyBuffer = Buffer.from(merchantKey, "base64");
        const cipher = crypto.createCipheriv("des-ede3", keyBuffer, null);
        cipher.setAutoPadding(true);

        let encryptedSignData = cipher.update(signData, "utf8", "base64");
        encryptedSignData += cipher.final("base64");

        const response = await fetch(
            "https://sadad.shaparak.ir/api/v0/PaymentByMultiIdentityRequest",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    MerchantId,
                    TerminalId,
                    Amount: amount,
                    OrderId: orderId,
                    LocalDateTime,
                    ReturnUrl: "https://peyvand.razaviedu.ir/p-lecturer/payment/verify",
                    // ReturnUrl: "http://localhost:3000/api/lecturer/verify",
                    SignData: encryptedSignData,
                    MultiIdentityData,
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return Response.json(
            { message: "پرداخت با موفقیت ارسال شد :))", status: 200, data, signData: encryptedSignData }
        );

    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "خطا در پرداخت :))", status: 500 }
        );
    }
}