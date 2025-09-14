import { useSim } from "@/hooks/useSim";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const schema = z
  .object({
    "6": z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "6 debe ser un número válido en formato string",
    }),
    "7": z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "7 debe ser un número válido en formato string",
    }),
    "8": z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "8 debe ser un número válido en formato string",
    }),
    "9": z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "9 debe ser un número válido en formato string",
    }),
  })
  .refine(
    (data) => {
      const p6 = parseFloat(data["6"]);
      const p7 = parseFloat(data["7"]);
      const p8 = parseFloat(data["8"]);
      const p9 = parseFloat(data["9"]);

      return Math.abs(p6 + p7 + p8 + p9 - 1) < 1e-9;
    },
    {
      message: "La suma de 6, 7, 8 y 9 debe ser igual a 1",
      path: ["6", "7", "8", "9"],
    }
  );

export default function DiaSoleadoView() {
  const { params, setParams, setDemandaSoleadoError } = useSim();

  const handleChangeParam = (key: "6" | "7" | "8" | "9", newP: string) => {
    form.setValue(key, newP, { shouldValidate: true });
    const p: number | null = /^[0-9]+(\.[0-9]+)?$/.test(newP)
      ? parseFloat(newP)
      : null;
    if (p == null) return;
    const copy = { ...params };
    const copy_table = [...copy.demanda_dia_soleado].map((value) =>
      value.key == Number(key) ? { ...value, p } : value
    );
    copy.demanda_dia_soleado = copy_table;
    setParams(copy);
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      "6": params.demanda_dia_soleado.find((v) => v.key == 6)?.p.toString(),
      "7": params.demanda_dia_soleado.find((v) => v.key == 7)?.p.toString(),
      "8": params.demanda_dia_soleado.find((v) => v.key == 8)?.p.toString(),
      "9": params.demanda_dia_soleado.find((v) => v.key == 9)?.p.toString(),
    },
  });

  useEffect(() => {
    setDemandaSoleadoError(!form.formState.isValid);
  }, [form.formState]);

  return (
    <div>
      <table className="table-auto border border-[#bbb] text-center">
        <thead>
          <tr>
            <th className="p-4 border border-[#bbb]" colSpan={3}>
              Día soleado
            </th>
          </tr>
          <tr>
            <th className="p-4 border border-[#bbb]">Demanda por docena</th>
            <th className="p-4 border border-[#bbb]">P()</th>
            <th className="p-4 border border-[#bbb]">P()_ac</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-4 border border-[#bbb]">6</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="p(6)"
                value={form.watch()["6"]}
                onChange={(e) => handleChangeParam("6", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb]">
              {params.demanda_dia_soleado.find((p) => p.key == 6)?.p}
            </td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb]">7</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="p(7)"
                value={form.watch()["7"]}
                onChange={(e) => handleChangeParam("7", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb]">
              {params.demanda_dia_soleado
                .filter((p) => p.key <= 7)
                .reduce((a, b) => a + b.p, 0)
                .toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb]">8</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="p(8)"
                value={form.watch()["8"]}
                onChange={(e) => handleChangeParam("8", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb]">
              {params.demanda_dia_soleado
                .filter((p) => p.key <= 8)
                .reduce((a, b) => a + b.p, 0)
                .toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb]">9</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="p(9)"
                value={form.watch()["9"]}
                onChange={(e) => handleChangeParam("9", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb]">
              {params.demanda_dia_soleado
                .filter((p) => p.key <= 9)
                .reduce((a, b) => a + b.p, 0)
                .toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
      <span className="text-red-400">
        {!form.formState.isValid && "La tabla contiene errores"}
      </span>
    </div>
  );
}
