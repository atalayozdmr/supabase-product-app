import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
    window.location.reload(); // Navbar'ı da yenilemek için en pratik çözüm
  };

  return (
    <button onClick={handleLogout} style={{
      background: "#ff4444", color: "#fff", padding: "8px 16px",
      borderRadius: 8, border: "none", marginLeft: 18, fontWeight: 600, cursor: "pointer"
    }}>
      Çıkış Yap
    </button>
  );
}
