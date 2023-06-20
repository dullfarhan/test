import StandardTemplateHitory from "../models/standardTemplateHistory";

export const getAllStandardTemplateHitory = async (query) => {
  return await StandardTemplateHitory.find(query);
};

export const searchStandardTemplateHitory = async (query) => {
  return await StandardTemplateHitory.find({ "label": { $regex: '.*' + query.label + '.*' } })
};

export const getOneStandardTemplateHitory = async (id) => {
  return await StandardTemplateHitory.findById(id);
};

export const addStandardTemplateHitory = async (standardTemplateHitory) => {
  return await StandardTemplateHitory.create(standardTemplateHitory);
};

export const updateStandardTemplateHitory = async (standardTemplateHitory) => {
  return await StandardTemplateHitory.findByIdAndUpdate(standardTemplateHitory._id, standardTemplateHitory);
};

export const deleteStandardTemplateHitory = async (id) => {
  return await StandardTemplateHitory.findOneAndRemove({ _id: id });
};

export const standardTemplateHitory = async (url, url2) => {
  const standardTemplateHitory = ({
    fileURL: url2,
    label: url.label,
    createdBy: url.createdBy,
    standardProcess: url.standardProcess
  })
  return await StandardTemplateHitory.create(standardTemplateHitory);
};