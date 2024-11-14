import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Album } from "./album/album.model";
import { Cancion } from "./cancion/cancion.model";
import { AlbumModule } from "./album/album.module";

import { Artista } from "./artista/artista.model";
import { CancionModule } from "./cancion/cancion.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { DataSource } from "typeorm";
import { GeneroController } from "./genero/genero.controller";
import { GeneroService } from "./genero/genero.service";
import { Genero } from "./genero/genero.model";
import { ArtistaController } from "./artista/artista.controller";
import { ArtistaService } from "./artista/artista.service";
import { SearchController } from "./search/search.controller";
import { SearchService } from "./search/search.service";
import { SearchModule } from "./search/search.module";

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "public"),
            serveRoot: "/public",
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "root",
            database: "spotifydb",
            entities: [Genero, Album, Cancion, Artista], //entity-base de datos, dto-obtener json
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Genero, Artista, Album, Cancion]),
        AlbumModule,
        CancionModule,
        SearchModule,
    ],
    controllers: [AppController, GeneroController, ArtistaController],
    providers: [AppService, GeneroService, ArtistaService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
