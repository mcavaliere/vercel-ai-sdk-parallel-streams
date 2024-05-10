"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SyntheticEvent, useState } from "react";
import { Button } from "./ui/button";
import { readStreamableValue } from "ai/rsc";
import { streamAnswer } from "@/app/actions";

export function QuestionForm() {
  const [question, setQuestion] = useState<string>("");

  function onChange(e: SyntheticEvent) {
    setQuestion(e.target.value);
  }

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault();

    const result = await streamAnswer(question);

    const isGenerating = readStreamableValue(result.isGenerating);

    for await (const value of readStreamableValue(result.answer)) {
      console.log(`---------------- answer `, value);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Label htmlFor="chat-input">Enter a question</Label>
      <Input id="chat-input" onChange={onChange} value={question} />
      <Button type="submit">Submit</Button>
    </form>
  );
}
