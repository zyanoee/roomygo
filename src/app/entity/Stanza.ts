export class Stanza {
    id: number;
    nome: string;
    tipoStanza: string;
    indirizzo: string;
    regione: string;
    gestore: string;
    prezzo: number;
    descrizione: string;
    carserv: boolean;
    wifiserv: boolean;
    acserv: boolean;
  

  constructor(id: number, nome: string, tipoStanza: string, indirizzo: string, regione: string, gestore: string, prezzo: number, descrizione: string,carserv: boolean,wifiserv: boolean,acserv: boolean) {
    this.id = id;
    this.nome = nome;
    this.tipoStanza = tipoStanza;
    this.indirizzo = indirizzo;
    this.regione = regione;
    this.gestore = gestore;
    this.prezzo = prezzo;
    this.descrizione = descrizione;
    this.carserv = carserv;
    this.wifiserv = wifiserv;
    this.acserv = acserv;
  }
}