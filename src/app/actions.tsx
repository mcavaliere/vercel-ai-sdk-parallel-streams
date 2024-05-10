"use server";

import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { createAI, createStreamableUI, createStreamableValue } from "ai/rsc";
import { z } from "zod";

const AnswerSchema = z.object({
  answer: z.string(),
  question: z.string(),
});

export async function streamAnswer(question: string) {
  const isGeneratingStream = createStreamableValue(true);
  const answerUI = createStreamableUI(<div></div>)

  streamObject({
    model: openai("gpt-3.5-turbo"),
    maxTokens: 2000,
    schema: AnswerSchema,
    prompt: `Answer the following question: "${question}"`,
  }).then(async (result) => {
    try {
      for await (const value of result.partialObjectStream) {
        answerUI.update(value.answer);
      }
    } finally {
      isGeneratingStream.update(false);
      isGeneratingStream.done();
      answerUI.done();
    }
  });

  return {
    isGenerating: isGeneratingStream.value,
    answerUI: answerUI.value,
  };
}

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    streamAnswer,
  },
  initialUIState,
  // initialAIState,
});