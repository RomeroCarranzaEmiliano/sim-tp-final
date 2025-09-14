import * as React from "react";

export type ProbabilidadValue<T> = {
  key: T;
  p: number;
};

const calcP = <T,>(table: ProbabilidadValue<T>[], p: number) => {
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

export type SimContextValue = {
  params: {
    precio_x_docena: number;
    demanda_dia_soleado: ProbabilidadValue<number>[];
    demanda_dia_nublado: ProbabilidadValue<number>[];
    tipo_dia: ProbabilidadValue<string>[];
    Q: number;
    Ko: number;
    Km: number;
    Ks: number;
    simRows: number;
    printFrom: number;
    printRows: number;
    Si: number;
    dinamicQ: boolean;
  };
  setParams: React.Dispatch<React.SetStateAction<SimContextValue["params"]>>;
  simulate: () => unknown;
  hasErrors: boolean;
  setTipoDiaError: React.Dispatch<React.SetStateAction<boolean>>;
  setDemandaSoleadoError: React.Dispatch<React.SetStateAction<boolean>>;
  setDemandaNubladoError: React.Dispatch<React.SetStateAction<boolean>>;
  setParametrosError: React.Dispatch<React.SetStateAction<boolean>>;
  setFilasError: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
  result: Vector[];
};

const SimContext = React.createContext<SimContextValue>({} as SimContextValue);

const SimProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasErrors, setHasErrors] = React.useState<boolean>(false);
  const [tipoDiaError, setTipoDiaError] = React.useState<boolean>(false);
  const [demandaSoleadoError, setDemandaSoleadoError] =
    React.useState<boolean>(false);
  const [demandaNubladoError, setDemandaNubladoError] =
    React.useState<boolean>(false);
  const [parametrosError, setParametrosError] = React.useState<boolean>(false);
  const [filasError, setFilasError] = React.useState<boolean>(false);

  const [params, setParams] = React.useState<SimContextValue["params"]>({
    precio_x_docena: 12,
    demanda_dia_soleado: [
      { key: 6, p: 0.1 },
      { key: 7, p: 0.2 },
      { key: 8, p: 0.45 },
      { key: 9, p: 0.25 },
    ],
    demanda_dia_nublado: [
      { key: 3, p: 0.05 },
      { key: 4, p: 0.15 },
      { key: 5, p: 0.4 },
      { key: 6, p: 0.25 },
      { key: 7, p: 0.15 },
    ],
    tipo_dia: [
      { key: "SOLEADO", p: 0.73 },
      { key: "NUBLADO", p: 0.27 },
    ],
    Q: 8,
    Ko: 56,
    Km: 0,
    Ks: 0.96,
    simRows: 100,
    printFrom: 0,
    printRows: 50,
    Si: 0,
    dinamicQ: false
  });

  React.useEffect(() => {
    setHasErrors(
      tipoDiaError ||
        demandaSoleadoError ||
        demandaNubladoError ||
        parametrosError ||
        filasError
    );
  }, [
    tipoDiaError,
    demandaSoleadoError,
    demandaNubladoError,
    parametrosError,
    filasError,
  ]);

  const [result, setResult] = React.useState<Vector[]>([]);
  const [progress, setProgress] = React.useState<number>(0);
  const { worker } = useSimWorker({ params, setResult, setProgress });

  const context: SimContextValue = {
    params,
    setParams,
    simulate: () => worker && worker.postMessage(params),
    hasErrors,
    setTipoDiaError,
    setDemandaSoleadoError,
    setDemandaNubladoError,
    setParametrosError,
    setFilasError,
    progress,
    result,
  };
  return <SimContext.Provider value={context}>{children}</SimContext.Provider>;
};

const useSim = () => {
  const context = React.useContext(SimContext);

  if (!context)
    throw new Error("useSim must be used within <SimProvider></SimProvider>");

  return context;
};

export type TipoDia = "SOLEADO" | "NUBLADO";
export type Vector = {
  reloj: number;
  tipo_dia?: { rnd: number; tipo: TipoDia };
  demanda: { rnd?: number; cantidad: number };
  disponible: number;
  stock: number;
  faltante: number;
  cantidad_vendida: number;
  costos: {
    Ko: number;
    Km: number;
    Ks: number;
  };
  ganancia: number;
  ganancia_ac: number;
};

const useSimWorker = ({
  params,
  setResult,
  setProgress,
}: {
  params: SimContextValue["params"];
  setResult: React.Dispatch<React.SetStateAction<Vector[]>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [worker, setWorker] = React.useState<Worker | null>(null);

  React.useEffect(() => {
    // Initialize worker
    const newWorker = new Worker(new URL("./sim-worker.ts", import.meta.url));

    // Handle worker messages
    newWorker.onmessage = (
      event: MessageEvent<{ progress: number; data: Vector[] }>
    ) => {
      setResult(event.data.data);
      setProgress(event.data.progress);
    };

    // // Send computation to worker
    // newWorker.postMessage(params);
    setWorker(newWorker);

    // Cleanup the worker when component unmounts
    return () => {
      newWorker.terminate();
    };
  }, [params]);

  return { worker };
};

export { SimProvider, useSim };
