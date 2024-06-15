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
    Chip,
    User,
    Pagination,
    Spinner,
} from "@nextui-org/react";
import { toast } from "react-toastify";
// import { columns, users, statusOptions } from "./data";

const INITIAL_VISIBLE_COLUMNS = ["code", "grade", "gender", "type", "material", "size", "group", "price", "year"];


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
    { name: "کد محصول", uid: "code", sortable: true },
    { name: "مقطع", uid: "grade", sortable: true },
    { name: "جنسیت", uid: "gender", sortable: true },
    { name: "نوع محصول", uid: "type", sortable: true },
    { name: "جنس پارچه", uid: "material" },
    { name: "سایز", uid: "size" },
    { name: "گروه", uid: "group" },
    { name: "قیمت", uid: "price", sortable: true },
    { name: "سال تحصیلی", uid: "year", sortable: true },

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

export default function ExcelPriceListUploader() {

    const [priceList, setPriceList] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, {
                    type: "buffer"
                });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d) => {
            setPriceList(d);
        });
    };
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "year",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const addPriceListFromExcel = async (event) => {
        event.preventDefault();
        setIsLoading(false)

        try {
            // console.log("Schools--->", schools)
            if (priceList.length == 0) {
                toast.info("اکسل براساس فرمت مشخص بارگذاری شود")
                return false
            }

            const response = await fetch("/api/manager/pricelist/addpricelistfromexcel", {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify([...priceList])
            });
            const addPriceList = await response.json();
            if (addPriceList.status == 201) {
                toast.success(addPriceList.message);
            } else {
                toast.error("خطا در بروزرسانی یا افزودن");
            }

        } catch (error) {
            toast.error("خطا ناشناخته");
        }
        setIsLoading(false)

        // console.log("ready to send --->", schools)
    }





    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);



    const filteredItems = React.useMemo(() => {
        let filteredPriceList = [...priceList];

        if (hasSearchFilter) {
            filteredPriceList = filteredPriceList.filter((pr) =>
                pr?.type?.toLowerCase().includes(filterValue.toLowerCase()) ||
                pr?.code == filterValue ||
                pr?.group == filterValue,
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredPriceList = filteredPriceList?.filter((pr) =>
                Array.from(statusFilter).includes(pr?.status),
            );
        }

        return filteredPriceList;
    }, [priceList, filterValue, statusFilter]);


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
                                onAction={(key) => console.log(priceList)}>
                                <DropdownItem key="view">مشاهده</DropdownItem>
                                <DropdownItem key="edit">ویرایش</DropdownItem>
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
                <div className="flex flex-col text-[12px] bg-purple-600 p-4 text-white rounded-lg mt-4">
                    <span className="underline font-iranyekanBold">نکات بروزرسانی:</span>
                    <span>بروزرسانی براساس کد یکتا محصئل(مندرج در فایل اکسل مستندات)  انجام می شود</span>
                    <span>کلیه آیتم های به استثنا کد قابل بروزرسانی است</span>
                </div>
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="جستجو براساس نوع و گروه"
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

                        <Button color="primary" endContent={<PlusIcon />} >
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

                        </Button>
                        <Button color="secondary" onClick={(event) => addPriceListFromExcel(event)}>
                            <div className="flex-1 flex" isLoading={isLoading}>ارسال به پایگاه</div>

                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">کل {priceList.length} شرکت</span>
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
                <TableBody emptyContent={" محصولی یافت نشد"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.code}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}


