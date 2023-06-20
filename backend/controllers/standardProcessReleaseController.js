import StandardProcessRelease from "../models/standardProcessRelease";

export const getAllStandardProcessRelease = async (query) => {
  return await StandardProcessRelease.find(query);
};

export const getOneStandardProcessRelease = async (id) => {
  return await StandardProcessRelease.findById(id);
};

export const addStandardProcessRelease = async (standardProcess) => {
  return await StandardProcessRelease.create(standardProcess);
};

export const updateStandardProcessRelease = async (standardProcess) => {
  return await StandardProcessRelease.findByIdAndUpdate(standardProcess._id, standardProcess);
};

export const deleteStandardProcessRelease = async (id) => {
  return await StandardProcessRelease.findOneAndRemove({ _id: id });
};
