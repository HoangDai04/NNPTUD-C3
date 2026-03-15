const userController = require("../controllers/users");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// đọc key RSA
const publicKey = fs.readFileSync("./public.key");

module.exports = {
  CheckLogin: async function (req, res, next) {
    try {
      let token = req.headers.authorization;

      if (!token || !token.startsWith("Bearer")) {
        res.status(403).send({ message: "ban chua dang nhap" });
        return;
      }

      token = token.split(" ")[1];

      // verify bằng RS256
      let result = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
      });

      let getUser = await userController.GetUserById(result.id);

      if (!getUser) {
        res.status(403).send({ message: "ban chua dang nhap" });
      } else {
        req.user = getUser[0];

        next();
      }
    } catch (error) {
      res.status(403).send({ message: "ban chua dang nhap" });
    }
  },
};
