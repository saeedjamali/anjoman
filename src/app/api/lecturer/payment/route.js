

// const request = require("request");

export async function POST(req) {
    // const body = await req.json();
    return Response.json(
        { message: "پرداخت با موفقیت ارسال شد :))", status: 200 }
    );
    try {


    } catch (error) {
        console.log("Catch error ---->", error)
        return Response.json(
            { message: "Sent error :))", status: 401 })
    }
}