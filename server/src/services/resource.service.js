const Resource = require('../models/Resource');
const ApiError = require('../utils/ApiError');
const Department = require('../models/Department');

const createResource = async (resourceData) => {
  const { department } = resourceData;
  const deptExists = await Department.findById(department);
  if (!deptExists) {
    throw new ApiError(404, 'Department not found.');
  }
  const resource = await Resource.create(resourceData);
  return await resource.populate('department');
};

const getResources = async (filters = {}) => {
  const query = {};
  if (filters.department) query.department = filters.department;
  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  if (filters.minCapacity) query.capacity = { $gte: Number(filters.minCapacity) };

  return Resource.find(query).populate('department');
};

const getResourceById = async (id) => {
  const resource = await Resource.findById(id).populate('department');
  if (!resource) throw new ApiError(404, 'Resource not found.');
  return resource;
};

const updateResource = async (id, updateData) => {
  if (updateData.department) {
    const deptExists = await Department.findById(updateData.department);
    if (!deptExists) {
      throw new ApiError(404, 'Department not found.');
    }
  }

  const resource = await Resource.findByIdAndUpdate(id, updateData, { new: true }).populate('department');
  if (!resource) throw new ApiError(404, 'Resource not found.');
  return resource;
};

const deleteResource = async (id) => {
  const resource = await Resource.findByIdAndDelete(id);
  if (!resource) throw new ApiError(404, 'Resource not found.');
  return { success: true };
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
};
