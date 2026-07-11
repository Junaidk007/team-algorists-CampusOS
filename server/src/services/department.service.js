const Department = require('../models/Department');
const ApiError = require('../utils/ApiError');

const createDepartment = async (departmentData) => {
  const { code, name } = departmentData;
  const existingCode = await Department.findOne({ code });
  if (existingCode) {
    throw new ApiError(400, 'Department with this code already exists.');
  }
  const existingName = await Department.findOne({ name });
  if (existingName) {
    throw new ApiError(400, 'Department with this name already exists.');
  }

  const department = await Department.create(departmentData);
  return department;
};

const getDepartments = async () => {
  return await Department.find();
};

const getDepartmentById = async (id) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError(404, 'Department not found.');
  }
  return department;
};

const updateDepartment = async (id, updateData) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError(404, 'Department not found.');
  }

  // If code is being updated, check uniqueness
  if (updateData.code && updateData.code !== department.code) {
    const existing = await Department.findOne({ code: updateData.code });
    if (existing) {
      throw new ApiError(400, 'Department with this code already exists.');
    }
  }

  // If name is being updated, check uniqueness
  if (updateData.name && updateData.name !== department.name) {
    const existing = await Department.findOne({ name: updateData.name });
    if (existing) {
      throw new ApiError(400, 'Department with this name already exists.');
    }
  }

  Object.assign(department, updateData);
  await department.save();
  return department;
};

const deleteDepartment = async (id) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError(404, 'Department not found.');
  }

  // In the future, we could check for dependencies (Users, Resources) referencing this department
  await department.deleteOne();
  return { success: true };
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
