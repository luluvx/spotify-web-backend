//import { ApiModelProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from "class-validator";

//Dto recibe los datos del json

export class GeneroUpdateDto {
    @IsOptional()
    @IsString()
    readonly nombre: string;
}
