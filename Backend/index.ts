const server = Bun.serve({
  port: 3001,
  fetch(req) {
    return new Response("Hello from Bun backend 👋");
  },
});

console.log(`Server running on http://localhost:${server.port}`);
