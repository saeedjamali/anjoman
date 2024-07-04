import UserProvider, {
  useUserProvider,
} from "@/components/context/UserProvider";
import Footer from "@/components/module/Footer";
import Navbar from "@/components/module/Navbar";
import Sidebar from "@/components/module/Sidebar";
import { authenticateLecturer, authenticateMe } from "@/utils/authenticateMe";
import React from "react";
import { redirect } from "next/navigation";
import adminModel from "@/models/admin/adminRegion";
import mongoose from "mongoose";
import { ToastContainer, toast } from "react-toastify";

async function LecturerLayout({ children }) {
  const userIsExists = await authenticateLecturer(); //? in user table
  
  if (!userIsExists) {
    redirect("/");
  }

  return (
    <div className="flex relative w-full ">
      <UserProvider
        userFounded={JSON.parse(JSON.stringify(userIsExists))}
      >
        <div>
          <Sidebar />
        </div>
        <div className="w-full h-screen flex flex-col p-2 ">
          <Navbar />
          <div className="flex-1 h-screen overflow-auto border-2 border-header p-2 
          ">
            {children}
          </div>
          <Footer />
        </div>
      </UserProvider>
    </div>
  );
}

export default LecturerLayout;
