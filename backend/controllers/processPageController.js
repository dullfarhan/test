import mongoose from "mongoose";
import ProcessPage from "../models/processPage";

export const getAllProcessPage = async (query) => {
  return await ProcessPage.find(query);
};

export const getProcessPageHistory = async (query) => {
  return await ProcessPage.aggregate(
    [
      {
        "$lookup": {
          "from": "process_page_histories",
          "localField": "_id",
          "foreignField": "processPage",
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

export const getProcessPageTailerHistory = async (query) => {
  return await ProcessPage.aggregate([
    {
      "$lookup": {
        "from": "process_page_tailerhistories",
        "let": {
          ppId: "$_id"
        },
        "pipeline": [
          {
            $match: {
              $and: [
                {
                  project: mongoose.Types.ObjectId(query.project)
                },
                {
                  $expr: {
                    $eq: [
                      "$processPage",
                      "$$ppId"
                    ]
                  }
                }
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

export const getOneProcessPage = async (id) => {
  return await ProcessPage.findById(id);
};

export const addProcessPage = async (processPage) => {
  return await ProcessPage.create(processPage);
};

export const updateProcessPage = async (processPage) => {
  return await ProcessPage.findByIdAndUpdate(processPage._id, processPage);
};

export const deleteProcessPage = async (id) => {
  return await ProcessPage.findOneAndRemove({ _id: id });
};
