const User = require("./../models/user");
var jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOtp");

exports.login = async (req, res) => {
  const { body } = req;
  const { contactNumber, email } = body;
  const message =
    "OTP Alert!.Don't share it with others. Your secret OTP is : ";
  try {
    if (contactNumber) {
      if (
        !contactNumber ||
        typeof contactNumber !== "string" ||
        contactNumber.length === 0
      ) {
        return res
          .status(200)
          .json({ error: true, title: "Invalid Contact Number" });
      }

      if (contactNumber.length !== 10) {
        return res
          .status(200)
          .json({ error: true, title: "Invalid Contact Number" });
      }

      let user = await User.findOne({ contactNumber });
      if (!user) {
        user = await User.create(body);
      }
      user.otp = generateOTP.generateOTP(6, contactNumber, email, message);
      user.otpExipryTime = new Date(new Date().getTime() + 1 * 60000);
      await user.save();
      return res.status(200).json({
        error: false,
        title: "OTP has been sent to your mobile",
      });
    }
    if (email) {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create(body);
      }
      user.otp = generateOTP.generateOTP(6, contactNumber, email, message);
      user.otpExipryTime = new Date(new Date().getTime() + 1 * 60000);
      await user.save();
      return res.status(200).json({
        error: false,
        title: "OTP has been sent to your email",
      });
    }
  } catch (e) {
    res.status(200).json({
      error: true,
      title: "Internal Server Error",
      e,
    });
  }
};

exports.verify = async (req, res) => {
  const { body } = req;
  const { otp, contactNumber, email } = body;
  let user;
  try {
    if (contactNumber) {
      user = await User.findOne({
        contactNumber,
      });
    }
    if (email) {
      user = await User.findOne({
        email,
      });
    }
    if (!user) {
      return res.status(200).json({
        error: true,
        title: "Invalid User",
      });
    }

    if (user.otp === otp) {
      user.otpExipryTime = new Date().setTime(
        new Date().getTime() + 30 * 60 * 1000
      );
    }

    if (user.otp !== otp || new Date(user.otpExipryTime) < new Date()) {
      return res.status(200).json({
        error: true,
        title: "Invalid OTP or OTP expired",
      });
    }

    var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    return res.status(200).json({
      error: false,
      data: {
        token,
      },
      title: "Logged In Successfully",
    });
  } catch (e) {
    res.status(200).json({
      error: true,
      title: "Internal Server Error",
      e,
    });
  }
};
