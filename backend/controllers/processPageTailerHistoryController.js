import ProcessPageTailerHistory from "../models/processPageTailerHistory";

export const getAllProcessPageTailerHistory = async (query) => {
  return await ProcessPageTailerHistory.find(query);
};

export const getOneProcessPageTailerHistory = async (id) => {
  return await ProcessPageTailerHistory.findById(id);
};

export const addProcessPageTailerHistory = async (processPageTailerHistory) => {
  return await ProcessPageTailerHistory.create(processPageTailerHistory);
};

export const updateProcessPageTailerHistory = async (processPageTailerHistory) => {
  return await ProcessPageTailerHistory.findByIdAndUpdate(processPageTailerHistory._id, processPageTailerHistory);
};

export const updateProcessPageTailerHistoryByWhere = async (processPageTailerHistory) => {
  return await ProcessPageTailerHistory.updateOne(
    { processPage: processPageTailerHistory.processPage, project: processPageTailerHistory.project },  // Query parameter
    { $set: processPageTailerHistory }
  )
};

export const deleteProcessPageTailerHistory = async (id) => {
  return await ProcessPageTailerHistory.findOneAndRemove({ _id: id });
};
