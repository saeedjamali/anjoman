import UserProvider, { useUserProvider } from '@/components/context/UserProvider'
import Footer from '@/components/module/Footer'
import Navbar from '@/components/module/Navbar'
import Sidebar from '@/components/module/Sidebar'
import { authenticateMe } from '@/utils/authenticateMe'
import React from 'react'
import { redirect } from 'next/navigation'
import modirUnitModel from "@/models/modiran/modirUnit"
import mongoose from "mongoose";
import { toast } from 'react-toastify'

async function ModirLayout({ children }) {

    const userIsExists = await authenticateMe();
    let modir = {}
    let units = []
    if (userIsExists) {
        try {
            const foundedModirUnit = await modirUnitModel.find({
                $and: [
                    { User: JSON.parse(JSON.stringify(userIsExists))._id }
                ]
                // $or: [{ isActive: 0 }, { isActive: 1 }]
            }, "-__v ").populate([
                {
                    path: 'Modir',
                }
            ]);

            if (!foundedModirUnit) {
                toast.error("این کاربری واحد سازمانی فعالی ندارد")
                redirect('/')

            } else {
                modir = foundedModirUnit[0]?.Modir;
                foundedModirUnit.map(prev => units.push({ ...JSON.parse(JSON.stringify(prev.Unit)), isActive: prev.isActive }))
            }

        } catch (error) {
            console.log("Error ->", error)
            redirect('/')
        }
    } else {
        redirect('/')
    }

    return (
        <div className='flex relative w-full '>


            <UserProvider userFounded={JSON.parse(JSON.stringify(userIsExists))} modirFounded={JSON.parse(JSON.stringify(modir))} unitsFounded={JSON.parse(JSON.stringify(units))} >

                <div>
                    <Sidebar />
                </div>
                <div className='w-full h-screen flex flex-col p-2 '>
                    <Navbar />
                    <div className='flex-1 h-screen overflow-auto border-2 border-header p-2 font-iranyekan'>

                        {children}

                    </div>
                    <Footer />
                </div>
            </UserProvider>
        </div>
    )
}

export default ModirLayout