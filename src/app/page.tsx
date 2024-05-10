import { GenerationForm } from "@/components/QuestionForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 max-w-[1024px] mx-auto">
      <GenerationForm />
    </main>
  );
}
