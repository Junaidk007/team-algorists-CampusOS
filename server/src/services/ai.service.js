const genAI = require('../config/gemini');
const { makePrompt } = require('../utils/geminiPrompt');
const Resource = require('../models/Resource');

// Schema validation helper
const validateRecommendationSchema = (jsonObj) => {
  if (!jsonObj || !Array.isArray(jsonObj.recommendations)) return false;
  if (jsonObj.recommendations.length !== 3) return false;

  for (const rec of jsonObj.recommendations) {
    if (
      typeof rec.priority !== 'number' ||
      !rec.type ||
      !rec.venueName ||
      !rec.alternativeTime ||
      !rec.alternativeDate ||
      !rec.reason
    ) {
      return false;
    }
  }
  return true;
};

// Programmatic fallback generator
const generateProgrammaticFallback = async (eventDetails, preferredVenue) => {
  console.log('Using programmatic fallback for recommendations...');
  const { expectedCapacity, department, date, startTime, endTime } = eventDetails;

  // Option 1: Find alternative venue in the same department
  const altVenue = await Resource.findOne({
    _id: { $ne: preferredVenue._id },
    department: department,
    type: preferredVenue.type,
    capacity: { $gte: expectedCapacity || 1 },
    status: 'available'
  });

  const parsedStart = new Date(`${date}T${startTime}`);
  const parsedEnd = new Date(`${date}T${endTime}`);

  const formatTimeStr = (start, end) => {
    return `${start.toTimeString().split(' ')[0].substring(0, 5)} - ${end.toTimeString().split(' ')[0].substring(0, 5)}`;
  };

  const formatDateStr = (d) => {
    return d.toISOString().split('T')[0];
  };

  // Option 2: Same venue, 2 hours later
  const timeLaterStart = new Date(parsedStart.getTime() + 2 * 60 * 60 * 1000);
  const timeLaterEnd = new Date(parsedEnd.getTime() + 2 * 60 * 60 * 1000);

  // Option 3: Same venue, next day
  const dateNextDay = new Date(parsedStart.getTime() + 24 * 60 * 60 * 1000);

  return {
    recommendations: [
      {
        priority: 1,
        type: 'alternative_venue',
        venueName: altVenue ? altVenue.name : 'No alternative venue available in department',
        alternativeTime: 'Original',
        alternativeDate: 'Original',
        reason: altVenue 
          ? `Alternative ${preferredVenue.type} in the same department with matching capacity.`
          : 'No other matching venues found in this department.'
      },
      {
        priority: 2,
        type: 'alternative_time',
        venueName: preferredVenue.name,
        alternativeTime: formatTimeStr(timeLaterStart, timeLaterEnd),
        alternativeDate: 'Original',
        reason: 'Shift the event by 2 hours on the same day.'
      },
      {
        priority: 3,
        type: 'alternative_date',
        venueName: preferredVenue.name,
        alternativeTime: 'Original',
        alternativeDate: formatDateStr(dateNextDay),
        reason: 'Keep the original time slot but shift the event to the next day.'
      }
    ]
  };
};

const generateAIResponse = async (eventDetails, preferredVenue) => {
  if (typeof eventDetails === 'string') {
    if (!genAI) {
      return `AI Analysis unavailable: Gemini API key is not configured. Summary: ${preferredVenue}`;
    }
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
      const prompt = `Task: ${eventDetails}\nContext: ${preferredVenue}`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini dashboard report error:', error);
      return `AI Report generation failed: ${error.message}`;
    }
  }

  // Gathers candidates for alternative venues (limit to top 5 candidates to avoid exceeding context)
  const availableResources = await Resource.find({
    _id: { $ne: preferredVenue._id },
    type: preferredVenue.type,
    status: 'available'
  }).limit(5).select('name type capacity floor facilities');

  // If Gemini client is not initialized, run fallback immediately
  if (!genAI) {
    return await generateProgrammaticFallback(eventDetails, preferredVenue);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const prompt = makePrompt(eventDetails, preferredVenue, availableResources);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Clean markdown wrappers if returned
    let cleanJson = responseText;
    if (responseText.startsWith('```json')) {
      cleanJson = responseText.replace(/```json|```/g, '').trim();
    } else if (responseText.startsWith('```')) {
      cleanJson = responseText.replace(/```/g, '').trim();
    }

    const parsedJson = JSON.parse(cleanJson);

    if (validateRecommendationSchema(parsedJson)) {
      console.log('Successfully validated Gemini recommendations response.');
      return parsedJson;
    } else {
      console.warn('Gemini response failed schema validation. Falling back.');
      return await generateProgrammaticFallback(eventDetails, preferredVenue);
    }

  } catch (error) {
    console.error('Gemini API/parsing error:', error);
    return await generateProgrammaticFallback(eventDetails, preferredVenue);
  }
};

module.exports = {
  generateAIResponse
};
