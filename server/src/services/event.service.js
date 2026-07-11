const Event = require('../models/Event');
const ApiError = require('../utils/ApiError');
const Department = require('../models/Department');
const Resource = require('../models/Resource');

const createEvent = async (eventData, userId) => {
  const { department, preferredVenue } = eventData;

  // Validate department exists
  const deptExists = await Department.findById(department);
  if (!deptExists) {
    throw new ApiError(404, 'Department not found.');
  }

  // Validate preferredVenue exists if provided
  if (preferredVenue) {
    const venueExists = await Resource.findById(preferredVenue);
    if (!venueExists) {
      throw new ApiError(404, 'Preferred venue resource not found.');
    }
  }

  const event = await Event.create({ ...eventData, organizer: userId });
  return await event.populate([
    { path: 'organizer', select: 'name email' },
    { path: 'department' },
    { path: 'preferredVenue' }
  ]);
};

const getEvents = async (filters = {}) => {
  const query = {};
  if (filters.organizer) query.organizer = filters.organizer;
  if (filters.department) query.department = filters.department;
  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;

  return Event.find(query).populate([
    { path: 'organizer', select: 'name email' },
    { path: 'department' },
    { path: 'preferredVenue' },
    { path: 'attendees', select: 'name email' },
    { path: 'resources' }
  ]);
};

const getEventById = async (id) => {
  const event = await Event.findById(id).populate([
    { path: 'organizer', select: 'name email' },
    { path: 'department' },
    { path: 'preferredVenue' },
    { path: 'attendees', select: 'name email' },
    { path: 'resources' }
  ]);
  if (!event) throw new ApiError(404, 'Event not found.');
  return event;
};

const updateEvent = async (id, updateData, user) => {
  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, 'Event not found.');

  // Check authorization:
  // 1. Organizer can update.
  // 2. Admin & Dean can update.
  // 3. Faculty in the same department as the event can update.
  let isAuthorized = false;
  if (event.organizer.toString() === user.id) {
    isAuthorized = true;
  } else if (user.role === 'admin' || user.role === 'dean') {
    isAuthorized = true;
  } else if (user.role === 'faculty') {
    const eventDept = event.department ? event.department.toString() : '';
    const userDept = user.department ? user.department.toString() : '';
    if (eventDept && eventDept === userDept) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    throw new ApiError(403, 'Not authorized to update this event.');
  }

  if (updateData.department) {
    const deptExists = await Department.findById(updateData.department);
    if (!deptExists) throw new ApiError(404, 'Department not found.');
  }

  if (updateData.preferredVenue) {
    const venueExists = await Resource.findById(updateData.preferredVenue);
    if (!venueExists) throw new ApiError(404, 'Preferred venue resource not found.');
  }

  Object.assign(event, updateData);
  await event.save();
  return await event.populate([
    { path: 'organizer', select: 'name email' },
    { path: 'department' },
    { path: 'preferredVenue' }
  ]);
};

const deleteEvent = async (id, user) => {
  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, 'Event not found.');

  let isAuthorized = false;
  if (event.organizer.toString() === user.id) {
    isAuthorized = true;
  } else if (user.role === 'admin' || user.role === 'dean') {
    isAuthorized = true;
  } else if (user.role === 'faculty') {
    const eventDept = event.department ? event.department.toString() : '';
    const userDept = user.department ? user.department.toString() : '';
    if (eventDept && eventDept === userDept) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    throw new ApiError(403, 'Not authorized to delete this event.');
  }
  await event.deleteOne();
  return { success: true };
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
