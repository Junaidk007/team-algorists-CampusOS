const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const ApiError = require('../utils/ApiError');

const checkConflict = async (bookingData) => {
  const { resource: resourceId, startTime, endTime, expectedCapacity, excludeBookingId } = bookingData;

  const resource = await Resource.findById(resourceId);
  if (!resource) {
    throw new ApiError(404, 'Resource not found.');
  }

  // 1. Capacity compatibility check
  if (expectedCapacity && resource.capacity < expectedCapacity) {
    return {
      conflict: true,
      reason: `Resource capacity (${resource.capacity}) is lower than the expected capacity (${expectedCapacity}).`
    };
  }

  // 2. Resource status check
  if (resource.status === 'occupied') {
    return {
      conflict: true,
      reason: 'Resource is currently marked as occupied.'
    };
  }

  // 3. Time overlap check
  // Finds any approved or pending bookings overlapping with requested timeslot
  const query = {
    resource: resourceId,
    status: { $in: ['pending', 'approved'] },
    $or: [
      { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
      { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
      { startTime: { $lte: new Date(startTime) }, endTime: { $gte: new Date(endTime) } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlap = await Booking.findOne(query);

  if (overlap) {
    return {
      conflict: true,
      reason: `Scheduling overlap detected with booking ID: ${overlap._id}.`
    };
  }

  return { conflict: false, reason: 'No conflicts detected.' };
};

module.exports = {
  checkConflict
};
