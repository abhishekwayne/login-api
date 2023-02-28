const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOtpEmail = async ({ email, otpCode }) => {
  const msg = {
    to: email,
    from: "bunnybunny708@gmail.com",
    subject: "Your OTP for login",
    text: `OTP Alert! No Bajaj Finance Ltd employee will call & ask for OTP. Don't share it with others. Your secret OTP is : ${otpCode}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent sucessfully");
    })
    .catch((error) => {
      console.error(error);
    });
};
module.exports = { sendOtpEmail };
