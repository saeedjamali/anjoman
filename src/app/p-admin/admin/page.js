"use client"
import AdminManager from '@/components/module/admin/AdminManager';
import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify';

function AdminPage() {
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));


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
                    <span >لیست کارشناسان</span>
                </div>
                <AdminManager
                    selectedKeys={selectedKeys}
                    setSelectedKeys={setSelectedKeys}
                />

            </div>
        </div>
    );

}

export default AdminPage