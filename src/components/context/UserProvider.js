"use client";

import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
function UserProvider({
  children,
  userFounded,
  modirFounded,
  unitsFounded,
  currentAdmin,
}) {
  const [showSidebar, setShowSideBar] = useState(true);
  const [showArrow, setShowArrow] = useState(false);
  const [user, setUser] = useState(userFounded);
  const [admin, setAdmin] = useState(currentAdmin);

  const [region, setRegion] = useState(admin?.Region);
  const [level, setLevel] = useState(userFounded);
  const [modir, setModir] = useState(modirFounded);
  const [units, setUnits] = useState(unitsFounded);

  useEffect(() => {
    const regionAdmin = { ...admin?.Region };
    setUser(userFounded);
    setModir(modirFounded);
    setUnits(unitsFounded);
    setAdmin(currentAdmin);
    setRegion(regionAdmin);
  }, [modir, user, units, currentAdmin]);

  return (
    <>
      <UserContext.Provider
        value={{
          showArrow,
          setShowArrow,
          showSidebar,
          setShowSideBar,
          user,
          setUser,
          modir,
          setModir,
          units,
          setUnits,
          admin,
          region,
        }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
}

export default UserProvider;

export function useUserProvider() {
  return useContext(UserContext);
}
