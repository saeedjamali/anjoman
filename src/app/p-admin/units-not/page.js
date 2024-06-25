"use client"

import ExcelUnitUploader from '@/components/module/unit/ExcelUnitUploader'
import UnitManager from '@/components/module/unit/UnitManager'
import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'

function UnitPage() {
    const [showExcelUploader, setShowExcelUploader] = useState(false);
    return (
        <div className='w-full h-screen'>
            <ToastContainer
                bodyClassName={() =>
                    " flex-center text-sm font-white  p-3"
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


            <div className='w-full  bg-gray-100 ' >
                <div className='p-4'>
                    <div className='mb-4 bg-slate-300'>
                        <span className='p-4 flex'>واحد سازمانی موجود در پایگاه</span>
                    </div>
                    <UnitManager />
                </div>
            </div>
            
        </div>
    )
}

export default UnitPage