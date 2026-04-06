import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FindProductsDto } from "src/common";
import { PRODUCTS_SERVICE } from "src/config";

@Injectable()
export class ProductsService {
    constructor(
        @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy
    ) { }

    findManyByIds(findProductsDto: FindProductsDto) {
        return this.productsClient.send({ cmd: 'find_many_by_ids' }, findProductsDto);
    }
}