// models/Sale.js
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const saleSchema = new mongoose.Schema({
  clientId: {
    type: String, 
    required: true,
    unique: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientExpeditionDate: {
    type: Date, 
    required: true,
  },
  clientExpeditionPlace: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  product: {
    imeiOrSerial: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    }
  },
  paymentPlan: {
    type: Number, 
    default: 1,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  saleDate: {
    type: String, 
    default: () => moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss'), // Formato de fecha y hora en Bogotá
  },
});

module.exports = mongoose.model('Sale', saleSchema);
