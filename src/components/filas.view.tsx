import { useSim } from "@/hooks/useSim";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const schema = z.object({
  simRows: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "debe ser un número válido en formato string",
    }),
  printFrom: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "debe ser un número válido en formato string",
    }),
  printRows: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 500, {
      message: "debe ser un número válido en formato string",
    }),
});

export default function FilasView() {
  const { params, setParams, setFilasError } = useSim();

  const handleChangeParam = (
    key: "simRows" | "printFrom" | "printRows",
    v: string
  ) => {
    form.setValue(key, v, { shouldValidate: true });
    const p: number | null = /^[0-9]+(\.[0-9]+)?$/.test(v)
      ? parseFloat(v)
      : null;
    if (p == null) return;
    const copy = { ...params };
    copy[key] = Number(v);
    setParams(copy);
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      simRows: params.simRows.toString(),
      printFrom: params.printFrom.toString(),
      printRows: params.printRows.toString(),
    },
  });

  useEffect(() => {
    setFilasError(!form.formState.isValid);
  }, [form.formState]);

  return (
    <div>
      <table className="table-auto border border-[#bbb] text-center">
        <tbody>
          <tr>
            <td className="p-4 border border-[#bbb] font-bold">
              Filas a simular
            </td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="n"
                value={form.watch()["simRows"]}
                onChange={(e) => handleChangeParam("simRows", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb] font-bold">
              Mostrar desde
            </td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="n"
                value={form.watch()["printFrom"]}
                onChange={(e) => handleChangeParam("printFrom", e.target.value)}
              />
            </td>
            <td className="p-4 border border-[#bbb] font-bold">
              Cantidad de filas
            </td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="n"
                value={form.watch()["printRows"]}
                onChange={(e) => handleChangeParam("printRows", e.target.value)}
              />
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
