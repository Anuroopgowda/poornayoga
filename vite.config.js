import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    plugins: [
      react(),
      {
        name: "local-telegram-api",
        apply: "serve",
        configureServer(server) {
          server.middlewares.use("/api/telegram", async (req, res, next) => {
            if (req.method !== "POST") {
              res.setHeader("Allow", "POST");
              res.statusCode = 405;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: "Method not allowed." }));
              return;
            }

            try {
              let rawBody = "";
              for await (const chunk of req) {
                rawBody += chunk;
                if (rawBody.length > 8192) {
                  res.statusCode = 413;
                  res.setHeader("Content-Type", "application/json; charset=utf-8");
                  res.end(JSON.stringify({ error: "Form submission is too large." }));
                  return;
                }
              }

              let body;
              try {
                body = JSON.parse(rawBody || "{}");
              } catch {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify({ error: "Invalid form submission." }));
                return;
              }

              const { default: handler } = await import(
                pathToFileURL(resolve(server.config.root, "api/telegram.js")).href
              );
              const apiResponse = {
                setHeader(name, value) {
                  res.setHeader(name, value);
                },
                status(code) {
                  res.statusCode = code;
                  return this;
                },
                json(data) {
                  res.setHeader("Content-Type", "application/json; charset=utf-8");
                  res.end(JSON.stringify(data));
                  return this;
                },
              };
              await handler({ method: req.method, body }, apiResponse);
            } catch (error) {
              next(error);
            }
          });
        },
      },
    ],
  };
};
