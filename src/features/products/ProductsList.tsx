import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuthUser } from "../../hooks/useAuthUser";
import Spinner from "../../components/Spinner";
import Toast from "../../components/Toast";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const user = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      if (!user) return;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false });
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    }
    fetchProducts();
  }, [user]);

  const handleDelete = async (id: number) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter((p) => p.id !== id));
    setToast({ msg: "Ürün silindi!", type: "success" });
  };

  if (loading) return <Spinner />;
  if (!user) return <div>Giriş yapmalısın!</div>;
  if (products.length === 0) return <div>Henüz ürünün yok.</div>;

  return (
    <>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 28, marginTop: 32 }}>
        {products.map((p) => (
          <div key={p.id} style={{ width: 250, background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px #0002", padding: 18 }}>
            <img src={p.image_url} alt={p.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
            <h3 style={{ fontSize: 20, fontWeight: 600, margin: "10px 0 4px" }}>{p.name}</h3>
            <div style={{ color: "#666", minHeight: 34 }}>{p.description}</div>
            <div style={{ fontWeight: 600, marginTop: 10, color: "#2166e7" }}>{p.price} ₺</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => navigate(`/edit-product/${p.id}`)}
                style={{
                  background: "#ffa500",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "7px 16px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "7px 16px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
