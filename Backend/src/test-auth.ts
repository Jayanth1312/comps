const BASE_URL = "http://localhost:3001/api/auth";

async function testAuth() {
  console.log("--- Testing Signup ---");
  const signupRes = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@example.com",
      password: "password123",
    }),
  });
  console.log("Signup Status:", signupRes.status);
  console.log("Signup Body:", await signupRes.json());

  console.log("\n--- Testing Login ---");
  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@example.com",
      password: "password123",
    }),
  });
  console.log("Login Status:", loginRes.status);
  const loginData = await loginRes.json();
  console.log("Login Body:", loginData);

  if (loginData.sessionId) {
    console.log("\nSUCCESS: Session ID created:", loginData.sessionId);
  } else {
    console.log("\nFAILED: No session ID returned");
  }
}

testAuth().catch(console.error);
