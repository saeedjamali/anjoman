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
import SwiperModule from "@/components/module/swiper/SwiperModule";
import dataSlider from "@/data/slider-data.json";
import SwiperText from "@/components/module/swiper/SwiperText";

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
      <div className="w-full md:h-screen   bg-white lg:flex lg:flex-row-reverse relative">

        <div className="order-2 lg:order-1 w-full h-64 md:h-2/5 lg:h-screen lg:w-[60%] xl:w-[70%] bg-gradient-to-b from-primary_color via-primary_color to-secondary_color flex-center  rounded-b-2xl lg:rounded-bl-none lg:rounded-r-2xl ">
          <div className="w-3/5 h-full flex-col-center top-1/4  lg:top-0 space-y-8 mt-8 lg:mt-0 ">
            {/* //? LOGO */}
            <div className="absolute top-0 right-0 lg:-left-36 py-2 flex justify-end w-full">
              <Image
                src={"/images/anjomanlogo.png"}
                width={100}
                height={100}
                alt="banner"
                className="w-36"
              />
            </div>
            {/* //? Title */}
            <p className="absolute top-[104px] md:top-[15%] lg:top-[8%] lg:flex font-iranNastaliq  text-3xl lg:text-4xl text-white shadow-md">
              انجمن اولیا کارآمد ، مدرسه سرآمد
            </p>
            {/* absolute top-[calc(50%+390px)] */}
            {/* //? Swipper Full */}
            <div className="hidden absolute w-4/5 lg:top-auto lg:w-full h-[250px] lg:h-[500px] lg:relative lg:bottom-0 lg:flex-col-center rounded-xl">
              <SwiperModule data={dataSlider} />
            </div>
            {/* //? Swipper Text */}
            <div className="flex lg:hidden  w-4/5 absolute lg:bottom-10 top-[725px]">
              <SwiperText data={dataSlider} />
            </div>
            {/* //? COPY RIGHT */}
            <p className=" lg:flex text-purple-900 lg:text-white text-[12px] absolute top-[795px] bottom-auto  lg:bottom-2 lg:top-auto p-8 lg:p-0  shadow-sm text-center">
              مالکیت مادی و معنوی این سایت متعلق به اداره کل آموزش و پرورش
              خراسان رضوی می باشد.
            </p>
          </div>
          <span></span>

          {/* //? ROLE SELECTION */}
          <div className="absolute md:top-[26%] top-[220px] lg:top-auto 2xl:right-[14%] xl:right-[10%] lg:right-[10%] flex-col-center bg-white rounded-lg shadow-2xl shadow-indigo-300 min-w-80 max-w-96 min-h-96 lg:h-[27rem] z-10">
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
      </div>
    </div>
  );
}
