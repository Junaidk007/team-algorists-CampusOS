const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Resource = require('../models/Resource');
const ApiError = require('../utils/ApiError');
const conflictService = require('./conflict.service');
const aiService = require('./ai.service');

const createBooking = async (bookingData, userId) => {
  const { event: eventId, resource: resourceId, startTime, endTime } = bookingData;

  // Validate event existence
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found.');
  }

  // Validate resource existence
  const resource = await Resource.findById(resourceId);
  if (!resource) {
    throw new ApiError(404, 'Resource not found.');
  }

  // Run conflict check
  const conflictCheck = await conflictService.checkConflict({
    resource: resourceId,
    startTime,
    endTime,
    expectedCapacity: event.expectedCapacity
  });

  if (conflictCheck.conflict) {
    // Context mapping for AI recommendation prompts
    const eventDetails = {
      title: event.title,
      type: event.type,
      expectedCapacity: event.expectedCapacity,
      date: new Date(startTime).toISOString().split('T')[0],
      startTime: new Date(startTime).toTimeString().split(' ')[0].substring(0, 5),
      endTime: new Date(endTime).toTimeString().split(' ')[0].substring(0, 5),
      requirements: event.requirements || [],
      department: event.department
    };

    const recResult = await aiService.generateAIResponse(eventDetails, resource);

    return {
      conflict: true,
      message: conflictCheck.reason,
      recommendations: recResult.recommendations
    };
  }

  // Create booking if no conflict
  const booking = await Booking.create({
    ...bookingData,
    user: userId
  });

  // Automatically update the resource status to 'booked' and update the event's resources array
  resource.status = 'booked';
  await resource.save();

  event.resources.push(resourceId);
  event.status = 'approved'; // Set event to approved once booking is secured
  await event.save();

  return await booking.populate([
    { path: 'resource' },
    { path: 'user', select: 'name email' },
    { path: 'event' }
  ]);
};

const getBookings = async () => {
  return Booking.find().populate('resource').populate('user', 'name email').populate('event');
};

const updateBookingStatus = async (id, status, user) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, 'Booking not found.');
  
  // Validate authorization: Admin and Dean can approve any booking.
  // Faculty can only approve bookings for resources belonging to their department.
  if (user.role !== 'admin' && user.role !== 'dean') {
    if (user.role === 'faculty') {
      const resource = await Resource.findById(booking.resource);
      if (!resource) {
        throw new ApiError(404, 'Resource not found.');
      }
      const resourceDept = resource.department ? resource.department.toString() : '';
      const userDept = user.department ? user.department.toString() : '';
      if (resourceDept !== userDept) {
        throw new ApiError(403, 'Not authorized. Only teachers of the same department can approve bookings.');
      }
    } else {
      throw new ApiError(403, 'Not authorized. Only department teachers and deans can approve bookings.');
    }
  }

  booking.status = status;
  await booking.save();

  // Concurrently update resource status
  const resource = await Resource.findById(booking.resource);
  if (resource) {
    if (status === 'approved') {
      resource.status = 'booked';
    } else if (status === 'rejected' || status === 'cancelled') {
      resource.status = 'available';
    }
    await resource.save();
  }

  // Trigger notification
  try {
    const notificationService = require('./notification.service');
    await notificationService.createNotification(
      booking.user,
      'Booking Status Update',
      `Your booking request for resource ${resource ? resource.name : 'venue'} has been ${status}.`,
      'booking'
    );
  } catch (err) {
    console.error('Failed to create notification:', err);
  }

  return booking;
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
