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


const INITIAL_VISIBLE_COLUMNS = ["year", "name", "phone", "meliCode", "year", , "status", "createdAt", "payment", "limited", "actions"];

const columns = [
    { name: "سال تحصیلی", uid: "year", sortable: true },
    { name: "نام و نام خانوادگی", uid: "name", sortable: true },
    { name: "شماره همراه", uid: "phone" },
    { name: "کد پرسنلی", uid: "prsCode" },
    { name: "کد ملی", uid: "meliCode" },
    { name: "وضعیت اشتغال", uid: "occuptionState" },
    { name: "نام منطقه", uid: "regionName" },
    { name: "نام استان", uid: "provinceName" },
    { name: "نام ارگان", uid: "organ" },
    { name: "مدرک تحصیلی", uid: "degreeName" },
    { name: "رشته تحصیلی", uid: "fieldName" },
    { name: "تحصیلات تکمیلی", uid: "isAcademic", sortable: true },
    { name: "پرداختی", uid: "payment", sortable: true },
    { name: "وضعیت", uid: "status", sortable: true },
    { name: "تاریخ ثبت", uid: "createdAt", sortable: true },
    { name: "عملیات", uid: "actions" },
];

const statusColorMap = {
    0: "warning",
    1: "success",
    2: "danger",
    4: "secondary"
};


const statusColorMapForStatus = {
    1: "warning",
    2: "success",
    3: "danger",
    4: "secondary"
};

const statusColorMapOccuption = {
    1: "success",
    2: "secondary",
    3: "warning"
};

const statusOptionsPayment = [
    { name: "رایگان", uid: 1 },
    { name: "پرداختی", uid: 2 }

];
const statusOptions = [
    { name: "ثبت نام شده", uid: 1 },
    { name: "قبولی در مصاحبه", uid: 2 },
    { name: "رد مصاحبه", uid: 3 },
    { name: "در انتظار پرداخت", uid: 4 },
    { name: "نامشخص", uid: 10 },
];
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}



export default function LecturerManager({ setShowDetailLecturer,
    setCurrentLecturer,
    currentLecturer,
    setLecturerlistLen,
    lecturerList,
    setLecturerList, setActionType }) {

    const { region, admin, user } = useUserProvider();
    const [action, setAction] = useState(0); //? 1 : submit   ---- 2 : payment
    const { phone, identifier, isActive, isBan } = user;
    const [history, setHistory] = useState([]);
    const [currentYearHistory, setCurrentYearHistory] = useState(null);
    const [year, setYear] = useState("1403-1404");
    const [name, setName] = useState("");
    const [phoneInp, setPhoneInp] = useState(phone);
    const [prsCode, setPrsCode] = useState("");
    const [meliCode, setMeliCode] = useState(identifier);
    const [occuptionState, setOccuptionState] = useState(0);
    const [organ, setOrgan] = useState(0);
    const [isAcademic, setIsAcademic] = useState(false);
    const [typeAcademic, setTypeAcademic] = useState(0);
    const [province, setProvince] = useState(null);
    const [regionName, setRegionName] = useState(null);
    const [degree, setDegree] = useState(0);
    const [field, setField] = useState(0);
    const [provinceObj, setProvinceObj] = useState(null);
    const [regionObj, setRegionObj] = useState(null);
    const [degreeObj, setDegreeObj] = useState(null);
    const [fieldObj, setFieldObj] = useState(null);

    const [cityName, setCityName] = useState("");
    const [isCertificateBefore, setIsCertificateBefore] = useState(false);
    const [age, setAge] = useState(0);
    const [isAccepted, setIsAccepted] = useState(null);
    const [status, setStatus] = useState(0);
    const [degreeDoc, setDegreeDoc] = useState([]);
    const [introDoc, setIntroDoc] = useState([]);
    const [certificateDoc, setCertificateDoc] = useState([]);


    //? Status
    const [isNewRegister, setIsNewRegister] = useState(false);
    const [isGeneralCondition, setIsGeneralCondition] = useState(false);
    const [isPersonalInformation, setIsPersonalInformation] = useState(false);
    const [isUploadedDocument, setIsUploadedDocument] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notCompletePersonalInformation, setNotCompletePersonalInformatio] = useState(true);
    const [error, setError] = useState([]);
    const [beforeRegistered, setBeforeRegistered] = useState(false);
    const [seeHistory, setSeeHistory] = useState(false);

    //? Provinces , Region , Field , Degree
    const [provinces, setProvinces] = useState([]);
    const [regions, setRegions] = useState([]);
    const [fields, setFields] = useState([]);
    const [degrees, setDegrees] = useState([]);



    const [isLoadingForModalbtn, setIsLoadingForModalbtn] = useState(false);
    const [isLoadingForDenyModalbtn, setIsLoadingForDenyModalbtn] = useState(false);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [isLoadingLecturerList, setIsLoadingLecturerList] = useState(false);
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const loadingState = isLoadingLecturerList ? "loading" : "idle";
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
        let filterLecturerList = [...lecturerList];

        if (hasSearchFilter) {
            filterLecturerList = filterLecturerList.filter((lecturerUtem) =>
                lecturerUtem?.meliCode == filterValue ||
                lecturerUtem?.phone == filterValue,
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filterLecturerList = filterLecturerList?.filter((lecturerUtem) =>
                Array.from(statusFilter).includes(lecturerUtem?.status + "")

            );
        }

        return filterLecturerList;
    }, [lecturerList, filterValue, statusFilter]);

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

        setIsLoadingLecturerList(true);
        const getLecturer = async () => {
            const level = admin.level;
            const regionCode = region.regionCode;
            const provinceCode = region.provinceCode;
            try {
                const response = await fetch(`/api/admin/lecturer/getperprovince/${level}/${regionCode}/${provinceCode}/${year}`);
                const data = await response.json();

                if (data.status == 201) {
                    toast.success(data.message);
                    const newlist = [...data.lecturerList];
                    // setLecturerListt(newlist);
                    const viewLecturerList = newlist.map((cl) => {
                        return {
                            ...cl,
                            regionName: cl.Region.regionName,
                            provinceName: cl.province.name,
                            degreeName: cl.degree.name,
                            fieldName: cl.field.name,
                            createdAt: new Date(cl.createdAt).toLocaleString("fa-IR"),
                        };
                    });
                    setLecturerList([...viewLecturerList]);
                    setLecturerlistLen(viewLecturerList.length)
                } else {
                    toast.info(data.message);
                }

                setIsLoadingLecturerList(false);
            } catch (error) {
                console.log("Error in get lecturer --->", error);
                setIsLoadingLecturerList(false);
            }
        };
        setIsLoadingLecturerList(false);
        getLecturer();
    }, []);

    const onDeleteLecturerItem = async (currentItem, lecturerList) => {
        setIsLoadingForModalbtn(true)

        setCurrentLecturer(currentItem)
        try {
            const response = await fetch(`/api/admin/lecturer/remove/${currentItem._id}`, {
                method: 'DELETE',
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.info(data.message)
                const removeFilter = lecturerList.filter((item) => item._id != currentLecturer._id)

                setLecturerList(removeFilter);
            } else {
                toast.error(data.message)
            }
            setIsLoadingForModalbtn(false)
            // router.push("/p-modir/uniform/contract")
        } catch (error) {
            console.log("error from remove lecturer Handler --->", error)
            setIsLoadingForModalbtn(false)
        }
        onClose();
    }
    //!!!!!!!!!!!!!
    const renderCell = React.useCallback((lecturer, columnKey) => {

        const cellValue = lecturer[columnKey];
        let currentItem = { ...lecturer };
        let currentList = [...lecturerList]
        switch (columnKey) {

            case "occuptionState":
                return (
                    <Chip className="capitalize" color={statusColorMapOccuption[lecturer.occuptionState]} size="sm" variant="flat">
                        {cellValue == 1 ? 'شاغل ' : cellValue == 2 ? 'بازنشسته' : 'نامشخص'}
                    </Chip>
                );
            case "organ":
                return (
                    <Chip className="capitalize" color={statusColorMapOccuption[lecturer.organ]} size="sm" variant="flat">
                        {cellValue == 1 ? 'آموزش و پرورش ' : cellValue == 2 ? 'دانشگاه' : 'حوزه'}
                    </Chip>
                );
            case "isAcademic":
                return (
                    <Chip className="capitalize" size="sm" variant="flat">
                        {cellValue ? 'بله ' : 'خیر'}
                    </Chip>
                );
            case "typeAcademic":
                return (
                    <Chip className="capitalize" size="sm" variant="flat">
                        {cellValue == 1 ? 'استادیار ' : cellValue == 1 ? 'دانشیار' : ''}
                    </Chip>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMapForStatus[lecturer.status]} size="sm" variant="flat">
                        {cellValue == 1 ? 'ثبت نام شده ' : cellValue == 2 ? 'قبولی در مصاحبه' : cellValue == 3 ? 'رد شده' : cellValue == 4 ? 'در انتظار پرداخت' : 'نامشخص'}
                    </Chip>
                );
            case "payment":
                return (
                    <Chip className="capitalize" color={statusColorMapOccuption[lecturer.payment]} size="sm" variant="flat">
                        {cellValue == 1 ? 'مشمول ' : cellValue == 2 ? 'تعرفه' : 'نامشخص'}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">

                        <div className="flex gap-4">
                            <Tooltip content="مشاهده جزییات">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <EyeIcon onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentLecturer(currentItem)
                                        setShowDetailLecturer(prev => !prev)
                                        setActionType(1)
                                        // setAction(1);


                                    }} />
                                </span>
                            </Tooltip>
                            <Tooltip content="ویرایش">
                                <span className="text-lg text-danger cursor-pointer active:opacity-50" >
                                    <EditIcon className="text-blue-500" onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentLecturer(currentItem)
                                        setShowDetailLecturer(prev => !prev)
                                        setActionType(2)


                                    }} />
                                </span>
                            </Tooltip>
                            <Tooltip content="حذف">
                                <span className="text-lg text-danger cursor-pointer active:opacity-50" >
                                    <DeleteIcon className="text-red-500" onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentLecturer(currentItem)
                                        setActionType(3)
                                        onOpen();


                                    }} />
                                </span>
                            </Tooltip>
                        </div>

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
                        placeholder="جستجو براساس شماره همراه و کد ملی"
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    وضعیت ثبت نام
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
                    <span className="text-default-400 text-small"> {lecturerList.length} کل ثبت نام ها</span>
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
        lecturerList.length,
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
                    emptyContent={"ثبت نامی یافت نشد"}
                    items={sortedItems}
                    loadingContent={<Spinner />}
                    loadingState={isLoadingLecturerList}>
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
                    header: " border-[#292f46]  bg-red-600 text-white",
                    footer: " border-[#292f46] bg-white",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1  text-md">
                                حذف ثبت نام
                            </ModalHeader>
                            <ModalBody className="text-black">
                                {`از حذف ثبت نام ${currentLecturer.name} اطمینان دارید؟`}

                            </ModalBody>
                            <ModalFooter >
                                <Button color="foreground" variant="bordered" onPress={onClose}>
                                    بستن
                                </Button>
                                <Button isLoading={isLoadingForDenyModalbtn} color="danger" variant="shadow" onClick={() => onDeleteLecturerItem(currentLecturer, lecturerList)}>

                                    حذف
                                </Button>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >




        </>

    )
}

