import mongoose from "mongoose";
import StandardProces from "../models/standardProcess";

export const getAllStandardProces = async (query) => {
  return await StandardProces.find(query);
};

export const getStandardProcesHistory = async (query) => {
  return await StandardProces.aggregate(
    [
      {
        "$lookup": {
          "from": "standard_process_histories",
          "localField": "_id",
          "foreignField": "standardProcess",
          "as": "history"
        }
      },
      {
        "$addFields": {
          "history": { "$slice": ["$history.version", -1] },
          "status": { "$slice": ["$history.status", -1] }
        }
      }
    ]
  );
};

export const getStandardProcesTailerHistory = async (query) => {
  return await StandardProces.aggregate([
    {
      "$lookup": {
        "from": "standard_process_tailerhistories",
        "let": {
          spId: "$_id"
        },
        "pipeline": [
          {
            $match: {
              $and: [
                {
                  project: mongoose.Types.ObjectId(query.project)
                },
                // {
                //   $expr: {
                //     $eq: [
                //       "$standardProcess",
                //       "$$spId"
                //     ]
                //   }
                // }
              ]
            }
          }
        ],
        "as": "history"
      }
    },
    {
      "$addFields": {
        "history": { "$slice": ["$history.version", -1] },
        "status": { "$slice": ["$history.status", -1] }
      }
    },
  ])
};

export const getOneStandardProces = async (id) => {
  return await StandardProces.findById(id);
};

export const addStandardProces = async (standardProcess) => {
  return await StandardProces.create(standardProcess);
};

export const updateStandardProces = async (standardProcess) => {
  return await StandardProces.findByIdAndUpdate(standardProcess._id, standardProcess);
};

export const deleteStandardProces = async (id) => {
  return await StandardProces.findOneAndRemove({ _id: id });
};
