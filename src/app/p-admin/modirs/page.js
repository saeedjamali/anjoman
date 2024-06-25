"use client";

import ModirManager from "@/components/module/modir/ModirManager";
import React from "react";
import { ToastContainer } from "react-toastify";

function ModirPage() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
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
          <span >لیست مدیران</span>
        </div>
        <ModirManager
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />

      </div>
    </div>
  );
}

export default ModirPage;
