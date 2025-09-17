import { useSim } from "@/hooks/useSim";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const schema = z.object({
  Q: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "debe ser un número válido en formato string",
  }),
  Ko: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "debe ser un número válido en formato string",
  }),
  Km: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "debe ser un número válido en formato string",
  }),
  Ks: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "debe ser un número válido en formato string",
  }),
  precio_x_docena: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "debe ser un número válido en formato string",
  }),
  dinamicQ: z.boolean(),
});

export default function ParametrosView() {
  const { params, setParams, setParametrosError } = useSim();

  const handleChangeParam = (
    key: "Q" | "Ko" | "Km" | "Ks" | "precio_x_docena" | "dinamicQ",
    v: string | boolean
  ) => {
    if (typeof v == "boolean") {
      form.setValue(key, v, { shouldValidate: true });
      const copy = { ...params };
      copy["dinamicQ"] = v;
      setParams(copy);
      return;
    }
    if (key == "dinamicQ") return;
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
      Q: params.Q.toString(),
      Ko: params.Ko.toString(),
      Km: params.Km.toString(),
      Ks: params.Ks.toString(),
      dinamicQ: params.dinamicQ,
      precio_x_docena: params.precio_x_docena.toString(),
    },
  });

  useEffect(() => {
    setParametrosError(!form.formState.isValid);
  }, [form.formState]);

  return (
    <div>
      <table className="table-auto border border-[#bbb] text-center">
        <thead>
          <tr>
            <th className="p-4 border border-[#bbb]" colSpan={3}>
              Parámetros (por día)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-4 border border-[#bbb] font-bold">Q</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="Q"
                value={form.watch()["Q"]}
                onChange={(e) => handleChangeParam("Q", e.target.value)}
              />
            </td>
            <td className="text-nowrap p-4 border border-[#bbb]">docena/s</td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb] font-bold">Ko</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="Ko"
                value={form.watch()["Ko"]}
                onChange={(e) => handleChangeParam("Ko", e.target.value)}
              />
            </td>
            <td className="text-nowrap p-4 border border-[#bbb]">por docena</td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb] font-bold">Km</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="Km"
                value={form.watch()["Km"]}
                onChange={(e) => handleChangeParam("Km", e.target.value)}
              />
            </td>
            <td className="text-nowrap p-4 border border-[#bbb]">por docena</td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb] font-bold">Ks</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="Ks"
                value={form.watch()["Ks"]}
                onChange={(e) => handleChangeParam("Ks", e.target.value)}
              />
            </td>
            <td className="text-nowrap p-4 border border-[#bbb]">por docena</td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb] font-bold">Ganancia</td>
            <td className="border border-[#bbb]">
              <input
                className="w-full h-full p-4 text-center"
                placeholder="Ganancia"
                value={form.watch()["precio_x_docena"]}
                onChange={(e) =>
                  handleChangeParam("precio_x_docena", e.target.value)
                }
              />
            </td>
            <td className="text-nowrap p-4 border border-[#bbb]">por docena</td>
          </tr>
          <tr>
            <td className="p-4 border border-[#bbb] font-bold">
              Q = Demanda del día anterior
            </td>
            <td
              colSpan={2}
              onClick={() => handleChangeParam("dinamicQ", !params.dinamicQ)}
              className="border border-[#bbb] cursor-pointer active:bg-gray-50 select-none"
            >
              <span>{params.dinamicQ ? "SI" : "NO"}</span>
              <span className="ml-2">{params.dinamicQ ? "✅" : "❌"}</span>
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
