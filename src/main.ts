import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildGlobalValidationPipe } from './core/http/validation/validations.pipe';
import { HttpExceptionFilter } from './core/http/exeptions/http-exception.filter';
import { ResponseInterceptor } from './core/http/interceptors/response.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(buildGlobalValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter()); // -> transforme toutes les erreurs (DomainError, HttpException...) en { code, message, fields?, details? }
  app.useGlobalInterceptors(new ResponseInterceptor()); // -> transforme toutes les reponses OK en { data, meta? }
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
