var express = require("express");
var router = express.Router();
let userController = require("../controllers/users");
let { RegisterValidator, validatedResult } = require("../utils/validator");
let { CheckLogin } = require("../utils/authHandler");

//login
router.post("/login", async function (req, res, next) {
  let { username, password } = req.body;

  let result = await userController.QueryLogin(username, password);

  if (!result) {
    res.status(404).send("thong tin dang nhap khong dung");
  } else {
    res.send(result);
  }
});

//register
router.post(
  "/register",
  RegisterValidator,
  validatedResult,
  async function (req, res, next) {
    let { username, password, email } = req.body;

    let newUser = await userController.CreateAnUser(
      username,
      password,
      email,
      "69b6231b3de61addb401ea26",
    );

    res.send(newUser);
  },
);

//me
router.get("/me", CheckLogin, function (req, res, next) {
  res.send(req.user);
});

//change password (phai dang nhap)
router.post("/changepassword", CheckLogin, async function (req, res, next) {
  let { oldpassword, newpassword } = req.body;

  if (!oldpassword || !newpassword) {
    return res.status(400).send("thieu du lieu");
  }

  // validate new password
  if (newpassword.length < 6) {
    return res.status(400).send("newpassword phai >= 6 ky tu");
  }

  let result = await userController.ChangePassword(
    req.user._id,
    oldpassword,
    newpassword,
  );

  if (!result) {
    return res.status(400).send("mat khau cu khong dung");
  }

  res.send("doi mat khau thanh cong");
});

//forgotpassword
//permission

module.exports = router;
