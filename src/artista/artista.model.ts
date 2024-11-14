import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Genero } from "../genero/genero.model";
import { Album } from "../album/album.model";

@Entity()
export class Artista {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @ManyToOne(() => Genero, genero => genero.artistas)
    genero: Genero;

    @OneToMany(() => Album, album => album.artista)
    albums: Album[];
}
