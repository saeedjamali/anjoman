"use client";
import ModirUnitAdmin from "@/components/module/unit/ModirUnitAdmin";
import { Button } from "@nextui-org/react";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";

function ModirUnitsPage() {
  const [selectedKeysMu, setSelectedKeysMu] = React.useState(new Set([]));


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
      <div className="bg-table ">

        <div className="header-table">
          <span >لیست مدیران مدارس</span>
        </div>
        <ModirUnitAdmin
          selectedKeys={selectedKeysMu}
          setSelectedKeys={setSelectedKeysMu}
        />



      </div>
    </div >
  );
}

export default ModirUnitsPage;

