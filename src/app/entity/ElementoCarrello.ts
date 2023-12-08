export class ElementoCarrello {
    id: string;
    stanza_id: string;
    prezzo: number;
    gestore_id: string;
    giorno: Date;
    ngiorni: number;
    valido: boolean;


    constructor(id: string, stanza_id: string, prezzo: number, gestore_id: string, giorno: Date, ngiorni: number, valido: boolean) {
        this.id = id;
        this.stanza_id = stanza_id;
        this.prezzo = prezzo;
        this.gestore_id = gestore_id;
        this.giorno = giorno;
        this.ngiorni = ngiorni;
        this.valido = valido;
      }

}
