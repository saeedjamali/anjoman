"use client";


import React, {  useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { year } from "@/utils/constants";

function ManagerPage(params) {
  
  const currentYear = year.find((y) => y.currentYear);


  

  //?  قبلا در کلاینت کامپوننت فچ دیتا داشتیم که منتقل کردم به لاویت و الان در سرور کامپویننت دیتا فچ میشه و ارسال میشه
  //? کد یوس افکت در انتهای این تابع کامنت شد و درست کار میکنه
  return (
    <div className="w-full h-full ">

   
    </div>
  );
}

export default ManagerPage;

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
