# Comps Inc. 🚀

**Comps Inc.** is an advanced AI-powered platform designed to build, preview, and compare UI components across multiple industry-standard libraries simultaneously.

## ✨ Features

- **Multi-Library Generation**: Generate components for 6 libraries at once: **Shadcn UI, Chakra UI, Material UI (MUI), Ant Design, Mantine, and DaisyUI.**
- **Instant Sandbox Previews**: Live, interactive previews powered by Sandpack, perfectly themed to match your application.
- **Multimodal AI**: Build components from text descriptions or by uploading images/sketches using Gemini 3 Flash.
- **In-Place Iteration**: Edit and resend prompts directly within the chat history for rapid prototyping.
- **Library Comparison**: Side-by-side code and visual comparison to help you choose the best implementation for your needs.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Solar Icons.
- **Backend**: Bun, Hono, TypeScript.
- **AI Engine**: Google Gemini 3 Flash Preview via LangChain.
- **Sandbox**: @codesandbox/sandpack-react.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime installed.
- Gemini API Key.

### Backend Setup

1. `cd Backend`
2. `bun install`
3. Create `.env` with `GEMINI_API_KEY`.
4. `bun dev`

### Frontend Setup

1. `cd Frontend`
2. `bun install`
3. `bun dev`

Open [http://localhost:3000](http://localhost:3000) to start building.

---

Built with ❤️ by Comps Inc.
