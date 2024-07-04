import { compare, hash } from "bcryptjs";
// import { sign, verify } from "jsonwebtoken"
import * as jose from "jose";

const hashPassword = async (password) => {
  return await hash(password, 12);
};

const verifyPassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
};

const generateAccessToken = async (data) => {
  //Jose Sign
  const jwtToken = await new jose.SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(new TextEncoder().encode(process.env.AccessTokenSecretKey));

  return jwtToken;

  //Jwt Sign
  // return sign({ ...data }, process.env.AccessTokenSecretKey, { expiresIn: "15s" });
};

const verifyAccessToken = async (jwtToken) => {
  //Jose Verification
  try {
    const { payload: jwtData } = await jose.jwtVerify(
      jwtToken,
      new TextEncoder().encode(process.env.AccessTokenSecretKey)
    );

    return jwtData;
    // jwtData.uid => `your-data`
  } catch (error) {
    // console.log("Jwt Error --->", error);
    // JWT validation failed or token is invalid
  }

  //Jwt Verifiying
  // try {
  //     const payloadToken = verify(token, process.env.AccessTokenSecretKey);
  //     return payloadToken;
  // } catch (error) {
  //     console.log(error);
  //     return false
  // }
};

const generateRefreshToken = async (data) => {
  //Jose Sign
  const jwtToken = await new jose.SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.RefreshTokenSecretKey));

  return jwtToken;
};

const verifyRefreshToken = async (jwtToken) => {
  try {
    const { payload: jwtData } = await jose.jwtVerify(
      jwtToken,
      new TextEncoder().encode(process.env.RefreshTokenSecretKey)
    );
    return jwtData;
    // jwtData.uid => `your-data`
  } catch (error) {
    console.log(error);
    // JWT validation failed or token is invalid
  }
};

const valiadteEmail = (email) => {
  const pattern = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;
  return pattern.test(email);
};

const validateNoStd = (no) => {
  if (no < 0 || no > 3000) {
    return false;
  }
  return true;
};

const valiadtePhone = (phone) => {
  //const pattern = /((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/g;
  // const pattern = /(\+98|0)?9\d{9}/g;
  const pattern = /^(?=.*?[0-9]).{11,11}$/g;
  return pattern.test(phone);
};

const valiadtePassword = (password) => {
  const pattern = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$/g;
  //min 8 char includes number and character
  return pattern.test(password);
};

const valiadteSchoolCode = (schoolcode) => {
  const pattern = /^(?=.*?[0-9]).{8,8}$/g;
  return pattern.test(schoolcode);
};

const valiadteRegionCode = (regionCode) => {
  const pattern = /^(?=.*?[0-9]).{4,4}$/g;
  return pattern.test(regionCode);
};

const valiadteProvinceCode = (provinceCode) => {
  const pattern = /^(?=.*?[0-9]).{2,2}$/g;
  return pattern.test(provinceCode);
};

const valiadtePrsCode = (prsCode) => {
  const pattern = /^(?=.*?[0-9]).{8,8}$/g;
  return pattern.test(prsCode);
};

const valiadteMeliCode = (meliCode) => {
  const pattern = /^(?=.*?[0-9]).{10,10}$/g;
  return pattern.test(meliCode);
};

export {
  hashPassword,
  generateAccessToken,
  verifyPassword,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  valiadtePassword,
  valiadteEmail,
  valiadtePhone,
  valiadteSchoolCode,
  validateNoStd,
  valiadtePrsCode,
  valiadteMeliCode,
  valiadteRegionCode,
  valiadteProvinceCode
};
