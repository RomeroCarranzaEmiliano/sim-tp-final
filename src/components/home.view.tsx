import { useSim, Vector } from "@/hooks/useSim";
import { useState } from "react";
import DiaNubladoView from "./dia-nublado.view";
import DiaSoleadoView from "./dia-soleado.view";
import FilasView from "./filas.view";
import ParametrosView from "./parametros.view";
import ResultsView from "./results.view";
import TipoDiaView from "./tipo-dia.view";

export default function HomeView() {
  const [lastRes, setLastRes] = useState<null | Vector[]>();
  const { params, setParams, progress, simulate, hasErrors, result } = useSim();

  const handleSimulate = () => {
    simulate();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {progress > 0 && progress < 1 && (
        <div className="w-full h-full fixed left-0 top-0 bg-green-100/80 flex items-center justify-center flex-col text-xl gap-2">
          <div className="font-bold">
            Simulando ... {(progress * 100).toFixed(0)}%
          </div>
          <div className="animate-spin w-fit h-fit">⏳</div>
        </div>
      )}
      <div className="w-full flex flex-row gap-4 justify-center">
        <TipoDiaView />
        <DiaSoleadoView />
        <DiaNubladoView />
        <ParametrosView />
      </div>
      <div className="w-full flex flex-row justify-between">
        <FilasView />
        <button
          onClick={handleSimulate}
          className="p-4 border border-[#bbb] hover:border-black cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 ml-4"
          disabled={hasErrors}
        >
          Simular
        </button>
      </div>
      <ResultsView />
    </div>
  );
}
