"use client";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { year } from "@/utils/constants";
import { traverse } from "@/utils/convertnumtopersian";
import Notification from "@/components/template/modir/Notification";
import { useUserProvider } from "@/components/context/UserProvider";
import LectureInformation from "@/components/template/lecturer/Lecturer";

//* این صفحه برای مدیریت اطلاعات کارشناسان مناطق/ استان و ستاد طراحی شده است.
function LecturerPage(params) {

 

  return (
    <div className="w-full h-full ">
      <div className="xl:grid xl:grid-cols-2 xl:grid-flow-row auto-rows-[minmax(0,_2fr)] xl:gap-4">
        <div className="xl:col-span-1  xl:col-start-1 ">
          {/* <Suspense fallback={<p>در حال دریافت اطلاعات مدیر</p>}> */}
          <LectureInformation />
        </div>
        <div className="xl:col-span-1  xl:row-start-1 xl:row-end-3 xl:col-start-2">
          <Notification />
        </div>
      </div>
    </div>
  );
}

export default LecturerPage;
