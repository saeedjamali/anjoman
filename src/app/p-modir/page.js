"use client";

import ModirInformation from "@/components/template/modir/ModirInformation";
import SchoolInformation from "@/components/template/modir/SchoolInformation";
import Notification from "@/components/template/modir/Notification";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { year } from "@/utils/constants";
import { useUserProvider } from "@/components/context/UserProvider";
import { FaPlus } from "react-icons/fa6";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { valiadteSchoolCode } from "@/utils/auth";
import Upload from "@/components/module/uploader/UploaderS3";
import { traverse } from "@/utils/convertnumtopersian";

function ModirPage(params) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { user, setUser, modir, setModir, units, setUnits } = useUserProvider();
  const [unitCode, setUnitCode] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false)
  const router = useRouter();
  const currentYear = year.find((y) => y.currentYear);


  if (isClient) {
    // Check if document is finally loaded
    traverse(document.getElementsByTagName('body')[0]);
    // localizeNumbers(document.getElementsByTagName('body')[0]);
  }

  useEffect(() => {
    setIsClient(true)
  }, []);
  const addModirUnitHandler = async (event, onClose) => {
    event.preventDefault();

    setIsLoading(true);
    if (!valiadteSchoolCode(unitCode)) {
      toast.error("كد بطور صحيح وارد نشده است");
      setIsLoading(false);
      return;
    }

    const unitFounded = units.find(
      (unit) => unit.schoolCode == unitCode && unit.year == currentYear.name
    );
    if (unitFounded) {
      toast.info("اين واحد سازماني در ليست واحدهای سازماني شما وجود دارد");
      setIsLoading(false);
      return;
    }

    try {
      const resposne = await fetch(`/api/modir/addnewunit`, {
        ////
        method: "POST",
        header: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          unitCode,
          year: currentYear.name,
          modirId: modir._id,
          userId: user._id,
        }),
      });
      const data = await resposne.json();
      if (data.status == 200) {
        toast.success(data.message);
        units.push(data.unit);

        setIsLoading(false);
        onClose();
        return;
      }
      toast.error(data.message);
      onClose();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("catch error-->", error);
    }
  };

  //?  قبلا در کلاینت کامپوننت فچ دیتا داشتیم که منتقل کردم به لاویت و الان در سرور کامپویننت دیتا فچ میشه و ارسال میشه
  //? کد یوس افکت در انتهای این تابع کامنت شد و درست کار میکنه
  return (
    <div className="w-full h-full ">


      <div className="xl:grid xl:grid-cols-2 xl:grid-flow-row auto-rows-[minmax(0,_2fr)] xl:gap-4">
        <div className="xl:col-span-1  xl:col-start-1 ">
          {/* <Suspense fallback={<p>در حال دریافت اطلاعات مدیر</p>}> */}
          <ModirInformation modir={modir} />
          {/* </Suspense> */}
          {/* <Suspense fallback={<p>در حال دریافت اطلاعات واحد سازمانی ...</p>}> */}
          {units.map((unit, index) => (
            <SchoolInformation unit={unit} user={user} key={index} />
          ))}
          {/* </Suspense> */}
        </div>
        <div className="xl:col-span-1  xl:row-start-1 xl:row-end-3 xl:col-start-2">
          <Notification />
        </div>
        <Button
          className="fixed  bottom-16 left-8 font-iranyekan p-2 text-white  z-20"
          // onClick={() => addModirUnitHandler(event)}
          onPress={onOpen}
          color=""
        >
          <>
            <Modal
              backdrop="opaque"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              radius="lg"
              classNames={{
                body: "py-6 bg-white",
                backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                base: "border-[#292f46] bg-slate-700 text-[#a8b0d3]",
                header: " border-[#292f46]  bg-primary_color text-white",
                footer: " border-[#292f46] bg-white",
                closeButton: "hover:bg-white/5 active:bg-white/10",
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 font-iranyekan text-md">
                      افزودن واحد سازمانی جدید
                    </ModalHeader>
                    <ModalBody className="font-iranyekan">
                      {modir.isActive != 1 && (
                        <p>
                          صرفا در صورتی امکان افزودن واحد سازمانی جدید را دارید
                          که اطلاعات مدیر در وضعیت تایید شده باشد
                        </p>
                      )}
                      {modir.isActive == 1 && (
                        <form>
                          <div className="relative mt-2 flex justify-end col-span-1">
                            <span className="text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24">
                              کد واحد سازمانی
                            </span>
                            <input
                              className="input-text-modal mt-2 "
                              type="number"
                              placeholder="کد واحد سازمانی"
                              value={unitCode}
                              onChange={() => setUnitCode(event.target.value)}
                            ></input>
                          </div>
                        </form>
                      )}
                    </ModalBody>
                    <ModalFooter className="font-iranyekan">
                      <Button
                        color="foreground"
                        variant="light"
                        onPress={onClose}
                      >
                        بستن
                      </Button>
                      {modir.isActive == 1 && (
                        <Button isLoading={isLoading}
                          className="bg-btn-primary shadow-lg shadow-indigo-500/20 text-white flex-center"
                          onPress={() => addModirUnitHandler(event, onClose)}
                        >
                          افزودن
                        </Button>
                      )}
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
          <span className="flex items-center justify-end bg-blue-600 rounded-full cursor-pointer p-2 ">
            <span className="hidden md:flex-center px-2 text-[12px] ">
              افزودن واحد سازمانی جدید
            </span>
            <span className="flex-center md:hidden text-2xl">
              <FaPlus />
            </span>
          </span>
        </Button>
      </div>
    </div>
  );
}

export default ModirPage;

// در صورتی که بخواهیم در cs
// دیتا دریافت کنیم این فچ فعال میشه
// چون در میدلویر کنترل توکن و تولید مجدد اون رو داشتیم اینجا دوباره کاری نکردیم
// useEffect(() => {
//   const getUser = async () => {

//     const response = await fetch('/api/auth/me');
//     const data = await response.json();
//     let mu = []
//     if (data.status == 201) {
//       setUser({ ...data.user });
//       // const response = await fetch(`/api/modirunit/${data.user._id}/${currentYear.name } `, { cache: 'force-cache' });
//       const response = await fetch(`/api/modirunit/${data.user._id}`);
//       const modirUnit = await response.json();
//       if (modirUnit.status == 200) {

//         setModir(modirUnit.foundedModirUnit[0].Modir)
//         modirUnit.foundedModirUnit.map(prev => mu.push({ ...prev.Unit, isActive: prev.isActive }))
//         setUnits(mu);
//       }

//     } else {
//       router.push("/")
//     }
//   }

//   getUser();

// }, []);
