"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authTypes, roles } from "@/utils/constants";
import { IoMdArrowRoundForward } from "react-icons/io";
import Sms from "@/components/template/login-register/Sms";
import Register from "@/components/template/login-register/Register";
import Login from "@/components/template/login-register/Login";
import RoleSelection from "@/components/template/login-register/RoleSelection";
import Forgot from "@/components/template/login-register/Forgot";
import ResetPass from "@/components/template/login-register/ResetPass";

export default function Home() {
  const [authTypesForm, SetAuthTypesForm] = useState(authTypes.ROLES);
  const [role, SetRole] = useState("");
  // const { isShowSignInForm, setIsShowSignInForm } = useAppProvider();
  // const { phone } = useAppProvider();

  return (
    <div >
      <ToastContainer
        bodyClassName={() =>
          " flex-center text-sm font-white p-3"
        }
        position="top-left"
        rtl={true}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-full h-screen bg-white md:flex flex-row-reverse bg-blu">
        <div className="w-full h-2/5 md:h-screen md:w-3/5 bg-gradient-to-b from-primary_color via-primary_color to-secondary_color flex-center relative">
          <div className="w-4/5 h-full flex-col-center absolute top-[2%] md:top-0 space-y-8 mt-8 md:mt-0">
            <span className="font-shabnam text-header-font-color text-center ">
              برنامه ریزی آموزشی درست آینده ما را می سازد
            </span>
            <Image
              src={"/images/group.png"}
              width={100}
              height={100}
              alt="banner"
              className="w-48 h-48 md:w-80 md:h-80"
            />
          </div>
        </div>
        <div className="w-full h-full md:h-screen md:w-2/5 relative flex-col-center shadow-lg  ">
          <div className="absolute top-[10%] md:top-[21%] md:-left-20 flex-col-center bg-white  rounded-lg shadow-lg shadow-indigo-300 min-w-80 max-w-96 min-h-96   md:h-[27rem]">
            <div className=" p-4 md:p-8 ">
              {/* Select Role */}

              {authTypesForm == authTypes.ROLES && (
                <RoleSelection
                  SetRole={SetRole}
                  SetAuthTypesForm={SetAuthTypesForm}
                  role={role}
                />
              )}
              {/* login  form */}
              {authTypesForm == authTypes.LOGIN && (
                <Login role={role} SetAuthTypesForm={SetAuthTypesForm} />
              )}
              {/* Register Form  */}
              {authTypesForm == authTypes.REGISTER && (
                <Register SetAuthTypesForm={SetAuthTypesForm} role={role} />
              )}

              {/* ForgotPass Form */}
              {authTypesForm == authTypes.FORGOTPASS && (
                <Forgot SetAuthTypesForm={SetAuthTypesForm} role={role} />
              )}

              {/* Reset Password Form */}
              {authTypesForm == authTypes.RESETPASS && (
                <ResetPass SetAuthTypesForm={SetAuthTypesForm} role={role} />
              )}
              {/* Send OTP / verify Sms */}
              {authTypesForm == authTypes.SMS && (
                <Sms
                  SetAuthTypesForm={SetAuthTypesForm}
                  role={role}
                  SetRole={SetRole}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
