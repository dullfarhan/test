import { Router } from 'express';
import passport from 'passport';
import {
  getAllOrganization,
  getOneOrganization,
  addOrganization,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organizationController";
import Organization from "../models/organization";
const router = Router();

router.get("/",passport.authenticate("jwt", { session: false }),async (req, res) => {

    try {
      let organization = await Organization.aggregate([
        {
          $lookup: {
            from: "projects",
            localField: "_id",
            foreignField: "organizationId",
            as: "numberProject",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "organizationId",
            as: "numberUsers",
          },
        },
      ]);

      res.send(organization);

    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString()});
    }
  });

router.get("/:id", passport.authenticate('jwt', { session: false }) ,async (req, res) => {
    try {
      const courseCat = await getOneOrganization(req.params.id);
      res.send(courseCat);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString()});
    }
  });

router.post("/",passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
      const result = await addOrganization(req.body);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString()});
    }
  });

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const result = await updateOrganization(req.body);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString()});
    }
  });

router.delete("/:id",passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const result = await deleteOrganization(req.params.id);
      res.send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.toString()});
    }
  });

export default router;
