import { Router } from 'express';
import passport from 'passport';
import {
  getAllProcessRelease,
  getOneProcessRelease,
  addProcessRelease,
  updateProcessRelease,
  deleteProcessRelease
} from "../controllers/processReleaseController";

const router = Router();


router.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getAllProcessRelease(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.get("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getOneProcessRelease(req.params.id);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const result = await addProcessRelease(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateProcessRelease(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.delete("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await deleteProcessRelease(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

export default router;
