"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SyntheticEvent, useState } from "react";
import { Button } from "./ui/button";
import { readStreamableValue, useUIState } from "ai/rsc";
import { streamAnswer } from "@/app/actions";
import { Spinner } from "./svgs/Spinner";

export function QuestionForm() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<Record<string, any> | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [answerUI, setAnswerUI] = useUIState()

  function onChange(e: SyntheticEvent) {
    setQuestion(e.target.value);
  }

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault();

    const result = await streamAnswer(question);
    const isGeneratingStream = readStreamableValue(result.isGenerating);

    setAnswerUI(result.answerUI);

    for await (const value of isGeneratingStream) {
      if (value != null) {
        setIsGenerating(value);
      }
    }
  }

  console.log(`---------------- isGenerating: `, isGenerating);



  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full">
      <Label htmlFor="chat-input">Enter a question</Label>
      <div className="inline-block mb-4 w-full flex flex-row gap-1">
        <Input id="chat-input" onChange={onChange} value={question} />
        <Button type="submit">Submit</Button>
      </div>
      {isGenerating ? (
        <div className="flex flex-row w-full justify-center items-center p-4 transition-all">
          <Spinner className="h-6 w-6 text-slate-900" />
        </div>
      ) : null}

      <div className="mt-4 p-4 rounded-md shadow-md bg-slate-200">
        {answerUI ? answerUI : null}
      </div>
    </form>
  );
}
