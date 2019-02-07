export class GrupoUsuario {
    constructor(
        public Apellidos?: string,
        public ApellidosNombres?: string,
        public Cargo?: string,
        public Cedula?: string,
        public CiudadCodigo?: string,
        public CiudadDescripcion?: string,
        public CompaniaCodigo?: string,
        public CompaniaDescripcion?: string,
        public Departamento?: string,
        public Email?: string,
        public Extension?: string,
        public JefeInmediato?: string[],
        public NombreCompleto?: string,
        public Nombres?: string,
        public NombresApellidos?: string,
        public Telefono?: string,
        public Usuario?: string,
        public UsuarioDominio?: string
    ) { }
}