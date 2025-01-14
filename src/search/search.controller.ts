import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Get()
    async search(@Query("nombre") nombre: string) {
        return this.searchService.search(nombre);
    }
}
