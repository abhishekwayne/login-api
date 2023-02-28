var unirest = require("unirest");
const dotenv = require("dotenv").config();
module.exports = {
  sendSMS: (message, otp, contactNumber) => {
    return new Promise((resolve, reject) => {
      var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

      req.headers({
        authorization:
          "JgWTsmCw0xDlQnGvuXaOHq4kiYRheZ7czop5I3LfA9K8VN2BbryojDNOe9HXAIEgkwhJ05q714ZCPQxc",
        "Content-Type": "application/json",
      });

      req.form({
        message: `${message}${otp}`,
        language: "english",
        route: "q",
        numbers: contactNumber,
      });

      req.end(function (res) {
        if (res.error) {
          return reject(res.error);
        }
        return resolve();
      });
    });
  },
};
