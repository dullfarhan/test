import Organization from "../models/organization";

export const getAllOrganization = async (query) => {
  const {page,limit} =query;
  const skip =(page -1) * limit;
  return await Organization.find().skip(skip).limit(limit);
};

export const getOneOrganization = async (id) => {
  return await Organization.findById(id);
};

export const addOrganization = async (organization) => {
  return await Organization.create(organization);
};

export const updateOrganization = async (organization) => {
  return await Organization.findByIdAndUpdate(organization._id, organization);
};

export const deleteOrganization = async (id) => {
  return await Organization.findOneAndRemove({ _id: id });
};
