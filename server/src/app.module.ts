import {Module} from '@nestjs/common';
import {TrackModule} from './track/track.module';
import {MongooseModule} from '@nestjs/mongoose'

@Module({
	imports: [
		MongooseModule.forRoot(''),
		TrackModule
		]
})
export class AppModule {
	
}