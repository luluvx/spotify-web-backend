//import { ApiModelProperty } from '@nestjs/swagger';

import { IsNumber, IsOptional, IsString } from "class-validator";

//Dto recibe los datos del json

export class AlbumUpdateDto {
    @IsOptional()
    @IsString()
    readonly titulo: string;

    @IsOptional()
    @IsNumber()
    readonly artistaId: number;
}
