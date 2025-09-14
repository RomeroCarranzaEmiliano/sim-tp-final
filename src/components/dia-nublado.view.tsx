import { useSim } from "@/hooks/useSim";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const schema = z
  .object({
    "3": z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "3 debe ser un número válido en formato string",
    }),
    "4": z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "4 debe ser un número válido en formato string",
    }),
    "5": z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "5 debe ser un número válido en formato string",
    }),
    "6": z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "6 debe ser un número válido en formato string",
    }),
    "7": z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "7 debe ser un número válido en formato string",
    }),
  })
  .refine(
    (data) => {
      const p3 = parseFloat(data["3"]);
      const p4 = parseFloat(data["4"]);
      const p5 = parseFloat(data["5"]);
      const p6 = parseFloat(data["6"]);
      const p7 = parseFloat(data["7"]);

      return Math.abs(p3 + p4 + p5 + p6 + p7 - 1) < 1e-9;
    },
    {
      message: "La suma de 3, 4, 5, 6 y 7 debe ser igual a 1",
      path: ["3", "4", "5", "6", "7"],
    }
  );

export default function DiaNubladoView() {
  const { params, setParams, setDemandaNubladoError } = useSim();

  const handleChangeParam = (
    key: "3" | "4" | "5" | "6" | "7",
    newP: string
  ) => {
    form.setValue(key, newP, { shouldValidate: true });
    const p: number | null = /^[0-9]+(\.[0-9]+)?$/.test(newP)
      ? parseFloat(newP)
      : null;
    if (p == null) return;
    const copy = { ...params };
    const copy_table = [...copy.demanda_dia_nublado].map((value) =>
      value.key == Number(key) ? { ...value, p } : value
    );
    copy.demanda_dia_nublado = copy_table;
    setParams(copy);
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      "3": params.demanda_dia_nublado.find((v) => v.key == 3)?.p.toString(),
      "4": params.demanda_dia_nublado.find((v) => v.key == 4)?.p.toString(),
      "5": params.demanda_dia_nublado.find((v) => v.key == 5)?.p.toString(),
      "6": params.demanda_dia_nublado.find((v) => v.key == 6)?.p.toString(),
      "7": params.demanda_dia_nublado.find((v) => v.key == 7)?.p.toString(),
    },
  });

  useEffect(() => {
    setDemandaNubladoError(!form.formState.isValid);
  }, [form.formState]);

  return (
    <div>
      <table className="table-auto border border-[#bbb] text-center">
        <thead>
          <tr>
            <th className="p-4 border border-[#bbb]" colSpan={3}>
              Día nublado
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
            <td className="p-4 border border-[#bbb]">3</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="p(3)"
                value={form.watch()["3"]}
                onChange={(e) => handleChangeParam("3", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb]">
              {params.demanda_dia_nublado.find((p) => p.key == 3)?.p}
            </td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb]">4</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="p(4)"
                value={form.watch()["4"]}
                onChange={(e) => handleChangeParam("4", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb]">
              {params.demanda_dia_nublado
                .filter((p) => p.key <= 4)
                .reduce((a, b) => a + b.p, 0)
                .toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb]">5</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="p(5)"
                value={form.watch()["5"]}
                onChange={(e) => handleChangeParam("5", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb]">
              {params.demanda_dia_nublado
                .filter((p) => p.key <= 5)
                .reduce((a, b) => a + b.p, 0)
                .toFixed(2)}
            </td>
          </tr>
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
              {params.demanda_dia_nublado
                .filter((p) => p.key <= 6)
                .reduce((a, b) => a + b.p, 0)
                .toFixed(2)}
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
              {params.demanda_dia_nublado
                .filter((p) => p.key <= 7)
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
