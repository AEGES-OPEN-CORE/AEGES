// 🔄 Patched QSAFP Integration Example (with LLMAdapter support)
import { getLLMResponse } from "./LLMAdapter.js";

async function runDemo() {
  const prompt = "Explain the core function of QSAFP in 100 words";
  const provider = process.env.LLM_PROVIDER || "mock";

  const response = await getLLMResponse(prompt, provider);
  console.log("\n🤖 Response from:", provider.toUpperCase());
  console.log(response);
}

runDemo();
