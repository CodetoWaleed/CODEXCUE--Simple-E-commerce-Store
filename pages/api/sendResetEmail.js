// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from "@/models/User";
import forgotPassword from "@/models/forgotPassword";
const nodemailer = require("nodemailer");
import connectDb from "@/middlewares/mongoose";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  let { sendEmail, email } = JSON.parse(req.body);
  if (sendEmail) {
    //check user exists in the database
    let userFound = await User.findOne({ email: email });
    const { _id } = userFound;
    // res.status(200).json({ success: "Here is your User", _id });

    if (_id) {
      // send reset email to the user
      let token = "hsajhd89374kwjhjwefh892rhejkfh9834y89ywe";
      let forgot = new forgotPassword({
        userId: _id,
        email: email,
        token: token,
      });
      await forgot.save();
      console.log(forgot);
      let emailTemp = `
      Hi ${email},
      
      There was a request to change your password!
      
      If you did not make this request then please ignore this email.
      
      Otherwise, please click this link to change your password: <a href="http://localhost:3000/forgot?token=${token}">Click here to Reset your Password</a>`;
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = await nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "mrpsycho820@gmail.com",
          pass: "rlzprwgeutvkagaa",
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Waleeds Wear" <passwordreset@waleedswear.com>', // sender address
        to: email, // list of receivers
        subject: "Here is your Password Reset Instructions", // Subject line
        text: emailTemp, // plain text body
        html: emailTemp, // html body
      });

      console.log("Message sent: %s", info.messageId);
      res
        .status(200)
        .json({ success: true, message: "Email sent successfully!!!!" });
    } else {
      res.status(200).json({ success: false, message: "NO user Found" });
    }
  } else {
    //reset password here
    const { cpassword, emailToken } = JSON.parse(req.body);
    let userFound = await forgotPassword.findOne({ token: emailToken });
    console.log(userFound);
    if (userFound != null) {
      let tokenMatched = userFound.token;

      if (emailToken == tokenMatched) {
        let userUpdate = await User.findOneAndUpdate(
          { email: userFound.email },
          {
            password: CryptoJS.AES.encrypt(
              cpassword,
              process.env.AES_SECRET
            ).toString(),
          }
        );
        res.status(200).json({
          success: true,
        });
        return;
      } else {
        res.status(200).json({
          success: false,
          message: "token does not matched!!!",
        });
      }
    } else {
      res.status(200).json({
        success: false,
        message: "token does not matched!!!",
      });
    }
  }
};
export default connectDb(handler);
