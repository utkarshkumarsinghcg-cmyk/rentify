const PhoneLimit = require('../models/PhoneLimit');

/**
 * Check if the daily SMS limit has been reached.
 * Limit: 330 OTPs per day across the entire application.
 */
exports.checkPhoneLimit = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    let limitDoc = await PhoneLimit.findOne({ date: today });
    
    if (!limitDoc) {
      limitDoc = await PhoneLimit.create({ date: today, count: 0 });
    }

    if (limitDoc.count >= 330) {
      return res.status(429).json({ 
        error: 'Daily SMS limit reached. Please use Email OTP or try again tomorrow.' 
      });
    }

    res.json({ success: true, count: limitDoc.count });
  } catch (error) {
    console.error('[Phone Limit] Check error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Increment the daily SMS count.
 */
exports.incrementPhoneLimit = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const limitDoc = await PhoneLimit.findOneAndUpdate(
      { date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    res.json({ success: true, count: limitDoc.count });
  } catch (error) {
    console.error('[Phone Limit] Increment error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
