export const authTypes = {
  LOGIN: "login",
  REGISTER: "register",
  SMS: "sms",
  FORGOTPASS: "forget-password",
  ROLES: "select-roles",
  RESETPASS: "reset-pass",
};

export const roles = {
  USER: { name: "user", title: "کاربر" },
  ADMIN: { name: "admin", title: "کارشناس" },
  MODIR: { name: "modir", title: "مدیر مدرسه" },
  PARENT: { name: "parent", title: "والدین" },
  SHERKAT: { name: "sherkat", title: "شرکت" },
  LECTURER: { name: "lecturer", title: "مدرسین" },
};

export const year = [
  { id: 1, name: "1402-1403", currentYear: true },
  { id: 2, name: "1403-1404", currentYear: false },
];

///?رشته های تحصیلی  ==> در قسمت مدرسین آموزش خانواده
// ? with web api
export const field = [
  { code: 1, name: "روانشناسی" },
  { code: 2, name: "مشاوره" },
  { code: 3, name: "علوم تربیتی" },
  { code: 4, name: "مطالعات زنان و خانواده" },
  { code: 5, name: "الهیات و معارف اسلامی" },
  { code: 6, name: "علوم ارتباطات" },
  { code: 7, name: "حقوق" },
  { code: 8, name: "اقتصاد" },
  { code: 9, name: "مدیریت مالی" },
  { code: 10, name: "تربیت بدنی" },
  { code: 11, name: "علوم تغذیه" },
  { code: 12, name: "بهداشت محیط" },
  { code: 13, name: "پزشکی" },
  { code: 14, name: "روان پزشکی" },
  { code: 15, name: "فناوری و رایانه" },
  { code: 16, name: "جامعه شناسی" },
];

///?مدارک تحصیلی  ==> در قسمت مدرسین آموزش خانواده
// ? with web api
export const degree = [
  { code: 1, name: "کارشناسی ارشد" },
  { code: 2, name: "دکترا" },
  { code: 3, name: "سطح سه حوزه" },
  { code: 4, name: "سطح چهار حوزه" },
];



///?استان ها ==> در قسمت مدرسین آموزش خانواده
// ? with web api
// export const province = [
//   { code: 10, name: "حوزه ستادي " },
//   { code: 11, name: "تهران" },
//   { code: 12, name: "شهرستان های تهران" },
//   { code: 15, name: "مرکزی" },
//   { code: 16, name: "خراسان رضوی" },
//   { code: 17, name: "اصفهان" },
//   { code: 18, name: "آذربایجان شرقی" },
//   { code: 19, name: "اردبیل" },
//   { code: 20, name: "مازندران" },
//   { code: 21, name: "خراسان شمالي" },
//   { code: 22, name: "خراسان جنوبي" },
//   { code: 23, name: "فارس" },
//   { code: 24, name: "البرز" },
//   { code: 27, name: "گلستان" },
//   { code: 29, name: "آذربایجان غربی" },
//   { code: 31, name: "چهارمحال بختیاری" },
//   { code: 34, name: "ايلام" },
//   { code: 34, name: "ایلام" },
//   { code: 35, name: "کرمانشاه" },
//   { code: 36, name: "خوزستان" },
//   { code: 37, name: "گيلان" },
//   { code: 38, name: "کرمان" },
//   { code: 42, name: "کهکيلويه وبويراحمد" },
//   { code: 44, name: "یزد" },
//   { code: 46, name: "قزوين" },
//   { code: 49, name: "سيستان وبلوچستان" },
//   { code: 50, name: "هرمزگان" },
//   { code: 51, name: "بوشهر" },
//   { code: 54, name: "لرستان" },
//   { code: 55, name: "همدان" },
//   { code: 57, name: "زنجان" },
//   { code: 58, name: "کردستان" },
//   { code: 60, name: "سمنان" },
// ];
export const province = [
  { code: 16, name: "خراسان رضوی" }

];


export const generalCondition = [
  "مستخدم(رسمی ، آزمایشی ، پیمانی) بازنشسته یا شاغل آموزش و پرورش و یا اساتید رسمی دانشگاه های دولتی و غیر دولتی",
  "دارا بودن حداقل مدرک کارشناسی ارشد یا سطح سه حوزوی",
  "داشتن حداقل 30 سال سن",
  "تاهل",
  "نداشتن سابقه محکومیت قضایی و محرومیت اجتماعی",
  "برخورداری از سلامت جسم و روان و داشتن قدرت بیان"



]