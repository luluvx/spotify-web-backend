import { IsNotEmpty, IsNumber, IsString } from "class-validator";

//Dto recibe los datos del json

export class AlbumDto {
    @IsNotEmpty()
    @IsString()
    readonly titulo: string;

    @IsNotEmpty()
    @IsNumber()
    readonly artistaId: number;
}
