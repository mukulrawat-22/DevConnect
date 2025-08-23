const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};
const validateEditprofileData = (req) => {
  const allowededitFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];

  const iseditAllowed = Object.keys(req.body).every((field) =>
    allowededitFields.includes(field)
  );
  return iseditAllowed;
};
module.exports = {
  validateSignUpData,validateEditprofileData
};
