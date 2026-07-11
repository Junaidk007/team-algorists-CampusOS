const makePrompt = (eventDetails, preferredVenue, availableResources) => {
  return `You are the AI Recommendation Engine for CampusOS, a university event and resource management system.
We have a venue booking conflict for the following event:
- Title: ${eventDetails.title}
- Type: ${eventDetails.type}
- Expected Capacity: ${eventDetails.expectedCapacity}
- Date: ${eventDetails.date}
- Start Time: ${eventDetails.startTime}
- End Time: ${eventDetails.endTime}
- Requirements: ${JSON.stringify(eventDetails.requirements)}

Preferred Venue (which is currently CONFLICTED/UNAVAILABLE):
- Name: ${preferredVenue.name}
- Type: ${preferredVenue.type}
- Capacity: ${preferredVenue.capacity}
- Floor: ${preferredVenue.floor}
- Facilities: ${JSON.stringify(preferredVenue.facilities)}

Available Alternative Venues in the University:
${JSON.stringify(availableResources, null, 2)}

Provide exactly 3 ranked recommendation options based on these strict guidelines:
- Option 1 (priority 1): Alternative venue in the same department/campus with best seating capacity and facilities match.
- Option 2 (priority 2): Same preferred venue, but at a different time slot (e.g. 2 hours later, or another feasible slot).
- Option 3 (priority 3): Same preferred venue, but on a different date (e.g. the next day, or a nearby date).

Your response MUST be strict JSON matching this schema:
{
  "recommendations": [
    {
      "priority": 1,
      "type": "alternative_venue",
      "venueName": "Name of the alternative venue suggested",
      "alternativeTime": "Original",
      "alternativeDate": "Original",
      "reason": "Brief reason under 30 words"
    },
    {
      "priority": 2,
      "type": "alternative_time",
      "venueName": "Name of the preferred venue",
      "alternativeTime": "Proposed start/end time slot (e.g. 14:00 - 17:00)",
      "alternativeDate": "Original",
      "reason": "Brief reason under 30 words"
    },
    {
      "priority": 3,
      "type": "alternative_date",
      "venueName": "Name of the preferred venue",
      "alternativeTime": "Original",
      "alternativeDate": "Proposed date (YYYY-MM-DD)",
      "reason": "Brief reason under 30 words"
    }
  ]
}

DO NOT return any markdown, HTML, backticks, or trailing text. Return ONLY the raw JSON string.`;
};

module.exports = {
  makePrompt
};
