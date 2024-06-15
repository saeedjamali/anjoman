"use client"

import { useRouter } from 'next/router';
import React, { createContext, useContext, useState } from 'react'
import { year } from "@/utils/constants";

const AppContext = createContext();
function AppProvider({ children }) {
    const [phone, setPhone] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const currentYear = year.find((y) => y.currentYear);
    // const [isShowSignInForm, setIsShowSignInForm] = useState("Hello");

    return (
        <>
            <AppContext.Provider value={{
                phone,
                setPhone,
                identifier,
                setIdentifier,
                password,
                setPassword,
                year:currentYear.name
            }}>{children}</AppContext.Provider>
        </>
    )
}

export default AppProvider;

export function useAppProvider() {
    return useContext(AppContext)
}