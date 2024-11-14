import { Injectable, NotFoundException } from "@nestjs/common";
import { Cancion } from "./cancion.model";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CancionDto } from "./dto/cancion.dto";
import { Album } from "../album/album.model";
import { CancionUpdateDto } from "./dto/cancion-update.dto";

@Injectable()
export class CancionService {
    constructor(
        @InjectRepository(Cancion)
        private cancionesRepository: Repository<Cancion>,
        @InjectRepository(Album)
        private readonly albumesRepository: Repository<Album>,
    ) {}

    findAll(): Promise<Cancion[]> {
        return this.cancionesRepository.find();
    }

    findById(id: number): Promise<Cancion | null> {
        return this.cancionesRepository.findOne({
            relations: ["album", "album.artista"],
            where: { id },
        });
    }

    async createCancion(cancion: CancionDto): Promise<Cancion> {
        const album = await this.albumesRepository.findOneBy({ id: cancion.albumId });
        if (!album) {
            throw new NotFoundException(`Album con id ${cancion.albumId} no encontrado`);
        }
        const cancionNueva = this.cancionesRepository.create({
            titulo: cancion.titulo,
            album,
        });
        return this.cancionesRepository.save(cancionNueva);
    }
    async updateCancion(id: number, cancion: CancionUpdateDto): Promise<Cancion> {
        const album = await this.albumesRepository.findOneBy({ id: cancion.albumId });
        if (!album) {
            throw new NotFoundException(`Album con id ${cancion.albumId} no encontrado`);
        }
        const cancionDB = await this.cancionesRepository.findOneBy({ id });
        if (!cancionDB) {
            throw new NotFoundException(`Cancion con id ${id} no encontrada`);
        }
        if (album) {
            cancionDB.album = album;
        }
        cancionDB.titulo = cancion.titulo ?? cancionDB.titulo;
        await this.cancionesRepository.update(id, cancionDB);
        return this.cancionesRepository.findOneBy({ id });
    }
    async deleteCancion(id: number): Promise<void> {
        await this.cancionesRepository.delete(id);
    }
}
