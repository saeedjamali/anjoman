"use client";

import UserAdminManager from "@/components/module/user/UserAdminManager";
import UserManager from "@/components/module/user/UserManager";
import React from "react";
import { ToastContainer } from "react-toastify";

function UserPage() {
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

                    <span >لیست کاربران</span>
                </div>
                <UserAdminManager
                    selectedKeys={selectedKeys}
                    setSelectedKeys={setSelectedKeys}
                />
            </div>

        </div>
    );
}

export default UserPage;
