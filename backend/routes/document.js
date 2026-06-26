const router = require('express').Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const auth = require('../middleware/auth');
const Document = require('../models/Document');

const upload = multer({ storage: multer.memoryStorage() });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeWithGroq = async (rawText) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert Indian legal document analyzer. Always respond with valid JSON only — no markdown, no backticks, no explanation outside JSON.'
      },
      {
        role: 'user',
        content: `Analyze this legal document and return ONLY a valid JSON object with this exact structure:
{
  "documentType": "<type of document>",
  "summary": "<3-4 sentence plain English summary>",
  "overallRisk": "<Low or Medium or High>",
  "clauses": [
    {
      "title": "<short clause name>",
      "original": "<actual clause text, max 100 words>",
      "simplified": "<explain in 1-2 simple sentences>",
      "risk": "<safe or warning or danger>"
    }
  ],
  "dangerCount": <number>,
  "warningCount": <number>,
  "keyThingsToKnow": [
    "<important thing 1>",
    "<important thing 2>",
    "<important thing 3>"
  ]
}

Document text:
${rawText.slice(0, 8000)}`
      }
    ],
    temperature: 0.3,
    max_tokens: 4000
  });

  const text = completion.choices[0].message.content;
  return JSON.parse(text.replace(/```json|```/g, '').trim());
};

// Analyze — PDF upload + paste text both supported
router.post('/analyze', auth, upload.single('document'), async (req, res) => {
  try {
    let rawText = '';

    if (req.file) {
      const data = await pdfParse(req.file.buffer);
      rawText = data.text;
    } else if (req.body.text) {
      rawText = req.body.text;
    } else {
      return res.status(400).json({ msg: 'No document provided' });
    }

    if (!rawText.trim()) {
      return res.status(400).json({ msg: 'Could not extract text from document' });
    }

    const analysis = await analyzeWithGroq(rawText);

    const doc = new Document({
      userId: req.user.id,
      fileName: req.file ? req.file.originalname : 'Pasted Text',
      rawText: rawText.slice(0, 5000),
      documentType: analysis.documentType,
      summary: analysis.summary,
      overallRisk: analysis.overallRisk,
      clauses: analysis.clauses,
      dangerCount: analysis.dangerCount,
      warningCount: analysis.warningCount,
      keyThingsToKnow: analysis.keyThingsToKnow
    });
    await doc.save();

    res.json({ success: true, document: doc });
  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ msg: 'Analysis failed', error: err.message });
  }
});

// Get history
router.get('/history', auth, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id })
      .select('-rawText')
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get single document — must be last
router.get('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ msg: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    await Document.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = router;