const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  expectedCapacity: { type: Number, default: 1, min: 1 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  requirements: [{ type: String }],
  preferredVenue: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'], 
    default: 'pending' 
  },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
