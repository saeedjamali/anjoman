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
    Tooltip,
    Chip,
    RadioGroup,
    Radio,
} from "@nextui-org/react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { authTypes, roles, year } from '@/utils/constants'
import { useUserProvider } from "@/components/context/UserProvider";
import { ChevronDownIcon, EditIcon, SearchIcon, VerticalDotsIcon } from "@/utils/icon";

// import { columns, users, statusOptions } from "./data";


const INITIAL_VISIBLE_COLUMNS = ["regionCode", "regionName", "name", "phone", "prsCode", "isActive", "actions"];

const statusColorMap = {
    1: "success",
    2: "danger",
    0: "warning",
};

const columns = [
    { name: "کد منطقه", uid: "regionCode", sortable: true },
    { name: "نام منطقه", uid: "regionName", sortable: true },
    { name: "نام و نام خانوادگی", uid: "name", sortable: true },
    { name: "شماره همراه", uid: "phone", sortable: true },
    { name: "کد پرسنلی", uid: "prsCode", sortable: true },
    { name: "کد ملی", uid: "meliCode", sortable: true },
    { name: "آیدی کاربری", uid: "user" },
    { name: "وضعیت", uid: "isActive" },
    { name: "سطح", uid: "level" },
    { name: "توضیحات", uid: "comment" },
    { name: "عملیات", uid: "actions" },
];

const statusOptions = [
    { name: "در حال بررسی", uid: "0" },
    { name: "تایید شده", uid: "1" },
    { name: "رد شده", uid: "2" },
];
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export default function AdminManager({ selectedKeys,
    setSelectedKeys }) {


    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingForModalbtn, setIsLoadingForModalbtn] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [admin, setAdmin] = useState("");
    const [key, setKey] = useState("");
    const [filterValue, setFilterValue] = React.useState("");

    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "role",
        direction: "ascending",
    });
    const [name, setName] = useState(admin.name)
    const [phone, setPhone] = useState(admin.phone)
    const [prsCode, setPrsCode] = useState(admin.prsCode)
    const [meliCode, setMelicode] = useState(admin.meliCode)
    const [user, setUser] = useState(admin.user)
    const [regionCode, setRegionCode] = useState(admin.regionCode)
    const [regionName, setRegionName] = useState(admin.regionName)
    const [isActive, setIsActive] = useState(admin.isActive)
    const [comment, setComment] = useState(admin.comment)
    const [level, setLevel] = useState(admin.level)
    const currentAdmin = useUserProvider();



    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);



    const filteredItems = React.useMemo(() => {
        let filterAdmin = [...admins];
        if (hasSearchFilter) {
            filterAdmin = filterAdmin.filter((admin) =>
                admin?.phone?.toLowerCase().includes(filterValue.toLowerCase()) ||
                admin?.prsCode?.toLowerCase().includes(filterValue.toLowerCase()) == filterValue ||
                admin?.meliCode == filterValue,
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filterAdmin = filterAdmin?.filter((modir) =>
                Array.from(statusFilter).includes(`${modir?.isActive}`)
            );
        }
        return filterAdmin;
    }, [admins, filterValue, statusFilter]);

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
        setName(admin.name)
        setPhone(admin.phone)
        setRegionCode(admin.regionCode)
        setRegionName(admin.regionName)
        setPrsCode(admin.prsCode)
        setMelicode(admin.meliCode)
        setUser(admin.user)
        setIsActive(admin.isActive)
        setLevel(admin.level)
        setComment(admin.comment)


    }, [admin])

    useEffect(
        () => {
            getAdmins();
        }
        , []);

    const getAdmins = async () => {
        const level = currentAdmin.admin.level;
        const isActive = currentAdmin.admin.isActive;
        // const regionCode = region.regionCode;
        const provinceCode = currentAdmin.region.provinceCode;
        let response = null;
        try {
            if (level === 999) {
                response = await fetch(`/api/manager/admin/getadmin/${level}/${isActive}`);  //? این لیست برای  مدیر سیستم تعریف شده است        
            }
            if (level == 2 || level == 3) {
                response = await fetch(`/api/admin/admins/getadmin/${level}/${isActive}/${provinceCode}`);  //? این لیست برای استان/ ستاد  تعریف شده است
            }


            const data = await response.json();
            if (data.status == 201) {
                const admins = data.admins.map(admin => { return { ...admin, regionCode: admin.Region.regionCode, regionName: admin.Region.regionName } })
                setAdmins(admins);
            } else {
                toast.info(data.message)
            }
            setIsLoading(false);

        } catch (error) {
            console.log("catch error when get admins -->", error);
            setIsLoading(false);

        }
    }

    const updateAdminHandler = async () => {
        const levelAdmin = currentAdmin.admin.level;
        setIsLoadingForModalbtn(true)
        let response = null;
        try {

            if (levelAdmin == 999) {
                response = await fetch(`/api/manager/admin/putadmin/${admin._id}/${levelAdmin}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        name,
                        prsCode,
                        meliCode,
                        isActive,
                        regionCode,
                        level,
                        comment

                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            }

            if (levelAdmin == 2 || levelAdmin == 3) {
                response = await fetch(`/api/admin/admins/putadmin/${admin._id}/${levelAdmin}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        name,
                        prsCode,
                        meliCode,
                        isActive,
                        regionCode,
                        level,
                        comment

                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            }

            const data = await response.json();

            if (data.status == 201) {
                onClose()
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
            location.reload()
        } catch (error) {
            console.log("error from update admins Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }



    //!!!!!!!!!!!!!
    const renderCell = React.useCallback((admin, columnKey) => {
        const cellValue = admin[columnKey];

        switch (columnKey) {
            case "level":
                return (
                    <Chip className="capitalize" color={statusColorMap[admin.isActive]} size="sm" variant="flat">
                        {cellValue == 1 ? 'کارشناس منطقه' : cellValue == 2 ? 'کارشناس استان' : cellValue == 3 ? 'کارشناس ستاد' : 'مدیر سیستم'}
                    </Chip>
                );
            case "isActive":
                return (
                    <Chip className="capitalize" color={statusColorMap[admin.isActive]} size="sm" variant="flat">
                        {cellValue == 0 ? 'در حال بررسی' : cellValue == 1 ? 'تایید شده' : 'رد شده'}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex-center gap-2">
                        <Tooltip content="ویرایش">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon onClick={(e) => {
                                    e.preventDefault();
                                    setAdmin(admin)
                                    setKey(key)
                                    onOpen(0);
                                }} />
                            </span>
                        </Tooltip>
                        {/* <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">

                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Action event example"
                                onAction={(key) => {
                                    setAdmin(admin)
                                    setKey(key)
                                    onOpen(0);
                                }}
                            >

                                <DropdownItem key="edit" >ویرایش</DropdownItem>

                            </DropdownMenu>
                        </Dropdown> */}
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
                        placeholder="جستجو براساس شماره تماس و پرسنلی"
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
                    <span className="text-default-400 text-small">کل {admins.length} کارشناسان</span>
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
        admins.length,
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
                    emptyContent={"کارشناسی یافت نشد"}
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

                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 font-iranyekanMedium text-md">
                                    ویرایش اطلاعات کارشناس
                                </ModalHeader>
                                <ModalBody >
                                    {
                                        <form>
                                            <div className="relative mt-2 flex justify-end col-span-1">
                                                <div className="flex flex-col  w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                    <div className="flex gap-2">
                                                        <Input type="text" label="نام " value={name} onChange={() => setName(event.target.value)} />
                                                        <Input type="text" label="شماره همراه" value={phone} disabled />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input type="text" label="کد پرسنلی" value={prsCode} onChange={() => setPrsCode(event.target.value)} />
                                                        <Input type="text" label="کد ملی" value={meliCode} onChange={() => setMelicode(event.target.value)} />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input type="text" label="توضیحات" value={comment} onChange={() => setComment(event.target.value)} />
                                                        <Input type="text" label="منطقه" value={regionCode} onChange={() => setRegionCode(event.target.value)} />

                                                    </div>

                                                    <div className="flex gap-2 ">
                                                        {/* <Input type="text" label="آیدی کاربری" value={user} disabled /> */}
                                                        <div className="bg-stone-100 rounded-lg p-2 flex-1 ">
                                                            <RadioGroup
                                                                className=" text-[14px] bg-"
                                                                label="وضعیت"
                                                                orientation="horizontal"
                                                                value={isActive}
                                                                onValueChange={setIsActive}
                                                            >
                                                                <Radio value="0" size="sm">در حال بررسی</Radio>
                                                                <Radio value="1" size="sm">تایید</Radio>
                                                                <Radio value="2" size="sm">رد</Radio>
                                                                {/* <Radio value="999" size="sm">مدیر سیستم</Radio> */}

                                                            </RadioGroup>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {/* <Input type="text" label="آیدی کاربری" value={user} disabled /> */}
                                                        <div className="bg-stone-100 rounded-lg p-2 flex-1">
                                                            <RadioGroup
                                                                className="text-[14px]"
                                                                label="سطح"
                                                                orientation="horizontal"
                                                                value={level}
                                                                onValueChange={setLevel}
                                                            >
                                                                <Radio value="1" size="sm">کارشناس منطقه</Radio>
                                                                <Radio value="2" size="sm">استان</Radio>
                                                                <Radio value="3" size="sm">ستاد</Radio>
                                                                <Radio value="999" size="sm">مدیر سیستم</Radio>

                                                            </RadioGroup>


                                                        </div>

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
                                        onClick={updateAdminHandler}
                                        isLoading={isLoadingForModalbtn}
                                    >
                                        <div className="flex-1 flex">ویرایش</div>

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

