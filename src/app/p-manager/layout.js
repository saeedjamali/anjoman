import UserProvider, {
  useUserProvider,
} from "@/components/context/UserProvider";
import Footer from "@/components/module/Footer";
import Navbar from "@/components/module/Navbar";
import Sidebar from "@/components/module/Sidebar";
import {
  authAdmin,
  authManagerApi,
  authenticateMe,
} from "@/utils/authenticateMe";
import React from "react";
import { redirect } from "next/navigation";
import modirUnitModel from "@/models/modiran/modirUnit";
import mongoose from "mongoose";
import { ToastContainer, toast } from "react-toastify";
import adminModel from "@/models/admin/adminRegion";
async function ManagerLayout({ children }) {
  const userIsExists = await authManagerApi(); //? in user table
  let region = {};
  let foundedAdminRegion = [];
  if (userIsExists) {
    try {
      foundedAdminRegion = await adminModel.findOne(
        //? in admin table
        { user: JSON.parse(JSON.stringify(userIsExists))._id },
        "-__v "
      );
    } catch (error) {
      console.log("Error ->", error);
      redirect("/");
    }
  } else {
    redirect("/");
  }
  return (
    <div className="flex relative w-full ">
      <UserProvider
        userFounded={JSON.parse(JSON.stringify(userIsExists))}
        currentAdmin={JSON.parse(JSON.stringify(foundedAdminRegion))}
      >
        <div>
          <Sidebar />
        </div>
        <div className="w-full h-screen flex flex-col p-2 ">
          <Navbar />
          <div className="flex-1 h-screen overflow-auto border-2 border-header p-2 font-iranyekan">
            {children}
          </div>
          <Footer />
        </div>
      </UserProvider>
    </div>
  );
}

export default ManagerLayout;
