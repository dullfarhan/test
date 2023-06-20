import StandardProcessTailerHistory from "../models/standardProcessTailerHistory";

export const getStandardProcessTailerHistory = async (query) => {
  return await StandardProcessTailerHistory.find(query);
};

export const getOneStandardProcessTailerHistory = async (id) => {
  return await StandardProcessTailerHistory.findById(id);
};

export const addStandardProcessTailerHistory = async (standardProcessTailerHistory) => {
  return await StandardProcessTailerHistory.create(standardProcessTailerHistory);
};

export const updateStandardProcessTailerHistory = async (standardProcessTailerHistory) => {
  return await StandardProcessTailerHistory.findByIdAndUpdate(standardProcessTailerHistory._id, standardProcessTailerHistory);
};

export const updateStandardProcessTailerHistoryByWhere = async (standardProcessTailerHistory) => {
  return await StandardProcessTailerHistory.updateOne(
    { standardProcess: standardProcessTailerHistory.processPage, project: standardProcessTailerHistory.project },  // Query parameter
    { $set: standardProcessTailerHistory }
  )
};

export const deletStandardProcessTailerHistory = async (id) => {
  return await StandardProcessTailerHistory.findOneAndRemove({ _id: id });
};
