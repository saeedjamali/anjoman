import AppProvider, { useAppProvider } from "@/components/context/AppProviders";

export async function POST(req) {

    try {

        const body = await req.body;

        const { token, SignData } = useAppProvider();

        // console.log("token and signdata--->", token, SignData)

        const response = await fetch('https://sadad.shaparak.ir/api/v0/Advice/Verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Token: token,
                SignData: SignData
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
      
        const data = await response.json();
        return Response.json(
            { message: "پرداخت موفقیت آمیز بود", status: 200, data }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "خطا در پرداخت :))", status: 500 }
        );
    }
}

// import crypto from 'crypto';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
// console.log(req.body)
//           return req.body;

//       const signData = ${TerminalId};${orderId};${amount};
//       const cipher = crypto.createCipheriv('des-ede3', merchantKey, '');
//       let encryptedSignData = cipher.update(signData, 'utf8', 'base64');
//       encryptedSignData += cipher.final('base64');

//       const response = await fetch('https://sadad.shaparak.ir/api/v0/PaymentByMultiIdentityRequest', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           MerchantId,
//           TerminalId,
//           Amount: amount,
//           OrderId: orderId,
//           LocalDateTime: localDateTime,
//           ReturnUrl: http://localhost:3000/verify,
//           SignData: encryptedSignData,
//           MultiIdentityData: multiIdentityData,
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       res.json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }