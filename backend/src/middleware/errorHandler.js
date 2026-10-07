export function errorHandler(err, req, res, next) {
  console.error('[Atelier Server Error]:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred in the luxury atelier system.';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    }
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Resource not found at '${req.originalUrl}'. Refer to /api-docs or / for available endpoints.`
  });
}
