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
    <div className="">
      <ToastContainer
        bodyClassName={() => " flex-center text-sm font-white p-3"}
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
      <div className="w-full h-screen   bg-white md:flex md:flex-row-reverse relative">
        <div className="order-2 md:order-1 w-full h-2/5 md:h-screen md:w-[60%] xl:w-[70%] bg-gradient-to-b from-primary_color via-primary_color to-secondary_color flex-center  rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl ">
          <div className="w-3/5 h-full flex-col-center top-1/4  md:top-0 space-y-8 mt-8 md:mt-0 ">
            <p className="absolute top-[15%] md:top-[10%] md:flex font-iranNastaliq  text-3xl md:text-4xl text-white shadow-md">
              انجمن اولیا کارامد ، مدرسه سرآمد
            </p>

            {/* absolute top-[calc(50%+390px)] */}
            <div className="hidden w-4/5 md:top-auto bg-green-200 md:w-full h-[250px]  md:h-[450px]  md:relative md:bottom-0 md:flex-col-center rounded-xl">
              <span className=" text-header-font-color text-center ">
                برنامه ریزی آموزشی درست آینده ما را می سازد
              </span>
              <Image
                src={"/images/group.png"}
                width={100}
                height={100}
                alt="banner"
                className="w-64 h-64 md:w-96 md:h-96"
              />
            </div>

            <p className=" md:flex text-purple-900 md:text-white text-[12px] absolute bottom-2 shadow-sm">
              مالکیت مادی و معنوی این سایت متعلق به اداره کل آموزش و پرورش
              خراسان رضوی می باشد.
            </p>
          </div>
          <div className="absolute top-[30%] md:top-auto  xl:right-[14%] lg:right-[12%] md:right-[4%] flex-col-center bg-white rounded-lg shadow-lg shadow-indigo-300 min-w-80 max-w-96 min-h-96 md:h-[27rem] z-10">
            <div className="p-4 lg:p-8 ">
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
        <div className="order-1 w-full h-3/5 md:h-screen xl:w-[30%] md:w-[40%] md:relative flex-col-center  shadow-lg ">
          <div className="absolute top-0 left-0 md:-left-36 py-2 flex justify-end w-full">
            {/* <Image
              src={"/images/itlogo.png"}
              width={100}
              height={100}
              alt="banner"
              className="w-24"
            /> */}
            <Image
              src={"/images/anjomanlogo.png"}
              width={100}
              height={100}
              alt="banner"
              className="w-36"
            />
          </div>
          {/* <p className="flex md:hidden text-[12px] text-purple-900 absolute bottom-2">
            مالکیت مادی و معنوی این سایت متعلق به اداره کل آموزش و پرورش خراسان
            رضوی می باشد.
          </p> */}
        </div>
      </div>
    </div>
  );
}
