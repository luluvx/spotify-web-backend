import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "../album/album.model";

@Entity()
export class Cancion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @ManyToOne(() => Album, album => album.canciones, {
        onDelete: "CASCADE",
    })
    album: Album;
}
