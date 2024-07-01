import AppProvider, { useAppProvider } from "@/components/context/AppProviders";

export async function POST(req) {

    try {
       
       const body = await req.json();
        const { token, SignData } = body;

        console.log("token and signdata--->", token, SignData)

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
            { message: "پرداخت موفقیت آمیز بود", status: 200 ,data}
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "خطا در پرداخت :))", status: 500 }
        );
    }
}