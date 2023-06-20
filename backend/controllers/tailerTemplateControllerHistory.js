import TailerTemplateHistory from "../models/tailerTemplatehistory";

export const getAllTailerTemplateHistory = async (query) => {
  return await TailerTemplateHistory.find(query);
};
export const searchTailerTemplateHistory = async (query) => {

  return await TailerTemplateHistory.find({ "label": { $regex: '.*' + query.label + '.*' } })
};
export const getOneTailerTemplateHistory = async (id) => {
  return await TailerTemplateHistory.findById(id);
};

export const addTailerTemplateHistory = async (tailerTemplateHistory) => {
  return await TailerTemplateHistory.create(tailerTemplateHistory);
};

export const updateTailerTemplateHistory = async (tailerTemplateHistory) => {
  return await TailerTemplateHistory.findByIdAndUpdate(tailerTemplateHistory._id, tailerTemplateHistory);
};

export const deleteTailerTemplateHistory = async (id) => {
  return await TailerTemplateHistory.findOneAndRemove({ _id: id });
};

export const tailerTemplateHistory = async (template, url) => {

  const tailerTemplateHistory = ({
    fileURL: url,
    label: template.label,
    createdBy: template.createdBy,
    teplateId: template.teplateId,
    project: template.project
  })
  return await TailerTemplateHistory.create(tailerTemplateHistory);
};