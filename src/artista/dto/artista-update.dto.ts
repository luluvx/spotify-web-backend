//import { ApiModelProperty } from '@nestjs/swagger';

import { IsNumber, IsOptional, IsString } from "class-validator";

//Dto recibe los datos del json

export class ArtistaUpdateDto {
    @IsOptional()
    @IsString()
    readonly nombre: string;

    @IsOptional()
    @IsNumber()
    readonly generoId: number;
}
