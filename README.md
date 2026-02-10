# Comps Inc. 🚀

**Comps Inc.** is an advanced AI-powered platform designed to build, preview, and compare UI components across multiple industry-standard libraries simultaneously.

## ✨ Features

- **Multi-Library Generation**: Generate components for 6 libraries at once: **Shadcn UI, Chakra UI, Material UI (MUI), Ant Design, Mantine, and DaisyUI.**
- **High-Performance Sandbox**: Custom-built iframe-based sandbox for lightning-fast, secure rendering of AI-generated code with full support for all major UI libraries.
- **Multimodal AI**: Build components from text descriptions or by uploading images/sketches using Gemini 2.5 Flash.
- **In-Place Iteration**: Edit and resend prompts directly within the chat history for rapid prototyping.
- **Library Comparison**: Side-by-side code and visual comparison to help you choose the best implementation for your needs.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Solar Icons.
- **Backend**: Bun, Hono, TypeScript.
- **Sandbox**: Dedicated Next.js runner with @babel/standalone for client-side transpilation.
- **AI Engine**: Google Gemini 2.5 Flash via LangChain.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime installed.
- Gemini API Key.

### 1. Backend Setup

1. `cd Backend`
2. `bun install`
3. Create `.env` with `GEMINI_API_KEY`.
4. `bun dev` (Runs on http://localhost:8000)

### 2. Sandbox Setup

The sandbox must be running to provide component previews.

1. `cd sandbox`
2. `bun install`
3. `bun dev` (Runs on http://localhost:3002)

### 3. Frontend Setup

1. `cd Frontend`
2. `bun install`
3. `bun dev` (Runs on http://localhost:3000)

Open [http://localhost:3000](http://localhost:3000) to start building.

---

Built with ❤️ by Comps Inc.
