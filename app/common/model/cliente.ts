export class ClienteEntity{
    constructor(
        public DocumentoIdentificacion?:string,
        public Nombres?:string,
        public ApellidoPaterno?:string,
        public ApellidoMaterno?:string,
        public Usuario?:string,
        public TelefonoFijo?:string,
        public TelefonoMovil?:string,
        public Email?:string,
        public FechaNacimiento?:Date,
        public UltimoAcceso?:Date,
        public EstaBloqueado?:Boolean,
        public CambiarContrasenia?:Boolean,
        public Selected?:Boolean
    ){

    }
}

export class ClienteFilter{
    constructor(
        public DocumentoIdentificacion?:string,
        public Nombres?:string,
        public ApellidoPaterno?:string,
        public ApellidoMaterno?:string
    ){

    }
}

export class ClientePassword{
    constructor(
        public DocumentoIdentificacion?:string,
        public PasswordMD5?:string
    ){
    
    }
}