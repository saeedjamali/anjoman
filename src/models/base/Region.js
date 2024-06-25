import mongoose from "mongoose";


const regionSchema = mongoose.Schema(
  {
    provinceName: {
      type: String,
      required: true,
    },
    provinceCode: {
      type: String,
      required: true,
      length: 2,
    },
    regionCode: {
      type: String,
      required: true,
      length: 4,
    },
    regionName: {
      type: String,
      required: true,
    },
    accessType: {
      type: String,
      required: true,
      default: "user",
    },
    //? user(region) : 1 / admin(province) : 2 /power:3
    // accessCode: {
    //   type: Number,
    //   required: true,
    //   default: 1,
    // },
    companies: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
        },
      ],
    },
  }
);

const Region =
  mongoose.models?.Region || mongoose.model("Region", regionSchema);
export default Region;

export { regionSchema };
