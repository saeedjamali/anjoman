import React, { forwardRef } from "react";

const PrintableComponent = forwardRef((props, ref,prs) => {
  return (
    <div ref={ref} style={{ padding: "20px", textAlign: "center" }}>
      <div className="overflow-auto scroll-auto max-h-[450px] bg-sky-100">
        <div dir="rtl" className=" bg-white min-h-[450px] ">
          <div dir="rtl" className=" bg-white  relative" >
            <img
              src={"/images/quran/eblaq.jpg"}
              width={100}
              height={100}
              className=" w-full bg-cover rounded-sm "
            ></img>
            <div className="absolute top-[33%] right-[50%] z-10 h-24 font-iranNastaliq text-[12px] md:text-[20px] text-gray-700 font-bold">
              {prs?.name} {prs?.family}
            </div>
            <div className="absolute top-[36.5%] right-[29%] z-10 h-24  text-[10px] md:text-[12px] font-iranSans  text-gray-700 font-bold">
              {prs?.prs}
            </div>
            <div className="absolute top-[36.5%] right-[47%] z-10 h-24 font-iranNastaliq text-[12px] md:text-[20px] text-gray-700 font-bold">
              {prs?.province}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PrintableComponent;
