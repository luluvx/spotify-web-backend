import { IsNotEmpty, IsString } from "class-validator";

//Dto recibe los datos del json

export class GeneroDto {
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;
}
