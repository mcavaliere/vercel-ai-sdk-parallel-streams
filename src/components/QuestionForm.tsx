"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SyntheticEvent, useState } from "react";
import { Button } from "./ui/button";
import { readStreamableValue, useUIState } from "ai/rsc";
import { streamAnswer } from "@/app/actions";
import { Spinner } from "./svgs/Spinner";

export function GenerationForm() {
  const [question, setQuestion] = useState<string>("");
  const [isGeneratingStream1, setIsGeneratingStream1] = useState<boolean>(false);
  const [isGeneratingStream2, setIsGeneratingStream2] = useState<boolean>(false);
  const [weather, setWeather] = useState<string>("");
  const [news, setNews] = useState<string>("");
  const isGenerating = isGeneratingStream1 || isGeneratingStream2;

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault();

    // Clear previous results.
    setNews("");
    setWeather("");

    const result = await streamAnswer(question);
    const isGeneratingStream1 = readStreamableValue(result.isGeneratingStream1);
    const isGeneratingStream2 = readStreamableValue(result.isGeneratingStream2);
    const weatherStream = readStreamableValue(result.weatherStream);
    const newsStream = readStreamableValue(result.newsStream);

    (async () => {
      for await (const value of isGeneratingStream1) {
        if (value != null) {
          setIsGeneratingStream1(value);
        }
      }
    })();

    (async () => {
      for await (const value of isGeneratingStream2) {
        if (value != null) {
          setIsGeneratingStream2(value);
        }
      }
    })();

    (async () => {
      for await (const value of weatherStream) {
        setWeather((existing) => (existing + value) as string);
      }
    })();

    (async () => {
      for await (const value of newsStream) {
        setNews((existing) => (existing + value) as string);
      }
    })();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full">
      <div className="inline-block mb-4 w-full flex flex-row gap-1">
        <Button type="submit">Generate News & Weather</Button>
      </div>
      {isGenerating ? (
        <div className="flex flex-row w-full justify-center items-center p-4 transition-all">
          <Spinner className="h-6 w-6 text-slate-900" />
        </div>
      ) : null}

      <h3 className="font-bold">Historical Weather</h3>
      <div className="mt-4 mb-8 p-4 rounded-md shadow-md bg-blue-100">
        {weather ? weather : null}
      </div>

      <h4 className="font-bold">Historical News</h4>
      <div className="mt-4 p-4 rounded-md shadow-md bg-green-100">{news ? news : null}</div>
    </form>
  );
}
