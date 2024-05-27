import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as compression from 'compression'
import * as timeout from 'connect-timeout';

const start = async () => {
	try {
		const PORT = process.env.PORT || 5000
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