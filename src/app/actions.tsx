"use server";

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createAI, createStreamableValue } from "ai/rsc";

export async function streamAnswer(question: string) {
  	// Booleans for indicating whether each stream is currently streaming
  const isGeneratingStream1 = createStreamableValue(true);
  const isGeneratingStream2 = createStreamableValue(true);

  // The current stream values
  const weatherStream = createStreamableValue("");
  const newsStream = createStreamableValue("");

	// Create the first stream. Notice that we don't use await here, so that we
	//  don't block the rest of this function from running.
  streamText({
    model: openai("gpt-3.5-turbo"),
    maxTokens: 2000,
    prompt: `What is New York's weather historically like in ${new Date().toLocaleString(
      "default",
      { month: "long" }
    )}?`,
  }).then(async (result) => {
    try {
      // Read from the async iterator. Set the stream value to each new word
		  //  received.
      for await (const value of result.textStream) {
        weatherStream.update(value || "");
      }
    } finally {
      // Set isGenerating to false, and close that stream.
      isGeneratingStream1.update(false);
      isGeneratingStream1.done();

      // Close the given stream so the request doesn't hang.
      weatherStream.done();
    }
  });

  // Same thing for the second stream.
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
});
