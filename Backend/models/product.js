const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit:{type:String,required:true},
  price: { type: Number, required: true },
  image:{ type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
