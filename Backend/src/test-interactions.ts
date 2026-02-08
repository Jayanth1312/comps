const BASE_URL = "http://localhost:3001/api";

async function testInteractions() {
  console.log("--- Login ---");
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@example.com",
      password: "password123",
    }),
  });

  const loginData = (await loginRes.json()) as any;
  const sessionId = loginData.sessionId;

  if (!sessionId) {
    console.log(
      "FAILED: No session ID. Make sure to run test-auth.ts signup first.",
    );
    return;
  }

  console.log("SUCCESS: Logged in with session:", sessionId);

  console.log("\n--- Testing Structured Interaction (Library Specific) ---");
  const compSlug = "accordion";
  const libraryName = "shadcn";

  // Like Shadcn version
  const toggleRes = await fetch(`${BASE_URL}/interactions/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
    body: JSON.stringify({
      componentSlug: compSlug,
      libraryName: libraryName,
      type: "like",
    }),
  });
  console.log("Toggle Status:", toggleRes.status);
  console.log("Toggle Response:", await toggleRes.text());

  // Verify Stats for the parent slug
  const statsRes = await fetch(
    `${BASE_URL}/interactions/stats?slugs=${compSlug}`,
    {
      headers: { Authorization: `Bearer ${sessionId}` },
    },
  );
  const statsData = (await statsRes.json()) as any;
  const accordionStats = statsData.stats[compSlug];

  console.log(
    `Stats for '${compSlug}':`,
    JSON.stringify(accordionStats, null, 2),
  );

  const success =
    accordionStats &&
    accordionStats.likes >= 1 &&
    accordionStats.hasLiked === true &&
    accordionStats.libraryStats[libraryName]?.type === "like";

  if (success) {
    console.log("\nSUCCESS: All structured interaction requirements met!");
    console.log("- hasLiked flag correctly reflects library-specific action.");
    console.log("- Persistence confirmed via stats fetch.");
  } else {
    console.log("\nFAILED: Verification failed.");
    console.log(
      "Expected: likes >= 1, hasLiked: true, libraryStats contains like.",
    );
  }
}

testInteractions().catch(console.error);
