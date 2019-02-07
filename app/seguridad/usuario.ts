export class Usuario {
  constructor(
    public Id?: number,
    public NombreCompleto?: string,
    public NombreUsuario?: string,
    public Contrasenia?: string,
    public Correo?: string,
    public Telefono?: string,
    public Identificacion?: string,
    public Estado?: string,
    public NombreGrupo?: string,
    public ClienteId?: number
  ) { }
}

export class Permiso {
  public static ADMINISTRADOR = "ADMIN";

  public static CONSULTA_FULL = "CONS_FULL";
  public static CONSULTA_VENDEDOR = "CONS_VEND";
  public static CONSULTA_EXTERNA = "CONS_EXTE";

  public static AUTORIZACIONES_FULL = "AUTH_FULL";
  public static AUTORIZACIONES_CRUD = "AUTH_CRUD";
  public static AUTORIZACIONES_TRACKING = "AUTH_TRACK";
  public static AUTORIZACIONES_REPORTE = "AUTH_REP";
  public static AUTORIZACIONES_REPORTE_IN_SITU = "AUTH_REP_SITU";

  public static ODAS = "ODAS";
  public static TRANSACCIONES = "TX";
  public static MOVIMIENTOS_REPORTE = "REP_MOV";
  public static AUDITORIAS = "AUDIT";

  public static TRANSACCIONES_CAMBIOS = "TX_CA";
  public static TRANSACCIONES_PAGOS = "TX_PA";
  public static TRANSACCIONES_CONTRATOS = "TX_CO";
  public static TRANSACCIONES_OTROS = "TX_OT";

  public static TRANSACCIONES_CAMBIO_CORRESPONDENCIA = "TX_CAMB_CORRES";
  public static TRANSACCIONES_PLAN = "TX_PL";
  public static TRANSACCIONES_TITULAR = "TX_TIT";
  public static TRANSACCIONES_EMPRESA = "TX_EMP";
  public static TRANSACCIONES_FORMA_PAGO = "TX_FORPAG";
  public static TRANSACCIONES_PAGO_INTELIGENTE = "TX_PAGINT";
  public static TRANSACCIONES_ANULACION = "TX_ANU";
  public static TRANSACCIONES_APLICACION_DESCUENTO = "TX_APL_DESC";
  public static TRANSACCIONES_BLOQUEO_DESBLOQUEO = "TX_BLODESMO";
  public static TRANSACCIONES_FACTURACION_MANUAL = "TX_FAC_MAN";
  public static TRANSACCIONES_QUITAR_CARENCIAS = "TX_QUIT_CAR";
  public static TRANSACCIONES_RENOVACION = "TX_RENOV";
  public static TRANSACCIONES_REACTIVACION = "TX_REAC";
  public static TRANSACCIONES_MANTENIMIENTO_OBS = "TX_MANOBS";
  public static TRANSACCIONES_EMISION_TARJETAS = "TX_EMITARJ";
  public static TRANSACCIONES_MOD_MATERNIDAD = "TX_MATER";
  public static TRANSACCIONES_MOD_BENEFICIARIO = "TX_MODBENE";
  public static TRANSACCIONES_ANTICIPADA = "TX_ANTICI";
  public static TRANSACCIONES_SEG_DESGRAVAMEN = "TX_SEGDESGR";
  public static TRANSACCIONES_REASIGNACION_CARTERA = "TX_REASIGNACION";


  public static PRESTADORES_FULL = "PREST_FULL";
  public static PRESTADORES_CONSULTAR = "PREST_CONS";
  public static PRESTADORES_AGENDAR_CITA = "PREST_AC";
  public static PRESTADORES_CALIFICACION = "PREST_CAL";

  //CATALOGO
  public static CATALOGOS_FULL = "CATG_FULL";
  public static CATALOGOS_DIAGNOSTICO = "CATG_DIAG";
  public static CATALOGOS_PROCEDIMIENTO = "CATG_PROC";
  public static CATALOGOS_VALOR_PUNTO = "CATG_VP";
  public static CATALOGOS_EDIT_VALOR_PUNTO = "EDIT_CATG_VP";


  public static SIMULADOR_CONSTITUCION = "SIM_CONS";
  public static SOBRES_POR_CONTRATO = "SB_X_CTR";
  public static SOBRES_CONSULTA = "SB_CON";
  public static SOBRES_INGRESAR = "SB_ING";
  public static SOBRES_ASIGNAR = "SB_ASIG";
  public static SOBRES_REPORTE = "SB_REP";
  public static SOBRES_CONSULTOR = "SB_CNT";
  public static SOBRES_ANULAR = "SB_ANUL";
  public static SOBRES_DEVOLUCION = "SB_DEV";
  public static SOBRES_AUTORIZAR = "SB_AUT";

  //CREDITOS
  public static INGRESAR_CREDITO = "INGR_CRED";
  public static REPORTE_CREDITO = "REP_CRED";
  public static ASIGNAR_CREDITO = "ASIG_CRED";
  public static CONSULTOR_CREDITO = "CONS_CRED";
  public static AUTORIZAR_CREDITO = "AUT_CRED";

  public static RETENCION_CONSULTA = "RET_CON";
  public static RETENCION_INFORMACION = "RET_INF";
  public static RETENCION_REPORTE = "RET_REP";
  public static RETENCION_PARAMETRO_DESCUENTO = "RET_PAR_DES";
  public static RETENCION_APROBACION = "RET_APRO";

  //Corporativo
  public static CORPORATIVO_FULL = "CORP_FULL";
  // public static CORPORATIVO_FULL = "CONS_FULL";
  public static CORPORATIVO_EMPRESA = "EMP_CORP";
  public static CORPORATIVO_GRUPO = "GRUP_CORP";
  public static CORPORATIVO_CREAR = "CREA_CORP";
  public static CORPORATIVO_TERMINOSCONDICIONES = "CORP_TC";
  public static CORPORATIVO_USUARIOSALUDADM = "USRSAL_CORP";

  //CORREDORES
  public static FULL_BRO = "FULL_BRO";
  public static CREA_BRO = "CREA_BRO";
  public static TC_BRO = "TC_BRO";
  public static GRUP_BRO ="GRUP_BRO";
  public static REASIG_BRO ="REASIG_BRO";
  public static REP_REASIG_BRO ="REP_REASIG_BRO";
  // COMISIONES
  public static COMISIONES_FULL = "COMS_FULL";
  public static COMISIONES_GRUPO = "COMS_GRUP";
  public static COMISIONES_AGENTEVENTA = "COMS_AGENTV";
  public static COMISIONES_AUDITORIA = "COMS_AUDIT"
  public static COMISIONES_BECAS = "COMS_BECAS";
  public static COMISIONES_TIPO = "COMS_TIPO";
  public static COMISIONES_REGION = "COMS_REGION";
  public static COMISIONES_TIPOVENDEDOR = "COMS_TIPOVENDEDOR";
  public static COMISIONES_MONTOVENTA = "COMS_MOVE";
  public static COMISIONES_BONO = "COMS_BONO";
  public static COMISIONES_CATEGORIA = "COMS_CATG";
  public static COMISIONES_BONOMENSUAL = "COMS_BONOMENSUAL";
  public static COMISIONES_BONOPLANCARRO = "COMS_BONOPC";
  public static COMISIONES_ESTADO = "COMS_ESTADO";
  public static COMISIONES_PERIODO = "COMS_PERIODO";
  public static COMISIONES_PLANCARROEJECUTIVO = "COMS_PLANCEJECUTIVO";
  public static COMISIONES_VACACIONES = "COMS_VACACIONES";
  public static COMISIONES_PREMIOSJEFESAGENCIAS = "COMS_PREMIOSJEFESAGENCIAS";
  public static COMISIONES_PREMIOS = "COMS_PREMIOS";
  public static COMISIONES_PREMIODIRECTORES = "COMS_PREMIODIRECTORES";
  public static COMISIONES_PREMIOSREQUISITOS = "COMS_PREMIOSREQUISITOS";
  public static COMISIONES_BONOMPCG = "COMS_BONOMPCG";
  public static COMISIONES_DIRECTORES = "COMS_DIRECTORES";
  public static COMISIONES_PREMIOONCARE = "COMS_PREMIOONCARE";
  public static COMISIONES_GRUPOVENDEDOR = "COMS_GRUPOVENDEDOR";
  //COMERCIAL
  public static DIRECTOR_VENTAS = "DIR_VENT";
  public static GERENTE_COMERCIAL = "GER_COMERCI";
  public static EJECUTIVO_COMERCIAL = "EJE_COMERC";

  public static ADMINISTRADOR_FUN = "ADMIN_FUN";
  public static CONSULTA_FUN = "CONS_FUN";
  public static CREA_FUN = "CREA_FUN";
  public static ASIGNA_FUN = "ASG_FUN";
  public static ANULA_FUN = "ANUL_FUN";
  public static REACTIVA_FUN = "REACT_FUN";
  public static ACTIVA_FUN_FACTURA_PREVIA = "FACTUR_PREV_FUN";

  //FACTURACION
  public static LOG_ERRORES = "LOG_ERR";
  public static PROCESO_FACTUARACION = "PROCESO_FACT";
  public static SALDOS_FAVOR = "SAL_FAV";
  public static NOTAS_CREDITO = "NOT_CRED";
  public static TAREA_PROGRAMADA_NOTAS_PCA = "PROG_NOT_PCA";
  public static TAREA_PROGRAMADA_NOTAS_LOTE = "PROG_NOT_LOT";
  public static CONSULTA_DOCS_ELECTRONICOS_DIRECTO_SRI = "CONSULT_DOCS_DIRECTO_SRI";
  public static COTIZACIONES_PRINCIPAL = "COTIZACIONES_PRINCIP";
  public static DESCUENTO_PARAMETRO = "CONT_DESC_PAR";

  //AGENDAR CITA
  public static AGENDA_CITA = "AG_CITA";

  //Planes Corporativo 
  public static CONSULTAR_PLANES_COR = "CONSULT_PLANES_COR";
  public static MODIFICAR_PLANES_COR = "MODIFICA_PLANES_COR";
  public static PORTAL_CLIENTES = "ADM_POR_CLI";

  //Cobranzas
  public static COBRAZAS_FULL = "COBRANZAS_FULL";
  public static REPORTE_COBRANZAS = "REPORTE_COBRANZAS";

  //PRESTADORES
  public static AGENDAR_CITA_CENTRO_MEDICO = "AG_CIT_CEN_MED";
  public static SOLICITUD_MEDICO_DESTACADO = "SOL_MED";
  public static CONSULTAR_SOLICITUD = "CON_SOL";
  public static CONSULTAR_CITA = "CON_CIT";
  public static ACTUALIZAR_CONVENIO = "ACT_CONV";
  public static INGRESAR_CONVENIO = "INS_CONV";

  //REPORTES FACTURACION
  public static REPORTE_MOROSOS_POR_COBRAR = "REP_MOR_COB";
  public static REPORTE_FACTURAS_EMITIDAS = "REP_FACT_EMI";
  public static REPORTE_CONSULTAS_PROBLEMAS = "REP_CON_PRO"

  //RECAUDOS 
  public static REACAUDOS_SALUD_PAY = "REC_SALUD_PAY";
  public static REACAUDOS_BOTON_CAJA_PICHINCHA = "REC_CAJA_PICHINCHA";
  public static GENERAR_ARCHIVOS_DEBITOS_INSTITUCIONES = "GEN_ARCH_DEB_INST";
  public static INGRESO_CAJA = "INGRESO_CAJA";

  // SERVICIOS ADICIONALES
  public static SRVAD_FULL = "SRVAD_FULL";
  public static SRVAD_BASES_QUERY = "SRVAD_BASES_QUERY";

  // ADMINISTRACION DE USUARIOS
  public static ADMIN_USU_ROL = "ADMIN_USU_ROL";

  //ADMINISTRACION DE RESERVAS
  public static REPORTE_RESERVAS = "ADMIN_REP_RESE"

  public static ADMIN_USU_ROL_ROL = "ADMIN_USU_ROL_ROL";
}