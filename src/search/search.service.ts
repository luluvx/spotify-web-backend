import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Artista } from "../artista/artista.model";
import { ILike, Repository } from "typeorm";
import { Album } from "../album/album.model";
import { Cancion } from "../cancion/cancion.model";

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(Artista)
        private readonly artistasRepository: Repository<Artista>,
        @InjectRepository(Album)
        private readonly albumesRepository: Repository<Album>,
        @InjectRepository(Cancion)
        private readonly cancionesRepository: Repository<Cancion>,
    ) {}

    async search(nombre: string) {
        const artistas = await this.artistasRepository.find({
            where: {
                nombre: ILike(`%${nombre}%`),
            },
        });

        const albumes = await this.albumesRepository.find({
            where: {
                titulo: ILike(`%${nombre}%`),
            },
        });

        const canciones = await this.cancionesRepository.find({
            where: {
                titulo: ILike(`%${nombre}%`),
            },
        });

        return {
            artistas,
            albumes,
            canciones,
        };
    }
}
