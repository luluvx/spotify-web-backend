//import { ApiModelProperty } from '@nestjs/swagger';

import { IsNumber, IsOptional, IsString } from "class-validator";

//Dto recibe los datos del json

export class CancionUpdateDto {
    @IsOptional()
    @IsString()
    readonly titulo: string;

    @IsOptional()
    @IsNumber()
    readonly albumId: number;
}
