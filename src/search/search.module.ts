import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";
import { Artista } from "../artista/artista.model";
import { Album } from "../album/album.model";
import { Cancion } from "../cancion/cancion.model";

@Module({
    imports: [TypeOrmModule.forFeature([Artista, Album, Cancion])],
    controllers: [SearchController],
    providers: [SearchService],
    exports: [SearchService],
})
export class SearchModule {}
