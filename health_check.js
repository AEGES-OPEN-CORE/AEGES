// health_check.js
// Health check script for Docker containers and local runs

import http from "http";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

(async () => {
  try {
    const port = Number(process.env.PORT || 3000);

    const options = {
      hostname: "localhost",
      port,
      path: "/api/health",
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log("✅ Health check passed");
        process.exit(0);
      } else {
        console.error(`❌ Health check failed: ${res.statusCode}`);
        process.exit(1);
      }
    });

    req.on("error", (err) => {
      console.error("❌ Health check error:", err.stack || err.message || err);
      process.exit(1);
    });

    req.end();
  } catch (e) {
    console.error("❌ Health check script exception:", e.stack || e.message || e);
    process.exit(1);
  }
})();
