export class AgenteVenta{
    constructor(
        public   CodigoVendedor?:string ,
        public   Codigo?:number ,
        public   NumeroPersona?:number,
        public   Persona?:string ,
        public   NumeroEmpresa?:number ,
        public   Empresa?:string ,
        public   CodigoSucursal?:number ,
        public   Sucursal?:string ,
        public   Tipo?:string ,
        public   CodigoDirector?:number ,
        public   Director?:string ,
        public   NumeroVendedores?:number ,
        public   FechaIngreso?:Date ,
        public   FechaSalida?:Date ,
        public   Region?:string ,
        public   CodigoGrupo?:number ,
        public   Grupo?:string ,
        public   Nombre?:string ,
        public   GrupoVenta?:string ,
        public   PorcentajeComision?:number ,
        public   NumeroCuentaContable?:string ,
        public   CodigoEstadoAgente?:number ,
        public   EstadoAgente?:string ,
        public   ComisionRenovacion?:number ,
        public   CodigoEstado?:number ,
        public   Estado?:string ,
        public   FechaModificacion?:Date ,
        public   DigitadorModificacion?:string ,
        public   HoraCreacion?:string ,
        public   HoraModificacion?:string ,
        public   ProgramaModificacion?:string ,
        public   FechaCreacion?:Date ,
        public   DigitadorCreacion?: string,
        public   ProgramaCreacion?:string ,
        public   FechaAnulacion?:Date ,
        public   DigitadorAnulacion?:string ,
        public   HoraAnulacion?:string ,
        public   RazonSocialBroker?:string ,
        public   RucBroker?:string ,
        public   ProgramaAnulacion?:string ,
        public   UsuarioWeb?:string ,
        public   ClaveWeb?:string ,
        public   EmailBroker?:string ,
        public   CodigoTipoContribuyente?:number ,
        public   TipoContribuyente?:string ,
        public   Nivel?:number ,
        public   CodigoTipo?:number ,
        public   EsImpresionDocumento?:boolean ,
        public   EsPermiso?:boolean ,
        public   LoginUsuario?:string ,
        public   AplicaPool?:boolean,
        public   AplicaCorporativo?:boolean ,
        public   AplicaIndividual?:boolean ,
        public   UsuarioDirectorioActivo?:string
    ) { }
}