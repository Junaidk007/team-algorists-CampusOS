const eventService = require('../services/event.service');
const ApiResponse = require('../utils/ApiResponse');

const create = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json(new ApiResponse(201, event, 'Event created successfully.'));
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const events = await eventService.getEvents(req.query);
    res.status(200).json(new ApiResponse(200, events, 'Events fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.status(200).json(new ApiResponse(200, event, 'Event details fetched.'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body, req.user);
    res.status(200).json(new ApiResponse(200, event, 'Event updated successfully.'));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await eventService.deleteEvent(req.params.id, req.user);
    res.status(200).json(new ApiResponse(200, result, 'Event deleted successfully.'));
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
