export class ConfiguracionFacturacion {
    constructor(
        public Id?: number,
        public UrlEnvioPruebas?: string,
        public UrlAutorizacionPruebas?: string,
        public UrlEnvioProduccion?: string,
        public UrlAutorizacionProduccion?: string,
        public UrlEnvioMail?: string,
        public IdCertificado?: number,
        public EmitidoPara?: string,
        public AmbienteActivo?: string,
        public SriActivo?: boolean,
        public EmisorEmail?: string,
        public CorreoElectronico?: string,
        public RutaDocumentosElectronicos?: string
    ) { }
}



