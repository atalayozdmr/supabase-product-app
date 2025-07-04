import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabaseClient";
import { useState } from "react";

type RegisterFormInputs = {
  email: string;
  password: string;
};

export default function Register() {
  const { register, handleSubmit } = useForm<RegisterFormInputs>();
  const [error, setError] = useState<string>("");

  const onSubmit = async (data: RegisterFormInputs) => {
    setError("");
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) setError(error.message);
    else alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
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
      <button type="submit">Kayıt Ol</button>
    </form>
  );
}
