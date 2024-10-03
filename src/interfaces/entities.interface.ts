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

export interface Order {
    idPedido: number;
    userId: string;  // UUID
    estado: string;
    deudaId: string;
    created: Date;
    updated: Date;
}

export interface OrderDetail {
    idPedido: number;
    idArticulo: number;
    cantidad: number;
    precio: number;
}
