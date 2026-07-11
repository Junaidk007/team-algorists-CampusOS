const User = require('../models/User');
const Event = require('../models/Event');
const Resource = require('../models/Resource');
const Booking = require('../models/Booking');

const getDashboardStats = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    userCount,
    eventCount,
    resourceCount,
    activeBookingCount,
    availableResources,
    occupiedResources,
    bookedResources,
    pendingApprovals,
    todaysEvents
  ] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Resource.countDocuments(),
    Booking.countDocuments({ status: 'approved' }),
    Resource.countDocuments({ status: 'available' }),
    Resource.countDocuments({ status: 'occupied' }),
    Resource.countDocuments({ status: 'booked' }),
    Booking.countDocuments({ status: 'pending' }),
    Event.countDocuments({
      startDate: { $gte: todayStart, $lte: todayEnd }
    })
  ]);

  // Aggregate resource type counts
  const resourceTypeSummary = await Resource.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]);

  // Aggregate bookings by department
  const departmentSummary = await Resource.aggregate([
    {
      $group: {
        _id: '$department',
        totalResources: { $sum: 1 },
        bookedResources: {
          $sum: { $cond: [{ $eq: ['$status', 'booked'] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: 'departments',
        localField: '_id',
        foreignField: '_id',
        as: 'deptInfo'
      }
    },
    { $unwind: { path: '$deptInfo', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        departmentName: { $ifNull: ['$deptInfo.name', 'Unassigned'] },
        totalResources: 1,
        bookedResources: 1,
        utilizationRate: {
          $cond: [
            { $gt: ['$totalResources', 0] },
            { $multiply: [{ $divide: ['$bookedResources', '$totalResources'] }, 100] },
            0
          ]
        }
      }
    }
  ]);

  return {
    users: userCount,
    events: eventCount,
    resources: resourceCount,
    activeBookings: activeBookingCount,
    availableResources,
    occupiedResources,
    bookedResources,
    pendingApprovals,
    todaysEvents,
    resourceTypeSummary,
    departmentSummary
  };
};

module.exports = {
  getDashboardStats,
};
