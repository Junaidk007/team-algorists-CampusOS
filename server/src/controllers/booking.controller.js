const bookingService = require('../services/booking.service');
const conflictService = require('../services/conflict.service');
const ApiResponse = require('../utils/ApiResponse');

const create = async (req, res, next) => {
  try {
    const result = await bookingService.createBooking(req.body, req.user.id);
    if (result.conflict) {
      return res.status(409).json({
        success: false,
        message: result.message || 'Scheduling conflict detected.',
        data: {
          conflict: true,
          recommendations: result.recommendations
        }
      });
    }
    res.status(201).json(new ApiResponse(201, result, 'Booking created successfully.'));
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const bookings = await bookingService.getBookings();
    res.status(200).json(new ApiResponse(200, bookings, 'Bookings retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, status, req.user);
    res.status(200).json(new ApiResponse(200, booking, `Booking status updated to ${status}.`));
  } catch (error) {
    next(error);
  }
};

const checkConflict = async (req, res, next) => {
  try {
    const result = await conflictService.checkConflict(req.body);
    res.status(200).json(new ApiResponse(200, result, 'Conflict check completed.'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  updateStatus,
  checkConflict,
};
