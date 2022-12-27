import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { createLogger, format, transports } from 'winston';
import * as morgan from 'morgan';
import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';

async function bootstrap() {
  const { combine, timestamp, json } = format;

  const instance = createLogger({
    level: 'http',
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      json(),
    ),
    transports: [new transports.Console()],
  });

  const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
      stream: {
        write: (message) => instance.http(message.trim()),
      },
    },
  );

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });

  app.use(morganMiddleware);
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const options = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setVersion('1.0')
    //.addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);

  await app.listen(3000);
}
bootstrap();
