"use server";

import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

const AnswerSchema = z.object({
  answer: z.string(),
  question: z.string(),
});

export async function streamAnswer(question: string) {
  const isGeneratingStream = createStreamableValue(true);
  const answerStream = createStreamableValue();

  streamObject({
    model: openai("gpt-3.5-turbo"),
    maxTokens: 2000,
    schema: AnswerSchema,
    prompt: `Answer the following question: "${question}"`,
  }).then(async (result) => {
    try {
      for await (const value of result.partialObjectStream) {
        answerStream.update(value);
        console.log(`---------------- value:  `, value);
      }
    } finally {
      isGeneratingStream.done(false);
      answerStream.done();
    }
  });

  return {
    isGenerating: isGeneratingStream.value,
    answer: answerStream.value,
  };
}
