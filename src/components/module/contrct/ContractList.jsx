"use client"
import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue, Spinner,
    Input,
    Button
} from "@nextui-org/react";

import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { DeleteIcon, EyeIcon } from "@/utils/icon";

const Map = dynamic(() => import("@/components/module/Map"), { ssr: false });



const columns = [
    { name: "کد قرارداد", uid: "code" },
    { name: "سال تحصیلی", uid: "year" },
    { name: "نام مدرسه", uid: "unitname" },
    { name: "نام شرکت", uid: "companyname" },
    { name: "تاریخ تنظیم", uid: "createdAt" },
    { name: "وضعیت", uid: "isConfirm" },
    { name: "عملیات", uid: "actions" },
];



const statusColorMap = {
    1: "success",
    2: "danger",
    0: "warning",
    10: "secondary"  //? فاقد قرارداد
};



export default function ContractList({ contractlist, setContractlist, isLoadingContractList,
    currenContract, setCurrenContract,
    setShowDetailContractItem, setIsShowNewContract }) {

    const [action, setAction] = useState(0) // 1- detail  2- remove contract
    const [isLoadingForModalbtn, setIsLoadingForModalbtn] = useState(false);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const loadingState = isLoadingContractList ? "loading" : "idle";
    // const src = `${API}/user/photo/${blog.postedBy.username}`;

    const onDeleteContractHandler = async (currentItem, contractlist) => {
        setIsLoadingForModalbtn(true)

        setCurrenContract(currentItem)
        try {
            const response = await fetch(`/api/modir/contract/removecontract/${currentItem._id}`, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.info(data.message)
                const removeFilter = contractlist.filter((item) => item._id != currenContract._id)
                setContractlist(removeFilter);
            } else {
                toast.error(data.message)
            }
            // router.push("/p-modir/uniform/contract")
        } catch (error) {
            console.log("error from remove contract Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
        onClose();
    }

    const renderCell = React.useCallback((contract, columnKey) => {

        const cellValue = contract[columnKey];
        let currentItem = { ...contract };

        switch (columnKey) {

            case "isConfirm":
                return (
                    <Chip className="capitalize" color={statusColorMap[contract.isConfirm]} size="sm" variant="flat">
                        {cellValue == 0 ? 'در حال بررسی ' : cellValue == 1 ? 'تایید' : cellValue == 2 ? 'رد' : 'فاقد قرارداد'}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        {contract.isConfirm != 10 &&
                            <Tooltip content="مشاهده جزییات">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <EyeIcon onClick={(e) => {
                                        e.preventDefault();

                                        setCurrenContract(currentItem)
                                        setShowDetailContractItem(prev => !prev)
                                        setAction(1);
                                        setIsShowNewContract(false);

                                    }} />
                                </span>
                            </Tooltip>}
                        {contract.isConfirm == 0 &&
                            <Tooltip color="danger" content="حذف">
                                <span className="text-lg text-danger cursor-pointer active:opacity-50" >
                                    <DeleteIcon onClick={(e) => {
                                        e.preventDefault();
                                        setCurrenContract(currentItem)
                                        setAction(2)
                                        if (currentItem.isConfirm != 0) {
                                            toast.info("تنها امکان حذف درخواست های با وضعیت در حال بررسی وجود دارد")
                                            return
                                        }
                                        onOpen();


                                    }} />
                                </span>
                            </Tooltip>
                        }
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <>
            <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={contractlist} loadingContent={<Spinner />}
                    loadingState={loadingState} emptyContent={"قراردادی یافت نشد"}>
                    {(item) => (
                        <TableRow key={item.code}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}

                        </TableRow>

                    )}
                </TableBody>
            </Table>

            <>
                <Modal
                    backdrop="opaque"
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    radius="lg"
                    classNames={{
                        body: "py-6 bg-white",
                        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                        base: "border-[#292f46] bg-slate-700 text-[#a8b0d3]",
                        header: " border-[#292f46]  bg-red-900 text-white",
                        footer: " border-[#292f46] bg-white",
                        closeButton: "hover:bg-white/5 active:bg-white/10",
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 font-iranyekanMedium text-md">
                                    حذف قرارداد
                                </ModalHeader>
                                <ModalBody >
                                    {
                                        <form>
                                            <div className="relative mt-2 flex justify-end col-span-1">
                                                <div className="flex flex-col  w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                    <div className="flex gap-2 text-black">
                                                        <p>
                                                            {`از حذف قرارداد با شرکت ${currenContract.companyname} اطمینان دارید؟`}
                                                        </p>
                                                    </div>

                                                    <div className="w-full  mt-4 rounded-md bg-green-600 z-10 ">

                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    }
                                </ModalBody>
                                <ModalFooter >
                                    <Button color="foreground" variant="light" onPress={onClose}>
                                        بستن
                                    </Button>
                                    <Button className={"bg-red-700 text-white"} color="danger" variant="light" isLoading={isLoadingForModalbtn} onPress={() => onDeleteContractHandler(currenContract, contractlist)}>
                                        حذف
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal >
            </>

        </>
    );
}
