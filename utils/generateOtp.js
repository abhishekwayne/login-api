const fast2sms = require("../utils/sms");
const emailSend = require("../utils/email");

const generateOTP = (otp_length, contactNumber, email, message) => {
  otp_length = otp_length || 6;
  const digits = "0123456789".split("");
  let otp = [...Array(otp_length).keys()]
    .map(() => {
      return digits[Math.floor(Math.random() * 10)];
    })
    .join("");
  if (contactNumber) {
    fast2sms
      .sendSMS(message, otp, contactNumber)
      .then()
      .catch((err) => console.log(err));
  }
  if (email) {
    emailSend.sendOtpEmail({ email, otpCode: otp });
  }
  return otp;
};

module.exports = { generateOTP };
