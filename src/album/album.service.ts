import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Album } from "./album.model";
import { Repository } from "typeorm";
import { Artista } from "../artista/artista.model";
import { AlbumDto } from "./dto/album.dto";
import { AlbumUpdateDto } from "./dto/album-update.dto";

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(Album)
        private albumRepository: Repository<Album>,
        @InjectRepository(Artista)
        private readonly artistasRepository: Repository<Artista>,
    ) {}

    findAll(): Promise<Album[]> {
        return this.albumRepository.find({ relations: ["canciones"] });
    }

    findById(id: number): Promise<Album | null> {
        
        return this.albumRepository.findOne({ relations: ["artista"], where: { id } });
    }

    //albums por artista id
    async getAlbumsByArtistaId(id: number): Promise<Album[]> {
        return this.albumRepository.find({ where: { artista: { id } } });
    }

    async createAlbum(album: AlbumDto): Promise<Album> {
        const artista = await this.artistasRepository.findOneBy({ id: album.artistaId });
        if (!artista) {
            throw new NotFoundException(`Artista con id ${album.artistaId} no encontrado`);
        }
        const albumNuevo = this.albumRepository.create({
            titulo: album.titulo,
            artista,
        });
        return this.albumRepository.save(albumNuevo);
    }

    async updateAlbum(id: number, album: AlbumUpdateDto): Promise<Album> {
        const artista = await this.artistasRepository.findOneBy({ id: album.artistaId });
        if (!artista) {
            throw new NotFoundException(`Artista con id ${album.artistaId} no encontrado`);
        }
        const albumDB = await this.albumRepository.findOneBy({ id });
        if (!albumDB) {
            throw new NotFoundException(`Album con id ${id} no encontrado`);
        }
        if (artista) {
            albumDB.artista = artista;
        }
        albumDB.titulo = album.titulo ?? albumDB.titulo;
        await this.albumRepository.update(id, albumDB);
        return this.albumRepository.findOneBy({ id });
    }
    async deleteAlbum(id: number): Promise<void> {
        await this.albumRepository.delete(id);
    }
}
