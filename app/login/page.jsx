import LoginForm from "@/app/components/form/LoginForm";
import GlitchBackground from "@/app/components/effects/glitch-background/GlitchBackground";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <GlitchBackground />
      <LoginForm />
    </main>
  );
}
