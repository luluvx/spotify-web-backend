import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Cancion } from "./cancion.model";
import { CancionService } from "./cancion.service";
import { CancionController } from "./cancion.controller";
import { Album } from "../album/album.model";

@Module({
    imports: [TypeOrmModule.forFeature([Cancion, Album])],
    controllers: [CancionController],
    providers: [CancionService],
    exports: [CancionService],
})
export class CancionModule {}
