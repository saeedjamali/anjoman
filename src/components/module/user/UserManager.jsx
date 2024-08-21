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
    Chip,
    RadioGroup,
    Radio,
} from "@nextui-org/react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { authTypes, roles, year } from '@/utils/constants'
import { useUserProvider } from "@/components/context/UserProvider";
import { ChevronDownIcon, SearchIcon, VerticalDotsIcon } from "@/utils/icon";
// import { columns, users, statusOptions } from "./data";


const INITIAL_VISIBLE_COLUMNS = ["phone", "role", "count", "comment", "isBan", "isActive", "actions"];

const statusColorMap = {
    1: "success",
    2: "danger",
    0: "warning",
};
const statusColorRoleMap = {
    "modir": "success",
    "admin": "secondary",
    "lecturer": "primary",

};

const columns = [
    { name: "شماره همراه", uid: "phone", sortable: true },
    { name: "نقش", uid: "role", sortable: true },
    { name: "تعداد واحد سازمانی تعریف شده", uid: "count", sortable: true },
    { name: "مسدود کردن", uid: "isBan", sortable: true },
    { name: "وضعیت کاربری", uid: "isActive" },
    { name: "توضیحات", uid: "comment", sortable: true },
    { name: "عملیات", uid: "actions" },
];

const statusOptions = [
    { name: "تایید شده", uid: "1" },
    { name: "در حال بررسی", uid: "0" },
    { name: "رد شده", uid: "2" },
];
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export default function UserManager({ selectedKeys,
    setSelectedKeys }) {


    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingForModalbtn, setIsLoadingForModalbtn] = useState(false);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState("");
    const [key, setKey] = useState("");
    const [filterValue, setFilterValue] = React.useState("");

    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "role",
        direction: "ascending",
    });

    const [phone, setPhone] = useState(user.code);
    const [role, setRole] = useState(user.owner);
    const [isActive, setIsActive] = useState(user.phone);
    const [comment, setComment] = useState(user.ownerCode);
    const [isBan, setisBan] = useState(user.name);
    const [count, setCount] = useState(user.count);

    const { region, admin } = useUserProvider();

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);



    const filteredItems = React.useMemo(() => {
        let filterUser = [...users];

        if (hasSearchFilter) {
            filterUser = filterUser.filter((user) =>
                user?.phone?.toLowerCase().includes(filterValue.toLowerCase()) ||
                user?.role == filterValue ||
                user?.isBan == filterValue,
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filterUser = filterUser?.filter((user) =>
                Array.from(statusFilter).includes(`${user?.isActive}`),
            );
        }

        return filterUser;
    }, [users, filterValue, statusFilter]);

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
        setPhone(user.phone)
        setRole(user.role)
        setIsActive(user.isActive)
        setComment(user.comment)
        setisBan(user.isBan)
        setCount(user.count)

    }, [user])

    useEffect(
        () => {
            getUsers();
            // console.log("datata users--->", users)
        }
        , []);

    const getUsers = async () => {
        const level = admin.level;
        const regionCode = region.regionCode;
        const provinceCode = region.provinceCode

        try {

            const response = await fetch(`/api/admin/users/getusers/${level}/${regionCode}/${provinceCode}`);
            const data = await response.json();
            if (data.status == 201) {
                // const users = data.users.map(user => { return { ...user.User } })
                // console.log("datata-->", data.users)
                setUsers(data.users);

            } else {
                toast.info("کاربری یافت نشد")
            }
            setIsLoading(false); 
        } catch (error) {
            console.log("catch error when get users -->", error);
        }
    }

    const updateUsersHandler = async () => {
        setIsLoadingForModalbtn(true)
        try {
            const response = await fetch(`/api/admin/users/putusers/${user._id}`, {
                method: "PUT",
                body: JSON.stringify({
                    role,
                    isActive,
                    comment,
                    isBan

                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.success(data.message)
                onClose()
                let updateUsers = users.map(c => {
                    if (c._id == user._id) {
                        return {
                            ...c, role,
                            isActive,
                            comment,
                            isBan
                        }
                    }
                    return c
                })
                setUsers(updateUsers);

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("error from update users Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }


    const resetPasswordHandler = async (id) => {
        setIsLoadingForModalbtn(true);
        try {
            const response = await fetch(`/api/admin/users/resetpass/${id}`, {
                method: 'PUT',
            })
            const data = await response.json();

            if (data.status == 201) {
                toast.success(data.message)
                onClose()
                // setIsLoading(true);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log("error from reset password Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }
    //!!!!!!!!!!!!!
    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "role":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.role]} size="sm" variant="flat">
                        {cellValue == "modir" ? 'مدیر واحد سازمانی ' : cellValue == "admin" ? 'کارشناس' : cellValue == "lecturer" ? "مدرس دوره" : 'نامشخص'}
                    </Chip>
                );
            case "isActive":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.isActive]} size="sm" variant="flat">
                        {cellValue == 0 ? 'در حال بررسی ' : cellValue == 1 ? 'تایید' : cellValue == 2 ? 'رد' : 'نامشخص'}
                    </Chip>
                );
            case "isBan":
                return (
                    <Chip className="capitalize" color={user.isBan ? "danger" : "success"} size="sm" variant="flat">
                        {!cellValue ? 'فعال ' : ' مسدود'}
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
                                onAction={async (key) => {
                                    setUser(user)

                                    if (key == "resetpass") {
                                        await resetPasswordHandler(user._id);
                                    } else {
                                        setKey(key)
                                        onOpen(0);
                                    }
                                }}
                            >

                                <DropdownItem key="edit" >ویرایش</DropdownItem>
                                <DropdownItem key="resetpass">ریست رمز</DropdownItem>

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
                        placeholder="جستجو براساس شماره تماس و نقش"
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
                    <span className="text-default-400 text-small">کل {users.length} مدارس</span>
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
        users.length,
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
                    emptyContent={"کاربری یافت نشد"}
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
                                    ویرایش اطلاعات کاربر
                                </ModalHeader>
                                <ModalBody >
                                    {
                                        <form>
                                            <div className="relative mt-2 flex justify-end col-span-1">
                                                <div className="flex flex-col  w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                    <div className="flex gap-2">
                                                        <Input type="text" label="کاربری" value={phone} disabled />
                                                        <Input type="text" label="نقش" value={role == 'modir' ? 'مدیر واحد سازمانی' : role == 'admin' ? 'کارشناس' : role == 'lecture' ? 'مدرس دوره' : 'نامشخص'} disabled onChange={() => setRole(event.target.value)} />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {/* <Input type="text" label="وضعیت فعالیت (0-1-2)" value={isActive} onChange={() => setIsActive(event.target.value)} /> */}
                                                        <div className="bg-stone-100 rounded-md p-2 flex-1">
                                                            <RadioGroup
                                                                className=" text-[14px]"
                                                                label="وضعیت"
                                                                orientation="vertical"
                                                                value={isActive}
                                                                onValueChange={setIsActive}
                                                            >
                                                                <Radio value="0" size="sm">در حال بررسی</Radio>
                                                                <Radio value="1" size="sm">تایید</Radio>
                                                                <Radio value="2" size="sm">رد</Radio>

                                                            </RadioGroup>


                                                        </div>
                                                        {/* <Input type="text" label="تعلیق کاربری" value={isBan ? "" : "تعلیق"} onChange={() => setisBan(event.target.value)} /> */}
                                                        <div className="bg-stone-100 rounded-md p-2 flex-1">
                                                            <RadioGroup
                                                                className=" text-[14px]"
                                                                label="مسدود سازی"
                                                                orientation="vertical"
                                                                value={isBan}
                                                                onValueChange={setisBan}
                                                            >
                                                                <Radio value={false} size="sm">فعال</Radio>
                                                                <Radio value={true} size="sm">مسدود</Radio>

                                                            </RadioGroup>


                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input type="text" label="توضیحات" value={comment} onChange={() => setComment(event.target.value)} />

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
                                        onClick={updateUsersHandler}
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

