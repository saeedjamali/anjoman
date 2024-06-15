export const authTypes = {
  LOGIN: "login",
  REGISTER: "register",
  SMS: "sms",
  FORGOTPASS: "forget-password",
  ROLES: "select-roles",
  RESETPASS: "reset-pass"
};

export const roles = {
  USER: { name: "user", title: "کاربر" },
  ADMIN: { name: "admin", title: "کارشناس" },
  MODIR: { name: "modir", title: "مدیر مدرسه" },
  PARENT: { name: "parent", title: "والدین" },
  SHERKAT: { name: "sherkat", title: "شرکت" },
};

export const year = [
  { id: 1, name: "1402-1403", currentYear: true },
  { id: 2, name: "1403-1404", currentYear: false },
];
