import Group from "../models/group";

export const getAllgroup = async (query) => {
  return await Group.find(query)
};

export const searchGroup = async (query) => {

  return await Group.find({ "name": { $regex: '.*' + query.name + '.*' } })
};

export const getOnegroup = async (id) => {
  return await Group.findById(id);
};

export const addgroup = async (group) => {
  return await Group.create(group);
};

export const updategroup = async (group) => {
  return await Group.findByIdAndUpdate(group._id, group);
};

export const deletegroup = async (id) => {
  return await Group.findOneAndRemove({ _id: id });
};
