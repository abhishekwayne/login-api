const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    contactNumber: {
      type: String,
    },
    email: {
      type: String,
      // unique: true,
      // trim: true,
      // lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    role: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    doi: {
      type: Date,
    },
    data: {
      type: Object,
      default: {},
    },
    otpExipryTime: {
      type: Date,
    },
    otp: String,
    archived: {
      type: Boolean,
      required: true,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
