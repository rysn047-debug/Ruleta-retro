// netlify/functions/fetch-games.js

// The handler function is the entry point for the serverless function.
// It receives an 'event' object with request data.
exports.handler = async function(event, context) {

  // Get the search query from the URL parameters (?search=tekken)
  const searchQuery = event.queryStringParameters.search || 'fighting';

  // Store the API key securely. This is a Netlify environment variable.
  // NEVER write the key directly here in a public repository.
  const API_KEY = process.env.RAWG_API_KEY;

  // Construct the API URL to fetch data from RAWG.
  const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(searchQuery)}&page_size=40`;

  try {
    // We need to import 'node-fetch' to make requests in a Node.js environment.
    const fetch = (await import('node-fetch')).default;

    // Make the actual request to the RAWG API.
    const response = await fetch(API_URL);

    // Check if the request was successful.
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API Error: ${response.statusText}` })
      };
    }

    // Parse the JSON data from the response.
    const data = await response.json();

    // Return a successful response to the front-end with the fetched data.
    return {
      statusCode: 200,
      // The body must be a string, so we stringify the JSON data.
      body: JSON.stringify(data.results),
    };

  } catch (error) {
    // Handle any network or other errors during the fetch.
    console.error('Error fetching from RAWG API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch games.' }),
    };
  }
};