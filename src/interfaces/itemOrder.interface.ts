import { Articulo } from "./entities.interface";

export interface ItemOrder {
    orderId: number;
    items: Articulo[];
}