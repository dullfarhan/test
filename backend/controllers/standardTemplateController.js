import StandardTemplate from "../models/standardTemplate";
import fs from 'fs'
import path from "path";

export const getAllStandardTemplate = async (query) => {
  return await StandardTemplate.find(query);
};

export const searchStandardTemplate = async (query) => {
  return await StandardTemplate.find({
    label: { $regex: ".*" + query.label + ".*" },
  });
};

export const getOneStandardTemplate = async (id) => {
  return await StandardTemplate.findById(id);
};

export const addStandardTemplate = async (standardTemplate) => {
  return await StandardTemplate.create(standardTemplate);
};

export const updateStandardTemplate = async (data, url) => {
  const { standardTemplateId } = data;

  const fintTemplate = await StandardTemplate.findOne({ label: data.label });

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

  return await StandardTemplate.findByIdAndUpdate(standardTemplateId, result);
};

export const deleteStandardTemplate = async (id) => {
  const DIR = "./public";
  const removeFile = await StandardTemplate.findOne({ _id: id });

  removeFile.version.map((item) => {
    fs.unlinkSync(`${DIR}/${item.fileURL.split("\\")[1]}`);
    // console.log("Remove All file ");
  });
  return await StandardTemplate.findOneAndRemove({ _id: id });
};

export const standardTemplate = async (url, url2) => {
  const standardTemplates = {
    label: url.label,
    version: {
      fileURL: url2,
      versionNo: 1,
      createdBy: url.createdBy,
      createdAt: new Date(),
    },
    standardProcess: url.standardProcess,
  };
  return await StandardTemplate.create(standardTemplates);
};