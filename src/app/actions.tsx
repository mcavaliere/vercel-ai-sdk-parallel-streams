"use server";

import { openai } from "@ai-sdk/openai";
import { streamObject, streamText } from "ai";
import { createAI, createStreamableUI, createStreamableValue } from "ai/rsc";
import { z } from "zod";

const AnswerSchema = z.object({
  answer: z.string(),
  question: z.string(),
});

export async function streamAnswer(question: string) {
  const isGeneratingStream1 = createStreamableValue(true);
  const isGeneratingStream2 = createStreamableValue(true);
  const weatherStream = createStreamableValue("");
  const newsStream = createStreamableValue("");

  streamText({
    model: openai("gpt-3.5-turbo"),
    maxTokens: 2000,
    prompt: `What is New York's weather historically like in ${new Date().toLocaleString(
      "default",
      { month: "long" }
    )}?`,
  }).then(async (result) => {
    try {
      for await (const value of result.textStream) {
        weatherStream.update(value || "");
      }
    } finally {
      isGeneratingStream1.update(false);
      isGeneratingStream1.done();
      weatherStream.done();
    }
  });

  streamText({
    model: openai("gpt-3.5-turbo"),
    maxTokens: 2000,
    prompt: `What happened in the news in the past few years on today's date? Be concise and give only 5 news headlines. `,
  }).then(async (result) => {
    try {
      for await (const value of result.textStream) {
        newsStream.update(value || "");
      }
    } finally {
      isGeneratingStream2.update(false);
      isGeneratingStream2.done();
      newsStream.done();
    }
  });

  return {
    isGeneratingStream1: isGeneratingStream1.value,
    isGeneratingStream2: isGeneratingStream2.value,
    weatherStream: weatherStream.value,
    newsStream: newsStream.value,
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
