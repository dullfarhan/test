import Project from "../models/project";
import Group from "../models/group";

export const getAllProject = async (query) => {
  return await Project.find(query)
};

export const searchProject = async (query) => {
  return await Project.find({ "name": { $regex: '.*' + query.name + '.*' } })
};

export const getOneProject = async (id) => {
  //find project
  const project = await Project.findById(id);

  let res;
  if (project) {
    //get the group of project
    let group = []
    await Promise.all(
      project.group.map(async (item, index) => {
        group[index] = await Group.findById(item);
      })
    )
    res = {
      ...project.toObject(),
      groupDetails: group,
    };
  }
  return res;
};

export const addProject = async (project) => {
  return await Project.create(project);
};

export const updateProject = async (project) => {
  return await Project.findByIdAndUpdate(project._id, project);
};

export const deleteProject = async (id) => {
  return await Project.findOneAndRemove({ _id: id });
};
