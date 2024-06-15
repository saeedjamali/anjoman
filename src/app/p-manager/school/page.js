"use client"

import ExcelUnitUploader from '@/components/module/unit/ExcelUnitUploader'
import UnitManager from '@/components/module/unit/UnitManager'
import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'

function School() {
    const [showExcelUploader, setShowExcelUploader] = useState(false);
    return (
        <div className='w-full h-screen'>
            <ToastContainer
                bodyClassName={() =>
                    " flex-center text-sm font-white font-iranyekan p-3"
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
                    <span className='flex'>واحد سازمانی موجود در پایگاه</span>
                </div>
                <UnitManager />
            </div>
            <div className="bg-table mt-8">
                <div className="header-table m-0">
                    <div onClick={() => setShowExcelUploader(prev => !prev)}>
                        <span className=' flex'>بارگذاری اطلاعات از طریق اکسل(پیش نمایش اطلاعات)</span>
                    </div>
                </div>
                {showExcelUploader &&
                    <ExcelUnitUploader />
                }
            </div>
        </div>
    )
}

export default School