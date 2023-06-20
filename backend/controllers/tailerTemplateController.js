import TailerTemplate from "../models/tailerTemplate";
import fs from 'fs'
import path from "path";

export const getAllTailerTemplate = async (query) => {
  return await TailerTemplate.find(query);
};
export const searchTailerTemplate = async (query) => {

  return await TailerTemplate.find({
    label: { $regex: ".*" + query.label + ".*" },
  });
};
export const getOneTailerTemplate = async (id) => {
  return await TailerTemplate.findById(id);
};

export const addTailerTemplate = async (tailerTemplate) => {
  return await TailerTemplate.create(tailerTemplate);
};

export const updateTailerTemplate = async (data, url) => {
  const { teplateId } = data;

  const fintTemplate = await TailerTemplate.findOne({ label: data.label });

  const lastVersion = fintTemplate.version[fintTemplate.version.length - 1];
  const { versionNo } = lastVersion;

  const version = {
    fileURL: url,
    createdBy: data.createdBy,
    versionNo: versionNo + 1,
    createdAt: new Date(),
  };

  const result = {
    label: data.label,
    version: [...fintTemplate.version, version],
    project: data.project,
  };

  return await TailerTemplate.findByIdAndUpdate(teplateId, result);
};

export const deleteTailerTemplate = async (id) => {

const DIR = './public';
const removeFile = await TailerTemplate.findOne({_id:id})

removeFile.version.map((item)=>{
  fs.unlinkSync(`${DIR}/${item.fileURL.split('\\')[1]}`)
  // console.log("Remove All file ");
})

  return await TailerTemplate.findOneAndRemove({ _id: id });
};

export const tailerTemplate = async (data, url) => {
  const tailerTemplates = {
    label: data.label,
    version: {
      fileURL: url,
      createdBy: data.createdBy,
      versionNo: 1,
      createdAt: new Date(),
    },
    project: data.project,
  };
  return await TailerTemplate.create(tailerTemplates);
};