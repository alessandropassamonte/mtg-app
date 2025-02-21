import { Card } from "./card";

export class UserCard {
    id?: number;
    inVendita?: boolean;
    attivo?: boolean;
    foil?: boolean;
    card?: Card;
    lang?: string;
    date?: Date;
    quantita?: number;
}