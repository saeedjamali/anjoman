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
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { authTypes, roles, year } from '@/utils/constants'
import dynamic from "next/dynamic"
// import { columns, users, statusOptions } from "./data";
const Map = dynamic(() => import('@/components/module/Map'), { ssr: false })

const INITIAL_VISIBLE_COLUMNS = ["code", "name", "address", "owner", "capacity", "year", "actions"];

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};
export const SearchIcon = (props) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
    >
        <path
            d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <path
            d="M22 22L20 20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
);

export const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...otherProps}
    >
        <path
            d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={10}
            strokeWidth={strokeWidth}
        />
    </svg>
);

export const VerticalDotsIcon = ({ size = 24, width, height, ...props }) => (
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
        <path
            d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            fill="currentColor"
        />
    </svg>
);



const columns = [
    { name: "کد", uid: "code", sortable: true },
    { name: "نام مالک", uid: "owner", sortable: true },
    { name: "شماره همراه مالک", uid: "phone", sortable: true },
    { name: "کد ملی مالک", uid: "ownerCode", sortable: true },
    { name: "نام شرکت", uid: "name" },
    { name: "آدرس شرکت", uid: "address" },
    { name: "طول جغرافیایی", uid: "lng" },
    { name: "عرض جغرافیایی", uid: "lat", sortable: true },
    { name: "وضعیت فعالیت", uid: "isActive", sortable: true },
    { name: "ظرفیت تولید", uid: "capacity", sortable: true },
    { name: "سال تحصیلی", uid: "year", sortable: true },
    { name: "عملیات", uid: "actions" },
];

const statusOptions = [
    { name: "تایید شده", uid: "active" },
    { name: "در حال بررسی", uid: "paused" },
    { name: "رد شده", uid: "vacation" },
];
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
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

const currentYear = year.find(y => y.currentYear);
export default function CompanyManager({ selectedKeys,
    setSelectedKeys }) {


    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingForModalbtn, setIsLoadingForModalbtn] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [company, setCompany] = useState("");
    const [key, setKey] = useState("");
    const [filterValue, setFilterValue] = React.useState("");

    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });

    const [code, setCode] = useState(company.code);
    const [owner, setOwner] = useState(company.owner);
    const [phone, setPhone] = useState(company.phone);
    const [ownerCode, setOwnerCode] = useState(company.ownerCode);
    const [name, setName] = useState(company.name);
    const [address, setAddress] = useState(company.address);
    const [lng, setLng] = useState(company?.lng || "59.60649396574567");
    const [lat, setLat] = useState(company?.lat || "36.29779692242873");
    const [isActive, setIsActive] = useState(company.isActive);
    const [year, setYear] = useState(company.year);
    const [capacity, setCapacity] = useState(company.capacity);


    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);



    const filteredItems = React.useMemo(() => {
        let filteredCompany = [...companies];

        if (hasSearchFilter) {
            filteredCompany = filteredCompany.filter((company) =>
                company?.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
                company?.code == filterValue ||
                company?.owner == filterValue,
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredCompany = filteredCompany?.filter((company) =>
                Array.from(statusFilter).includes(company?.status),
            );
        }

        return filteredCompany;
    }, [companies, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const loadingState = isLoading ? "loading" : "idle";
    // || company?.length === 0

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
        setCode(company.code)
        setOwner(company.owner)
        setPhone(company.phone)
        setOwnerCode(company.ownerCode)
        setName(company.name)
        setAddress(company.address)
        setLng(company.lng)
        setLat(company.lat)
        setIsActive(company.isActive)
        setYear(company.year)
        setCapacity(company.capacity)

    }, [company])

    useEffect(
        () => {
            getCompanies();
        }
        , []);

    const getCompanies = async () => {

        try {
            const response = await fetch(`/api/manager/company/getcompany/${currentYear.name}`);
            const data = await response.json();
            if (data.status == 201) {
                setCompanies(data.companies);
            } else {
                toast.info(data.message)
            }
            setIsLoading(false);

        } catch (error) {
            console.log("catch error when get company -->", error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getAddress();
    }, [lat]);
    const getAddress = async () => {
        try {
            const response = await fetch(
                `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
                {
                    method: "GET",
                    headers: {
                        "Api-Key": "service.74ea7f4d3a0e47f8831623c57f9c3ac9",
                    },
                }
            );
            const data = await response.json();
            if (data.status == "OK") {
                const address = data.formatted_address;
                setAddress(address);
            }
        } catch (error) {
            console.log("error in catch get address-->", error);
        }
    };

    const updateCompanyHandler = async () => {
        setIsLoadingForModalbtn(true)
        try {
            const response = await fetch(`/api/manager/company/putcompany/${company._id}/${currentYear.name}`, {
                method: "PUT",
                body: JSON.stringify({
                    owner,
                    phone,
                    ownerCode,
                    name,
                    address,
                    lng,
                    lat,
                    isActive,
                    year,
                    capacity

                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.success(data.message)
                onClose()
                let updatedCompany = companies.map(c => {
                    if (c._id == company._id) {
                        return {
                            ...c, owner,
                            phone,
                            ownerCode,
                            name,
                            address,
                            lng,
                            lat,
                            isActive,
                            year,
                            capacity
                        }
                    }
                    return c
                })
                setCompanies(updatedCompany);

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("error from update company Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }


    const removeCompanyHandler = async () => {
        setIsLoadingForModalbtn(true)

        try {
            const response = await fetch(`/api/manager/company/putcompany/${company._id}/${currentYear.name}`, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.success(data.message)
                onClose()
                // setIsLoading(true);
                const filterCompany = companies.filter((c) => c._id != company._id)
                setCompanies(filterCompany);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log("error from remove company Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }
    //!!!!!!!!!!!!!
    const renderCell = React.useCallback((company, columnKey) => {
        const cellValue = company[columnKey];

        switch (columnKey) {

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
                                    setCompany(company)
                                    setKey(key)
                                    onOpen();
                                }}
                            >

                                <DropdownItem key="edit" >ویرایش</DropdownItem>
                                <DropdownItem key="remove">لغو همکاری</DropdownItem>
                                <DropdownItem key="region">مکان شرکت</DropdownItem>
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
                                    وضعیت
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
                    <span className="text-default-400 text-small">کل {company.length} شرکت</span>
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
        company.length,
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
                    emptyContent={"شرکتی یافت نشد"}
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
                    body: "py-6",
                    backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                    base: "border-[#292f46] bg-slate-700 text-[#a8b0d3]",
                    header: "border-b-[1px] border-[#292f46]",
                    footer: "border-t-[1px] border-[#292f46]",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
            >


                {
                    key == "remove" ?
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 font-iranyekanMedium text-md">
                                        لغو همکاری شرکت
                                    </ModalHeader>
                                    <ModalBody className="font-iranyekan">
                                        <p>
                                            {`از لغو شرکت ${company.name} با کد ${company.code}  اطمینان دارید ؟  
                                            `}
                                        </p>
                                    </ModalBody>
                                    <ModalFooter className="font-iranyekan">
                                        <Button
                                            color="foreground"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            بستن
                                        </Button>
                                        <Button
                                            className="bg-red-600 text-white"
                                            variant="light"
                                            onClick={removeCompanyHandler}
                                        >
                                            <div className="flex-1 flex">حذف</div>
                                            <div className='flex-center '>
                                                {isLoadingForModalbtn && <Spinner />}
                                            </div>

                                        </Button>

                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent> :
                        key == "edit" ?
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1 font-iranyekanMedium text-md">
                                            ویرایش اطلاعات شرکت
                                        </ModalHeader>
                                        <ModalBody className="font-iranyekan">
                                            {
                                                <form>
                                                    <div className="relative mt-2 flex justify-end col-span-1">
                                                        <div className="flex flex-col  w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                            <div className="flex gap-2">
                                                                <Input type="text" label="کد شرکت" value={code} disabled />
                                                                <Input type="text" label="مالک شرکت" value={owner} onChange={() => setOwner(event.target.value)} />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Input type="text" label="شماره تماس" value={phone} onChange={() => setPhone(event.target.value)} />
                                                                <Input type="text" label="کد ملی مالک" value={ownerCode} onChange={() => setOwnerCode(event.target.value)} />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Input type="text" label="نام شرکت" value={name} onChange={() => setName(event.target.value)} />
                                                                <Input type="text" label="وضعیت فعالیت" value={isActive} onChange={() => setIsActive(event.target.value)} />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Input type="text" label="سال تحصیلی" value={year} onChange={() => setYear(event.target.value)} />
                                                                <Input type="text" label="ظرفیت" value={capacity} onChange={() => setCapacity(event.target.value)} />
                                                            </div>
                                                            {/* <div className="flex gap-2">
                                                                <input className={`input-text-information mt-2 `} name='maleno' type='text' disabled value={`${Number(lng).toFixed(5)} , ${Number(lat).toFixed(5)} `} placeholder='موقعیت جغرافیایی' ></input> */}

                                                            {/* <Input type="text" label="طول جغرافیایی" value={lng} onChange={() => setLng(event.target.value)} />
                                                                <Input type="text" label="عرض جغرافیایی" value={lat} onChange={() => setLat(event.target.value)} /> */}
                                                            {/* </div> */}
                                                            <div className="flex gap-2">
                                                                <Input type="text" label="آدرس" value={address} onChange={() => setAddress(event.target.value)} />
                                                            </div>

                                                        </div>

                                                    </div>
                                                </form>
                                            }

                                        </ModalBody>
                                        <ModalFooter className="font-iranyekan">
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
                                                onClick={updateCompanyHandler}
                                            >
                                                <div className="flex-1 flex">ویرایش</div>
                                                <div className='flex-center'>
                                                    {isLoadingForModalbtn && <Spinner />}
                                                </div>

                                            </Button>

                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent> :
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1 font-iranyekanMedium text-md">
                                            موقعیت شرکت بر روی نقشه
                                        </ModalHeader>
                                        <ModalBody className="font-iranyekan">
                                            {
                                                <form>
                                                    <div className="relative mt-2 flex justify-end col-span-1">
                                                        <div className="flex flex-col  w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">

                                                            <div className="flex gap-2">
                                                                <Input type="text" label="نام شرکت" value={name} disabled />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Input type="text" label="آدرس" value={address} onChange={() => setAddress(event.target.value)} />
                                                            </div>
                                                            <div className="flex gap-2 ">
                                                                <input className={`input-text-information mt-2 text-white `} name='maleno' type='text' disabled value={`${Number(lng).toFixed(5)} , ${Number(lat).toFixed(5)} `} placeholder='موقعیت جغرافیایی' ></input>
                                                            </div>

                                                            <div className='w-full  mt-4 rounded-md bg-green-600 z-10 '>
                                                                <Map setLat={setLat} setLng={setLng} lng={lng} lat={lat} />
                                                            </div>
                                                        </div>

                                                    </div>
                                                </form>
                                            }

                                        </ModalBody>
                                        <ModalFooter className="font-iranyekan">
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
                                                onClick={updateCompanyHandler}
                                                isLoading={isLoadingForModalbtn}
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

