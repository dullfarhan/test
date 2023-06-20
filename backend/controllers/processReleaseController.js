import ProcessRelease from "../models/processRelease";

export const getAllProcessRelease = async (query) => {
  return await ProcessRelease.find(query);
};

export const getOneProcessRelease = async (id) => {
  return await ProcessRelease.findById(id);
};

export const addProcessRelease = async (processRelease) => {
  return await ProcessRelease.create(processRelease);
};

export const updateProcessRelease = async (processRelease) => {
  return await ProcessRelease.findByIdAndUpdate(processRelease._id, processRelease);
};

export const deleteProcessRelease = async (id) => {
  return await ProcessRelease.findOneAndRemove({ _id: id });
};
