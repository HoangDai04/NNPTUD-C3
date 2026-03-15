let userModel = require("../schemas/users");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let fs = require("fs");

// đọc private key để ký token RS256
const privateKey = fs.readFileSync("./private.key");

module.exports = {
  CreateAnUser: async function (
    username,
    password,
    email,
    role,
    fullName,
    avatarUrl,
    status,
    loginCount,
  ) {
    let hashPassword = bcrypt.hashSync(password, 10);

    let newItem = new userModel({
      username: username,
      password: hashPassword,
      email: email,
      fullName: fullName,
      avatarUrl: avatarUrl,
      status: status,
      role: role,
      loginCount: loginCount,
    });

    await newItem.save();

    return newItem;
  },

  GetAllUser: async function () {
    return await userModel.find({ isDeleted: false });
  },

  GetUserById: async function (id) {
    try {
      return await userModel.find({
        isDeleted: false,
        _id: id,
      });
    } catch (error) {
      return false;
    }
  },

  QueryLogin: async function (username, password) {
    if (!username || !password) {
      return false;
    }

    let user = await userModel.findOne({
      username: username,
      isDeleted: false,
    });

    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        // ký JWT bằng RS256
        return jwt.sign(
          {
            id: user.id,
          },
          privateKey,
          {
            algorithm: "RS256",
            expiresIn: "1d",
          },
        );
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  ChangePassword: async function (userId, oldpassword, newpassword) {
    let user = await userModel.findById(userId);

    if (!user) {
      return false;
    }

    let checkPassword = bcrypt.compareSync(oldpassword, user.password);

    if (!checkPassword) {
      return false;
    }

    let hashPassword = bcrypt.hashSync(newpassword, 10);

    user.password = hashPassword;

    await user.save();

    return true;
  },
};
