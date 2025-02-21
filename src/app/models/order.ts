import { OrderItem } from "./order-item";

export class Order {
    id?: number;
    orderItems?: OrderItem[];
    totalPrice?: number;
    totalPriceCardMarket?: number;
    orderDate?: Date;
    name?: string;
}