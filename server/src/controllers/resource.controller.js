const resourceService = require('../services/resource.service');
const ApiResponse = require('../utils/ApiResponse');

const create = async (req, res, next) => {
  try {
    const resource = await resourceService.createResource(req.body);
    res.status(201).json(new ApiResponse(201, resource, 'Resource created successfully.'));
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const resources = await resourceService.getResources(req.query);
    res.status(200).json(new ApiResponse(200, resources, 'Resources fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    res.status(200).json(new ApiResponse(200, resource, 'Resource details fetched.'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const resource = await resourceService.updateResource(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, resource, 'Resource updated successfully.'));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await resourceService.deleteResource(req.params.id);
    res.status(200).json(new ApiResponse(200, result, 'Resource deleted successfully.'));
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
