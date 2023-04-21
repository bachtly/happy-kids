// return error of the password ("" for no error)
const validatePassword = (password: string) => {
  if (!(password.length >= 8)) return "Gồm ít nhất 8 ký tự";
  if (!/\d/.test(password)) return "Phải có ít nhất một chữ số";
  if (!/[a-z]/.test(password)) return "Phải có ít nhất một chữ cái viết thường";
  return "";
};

export { validatePassword };
