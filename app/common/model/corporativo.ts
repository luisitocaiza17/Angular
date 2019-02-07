import { Sucursal } from './sucursal';
import { Usuario } from './usuario';
import * as moment from 'moment';

// Clases base para corporativo
export class EmpresaCoorporativo {
    constructor(public Numero?: number,
        public Nombre?: string,
        public CodigoAgenteVenta?: number,
        public AgenteVenta?: string,
        public Actividad?: string,
        public CodigoActividad?: number,
        public RazonSocial?: string,
        public Ruc?: string,
        public TipoSociedad?: string,
        public NombreGrupo?: string,
        public CodigoCiudad?: number,
        public Ciudad?: string,
        public Barrio?: string,
        public Calle?: string,
        public Zona?: string,
        public Casilla?: string,
        public Telefono?: string,
        public Fax?: string,
        public Email?: string,
        public NombresRepresentante?: string,
        public ApellidosRepresentante?: string,
        public CargoRepresentante?: string,
        public CedulaRepresentante?: string,
        public RelacionRepresentante?: string,
        public NombresFinanciero?: string,
        public ApellidosFinanciero?: string,
        public CargoFinanciero?: string,
        public CedulaFinanciero?: string,
        public FechaDigitacion?: Date,
        public PorcentajeComisionBroker?: number,
        public Digitador?: string,
        public AFavor?: number,
        public CodigoEstado?: number,
        public Estado?: string,
        public CodigoTecnico?: string,
        public EsPagoeligente?: boolean,
        public EmailRRHH?: string,
        public EmailBroker?: string,
        public NumeroGrupo?: number,
        public PerteneceGrupo?: boolean,
        public Telefono1?: string,
        public Telefono2?: string,
        public Fax1?: string,
        public DigitadorCreacion?: string,
        public FechaCreacion?: Date,
        public HoraCreacion?: string,
        public FechaModificacion?: Date,
        public DigitadorModificacion?: string,
        public HoraModificacion?: string,
        public FechaAnulacion?: Date,
        public DigitadorAnulacion?: string,
        public HoraAnulacion?: string,
        public CodigoUnidadAgente?: number,
        public UnidadAgente?: string,
        public ClaveWeb?: string,
        public CodigoAgenteContacto?: number,
        public AgenteContacto?: string,
        public PagointeligenteRRHH?: boolean,
        public PagointeligenteBroker?: boolean,
        public PagointeligenteContrato?: boolean,
        public Grupo?: string,
        public CodigoGrupo?: number,
        public EmpresaMision?: string,
        public EmpresaVision?: string,
        public EmpresaLogo?: string,
        public RepresentanteMail?: string,
        public RepresentanteCelular?: string,
        public PeriodoPago?: number,
        public PeriodoCopago?: number,
        public EmpresaPortal?: boolean,
        public NotificacionCopago?: number,
        public NotificacionPrefactura?: number,
        public ProvisionalCopago?: string,
        public ProvisionalCobertura?: string,
        public RepresentanteTelefono?: string,
        public BrokerContacto?: string,
        public BrokerTelefono?: string,
        public ContinuidadCobertura?: boolean,
        public CoberturaProvisional?: number) {
    }
}

// Clasess compuesta de trabajo
export class CorporativoEntity {
    constructor(public Empresa?: EmpresaCoorporativo,
        public Usuarios?: Usuario[],
        public Sucursal?: Sucursal,
        public Sucursales?: Sucursal[]) {
    }
}

// Clase de persona registro civil
export class PersonaEntity {
    constructor(
        public Celular: string,
        public Condicion_Cedulado: number,
        public Email_Personal: string,
        public Email_Trabajo: string,
        public Estado_Civil: number,
        public FechaConsulta: Date,
        public Fecha_Nacimiento: Date,
        public Genero: number,
        public Identificacion: string,
        public Nombre_Madre: string,
        public Nombre_Padre: string,
        public Primer_Apellido: string,
        public Primer_Nombre: string,
        public Segundo_Apellido: string,
        public Segundo_Nombre: string,
        public Telefono_Domicilio: string,
        public Telefono_Trabajo: string,
        public Tipo_Identificacion: number
    ) { }
}


// Fecha Creacion Modelo Corporativo 15/03/2018 - Pedro Benitez


export class CorporativoFilter {
    constructor(public Numero?: number,
        public Ruc?: string,
        public RazonSocial?: string) {
    }
}


export class CorporativoList {
    constructor(public Numero?: number,
        public Nombre?: string,
        public CodigoAgenteVenta?: number,
        public AgenteVenta?: string,
        public Actividad?: string,
        public CodigoActividad?: number,
        public RazonSocial?: string,
        public Ruc?: string,
        public TipoSociedad?: string,
        public NombreGrupo?: string,
        public CodigoCiudad?: number,
        public Ciudad?: string,
        public Barrio?: string,
        public Calle?: string,
        public Zona?: string,
        public Casilla?: string,
        public Telefono?: string,
        public Fax?: string,
        public Email?: string,
        public NombresRepresentante?: string,
        public ApellidosRepresentante?: string,
        public CargoRepresentante?: string,
        public CedulaRepresentante?: string,
        public RelacionRepresentante?: string,
        public NombresFinanciero?: string,
        public ApellidosFinanciero?: string,
        public CargoFinanciero?: string,
        public CedulaFinanciero?: string,
        public FechaDigitacion?: Date,
        public PorcentajeComisionBroker?: number,
        public Digitador?: string,
        public AFavor?: number,
        public CodigoEstado?: number,
        public Estado?: string,
        public CodigoTecnico?: string,
        public EsPagoeligente?: boolean,
        public EmailRRHH?: string,
        public EmailBroker?: string,
        public NumeroGrupo?: number,
        public PerteneceGrupo?: boolean,
        public Telefono1?: string,
        public Telefono2?: string,
        public Fax1?: string,
        public DigitadorCreacion?: string,
        public FechaCreacion?: Date,
        public HoraCreacion?: string,
        public FechaModificacion?: Date,
        public DigitadorModificacion?: string,
        public HoraModificacion?: string,
        public FechaAnulacion?: Date,
        public DigitadorAnulacion?: string,
        public HoraAnulacion?: string,
        public CodigoUnidadAgente?: number,
        public UnidadAgente?: string,
        public ClaveWeb?: string,
        public CodigoAgenteContacto?: number,
        public AgenteContacto?: string,
        public PagoeligenteRRHH?: boolean,
        public PagoeligenteBroker?: boolean,
        public PagoeligenteContrato?: boolean,
        public Grupo?: string,
        public CodigoGrupo?: number,
        public EmpresaMision?: string,
        public EmpresaVision?: string,
        public EmpresaLogo?: string,
        public RepresentanteMail?: string,
        public RepresentanteCelular?: string,
        public PeriodoPago?: number,
        public PeriodoCopago?: number,
        public EmpresaPortal?: boolean,
        public NotificacionCopago?: number,
        public NotificacionPrefactura?: number,
        public ProvisionalCopago?: string,
        public ProvisionalCobertura?: string,
        public RepresentanteTelefono?: string,
        public BrokerContacto?: string,
        public BrokerTelefono?: string,
        public ContinuidadCobertura?: boolean,
        public NombreFinanciero?: string
    ) {
    }
}

export class DatosCorporativo {
    constructor(public datosCorporativo?: EmpresaCoorporativo) {
    }
}


export class EmpresaDireccion {
    constructor
        (public calle1?: string,
        public calle2?: string,
        public referencia?: string) {
    }
}



// Administración Usuarios SALUD 13/11/2018 - criscool

export class UsuarioFilter {
    constructor(public Cedula?: string,
                public Nombre?: string,
                public NombreUsuario?: string) {
    }
}

// Clase del Usuario
export class SEGUsuario {
    constructor(
        public Id?: number,
        public IdEmpresa?: number,
        public IdGrupo?: number,
        public Cedula?: string,
        public NombreApellido?: string,
        public Email?: string,
        public Telefono?: string,
        public NombreUsuario?: string,
        public Contrasena?: string,
        public TelefonoFijo?: string,
        public Extension?: string,
        public RUCEmpresa?: string,
        public Estado?: number,
        public Region?: string,
        public FechaCreacion?: Date,
        public TerminosCondicionesAprobado?: number,
        public ADUsuario?: boolean) { }
}

// Clase para grabar los usuarios
export class ObjUsuario {
    constructor(
        public usuario?: SEGUsuario,
        public lstPermisos?: SEGPermiso[],
        public ModificadoPorID?: number,
        public ModificadoPor?: string) {
    }
}

// Objeto que trae las propiedades del Usuario del AD
export class UsuarioEntity {
    constructor(
        public Nombres?: string,
        public NombreUsuario?: string,
        public Contrasenia?: string,
        public Correo?: string,
        public Telefono?: string,
        public Identificacion?: string,
        public Estado?: string,
        public Cargo?: string,
        public Compannia?: string,
        public Departamento?: string,
        public CodigoCiudad?: string,
        public NombreGrupo?: string,
        public ClienteId?: number) {
    }
}

// Objeto que trae todos los permisos activos
export class SEGPermiso {
    constructor(
        public IDPermiso?: number,
        public Nombre?: string,
        public Activo?: boolean) {
    }
}

// Objeto que trae todos los permisos activos
export class SEGPermisoUsuario {
    constructor(
        public IDPermiso?: number,
        public IDUsuario?: number,
        public IDEmpresa?: number) {
    }
}
