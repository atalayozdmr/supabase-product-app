import { useForm } from "react-hook-form";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";
import Toast from "../../components/Toast";

type ProductFormInputs = {
  name: string;
  description: string;
  price: number;
  image: FileList;
};

export default function AddProduct() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormInputs>();
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string, type: "success" | "error" } | null>(null);
  const navigate = useNavigate();
  const user = useAuthUser();

  const onSubmit = async (data: ProductFormInputs) => {
    setUploading(true);

    let imageUrl = "";

    // Görsel yükleme
    if (data.image && data.image[0]) {
      const file = data.image[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // Storage'a yükle
      const { error: uploadError } = await supabase
        .storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) {
        setToast({ msg: "Resim yüklenemedi!", type: "error" });
        setUploading(false);
        return;
      }

      // Public URL al
      const { data: publicUrlData } = supabase
        .storage
        .from("products")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData?.publicUrl ?? "";
    }

    // Ürünü veritabanına ekle
    const { error: insertError } = await supabase.from("products").insert([{
      name: data.name,
      description: data.description,
      price: Number(data.price),
      image_url: imageUrl,
      user_id: user?.id,
    }]);

    setUploading(false);

    if (!insertError) {
      setToast({ msg: "Ürün başarıyla eklendi!", type: "success" });
      setTimeout(() => navigate("/products"), 1800); // Toast görünsün diye kısa gecikme
    } else {
      setToast({ msg: insertError.message, type: "error" });
    }
  };

  return (
    <form className="max-w-md mx-auto space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
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
        type="file"
        accept="image/*"
        {...register("image", { required: "Bir görsel seçmelisin" })}
        className="w-full"
      />
      {errors.image && <div className="text-red-500">{errors.image.message as string}</div>}

      <button
        disabled={uploading}
        type="submit"
        className="bg-blue-600 text-white p-2 rounded w-full"
      >
        {uploading ? "Yükleniyor..." : "Ürün Ekle"}
      </button>
    </form>
  );
}
