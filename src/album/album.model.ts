import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Artista } from "../artista/artista.model";
import { Cancion } from "../cancion/cancion.model";

@Entity()
export class Album {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @ManyToOne(() => Artista, artista => artista.albums)
    artista: Artista;

    @OneToMany(() => Cancion, cancion => cancion.album, {
        cascade: true,
        onDelete: "CASCADE",
    })
    canciones: Cancion[];
}
