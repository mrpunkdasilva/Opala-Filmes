import RegisterForm from "@/app/components/form/RegisterForm";
import GlitchBackground from "@/app/components/effects/glitch-background/GlitchBackground";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <GlitchBackground />
      <RegisterForm />
    </main>
  );
}
