import { Injectable } from "@nestjs/common";
import { Genero } from "./genero.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GeneroService {
    constructor(
        @InjectRepository(Genero)
        private generosRepository: Repository<Genero>,
    ) {}
    findAll(): Promise<Genero[]> {
        return this.generosRepository.find({ relations: ["artistas"] });
    }
    findById(id: number): Promise<Genero | null> {
        return this.generosRepository.findOne({ relations: ["artistas"], where: { id } });
    }
    async createGenero(genero: Genero): Promise<Genero> {
        return this.generosRepository.save(genero);
    }
    async updateGenero(id: number, genero: Genero): Promise<Genero> {
        await this.generosRepository.update(id, genero);
        return this.generosRepository.findOneBy({ id });
    }
    async deleteGenero(id: number): Promise<void> {
        await this.generosRepository.delete(id);
    }
}
