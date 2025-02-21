import { Card } from "./card";

export class OrderItem {
    id?: number;
    card?: Card;
    price?: number;
    priceCM?: number;
    quantity?: number;
    foil?: boolean;
}