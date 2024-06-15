"use client";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { year } from "@/utils/constants";
import { traverse } from "@/utils/convertnumtopersian";
import Notification from "@/components/template/modir/Notification";
import AdminInformation from "@/components/template/admin/AdminInformantion";
import { useUserProvider } from "@/components/context/UserProvider";

//* این صفحه برای مدیریت اطلاعات کارشناسان مناطق/ استان و ستاد طراحی شده است.
function AdminPage(params) {
  const currentYear = year.find((y) => y.currentYear);
  const [isClient, setIsClient] = useState(false);
  const { admin, region } = useUserProvider();
  
  //?  قبلا در کلاینت کامپوننت فچ دیتا داشتیم که منتقل کردم به لاویت و الان در سرور کامپویننت دیتا فچ میشه و ارسال میشه
  //? کد یوس افکت در انتهای این تابع کامنت شد و درست کار میکنه
  if (isClient) {
    // Check if document is finally loaded
    traverse(document.getElementsByTagName("body")[0]);
    // localizeNumbers(document.getElementsByTagName('body')[0]);
  }
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full h-full ">
      <div className="xl:grid xl:grid-cols-2 xl:grid-flow-row auto-rows-[minmax(0,_2fr)] xl:gap-4">
        <div className="xl:col-span-1  xl:col-start-1 ">
          {/* <Suspense fallback={<p>در حال دریافت اطلاعات مدیر</p>}> */}
          <AdminInformation admin={admin} region={region} />
        </div>
        <div className="xl:col-span-1  xl:row-start-1 xl:row-end-3 xl:col-start-2">
          <Notification />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

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
