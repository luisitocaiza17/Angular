export class CoberturaPlan {
    constructor(
        public CodigoCobertura?: string,
        public Nombre?: string,
        public Monto?: number,
        public MontoConsumido?: number,
        public Tipo?: string,
        public MesesReposicion?: number,
        public Transicion?: boolean,
        public NombreCobertura?: string,

        public DiasCarenciaHospitalaria?: number,
        public DiasCarenciaAmbulatoria?: number,
        public DiasCarenciaPreexistencia?: number,
        public CodigoPlan?: string,
        public VersionPlan?: number,

        public EstadoCar?: boolean,
        public Maximo?: number,

        public AplicaRedConvenio?: number,
        public AplicaRedEspecifica?: number,
        public AplicaRedPrivada?: number,
        public AplicaOtros?: number,
        public CodigoProducto?: string,
        public Region?: string,

        //UIO
        public Selected?: boolean,
        public DiasCarenciaHospitalariaAux?: number,
        public DiasCarenciaAmbulatoriaAux?: number,
        public empresaNumero?:number,
        public codigoBeneficio?:string,
        public tabla?: boolean
    ) { }
}