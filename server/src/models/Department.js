const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  description: String,
  floors: { type: Number, default: 1, min: 1 },
  rooms: { type: Number, default: 0, min: 0 },
  labs: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
