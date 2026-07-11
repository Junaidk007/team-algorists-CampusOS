const departmentService = require('../services/department.service');
const ApiResponse = require('../utils/ApiResponse');

const create = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json(new ApiResponse(201, department, 'Department created successfully.'));
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const departments = await departmentService.getDepartments();
    res.status(200).json(new ApiResponse(200, departments, 'Departments retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    res.status(200).json(new ApiResponse(200, department, 'Department details retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, department, 'Department updated successfully.'));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Department deleted successfully.'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
