import { useSim, Vector } from "@/hooks/useSim";
import { useEffect, useState } from "react";

export default function ResultsView() {
  const [lastRes, setLastRes] = useState<Vector[]>([]);
  const [page, setPage] = useState<number>(1);
  const { result, progress } = useSim();

  useEffect(() => {
    if (!result) return;
    if (result.length == 0) return;
    setPage(1);
    setLastRes([...result]);
  }, [result]);

  return (
    progress == 1 &&
    lastRes && (
      <div className="w-full pb-24">
        <div className="flex flex-row justify-between items-center">
          <button
            onClick={() => setPage((prev: number) => prev - 1)}
            disabled={page == 1}
            className="border border-[#bbb] p-4 cursor-pointer hover:border-black disabled:bg-gray-50 disabled:text-gray-400"
          >
            Anterior
          </button>
          <div className="p-4 border border-[#bbb] flex w-full mx-4 justify-center font-bold">
            Pagina {page}/{Math.ceil(lastRes.length / 52)}
          </div>
          <button
            onClick={() => setPage((prev: number) => prev + 1)}
            disabled={page == Math.ceil(lastRes.length / 52)}
            className="border border-[#bbb] p-4 cursor-pointer hover:border-black disabled:bg-gray-50 disabled:text-gray-400"
          >
            Siguiente
          </button>
        </div>
        <table className="table-auto w-full mt-2">
          <thead>
            <tr>
              <th className="text-center p-4 border border-[#bbb]">día</th>
              <th className="text-center p-4 border border-[#bbb]">RND</th>
              <th className="text-center p-4 border border-[#bbb]">
                Tipo de día
              </th>
              <th className="text-center p-4 border border-[#bbb]">RND</th>
              <th className="text-center p-4 border border-[#bbb]">Demanda</th>
              <th className="text-center p-4 border border-[#bbb]">
                Disponible
              </th>
              <th className="text-center p-4 border border-[#bbb]">Stock</th>
              <th className="text-center p-4 border border-[#bbb]">Faltante</th>
              <th className="text-center p-4 border border-[#bbb]">Ko</th>
              <th className="text-center p-4 border border-[#bbb]">Kc</th>
              <th className="text-center p-4 border border-[#bbb]">Km</th>
              <th className="text-center p-4 border border-[#bbb]">Ks</th>
              <th className="text-center p-4 border border-[#bbb]">Ventas</th>
              <th className="text-center p-4 border border-[#bbb]">Ganancia</th>
              <th className="text-center p-4 border border-[#bbb]">
                Ganancia(ac)
              </th>
            </tr>
          </thead>
          <tbody>
            {lastRes.map(
              (row, index) =>
                index >= (page - 1) * 50 &&
                index < page * 50 &&
                index < lastRes.length - 1 && (
                  <tr key={index} className={"hover:bg-blue-50 odd:bg-gray-50"}>
                    <td className="text-center p-4 border border-[#bbb]">
                      {row.reloj}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      {row.tipo_dia?.rnd.toFixed(2)}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      {row.tipo_dia?.tipo}
                      {row.reloj > 0 &&
                        (row.tipo_dia?.tipo == "SOLEADO" ? " ☀️" : " ☁️")}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      {row.demanda.rnd?.toFixed(2)}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      {row.demanda.cantidad}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      {row.disponible.toFixed(2)}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      {row.stock.toFixed(2)}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      {row.faltante.toFixed(2)}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      $ {row.costos.Ko.toFixed(2)}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      $ {row.costos.Kc.toFixed(2)}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      $ {row.costos.Km.toFixed(2)}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      $ {row.costos.Ks.toFixed(2)}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      {row.cantidad_vendida.toFixed(2)}
                    </td>
                    <td
                      className={
                        "text-center p-4 border border-[#bbb] " +
                        (row.ganancia >= 0 ? "text-green-400" : "text-red-400")
                      }
                    >
                      $ {row.ganancia.toFixed(2)}
                    </td>
                    <td className="text-center p-4 border border-[#bbb]">
                      $ {row.ganancia_ac.toFixed(2)}
                    </td>
                  </tr>
                )
            )}
            {lastRes[lastRes.length - 1] && (
              <tr
                key={lastRes.length - 1}
                className={"hover:bg-blue-50 bg-green-200"}
              >
                <td className="text-center p-4 border border-[#bbb]">
                  {lastRes[lastRes.length - 1].reloj}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  {lastRes[lastRes.length - 1].tipo_dia?.rnd.toFixed(2)}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  {lastRes[lastRes.length - 1].tipo_dia?.tipo}
                  {lastRes[lastRes.length - 1].reloj > 0 &&
                    (lastRes[lastRes.length - 1].tipo_dia?.tipo == "SOLEADO"
                      ? " ☀️"
                      : " ☁️")}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  {lastRes[lastRes.length - 1].demanda.rnd?.toFixed(2)}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  {lastRes[lastRes.length - 1].demanda.cantidad}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  {lastRes[lastRes.length - 1].disponible.toFixed(2)}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  {lastRes[lastRes.length - 1].stock.toFixed(2)}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  {lastRes[lastRes.length - 1].faltante.toFixed(2)}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  $ {lastRes[lastRes.length - 1].costos.Ko.toFixed(2)}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  $ {lastRes[lastRes.length - 1].costos.Kc.toFixed(2)}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  $ {lastRes[lastRes.length - 1].costos.Km.toFixed(2)}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  $ {lastRes[lastRes.length - 1].costos.Ks.toFixed(2)}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  {lastRes[lastRes.length - 1].cantidad_vendida.toFixed(2)}
                </td>
                <td
                  className={
                    "text-center p-4 border border-[#bbb] " +
                    (lastRes[lastRes.length - 1].ganancia >= 0
                      ? "text-green-400"
                      : "text-red-400")
                  }
                >
                  $ {lastRes[lastRes.length - 1].ganancia.toFixed(2)}
                </td>
                <td className="text-center p-4 border border-[#bbb]">
                  $ {lastRes[lastRes.length - 1].ganancia_ac.toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="w-full flex flex-row justify-end">
          {lastRes && (
            <table className="mt-4">
              <tbody>
                <tr>
                  <th className="text-center p-4 border border-[#bbb]">
                    Promedio de ganancia diaria
                  </th>
                  <td className="text-center p-4 border border-[#bbb]">
                    ${" "}
                    {lastRes.length > 0 &&
                      (
                        ([...lastRes].pop()?.ganancia_ac ?? 1) /
                        ([...lastRes].pop()?.reloj ?? 1)
                      ).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  );
}
