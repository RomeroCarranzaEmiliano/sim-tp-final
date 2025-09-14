import { ProbabilidadValue, SimContextValue, TipoDia, Vector } from "./useSim";

const calcP = <T>(table: ProbabilidadValue<T>[], p: number) => {
  /** Obtener la tabla con las probabilidades acumuladas */
  const table_with_ac = [] as (ProbabilidadValue<T> & { ac: number })[];
  let ac = 0;
  table.forEach((value, index) => {
    ac = index == 0 ? value.p : ac + value.p;
    table_with_ac.push({
      key: value.key,
      p: value.p,
      ac: ac,
    });
  });

  const value = table_with_ac.find((v) => p < v.ac);
  //if (table[0].key == "SOLEADO") console.log(value, " -- ", p);
  if (typeof value == "undefined")
    throw new Error(
      "Inconsistencia en la tabla de probabilidad: \n" +
        table.map((v) => "| " + v.key + " | " + v.p + " |\n")
    );

  return value.key;
};

// /** Permite correr la simulación en lotes para mejorar el asincronismo */
// const runBatch = (
//   params: SimContextValue["params"],
//   prev_sim: Vector[],
//   prev_i: number,
//   cut: number
// ) => {
//   postMessage({
//     progress: prev_i / params.simRows,
//     data: prev_sim,
//   });

//   const simulation = [...prev_sim];
//   for (let i = prev_i; i <= params.simRows; i++) {
//     /** hay que cortar el lote? */
//     if (i - prev_i == cut) return runBatch(params, simulation, i, cut);

//     /** obtener la linea previa de sim */
//     const prev = simulation.pop();
//     if (!prev) throw new Error("Línea de inicialización sin definir");

//     /** simular linea actual */
//     const rnd_tipo_dia = Math.random();
//     const value_tipo_dia = calcP(params.tipo_dia, rnd_tipo_dia);
//     const tipo_dia = { rnd: rnd_tipo_dia, tipo: value_tipo_dia as TipoDia };
//     const rnd_demanda = Math.random();
//     const value_demanda =
//       tipo_dia.tipo == "SOLEADO"
//         ? calcP(params.demanda_dia_soleado, rnd_demanda)
//         : calcP(params.demanda_dia_nublado, rnd_demanda);
//     const demanda = { rnd: rnd_demanda, cantidad: value_demanda };
//     const disponible =
//       params.Q; /** TODO: Manejar caso en el que sea = a la demanda del dia anterior */
//     const cantidad_vendida =
//       disponible + prev.stock - value_demanda < 0
//         ? disponible + prev.stock
//         : value_demanda;
//     const faltante =
//       disponible + prev.stock - value_demanda < 0
//         ? value_demanda - disponible - prev.stock
//         : 0;
//     const stock =
//       disponible + prev.stock - value_demanda < 0
//         ? 0
//         : disponible + prev.stock - value_demanda;
//     const costos = {
//       Ko:
//         params.Ko *
//         params.Q /** TODO: Agregar manejo cuando Q=demanda del dia anterior */,
//       Km: params.Km * stock,
//       Ks: params.Ks * faltante,
//     };
//     const ganancia =
//       cantidad_vendida * params.precio_x_docena -
//       params.Ko -
//       params.Km -
//       params.Ks;
//     const ganancia_ac = prev.ganancia_ac + ganancia;

//     const next: Vector = {
//       reloj: prev.reloj + 1,
//       tipo_dia,
//       demanda,
//       disponible,
//       stock,
//       faltante,
//       cantidad_vendida,
//       costos,
//       ganancia,
//       ganancia_ac,
//     };

//     /** la linea previa está fuera del rango de impresión? */
//     if (
//       i - 1 >= params.printFrom &&
//       i - 1 <= params.printFrom + params.printRows
//     )
//       simulation.push(prev);
//     simulation.push(next);
//   }

//   return { progress: 1, data: simulation };
// };

const runSim = (params: SimContextValue["params"]) => {
  const init: Vector = {
    reloj: 0,
    demanda: { cantidad: 0 },
    disponible: 0,
    stock: params.Si,
    faltante: 0,
    cantidad_vendida: 0,
    costos: {
      Ko: 0,
      Km: 0,
      Ks: 0,
    },
    ganancia: 0,
    ganancia_ac: 0,
  };

  const simulation: Vector[] = [init];

  postMessage({ progress: 0, data: [] });

  let lastUpdate = 0;
  for (let i = 1; i <= params.simRows; i++) {
    /** hay que actualizar progreso? */
    if (i == lastUpdate + Math.round((params.simRows * 1) / 100)) {
      postMessage({ progress: i / params.simRows, data: simulation });
      lastUpdate = i;
    }

    /** obtener la linea previa de sim */
    const prev = simulation.pop();
    if (!prev) throw new Error("Línea de inicialización sin definir");

    /** simular linea actual */
    const rnd_tipo_dia = Math.random();
    const value_tipo_dia = calcP(params.tipo_dia, rnd_tipo_dia);
    const tipo_dia = { rnd: rnd_tipo_dia, tipo: value_tipo_dia as TipoDia };
    const rnd_demanda = Math.random();
    const value_demanda =
      tipo_dia.tipo == "SOLEADO"
        ? calcP(params.demanda_dia_soleado, rnd_demanda)
        : calcP(params.demanda_dia_nublado, rnd_demanda);
    const demanda = { rnd: rnd_demanda, cantidad: value_demanda };
    const disponible = params.dinamicQ
      ? prev.demanda.cantidad == 0
        ? params.Q
        : prev.demanda.cantidad
      : params.Q;
    const cantidad_vendida =
      disponible + prev.stock - value_demanda < 0
        ? disponible + prev.stock
        : value_demanda;
    const faltante =
      disponible + prev.stock - value_demanda < 0
        ? value_demanda - disponible - prev.stock
        : 0;
    const stock =
      disponible + prev.stock - value_demanda < 0
        ? 0
        : disponible + prev.stock - value_demanda;
    const costos = {
      Ko:
        params.Ko *
        params.Q,
      Km: params.Km * stock,
      Ks: params.Ks * faltante,
    };
    const ganancia =
      cantidad_vendida * params.precio_x_docena -
      params.Ko -
      params.Km -
      params.Ks;
    const ganancia_ac = prev.ganancia_ac + ganancia;

    const next: Vector = {
      reloj: prev.reloj + 1,
      tipo_dia,
      demanda,
      disponible,
      stock,
      faltante,
      cantidad_vendida,
      costos,
      ganancia,
      ganancia_ac,
    };

    /** la linea previa está fuera del rango de impresión? */
    if (
      i - 1 >= params.printFrom &&
      i - 1 <= params.printFrom + params.printRows
    )
      simulation.push(prev);

    simulation.push(next);
  }

  postMessage({ progress: 1, data: simulation });
  return { progress: 1, data: simulation };
};

self.onmessage = function (event) {
  const params = event.data;
  runSim(params);
  //   postMessage({ progress: result.progress, result: result.data });
};
