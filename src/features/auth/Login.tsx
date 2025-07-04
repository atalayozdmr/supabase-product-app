import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) setError(error.message);
    else navigate("/add-product");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      <input
        type="password"
        placeholder="Şifre"
        {...register("password", { required: true })}
      />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit">Giriş Yap</button>
    </form>
  );
}
