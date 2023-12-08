export class Utente {
    username: string;
    nome: string;
    telefono: number;
    descrizione: string;
  

  constructor(username: string, nome: string, telefono: number, descrizione: string) {
    this.username = username;
    this.nome = nome;
    this.telefono = telefono;
    this.descrizione = descrizione;
  }
}