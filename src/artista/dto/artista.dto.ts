import { IsNotEmpty, IsNumber, IsString } from "class-validator";

//Dto recibe los datos del json

export class ArtistaDto {
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;

    @IsNotEmpty()
    @IsNumber()
    readonly generoId: number;
}
