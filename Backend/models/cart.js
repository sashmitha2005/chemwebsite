const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Change 'Admin' to 'User'
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
