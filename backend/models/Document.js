const mongoose = require('mongoose');
const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileName: String,
  documentType: String,
  rawText: String,
  summary: String,
  clauses: [
    {
      title: String,
      original: String,
      simplified: String,
      risk: { type: String, enum: ['safe', 'warning', 'danger'] }
    }
  ],
  dangerCount: Number,
  warningCount: Number,
  overallRisk: { type: String, enum: ['Low', 'Medium', 'High'] },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Document', DocumentSchema);