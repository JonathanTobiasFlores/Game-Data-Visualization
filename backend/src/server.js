import express from "express";
import helmet from "helmet";
import logger from "morgan";
import { router } from "./routers/router.js";
import { Client } from "@elastic/elasticsearch";

try {
  const client = new Client({
    node: `${process.env.ELASTIC_URL}`,
    auth: {
      apiKey: `${process.env.ELASTIC_API}`,
    },
    tls: { rejectUnauthorized: false }, // This is required if you are using self-signed certificates?
  });

  const resp = await client.info();

  console.log(resp);

  // Create an Express application.
  const app = express();

  // Set various HTTP headers to make the application little more secure.
  app.use(helmet());

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger("dev"));

  // Parse requests of the content type application/json.
  app.use(express.json());

  // Register routes.
  app.use("/", router);

  // Error handler.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500;
    err.message = err.message || "Internal Server Error";

    if (req.app.get("env") !== "development") {
      return res.status(err.status).json({
        status: err.status,
        message: err.message,
      });
    }

    // Development only
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      cause: err.cause
        ? {
            status: err.cause.status,
            message: err.cause.message,
            stack: err.cause.stack,
          }
        : null,
      stack: err.stack,
    });
  });

  // Starts the HTTP server listening for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
    console.log("Press Ctrl-C to terminate...");
  });
} catch (err) {
  console.error(err);
  process.exitCode = 1;
}
