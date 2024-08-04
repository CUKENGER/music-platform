import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as compression from 'compression'
import * as timeout from 'connect-timeout';
import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

const start = async () => {
	try {
		const PORT = parseInt(process.env.PORT,10) || 5000
 		const app = await NestFactory.create(AppModule, {
			logger: ['log', 'error', 'warn', 'debug', 'verbose'],
		})

		app.enableCors({
			credentials: true,
			origin: process.env.CLIENT_URL,
		});
		app.use(cookieParser());
		app.use(compression())

		app.use(timeout('60s'))

		const config = new DocumentBuilder()
			.setTitle("NoteVomit")
			.setDescription("Music platform for poor")
			.setVersion("1.0.0")
			.addTag("CUKENGER")
			.build()
		const document = SwaggerModule.createDocument(app, config)
		SwaggerModule.setup('/api/docs', app, document)

		app.useGlobalInterceptors(new LoggingInterceptor())
		app.useGlobalPipes(new ValidationPipe());
		// app.useGlobalGuards(JwtAuthGuard)

 		await app.listen(PORT, '0.0.0.0')
		console.log(`server started at ${PORT}`)
	} catch(e) {
		console.log(e)
	}
}

start()