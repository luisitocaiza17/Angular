export class Guias {
    public static values: Guias[] = [
        { Codigo: 1, Nombre: "1. Inconformidad por Atención en centros médicos" },
        { Codigo: 2, Nombre: "2. No me llego la carta de incremento / Me subieron de precio" },
        { Codigo: 3, Nombre: "3. Viaje" },
        { Codigo: 4, Nombre: "4. No cobertura de preexistencias" },
        { Codigo: 5, Nombre: "5. El vendedor me ofreció algo diferente" },
        { Codigo: 6, Nombre: "6. No uso el plan" },
        { Codigo: 7, Nombre: "7. Ya contrate con otra empresa" },
        { Codigo: 8, Nombre: "8. No me reembolsan todo lo que presente" },
        { Codigo: 9, Nombre: "9. Gasto en el exterior cubierto bajo arancel nacional" },
        { Codigo: 10, Nombre: "10. No tengo dinero para seguir pagando (Factor económico)" },
    ];
    constructor(
        public Codigo?: number,
        public Nombre?: string
    ) { }
}

export class SubGuias {
    public static values: SubGuias[] = [
        { Codigo: 1, Nombre: "1. Agradezca los comentarios del cliente, pida disculpas y proceda a gestionar la inconformidad. \n 2. Ofrezca alternativas de uso al cliente, y otorgue los nombres, dirección y números de los diferentes centros médicos en convenio y explique por medio de la página web donde puede acceder para uso de los mismos.\n3. Detalle en una hoja o vía mail las alternativas de uso del plan de manera ambulatoria que son: Guía médica, centros médicos de la red, médicos no afiliados (última alternativa) \n 4. Ya que el malestar lo tiene con uno o varios centros médicos, una buena y efectiva alternativa es el uso de los médicos afiliados de la guía médica, resalte al cliente la importancia de estos médicos \n 5. Ingrese la queja en el módulo con todos los datos para poder gestionar la inconformidad presentada" },
        { Codigo: 2, Nombre: "1. Verifique si la carta fue enviada al cliente e informe al mismo, en caso de que no haya sido, otorgue al cliente una copiade la carta y pida disculpas \n 2. Informe que los incrementos se realizar una vez al año, según su edad y nivel de inflación médica del país, resalte la importancia de que no se realiza incremento por su forma de uso. \n 3. Explique beneficios del cliente como su cobertura anual, su porcentaje en hospitalización / ambulatorio, si es un cliente presencial escribirle en una hoja en blanco sus beneficios y forma de uso del plan, si es vía telefónica informar vía mail. \n 4. En caso de que el cliente tenga más de 2 años resalte la importancia de su antigüedad. \n 5. Desglose los valores por afiliado. \n 6. Si el cliente no puede mantener el precio, elimine los servicios adicionales posibles para reducir su cuota. \n 7. Ofrezca un descuento según su análisis previo. \n 8. Ofrezca un cambio de plan a un nivel inferior. \n 9. Como última alternativa proponga excluir algún beneficiario de contrato." },
        { Codigo: 3, Nombre: "1. Si es un cliente de más de 2 años de antigüedad resalte la importancia del mismo y la tranquilidad que esto le puede generar.  \n 2. Ofrezca alternativas de reducción de la cuota de su plan durante su estadía fuera del país, e informarle que a su retorno puede retomar su plan actual conservando la antigüedad del mismo, informe al cliente que no deje perder todos el tiempo que nos ha aportado y que por ello tenemos estas alternativas para conservar su plan durante este periodo de tiempo. \n 3. Resalte que puede reembolsar sus gastos médicos en el exterior. \n 4. Informe que siempre va a tener un contacto con su plan médico mediante la página web, con el servicio de chat en línea. \n 5. Ofrezca bajar su nivel del plan durante su estadía fuera del país para reducir costos. " },
        { Codigo: 4, Nombre: "1. Informe al cliente que mantendrá cobertura luego de un año de afiliación, persuada informando que es como aporte mensual es una inversión ya que al año de afiliada podrá reembolsar los gastos presentados por ese diagnóstico. \n 2. Informe al cliente que es únicamente por el diagnóstico presentado, ponga escenarios al cliente donde se puede generar un gasto elevado como accidentes o enfermedades imprevistas, ejemplo: apendicitis. \n 3. Explique la importancia del tiempo incurrido, como las carencias ya ganadas. \n 4. En caso de que el cliente le falte uno o 2 meses para tener la cobertura de preexistencias, converse con auditoría médica para verificar si es factible una excepción según el número de beneficiarios y cuota mensual del contrato. \n 5. Si amerita solicitar segunda auditoría de acuerdo a respaldos y explicaciones del cliente." },
        { Codigo: 5, Nombre: "1. Pida disculpas al cliente por la información brindad y explique detalladamente el plan que mantiene y describa plan de cliente. \n 2. Si el cliente necesita una cita médica, llame al consultorio del doctor y separe la cita por el cliente. \n 3. Informe al cliente que se procederá a ingresar una queja al ejecutivo de ventas por la asesoría dada, reitere las disculpas y genere empatía con el cliente, venda el producto de nuevo. \n 4. Otorgue un incentivo al cliente como recompensa a la asesoría brindada, ejemplo: puede otorgar 3 odas adicionales, comprométase a brindar asesoría personalizar otorgando su correo y extensión, o brinde algún obsequio. \n 5. Oferte un plan que cubra las necesidades y expectativas del cliente. " },
        { Codigo: 6, Nombre: "1. Resalte la importancia de mantener un plan médico, persuada al cliente informando que el fin de su plan es estar protegido frente a una eventualidad inesperada que le genere un gasto fuerte en su economía. \n 2. Persuada al cliente informando que está protegido en caso de alguna emergencia por accidente de inmediato y en caso de un evento programado la cobertura de su plan. \n 3. Informe de los beneficios de que mantiene el cliente. \n 4. Si es un cliente que ha usado su plan, informe al cliente de los gastos médicos que se han cubierto." },
        { Codigo: 7, Nombre: "Indaga el motivo real de la anulación ya que el cliente se va a otra empresa por factor económico, servicio o cobertura. \n 1. Verifique datos del cliente (antigüedad, siniestralidad, beneficiarios, monto a pagar). \n 2. Pregunte cuál es el motivo por el cual se va a otra empresa. ´´Estimado cliente que lo llevó a tomar su decisión´´ En caso de que el factor sea económico podemos tomar en consideración los argumentos por el motivo 'Me subieron el precio' \n 3. En caso de que el motivo sea por servicio, escuche al cliente proponga una alternativa de uso según lo informado por el cliente. \n 4. Informe los diversos servicios que mantiene y que lo distinguen de la competencia, por ejemplo: chat de atención por medio de la página web, doctor en línea plus, pago express, reembolso de gasto en un tiempo mínimo en comparación al mercado, puntos de atención de servicio al cliente, autorizaciones medicinas por la web. \n 5. Cuando se cambia a una empresa por cobertura en su gran mayoría buscan una cobertura internacional pero sus deducibles son muy altos, salud maneja deducibles módicos con la finalidad que el cliente puede usar su plan, informe al cliente un plan con deducible y ofrezca esta alternativa, ya que redujera costos y reembolsará más rápido que la competencia. \n 6. Si el cliente aun desiste en anular por irse a otra empresa, si es factible solicite al cliente la propuesta que competencia le brinda y realice un análisis de la misma para poder mejorarla o tener argumentos para rebatirl. \n 7. Si es un cliente con antigüedad superior a 2 años, informe que tiene cobertura de cualquier diagnóstico y que si se va a otra empresa no contará con cobertura inmediata." },
        { Codigo: 8, Nombre: "1. Explicar al cliente la cobertura ambulatoria y dejar claro el monto de cobertura de medicinas 80% genérica y 60% de marca ya que esto tiende a confundir al cliente creyendo que todas las medicinas son al 80%, otorgar las farmacias autorizadas por salud. \n 2. En caso de que el reembolso no sea al 80% por ejemplo en exámenes clínicos o imágenes debido a que el laboratorio no es prestador afiliado, informar al cliente los prestadores en convenio y explicar por qué no fue al 80%, enseñe y otorgar el número, direcciones de los laboratorios en convenio. \n 3. Realice un análisis del tipo de cliente (antigüedad, cuota mensual, siniestralidad) e informe que se solicitara una excepción para que la diferencia pueda ser cubierta por esta ocasión, a pesar de ser un prestador no en convenio, solicite este excepción a su jefatura si la factura es igual o inferior al $100." },
        { Codigo: 9, Nombre: "1. Antes generar un argumento pregunte al cliente cuánto cree que sería un valor considerable a cubrir considerando que es bajo precio nacional. (Esto servirá como guía para saber cuánto es lo que el cliente aspira). \n 2. En caso de que salud ya haya cubierto la operación bajo precios nacionales pero el cliente se encuentra insatisfecho con el reembolso, informe que se realizará una segunda revisión médica de sus gastos para verificar si es factible un alcance a su reclamo, deje claro al cliente que los gastos se cubren como si los hubiera realizado en el país, tal como estipula su contrato. \n 3. En caso de que cliente informe que mejor cogería un plan internacional proceda a recalcar la antigüedad que tiene en su contrato como ya se lo ha informado anteriormente" },
        { Codigo: 10, Nombre: "1. Pregunte al cliente porque le parece caro y escuche. \n 2. Solicite un momento y verifique datos del cliente como; antigüedad, beneficiarios, exclusiones, siniestralidad, forma de uso, monto que paga mensual. \n 3. Indague al cliente. Porque le parece caro. Escuche respuesta y de argumento según lo que dice el cliente. \n 4. Resaltar importancia de la antigüedad tal como ya ha sido mencionado anteriormente. \n 5. En caso de que sea un cliente con una alta siniestralidad, informe de los valores que salud ha cubierto generándole importancia al cliente de mantener su plan médico. \n 6. En caso de que cliente insista en anular y es un nivel 5 y 7 ofrece reducir precios a un nivel 4 y 3. \n 7. Si se trata de un cliente nivel 4 y 3 ofrecer: Planes nivel 3 y 4 con deducible. En caso de que insista en anular ofrecer el plan hospitalario o ambulatorio, dependiendo de la necesidad del cliente. \n 8. Verifique si mantiene servicios adicionales, y elimine los servicios adicionales posibles. \n 9. Según su previo análisis y en caso de ser factible ofrezca un descuento al cliente. \n 10. Si el contrato tiene varios beneficiarios puede negociar con el cliente para excluir a ciertos beneficiarios y reducir el valor de su plan." },
    ];
    constructor(
        public Codigo?: number,
        public Nombre?: string
    ) { }
}