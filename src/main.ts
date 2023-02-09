import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { config as populateProcessEnvConfigFromFile } from 'dotenv';
import helmet from 'helmet';
import { collectDefaultMetrics, Counter } from 'prom-client';
import * as path from 'path';
import { AppModule } from './app.module';
import apiConfig from './configs/api.config';
import corsConfig from './configs/cors.config';
import documentationConfig from './configs/documentation.config';

populateProcessEnvConfigFromFile({
  path: path.resolve(process.cwd(), 'config', '.env'),
});

const counter = new Counter({
  name: process.env.NODE_ENV,
  help: 'metric_help',
});
counter.inc(); // Increment by 1
async function bootstrap() {
  collectDefaultMetrics();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: corsConfig().getAllowedOrigins(),
    methods: corsConfig().getAllowedMethods(),
    allowedHeaders: corsConfig().getAllowedHeaders(),
    exposedHeaders: corsConfig().getExposedHeaders(),
    credentials: corsConfig().requireCredentials(),
  });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  if (false === apiConfig().isProduction()) {
    const document = SwaggerModule.createDocument(
      app,
      documentationConfig().getOpenApiDocument(),
      {
        deepScanRoutes: true,
      },
    );
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(apiConfig().getHttpsPort());
}
void bootstrap()
  .then(() => {
    // Restart counter
    counter.inc();
    // eslint-disable-next-line no-console
    console.log(
      'Service listening 👍: ',
      apiConfig().getEnvironment(),
      apiConfig().getVersion(),
      apiConfig().getHttpsPort(),
    );
  })
  .catch(() => counter.inc());
