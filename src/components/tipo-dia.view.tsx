import { TipoDia, useSim } from "@/hooks/useSim";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z
  .object({
    SOLEADO: z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "p_soleado debe ser un número válido en formato string",
    }),
    NUBLADO: z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "p_nublado debe ser un número válido en formato string",
    }),
  })
  .refine(
    (data) => {
      const pSoleado = parseFloat(data.SOLEADO);
      const pNublado = parseFloat(data.NUBLADO);
      return Math.abs(pSoleado + pNublado - 1) < 1e-9; // tolerancia flotante
    },
    {
      message: "La suma de p_soleado y p_nublado debe ser igual a 1",
      path: ["SOLEADO", "NUBLADO"],
    }
  );

export default function TipoDiaView() {
  const { params, setParams, setTipoDiaError } = useSim();

  const handleChangeParam = (key: TipoDia, newP: string) => {
    form.setValue(key, newP, { shouldValidate: true });
    const p: number | null = /^[0-9]+(\.[0-9]+)?$/.test(newP)
      ? parseFloat(newP)
      : null;
    if (p == null) return;
    const copy = { ...params };
    const copy_table = [...copy.tipo_dia].map((value) =>
      value.key == key ? { ...value, p } : value
    );
    copy.tipo_dia = copy_table;
    setParams(copy);
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      SOLEADO: params.tipo_dia.find((v) => v.key == "SOLEADO")?.p.toString(),
      NUBLADO: params.tipo_dia.find((v) => v.key == "NUBLADO")?.p.toString(),
    },
  });

  useEffect(() => {
    setTipoDiaError(!form.formState.isValid);
  }, [form.formState, setTipoDiaError]);

  return (
    <div>
      <table className="table-auto border border-[#bbb] text-center">
        <thead>
          <tr>
            <th className="p-4 border border-[#bbb]" colSpan={3}>
              Tipo de día
            </th>
          </tr>
          <tr>
            <th className="p-4 border border-[#bbb]">Tipo</th>
            <th className="p-4 border border-[#bbb]">P()</th>
            <th className="p-4 border border-[#bbb]">P()_ac</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-4 border border-[#bbb]">SOLEADO</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="p(SOLEADO)"
                value={form.watch().SOLEADO}
                onChange={(e) => handleChangeParam("SOLEADO", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb]">
              {params.tipo_dia.find((p) => p.key == "SOLEADO")?.p}
            </td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb]">NUBLADO</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="p(NUBLADO)"
                value={form.watch().NUBLADO}
                onChange={(e) => handleChangeParam("NUBLADO", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb]">
              {params.tipo_dia.reduce((a, b) => a + b.p, 0).toFixed(2)}
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
