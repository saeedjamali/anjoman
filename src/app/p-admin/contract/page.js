"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { year } from "@/utils/constants";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Table,
  TableRow,
  TableCell,
  TableColumn,
  Tooltip,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
// const Map = dynamic(() => import("@/components/module/Map"), { ssr: false });
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
import { TableBody, TableHeader } from "react-stately";
import { FaDownload } from "react-icons/fa6";
import { useUserProvider } from "@/components/context/UserProvider";
import ContractManager from "@/components/module/contrct/ContractManager";
import ImageLoader from "@/components/module/contrct/ImageLoader";

function ContractPage() {
  const [images, setImages] = useState([]);
  const maxNumberContract = 2;
  const maxNumberFormDress = 4;
  const maxFileSize = 100000; //100KB
  const acceptType = "jpg";
  let sumOfQuntity = 0,
    sumOfPrice = 0,
    sumOfContractPrice = 0;
  const currentYear = year.find((y) => y.currentYear);
  const [showDetailContractItem, setShowDetailContractItem] = useState(false);
  const [fetchCompany, setFetchCompany] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currenContract, setCurrenContract] = useState({});
  const [contractlist, setContractlist] = useState([]);
  const [contractlistLen, setContractlistLen] = useState(0);
  const [countUnits, setCountUnits] = useState(0);
  const [UnitsInRegion, setUnitsInRegion] = useState(0);
  const [countIsConfirm, setCountIsConfirm] = useState(0);
  const [countWithoutContract, setCountWithoutContract] = useState(0);
  const [countCurrentAction, setCountCurrentAction] = useState(0);
  const [uniqueUnitValue, setUniqueUnitValue] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { region, admin } = useUserProvider();

  useEffect(() => {
    setIsClient(true);
  }, [showDetailContractItem, UnitsInRegion]);

  useEffect(() => {
    const level = admin.level;
    const regionCode = region.regionCode;
    const provinceCode = region.provinceCode;
    setIsLoading(true);
    const getCountUnitPerRegion = async () => {
      const { countregionUnit, regionUnits } = await fetch(
        `/api/admin/units/getcountunit/${level}/${regionCode}/${provinceCode}/${currentYear.name}`
      ).then((res) => res.json());

      setUnitsInRegion(regionUnits);
      setCountUnits(countregionUnit);
    };

    getCountUnitPerRegion();
    setIsLoading(false);
    setIsClient(true);
  }, []);

  useEffect(() => {
    //? لغو شده ها هم جز فاقد اقدام ها هستند
    setCountWithoutContract(
      () => contractlist.filter((cl) => cl.isConfirm == 10).length
    );
    setCountIsConfirm(
      () => contractlist.filter((cl) => cl.isConfirm == 1).length
    );
    setCountCurrentAction(
      contractlist.filter((cl) => cl.isConfirm == 0).length
    );

    setUniqueUnitValue([
      ...new Set(
        contractlist
          .map((element) => {
            if (
              element.isConfirm == 0 ||
              element.isConfirm == 1 ||
              element.isConfirm == 10
            ) {
              return element.unitcode;
            }
          })
          .filter((item) => item)
      ),
    ]);
  }, [contractlist]);

  //? rep number == isConfirm ==> 0 : currently , 1: confirm ,2:canceled , 10: no contract
  const exportToExcel = (data, repNumber) => {
    let resultData = [];

    switch (repNumber) {
      // case 1:
      //   resultData = [...data].filter(
      //     (cl) => cl.year == currentYear.name && cl.isConfirm == 1
      //   );
      //   break;
      case 100: //?گزارش جامع
        resultData = UnitsInRegion.map((unit) => {
          // console.log("foundUnit ----->", unit.schoolCode)
          contractlist.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          const foundUnit = contractlist.find(
            (cl) => cl.unitcode == unit.schoolCode && cl.isConfirm != 2
          );
          if (foundUnit) {
            // console.log("founded--->", foundUnit);
            return {
              regioncode: foundUnit.regioncode,
              regionname: foundUnit.regionname,
              unitcode: foundUnit.unitcode,
              unitname: foundUnit.unitname,
              unitgrade: foundUnit.Unit?.schoolGrade,
              unitAddress: foundUnit.Unit?.schoolAddress,
              companyname: foundUnit?.companyname,
              companyowner: foundUnit.company?.owner,
              companyphone: foundUnit.company?.phone,
              address: foundUnit.address,
              isConfirm:
                foundUnit.isConfirm == 0
                  ? "0-در حال بررسی "
                  : foundUnit.isConfirm == 1
                  ? "1-تایید شده  "
                  : foundUnit.isConfirm == 2
                  ? "2-رد شده"
                  : foundUnit.isConfirm == 10
                  ? "10-قرارداد ندارد"
                  : "100-بدون اقدام",
              modirname: foundUnit.modir.name,
              modirphone: foundUnit.modir.phone,
              createdAt: foundUnit.createdAt,
            };
          } else {
            return {
              unitcode: unit.schoolCode,
              unitname: unit.schoolName,
              unitgrade: unit.schoolGrade,
              isConfirm: "100-بدون اقدام", //? بدون اقدام
            };
          }
        });

      // console.log("foundUnit-->", resultData)
    }

    resultData.sort((a, b) => a.isConfirm.localeCompare(b.isConfirm));
    var Heading = [
      [
        "کد منطقه",
        "نام منطقه",
        "کد واحد",
        "نام واحد سازمانی",
        "دوره تحصیلی",
        "آدرس واحد سازمانی",
        "نام شرکت",
        "مالک شرکت",
        "شماره تماس مالک",
        "آدرس محل توزیع",
        "آخرین وضعیت ",
        "نام مدیر",
        "شماره تماس مدیر",
        "تاریخ ثبت ",
      ],
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils?.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, Heading);
    XLSX.utils.sheet_add_json(worksheet, resultData, {
      origin: "A2",
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "data.xlsx");
  };
  return (
    <>
      <ToastContainer
        bodyClassName={() => " flex-center text-sm font-white p-3"}
        position="top-left"
        rtl={true}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
          <Button
            isLoading={isLoading}
            className="flex flex-col items-center justify-center h-24 col-span-1"
            color="primary"
          >
            <span className="text-white  text-2xl">
              {/* {<CountUp start={0} end={countUnits}></CountUp>} */}
              {countUnits}
            </span>
            <span className="text-white  text-md">واحد سازمانی</span>
          </Button>
          <Button
            className="flex flex-col items-center justify-center h-24 col-span-1"
            color="danger"
          >
            <span className="text-white  text-2xl">
              {countUnits - uniqueUnitValue.length
                ? countUnits - uniqueUnitValue.length
                : 0}
            </span>
            <span className="text-white  text-md">بدون اقدام</span>
          </Button>
          <Button
            className="flex flex-col items-center justify-center h-24 col-span-1"
            color="secondary"
          >
            <span className="text-white  text-2xl">{countWithoutContract}</span>
            <span className="text-white  text-md">بدون قرارداد</span>
          </Button>
          <Button
            className="flex flex-col items-center justify-center h-24 col-span-1"
            color="success"
          >
            <span className="text-white text-2xl">{countIsConfirm}</span>
            <span className="text-white text-md">قرارداد تایید شده</span>
          </Button>
        </div>
        <div className="p-4 bg-slate-200 rounded-lg">
          <div className="mb-4 p-4 bg-slate-300 rounded-lg flex items-center justify-between">
            <span>لیست قراردادها</span>

            <div className="flex-center gap-8">
              <span className="text-[12px]">
                در حال بررسی ({countCurrentAction}) مورد
              </span>
              <span
                className="cursor-pointer"
                onClick={() => exportToExcel(contractlist, 100)}
              >
                <FaDownload className="text-slate-900" />
              </span>
            </div>
          </div>
          <ContractManager
            setShowDetailContractItem={setShowDetailContractItem}
            setCurrenContract={setCurrenContract}
            currenContract={currenContract}
            setContractlistLen={setContractlistLen}
            contractlist={contractlist}
            setContractlist={setContractlist}
          />
        </div>

        {showDetailContractItem && (
          <div className="p-4 bg-slate-200 rounded-lg mt-4">
            <div className="mb-4 p-4 bg-slate-300 rounded-lg flex items-center justify-between">
              <p className=" flex text-bold ">{`جزییات قرارداد شماره ${currenContract.code}`}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="col-span-2">
                <div>
                  <div className="table-container text-[14px]">
                    <Table
                      isStriped
                      aria-label="Example static collection table"
                      className="text-12"
                    >
                      <TableHeader>
                        <TableColumn>عناوین</TableColumn>
                        <TableColumn>توضیحات و مستندات مورد نیاز</TableColumn>
                      </TableHeader>
                      <TableBody className=" text-[14px]">
                        <TableRow key="1">
                          <TableCell>سال تحصیلی</TableCell>
                          <TableCell>{currenContract.year}</TableCell>
                        </TableRow>
                        <TableRow key="2">
                          <TableCell>واحد سازمانی</TableCell>
                          <TableCell>
                            {" "}
                            {currenContract.Unit.schoolName} (
                            {currenContract.Unit.schoolCode})
                          </TableCell>
                        </TableRow>
                        <TableRow key="3">
                          <TableCell>شرکت طرف قرارداد</TableCell>
                          <TableCell> {currenContract?.company.name}</TableCell>
                        </TableRow>
                        <TableRow key="4">
                          <TableCell>آدرس شرکت طرف قرارداد</TableCell>
                          <TableCell>
                            {currenContract?.company.address}
                          </TableCell>
                        </TableRow>
                        <TableRow key="5">
                          <TableCell>ظرفیت تولید شرکت</TableCell>
                          <TableCell>
                            {currenContract?.company.capacity} (
                            {currenContract?.company.capacity >
                            currenContract?.company.isUsed ? (
                              <span className="text-blue-500 text-[12px]">{`سفارشات تایید شده تا کنون  ${currenContract?.company.isUsed} دست `}</span>
                            ) : (
                              <span className="text-red-500 text-[12px]">{`سفارشات تایید شده تا کنون  ${currenContract?.company.isUsed} دست `}</span>
                            )}
                            )
                          </TableCell>
                        </TableRow>
                        <TableRow key="5">
                          <TableCell>آدرس محل توزیع</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-between">
                              {" "}
                              {currenContract.address ? (
                                currenContract.address
                              ) : (
                                <>
                                  <span className="text-red-500">
                                    {" "}
                                    ثبت نشده
                                  </span>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow key="6">
                          <TableCell>محصولات انتخاب شده</TableCell>
                          <TableCell className="text-[14px]">
                            <div className="flex flex-col items-start justify-start">
                              <span className="grid grid-cols-1  gap-2">
                                {currenContract.Pricelists?.length == 0 ? (
                                  <span className="text-red-500">
                                    {" "}
                                    انتخاب نشده
                                  </span>
                                ) : (
                                  currenContract.Pricelists.map((pr) => {
                                    sumOfQuntity += Number(pr.quantity);
                                    sumOfPrice += pr.quantity * pr.price;
                                    sumOfContractPrice +=
                                      pr.quantity * pr.priceInContract;
                                    return (
                                      <div className="  col-span-1 flex-center justify-between bg-slate-200 rounded-md">
                                        <span className=" mx-2 p-2 ">
                                          <span>
                                            {pr.type} &#x2022; {pr.material}{" "}
                                            &#x2022; سایز :{pr.size}
                                            &#x2022;{" "}
                                          </span>
                                          <span className=" text-blue-400 underline ">
                                            تعداد : {pr.quantity}
                                          </span>
                                          &#x2022;{" "}
                                          <span className=" text-blue-400 underline">
                                            قیمت کل مصوب :{" "}
                                            {(
                                              pr.quantity * pr.price
                                            ).toLocaleString()}
                                          </span>
                                          &#x2022;{" "}
                                          <span
                                            className={
                                              pr.priceInContract > pr.price
                                                ? "text-red-400 underline"
                                                : "text-green-400 underline"
                                            }
                                          >
                                            قیمت کل قرارداد :{" "}
                                            {(
                                              pr.quantity * pr.priceInContract
                                            ).toLocaleString()}
                                          </span>
                                        </span>
                                      </div>
                                    );
                                  })
                                )}
                              </span>
                              <div className="mt-2">
                                <p className="text-gray-800 text-[12px]">
                                  {`کل اقلام انتخاب شده برابر ${sumOfQuntity} عدد به ارزش ${sumOfPrice.toLocaleString()} ریال (براساس قیمت مصوب) و ${sumOfContractPrice.toLocaleString()}  ریال(براساس قیمت مندرج در قرارداد) می باشد.`}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>

                        <TableRow key="7">
                          <TableCell>تصاویر بارگذاری شده از قرارداد</TableCell>
                          <TableCell>
                            <div className="gap-2 flex w-full ">
                              {currenContract.imageContractList.map(
                                (image, index) => (
                                  <div key={index}>
                                    <ImageLoader
                                      imageUrl={image}
                                      code={"contract"}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow key="8">
                          <TableCell>تصاویر بارگذاری شده از لباس فرم</TableCell>
                          <TableCell>
                            <div className="gap-2 flex w-full ">
                              {currenContract.imageFormDressList.map(
                                (image, index) => (
                                  <div key={index}>
                                    <ImageLoader
                                      imageUrl={image}
                                      code={"formdress"}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow key="9">
                          <TableCell>
                            تصاویر بارگذاری شده از مجوز محصول
                          </TableCell>
                          <TableCell>
                            <div className="gap-2 flex w-full ">
                              {currenContract.certImagePricelist.map(
                                (image, index) => (
                                  <div key={index}>
                                    <ImageLoader
                                      imageUrl={image}
                                      code={"pricelist"}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ContractPage;
