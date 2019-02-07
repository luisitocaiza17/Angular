export class LogSuscripcionVitalityEntity{ 
    constructor(
        public PersonaIdentificacion?: string, 
        public Estado?: string,
        public Mensaje?: string,
        public CodigoVPMS ?: number,
        public FechaRespuesta?: Date
    ){ 

    }
}