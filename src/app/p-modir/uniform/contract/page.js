"use client";

import Image from "next/image";
import ImageUploading from "react-images-uploading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useUserProvider } from "@/components/context/UserProvider";
import { year } from "@/utils/constants";
import { GrMap } from "react-icons/gr";
import { FaRectangleList } from "react-icons/fa6";
import { FaCloudDownloadAlt } from "react-icons/fa";
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
  Link,
  Checkbox,
} from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import ComboSearch from "@/components/module/ComboSearch";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import PriceListContract from "@/components/module/pricelist/PriceListContract";
const Map = dynamic(() => import("@/components/module/Map"), { ssr: false });

import { CiCircleRemove } from "react-icons/ci";
import { GiCheckMark } from "react-icons/gi";
import ImageUploader from "@/components/module/uploader/ImageUploader";
import PriceList from "@/models/company/pricelist";
import ContractList from "@/components/module/contrct/ContractList";
import { useRouter } from "next/navigation";
import { TableBody, TableHeader } from "react-stately";
import { IoIosArrowUp } from "react-icons/io";
import { FaMinus } from "react-icons/fa";
import { traverse } from "@/utils/convertnumtopersian";
import { PlusIcon } from "@/utils/icon";
import ImageLoader from "@/components/module/contrct/ImageLoader";
function page() {
  const [images, setImages] = useState([]);
  const maxNumberContract = 2;
  const maxNumberFormDress = 4;
  const maxFileSize = 100000; //100KB
  const acceptType = "jpg";
  let filterUnit = [];
  const { user, setUser, modir, setModir, units, setUnits } = useUserProvider();

  let sumOfQuntity = 0,
    sumOfPrice = 0,
    sumOfContractPrice = 0;
  const currentYear = year.find((y) => y.currentYear);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [showDetail, setShowDetail] = useState(false);
  const [showDetailContractItem, setShowDetailContractItem] = useState(false);
  const [isShowPricelist, setIsShowPricelist] = useState(false);
  const [isShowImageContract, setIsShowImageContract] = useState(false);
  const [isShowImageFormDress, setIsShowImageFormDress] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear.name);
  const [filterUnits, setFilterUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [currentUnit, setCurrentUnit] = useState({});
  const [currentCompany, setCurrentCompany] = useState({});
  const [fetchCompany, setFetchCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(fetchCompany[0]);
  const [selectedPricelist, setSelectedPricelist] = useState([]);
  const [lng, setLng] = useState(selectedCompany?.lng || "59.60649396574567");
  const [lat, setLat] = useState(selectedCompany?.lat || "36.29779692242873");
  const [address, setAddress] = useState(null);
  const [confirmAddress, setConfirmAddress] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [imageContractList, setImageContractList] = useState([]);
  const [imageFormDressList, setImageFormDressList] = useState([]);
  const [imageContractUrls, setImageContractUrls] = useState([]);
  const [imageFormDressUrls, setImageFormDressUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowNewContract, setIsShowNewContract] = useState(false);
  const [contractlist, setContractlist] = useState([]);
  const [isLoadingContractList, setIsLoadingContractList] = useState(false);
  const [currenContract, setCurrenContract] = useState({});
  const [countContract, setCountContract] = useState(1); //? تعداد قراردادهای در حال بررسی و یا تایید شده واحد سازمانی در سال تحصیلی انتخابی
  const [limited, setLimited] = useState(1); //? برای همه قرارداد های هر واحد سازمانی - سال تحصیلی یکسان است
  const [forbidden, setForbidden] = useState(false); //? امکان درخواست قرارداد جدید دارد یا خیر؟
  const [imageContractUplaoded, setImageContractUplaoded] = useState(null);
  const [imageFormDressUplaoded, setImageFormDressUplaoded] = useState(null);
  const [isShowNoContract, setIsShowNoContract] = useState(false);
  const [isNoContract, setIsNoContract] = useState(false);
  const [isAlarmNoContract, setIsAlarmNoContract] = useState(false);
  const [isCheckedNoContract, setIsCheckedNoContract] = useState(false);
  const [isClient, setIsClient] = useState(false);

  if (isClient) {
    // Check if document is finally loaded
    traverse(document.getElementsByTagName("body")[0]);
    // localizeNumbers(document.getElementsByTagName('body')[0]);
  }

  useEffect(() => {
    setIsClient(true);
    // traverse(document.getElementsByTagName('body')[0]);
  }, [
    isNoContract,
    isShowNewContract,
    isShowPricelist,
    showDetail,
    showDetailContractItem,
  ]);

  useEffect(() => {
    setIsLoadingContractList(true);
    const getContract = async () => {
      const filterUnit = units.filter((u) => u.isConfirm == 1);
      let urlUnits = "";
      for (const unit of filterUnit) {
        urlUnits += `/${unit.schoolCode}`;
      }
      try {
        const response = await fetch(
          `/api/modir/contract/getperunit${urlUnits}`
        );
        const data = await response.json();
        if (data.status == 201) {
          toast.success(data.message);
          const newlist = [...data.contractlist];
          // setContractlist(newlist);
          const viewContractlist = newlist.map((cl) => {
            return {
              ...cl,
              companyname:
                cl.isConfirm == 10 ? "فاقد قرارداد" : cl?.company.name,
              unitname: cl.Unit.schoolName,
              createdAt: new Date(cl.createdAt).toLocaleString("fa-IR"),
            };
          });

          setContractlist([...viewContractlist]);
        } else {
          toast.info(data.message);
        }

        setIsLoadingContractList(false);
      } catch (error) {
        console.log("Error in get contract --->", error);
        setIsLoadingContractList(false);
      }
    };
    setIsLoadingContractList(true);
    getContract();
  }, []);

  useEffect(() => {
    const unit = filterUnits.find(
      (u) =>
        (u.year == year[selectedYear - 1].name) & (u.schoolCode == selectedUnit)
    );
    setLat(unit?.lat);
    setLng(unit?.lng);
    setCurrentUnit(unit);
    setCurrentCompany(fetchCompany.find((c) => c.code == selectedCompany));
  }, [selectedUnit]);

  useEffect(() => {
    const newList = [...contractlist];
    const filterContract = newList.filter(
      (item) =>
        item.year == year[selectedYear - 1]?.name &&
        item.Unit.schoolCode == selectedUnit &&
        (item.isConfirm == 1 || item.isConfirm == 0 || item.isConfirm == 10)
      //? isConfirm =10 => مدارسی  که فاقد قرارداد در سامانه ثبت کرده اند
    );
    const countLimit = filterContract[0]?.limited;
    const count = filterContract.length;
    let isForbidden = false;
    if (count >= countLimit) {
      isForbidden = true;
      toast.info(
        `این واحد سازمانی حداکثر می تواند ${countLimit} قرارداد با وضعیت در حال بررسی یا تایید شده داشته باشد`
      );
      setIsShowNewContract(false);
      setIsShowNoContract(false);
    } else {
      isForbidden = false;
    }
    setForbidden(isForbidden);
  }, [selectedUnit]);

  useEffect(() => {
    setCurrentCompany(fetchCompany.find((c) => c.code == selectedCompany));
  }, [selectedCompany]);

  // const getForbidden = (contractlist) => {
  //   const newList = [...contractlist];
  //   const filterContract = newList.filter(
  //     (item) =>
  //       item.year == year[selectedYear - 1]?.name &&
  //       item.Unit.schoolCode == selectedUnit &&
  //       (item.isConfirm == 1 || item.isConfirm == 0)
  //   );

  //   const count = filterContract;
  //   const countLimit = filterContract[0]?.limited;
  //   setCountContract(count);
  //   setLimited(countLimit);
  //   console.log("forbidden-->", filterContract);
  //   console.log("forbidden-->", limited);
  //   if (countContract > limited) {
  //     setForbidden(true);
  //   } else setForbidden(false);
  // };
  // console.log("imageFormDressList--->", imageFormDressList);
  const addNoContract = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (
      contractlist.find(
        (cl) =>
          cl.Unit.schoolCode == currentUnit.schoolCode &&
          cl.year == year[selectedYear - 1].name &&
          (cl.isConfirm == 0 || cl.isConfirm == 1 || cl.isConfirm == 10)
      )
    ) {
      toast.info(
        "شما قراردادی با وضعیت جاری تایید شده/ در حال بررسی یا فاقد قرارداد دارید"
      );
      setIsShowNoContract(false);
      setIsAlarmNoContract(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("year", year[selectedYear - 1].name);
      formData.append("Unit", JSON.stringify(currentUnit));
      formData.append("modir", JSON.stringify(modir));
      const res = await fetch("/api/modir/contract/add/nocontract", {
        method: "POST",
        header: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const data = await res.json();
      if (data.status == 201) {
        toast.success(data.message);
        setIsShowNoContract(false);
        setIsAlarmNoContract(false);
      } else {
        toast.error(data.message);
      }

      location.reload();
    } catch (error) {
      console.log("error in catch add no contract -> ", error);
      toast.error("خطای ناشناخته");
    }
    setIsLoading(false);
  };

  const addContract = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      // formData.append("name", name);
      for (const image of imageContractList) {
        formData.append("imageContractList", image.file);
      }

      for (const image of imageFormDressList) {
        formData.append("imageFormDressList", image.file);
      }

      //?  liara uploader
      // for (const url of imageContractUrls) {
      //   formData.append("imageContractUrls", url);
      // }

      // for (const url of imageFormDressUrls) {
      //   formData.append("imageFormDressUrls", url);
      // }

      for (const item of selectedPricelist) {
        formData.append("pricelist", JSON.stringify(item));
      }

      formData.append("address", address);
      formData.append("lat", lat);
      formData.append("lng", lng);
      formData.append("year", year[selectedYear - 1].name);
      formData.append("Unit", JSON.stringify(currentUnit));
      formData.append("modir", JSON.stringify(modir));
      formData.append("company", JSON.stringify(currentCompany._id));

      const res = await fetch("/api/modir/contract/add", {
        method: "POST",
        header: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const data = await res.json();
      if (data.status == 201) {
        setSelectedYear(1);
        setSelectedUnit({});
        setShowDetail(false);
        setFetchCompany([]);
        setFilterUnits([]);
        setSelectedCompany([]);
        setSelectedPricelist([]);
        setIsShowNewContract(false);
        toast.success(data.message);
        location.reload();
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error in add contract -->", error);
      setIsLoading(false);
    }
  };

  const addDressImage = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      // formData.append("name", name);
      for (const image of imageFormDressList) {
        formData.append("images", image.file);
      }
      const res = await fetch("/api/modir/contract/add", {
        method: "POST",
        header: { "Content-Type": "multipart/form-data" },
        body: formData,
      });

      // console.log(await res.json());
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeContract = (imageList, addUpdateIndex) => {
    // data for submit
    if (imageList.length > 1) {
      toast.info("حداکثر 2 تصویر قابل بارگذاری می باشد");
    }
    setImageContractList(imageList);
  };

  const onChangeFormDress = (imageList, addUpdateIndex) => {
    // data for submit
    if (imageList.length > 3) {
      toast.info("حداکثر 4 تصویر قابل بارگذاری می باشد");
    }
    setImageFormDressList(imageList);
  };

  const getCompany = async (key) => {
    setFetchCompany([]);
    try {
      const findUnit = filterUnits?.find((item) => item.schoolCode == key);
      const response = await fetch(
        `/api/modir/regcompany/getcompanybyregid/${findUnit.regionCode}/${
          year[selectedYear - 1].name
        }`
      );
      const data = await response.json();

      if (data.status == 201) {
        setFetchCompany(data.findCompany.companies);
        console.log("Fetch Company--->", fetchCompany);
      } else {
        // toast.info(data.message);
        setFetchCompany([]);
      }
    } catch (error) {
      console.log("Error in get company in contract --->", error);
      toast.error("شرکتی یافت نشد");
    }
  };
  const setLocationgiveDress = (event) => {
    event.preventDefault();
    const unit = filterUnits.find(
      (u) =>
        (u.year == year[selectedYear - 1].name) & (u.schoolCode == selectedUnit)
    );
    setLat(unit.lat);
    setLng(unit.lng);
    setCurrentUnit(unit);
    onOpen();
  };

  const seePriceList = () => {
    setIsShowPricelist((prev) => !prev);
    setIsShowImageContract(false);
    setIsShowImageFormDress(false);
  };

  // useEffect(() => {
  //   getAddress();
  // }, [lat]);

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

  return (
    <>
      <ToastContainer
        bodyClassName={() =>
          " flex-center text-sm font-white font-iranyekan p-3"
        }
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

      <div className="p-4 bg-slate-200 rounded-lg">
        <div className=" p-4 bg-slate-300 rounded-lg flex items-center justify-between">
          <span
            className=" flex font-iranyekanBold cursor-pointer"
            onClick={() => {
              setIsShowNoContract(false);
              setIsShowNewContract(false);
            }}
          >
            لیست قراردادها
          </span>
          <div className="flex-center">
            <Button
              className="bg-red-500 text-white font-iranyekan text-[14px]"
              endContent={<FaMinus />}
              onClick={() => {
                setShowDetailContractItem(false);
                setIsShowNewContract(false);
                setIsShowNoContract((prev) => !prev);
                setIsAlarmNoContract(false);
              }}
            >
              <span className="hidden md:flex">فاقد قرارداد</span>
            </Button>
            <Button
              className="bg-blue-500 text-white font-iranyekan text-[14px] mr-4"
              endContent={<PlusIcon />}
              onClick={() => {
                setShowDetailContractItem(false);
                setIsShowNewContract((prev) => !prev);
                setIsAlarmNoContract(false);
                setIsShowNoContract(false);
              }}
            >
              <span className="hidden md:flex">قرارداد جدید</span>
            </Button>
          </div>
        </div>
        {!isShowNewContract && !isShowNoContract && (
          <div className="mt-4">
            <ContractList
              contractlist={contractlist}
              setContractlist={setContractlist}
              isLoadingContractList={isLoadingContractList}
              currenContract={currenContract}
              setCurrenContract={setCurrenContract}
              setShowDetailContractItem={setShowDetailContractItem}
              setIsShowNewContract={setIsShowNewContract}
            />
          </div>
        )}
      </div>

      {isShowNewContract && (
        <div className="p-4 bg-slate-200 rounded-lg mt-4">
          <div className="mb-4 p-4 bg-slate-300 rounded-lg flex items-center justify-between">
            <span className=" flex text-bold font-iranyekanBold">
              قرارداد جدید
            </span>
          </div>
          <div>
            <div className="col-span-2 px-4 ">
              <div>
                <span className="text-gray-900 mb-4 block">
                  {" "}
                  ابتدا مقادیر زیر را مشخص نمایید :{" "}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-[12px] mb-4">
                  {/* //* Year selection */}
                  <Autocomplete
                    labelPlacement={"outside"}
                    color="default"
                    backdrop="blur"
                    isRequired
                    className="max-w-xs w-full col-span-1"
                    label="سال تحصیلی"
                    defaultItems={year}
                    selectedKey={selectedYear}
                    onSelectionChange={(key) => {
                      setShowDetail(false);
                      setSelectedYear(key);
                      setFilterUnits(
                        units?.filter(
                          (item) =>
                            item.year == year[key - 1]?.name &&
                            item.isConfirm == 1
                        )
                      );
                      setSelectedUnit([]);
                      setSelectedCompany([]);
                    }}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.id}>
                        {item.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>

                  {/* //* Unit Selected */}
                  <Autocomplete
                    labelPlacement={"outside"}
                    backdrop="blur"
                    isRequired
                    color="default"
                    label="جستجو در واحد سازمانی"
                    className="max-w-xs col-span-1"
                    defaultItems={filterUnits}
                    selectedKey={selectedUnit}
                    onSelectionChange={(key) => {
                      setSelectedUnit(key);
                      setShowDetail(false);
                      getCompany(key);
                    }}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.schoolCode}>
                        {item.schoolName}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>

                  {/* //* Company Selected */}
                  <ComboSearch
                    companies={fetchCompany}
                    selected={selectedCompany}
                    setSelected={setSelectedCompany}
                    setShowDetail={setShowDetail}
                  />
                </div>
              </div>

              {showDetail && (
                <div>
                  <div className="flex gap-4 mt-4"></div>
                  <div>
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
                              <TableColumn>
                                توضیحات و مستندات مورد نیاز
                              </TableColumn>
                            </TableHeader>
                            <TableBody className=" text-[14px]">
                              <TableRow key="1">
                                <TableCell>سال تحصیلی</TableCell>
                                <TableCell>
                                  {year[selectedYear - 1].name}
                                </TableCell>
                              </TableRow>
                              <TableRow key="2">
                                <TableCell>واحد سازمانی</TableCell>
                                <TableCell>
                                  {" "}
                                  {currentUnit.schoolName} (
                                  {currentUnit.schoolCode})
                                </TableCell>
                              </TableRow>
                              <TableRow key="3">
                                <TableCell>شرکت طرف قرارداد</TableCell>
                                <TableCell> {currentCompany?.name}</TableCell>
                              </TableRow>
                              <TableRow key="4">
                                <TableCell>آدرس شرکت طرف قرارداد</TableCell>
                                <TableCell>{currentCompany?.address}</TableCell>
                              </TableRow>
                              <TableRow key="5">
                                <TableCell>ظرفیت تولید شرکت</TableCell>
                                <TableCell>
                                  {currentCompany?.capacity} (
                                  {currentCompany?.capacity >
                                  currentCompany?.isUsed ? (
                                    <span className="text-blue-500 text-[12px]">{`سفارشات تایید شده تا کنون  ${currentCompany?.isUsed} دست `}</span>
                                  ) : (
                                    <span className="text-red-500 text-[12px]">{`سفارشات تایید شده تا کنون  ${currentCompany?.isUsed} دست `}</span>
                                  )}
                                  )
                                </TableCell>
                              </TableRow>
                              <TableRow key="6">
                                <TableCell>آدرس محل توزیع</TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-between">
                                    {" "}
                                    {address ? (
                                      address
                                    ) : (
                                      <>
                                        <span className="text-red-500">
                                          {" "}
                                          ثبت نشده
                                        </span>
                                      </>
                                    )}
                                    <Tooltip
                                      showArrow={true}
                                      color="primary"
                                      content="مشاهده نقشه و تعیین آدرس"
                                    >
                                      <Button className="bg-transparent">
                                        <GrMap
                                          className="text-lg text-blue-500 cursor-pointer"
                                          onClick={(event) =>
                                            setLocationgiveDress(event)
                                          }
                                        />
                                      </Button>
                                    </Tooltip>
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow key="7">
                                <TableCell>
                                  <div>تصاویر بارگذاری شده از قرارداد</div>
                                  <div className="text-[10px] text-red-400">
                                    حداکثر دو تصویر با حجم 100 کیلوبایت
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="gap-2">
                                    <ImageUploader
                                      imageItems={imageContractList}
                                      onChange={onChangeContract}
                                      maxNumber={maxNumberContract}
                                      acceptType={acceptType}
                                      maxFileSize={maxFileSize}
                                      user={user}
                                      //?Liara
                                      // setImageUrls={setImageContractUrls}
                                      // imageUrlList={imageContractUrls}
                                      // uploadServerHandler={addContractImage}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow key="8">
                                <TableCell>
                                  <div> تصاویر بارگذاری شده از لباس فرم</div>
                                  <div className="text-[10px] text-red-400">
                                    حداکثر چهار تصویر با حجم 100 کیلوبایت
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="gap-2">
                                    <ImageUploader
                                      imageItems={imageFormDressList}
                                      onChange={onChangeFormDress}
                                      maxNumber={maxNumberFormDress}
                                      acceptType={acceptType}
                                      maxFileSize={maxFileSize}
                                      uploadServerHandler={addDressImage}
                                      user={user}
                                      //? liara
                                      // setImageUrls={setImageFormDressUrls}
                                      // imageUrlList={imageFormDressUrls}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow key="9">
                                <TableCell>محصولات انتخاب شده</TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-between">
                                    <span className="grid grid-cols-1 gap-2">
                                      {selectedPricelist.length == 0 ? (
                                        <span className="text-red-500">
                                          {" "}
                                          انتخاب نشده
                                        </span>
                                      ) : (
                                        selectedPricelist.map((pr) => {
                                          sumOfQuntity += Number(pr.quantity);
                                          sumOfPrice += pr.quantity * pr.price;
                                          sumOfContractPrice +=
                                            pr.quantity * pr.priceInContract;
                                          return (
                                            <div className="  col-span-1 flex-center justify-between bg-slate-200 rounded-md mx-2">
                                              <span className=" mx-2 p-2 ">
                                                {pr.type} &#x2022; {pr.material}{" "}
                                                &#x2022; سایز :{pr.size}
                                                &#x2022;{" "}
                                                <span className=" text-blue-400 underline">
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
                                                    pr.priceInContract >
                                                    pr.price
                                                      ? "text-red-400 underline"
                                                      : "text-green-500 underline"
                                                  }
                                                >
                                                  قیمت کل قرارداد :{" "}
                                                  {(
                                                    pr.quantity *
                                                    pr.priceInContract
                                                  ).toLocaleString()}
                                                </span>
                                              </span>
                                              <div
                                                className="flex"
                                                onClick={() => {
                                                  setSelectedPricelist(
                                                    selectedPricelist.filter(
                                                      (p) => p.code != pr.code
                                                    )
                                                  );
                                                }}
                                              >
                                                <CiCircleRemove className="text-red-600 mx-2 cursor-pointer" />
                                              </div>
                                            </div>
                                          );
                                        })
                                      )}
                                    </span>
                                    {/* <AiFillProduct /> */}
                                    <div className="relative flex items-center gap-2">
                                      <Tooltip
                                        showArrow={true}
                                        color="primary"
                                        content={
                                          !isShowPricelist
                                            ? " مشاهده لیست محصولات"
                                            : "مخفی نمودن لیست"
                                        }
                                      >
                                        <Button className="bg-transparent">
                                          <FaRectangleList
                                            className={`${
                                              !isShowPricelist
                                                ? "text-lg text-blue-500 cursor-pointer"
                                                : "text-lg text-gray-500 cursor-pointer"
                                            }`}
                                            onClick={(event) =>
                                              seePriceList(event)
                                            }
                                          />
                                        </Button>
                                      </Tooltip>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>

                              <TableRow key="10" className="disabled:true">
                                <TableCell className="hidden">""</TableCell>
                                <TableCell colSpan={2}>
                                  <div className="my-4">
                                    {isShowPricelist ? (
                                      <div>
                                        <div className="mb-4  flex items-center justify-between">
                                          <p className="text-blue-400">
                                            از لیست زیر محصول مورد نظر را انتخاب
                                            و تعداد را وارد نمایید
                                          </p>
                                          <p
                                            className="text-gray-500 text-[12px] flex justify-between items-center cursor-pointer"
                                            onClick={() =>
                                              setIsShowPricelist(false)
                                            }
                                          >
                                            برای مخفی شدن لیست کلیک نمایید
                                            <span className="mr-4 text-[14px] font-extrabold cursor-pointer">
                                              <IoIosArrowUp />
                                            </span>
                                          </p>
                                        </div>
                                        <PriceListContract
                                          selectedYear={selectedYear}
                                          selectedUnit={filterUnits.find(
                                            (item) =>
                                              item.schoolCode == selectedUnit
                                          )}
                                          setSelectedPricelist={
                                            setSelectedPricelist
                                          }
                                          selectedPricelist={selectedPricelist}
                                        />
                                      </div>
                                    ) : (
                                      <div className="mt-2">
                                        <p className="text-gray-800 text-[12px]">
                                          {`کل اقلام انتخاب شده برابر ${sumOfQuntity} عدد به ارزش ${sumOfPrice.toLocaleString()} ریال (براساس قیمت مصوب) و ${sumOfContractPrice.toLocaleString()}  ریال(براساس قیمت مندرج در قرارداد) می باشد.`}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>

                              <TableRow key="11">
                                <TableCell aria-colspan={2} colSpan={2}>
                                  <div className="w-full flex items-end justify-end ">
                                    {
                                      <Button
                                        className={
                                          "bg-green-500 text-white cursor-pointer "
                                        }
                                        isDisabled={
                                          !year[selectedYear - 1].name ||
                                          !currentCompany ||
                                          !currentUnit ||
                                          !imageContractList?.length != 0 ||
                                          !imageFormDressList?.length != 0 ||
                                          !address ||
                                          !selectedPricelist?.length != 0
                                        }
                                        // !imageContractUrls?.length != 0 ||
                                        // !imageFormDressUrls?.length != 0 ||
                                        isLoading={isLoading}
                                        onClick={(e) => addContract(e)}
                                      >
                                        تایید نهایی
                                      </Button>
                                    }
                                  </div>
                                </TableCell>
                                <TableCell className="hidden"> </TableCell>
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
          </div>
        </div>
      )}
      {isShowNoContract && (
        <div className="p-4 bg-slate-200 rounded-lg mt-4">
          <div className="mb-4 p-4 bg-slate-300 rounded-lg flex items-center justify-between">
            <span className=" flex text-bold font-iranyekanBold">
              عدم توافق با شرکت
            </span>
          </div>
          <div>
            <div className="col-span-2 px-4 ">
              <div>
                <span className="text-gray-900 mb-4 block">
                  {" "}
                  ابتدا مقادیر زیر را مشخص نمایید :{" "}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-[12px] mb-4 px-8">
                  {/* //* Year selection */}
                  <Autocomplete
                    labelPlacement={"outside"}
                    color="default"
                    backdrop="blur"
                    isRequired
                    className="max-w-xs w-full col-span-1"
                    label="سال تحصیلی"
                    defaultItems={year}
                    selectedKey={selectedYear}
                    onSelectionChange={(key) => {
                      setShowDetail(false);
                      setSelectedYear(key);
                      setFilterUnits(
                        units?.filter(
                          (item) =>
                            item.year == year[key - 1]?.name &&
                            item.isConfirm == 1
                        )
                      );
                      setSelectedUnit([]);
                      setSelectedCompany([]);
                    }}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.id}>
                        {item.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>

                  {/* //* Unit Selected */}
                  <Autocomplete
                    labelPlacement={"outside"}
                    backdrop="blur"
                    isRequired
                    color="default"
                    label="جستجو در واحد سازمانی"
                    className="max-w-xs col-span-1"
                    defaultItems={filterUnits}
                    selectedKey={selectedUnit}
                    onSelectionChange={(key) => {
                      setSelectedUnit(key);
                      setShowDetail(false);
                      setIsAlarmNoContract(true);
                      setIsCheckedNoContract(false);
                    }}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.schoolCode}>
                        {item.schoolName}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
                {isAlarmNoContract && (
                  <div className="grid grid-cols-1 md:grid-cols-2  mt-6 justify-between items-center">
                    <p className="col-span-1">
                      <Checkbox
                        defaultChecked={false}
                        color="danger"
                        value={isCheckedNoContract}
                        onChange={(e) =>
                          setIsCheckedNoContract((prev) => !prev)
                        }
                      >
                        {`این واحد سازمانی در سال تحصیلی 
                      ${
                        year[selectedYear - 1]?.name
                      } با هیچ شرکتی قرارداد ندارد.`}
                      </Checkbox>
                      <div className="mt-2">
                        <span className="text-[12px] font-iranyekanMedium text-red-500">
                          اخطار!
                        </span>
                        &nbsp;&nbsp;
                        <span className="text-[12px]  font-iranyekan ">
                          هرگونه هدایت دانش آموز خارج از چارچوب تعیین شده
                          مسئولیت هایی را برای مدیران در پی خواهد داشت.
                        </span>
                      </div>
                    </p>
                    <div className="col-span-1 flex items-end justify-end md:mt-4">
                      <Button
                        type="button"
                        className="bg-blue-500 text-[12px] cursor-pointer text-white disabled:bg-gray-400 "
                        isDisabled={!isCheckedNoContract}
                        isLoading={isLoading}
                        onClick={(e) => addNoContract(e)}
                      >
                        تایید
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailContractItem && (
        <div className="p-4 bg-slate-200 rounded-lg mt-4">
          <div className="mb-4 p-4 bg-slate-300 rounded-lg flex items-center justify-between">
            <span className=" flex text-bold font-iranyekanBold">{`جزییات قرارداد شماره ${currenContract.code}`}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="col-span-2  ">
              <div>
                <div className="flex gap-4 mt-4"></div>
                <div>
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
                            <TableColumn>
                              توضیحات و مستندات مورد نیاز
                            </TableColumn>
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
                              <TableCell>
                                {" "}
                                {currenContract?.company.name}
                              </TableCell>
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
                            <TableRow key="6">
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

                            <TableRow key="7">
                              <TableCell>
                                تصاویر بارگذاری شده از قرارداد
                              </TableCell>
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
                              <TableCell>
                                تصاویر بارگذاری شده از لباس فرم
                              </TableCell>
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
                                                  pr.quantity *
                                                  pr.priceInContract
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

                            <TableRow key="10">
                              <TableCell>توضیحات کارشناس</TableCell>
                              <TableCell>
                                {currenContract?.isConfirm == 1 ? (
                                  <span className="text-green-500">
                                    {currenContract?.description}
                                  </span>
                                ) : (
                                  <span className="text-red-500">
                                    {currenContract?.description}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-iranyekanMedium text-md">
                تعیین موقعیت توزیع بر روی نقشه
              </ModalHeader>
              <ModalBody className="font-iranyekan">
                {
                  <div>
                    <form>
                      <div className="relative mt-2 flex justify-end col-span-1">
                        <div className="flex flex-col  w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              label="آدرس"
                              value={address}
                              onChange={() => setAddress(event.target.value)}
                            />
                          </div>
                          <div className="flex gap-2 ">
                            <input
                              className={`input-text-information mt-2 text-white `}
                              name="maleno"
                              type="text"
                              disabled
                              value={`${Number(lng).toFixed(5)} , ${Number(
                                lat
                              ).toFixed(5)} `}
                              placeholder="موقعیت جغرافیایی"
                            ></input>
                          </div>

                          <div className="w-full  mt-4 rounded-md bg-green-600 z-10 ">
                            <Map
                              setLat={setLat}
                              setLng={setLng}
                              lng={lng}
                              lat={lat}
                              setAddress={setAddress}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                }
              </ModalBody>
              <ModalFooter className="font-iranyekan">
                <Button color="foreground" variant="light" onPress={onClose}>
                  بستن
                </Button>
                <Button
                  className="bg-green-700 text-white"
                  color="success"
                  variant="light"
                  onClick={() => {
                    // getAddress();
                    if (address == "") {
                      toast.error(
                        "خطا در سروویس دریافت آدرس / آدرس را وارد نمایید."
                      );
                    } else {
                      setConfirmAddress(true);
                      toast.success("آدرس با موفقیت ذخیره شد");
                    }
                    onClose();
                  }}
                >
                  ثبت
                  {/* <div className="flex-center">{false && <Spinner />}</div> */}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default page;
