import ProcessPageRelease from "../models/processPageRelease";

export const getAllProcessPageRelease = async (query) => {
  return await ProcessPageRelease.find(query);
};

export const getOneProcessPageRelease = async (id) => {
  return await ProcessPageRelease.findById(id);
};

export const addProcessPageRelease = async (processRelease) => {
  return await ProcessPageRelease.create(processRelease);
};

export const updateProcessPageRelease = async (processRelease) => {
  return await ProcessPageRelease.findByIdAndUpdate(processRelease._id, processRelease);
};

export const deleteProcessPageRelease = async (id) => {
  return await ProcessPageRelease.findOneAndRemove({ _id: id });
};
