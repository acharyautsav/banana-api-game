// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * INTEROPERABILITY THEME: External Banana API Integration
 * ============================================================================
 * This service implements the interoperability layer of the enterprise application.
 * It communicates with a third-party external REST API (Marc Conrad's Banana API)
 * over HTTPS using JSON serialization.
 *
 * External API URL: https://marcconrad.com/uob/banana/api.php?out=json
 * Documentation:    https://marcconrad.com/uob/banana/doc.php
 *
 * Expected API response schema:
 * {
 *   "question": "https://www.sanfoh.com/uob/banana/data/....png",
 *   "solution": 0-9
 * }
 *
 * The solution is kept on the server only and never forwarded to client browsers.
 * ============================================================================
 */
import axios from 'axios';

const BANANA_API_URL = 'https://marcconrad.com/uob/banana/api.php?out=json';
const TIMEOUT_MS = 5000;

export const bananaService = {
  /**
   * Fetches a single puzzle from the external Banana API.
   * Validates the response shape and returns the question image URL and numeric solution.
   * Throws a descriptive error if the external service fails or times out.
   */
  async getPuzzle() {
    try {
      const response = await axios.get(BANANA_API_URL, {
        timeout: TIMEOUT_MS,
        headers: {
          Accept: 'application/json',
        },
      });

      const data = response.data;

      // Validate presence of data object
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format received from Banana API');
      }

      // Validate question image URL
      if (!data.question || typeof data.question !== 'string' || !data.question.startsWith('http')) {
        throw new Error('Banana API response missing valid question image URL');
      }

      // Validate solution: must be an integer between 0 and 9
      const solutionNum = Number(data.solution);
      if (
        data.solution === undefined ||
        data.solution === null ||
        Number.isNaN(solutionNum) ||
        solutionNum < 0 ||
        solutionNum > 9
      ) {
        throw new Error('Banana API response missing valid solution digit (0-9)');
      }

      return {
        questionUrl: data.question,
        solution: solutionNum,
      };
    } catch (error) {
      const errorMessage = error.response
        ? `Banana API responded with status ${error.response.status}`
        : error.code === 'ECONNABORTED'
        ? 'Banana API request timed out after 5 seconds'
        : error.message || 'Unknown network error contacting Banana API';

      console.error(`[Interoperability Error] ${errorMessage}`);
      throw new Error(`Failed to fetch puzzle from Banana API: ${errorMessage}`);
    }
  },
};

export default bananaService;
