"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
  Input,
} from "@nextui-org/react";
import { valiadteMeliCode, valiadteSchoolCode } from "@/utils/auth";
import { toast, ToastContainer } from "react-toastify";
import LoginWithPhone from "@/components/template/login-register/LoginWithPhone";
import Swal from "sweetalert2";

function bimePage() {
  const [identifier, setIdentifier] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    if (!valiadteMeliCode(identifier)) {
      toast.error("کد ملی معتبر نمی باشد. کد ملی ده رقمی وارد کنید.");
      return;
    }

    if (!valiadteSchoolCode(password)) {
      toast.error("تاریخ تولد معتبر نمی باشد.تاریخ تولد باید 8 رقمی وارد شود.");
      return;
    }
    const formData = new FormData();
    formData.append("identifier", identifier);
    formData.append("password", password);
    setIsLoading(true);
    try {
      const response = await fetch("/api/result", {
        method: "POST",
        header: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const data = await response.json();
      if (data.status == 201) {
        const { result } = data;
        if (result.result == 0) {
          Swal.fire({
            icon: "error",
            title: "پذیرفته نشده اید",
            html: `دانش آموز گرامی ${result.name} ${result.family}  
             شما براي واحد سازماني <b>${result.schoolName} - ${result.regionName} </b>,
             پذیرفته نشده اید
          `,
            // text: `دانش آموز گرامی ${result.name} ${result.family}  `,
            showClass: {
              popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `,
            },
            hideClass: {
              popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `,
            },
            confirmButtonText: "مشاهده شد",
            showCloseButton: true,
          });
        } else if (result.result == 1) {
          Swal.fire({
            icon: "success",
            title: "پذیرفته شده مرحله اول",
            html: `دانش آموز گرامی ${result.name} ${result.family}  
             شما براي واحد سازماني <b>${result.schoolName} - ${result.regionName} </b>,
             پذیرفته شده اید. 
          <b><br> برای ادامه فرایند به اداره آموزش و پرورش ${result.regionName} مراجعه نمایید.<b>`,
            // text: ``,
            showClass: {
              popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `,
            },
            hideClass: {
              popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `,
            },
            confirmButtonText: "مشاهده شد",
            showCloseButton: true,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "یافت نشد",

          text: `دانش آموزی با این مشخصات یافت نشد`,
          showClass: {
            popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `,
          },
          hideClass: {
            popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `,
          },
          closeButtonAriaLabel: "بستن",
          confirmButtonText: "مشاهده شد",
          showCloseButton: true,
        });
      }
      setIsLoading(false);
      //   console.log("Data is--->", data);
    } catch (error) {
      console.log("error in catch result->", error);
    }
  };
  return (
    <div>
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
      <div className="-z-20 w-full h-screen flex-center bg-gradient-to-b from-primary_color via-primary_color to-secondary_color ">
        <Card className="z-10 w-[400px] m-4 md:m-0 md:w-auto md:min-w-[600px] flex-center">
          <CardHeader className="flex gap-3 bg-blue-500">
            <div className="flex flex-col text-white">
              <p className="text-md">
                فرم ثبت اعلام انصراف از بیمه عمر مکمل1404-1403
              </p>
              {/* <p className="text-[12px] mt-4">سال تحصیلی 1404-1403</p> */}
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="max-w-[480px] gap-y-4 p-8 text-black">
            <LoginWithPhone />
          </CardBody>
          <Divider />
          <CardFooter className="flex items-center justify-center h-16  bg-blue-950 text-white">
            <p className="font-shabnam text-[12px] md:text-[16px] text-center">
              این فرم صرفا برای ثبت انصراف از بیمه عمر طراحی شده است و افرادی که
              تمایل به تمدید آن دارند نیازی به تکمیل فرم توسط ایشان نمی باشد.
            </p>
          </CardFooter>
        </Card>
        <p className="z-0 text-white text-[10px] absolute bottom-3   shadow-sm text-center">
          مالکیت مادی و معنوی این سایت متعلق به اداره کل آموزش و پرورش خراسان
          رضوی می باشد.
        </p>
      </div>
    </div>
  );
}

export default bimePage;
