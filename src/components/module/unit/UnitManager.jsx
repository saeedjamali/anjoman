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
import useSWR from "swr";
import { toast } from "react-toastify";
// import { columns, users, statusOptions } from "./data";


const INITIAL_VISIBLE_COLUMNS = ["regionCode", "regionName", "schoolCode", "schoolName", "actions"];

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
    { name: "ID", uid: "id", sortable: true },
    { name: "کد منطقه", uid: "regionCode", sortable: true },
    { name: "نام منطقه", uid: "regionName", sortable: true },
    { name: "کد مدرسه", uid: "schoolCode", sortable: true },
    { name: "نام مدرسه", uid: "schoolName" },
    { name: "وضعیت مدرسه", uid: "schoolgeo" },
    { name: "جنسیت", uid: "schoolgender" },
    { name: "دوره", uid: "schoolGrade" },
    { name: "ماهیت", uid: "schoolType" },
    { name: "تعداد دانش آموز دختر", uid: "female", sortable: true },
    { name: "تعداد دانش آموز پسر", uid: "male", sortable: true },
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

export default function UnitManager() {



    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingForModalbtn, setIsLoadingForModalbtn] = useState(false);
    const [schools, setSchools] = useState([]);
    const [school, setSchool] = useState("");
    const [key, setKey] = useState("");
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });

    const [provinceName, setProvinceName] = useState(school.provinceName);
    const [provinceCode, setProvinceCode] = useState(school.provinceCode);
    const [regionCode, setRegionCode] = useState(school.regionCode);
    const [regionName, setRegionName] = useState(school.regionName);
    const [schoolCode, setSchoolCode] = useState(school.schoolCode);
    const [schoolName, setSchoolName] = useState(school.schoolName);
    const [female, setFemale] = useState(school.female);
    const [male, setMale] = useState(school.male);
    const [schoolType, setschoolType] = useState(school.schoolType);
    const [schoolTypeCode, setSchoolTypeCode] = useState(school.schoolTypeCode);
    const [schoolGrade, setSchoolGrade] = useState(school.schoolGrade);
    const [schoolGradeCode, setSchoolGradeCode] = useState(school.schoolGradeCode);
    const [lng, setLng] = useState(school.lng);
    const [lat, setLat] = useState(school.lat);
    const [year, setYear] = useState(school.year);


    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);



    const filteredItems = React.useMemo(() => {
        let filteredSchools = [...schools];

        if (hasSearchFilter) {
            filteredSchools = filteredSchools.filter((school) =>
                school?.schoolName?.toLowerCase().includes(filterValue.toLowerCase()) ||
                school?.schoolCode == filterValue ||
                school?.regionCode == filterValue,
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredSchools = filteredSchools?.filter((school) =>
                Array.from(statusFilter).includes(school?.status),
            );
        }

        return filteredSchools;
    }, [schools, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const loadingState = isLoading ? "loading" : "idle";
    // || schools?.length === 0

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
        setProvinceName(school.provinceName)
        setProvinceCode(school.provinceCode)
        setRegionCode(school.regionCode)
        setRegionName(school.regionName)
        setSchoolCode(school.schoolCode)
        setSchoolName(school.schoolName)
        setFemale(school.female)
        setMale(school.male)
        setLng(school.lng)
        setLat(school.lat)
        setYear(school.year)
    }, [school])

    useEffect(
        () => {
            getUser();
        }
        , []);

    const getUser = async () => {
        try {
            const response = await fetch(`/api/manager/unit/getunit/${page}/${rowsPerPage}`);
            const data = await response.json();
            if (data.status == 201) {
                setSchools(data.units);
            } else {
                toast.info(data.message)
            }
            setIsLoading(false);

        } catch (error) {
            console.log("catch error when get units -->", error);
            setIsLoading(false);
        }
    }

    const updateUnitHandler = async () => {
        setIsLoadingForModalbtn(true)
        try {
            const response = await fetch(`/api/manager/unit/putunit/${school._id}`, {
                method: "PUT",
                body: JSON.stringify({
                    provinceName,
                    provinceCode,
                    regionCode,
                    regionName,
                    schoolCode,
                    schoolName,
                    female,
                    male,
                    lng,
                    lat,
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
                let updatedSchools = schools.map(unit => {
                    if (unit._id == school._id) {
                        return {
                            ...unit, provinceName,
                            provinceCode,
                            regionCode,
                            regionName,
                            schoolCode,
                            schoolName,
                            female,
                            male,
                            lng,
                            lat,
                            year
                        }
                    }
                    return unit
                })
                setSchools(updatedSchools);

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("error from update unit Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }


    const removeUnitHandler = async () => {
        setIsLoadingForModalbtn(true)
        try {
            const response = await fetch(`/api/manager/unit/putunit/${school._id}`, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.success(data.message)
                onClose()
                // setIsLoading(true);
                const filterSchools = schools.filter((unit) => unit._id != school._id)
                setSchools(filterSchools);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log("error from remove unit Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }
    //!!!!!!!!!!!!!
    const renderCell = React.useCallback((school, columnKey) => {
        const cellValue = school[columnKey];

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
                                    setSchool(school)
                                    setKey(key)
                                    onOpen();
                                }}
                            >

                                <DropdownItem key="edit" >ویرایش</DropdownItem>
                                <DropdownItem key="remove">حذف</DropdownItem>
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
                    <span className="text-default-400 text-small">کل {schools.length} مدارس</span>
                    <label className="flex items-center text-default-400 text-small">
                        ردیف در هر صفحه :
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
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
        schools.length,
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
                    emptyContent={"مدرسه ای یافت نشد"}
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
                                    <ModalHeader className="flex flex-col gap-1  text-md bg-red-900">
                                        حذف واحد سازمانی
                                    </ModalHeader>
                                    <ModalBody className="text-black">
                                        <p>
                                            {`از حذف واحد سازمانی ${school.schoolName} با کد ${school.schoolCode} در سال تحصیلی ${school.year} اطمینان دارید ؟  
                                            `}
                                        </p>
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
                                            isLoading={isLoadingForModalbtn}
                                            className="bg-red-600 text-white"
                                            variant="light"
                                            onClick={removeUnitHandler}
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
                                        ویرایش واحد سازمانی
                                    </ModalHeader>
                                    <ModalBody >
                                        {
                                            <form>
                                                <div className="relative mt-2 flex justify-end col-span-1">
                                                    <div className="flex flex-col  w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="کد استان" value={provinceName} onChange={() => setProvinceName(event.target.value)} />
                                                            <Input type="text" label="نام استان" value={provinceCode} onChange={() => setProvinceCode(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="کد منطقه" value={regionCode} onChange={() => setRegionCode(event.target.value)} />
                                                            <Input type="text" label="نام منطقه" value={regionName} onChange={() => setRegionName(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="کد مدرسه" value={schoolCode} onChange={() => setSchoolCode(event.target.value)} />
                                                            <Input type="text" label="نام مدرسه" value={schoolName} onChange={() => setSchoolName(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="دانش آموز دختر" value={female} onChange={() => setFemale(event.target.value)} />
                                                            <Input type="text" label="دانش آموز پسر" value={male} onChange={() => setMale(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="ماهیت آموزشگاه" value={schoolType} disabled />
                                                            <Input type="text" label="دوره تحصیلی" value={schoolGrade} disabled />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="طول جغرافیایی" value={lng} onChange={() => setLng(event.target.value)} />
                                                            <Input type="text" label="عرض جغرافیایی" value={lat} onChange={() => setLat(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="سال تحصیلی" value={year} onChange={() => setYear(event.target.value)} />
                                                            <Input type="text" label="اصلاح شده توسط کاربر" value={school.isModifiedByUser?'بلی' : 'خیر'} />
                                                        </div>
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
                                            onClick={updateUnitHandler}
                                        >
                                            <div className="flex-1 flex">ویرایش</div>
                                            <div className='flex-center'>
                                                {isLoadingForModalbtn && <Spinner />}
                                            </div>

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

