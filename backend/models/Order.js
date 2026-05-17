import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: String, required: true },
    }
  ],
  totalCost: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  tableNumber: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Bill to Table', 'Direct Pay'],
    default: 'Bill to Table',
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Served'],
    default: 'Pending',
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', OrderSchema);
