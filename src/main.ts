import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

import * as os from 'os';

function getServerIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(new ValidationPipe());

  const PORT = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(PORT, '0.0.0.0');

  const ip = getServerIp();
  logger.log(`🚀 App corriendo en http://localhost:${PORT}`);
  logger.log(`🚀 En tu red: http://${ip}:${PORT}`);
}
bootstrap();