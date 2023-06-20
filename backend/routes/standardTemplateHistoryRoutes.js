import { Router } from 'express';
import passport from 'passport';
import {
  getAllStandardTemplateHitory,
  getOneStandardTemplateHitory,
  updateStandardTemplateHitory,
  deleteStandardTemplateHitory,
  searchStandardTemplateHitory,
  standardTemplateHitory
} from "../controllers/standardTemplateHistoryController";

const router = Router();

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
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  //   }
  // }
});

router.get("/",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getAllStandardTemplateHitory(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.get("/search",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await searchStandardTemplateHitory(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.get("/:id", passport.authenticate('jwt', { session: false }) ,async (req, res) => {
  try {
    const courseCat = await getOneStandardTemplateHitory(req.params.id);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.post("/",passport.authenticate('jwt', { session: false }), upload.single('fileURL'), async (req, res) => {
  try {
    const url = req.protocol + '://' + req.get('host') + '/' + req.file.path
    const result = await standardTemplateHitory(req.body, url);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }


});

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateStandardTemplateHitory(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.delete("/:id",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await deleteStandardTemplateHitory(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

export default router;
