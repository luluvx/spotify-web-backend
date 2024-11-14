import { IsNotEmpty, IsNumber, IsString } from "class-validator";

//Dto recibe los datos del json

export class CancionDto {
    @IsNotEmpty()
    @IsString()
    readonly titulo: string;

    @IsNotEmpty()
    @IsNumber()
    readonly albumId: number;
}
