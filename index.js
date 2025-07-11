const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const noblox = require('noblox.js');
const rateLimit = require('express-rate-limit');

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'active', service: 'Roblox Group Management API' });
});

// Shout endpoint
app.get('/Shout', async (req, res) => {
  try {
    const { groupid, cookie, shoutstring } = req.query;
    
    // Validate inputs
    if (!groupid || !cookie || !shoutstring) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    await noblox.setCookie(cookie);
    const decodedShout = decodeURIComponent(shoutstring.replace(/\+/g, ' '));
    
    const shoutResult = await noblox.shout(parseInt(groupid), decodedShout);
    res.status(200).json({ success: true, message: 'Shout successful', data: shoutResult });
  } catch (error) {
    console.error('Shout error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to post shout',
      details: error.message 
    });
  }
});

// Set Rank endpoint
app.get('/setRank', async (req, res) => {
  try {
    const { groupid, cookie, target, rankid } = req.query;
    
    // Validate inputs
    if (!groupid || !cookie || !target || !rankid) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    await noblox.setCookie(cookie);
    
    const rankResult = await noblox.setRank(
      parseInt(groupid),
      parseInt(target),
      parseInt(rankid)
    );
    
    res.status(200).json({ 
      success: true, 
      message: 'Rank set successfully',
      data: rankResult 
    });
  } catch (error) {
    console.error('SetRank error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to set rank',
      details: error.message 
    });
  }
});

// Promote endpoint
app.get('/Promote', async (req, res) => {
  try {
    const { groupid, cookie, target } = req.query;
    
    // Validate inputs
    if (!groupid || !cookie || !target) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    await noblox.setCookie(cookie);
    
    const promotionResult = await noblox.promote(
      parseInt(groupid),
      parseInt(target)
    );
    
    res.status(200).json({ 
      success: true, 
      message: 'Promotion successful',
      data: promotionResult 
    });
  } catch (error) {
    console.error('Promote error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to promote user',
      details: error.message,
      possibleReasons: [
        'Invalid permissions',
        'User already at highest rank',
        'Target user not in group',
        'Invalid cookie'
      ]
    });
  }
});

// Demote endpoint
app.get('/Demote', async (req, res) => {
  try {
    const { groupid, cookie, target } = req.query;
    
    // Validate inputs
    if (!groupid || !cookie || !target) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    await noblox.setCookie(cookie);
    
    const demotionResult = await noblox.demote(
      parseInt(groupid),
      parseInt(target)
    );
    
    res.status(200).json({ 
      success: true, 
      message: 'Demotion successful',
      data: demotionResult 
    });
  } catch (error) {
    console.error('Demote error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to demote user',
      details: error.message,
      possibleReasons: [
        'Invalid permissions',
        'User already at lowest rank',
        'Target user not in group',
        'Invalid cookie'
      ]
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Roblox Group Management API running on port ${port}`);
  console.log(`Endpoints:`);
  console.log(`- GET /Shout?groupid=GROUPID&cookie=COOKIE&shoutstring=MESSAGE`);
  console.log(`- GET /setRank?groupid=GROUPID&cookie=COOKIE&target=USERID&rankid=RANKID`);
  console.log(`- GET /Promote?groupid=GROUPID&cookie=COOKIE&target=USERID`);
  console.log(`- GET /Demote?groupid=GROUPID&cookie=COOKIE&target=USERID`);
});
