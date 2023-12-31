import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

/**
 * Bootstrap function to create and start the NestJS application.
 *
 * @async
 * @returns {Promise<void>}
 */
async function bootstrap(): Promise<void> {
  // Create the NestJS application instance
  const app: INestApplication = await NestFactory.create(AppModule);

  // Apply a global validation pipe to handle input validation
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  // Start listening on the specified port
  await app.listen(process.env.PORT || 3000);
}

// Call the bootstrap function and handle potential errors
bootstrap().catch((err: Error) => {
  console.error(err);
});
