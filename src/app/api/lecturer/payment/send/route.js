import crypto from "crypto";
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const {
            amount,
            orderId,
            MultiIdentityData,
            MerchantId,
            TerminalId,
            merchantKey,
        } = await req.json();

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
                    ReturnUrl: `http://localhost:3000/api/lecturer/payment/verify`,
                    SignData: encryptedSignData,
                    MultiIdentityData,
                }),
            }
        );

        const data = await response.json();
        const token = data.Token;

        cookies().set('paymentData', String(token), {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60,
            path: '/'
        });

        return Response.json(data);
    } catch (error) {
        console.error("Error in send APi", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}