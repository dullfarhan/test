import ProcessPageHistory from "../models/processPageHistory";

export const getAllProcessPageHistory = async (query) => {
  return await ProcessPageHistory.find(query);
};

export const getOneProcessPageHistory = async (id) => {
  return await ProcessPageHistory.findById(id);
};

export const addProcessPageHistory = async (processPageHistory) => {
  return await ProcessPageHistory.create(processPageHistory);
};

export const updateProcessPageHistory = async (processPageHistory) => {
  return await ProcessPageHistory.findByIdAndUpdate(processPageHistory._id, processPageHistory);
};

export const updateProcessPageHistoryByWhere = async (processPageHistory) => {
  return await ProcessPageHistory.updateOne(
    { processPage: processPageHistory.processPage },  // Query parameter
    { $set: processPageHistory }
  )
};

export const deleteProcessPageHistory = async (id) => {
  return await ProcessPageHistory.findOneAndRemove({ _id: id });
};
