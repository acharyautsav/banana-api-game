// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Axios API Client Configuration
 * Pre-configures an Axios instance with base URL pointing to the Express API.
 * Configured with `withCredentials: true` to ensure HTTP-only session cookies
 * are automatically sent with every request across cross-origin domains.
 */
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
