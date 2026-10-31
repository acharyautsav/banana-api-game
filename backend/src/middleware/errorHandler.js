// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Central Error Handler Middleware
 * Normalizes all uncaught errors in Express route handlers.
 * Specifically checks for external Banana API communication failures and returns
 * a user-friendly HTTP 502 Bad Gateway response.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Check if error originated from external Banana API failure
  const isBananaApiError =
    err.isBananaApi ||
    (err.message && err.message.toLowerCase().includes('banana api')) ||
    err.statusCode === 502;

  if (isBananaApiError) {
    return res.status(502).json({
      message: 'Puzzle service unavailable, please try again',
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
