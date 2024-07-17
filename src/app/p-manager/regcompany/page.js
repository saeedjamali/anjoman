"use client"

import CompanyManager from '@/components/module/company/CompanyManager'
import RegionManager from '@/components/module/region/RegionManager'
import { year } from '@/utils/constants'
import { Button, Spinner } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { TbTransferVertical } from "react-icons/tb";
function getLastItem(_set) {
    return [..._set].pop();
}
function RegCompany() {

    const currentYear = year.find(y => y.currentYear);
    //* در هر سال تحصیلی در مناطق محتلف شرکت های مختلفی داریم
    const [selectedKeysRegion, setSelectedKeysRegion] = React.useState(new Set([]));
    const [selectedKeysCompany, setSelectedKeysCompany] = React.useState(new Set([]));
    const [isLoading, setIsLoading] = useState(false)
    const [regCompanies, setRegCompanies] = useState([]);

    useEffect(() => {
        const getAllRegCompanies = async () => {
            try {
                const response = await fetch(`/api/manager/regcompany/getall/${currentYear.name}`)
                const data = await response.json();
                if (data.status == 201) {
                    setRegCompanies(data.regCompanies);
                } else {
                    toast.info("در سال تحصیلی جاری هیچ شرکتی به مناطق تخصیص داده نشده است")
                }
            } catch (error) {
                console.log("Error in catch get all reg companies-->", error)
                toast.error("خطای ناشناخته");
            }
        }
        getAllRegCompanies();
    }, [selectedKeysRegion,
        selectedKeysCompany]);

    useEffect(() => {
        const filterItem = regCompanies?.find(rc => {
            if (rc.Region == getLastItem(selectedKeysRegion)) {
                return rc.companies;
            }
        })

        setSelectedKeysCompany(filterItem ? new Set([...filterItem?.companies]) : new Set([]));
        // setSelectedKeysCompany(selectedKeysCompany)
    }, [selectedKeysRegion]);

    useEffect(() => {
        let regionId = []
        regionId.push(regCompanies?.filter(rc => {
            const filterItem = rc.companies.find(item => item == getLastItem(selectedKeysCompany))
            return filterItem;
        }))
        // setSelectedKeysRegion(regionId ? new Set([...regionId]) : new Set([]));
    }, [selectedKeysCompany]);


    const mapCompanytoReg = async () => {
        try {

            if (selectedKeysCompany.size == 0) {
                toast.info("هیچ شرکتی انتخاب نشده است")
                return false
            }
            if (selectedKeysRegion.size == 0) {
                toast.info("هیچ منطقه ای انتخاب نشده است")
                return false
            }
            setIsLoading(true);
            const response = await fetch("/api/manager/regcompany/addtoregion", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({ companies: [...selectedKeysCompany], region: [...selectedKeysRegion], year: currentYear.name })
            });

            const data = await response.json();
            if (data.status == 201) {
                toast.success("اطلاعات شرکت - منطقه بروز شد")
                setIsLoading(false)
                return
            }
            toast.error(data.message)

        } catch (error) {
            console.log("Error in catch map TEST CENTER to LECTURER --->", error)
            toast.error("خطای ناشناخته")

        }
        setIsLoading(false)
    }

    return (
        <div className='w-full h-screen'>
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
                    <span className='flex'>مناطق موجود</span>
                </div>
                <RegionManager selectedKeys={selectedKeysRegion} setSelectedKeys={setSelectedKeysRegion} />
            </div>



            <div className='  mx-4 p-4 flex   items-center justify-center gap-4'>
                <span className='text-red-900 flex-center'>با زدن دکمه افزودن شرکت های انتخاب شده به مناطق انتخاب شده افزوده می شود</span>
                <Button isLoading={isLoading} className='bg-blue-500 text-white ' endContent={<TbTransferVertical />} onClick={mapCompanytoReg}>افزودن

                </Button>
            </div>
            <div className="bg-table">
                <div className="header-table">
                    <span className=' flex bg-gray-300 '>شرکت های موجود </span>
                </div>
                <CompanyManager selectedKeys={selectedKeysCompany} setSelectedKeys={setSelectedKeysCompany} />
            </div>
        </div>

    )
}

export default RegCompany