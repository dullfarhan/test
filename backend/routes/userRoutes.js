import { Router } from "express";
import passport from "passport";
import {
  getAllUsers,
  getOneUser,
  addUser,
  updateUser,
  deleteUser,
  registerUser,
  updateUserPw,
  updateUserProfile,
  searchUser
} from "../controllers/userController";
import { sendMail } from "../middlewares/sendMail";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import User from "./../models/user";
const multer = require('multer')
const { uuid } = require('uuidv4');


const DIR = './public';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuid() + '-' + fileName)
  }
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});


const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await getAllUsers(req.query);
      res.send(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.get("/search",passport.authenticate("jwt", { session: false }),async (req, res) => {
    try {
      const users = await searchUser(req.query);
      res.send(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await getOneUser(req.params.id);
      res.send(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);
router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await searchUser(req.query);
      res.send(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { email } = req.body;
  try {
    const findUser = await User.findOne({ email });

    if (findUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (!findUser) {
      const result = await addUser(req.body);
      jwt.sign(
        { email },
        process.env.SECRET_KEY,
        {
          expiresIn: 180, // 3 minute
        },
        (err, token) => {
          // const result = await addUser(req.body);
          const link = `${process.env.BASE_URL}/register/${token}`;
          sendMail('email_template',{email:result.email,link:link,name:result.fullName});
          res.send(result);
        }
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
}
);

router.post("/carniqUser", passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    try {
      if (findUser) {
        return res.json({ message: "Email already exists" });
      }
      if (!findUser) {
        const result = await addUser(req.body);
        jwt.sign(
          { email },
          process.env.SECRET_KEY,
          {
            expiresIn: 180, // 3 minute in seconds
          },
          (err, token) => {
            res.send({
              token: token,
              result
            });
          }
        );
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

router.put("/",
  async (req, res) => {
    try {
      const result = await updateUser(req.body);
      res.send(result);
      console.log(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);
router.put("/register", async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.send(result);
    console.log(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
}
);

router.put("/password", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateUserPw(req.body);
    if (result && result.status && result.status == 400) {
      res.status(400).json({ message: result.message });
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});


router.post("/upload-image", passport.authenticate('jwt', { session: false }), upload.single('profileImg'), async (req, res) => {
  try {
    const url = req.protocol + '://' + req.get('host') + '/' + req.file.path
    const result = await updateUserProfile(req.body.email, url);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.delete("/:id", passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await deleteUser(req.params.id);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString() });
    }
  }
);

export default router;
