import StandardProcessHistory from "../models/standardProcessHistory";

export const getStandardProcessHistory = async (query) => {
  return await StandardProcessHistory.find(query);
};

export const getOneStandardProcessHistory = async (id) => {
  return await StandardProcessHistory.findById(id);
};

export const addStandardProcessHistory = async (standardProcessHistory) => {
  return await StandardProcessHistory.create(standardProcessHistory);
};

export const updateStandardProcessHistory = async (standardProcessHistory) => {
  return await StandardProcessHistory.findByIdAndUpdate(standardProcessHistory._id, standardProcessHistory);
};

export const updateStandardProcessHistoryByWhere = async (standardProcessHistory) => {
  return await StandardProcessHistory.updateOne(
    { standardProcess: standardProcessHistory.processPage },  // Query parameter
    { $set: standardProcessHistory }
  )
};

export const deletStandardProcessHistory = async (id) => {
  return await StandardProcessHistory.findOneAndRemove({ _id: id });
};
