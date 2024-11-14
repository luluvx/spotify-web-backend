import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Album } from "./album.model";
import { AlbumService } from "./album.service";
import { Artista } from "../artista/artista.model";
import { AlbumController } from "./album.controller";
@Module({
    imports: [TypeOrmModule.forFeature([Album, Artista])],
    controllers: [AlbumController],
    providers: [AlbumService],
    exports: [AlbumService],
})
export class AlbumModule {}
