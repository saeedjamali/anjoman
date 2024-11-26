"use client"
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Spinner,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Chip, Tooltip,
    Textarea
} from "@nextui-org/react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { authTypes, roles, year } from '@/utils/constants'
import { useUserProvider } from "@/components/context/UserProvider";
import { ChevronDownIcon, DeleteIcon, EditIcon, EyeIcon, SearchIcon } from "@/utils/icon";
// import { columns, users, statusOptions } from "./data";


const INITIAL_VISIBLE_COLUMNS = ["code", "unitname", "companyname", "createdAt", "year", , "regionname", "isConfirm", "limited", "actions"];

const columns = [
    { name: "سال تحصیلی", uid: "year", sortable: true },
    { name: "کد قرارداد", uid: "code", sortable: true },
    { name: "نام منطقه", uid: "regionname" },
    { name: "کد منطقه", uid: "regioncode" },
    { name: "کد مدرسه", uid: "unitcode" },
    { name: "نام مدرسه", uid: "unitname" },
    { name: "نام شرکت", uid: "companyname" },
    { name: "کد شرکت", uid: "companycode", sortable: true },
    { name: "تاریخ تنظیم", uid: "createdAt", sortable: true },
    { name: "محدودیت", uid: "limited", sortable: true },
    { name: "وضعیت", uid: "isConfirm" },
    { name: "عملیات", uid: "actions" },
];

const statusColorMap = {
    1: "success",
    2: "danger",
    0: "warning",
    10: "secondary"
};

const statusOptions = [
    { name: "تایید شده", uid: 1 },
    { name: "رد شده", uid: 2 },
    { name: "در حال بررسی", uid: 0 },
    { name: "فاقد قرارداد", uid: 10 },
];
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


const currentYear = year.find(y => y.currentYear);
export default function ContractManager({

    setShowDetailContractItem, setCurrenContract, currenContract, setContractlistLen, contractlist, setContractlist }) {
    let quantity = 0; //? جمع کل محصولات موجود در سبد
    const [action, setAction] = useState(0) // 1- detail  2- remove contract
    const [isLoadingForModalbtn, setIsLoadingForModalbtn] = useState(false);
    const [isLoadingForDenyModalbtn, setIsLoadingForDenyModalbtn] = useState(false);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { region, admin } = useUserProvider();

    const [isLoadingContractList, setIsLoadingContractList] = useState(false);
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const loadingState = isLoadingContractList ? "loading" : "idle";
    const [limited, setLimited] = useState(1);
    const [description, setDescription] = useState("");
    const [isConfirm, setIsConfirm] = useState(0);
    const [key, setKey] = useState("");
    const [filterValue, setFilterValue] = React.useState("");

    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "year",
        direction: "ascending",
    });



    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);



    const filteredItems = React.useMemo(() => {
        let filterContractList = [...contractlist];

        if (hasSearchFilter) {
            filterContractList = filterContractList.filter((contractItem) =>
                contractItem?.unitname?.toLowerCase().includes(filterValue.toLowerCase()) ||
                contractItem?.companyname?.toLowerCase().includes(filterValue.toLowerCase()) ||
                contractItem?.code == filterValue ||
                contractItem?.unitcode == filterValue ||
                contractItem?.companycode == filterValue,
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filterContractList = filterContractList?.filter((contractItem) =>
                Array.from(statusFilter).includes(contractItem?.isConfirm + "")

            );
        }

        return filterContractList;
    }, [contractlist, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);


    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);


    useEffect(() => {

        setIsLoadingContractList(true);
        const getContract = async () => {
            const level = admin.level;
            const regionCode = region.regionCode;
            const provinceCode = region.provinceCode;
            try {
                const response = await fetch(`/api/admin/contract/getperregion/${level}/${regionCode}/${provinceCode}/${currentYear.name}`);
                const data = await response.json();
                // console.log("contractlist--->", data);
                if (data.status == 201) {
                    toast.success(data.message);
                    const newlist = [...data.contractlist];
                    // console.log("Data contract --->", newlist)
                    // setContractlist(newlist);
                    const viewContractlist = newlist.map((cl) => {
                        // console.log(cl)
                        return {
                            ...cl,

                            companyname: cl.isConfirm == 10 ? "فاقد قرارداد" : cl?.company.name,
                            companycode: cl.isConfirm == 10 ? "فاقد قرارداد" : cl?.company.code,
                            unitname: cl.Unit.schoolName,
                            unitcode: cl.Unit.schoolCode,
                            regionname: cl.Unit.regionName,
                            regioncode: cl.Unit.regionCode,

                            createdAt: new Date(cl.createdAt).toLocaleString("fa-IR"),
                        };
                    });

                    setContractlist([...viewContractlist]);
                    setContractlistLen(viewContractlist.length)
                } else {
                    toast.info(data.message);
                }

                setIsLoadingContractList(false);
            } catch (error) {
                console.log("Error in get contract --->", error);
                setIsLoadingContractList(false);
            }
        };
        setIsLoadingContractList(true);
        getContract();
    }, []);

    const onDeleteContractHandler = async (currentItem, contractlist) => {
        setIsLoadingForModalbtn(true)

        setCurrenContract(currentItem)
        try {
            const response = await fetch(`/api/admin/contract/removecontract/${currentItem._id}`, {
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
            setIsLoadingForModalbtn(false)
            // router.push("/p-modir/uniform/contract")
        } catch (error) {
            console.log("error from remove contract Handler --->", error)
            setIsLoadingForModalbtn(false)
        }
        onClose();
    }
    const onSubmitContractHandler = async (currenContract, isConfirm, quantity) => {
        if (isConfirm == 1) {
            setIsLoadingForModalbtn(true)
        }
        if (isConfirm == 2) {
            setIsLoadingForDenyModalbtn(true)
        }
        try {
            const response = await fetch("/api/admin/contract/putsubmit", {
                method: "PUT",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    limited, description, isConfirm, quantity,
                    code: currenContract.code,
                    companycode: currenContract?.company?.code,
                    unitcode: currenContract.unitcode,
                    year: currenContract.year
                })
            });
            const data = await response.json();
            if (data.status == 201) {
                const newContractlist = contractlist.map(cl => {

                    if (cl.code == currenContract.code) {

                        return {
                            ...cl,
                            limited, description, isConfirm: isConfirm == 1 || isConfirm == 4 ? 1 : 2
                        }
                    }
                    else
                        return cl
                })

                setContractlist(newContractlist);
                toast.success(data.message);
                location.reload()
            } else {
                toast.error(data.message);
            }
            setIsLoadingForModalbtn(false)
            setIsLoadingForDenyModalbtn(false)

        } catch (error) {
            console.log("error in put contract in admin panel-->", error)
            setIsLoadingForModalbtn(false)
            setIsLoadingForDenyModalbtn(false)
            toast.error("خطا ناشناخته");
        }
        onClose();
        // console.log("ready to send --->", schools)
    }
    //!!!!!!!!!!!!!
    const renderCell = React.useCallback((contract, columnKey) => {

        const cellValue = contract[columnKey];
        let currentItem = { ...contract };
        let currentList = [...contractlist]
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
                            <div className="flex gap-4">
                                <Tooltip content="مشاهده جزییات">
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                        <EyeIcon onClick={(e) => {
                                            e.preventDefault();
                                            setCurrenContract(currentItem)
                                            setShowDetailContractItem(true)
                                            setAction(1);


                                        }} />
                                    </span>
                                </Tooltip>
                                {admin.level != 11 &&
                                    <Tooltip content="تایید/رد  ">
                                        <span className="text-lg text-danger cursor-pointer active:opacity-50" >
                                            <EditIcon className="text-blue-500" onClick={(e) => {
                                                e.preventDefault();
                                                setCurrenContract(currentItem)
                                                setAction(2)
                                                setLimited(currentItem.limited)
                                                setDescription(currentItem.description)
                                                onOpen();


                                            }} />
                                        </span>
                                    </Tooltip>
                                }
                            </div>}

                        {contract.isConfirm == 10 &&
                            <div className="flex gap-4">
                                <Tooltip content="حذف">
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50" >
                                        <DeleteIcon className="text-red-500" onClick={(e) => {
                                            e.preventDefault();
                                            setCurrenContract(currentItem)
                                            setAction(3)
                                            setLimited(currentItem.limited)
                                            setDescription(currentItem.description)
                                            onOpen();


                                        }} />
                                    </span>
                                </Tooltip>
                                {/* <Tooltip content="تایید/رد  ">
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50" >
                                        <EditIcon className="text-blue-500" onClick={(e) => {
                                            e.preventDefault();
                                            setCurrenContract(currentItem)
                                            setAction(2)
                                            setLimited(currentItem.limited)
                                            setDescription(currentItem.description)
                                            onOpen();


                                        }} />
                                    </span>
                                </Tooltip> */}
                            </div>}




                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="  جستجو براساس نام و کد واحد سازمانی-قرارداد و شرکت"
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    وضعیت قرارداد
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    ستون ها
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        {/* <Button color="primary" endContent={<PlusIcon />} >
                            <label for="excel">بارگذاری اکسل</label>
                            <input

                                id="excel"
                                type="file"
                                title=""
                                className="custom-file-input text-white w-full "
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    readExcel(file);
                                }}
                            >
                            </input>

                        </Button> */}

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">کل {contractlist.length} قراردادها</span>
                    <label className="flex items-center text-default-400 text-small">
                        ردیف در هر صفحه :
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="50">50</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        contractlist.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "انتخاب همه موارد"
                        : `${selectedKeys.size} از ${filteredItems.length} انتخاب شده`}
                </span>
                <Pagination
                    classNames={{
                        wrapper: "gap-0 overflow-visible h-8 rounded border border-divider",
                        item: "w-8 h-8 text-small rounded-none bg-transparent",
                        cursor:
                            "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold",
                    }}
                    loop
                    isCompact
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        قبلی
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        بعدی
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (

        <>

            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                }}
                selectedKeys={selectedKeys}
                selectionMode="single"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={"قراردادی یافت نشد"}
                    items={sortedItems}
                    loadingContent={<Spinner />}
                    loadingState={loadingState}>
                    {(item) => (
                        <TableRow key={item._id}  >
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>


            {action == 2 ?
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
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1  text-md">
                                    تایید / رد قرارداد
                                </ModalHeader>
                                <ModalBody >
                                    {
                                        <form>
                                            <div className="w-full flex flex-col gap-4">

                                                <div className="flex flex-col w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                    <Input type="Number" size="sm" label="محدودیت (تعداد)" value={limited} onChange={(e) => setLimited(e.target.value)} />
                                                    <Textarea
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        label="توضیحات (قابل مشاهده برای کاربر)"
                                                        variant="flat"
                                                        labelPlacement="inside"
                                                        size="sm"

                                                        classNames={{
                                                            base: "sm",
                                                            input: "resize-y min-h-[40px] sm",

                                                        }}
                                                    />
                                                </div>

                                            </div>

                                        </form>
                                    }
                                </ModalBody>
                                <ModalFooter >
                                    <Button color="foreground" variant="bordered" onPress={onClose}>
                                        بستن
                                    </Button>
                                    <Button isLoading={isLoadingForDenyModalbtn} color="danger" variant="shadow" onPress={() => {
                                        if (currenContract.description == description && currenContract.limited == limited) {
                                            toast.info("اطلاعات جدیدی ثبت نشده است")
                                            return false
                                        }



                                        if (currenContract.isConfirm == 1) {
                                            currenContract.Pricelists.map(pr => quantity += pr.quantity)
                                            setIsConfirm(3);
                                            onSubmitContractHandler(currenContract, 3, quantity) //? قراردادهایی که قبلا تایید و مجدد بررسی و لغو میشود
                                            return
                                        }
                                        setIsConfirm(2)
                                        onSubmitContractHandler(currenContract, 2)

                                    }}>

                                        رد
                                    </Button>
                                    {currenContract.isConfirm != 10 &&
                                        <Button isLoading={isLoadingForModalbtn} className="text-white" color="success" variant="shadow" onPress={() => {
                                            if (currenContract.description == description && currenContract.limited == limited) {
                                                toast.info("اطلاعات جدیدی ثبت نشده است")
                                                return false
                                            }

                                            setIsConfirm(1)
                                            currenContract.Pricelists.map(pr => quantity += pr.quantity)
                                            if (currenContract.isConfirm == 1 && (currenContract.description != description || currenContract.limited != limited)) {
                                                //? قبلا تایید شده است ولی در تایید جدید یکی از مقادیر محدودیت یا توضیحات نیاز به تغییر دارد
                                                onSubmitContractHandler(currenContract, 4, quantity)
                                                return
                                            }

                                            if (currenContract.isConfirm == 1) {
                                                toast.info("این قرارداد قبلا بررسی و تایید شده است")
                                                return
                                            }

                                            onSubmitContractHandler(currenContract, 1, quantity)

                                        }}>

                                            تایید
                                        </Button>}
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal >
                :
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
                                <ModalHeader className="flex flex-col gap-1  text-md">
                                    حذف قرارداد
                                </ModalHeader>
                                <ModalBody >
                                    {
                                        <form>
                                            <div className="relative mt-2 flex justify-end col-span-1">
                                                <div className="flex flex-col  w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                    <div className="flex gap-2 text-black">
                                                        <p>
                                                            {`از حذف قرارداد با واحد سازمانی ${currenContract.unitname} اطمینان دارید؟`}
                                                        </p>
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
                                    <Button className="bg-red-700 text-white" variant="light" isLoading={isLoadingForModalbtn} onPress={() => onDeleteContractHandler(currenContract, contractlist)}>
                                        حذف
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal >
            }


        </>

    )
}

