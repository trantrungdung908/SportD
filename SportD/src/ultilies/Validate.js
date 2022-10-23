export const isValidEmail = email =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim());

export const isValidPasswordLength = password => {
  return password.length >= 8;
};
//regex pwd /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);
export const isValidPasswordUpper = password => {
  return /[A-Z]/.test(password);
};

export const isValidPasswordLower = password => {
  return /[a-z]/.test(password);
};

export const isValidPasswordNumber = password => {
  return /[0-9]/.test(password);
};

export const isValidPasswordSpecial = password => {
  return /[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(password);
};

export const isValidUser = user => {
  return user.length >= 6;
};
