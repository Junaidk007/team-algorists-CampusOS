const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['classroom', 'laboratory', 'seminar_hall', 'auditorium', 'conference_room']
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  floor: { type: Number, default: 0 },
  capacity: { type: Number, default: 1, min: 1 },
  facilities: [{ type: String }],
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'booked'], 
    default: 'available' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
