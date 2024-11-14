import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneroService } from "./genero.service";
import { Genero } from "./genero.model";

describe("GeneroService", () => {
    let service: GeneroService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([Genero])],
            providers: [GeneroService],
        }).compile();

        service = module.get<GeneroService>(GeneroService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
