import connectDb from "@/middlewares/mongoose";
import User from "@/models/User";
var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

const handler = async (req, res) => {

    
  if (req.method == "POST") {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      // Decrypt
      var bytes = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
      var DecryptPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (
        req.body.email == user.email &&
        req.body.password == DecryptPassword
      ) {
        var token = jwt.sign(
          {email: user.email, name: user.name },
          process.env.JWT_SECRET, { expiresIn: '24h' }
        );

        res.status(200).json({ success: true, token, email : user.email });
      } else {
        res.status(200).json({ success: false, error: "invalid Credentials" });
      }
    } else {
      res.status(400).json({ success: false, error: "No user Found" });
    }
  }
};

export default connectDb(handler);
