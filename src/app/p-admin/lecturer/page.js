"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { year } from "@/utils/constants";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";
import transition from "react-element-popper/animations/transition";
import { FcEnteringHeavenAlive } from "react-icons/fc";
import { FaBuildingUser } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa6";
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
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
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
import CountUp from "react-countup";
import { generalCondition, statusTitle } from "@/utils/constants";
import ImageProfileUploader from "@/components/module/uploader/ImageProfileUploader";
const maxFileSize = 1000000; //100KB
const acceptType = "jpg";
function LecturerPage() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [selected, setSelected] = React.useState(0); //? test center selected
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
  const [govermental, setGovermental] = useState(0);
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
  const [ageText, setAgeText] = useState("");

  const [isAccepted, setIsAccepted] = useState(null);
  const [status, setStatus] = useState(0);
  const [degreeDoc, setDegreeDoc] = useState([]);
  const [introDoc, setIntroDoc] = useState([]);
  const [DocProt, setDocProt] = useState([]);
  const [replyProt, setReplyProt] = useState("");
  const [commentProt, setCommentProt] = useState("");
  const [result, setResult] = useState();
  const [certificateDoc, setCertificateDoc] = useState([]);
  const [notCompletePersonalInformation, setNotCompletePersonalInformation] =
    useState(true);

  //? Provinces , Region , Field , Degree
  const [provinces, setProvinces] = useState([]);
  const [regions, setRegions] = useState([]);
  const [fields, setFields] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [testCenter, setTestCenter] = useState([]);
  const [error, setError] = useState([]);

  //? Counter

  const [allCount, setAllCount] = useState(0);
  const [freeCount, setFreeCount] = useState(0);
  const [payCount, setPayCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

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
    getTestCenter();
  }, []);

  useEffect(() => {
    setAllCount(lecturerList?.length);
    setFreeCount(lecturerList.filter((item) => item.payment == 1).length);
    setPayCount(
      lecturerList.filter((item) => item.payment == 2 && item.status == 1)
        .length
    );
    setPendingCount(
      lecturerList.filter((item) => item.payment == 2 && item.status == 4)
        .length
    );
  }, [lecturerList]);

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
      setGovermental(currentLecturer.govermental);
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
      setDocProt(currentLecturer?.DocProt);
      setCommentProt(currentLecturer.commentProt);
      setReplyProt(currentLecturer.replyProt);
    }
  }, [currentLecturer]);

  const getProvinces = async () => {
    try {
      const response = await fetch(`/api/base/province/getall/${1265}`);
      const data = await response.json();

      if (data.status == 200) {
        setProvinces(data.provinces.sort((a, b) => a.code - b.code));
      } else {
        // toast.info(data.message);
      }
    } catch (error) {
      console.error("خطای ناشناخته");
    }
  };
  const getFields = async () => {
    try {
      const response = await fetch(`/api/base/field/getall//${1265}`);
      const data = await response.json();

      if (data.status == 200) {
        setFields(data.fields);
      } else {
        console.info(data.message);
      }
    } catch (error) {
      console.error("خطای ناشناخته");
    }
  };

  const getDegrees = async () => {
    try {
      const response = await fetch(`/api/base/degree/getall//${1265}`);
      const data = await response.json();

      if (data.status == 200) {
        setDegrees(data.degrees);
      } else {
        toast.info(data.message);
      }
    } catch (error) {
      console.error("خطای ناشناخته");
    }
  };

  const getTestCenter = async () => {
    try {
      const response = await fetch(`/api/base/testcenter/getall/${1265}`);
      const data = await response.json();

      if (data.status == 200) {
        setTestCenter(data.testCenter);
      } else {
        toast.info(data.message);
      }
    } catch (error) {
      console.error("خطای ناشناخته");
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
      console.error("خطای ناشناخته");
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

    if (organ == 2 && !govermental) {
      str.push("نوع دانشگاه مشخص شود");
      setNotCompletePersonalInformation(true);
    }
    if (!age) {
      str.push("تاريخ تولد وارد شود");
      setNotCompletePersonalInformation(true);
    }

    // if (age < 30) {
    //   str.push("حداقل شرط سنی رعایت نشده است");
    //   setNotCompletePersonalInformation(true);
    // }

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
        formData.append("govermental", govermental);
        formData.append("isCertificateBefore", isCertificateBefore);
        formData.append("age", age);
        formData.append("isAccepted", isAccepted);
        formData.append("status", status);
        formData.append("payment", payment);
        formData.append("replyProt", replyProt);
        if (DocProt) {
          for (const image of DocProt) {
            formData.append("DocProt", image.file);
          }
        }
        formData.append("comment", commentProt);
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
    // console.log("lecturerList-->", lecturerList);
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
        govermental:
          lc.govermental == 1
            ? "دولتی"
            : lc.typeAcademic == 2
            ? "غیردولتی"
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
        orderId: lc.paymentId?.orderId,
        amount: lc.paymentId?.amount,
        createdAtPay: lc.paymentId?.createdAt
          ? new Date(lc.paymentId?.createdAt).toLocaleString("fa-IR")
          : "",
        retrivalRefNo: lc.paymentId?.retrivalRefNo,
        systemTraceNo: lc.paymentId?.systemTraceNo,
        testcenter: lc.testCenter?.name,
        tcaddress: lc.testCenter?.address,
        tcphone: lc.testCenter?.phone,
        seatCode: lc?.seatCode,
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
        "نوع دانشگاه",
        " استان",
        "منطقه/شهرستان ",
        "مدرک",
        "رشته تحصیلی",
        "گواهی مدرسی از قبل دارد؟ ",
        "تاريخ تولد",
        "تایید ارگان/سازمان توسط کاربر",
        "وضعیت",
        "پرداخت",
        "تاریخ ایجاد",
        "شماره سفارش",
        "مبلغ",
        "تاریخ پرداخت",
        "شماره مرجع تراکنش",
        "شماره پیگیری",
        "نام مرکز آزمون",
        "آدرس مرکز آزمون",
        "تماس مرکز آزمون",
        "شماره صندلی",
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

  const readExcel = (file) => {
    try {
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, {
            type: "buffer",
          });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          resolve(data);
        };
        fileReader.onerror = (error) => {
          toast.error("قالب اکسل بارگذاری شده استاندارد نمی باشد");
          reject(error);
          return false;
        };
      });
      promise.then(async (d) => {
        setIsLoading(true);
        console.log(d);
        setResult(d);
        try {
          if (d.length == 0) {
            toast.info("اکسل براساس فرمت مشخص بارگذاری شود");
            return false;
          }
          const response = await fetch("/api/admin/lecturer/result", {
            method: "POST",
            headers: {
              "content-Type": "application/json",
            },
            body: JSON.stringify([...d]),
          });
          const addResult = await response.json();
          if (addResult.status == 201) {
            toast.success(addResult.message);
          } else {
            toast.error(addResult.message);
          }
        } catch (error) {
          toast.error("خطا ناشناخته");
        }
        setIsLoading(false);
      });
    } catch (error) {
      toast.error("قالب اکسل بارگذاری شده استاندارد نمی باشد");
    }
  };
  function handleChange(value) {
    //تغییرات روی تاریخ رو اینجا اعمال کنید'
    const date = new DateObject(value);
    // console.log("data is --->", date?.format?.("D MMMM YYYY"));

    if (value) {
      // console.log("data --->", "hhhhhhhhddf");
      setAge(date.format());
      setAgeText(date?.format?.("D MMMM YYYY"));
    } else {
      setAge("");
      setAgeText("");
    }
  }

  const setTestCenterToLecturer = (selectedItems) => {
    if (selectedItems.size == 0) {
      toast.info("حداقل یک مورد را انتخاب نمایید");
      return;
    }
    const isUsedTestCenter = testCenter.map((item) => {
      return {
        ...item,
        isUsed: lecturerList.filter((lc) => lc.testCenter?._id == item?._id)
          .length,
      };
    });
    setTestCenter(isUsedTestCenter);
    onOpen();
    // toast.success("ایول");
    // console.log(isUsedTestCenter);
  };

  const mapTestCenterToLecturer = async () => {
    if (selected == 0) {
      toast.info("یکی از مراکز را انتخاب نمایید");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/lecturer/addtotestcenter", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          lecturers: [...selectedKeys],
          testCenter: selected,
        }),
      });
      const data = await response.json();
      if (data.status == 201) {
        toast.success("اطلاعات مرکز آزمون پرسنل بروز شد");
        setIsLoading(false);
        onClose();
        location.reload();
        return;
      }
      toast.error(data.message);
      setIsLoading(false);
    } catch (error) {
      console.log("Error in catch mapTestCenterToLecturer --->", error);
      setIsLoading(false);
    }
  };

  const onChangeDocProt = (imageList, addUpdateIndex) => {
    // data for submit
    if (imageList.length > 1) {
      toast.info("صرفا امکان بارگذاری یک تصویر وجود دارد");
      return;
    }
    setDocProt(imageList);
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
            <Button
              isLoading={isLoading}
              className="flex flex-col items-center justify-center h-24 col-span-1"
              color="primary"
            >
              <span className="text-white  text-2xl">
                {<CountUp start={0} end={allCount}></CountUp>}
              </span>
              <span className="text-white  text-md">کل ثبت نام ها</span>
            </Button>
            <Button
              className="flex flex-col items-center justify-center h-24 col-span-1"
              color="secondary"
            >
              <span className="text-white  text-2xl">
                {<CountUp start={0} end={freeCount}></CountUp>}
              </span>
              <span className="text-white  text-md">مشمول(رایگان)</span>
            </Button>
            <Button
              className="flex flex-col items-center justify-center h-24 col-span-1"
              color="success"
            >
              <span className="text-white  text-2xl">
                {<CountUp start={0} end={payCount}></CountUp>}
              </span>
              <span className="text-white  text-md">پرداختی ها</span>
            </Button>
            <Button
              className="flex flex-col items-center justify-center h-24 col-span-1"
              color="warning"
            >
              <span className="text-white text-2xl">
                {<CountUp start={0} end={pendingCount}></CountUp>}
              </span>
              <span className="text-white text-md">در انتظار پرداخت</span>
            </Button>
          </div>
          <div className="mb-4 p-4 bg-slate-300 rounded-lg flex items-center justify-between">
            <span>لیست ثبت نام مدرسین آموزش خانواده</span>

            <div className="relative flex-center gap-6">
              {/* <span className="text-[12px]">
                                در حال بررسی ({countCurrentAction}) مورد
                            </span> */}
              <Tooltip content="بارگذاری نمرات">
                {/* <span className="cursor-pointer" onClick={() => readExcel()}>
                  <FaUpload className="text-slate-900" />
                </span> */}
                <Button
                  className=""
                  color="primary"
                  endContent={<FaUpload />}
                  isLoading={isLoading}
                >
                  <label for="excel">بارگذاری نمرات</label>
                  <input
                    id="excel"
                    type="file"
                    title=""
                    className="custom-file-input text-white w-full "
                    onChange={(e) => {
                      const file = e.target.files[0];
                      readExcel(file);
                    }}
                  ></input>
                </Button>
                {/* <input
                  id="excel"
                  type="file"
                  title=""
                  className="custom-file-input text-white w-full "
                  onChange={(e) => {
                    const file = e.target.files[0];
                    readExcel(file);
                  }}
                ></input> */}
              </Tooltip>
              <Tooltip content="تخصیص مرکز آزمون">
                <span
                  className="cursor-pointer text-[20px]"
                  onClick={() => setTestCenterToLecturer(selectedKeys)}
                >
                  <FaBuildingUser className="text-slate-900" />
                </span>
              </Tooltip>
              <Tooltip content="دانلود">
                <span
                  className="cursor-pointer"
                  onClick={() => exportToExcel(lecturerList)}
                >
                  <FaDownload className="text-slate-900" />
                </span>
              </Tooltip>
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
            actionType={actionType}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
        </div>

        {actionType == 1 && (
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
                        tabIndex={3}
                        disabled={true}
                        type="text"
                        label="تاريخ تولد"
                        size="md"
                        labelPlacement={"inside"}
                        value={currentLecturer.age}
                      ></Input>
                    </div>
                    {/* <div className="relative mt-2 flex justify-start col-span-1">
                      
                      <Input
                        tabIndex={3}
                        disabled={true}
                        type="number"
                        label="سن"
                        size="md"
                        labelPlacement={"inside"}
                        value={currentLecturer.age}
                      ></Input>
                    </div> */}
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
                      <div className="bg-stone-100 rounded-lg w-full items-start justify-start text-right">
                        <RadioGroup
                          tabIndex={5}
                          isDisabled={true}
                          className="flex-1 justify-start items-start p-2 text-[14px] text-right"
                          label="سازمان محل خدمت"
                          orientation="horizontal"
                          value={currentLecturer.organ + ""}
                        >
                          <Radio value="1" size="sm">
                            آموزش و پرورش
                          </Radio>
                          <Radio value="2" size="sm">
                            عضو هیات علمی دانشگاه
                          </Radio>
                          <Radio value="3" size="sm">
                            حوزه علمیه
                          </Radio>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                  {currentLecturer.organ == 1 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
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
                    </div>
                  ) : currentLecturer.organ == 2 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
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
                      <div className=" relative mt-2 flex justify-start col-span-1 ">
                        <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                          <RadioGroup
                            tabIndex={7}
                            isDisabled={true}
                            className="flex-1 justify-start items-start p-2 text-[14px]"
                            label="نوع دانشگاه"
                            orientation="horizontal"
                            value={currentLecturer.govermental + ""}
                          >
                            <Radio value="1" size="sm">
                              دولتي
                            </Radio>
                            <Radio value="2" size="sm">
                              غيردولتي
                            </Radio>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
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

        {actionType == 2 && (
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
                    <div className="z-30 relative mt-2 flex flex-col justify-start items-center col-span-1 bg-gray-100 rounded-md  ">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <div className="flex items-center justify-start w-full">
                        <span className="mr-2 mt-2 text-[14px] text-gray-600 ">
                          تاریخ تولد
                        </span>
                        <span className="mr-2 mt-2 text-[10px] text-gray-400">
                          (متولدین قبل 13730701)
                        </span>
                      </div>
                      <div tabIndex={3}>
                        <DatePicker
                          type="false"
                          dateSeparator="-"
                          title="انتخاب کنید"
                          zIndex={100}
                          style={{
                            backgroundColor: "aliceblue",
                            height: "24px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            padding: "3px 10px",
                          }}
                          // containerStyle={{
                          //     width: "70%"
                          // }}
                          className="teal rmdp-prime"
                          fixMainPosition="bottom"
                          maxDate={"1373/07/01"}
                          minDate={"1320/07/01"}
                          currentDate={"1373/07/01"}
                          showOtherDays
                          calendar={persian}
                          locale={persian_fa}
                          calendarPosition="bottom-right"
                          value={age || "1373/07/01"}
                          onChange={handleChange}
                        />
                        <span className="mr-2 text-[10px]">{ageText}</span>
                      </div>
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
                            عضو هیات علمی دانشگاه
                          </Radio>
                          <Radio value="3" size="sm">
                            حوزه علمیه
                          </Radio>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                  {organ == 1 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
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
                    </div>
                  ) : organ == 2 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2  md:gap-4">
                      <div className=" relative mt-2 flex justify-start col-span-1 ">
                        <div className="bg-stone-100 rounded-lg w-full items-start justify-start text-right">
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
                      <div className=" relative mt-2 flex justify-start col-span-1 ">
                        <div className="bg-stone-100 rounded-lg w-full items-start justify-start ">
                          <RadioGroup
                            tabIndex={7}
                            className="flex-1 justify-start items-start p-2 text-[14px] text-right"
                            label="رتبه دانشگاهی"
                            orientation="horizontal"
                            value={govermental + ""}
                            onValueChange={setGovermental}
                          >
                            <Radio value="1" size="sm">
                              دولتي
                            </Radio>
                            <Radio value="2" size="sm">
                              غيردولتي
                            </Radio>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  ) : null}
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
                          {statusTitle.map((item) => (
                            <Radio value={item.status + ""} size="sm">
                              {item.title}
                            </Radio>
                          ))}
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
                        label="توضیحات کاربر "
                        labelPlacement={"inside"}
                        value={commentProt}
                        onChange={(event) => setCommentProt(event.target.value)}
                      ></Input>
                    </div>
                  </div>
                  <div className="flex items-center md:gap-4 mt-4 border-1 border-red-100 p-2 h-28">
                    <div className="relative mt-2 flex-1 justify-start ">
                      {/* <span className='text-[10px] absolute bg-slate-200 p-1 rounded-md left-2  w-24  '>نام و نام خانوادگی</span> */}
                      <Input
                        tabIndex={1}
                        type="text"
                        size="md"
                        label="پاسخ به اعتراض"
                        labelPlacement={"inside"}
                        value={replyProt}
                        onChange={(event) => setReplyProt(event.target.value)}
                      ></Input>
                    </div>
                    <div className="">
                      {/* <span>بارگذاری تصویر کارنامه</span> */}
                      <ImageProfileUploader
                        imageItems={DocProt}
                        onChange={onChangeDocProt}
                        maxNumber={1}
                        acceptType={acceptType}
                        maxFileSize={maxFileSize}
                        // user={user}
                      />
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
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          body: "py-6 bg-white",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-slate-500 text-black",
          header: " border-[#292f46] text-white  bg-primary_color ",
          footer: " border-[#292f46] bg-white",
          closeButton: "hover:bg-white/5 active:bg-white/10 ",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col justify-between items-start ">
                انتخاب مرکز آزمون
              </ModalHeader>
              <ModalBody>
                <RadioGroup
                  label="مرکز آزمون مورد نظر را انتخاب نمایید"
                  color="warning"
                  value={selected}
                  onValueChange={setSelected}
                  className="text-[14px]"
                >
                  {testCenter?.map((item) => {
                    return (
                      <Radio
                        className="mt-2"
                        value={item._id}
                        description={`${item.address} - ظرفیت ${item.capacity} (${item?.isUsed})`}
                      >
                        <span
                          className={
                            item.gender == 1 ? " text-blue-500" : "text-red-500"
                          }
                        >
                          {item.name} -{" "}
                          {item.gender == 1 ? " آقایان " : " خانم ها"}
                        </span>
                      </Radio>
                    );
                  })}
                  <Radio value={null} description={"تعیین نشده است"}>
                    بدون مرکز
                  </Radio>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="foreground" variant="light" onPress={onClose}>
                  بستن
                </Button>
                <Button
                  isLoading={isLoading}
                  onClick={mapTestCenterToLecturer}
                  color="success"
                  variant="light"
                >
                  اختصاص مرکز
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default LecturerPage;
