"use client";

import ExcelRegionUploader from "@/components/module/region/ExcelRegionUploader";
import RegionManager from "@/components/module/region/RegionManager";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

function Region() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [showExcelUploader, setShowExcelUploader] = useState(false);
  return (
    <div className="w-full h-screen">
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

      <div className="bg-table">
        <div className="header-table">
          <span className="flex">مناطق موجود در پایگاه</span>
        </div>
        <RegionManager selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} />
      </div>

      <div className="bg-table mt-8">
        <div className="header-table m-0">
          <div  onClick={() => setShowExcelUploader((prev) => !prev)}>
            <span className=" flex">
              بارگذاری اطلاعات از طریق اکسل(پیش نمایش اطلاعات)
            </span>
          </div>
        </div>
        {showExcelUploader && (
          <div>
            <ExcelRegionUploader />
          </div>
        )}
      </div>
    </div>
  );
}

export default Region;
