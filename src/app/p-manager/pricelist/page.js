"use client"

import ExcelPriceListUploader from '@/components/module/pricelist/ExcelPriceListUploader';
import PriceListManager from '@/components/module/pricelist/PriceListManager';
import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'

function PriceListPage() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
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
          <span className=' flex'>شرکت های موجود در پایگاه</span>
        </div>
        <PriceListManager selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} />
      </div>

      <div className="bg-table mt-8">
        <div className="header-table m-0">
          <div onClick={() => setShowExcelUploader(prev => !prev)}>
            <span className='flex'>بارگذاری اطلاعات از طریق اکسل(پیش نمایش اطلاعات)</span>
          </div>

        </div>
        {showExcelUploader &&
          <div>
            <ExcelPriceListUploader />
          </div>

        }
      </div>
    </div>
  )
}

export default PriceListPage