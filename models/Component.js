const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const componentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  codeSnippet: { type: String, required: true }
});

componentSchema.plugin(mongoosePaginate);

const Component = mongoose.model('Component', componentSchema);

module.exports = Component;