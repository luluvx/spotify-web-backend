import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ArtistaService } from "./artista.service";
import { Artista } from "./artista.model";
import { ArtistaDto } from "./dto/artista.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "fs";
import { ArtistaUpdateDto } from "./dto/artista-update.dto";
import { AlbumService } from "../album/album.service";

@Controller("artistas")
export class ArtistaController {
    constructor(
        private artistasService: ArtistaService,
        private readonly albumsService: AlbumService,
    ) {}

    @Get()
    list(): Promise<Artista[]> {
        return this.artistasService.findAll();
    }
    @Get(":id")
    async get(@Param("id") id: number): Promise<Artista | null> {
        const artistaDB = await this.artistasService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`Artista con id ${id} no encontrado`);
        }
        return artistaDB;
    }

    @Get(":id/albums/canciones")
    async getAlbumsWithCanciones(@Param("id") id: number): Promise<Artista | null> {
        const artistaDB = await this.artistasService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`Artista con id ${id} no encontrado`);
        }
        return this.artistasService.getAlbmsWithCanciones(id);
    }

    //albums por artista
    @Get(":id/albums")
    async getAlbums(@Param("id") id: number) {
        const artistaDB = await this.artistasService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`Artista con id ${id} no encontrado`);
        }
        return this.albumsService.getAlbumsByArtistaId(id);
    }

    @Post()
    create(@Body() artista: ArtistaDto): Promise<Artista> {
        return this.artistasService.createArtista(artista);
    }
    @Put(":id")
    async update(@Param("id") id: number, @Body() artista: ArtistaDto): Promise<Artista> {
        const artistaDB = await this.artistasService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`Artista con id ${id} no encontrado`);
        }
        return this.artistasService.updateArtista(id, artista);
    }
    @Patch(":id")
    async patch(@Param("id") id: number, @Body() artista: ArtistaUpdateDto): Promise<Artista> {
        const artistaDB = await this.artistasService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`Artista con id ${id} no encontrado`);
        }
        return this.artistasService.updateArtista(id, artista);
    }
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const artistaDB = await this.artistasService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`Artista con id ${id} no encontrado`);
        }
        return this.artistasService.deleteArtista(id);
    }
    @Post(":id/imagen")
    @UseInterceptors(
        FileInterceptor("artistaImagen", {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = "./public/artistas";
                    if (!existsSync(uploadDir)) {
                        mkdirSync(uploadDir, { recursive: true });
                    }
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const artistaId = req.params.id;
                    const fileName = `${artistaId}.jpg`;
                    cb(null, fileName);
                },
            }),
        }),
    )
    async uploadArtistaImage(@Param("id") id: number, @UploadedFile() file: Express.Multer.File) {
        console.log(file);
        try {
            const artista = await this.artistasService.findById(id);
            if (!artista) {
                throw new NotFoundException(`Artista con id ${id} no encontrado`);
            }
            if (!file) {
                throw new NotFoundException("Imagen no encontrada");
            }
            return {
                originalname: file.originalname,
                filename: file.filename,
                path: file.path,
            };
        } catch (error) {
            throw new InternalServerErrorException(`Error al subir la imagen: ${error.message}`);
        }
    }

    /*@Post(":id/imagen")
    @UseInterceptors(
        FileInterceptor("artistaImagen", {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = "./public/artistas";
                    if (!existsSync(uploadDir)) {
                        mkdirSync(uploadDir, { recursive: true });
                    }
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const artistaId = req.params.id;
                    const fileName = `${artistaId}.jpg`;
                    cb(null, fileName);
                },
            }),
        }),
    )
    async uploadArtistaImage(@Param("id") id: number, @UploadedFile() file: Express.Multer.File) {
        try {
            const artista = await this.artistasService.findById(id);
            if (!artista) {
                throw new NotFoundException(`Artista con id ${id} no encontrado`);
            }

            if (!file) {
                throw new NotFoundException("Imagen no encontrada");
            }

            artista.imagen = `public/artistas/${artista.id}.jpg`;

            const artistaUpdate = await this.artistasService.updateArtista(id, artista);
            return { message: "Imagen subida correctamente", artistaUpdate };
        } catch (error) {
            throw new InternalServerErrorException(`Error al subir la imagen: ${error.message}`);
        }
    }*/
}
