export interface Deuda {
    docId: string;
    label: string;
    payUrl: string;
    created: Date;
    updated: Date;
    objStatus: string;
    objStatusTime: Date;
    payStatusPaid: number;
    payStatusValue: number;
    payStatusTime: Date;
    validPeriodStart: Date;
    validPeriodEnd: Date;
}

export interface Pedido {
    idPedido: number;
    userId: string;  // UUID
    estado: string;
    deudaId: string;
    created: Date;
    updated: Date;
}

export interface DetallePedido {
    idPedido: number;
    idArticulo: number;
    cantidad: number;
    precio: number;
}

export interface Articulo {
    idArticulo: number;
    imagenUrl: string;
    cantidad: number;
    precio: number;
    descripcion: string;
}