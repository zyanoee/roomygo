export class Utente {
    username: string;
    nome: string;
    telefono: number;
    descrizione: string = '';
  

  constructor(username: string, nome: string, telefono: number, descrizione: string) {
    this.nome = nome;
    this.username = username;
    this.telefono = telefono;
    this.descrizione = descrizione;
  }
}