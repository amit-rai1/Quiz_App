const mongoose = require('mongoose');
const testResponseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: String,
  responses: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedOption: String
    }
  ]
}, { timestamps: true });
module.exports = mongoose.model('TestResponse', testResponseSchema);