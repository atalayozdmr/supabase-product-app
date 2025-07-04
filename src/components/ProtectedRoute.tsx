import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthUser();

  if (user === undefined) {
    // Kullanıcı henüz yüklenmedi, boş döndür (veya loading gösterebilirsin)
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
