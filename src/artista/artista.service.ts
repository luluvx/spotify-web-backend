import { Injectable, NotFoundException } from "@nestjs/common";

import { Artista } from "./artista.model";
import { Repository } from "typeorm";
import { Genero } from "../genero/genero.model";

import { ArtistaDto } from "./dto/artista.dto";
import { ArtistaUpdateDto } from "./dto/artista-update.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ArtistaService {
    constructor(
        @InjectRepository(Artista)
        private readonly artistasRepository: Repository<Artista>,
        @InjectRepository(Genero)
        private readonly generosRepository: Repository<Genero>,
    ) {}

    findAll(): Promise<Artista[]> {
        return this.artistasRepository.find({ relations: ["albums"] });
    }

    findById(id: number): Promise<Artista | null> {
        return this.artistasRepository.findOne({
            relations: ["genero"],
            where: { id },
        });
    }

    //artistas por genero id

    async getArtistasByGeneroId(id: number): Promise<Artista[]> {
        return this.artistasRepository.find({ where: { genero: { id } } });
    }

    async getAlbmsWithCanciones(id: number): Promise<Artista | null> {
        return this.artistasRepository.findOne({ relations: ["albums", "albums.canciones"], where: { id } });
    }

    getAlbums(id: number): Promise<Artista | null> {
        return this.artistasRepository.findOne({ relations: ["albums"], where: { id } });
    }
    async createArtista(artista: ArtistaDto): Promise<Artista> {
        const genero = await this.generosRepository.findOneBy({ id: artista.generoId });
        if (!genero) {
            throw new NotFoundException(`Genero con id ${artista.generoId} no encontrado`);
        }
        const artistaNuevo = this.artistasRepository.create({
            nombre: artista.nombre,
            genero,
        });
        return this.artistasRepository.save(artistaNuevo);
    }
    async updateArtista(id: number, artista: ArtistaUpdateDto): Promise<Artista> {
        const genero = await this.generosRepository.findOneBy({ id: artista.generoId });
        if (!genero) {
            throw new NotFoundException(`Genero con id ${artista.generoId} no encontrado`);
        }
        const artistasDb = await this.artistasRepository.findOneBy({ id });
        if (!artistasDb) {
            throw new NotFoundException(`Artista con id ${id} no encontrado`);
        }
        if (genero) {
            artistasDb.genero = genero;
        }
        artistasDb.nombre = artista.nombre ?? artistasDb.nombre;
        await this.artistasRepository.update(id, artistasDb);
        return this.artistasRepository.findOneBy({ id });
    }
    async deleteArtista(id: number): Promise<void> {
        await this.artistasRepository.delete(id);
    }
}
