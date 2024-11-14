import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { GeneroService } from "./genero.service";
import { Genero } from "./genero.model";
import { GeneroDto } from "./dto/genero.dto";
import { GeneroUpdateDto } from "./dto/genero-update.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "fs";
import { ArtistaService } from "../artista/artista.service";

@Controller("generos")
export class GeneroController {
    constructor(
        private generosService: GeneroService,
        private readonly artistaService: ArtistaService,
    ) {}
    @Get()
    list(): Promise<Genero[]> {
        return this.generosService.findAll();
    }

    @Get(":id")
    async get(@Param("id") id: number): Promise<Genero | null> {
        const generoDB = await this.generosService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`Genero con id ${id} no encontrado`);
        }
        return generoDB;
    }
    //artistas por genero
    @Get(":id/artistas")
    async getArtistas(@Param("id") id: number) {
        const generoDB = await this.generosService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`Genero con id ${id} no encontrado`);
        }
        return this.artistaService.getArtistasByGeneroId(id);
    }

    @Post()
    create(@Body() genero: GeneroDto): Promise<Genero> {
        return this.generosService.createGenero({
            id: 0,
            nombre: genero.nombre,
        });
    }
    @Put(":id")
    async update(@Param("id") id: number, @Body() genero: GeneroDto): Promise<Genero> {
        const generoDB = await this.generosService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`Genero con id ${id} no encontrado`);
        }
        return this.generosService.updateGenero(id, {
            id: id,
            nombre: genero.nombre,
        });
    }
    @Patch(":id")
    async patch(@Param("id") id: number, @Body() genero: GeneroUpdateDto): Promise<Genero> {
        const generoDB = await this.generosService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`Genero con id ${id} no encontrado`);
        }
        return this.generosService.updateGenero(id, {
            id: id,
            nombre: genero.nombre ?? generoDB.nombre,
        });
    }
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const generoDB = await this.generosService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`Genero con id ${id} no encontrado`);
        }
        return this.generosService.deleteGenero(id);
    }
    //upload image

    @Post(":id/imagen")
    @UseInterceptors(
        FileInterceptor("generoImagen", {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = "./public/generos";
                    if (!existsSync(uploadDir)) {
                        mkdirSync(uploadDir, { recursive: true });
                    }
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const generoId = req.params.id;
                    const fileName = `${generoId}.jpg`;
                    cb(null, fileName);
                },
            }),
        }),
    )
    async uploadGeneroImage(@Param("id") id: number, @UploadedFile() file: Express.Multer.File) {
        try {
            const genero = await this.generosService.findById(id);
            if (!genero) {
                throw new NotFoundException(`Genero con id ${id} no encontrado`);
            }

            if (!file) {
                throw new NotFoundException("Imagen no encontrada");
            }
            return {
                filename: file.filename,
                path: file.path,
            };
        } catch (error) {
            throw new InternalServerErrorException(`Error al subir la imagen: ${error.message}`);
        }
    }
}
