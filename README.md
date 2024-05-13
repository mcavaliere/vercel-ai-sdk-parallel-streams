# Streaming content in parallel with the Vercel AI SDK

From the blog post located here: [Multiple Parallel AI Streams with the Vercel AI SDK](https://mikecavaliere.com/posts/multiple-parallel-streams-vercel-ai-sdk)

The app will stream two OpenAI API requests (one related to wather, another related to news) at the same time, and stream their content to two separate components on the page simultaneously.


## Installation

1. Clone the repo
2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root of the project and add the following:

```bash
OPENAI_API_KEY=your-openai-api-key
```


4. Run the development server:



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.





