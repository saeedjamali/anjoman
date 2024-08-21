import React, { useState } from 'react'
import Image from "next/image";
import { authTypes, roles } from '@/utils/constants';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';


function RoleSelection({ role, SetRole, SetAuthTypesForm }) {
    const router = useRouter();

    const roleHandler = async (event, selectedRole) => {
        event.preventDefault();

        try {


            const response = await fetch("/api/auth/me");
            const data = await response.json();
            // console.log("Data in Role data.user.role---->", data.user.role);
            // console.log("Data in Role data.user.role---->", selectedRole.name);

            if (data.status == 201) {
                if (data.user.role == "modir" && data.user.role == selectedRole.name) {
                    router.push('/p-modir')
                    router.refresh();
                } else if (data.user.role == "admin" && data.user.role == selectedRole.name) {
                    router.push('/p-admin')
                    router.refresh();
                } else if (data.user.role == "lecturer" && data.user.role == selectedRole.name) {
                    router.push('/p-lecturer')
                    router.refresh();
                }
                else {
                    SetAuthTypesForm(authTypes.LOGIN);
                    switch (selectedRole) {
                        case roles.MODIR: SetRole(roles.MODIR)
                            break;
                        case roles.ADMIN: SetRole(roles.ADMIN)
                            break;
                        case roles.LECTURER: SetRole(roles.LECTURER)
                            break;
                        case roles.SHERKAT: SetRole(roles.SHERKAT)
                            break;
                        default: console.log("role handler not recogenize role")
                    }
                }
            }
            else {
                SetAuthTypesForm(authTypes.LOGIN);
                switch (selectedRole) {
                    case roles.MODIR: SetRole(roles.MODIR)
                        break;
                    case roles.ADMIN: SetRole(roles.ADMIN)
                        break;
                    case roles.LECTURER: SetRole(roles.LECTURER)
                        break;
                    case roles.SHERKAT: SetRole(roles.SHERKAT)
                        break;
                    default: console.log("role handler not recogenize role")
                }
            }
        } catch (error) {
            console.log("Error in role selection---> ", error)
        }
    }
    return (
        <div>
            <div className="min-w-64 w-80  flex-col-center h-96" >
                <span className="text-[16px] shadow-lg shadow-indigo-200 text-header-font-color my-6 lg:mb-8 lg:my-0 lg:mt-8 flex-center font-iranSans px-4 py-2 rounded-md">انتخاب نقش</span>
                <div className="flex-1" >
                    <ul className="grid grid-cols-2 font-iranyekanMedium text-sm my-4 gap-8">
                        <li  >

                            {/* <button className="role-section" onClick={() => toast.info("در حال حاضر غیر فعال می باشد.")}> */}

                            <button className="role-section" onClick={() => {
                                SetRole(roles.MODIR)
                                roleHandler(event, roles.MODIR)
                            }}>
                                <Image className="w-16 h-16 my-2" src={"/images/school.png"} width={100} height={100} alt="modir" />
                                <span className="w-full bg-header text-center py-1 px-4 rounded-b-lg">مدیر مدرسه</span>
                            </button>
                        </li>
                        <li  >
                            <button className="role-section" onClick={() => {
                                SetRole(roles.LECTURER)
                                roleHandler(event, roles.LECTURER)
                            }}>
                                <Image className="w-16 h-16 my-2" src={"/images/lecturer.png"} width={100} height={100} alt="modir" />
                                <span className="w-full bg-header rounded-b-lg text-center py-1 px-4 ">مدرسین</span>
                            </button>
                        </li>
                        <li  >
                            <button className="role-section" onClick={() => toast.info("این امکان در حال حاضر غیرفعال می باشد.")}>

                                <Image className="w-16 h-16 my-2" src={"/images/family.png"} width={100} height={100} alt="modir" />
                                <span className="w-full bg-header rounded-b-lg text-center py-1 px-4 ">والدین</span>
                            </button>
                        </li>
                        <li  >
                            <button className="role-section" onClick={() => {
                                SetRole(roles.ADMIN)
                                roleHandler(event, roles.ADMIN)
                            }}>
                                <Image className="w-16 h-16 my-2" src={"/images/karshenas.png"} width={100} height={100} alt="modir" />
                                <span className="w-full bg-header rounded-b-lg text-center py-1 px-4 ">کارشناس</span>
                            </button>
                        </li>
                    </ul>

                </div>
            </div>
        </div>
    )
}

export default RoleSelection