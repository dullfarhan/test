import { Router } from 'express';
import passport from 'passport';
import {
  getAllProcessPageTailerHistory,
  getOneProcessPageTailerHistory,
  addProcessPageTailerHistory,
  updateProcessPageTailerHistory,
  updateProcessPageTailerHistoryByWhere,
  deleteProcessPageTailerHistory,
} from "../controllers/processPageTailerHistoryController";

import ProcessPageTailerHistory from '../models/processPageTailerHistory'

const router = Router();

router.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {

    const changeBy = await ProcessPageTailerHistory.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "changeBy",
          foreignField: "_id",
          as: "changeUser",
        },
      }
    ]);
    res.send(changeBy);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.get("/byProject/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getAllProcessPageTailerHistory(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.get("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getOneProcessPageTailerHistory(req.params.id);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const result = await addProcessPageTailerHistory(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateProcessPageTailerHistory(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/byWhere", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateProcessPageTailerHistoryByWhere(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.delete("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await deleteProcessPageTailerHistory(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

export default router;
