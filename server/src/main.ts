import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as compression from 'compression'
import * as timeout from 'connect-timeout';
import * as dotenv from 'dotenv'

dotenv.config();

const start = async () => {
	try {
		const PORT = parseInt(process.env.PORT,10) || 5000
 		const app = await NestFactory.create(AppModule)

		// чтобы отправлять запросы с браузера
		app.enableCors()

		app.use(compression())

		app.use(timeout('60s'))

 		await app.listen(PORT, '0.0.0.0')
		console.log(`server started at ${PORT}`)
	} catch(e) {
		console.log(e)
	}
}

start()