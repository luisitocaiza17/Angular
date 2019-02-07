export class SeguimientoSobreEntity {
    constructor(

        //DATOS 
        public IdSeguimientoSobre?: number,
        public IdSobre?: number,
        public IdEstadoSobre?: number,
        public IdTipoDevolucion?: number,
        public IdTipoCobertura?: number,
        public IdMotivoDevolucion?: number,
        public MotivoDevolucion2?: string,
        //public string Novedad?: number, --> Ya no se usa
        public Nota1?: boolean,
        public Nota2?: boolean,
        //public bool Nota3?: number,  --> ya no se usa
        public ObservacionesGenerales?: string,
        public ObservacionesDevolucion?: string,
        public UsuarioAsigando?: string,
        public AsignadoPor?: string,
        public FechaSeguimiento?: Date,
        //public DateTime? FechaAsignacion?: number, --> ya no se usa
        public Nota4?: boolean,
        public IdMotivoDevolucionGestion?: number,
        public ObservacionesGestion?: string,
        public IdNovedadSobre?: number,
        public IdMotivoDevolucionNegativa?: number,
        public IdTipoCarta?: number,

        //DESCRIPCIONES DE LOS ID
        public DescripcionEstadoSobre?: string,
        public DescripcionTipoDevolucion?: string,
        public DescripcionTipoCobertura?: string,
        public DescripcionMotivoDevolucion?: string,
        public DescripcionMotivoDevolucionGestion?: string,
        public DescripcionNovedadSobre?: string,
        public DescripcionMotivoDevolucionNegativa?: string,
        public DescripcionTipoCarta?: string,
        public DescripcionNota1?: string,
        public DescripcionNota2?: string,
        //public string DescripcionNota3?: string,
        public DescripcionNota4?: string,

        //UIO 
        public Novedad?: number

    ) { }
}




