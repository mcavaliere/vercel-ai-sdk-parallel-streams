import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form>
        <Label htmlFor="chat-input">Enter a question</Label>
        <Input id="chat-input" />
      </form>
    </main>
  );
}
