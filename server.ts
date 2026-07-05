import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { config } from './src/config';
import { logger } from './src/logger';
import { requestLogger } from './src/api/middleware/requestLogger';
import { errorHandler } from './src/api/middleware/errorHandler';
import apiRouter from './src/api/routes/api';
import { WhatsAppService } from './src/bot/services/WhatsAppService';
import { AuditLogService } from './src/services/AuditLogService';
import { AnalyticsService } from './src/services/AnalyticsService';

async function startServer() {
  const app = express();
  
  // Initialize Core Services
  new AuditLogService();
  new AnalyticsService();

  // Initialize WhatsApp Bot
  const whatsappService = new WhatsAppService();
  whatsappService.connect().catch(err => logger.error({ err }, 'Failed to connect WhatsApp'));
  
  // Parse incoming JSON and URL encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Use request logger middleware
  app.use(requestLogger);

  // Mount API router
  app.use('/api', apiRouter);

  // Serve static assets & build single-page app
  if (config.NODE_ENV !== 'production') {
    logger.info('🚀 Starting Vite in development middleware mode...');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    logger.info('📦 Serving production static bundle...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Centralized Error Handling (must be registered after routes/middlewares)
  app.use(errorHandler);

  const port = config.PORT;
  app.listen(port, '0.0.0.0', () => {
    logger.info(`✅ NaijaBot Platform running on http://localhost:${port}`);
    logger.info(`🔍 Health check: http://localhost:${port}/api/health`);
  });
}

startServer().catch((error) => {
  logger.fatal({ error }, '❌ Failed to start NaijaBot Express server');
  process.exit(1);
});
