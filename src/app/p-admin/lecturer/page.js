"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { year } from "@/utils/constants";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Autocomplete,
  AutocompleteItem,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  Image,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
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
import ImageLoader from "@/components/module/contrct/ImageLoader";
import LecturerManager from "@/components/template/lecturer/LecturerManager";
import ImageLoaderLecturer from "@/components/module/contrct/ImageLoaderLecturer";
import { NotificationIcon } from "@/utils/icon";
import { valiadtePrsCode } from "@/utils/auth";

function LecturerPage() {
  const { admin, user } = useUserProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [lecturerList, setLecturerList] = useState([]);
  const [currentLecturer, setCurrentLecturer] = useState([]);
  const [lecturerlistLen, setLecturerlistLen] = useState(0);
  const [showDetailLecturer, setShowDetailLecturer] = useState(false);
  const [actionType, setActionType] = useState(0); //? 1: view    2:edit   3: remove

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [payment, setPayment] = useState(0); //? 1 : submit   ---- 2 : payment
  const [comment, setComment] = useState(0); //? 1 : submit   ---- 2 : payment
  const { identifier, isActive, isBan } = user;
  const [history, setHistory] = useState([]);
  const [currentYearHistory, setCurrentYearHistory] = useState(null);
  const [year, setYear] = useState("1403-1404");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [prsCode, setPrsCode] = useState("");
  const [meliCode, setMeliCode] = useState(identifier);
  const [occuptionState, setOccuptionState] = useState(0);
  const [organ, setOrgan] = useState(0);
  const [isAcademic, setIsAcademic] = useState(false);
  const [typeAcademic, setTypeAcademic] = useState(0);
  const [province, setProvince] = useState(null);
  const [region, setRegion] = useState(null);
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
  const [notCompletePersonalInformation, setNotCompletePersonalInformation] =
    useState(true);

  //? Provinces , Region , Field , Degree
  const [provinces, setProvinces] = useState([]);
  const [regions, setRegions] = useState([]);
  const [fields, setFields] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    getRegions(province);
    // setRegions(prev => [...regions, { regionCode: 1, regionName: ' مقدس' }])

    if (!province) {
      setRegions([]);
    }
  }, [province]);

  useEffect(() => {
    getProvinces();
    getFields();
    getDegrees();
  }, []);

  useEffect(() => {
    if (currentLecturer) {
      setPayment(currentLecturer.payment);
      setComment(currentLecturer.comment);
      setName(currentLecturer.name);
      setPhone(currentLecturer.phone);
      setPrsCode(currentLecturer.prsCode);
      setMeliCode(currentLecturer.meliCode);
      setOccuptionState(currentLecturer.occuptionState);
      setOrgan(currentLecturer.organ);
      setIsAcademic(currentLecturer.isAcademic);
      setTypeAcademic(currentLecturer.typeAcademic);
      setProvince(currentLecturer.province?.code);
      setRegion(currentLecturer.Region?.regionCode);
      setDegree(currentLecturer.degree?.code);
      setField(currentLecturer.field?.code);
      setProvinceObj(currentLecturer.province);
      setRegionObj(currentLecturer.Region);
      setDegreeObj(currentLecturer.degree);
      setFieldObj(currentLecturer.field);
      setIsCertificateBefore(currentLecturer.isCertificateBefore);
      setAge(currentLecturer.age);
      setIsAccepted(currentLecturer.isAccepted);
      setStatus(currentLecturer.status);
      setDegreeDoc(currentLecturer?.degreeDoc);
      setIntroDoc(currentLecturer.introDoc);
      setCertificateDoc(currentLecturer.certificateDoc);
    }
  }, [currentLecturer]);

  const getProvinces = async () => {
    try {
      const response = await fetch(`/api/base/province/getall`);
      const data = await response.json();

      if (data.status == 200) {
        setProvinces(data.provinces.sort((a, b) => a.code - b.code));
      } else {
        // toast.info(data.message);
      }
    } catch (error) {
      toast.error("خطای ناشناخته");
    }
  };
  const getFields = async () => {
    try {
      const response = await fetch(`/api/base/field/getall/`);
      const data = await response.json();

      if (data.status == 200) {
        setFields(data.fields);
      } else {
        toast.info(data.message);
      }
    } catch (error) {
      toast.error("خطای ناشناخته");
    }
  };

  const getDegrees = async () => {
    try {
      const response = await fetch(`/api/base/degree/getall/`);
      const data = await response.json();

      if (data.status == 200) {
        setDegrees(data.degrees);
      } else {
        toast.info(data.message);
      }
    } catch (error) {
      toast.error("خطای ناشناخته");
    }
  };

  const getRegions = async (provinceCode) => {
    try {
      const response = await fetch(`/api/region/province/${provinceCode}`);
      const data = await response.json();

      if (data.status == 200) {
        data.regions.push({
          regionCode: 1,
          regionName: "مشهد مقدس",
          provinceCode: 16,
          provinceName: "خراسان رضوی",
        });
        setRegions(data.regions.sort((a, b) => a.regionCode - b.regionCode));
      } else {
        // toast.error(data.message);
      }
    } catch (error) {
      toast.error("خطای ناشناخته");
    }
  };

  const submitPersonalInfoation = async () => {
    let str = [];

    if (!name) {
      str.push("نام خانوادگی تکمیل شود");
      setNotCompletePersonalInformation(true);
    }

    if (organ == 0) {
      str.push("محل خدمت مشخص شود");
      setNotCompletePersonalInformation(true);
    }

    if (organ == 1 && !valiadtePrsCode(prsCode)) {
      str.push("کد پرسنلی با دقت تکمیل شود");
      setNotCompletePersonalInformation(true);
    }
    if (organ == 2 && !typeAcademic) {
      str.push("مرتبه دانشگاهی مشخص شود");
      setNotCompletePersonalInformation(true);
    }

    if (!age) {
      str.push("سن وارد شود");
      setNotCompletePersonalInformation(true);
    }

    if (age < 30) {
      str.push("حداقل شرط سنی رعایت نشده است");
      setNotCompletePersonalInformation(true);
    }

    if (occuptionState == 0) {
      str.push("وضعیت اشتغال مشخص شود");
      setNotCompletePersonalInformation(true);
    }

    if (!province) {
      str.push("استان مشخص شود");
      setNotCompletePersonalInformation(true);
    }
    if (!region) {
      str.push("منطقه مشخص شود");
      setNotCompletePersonalInformation(true);
    }
    if (!degree) {
      str.push("مدرك مشخص شود");
      setNotCompletePersonalInformation(true);
    }
    if (!field) {
      str.push("رشته تحصيلي مشخص شود");
      setNotCompletePersonalInformation(true);
    }
    setError(str);
    if (str.length == 0) {
      setNotCompletePersonalInformation(false);
      // setIsPersonalInformation(true);
      setIsLoading(true);
      try {
        const formData = new FormData();
        if (organ == 2) {
          setIsAcademic(true);
        }
        formData.append("year", year);
        formData.append("user", user._id);
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("prsCode", prsCode);
        formData.append("meliCode", meliCode);
        formData.append("occuptionState", occuptionState);
        formData.append("organ", organ);
        formData.append("isAcademic", isAcademic);
        formData.append("typeAcademic", typeAcademic);
        formData.append("isCertificateBefore", isCertificateBefore);
        formData.append("age", age);
        formData.append("isAccepted", isAccepted);
        formData.append("status", status);
        formData.append("payment", payment);
        formData.append("comment", comment);
        formData.append("province", JSON.stringify(provinceObj));
        formData.append("region", JSON.stringify(regionObj));
        formData.append("degree", JSON.stringify(degreeObj));
        formData.append("field", JSON.stringify(fieldObj));
        const res = await fetch("/api/admin/lecturer/update", {
          method: "PUT",
          header: { "Content-Type": "multipart/form-data" },
          body: formData,
        });
        const data = await res.json();
        if (data.status == 201) {
          toast.success(data.message);

          location.reload();
        } else {
          toast.info(data.message);
        }
      } catch (error) {
        setIsLoading(false);
        console.log("error from front catch:", error);
      }
      setIsLoading(false);
    }
  };
  //? rep number == isConfirm ==> 0 : currently , 1: confirm ,2:canceled , 10: no contract
  const exportToExcel = (data) => {
    let resultData = [];
    resultData = lecturerList.map((lc) => {
      return {
        year: lc.year,
        name: lc.name,
        phone: lc.phone,
        prsCode: lc.prsCode,
        meliCode: lc.meliCode,
        occuptionState: lc.occuptionState == 1 ? "شاغل" : "بازنشسته",
        organ:
          lc.organ == 1
            ? "آموزش و پرورش"
            : lc.organ == 2
            ? "دانشگاه"
            : lc.organ == 3
            ? "حوزه علمیه"
            : "نامشخص",
        isAcademic: lc.isAcademic ? "بله " : "خیر",
        typeAcademic:
          lc.typeAcademic == 1
            ? "استادیار"
            : lc.typeAcademic == 2
            ? "دانشیار"
            : "نامشخص",
        provinceName: lc.provinceName,
        regionName: lc.regionName,
        degree: lc.degree.name,
        field: lc.field.name,
        isCertificateBefore: lc.isCertificateBefore ? "بله " : "خیر",
        age: lc.age,
        isAccepted: lc.isAccepted ? "بله " : "خیر",
        status:
          lc.status == 1
            ? "ثبت نام شده"
            : lc.status == 2
            ? "قبولی آزمون"
            : lc.status == 3
            ? "رد"
            : lc.status == 4
            ? "در انتظار پرداخت"
            : "نامخشخص",
        payment: lc.payment == 1 ? "رایگان" : "پرداخت",
        createAt: lc.createdAt,
      };
    });

    // console.log("foundUnit-->", resultData)

    resultData.sort((a, b) => a.createAt - b.createAt);
    var Heading = [
      [
        "سال تحصیلی",
        "نام",
        "شماره همراه",
        "کد پرسنلی",
        "کد ملی",
        "وضعیت اشتغال",
        "سازمان",
        "تحصیلات تکمیلی",
        "رتبه دانشگاهی",
        " استان",
        "منطقه/شهرستان ",
        "مدرک",
        "رشته تحصیلی",
        "گواهی مدرسی از قبل دارد؟ ",
        "سن",
        "تایید ارگان/سازمان توسط کاربر",
        "وضعیت",
        "پرداخت",
        "تاریخ ایجاد",
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
        <div className="p-4 bg-slate-200 rounded-lg">
          <div className="mb-4 p-4 bg-slate-300 rounded-lg flex items-center justify-between">
            <span>لیست ثبت نام مدرسین آموزش خانواده</span>

            <div className="flex-center gap-8">
              {/* <span className="text-[12px]">
                                در حال بررسی ({countCurrentAction}) مورد
                            </span> */}
              <span
                className="cursor-pointer"
                onClick={() => exportToExcel(lecturerList)}
              >
                <FaDownload className="text-slate-900" />
              </span>
            </div>
          </div>
          <LecturerManager
            setShowDetailLecturer={setShowDetailLecturer}
            setCurrentLecturer={setCurrentLecturer}
            currentLecturer={currentLecturer}
            setLecturerlistLen={setLecturerlistLen}
            lecturerList={lecturerList}
            setLecturerList={setLecturerList}
            setActionType={setActionType}
          />
        </div>

        {showDetailLecturer && actionType == 1 && (
          <div div className="p-4 bg-slate-200 rounded-lg mt-4">
            {/* <div className="mb-4 p-4 bg-slate-300 rounded-lg flex items-center justify-between">
              <p className=" flex text-bold ">{`جزییات ثبت نام ${currentLecturer.name}`}</p>
            </div> */}
            <div className="flex flex-col justify-start ">
              {/* //? ثبت مشخصات فردی */}

              <Card className="my-4">
                <CardHeader className="flex gap-3 bg-blue-500 text-white">
                  <p className="text-lg ">
                    مشاهده {`جزییات ثبت نام ${currentLecturer.name}`}
                  </p>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
                    <div className="relative mt-2 flex justify-start col-span-1">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <Input
                        tabIndex={1}
                        disabled={true}
                        type="text"
                        size="md"
                        label="نام و نام خانوادگی"
                        labelPlacement={"inside"}
                        value={currentLecturer.name}
                      ></Input>
                    </div>
                    <div className="relative mt-2 flex justify-start col-span-1">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <Input
                        tabIndex={2}
                        disabled={true}
                        size="md"
                        type="number"
                        label="کد ملی"
                        labelPlacement={"inside"}
                        value={currentLecturer.meliCode}
                      ></Input>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
                    <div className="relative mt-2 flex justify-start col-span-1">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <Input
                        disabled={true}
                        type="text"
                        label="سال تحصیلی"
                        size="md"
                        labelPlacement={"inside"}
                        value={currentLecturer.year}
                      ></Input>
                    </div>
                    <div className="relative mt-2 flex justify-start col-span-1">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <Input
                        tabIndex={3}
                        disabled={true}
                        type="number"
                        label="سن"
                        size="md"
                        labelPlacement={"inside"}
                        value={currentLecturer.age}
                      ></Input>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
                    <div className=" relative mt-2 flex justify-start col-span-1 ">
                      <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                        <RadioGroup
                          tabIndex={4}
                          isDisabled={true}
                          className="flex justify-between items-start p-2 text-[14px]"
                          label="وضعیت اشتغال"
                          orientation="horizontal"
                          value={currentLecturer.occuptionState + ""}
                        >
                          <Radio value="1" size="sm">
                            شاغل
                          </Radio>
                          <Radio value="2" size="sm">
                            بازنشسته
                          </Radio>
                        </RadioGroup>
                      </div>
                    </div>
                    <div className=" relative mt-2 flex justify-start col-span-1 ">
                      <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                        <RadioGroup
                          tabIndex={5}
                          isDisabled={true}
                          className="flex-1 justify-start items-start p-2 text-[14px]"
                          label="سازمان محل خدمت"
                          orientation="horizontal"
                          value={currentLecturer.organ + ""}
                        >
                          <Radio value="1" size="sm">
                            آموزش و پرورش
                          </Radio>
                          <Radio value="2" size="sm">
                            دانشگاه(عضو هیئت علمی می باشم)
                          </Radio>
                          <Radio value="3" size="sm">
                            حوزه علمیه
                          </Radio>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
                    {currentLecturer.organ == 1 ? (
                      <div className="relative mt-2 flex justify-start col-span-1">
                        {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                        <Input
                          tabIndex={6}
                          disabled={true}
                          type="number"
                          size="md"
                          label="کد پرسنلی"
                          labelPlacement={"inside"}
                          value={currentLecturer.prsCode}
                        ></Input>
                      </div>
                    ) : currentLecturer.organ == 2 ? (
                      <div className=" relative mt-2 flex justify-start col-span-1 ">
                        <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                          <RadioGroup
                            tabIndex={7}
                            isDisabled={true}
                            className="flex-1 justify-start items-start p-2 text-[14px]"
                            label="رتبه دانشگاهی"
                            orientation="horizontal"
                            value={currentLecturer.typeAcademic + ""}
                          >
                            <Radio value="1" size="sm">
                              استادیار
                            </Radio>
                            <Radio value="2" size="sm">
                              دانشیار
                            </Radio>
                          </RadioGroup>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 mt-2  md:gap-4">
                    <div className="relative mt-2 flex justify-start col-span-1">
                      <Input
                        tabIndex={6}
                        disabled={true}
                        type="text"
                        size="md"
                        label="استان"
                        labelPlacement={"inside"}
                        value={currentLecturer.province?.name}
                      ></Input>
                    </div>
                    <div className="relative mt-2 flex justify-start col-span-1">
                      <Input
                        tabIndex={6}
                        disabled={true}
                        type="text"
                        size="md"
                        label="منطقه"
                        labelPlacement={"inside"}
                        value={currentLecturer.Region?.regionName}
                      ></Input>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    <div className="relative mt-2 flex justify-start items-start text-right col-span-1">
                      <Input
                        tabIndex={6}
                        disabled={true}
                        type="text"
                        size="md"
                        label="مدرک تحصیلی"
                        labelPlacement={"inside"}
                        value={currentLecturer.degree?.name}
                      ></Input>
                    </div>
                    <div className="relative mt-2 flex justify-start items-start text-right col-span-1">
                      <Input
                        tabIndex={6}
                        disabled={true}
                        type="text"
                        size="md"
                        label="رشته تحصیلی"
                        labelPlacement={"inside"}
                        value={currentLecturer.field?.name}
                      ></Input>
                    </div>
                  </div>

                  <div className="relative mt-4  flex justify-start items-start text-right col-span-2">
                    <Checkbox
                      tabIndex={12}
                      isDisabled={true}
                      size="sm"
                      defaultSelected={currentLecturer.isCertificateBefore}
                      radius="md"
                    >
                      دارای گواهی نامه مدرسی آموزش خانواده(در سنوات قبل) می
                      باشم.
                    </Checkbox>
                  </div>
                  <div className="relative my-2  flex justify-start items-start text-right col-span-2">
                    <Checkbox
                      tabIndex={13}
                      isDisabled={true}
                      size="sm"
                      defaultSelected={currentLecturer.isAccepted}
                      radius="md"
                    >
                      دارای مدرک دکتری در آموزش و پرورش و یا عضو هیئت علمی در
                      دانشگاه با رتبه استادیار یا دانشیار یا سطح چهار تخصصی حوزه
                      های علمیه می باشم.{" "}
                    </Checkbox>
                  </div>
                </CardBody>
                <Divider />
              </Card>

              {/* //? بارگذاری مدارک مورد نیاز */}

              <Card className="my-4">
                <CardHeader className="flex gap-3 bg-blue-500 text-white">
                  <p className="text-lg "> مدارک بارگذاری شده</p>
                </CardHeader>
                <Divider />
                <CardBody className="text-[12px] items-start gap-y-4">
                  {!(
                    currentLecturer.organ == 2 ||
                    currentLecturer.organ == 3 ||
                    currentLecturer.isCertificateBefore
                  ) && (
                    <div className="w-full flex-center">
                      با توجه به بند های انتخاب شده مدرکی بارگذاری نشده است
                    </div>
                  )}

                  {/* <div className="w-full  relative mt-2 flex justify-between item-start col-span-2">
                    <div className="flex items-center justify-start text-[14px] text-right">
                      {" "}
                      تصویر مدرک تحصیلی
                    </div>
                    <div className="gap-2  ">
                      {currentLecturer.degreeDoc?.map((image, index) => (
                        <div key={index}>
                          <ImageLoaderLecturer
                            imageUrl={image}
                            code={"degree"}
                          />
                        </div>
                      ))}
                    </div>
                  </div> */}

                  {(currentLecturer.organ == 2 ||
                    currentLecturer.organ == 3) && (
                    <div className="w-full  relative mt-2 flex justify-between item-center col-span-2">
                      <div className="flex-center text-[14px] text-right">
                        {" "}
                        تصویر معرفی نامه بارگذاری شده
                      </div>
                      <div className="gap-2  ">
                        {currentLecturer.introDoc?.map((image, index) => (
                          <div key={index}>
                            <ImageLoaderLecturer
                              imageUrl={image}
                              code={"intro"}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentLecturer.isCertificateBefore && (
                    <div className="w-full  relative mt-2 flex justify-between item-center col-span-2">
                      <div className="flex-center text-[14px] text-right">
                        {" "}
                        تصویر گواهی نامه مدرسی آموزشی خانواده سنوات قبل
                      </div>
                      <div className="gap-2  ">
                        {currentLecturer.certificateDoc?.map((image, index) => (
                          <div key={index}>
                            <ImageLoaderLecturer
                              imageUrl={image}
                              code={"certificate"}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
                <Divider />
              </Card>
            </div>
          </div>
        )}

        {showDetailLecturer && actionType == 2 && (
          <div div className="p-4 bg-slate-200 rounded-lg mt-4">
            {/* <div className="mb-4 p-4 bg-slate-300 rounded-lg flex items-center justify-between">
              <p className=" flex text-bold ">{`ویرایش ثبت نام ${currentLecturer.name}`}</p>
            </div> */}
            <div className="flex flex-col justify-start ">
              {/* //? ثبت مشخصات فردی */}

              <Card className="my-4">
                <CardHeader className="flex gap-3 bg-blue-500 text-white">
                  <p className="text-lg ">{`ویرایش ثبت نام ${currentLecturer.name}`}</p>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
                    <div className="relative mt-2 flex justify-start col-span-1">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <Input
                        tabIndex={1}
                        type="text"
                        size="md"
                        label="نام و نام خانوادگی"
                        labelPlacement={"inside"}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      ></Input>
                    </div>
                    <div className="relative mt-2 flex justify-start col-span-1">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <Input
                        tabIndex={2}
                        size="md"
                        type="number"
                        label="کد ملی"
                        labelPlacement={"inside"}
                        value={meliCode}
                        onChange={(event) => setMeliCode(event.target.value)}
                      ></Input>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
                    <div className="relative mt-2 flex justify-start col-span-1">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <Input
                        disabled={true}
                        type="text"
                        label="سال تحصیلی"
                        size="md"
                        labelPlacement={"inside"}
                        value={year}
                      ></Input>
                    </div>
                    <div className="relative mt-2 flex justify-start col-span-1">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <Input
                        tabIndex={3}
                        type="number"
                        label="سن"
                        size="md"
                        labelPlacement={"inside"}
                        value={age}
                        onChange={(event) => setAge(event.target.value)}
                      ></Input>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
                    <div className=" relative mt-2 flex justify-start col-span-1 ">
                      <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                        <RadioGroup
                          tabIndex={4}
                          className="flex justify-between items-start p-2 text-[14px]"
                          label="وضعیت اشتغال"
                          orientation="horizontal"
                          value={occuptionState + ""}
                          onValueChange={setOccuptionState}
                        >
                          <Radio value="1" size="sm">
                            شاغل
                          </Radio>
                          <Radio value="2" size="sm">
                            بازنشسته
                          </Radio>
                        </RadioGroup>
                      </div>
                    </div>
                    <div className=" relative mt-2 flex justify-start col-span-1 ">
                      <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                        <RadioGroup
                          tabIndex={5}
                          className="flex-1 justify-start items-start p-2 text-[14px]"
                          label="سازمان محل خدمت"
                          orientation="horizontal"
                          value={organ + ""}
                          onValueChange={setOrgan}
                        >
                          <Radio value="1" size="sm">
                            آموزش و پرورش
                          </Radio>
                          <Radio value="2" size="sm">
                            دانشگاه(عضو هیئت علمی می باشم)
                          </Radio>
                          <Radio value="3" size="sm">
                            حوزه علمیه
                          </Radio>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
                    {organ == 1 ? (
                      <div className="relative mt-2 flex justify-start col-span-1">
                        {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                        <Input
                          tabIndex={6}
                          type="number"
                          size="md"
                          label="کد پرسنلی"
                          labelPlacement={"inside"}
                          value={prsCode + ""}
                          onChange={(event) => setPrsCode(event.target.value)}
                        ></Input>
                      </div>
                    ) : organ == 2 ? (
                      <div className=" relative mt-2 flex justify-start col-span-1 ">
                        <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                          <RadioGroup
                            tabIndex={7}
                            className="flex-1 justify-start items-start p-2 text-[14px]"
                            label="رتبه دانشگاهی"
                            orientation="horizontal"
                            value={typeAcademic + ""}
                            onValueChange={setTypeAcademic}
                          >
                            <Radio value="1" size="sm">
                              استادیار
                            </Radio>
                            <Radio value="2" size="sm">
                              دانشیار
                            </Radio>
                          </RadioGroup>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 mt-2  md:gap-4">
                    <div className="relative mt-2 flex justify-start col-span-1">
                      <Autocomplete
                        tabIndex={8}
                        labelPlacement={"inline"}
                        backdrop="blur"
                        isRequired
                        size="md"
                        color="default"
                        errorMessage="انتخاب استان"
                        // label="استان"
                        // placeholder={currentLecturer.province.name}
                        className="col-span-1"
                        defaultItems={provinces}
                        selectedKey={province + ""}
                        onSelectionChange={async (key) => {
                          setProvince(key);
                          setProvinceObj(
                            provinces.filter((item) => item.code == key)[0]
                          );
                        }}
                      >
                        {(item) => (
                          <AutocompleteItem key={item.code}>
                            {item.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </div>
                    <div className="relative mt-2 flex justify-start col-span-1">
                      <Autocomplete
                        tabIndex={9}
                        labelPlacement={"inline"}
                        backdrop="blur"
                        isRequired
                        size="md"
                        color="default"
                        errorMessage="انتخاب منطقه"
                        // placeholder={currentLecturer.Region.regionName}
                        className=" col-span-1"
                        defaultItems={regions}
                        selectedKey={region}
                        onSelectionChange={async (key) => {
                          setRegion(key);
                          setRegionObj(
                            regions.filter((item) => item.regionCode == key)[0]
                          );
                          // console.log(key)
                        }}
                      >
                        {(item) => (
                          <AutocompleteItem key={item.regionCode}>
                            {item.regionName}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    <div className="relative mt-2 flex justify-start items-start text-right col-span-1">
                      <Autocomplete
                        tabIndex={10}
                        labelPlacement={"inline"}
                        backdrop="blur"
                        isRequired
                        size="md"
                        color="default"
                        errorMessage="انتخاب مدرک تحصیلی"
                        // placeholder={currentLecturer.degree.name}
                        className=" col-span-1"
                        defaultItems={degrees}
                        selectedKey={degree + ""}
                        onSelectionChange={async (key) => {
                          setDegree(key);
                          setDegreeObj(
                            degrees.filter((item) => item.code == key)[0]
                          );
                        }}
                      >
                        {(item) => (
                          <AutocompleteItem key={item.code}>
                            {item.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </div>
                    <div className="relative mt-2 flex justify-start items-start text-right col-span-1">
                      <Autocomplete
                        tabIndex={11}
                        labelPlacement={"inline"}
                        backdrop="blur"
                        isRequired
                        size="md"
                        color="default"
                        errorMessage="انتخاب رشته تحصیلی"
                        // placeholder={currentLecturer.field.name}
                        className=" col-span-1"
                        defaultItems={fields}
                        selectedKey={field + ""}
                        onSelectionChange={async (key) => {
                          setField(key);
                          setFieldObj(
                            fields.filter((item) => item.code == key)[0]
                          );
                          // console.log(key)
                        }}
                      >
                        {(item) => (
                          <AutocompleteItem key={item.code}>
                            {item.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    <div className=" relative mt-2 flex justify-start col-span-1 ">
                      <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                        <RadioGroup
                          tabIndex={7}
                          className="flex-1 justify-start items-start p-2 text-[14px]"
                          label="وضعیت"
                          orientation="horizontal"
                          value={status + ""}
                          onValueChange={setStatus}
                        >
                          <Radio value="1" size="sm">
                            ثبت نام شده
                          </Radio>
                          <Radio value="2" size="sm">
                            قبولی در مصاحبه
                          </Radio>
                          <Radio value="3" size="sm">
                            رد در مصاحبه
                          </Radio>
                          <Radio value="4" size="sm">
                            در انتظار پرداخت
                          </Radio>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className=" relative mt-2 flex justify-start col-span-1 ">
                      <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                        <RadioGroup
                          tabIndex={7}
                          className="flex-1 justify-start items-start p-2 text-[14px]"
                          label="پرداخت"
                          orientation="horizontal"
                          value={payment + ""}
                          onValueChange={setPayment}
                        >
                          <Radio value="1" size="sm">
                            رایگان
                          </Radio>
                          <Radio value="2" size="sm">
                            تعرفه
                          </Radio>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:gap-4">
                    <div className="relative mt-2 flex justify-start col-span-2">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <Input
                        tabIndex={1}
                        type="text"
                        size="md"
                        label="توضیحات"
                        labelPlacement={"inside"}
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                      ></Input>
                    </div>
                  </div>
                  <div className="relative mt-4  flex justify-start items-start text-right col-span-2">
                    <Checkbox
                      tabIndex={12}
                      size="sm"
                      isSelected={isCertificateBefore}
                      onValueChange={setIsCertificateBefore}
                      radius="md"
                    >
                      دارای گواهی نامه مدرسی آموزش خانواده(در سنوات قبل) می
                      باشم.
                    </Checkbox>
                  </div>
                  <div className="relative my-4  flex justify-start items-start text-right col-span-2">
                    <Checkbox
                      tabIndex={13}
                      size="sm"
                      isSelected={isAccepted}
                      onValueChange={setIsAccepted}
                      radius="md"
                    >
                      دارای مدرک دکتری در آموزش و پرورش و یا عضو هیئت علمی در
                      دانشگاه با رتبه استادیار یا دانشیار یا سطح چهار تخصصی حوزه
                      های علمیه می باشم.{" "}
                    </Checkbox>
                  </div>
                </CardBody>
                <Divider />

                <CardFooter className="flex items-center justify-between">
                  <div className="gap-2  space-y-1 items-start text-[12px] text-right">
                    {error.map((item) => (
                      <Chip
                        className="text-red-500 text-[12px] ml-1 mt-1"
                        endContent={
                          <NotificationIcon
                            className={"text-red-800"}
                            size={12}
                          />
                        }
                      >
                        {item}
                      </Chip>
                    ))}
                  </div>
                  <Button
                    isLoading={isLoading}
                    tabIndex={14}
                    className={`w-48 bg-blue-600  text-white rounded-md text-[12px]`}
                    onClick={() => submitPersonalInfoation(event)}
                  >
                    بروزرسانی اطلاعات{" "}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LecturerPage;
