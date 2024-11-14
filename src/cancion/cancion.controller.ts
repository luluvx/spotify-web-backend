import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CancionService } from "./cancion.service";
import { Cancion } from "./cancion.model";
import { CancionDto } from "./dto/cancion.dto";
import { CancionUpdateDto } from "./dto/cancion-update.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { existsSync, mkdirSync } from "fs";

@Controller("canciones")
export class CancionController {
    constructor(private cancionesService: CancionService) {}
    @Get()
    list(): Promise<Cancion[]> {
        return this.cancionesService.findAll();
    }
    @Get(":id")
    async get(@Param("id") id: number): Promise<Cancion | null> {
        const cancionDB = await this.cancionesService.findById(id);
        if (!cancionDB) {
            throw new NotFoundException(`Cancion con id ${id} no encontrada`);
        }
        return cancionDB;
    }
    @Post()
    create(@Body() cancion: CancionDto): Promise<Cancion> {
        return this.cancionesService.createCancion(cancion);
    }
    @Put(":id")
    async update(@Param("id") id: number, @Body() cancion: CancionDto): Promise<Cancion> {
        const cancionDB = await this.cancionesService.findById(id);
        if (!cancionDB) {
            throw new NotFoundException(`Cancion con id ${id} no encontrada`);
        }
        return this.cancionesService.updateCancion(id, cancion);
    }
    @Patch(":id")
    async patch(@Param("id") id: number, @Body() cancion: CancionUpdateDto): Promise<Cancion> {
        const cancionDB = await this.cancionesService.findById(id);
        if (!cancionDB) {
            throw new NotFoundException(`Cancion con id ${id} no encontrada`);
        }
        return this.cancionesService.updateCancion(id, cancion);
    }
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const cancionDB = await this.cancionesService.findById(id);
        if (!cancionDB) {
            throw new NotFoundException(`Cancion con id ${id} no encontrada`);
        }
        await this.cancionesService.deleteCancion(id);
    }
    //upload archivo
    @Post(":id/archivo")
    @UseInterceptors(
        FileInterceptor("archivo", {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = "./public/canciones";
                    if (!existsSync(uploadDir)) {
                        mkdirSync(uploadDir, { recursive: true });
                    }
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const cancionId = req.params.id;
                    const filename = `${cancionId}.mp3`;
                    cb(null, filename);
                },
            }),
        }),
    )
    async uploadAlbumImage(@Param("id") id: number, @UploadedFile() file: Express.Multer.File) {
        try {
            const cancion = await this.cancionesService.findById(id);
            if (!cancion) {
                throw new NotFoundException(`Cancion con id ${id} no encontrado`);
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
    //upload imagen
    @Post(":id/imagen")
    @UseInterceptors(
        FileInterceptor("imagenCancion", {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = "./public/canciones/imagenes";
                    if (!existsSync(uploadDir)) {
                        mkdirSync(uploadDir, { recursive: true });
                    }
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const cancionId = req.params.id;
                    const filename = `${cancionId}.jpg`;
                    cb(null, filename);
                },
            }),
        }),
    )
    async uploadAlbumImage2(@Param("id") id: number, @UploadedFile() file: Express.Multer.File) {
        try {
            const cancion = await this.cancionesService.findById(id);
            if (!cancion) {
                throw new NotFoundException(`Cancion con id ${id} no encontrado`);
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
