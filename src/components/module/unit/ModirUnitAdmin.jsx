"use client"
import React, { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { useUserProvider } from "@/components/context/UserProvider";
import { ChevronDownIcon, SearchIcon, VerticalDotsIcon } from "@/utils/icon";
export const dynamic = 'force-dynamic'
// import { columns, users, statusOptions } from "./data";


const INITIAL_VISIBLE_COLUMNS = ["regionName", "name", "isActiveM", "schoolCode", "schoolName", "year", "isConfirm", "isActive", "actions"];

const statusColorMap = {
    1: "success",
    2: "danger",
    0: "warning",
};




const columns = [
    { name: "نام منطقه", uid: "regionName", sortable: true },
    { name: "نام مدیر", uid: "name", sortable: true },
    { name: "شماره همراه", uid: "phone", sortable: true },
    { name: "کد پرسنلی", uid: "prsCode", sortable: true },
    { name: "کد ملی", uid: "meliCode", sortable: true },
    { name: "تایید مدیر", uid: "isActiveM", sortable: true },
    { name: "کد منطقه", uid: "regionCode", sortable: true },
    { name: "کد مدرسه", uid: "schoolCode", sortable: true },
    { name: "نام مدرسه", uid: "schoolName" },
    { name: "وضعیت مدرسه", uid: "schoolgeo" },
    { name: "جنسیت", uid: "schoolgender" },
    { name: "عرض جغرافیایی", uid: "lat" },
    { name: "طول جغرافیایی", uid: "lng" },
    { name: "تعداد دانش آموز دختر", uid: "female", sortable: true },
    { name: "تعداد دانش آموز پسر", uid: "male", sortable: true },
    { name: "سال تحصیلی", uid: "year", sortable: true },
    { name: "تایید واحد سازمانی", uid: "isConfirm" },
    { name: "تایید مدیر-واحد سازمانی", uid: "isActive" },
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


export default function ModirUnitAdmin({ children }) {



    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingForModalbtn, setIsLoadingForModalbtn] = useState(false);
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [mus, setMus] = useState([]);
    const [mu, setMu] = useState("");
    const [modir, setModir] = useState("");
    const [unit, setUnit] = useState("");
    const [key, setKey] = useState("");
    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "year",
        direction: "ascending",
    });


    // const [action, setAction] = useState(0)
    let action = 0;  //1: acceept   2: deny
    //Modir
    const [id, setId] = useState(mu._id)
    const [unitId, setUnitId] = useState(mu.modirId)
    const [modirId, setModirId] = useState(mu.unitId)
    const [name, setName] = useState(mu.name)
    const [phone, setPhone] = useState(mu.phone)
    const [prsCode, setPrsCode] = useState(mu.prsCode)
    const [meliCode, setMelicode] = useState(mu.meliCode)
    // const [user, setUser] = useState(modir.user)
    const [isActiveM, setIsActiveM] = useState(mu.isActiveM)
    const [comment, setComment] = useState(modir.comment)
    const { region, admin } = useUserProvider();

    //Unit
    const [provinceName, setProvinceName] = useState(mu.provinceName);
    const [provinceCode, setProvinceCode] = useState(mu.provinceCode);
    const [regionCode, setRegionCode] = useState(mu.regionCode);
    const [regionName, setRegionName] = useState(mu.regionName);
    const [schoolCode, setSchoolCode] = useState(mu.schoolCode);
    const [schoolName, setSchoolName] = useState(mu.schoolName);
    const [female, setFemale] = useState(mu.female);
    const [male, setMale] = useState(mu.male);
    const [lng, setLng] = useState(mu.lng);
    const [lat, setLat] = useState(mu.lat);
    const [address, setAddress] = useState(mu.unitAddress);
    const [year, setYear] = useState(mu.year);
    const [isConfirm, setIsConfirm] = useState(mu.isConfirm);

    const [isActive, setIsActive] = useState(mu.isActive)
    const [page, setPage] = React.useState(1);
    const [selectedM, setSelectedM] = React.useState(isActiveM); //Radio status modir
    const [selectedU, setSelectedU] = React.useState(isConfirm); //Radio status unit

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);


    const filteredItems = React.useMemo(() => {
        let filteredMus = [...mus];

        if (hasSearchFilter) {
            filteredMus = filteredMus.filter((mu) =>
                mu.Unit?.schoolName?.toLowerCase().includes(filterValue.toLowerCase()) ||
                mu.Unit?.schoolCode == filterValue ||
                mu.Modir?.prsCode == filterValue ||
                mu.Modir?.name == filterValue ||
                mu.Modir?.phone == filterValue
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredMus = filteredMus?.filter((mu) =>
                Array.from(statusFilter).includes(`${mu?.isActive}`),
            );
        }

        return filteredMus;
    }, [mus, filterValue, statusFilter]);

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
        setId(mu.id)
        setUnitId(mu.unitId)
        setModirId(mu.modirId)
        setName(mu.name)
        setPhone(mu.phone)
        setPrsCode(mu.prsCode)
        setMelicode(mu.meliCode)
        setIsActiveM(mu.isActiveM)
        setComment(mu.comment)
        setProvinceName(mu.provinceName)
        setProvinceCode(mu.provinceCode)
        setRegionCode(mu.regionCode)
        setRegionName(mu.regionName)
        setSchoolCode(mu.schoolCode)
        setSchoolName(mu.schoolName)
        setFemale(mu.female)
        setMale(mu.male)
        setLng(mu.lng)
        setLat(mu.lat)
        setAddress(mu.unitAddress)
        setYear(mu.year)
        setIsActive(mu.isActive);
    }, [mu])

    useEffect(
        () => {
            getMu();
        }
        , []);


    // useEffect(() => {
    //     setSelectedKeys(selectedKeys)
    //     console.log("selectedKeys in--->", selectedKeys)
    // }, [selectedKeys]);
    const getMu = async () => {
        const level = admin.level;
        const regionCode = region.regionCode;
        const provinceCode = region.provinceCode;
        try {
            const response = await fetch(`/api/admin/modirunits/getmu/${level}/${regionCode}/${provinceCode}`, { cache: 'no-store' });
            const data = await response.json();
            if (data.status == 202) {
                toast.info(data.message)
            } else
                if (data.status == 201) {
                    toast.success(data.message)
                    const newMus = data.mus.map(item => {
                        let isActive = item.isActive;  // modirUnit
                        let isActiveM = item.Modir.isActive; //modir
                        let unitId = item.Unit._id; //Unit
                        let unitAddress = item.Unit.schoolAddress; //Unit

                        let modirId = item.Modir._id; //modir
                        let _id = item._id; //modir
                        return { ...item.Modir, ...item.Unit, isActive, isActiveM, _id, unitId, modirId, unitAddress }
                    })
                    setMus(newMus);
                } else {
                    toast.info("داده ای یافت نشد")
                }
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            console.log("catch error when get units -->", error);
        }
    }


    const updateModirsHandler = async () => {
        setIsLoadingForModalbtn(true)
        try {
            const response = await fetch(`/api/admin/modir/putmodirs/${mu.modirId}`, {
                method: "PUT",
                body: JSON.stringify({
                    name,
                    prsCode,
                    meliCode,
                    isActiveM,
                    comment,
                    muId: mu._id

                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.success(data.message)
                onClose()

                location.reload();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("error from update modirs Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }

    const updateUnitHandler = async () => {
        setIsLoadingForModalbtn(true)
        try {
            const response = await fetch(`/api/admin/modirunits/putunit/${mu._id}`, {
                method: "PUT",
                body: JSON.stringify({

                    female,
                    male,
                    lng,
                    lat,
                    address,
                    isConfirm
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            if (data.status == 201) {
                toast.success(data.message)
                onClose()
                location.reload()
                // let updateMus = mus.map(item => {
                //     if (item._id == mu._id) {
                //         return {
                //             ...item,
                //             female,
                //             male,
                //             lng,
                //             lat,
                //             address,
                //             isConfirm
                //         }
                //     }
                //     return item
                // })
                // setMus(updateMus);

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("error from update unit in modirUnit Handler --->", error)
        }
        setIsLoadingForModalbtn(false)
    }


    const updateIsActiveMuHandler = async () => {
        try {

            const formData = new FormData();
            // formData.append("name", name);
            for (const key of selectedKeys) {
                formData.append("selectedKeys", key);
            }
            formData.append("selectedKeys", action);
            const response = await fetch(`/api/admin/modirunits/putmu`, {

                method: "POST",
                header: { "Content-Type": "multipart/form-data" },
                body: formData
            })
            const data = await response.json();
            if (data.status == 201) {
                let newMus = [];
                if (selectedKeys === 'all') {
                    newMus = mus.map(mu => { return { ...mu, isActive: action } })
                } else {
                    newMus = mus.map(mu => {
                        if (Array.from(selectedKeys).includes(mu._id)) {
                            return { ...mu, isActive: action }
                        } else
                            return mu
                    })
                }
                setMus(newMus);
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {

        }
    }
    //!!!!!!!!!!!!!
    const renderCell = React.useCallback((mu, columnKey) => {

        const cellValue = mu[columnKey];

        switch (columnKey) {

            case "isConfirm":
                return (
                    <Chip className="capitalize" color={statusColorMap[mu.isConfirm]} size="sm" variant="flat">
                        {cellValue == 0 ? 'در حال بررسی' : cellValue == 1 ? 'تایید شده' : 'رد شده'}
                    </Chip>
                );
            case "isActiveM":
                return (
                    <Chip className="capitalize" color={statusColorMap[mu.isActiveM]} size="sm" variant="flat">
                        {cellValue == 0 ? 'در حال بررسی' : cellValue == 1 ? 'تایید شده' : 'رد شده'}
                    </Chip>
                );
            case "isActive":
                return (
                    <Chip className="capitalize" color={statusColorMap[mu.isActive]} size="sm" variant="flat">
                        {cellValue == 0 ? 'در حال بررسی' : cellValue == 1 ? 'تایید شده' : 'رد شده'}
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
                                    setMu(mu);
                                    setKey(key)
                                    onOpen();
                                }}
                            >

                                <DropdownItem key="unit" >ویرایش واحد سازمانی</DropdownItem>
                                <DropdownItem key="modir">ویرایش مدیر</DropdownItem>
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
                                    وضعیت تایید مدیر-واحد
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


                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <Button className="bg-blue-600 text-white"
                            onClick={() => {
                                action = 1;
                                if (selectedKeys.size == 0) {
                                    toast.info("حداقل یک مورد انتخاب شود")
                                    return
                                }
                                updateIsActiveMuHandler();
                            }
                            }>تایید </Button>
                        <Button className="bg-red-600 text-white"
                            onClick={() => {
                                action = 2;
                                if (selectedKeys.size == 0) {
                                    toast.info("حداقل یک مورد انتخاب شود")
                                    return
                                }
                                updateIsActiveMuHandler();
                            }
                            }>لغو </Button>

                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">کل {mus.length} مدیر-واحد سازمانی</span>
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
            </div >
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        mus.length,
        onSearchChange,
        hasSearchFilter,
        selectedKeys

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
                    emptyContent={"مدیر - مدرسه ای یافت نشد"}
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
                    key == "modir" ?
                        <ModalContent>
                            {(onClose) => (
                                <><ModalHeader className="flex flex-col gap-1 font-iranyekanMedium text-md">
                                    ویرایش اطلاعات مدیر
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

                                                        </div>
                                                        <div className="bg-stone-100 rounded-md p-2">
                                                            <RadioGroup
                                                                className=" text-[14px]"
                                                                label="وضعیت"
                                                                orientation="horizontal"
                                                                value={isActiveM}
                                                                onValueChange={setIsActiveM}
                                                            >
                                                                <Radio value="0" size="sm">در حال بررسی</Radio>
                                                                <Radio value="1" size="sm">تایید</Radio>
                                                                <Radio value="2" size="sm">رد</Radio>

                                                            </RadioGroup>


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
                                            isLoading={isLoading}
                                            className="bg-green-700 text-white"
                                            color="success"
                                            variant="light"
                                            onClick={updateModirsHandler}
                                        >
                                            ویرایش
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
                                                            <Input type="text" label="کد استان" value={provinceName} disabled />
                                                            <Input type="text" label="نام استان" value={provinceCode} disabled />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="کد منطقه" value={regionCode} disabled />
                                                            <Input type="text" label="نام منطقه" value={regionName} disabled />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="کد مدرسه" value={schoolCode} disabled />
                                                            <Input type="text" label="نام مدرسه" value={schoolName} disabled />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="دانش آموز دختر" value={female} onChange={() => setFemale(event.target.value)} />
                                                            <Input type="text" label="دانش آموز پسر" value={male} onChange={() => setMale(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="آدرس" value={address} onChange={() => setAddress(event.target.value)} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input type="text" label="سال تحصیلی" value={year} disabled />

                                                        </div>
                                                        <div className="bg-stone-100 rounded-md p-2">
                                                            <RadioGroup
                                                                className=" text-[14px]"
                                                                label="وضعیت"
                                                                orientation="horizontal"
                                                                value={isConfirm}
                                                                onValueChange={setIsConfirm}
                                                            >
                                                                <Radio value="0" size="sm">در حال بررسی</Radio>
                                                                <Radio value="1" size="sm">تایید</Radio>
                                                                <Radio value="2" size="sm">رد</Radio>

                                                            </RadioGroup>


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
                                            isLoading={isLoadingForModalbtn}
                                            className="bg-green-700 text-white"
                                            color="success"
                                            variant="light"
                                            onClick={updateUnitHandler}
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

