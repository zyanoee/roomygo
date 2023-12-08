export class Prenotazione{
    
    id!:number
    user_id!:number
    username!:string
    nome!:string
    room_id!:number
    gestore_id: number
    nomeStanza!:string
    indirizzo!:string
    regione!:string
    numeroGestore!:string
    checkInData!:string
    checkOutData!:string

    constructor(id:number,
        user_id:number,
        username:string,
        nome:string,
        room_id:number,
        gestore_id:number,
        nomeStanza:string,
        indirizzo:string,
        regione:string,
        numeroGestore:string,
        checkInData:string,
        checkOutData:string,)
        {
            this.id = id;
            this.user_id = id;
            this.username = username;
            this.nome = nome;
            this.room_id = room_id;
            this.gestore_id = gestore_id;
            this.nomeStanza = nomeStanza;
            this.indirizzo = indirizzo;
            this.regione = regione;
            this.numeroGestore = numeroGestore;
            this.checkInData = checkInData;
            this.checkOutData = checkOutData;
        }
}