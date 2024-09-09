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
    RadioGroup,
    Radio,
    Chip,
} from "@nextui-org/react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { authTypes, roles, year } from '@/utils/constants'
import { ChevronDownIcon, SearchIcon, VerticalDotsIcon } from "@/utils/icon";
// import { columns, users, statusOptions } from "./data";


const INITIAL_VISIBLE_COLUMNS = ["code", "grade", "gender", "type", "material", "size", "group", "price", "year", "actions"];

const statusColorMap = {
    1: "primary",
    2: "danger",
    3: "warning",
    4: "success",
    5: "secondary",
};

const columns = [
    { name: "کد محصول", uid: "code", sortable: true },
    { name: "مقطع", uid: "grade", sortable: true },
    { name: "جنسیت", uid: "gender", sortable: true },
    { name: "نوع محصول", uid: "type", sortable: true },
    { name: "جنس پارچه", uid: "material" },
    { name: "سایز", uid: "size" },
    { name: "گروه", uid: "group" },
    { name: "قیمت", uid: "price", sortable: true },
    { name: "سال تحصیلی", uid: "year", sortable: true },
    { name: "عملیات", uid: "actions" },

];

const statusOptions = [
    { name: "کودکستان", uid: "1" },
    { name: "پیش دبستانی", uid: "2" },
    { name: "ابتدایی", uid: "3" },
    { name: "دوره اول متوسطه", uid: "4" },
    { name: "دوم دوم متوسطه", uid: "5" },

];
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


const currentYear = year.find(y => y.currentYear);
export default function PriceListManager({ selectedKeys,
    setSelectedKeys }) {



    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingForModalbtn, setIsLoadingForModalbtn] = useState(false);
    const [priceList, setPriceList] = useState([]);
    const [priceItem, setPriceItem] = useState("");
    const [key, setKey] = useState("");
    const [filterValue, setFilterValue] = React.useState("");

    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "year",
        direction: "ascending",
    });

    const [code, setCode] = useState(priceItem.code);
    const [grade, setGrade] = useState(priceItem.grade);
    const [gender, setGender] = useState(priceItem.gender);
    const [type, setType] = useState(priceItem.type);
    const [material, setMaterial] = useState(priceItem.material);
    const [size, setSize] = useState(priceItem.size);
    const [group, setGroup] = useState(priceItem.group);
    const [price, setPrice] = useState(priceItem.price);
    const [year, setYear] = useState(priceItem.year);


    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);



    const filteredItems = React.useMemo(() => {
        let filteredPriceItem = [...priceList];

        if (hasSearchFilter) {
            filteredPriceItem = filteredPriceItem.filter((priceItem) =>
                priceItem?.grade?.toLowerCase().includes(filterValue.toLowerCase()) ||
                priceItem?.material?.toLowerCase().includes(filterValue.toLowerCase()) ||
                priceItem?.code == filterValue ||
                priceItem?.owner == filterValue,
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredPriceItem = filteredPriceItem?.filter((priceItem) => {

                return Array.from(statusFilter).includes(priceItem?.grade)
            }
            );
        }

        return filteredPriceItem;
    }, [priceList, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const loadingState = isLoading ? "loading" : "idle";
    // || priceItem?.length === 0

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

        setCode(priceItem.code)
        setGrade(priceItem.grade)
        setGender(priceItem.gender)
        setType(priceItem.type)
        setMaterial(priceItem.material)
        setSize(priceItem.size)
        setGroup(priceItem.group)
        setPrice(priceItem.price)
        setYear(priceItem.year)


    }, [priceItem])

    useEffect(
        () => {
            getPriceList();
        }
        , []);

    const getPriceList = async () => {

        try {
            const response = await fetch(`/api/manager/pricelist/getpricelist/${currentYear.name}`);
            const data = await response.json();
            if (data.status == 201) {
                setPriceList(data.pricelist);
                setIsLoading(false);
            } else {
                toast.info("داده ای برای سال تحصیلی جاری یافت نشد")
            }

        } catch (error) {
            console.log("catch error when get price list -->", error);
        }
    }

    const updatePriceListHandler = async () => {
        setIsLoadingForModalbtn(true)
        try {
            const response = await fetch(`/api/manager/pricelist/putpricelist/${priceItem._id}/${currentYear.name}`, {
                method: "PUT",
                body: JSON.stringify({

                    grade,
                    gender,
                    type,
                    material,
                    size,
                    group,
                    price,
                    year

                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.success(data.message)
                onClose()
                let updatePriceList = priceList.map(c => {
                    if (c._id == priceItem._id) {
                        return {
                            ...c, grade,
                            gender,
                            type,
                            material,
                            size,
                            group,
                            price,
                            year

                        }
                    }
                    return c
                })
                setPriceList(updatePriceList);

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("error from update company Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }


    const removePriceItemHandler = async () => {
        setIsLoadingForModalbtn(true)

        try {
            const response = await fetch(`/api/manager/pricelist/putpricelist/${priceItem._id}/${currentYear.name}`, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.success(data.message)
                onClose()
                // setIsLoading(true);
                const filterPriceList = priceList.filter((c) => c._id != priceItem._id)
                setPriceList(filterPriceList);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log("error from remove company Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }
    //!!!!!!!!!!!!!
    const renderCell = React.useCallback((priceItem, columnKey) => {
        const cellValue = priceItem[columnKey];

        switch (columnKey) {

            case "gender":
                return (
                    <Chip className="capitalize" color={statusColorMap[priceItem.gender]} size="sm" variant="flat">
                        {cellValue == 1 ? 'پسر ' : cellValue == 2 ? 'دختر' : 'نامشخص'}
                    </Chip>
                );
            case "grade":
                return (
                    <Chip className="capitalize" color={statusColorMap[priceItem.grade]} size="sm" variant="flat">
                        {cellValue == 1 ? 'کودکستان' : cellValue == 2 ? 'پیش دبستانی' : cellValue == 3 ? 'ابتدایی' : cellValue == 4 ? 'دوره اول متوسطه' : cellValue == 5 ? 'دوره دوم متوسطه' : 'نامشخص'}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">

                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Action event example"
                                onAction={(key) => {
                                    setPriceItem(priceItem)
                                    setKey(key)
                                    onOpen();
                                }}
                            >

                                <DropdownItem key="edit" >ویرایش</DropdownItem>
                                <DropdownItem key="remove">حذف محصول</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
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
                        placeholder="جستجو براساس نام و کد"
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    دوره تحصیلی
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
                    <span className="text-default-400 text-small">کل {priceList.length} محصول</span>
                    <label className="flex items-center text-default-400 text-small">
                        ردیف در هر صفحه :
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">50</option>
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
        priceList.length,
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
                selectionMode="multiple"
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
                    emptyContent={"محصولی یافت نشد"}
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
                    key == "remove" ?
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 bg-red-900 text-md ">
                                        حذف محصول
                                    </ModalHeader>
                                    <ModalBody className="text-black">
                                        <p>
                                            {`از حذف محصول ${priceItem.type} با کد ${priceItem.code}  اطمینان دارید ؟  
                                            `}
                                        </p>
                                    </ModalBody>
                                    <ModalFooter
                                    >
                                        <Button
                                            color="foreground"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            بستن
                                        </Button>
                                        <Button
                                            isLoading={isLoadingForModalbtn}
                                            className="bg-red-600 text-white"
                                            variant="light"
                                            onClick={removePriceItemHandler}
                                        >
                                            حذف
                                        </Button>

                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent> :
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 font-iranyekanMedium text-md">
                                        ویرایش اطلاعات محصول
                                    </ModalHeader>
                                    <ModalBody
                                    >
                                        {
                                            <form>
                                                <div className="relative mt-2 flex justify-end col-span-1">
                                                    <div className="flex flex-col  w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="کد محصول" value={code} disabled />
                                                            {/* <Input type="text" label="مقطع" value={grade} onChange={() => setGrade(event.target.value)} /> */}
                                                            <Input type="text" label="سال تحصیلی" value={year} onChange={() => setYear(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">

                                                            {/* <Input type="text" label="جنسیت" value={gender} onChange={() => setGender(event.target.value)} /> */}
                                                            <Input type="text" label="نوع" value={type} onChange={() => setOwnerCode(event.target.value)} />
                                                            <Input type="text" label="جنس" value={material} onChange={() => setMaterial(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="سایز" value={size} onChange={() => setSize(event.target.value)} />
                                                            <Input type="text" label="قیمت" value={price} onChange={() => setPrice(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="گروه" value={group} onChange={() => setGroup(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="bg-stone-100 rounded-lg p-2 flex-1">
                                                                <RadioGroup
                                                                    className=" text-[14px]"
                                                                    label="جنسیت"
                                                                    orientation="horizontal"
                                                                    value={gender}
                                                                    onValueChange={setGender}
                                                                >
                                                                    <Radio value="1" size="sm">پسر</Radio>
                                                                    <Radio value="2" size="sm">دختر</Radio>

                                                                </RadioGroup>


                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="bg-stone-100 rounded-lg p-2 flex-1">
                                                                <RadioGroup
                                                                    className=" text-[14px]"
                                                                    label="مقطع"
                                                                    orientation="horizontal"
                                                                    value={grade}
                                                                    onValueChange={setGrade}
                                                                >
                                                                    <Radio value="1" size="sm">کودکستان</Radio>
                                                                    <Radio value="2" size="sm">پیش دبستانی</Radio>
                                                                    <Radio value="3" size="sm">ابتدایی</Radio>
                                                                    <Radio value="4" size="sm">دوره اول متوسطه</Radio>
                                                                    <Radio value="5" size="sm">دوره دوم متوسطه</Radio>

                                                                </RadioGroup>


                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                            </form>
                                        }

                                    </ModalBody>
                                    <ModalFooter
                                    >
                                        <Button
                                            color="foreground"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            بستن
                                        </Button>
                                        <Button
                                            isLoading={isLoadingForModalbtn}
                                            className="bg-green-700 text-white"
                                            color="success"
                                            variant="light"
                                            onClick={updatePriceListHandler}
                                        >
                                            ویرایش
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

