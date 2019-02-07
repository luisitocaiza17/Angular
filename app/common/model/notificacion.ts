export class Notificacion{
    constructor(
        public CentralMedical?: string,
        public ResponseType?: string,
        public ErrorCode?: string,
        public ErrorMessage?: string
    ) { }   
}

export class NotificacionFilter{
    constructor(
        public CentralMedical?: string,
        public ApplicationID?: string,
        public Category?: number,
        public Tittle?: string,
        public Message?: string,
        public Data?: string,
        public Id?: string
    ) { }    
}