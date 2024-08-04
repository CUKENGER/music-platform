import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AudioService } from "./audioService.service";

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [AudioService]
})
export class FileModule{

}