import { Request, Response, NextFunction } from 'express';

/**
 * CSRF Protection Middleware
 * Checks for a custom header to ensure the request is coming from our own frontend.
 * Browsers prevent cross-origin requests from adding custom headers without CORS preflight approval.
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Allow GET, HEAD, OPTIONS requests without the header
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Check for the custom header
  const csrfHeader = req.headers['x-requested-with'];
  
  if (!csrfHeader || csrfHeader !== 'XMLHttpRequest') {
    return res.status(403).json({ 
      message: 'CSRF validation failed. Missing or invalid X-Requested-With header.' 
    });
  }

  next();
};
