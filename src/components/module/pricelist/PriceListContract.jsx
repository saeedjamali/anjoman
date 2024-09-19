"use client"
import React, { useEffect, useState } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner, Chip, Button, Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, useDisclosure,
    Tooltip,

} from "@nextui-org/react";
import { toast } from "react-toastify";
import { year } from "@/utils/constants";
import { traverse } from "@/utils/convertnumtopersian";
// import { useAsyncList } from "@react-stately/data";
export const PlusIcon = ({ size = 24, width, height, ...props }) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
        >
            <path d="M6 12h12" />
            <path d="M12 18V6" />
        </g>
    </svg>
);
const statusColorMap = {
    1: "success",
    paused: "danger",
    0: "warning",
};
const numberWithCommas = (x) => {
    return x.toString().replace(/\d(?=(\d{3})+\.)/g, ',');
};


export default function PriceListContract({ selectedYear, selectedUnit, selectedPricelist, setSelectedPricelist }) {
    const currentYear = year.find(y => y.id == selectedYear);
    const schoolGradeCode = selectedUnit?.schoolGradeCode;
    const schoolGenderCode = selectedUnit?.schoolgenderCode;
    const [isLoading, setIsLoading] = React.useState(false);
    const [priceList, setPriceList] = useState([]);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [currentPriceList, setCurrentPriceList] = useState([]);
    const { type, material, price, size, gender } = currentPriceList;
    const [quantity, setQuantity] = useState(0)
    const [priceInContract, setPriceInContract] = useState(0)

    const [isClient, setIsClient] = useState(false)

    if (isClient) {
        // Check if document is finally loaded
        traverse(document.getElementsByTagName('body')[0]);
        // localizeNumbers(document.getElementsByTagName('body')[0]);
    }
    useEffect(() => {
        setIsClient(true)
        // traverse(document.getElementsByTagName('body')[0]);
    }, [quantity, priceInContract])


    const addToPriceList = (event) => {
        if (quantity == 0) {
            toast.info("تعداد وارد شود")
            return
        }
        if (priceInContract == 0) {
            toast.info("قیمت واحد وارد شود")
            return
        }
        setIsLoading(true)
        event.preventDefault();

        const refreshList = priceList.map(p => {
            if (p._id == currentPriceList._id) {
                return {
                    ...currentPriceList, quantity, priceInContract: priceInContract.split(",").join("")
                }

            }
            return p
        })
        setPriceList(refreshList);
        const addPricelist = { ...currentPriceList, quantity, priceInContract: priceInContract.split(",").join("") };
        setSelectedPricelist((prev) => [...prev, addPricelist])
        onClose();
        setIsLoading(false)
        setQuantity(0)
    }
    useEffect(() => {

        const getPriceList = async () => {

            try {
                const response = await fetch(`/api/modir/pricelist/getpricelist/${currentYear.name}/${schoolGradeCode}/${schoolGenderCode}`);
                const data = await response.json();
                if (data.status == 201) {
                    setPriceList(data.pricelist)
                    setIsLoading(false)

                } else {
                    toast.info(data.message)

                }

            } catch (error) {
                console.log("catch in get price list -->", error)

                // toast.error("خطای ناشناخته")
            }
        }

        if (selectedUnit?.length != 0) {
            setIsLoading(true)
            getPriceList();
        }

    }, []);

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];
        console.log("item--->", item)
        switch (columnKey) {
            case "gender":

                return (
                    <Chip className="capitalize flex-center w-full flex-center " size="sm" variant="flat">
                        {cellValue == 1 ? 'پسر' : cellValue == 2 ? 'دختر' : 'مختلط'}
                    </Chip>
                );
            case "priceInContract":

                return (
                    <Chip className="capitalize flex-center w-full " color={cellValue == 0 ? statusColorMap[0] : statusColorMap[1]} size="sm" variant="flat">
                        {cellValue == 0 ? 'ثبت نشده' : cellValue != 0 ? item.priceInContract : 'نامشخص'}
                    </Chip>
                );
            case "quantity":

                return (
                    <Chip className="capitalize flex-center w-full " color={cellValue == 0 ? statusColorMap[0] : statusColorMap[1]} size="sm" variant="flat">
                        {cellValue == 0 ? 'ثبت نشده' : cellValue != 0 ? item.quantity : 'نامشخص'}
                    </Chip>
                );
            case "price":

                return (
                    <span >{parseFloat(cellValue.replace(/,/g, '')).toLocaleString()}</span>
                );
            case "action":
                return (
                    <div className="flex flex-col" >
                        <Tooltip
                            showArrow={true}
                            color="default"
                            content={"افزودن به لیست"}
                        >
                            <button className="text-[10px] bg-green-500 rounded-full text-white w-8 h-8 flex-center" onClick={() => {
                                setCurrentPriceList(item)
                                setQuantity(0);
                                setPriceInContract(0)
                                onOpen();

                            }}><PlusIcon /></button>
                        </Tooltip>
                    </div >
                );
            default:
                return cellValue;
        }
    }, []);

    return (

        <>
            <Table
                isHeaderSticky
                isStriped
                aria-label="Example table with client side "

                classNames={{
                    base: "max-h-[400px] ",
                    table: "min-h-[200px]",
                }}
            >
                <TableHeader>
                    <TableColumn key="type" >
                        نوع
                    </TableColumn>
                    <TableColumn key="material" >
                        جنس
                    </TableColumn>
                    <TableColumn key="size" >
                        سایز
                    </TableColumn>
                    <TableColumn key="gender" >
                        جنسیت
                    </TableColumn>
                    <TableColumn key="price" >
                        قیمت واحد  (مصوب)
                    </TableColumn>
                    <TableColumn key="quantity" >
                        تعداد
                    </TableColumn>
                    <TableColumn key="priceInContract" >
                        قیمت واحد(قرارداد)
                    </TableColumn>
                    <TableColumn key="action" >
                        عملیات
                    </TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={"لیست محصولات یافت نشد"}
                    items={priceList}
                    isLoading={isLoading}
                    loadingContent={<Spinner label="در حال دریافت اطلاعات..." />}
                >
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table >
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                radius="lg"
                classNames={{
                    body: "py-6 bg-white",
                    backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                    base: "border-[#292f46] bg-slate-700 text-[#a8b0d3]",
                    header: " border-[#292f46]  bg-primary_color text-white",
                    footer: " border-[#292f46] bg-white",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
            >
                {
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 font-iranyekanMedium text-md">
                                    مشاهده جزییات
                                </ModalHeader>
                                <ModalBody >
                                    {
                                        <form>
                                            <div className="relative mt-2 flex justify-end col-span-1">
                                                <div className="flex flex-col  w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">

                                                    <div className="flex flex-col gap-2">
                                                        <Input type="text" label="نوع" value={type} disabled />
                                                        <Input type="text" label="جنس" value={material} disabled />
                                                        <Input type="text" label="سایز" value={size} disabled />
                                                        <Input type="text" label="قیمت مصوب" value={parseFloat(price.replace(/,/g, '')).toLocaleString()} disabled />
                                                    </div>
                                                    <div className="flex gap-2 ">
                                                        <Input required autoFocus type="Number" label="تعداد" color={"success"} value={quantity == 0 ? null : quantity} onChange={(event) => setQuantity(event.target.value)} />
                                                        <Input required type="Number" label="قیمت قرارداد (ریال)" color={"success"} value={priceInContract == 0 ? null : priceInContract} onChange={(e) => setPriceInContract(e.target.value)} />
                                                    </div>
                                                    <span className="text-[12px] text-black">کلیه قیمت ها براساس قیمت واحد می باشد و از درج قیمت کلی خودداری شود</span>
                                                </div>

                                            </div>
                                        </form>
                                    }
                                </ModalBody>
                                <ModalFooter >
                                    <Button
                                        color="foreground"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        بستن
                                    </Button>
                                    <Button
                                        className="bg-green-700 text-white"
                                        color="success"
                                        variant="light"
                                        onClick={(event) => addToPriceList(event)}
                                        isLoading={isLoading}
                                    >
                                        <div className="flex-1 flex">افزودن به لیست</div>


                                    </Button>

                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                }

            </Modal>
        </>

    );
}

