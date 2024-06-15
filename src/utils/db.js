import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        if (mongoose.connection?.readyState) {

            return { 
                status: 200,
                message: "Connection is ready",
                isConnected: true
            }
        }
        const db = await mongoose.connect(process.env.MONGO_URL);

        return {
            status: 200,
            message: "Connect To DB Successfully",
            isConnected: true
        }


    } catch (error) {
        return {
            status: 401,
            message: `Connect To Db Failed!  Error : ${error}`,
            isConnected: false
        }
    }
}

export default connectToDB;
