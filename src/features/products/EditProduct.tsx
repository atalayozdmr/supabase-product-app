import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Toast from "../../components/Toast";
import Spinner from "../../components/Spinner";

type ProductFormInputs = {
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export default function EditProduct() {
  const { id } = useParams();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormInputs>();
  const [toast, setToast] = useState<{ msg: string, type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) {
        setValue("name", data.name);
        setValue("description", data.description);
        setValue("price", data.price);
        setValue("image_url", data.image_url);
      }
      setLoading(false);
      if (error) setToast({ msg: "Ürün bulunamadı!", type: "error" });
    }
    fetchProduct();
  }, [id, setValue]);

  const onSubmit = async (data: ProductFormInputs) => {
    setLoading(true);
    const { error } = await supabase.from("products").update({
      name: data.name,
      description: data.description,
      price: Number(data.price), // Sayıyı kesinlikle number olarak gönder!
      image_url: data.image_url,
    }).eq("id", id);
    setLoading(false);
    if (!error) {
      setToast({ msg: "Ürün başarıyla güncellendi!", type: "success" });
      setTimeout(() => navigate("/products"), 2000); // 2sn bekleyip yönlendir!
    } else {
      setToast({ msg: error.message, type: "error" });
    }
  };

  if (loading) return <Spinner />;

  return (
    <form className="max-w-md mx-auto space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
      <input
        placeholder="Ürün adı"
        {...register("name", { required: "Ürün adı zorunlu" })}
        className="border p-2 w-full"
      />
      {errors.name && <div className="text-red-500">{errors.name.message}</div>}

      <textarea
        placeholder="Açıklama"
        {...register("description", { required: "Açıklama zorunlu" })}
        className="border p-2 w-full"
      />
      {errors.description && <div className="text-red-500">{errors.description.message}</div>}

      <input
        placeholder="Fiyat"
        type="number"
        step="any"
        {...register("price", { required: "Fiyat zorunlu", min: { value: 0, message: "Fiyat 0'dan küçük olamaz" } })}
        className="border p-2 w-full"
      />
      {errors.price && <div className="text-red-500">{errors.price.message}</div>}

      <input
        placeholder="Görsel URL"
        {...register("image_url", { required: "Görsel zorunlu" })}
        className="border p-2 w-full"
      />
      {errors.image_url && <div className="text-red-500">{errors.image_url.message as string}</div>}

      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
        Güncelle
      </button>
    </form>
  );
}
