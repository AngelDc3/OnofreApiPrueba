import { Articulo } from "./entities.interface";

export interface ItemOrder {
    orderId: number;
    items: Articulo[];
}

export interface PayOrder {
    total: number;
    items: Articulo[];
}