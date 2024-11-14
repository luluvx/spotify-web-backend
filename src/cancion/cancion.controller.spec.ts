import { Test, TestingModule } from "@nestjs/testing";
import { CancionController } from "./cancion.controller";

describe("CancionController", () => {
    let controller: CancionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CancionController],
        }).compile();

        controller = module.get<CancionController>(CancionController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
