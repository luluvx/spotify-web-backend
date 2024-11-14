import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AlbumService } from "./album.service";
import { AlbumDto } from "./dto/album.dto";
import { Album } from "./album.model";
import { AlbumUpdateDto } from "./dto/album-update.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "fs";

@Controller("albumes")
export class AlbumController {
    constructor(private albumService: AlbumService) {}
    @Get()
    list(): Promise<Album[]> {
        return this.albumService.findAll();
    }

    @Get(":id")
    async get(@Param("id") id: number): Promise<Album | null> {
        const albumDB = await this.albumService.findById(id);
        if (!albumDB) {
            throw new NotFoundException(`Album con id ${id} no encontrado`);
        }

        return albumDB;
    }

    @Post()
    create(@Body() album: AlbumDto): Promise<Album> {
        return this.albumService.createAlbum(album);
    }
    @Put(":id")
    async update(@Param("id") id: number, @Body() album: AlbumDto): Promise<Album> {
        const albumDB = await this.albumService.findById(id);
        if (!albumDB) {
            throw new NotFoundException(`Album con id ${id} no encontrado`);
        }
        return this.albumService.updateAlbum(id, album);
    }
    @Patch(":id")
    async patch(@Param("id") id: number, @Body() album: AlbumUpdateDto): Promise<Album> {
        const albumDB = await this.albumService.findById(id);
        if (!albumDB) {
            throw new NotFoundException(`Album con id ${id} no encontrado`);
        }
        return this.albumService.updateAlbum(id, album);
    }
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const albumDB = await this.albumService.findById(id);
        if (!albumDB) {
            throw new NotFoundException(`Album con id ${id} no encontrado`);
        }
        return this.albumService.deleteAlbum(id);
    }

    //upload archivo
    @Post(":id/imagen")
    @UseInterceptors(
        FileInterceptor("albumImagen", {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = "./public/albums";
                    if (!existsSync(uploadDir)) {
                        mkdirSync(uploadDir, { recursive: true });
                    }
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const albumId = req.params.id;
                    const fileName = `${albumId}.jpg`;
                    cb(null, fileName);
                },
            }),
        }),
    )
    async uploadAlbumImage(@Param("id") id: number, @UploadedFile() file: Express.Multer.File) {
        console.log(file);
        try {
            const album = await this.albumService.findById(id);
            if (!album) {
                throw new NotFoundException(`Album con id ${id} no encontrado`);
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
}
