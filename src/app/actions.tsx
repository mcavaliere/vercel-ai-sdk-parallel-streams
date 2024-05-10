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
  const isGeneratingStream = createStreamableValue(true);
  const isGeneratingStream1 = createStreamableValue(true);
  const isGeneratingStream2 = createStreamableValue(true);
  const weatherStream = createStreamableValue("");
  const newsStream = createStreamableValue("");
  // const answerStream = createStreamableValue("");

  // Stream the UI directly from the server.
  const answerUI = createStreamableUI(<div></div>);



  streamText({
    model: openai("gpt-3.5-turbo"),
    maxTokens: 2000,
    prompt: `What is today's weather in New York City in detail?`
  }).then(async (result) => {
    try {
      for await (const value of result.textStream) {
        console.log(`---------------- weather: `, value );
        weatherStream.update(value || "");
      }
    } finally {
      isGeneratingStream1.update(false);
      isGeneratingStream1.done();
      weatherStream.done()

      if (isGeneratingStream1.value === false && isGeneratingStream2.value === false) {
        isGeneratingStream.update(false);
        isGeneratingStream.done();
      }
    }
  });

  streamText({
    model: openai("gpt-3.5-turbo"),
    maxTokens: 2000,
    prompt: `What are today's top news headlines?`,
  }).then(async (result) => {
    try {
      for await (const value of result.textStream) {
        console.log(`---------------- news: `, value );
        newsStream.update(value || "");
      }
    } finally {
      isGeneratingStream2.update(false);
      isGeneratingStream2.done();
      newsStream.done()

      if (isGeneratingStream1.value === false && isGeneratingStream2.value === false) {
        isGeneratingStream.update(false);
        isGeneratingStream.done();
      }
    }
  });

  return {
    isGenerating: isGeneratingStream.value,
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