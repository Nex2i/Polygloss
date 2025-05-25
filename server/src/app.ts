import { join } from "path";
import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyCors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifyHelmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import { schemaErrorFormatter } from "@/utils/schemaErrorFormatter";
import { CREDENTIALS, PORT, SECRET_KEY } from "@/config";
import { schema } from "@/utils/validateEnv";
import "@/extensions";
import { logger } from "@/libs/logger";
import { globalErrorHandler } from "@/utils/globalErrorHandler";
import { getNetworkAddress } from "@/utils/network";

const port: number = Number(PORT) ?? 3001;

async function startServer() {
  const app = Fastify({
    schemaErrorFormatter,
    ajv: {
      customOptions: {
        coerceTypes: false,
        allErrors: true,
      },
      plugins: [],
    },
    logger: true,
    trustProxy: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Initialize Error Handling
  app.setErrorHandler(globalErrorHandler);

  // Initialize Plugins
  await app.register(fastifyEnv, { dotenv: true, schema });
  await app.register(fastifyCors, {
    origin: true,
    credentials: CREDENTIALS === "true",
  });
  await app.register(fastifyHelmet);
  await app.register(fastifyJwt, {
    secret: SECRET_KEY ?? "",
    sign: { expiresIn: "7d" },
  });

  await app.register(AutoLoad, {
    dir: join(__dirname, "/plugins"),
    dirNameRoutePrefix: false,
  });

  // Initialize Routes - KEEP THIS AS THE LAST REGISTRED ITEM
  await app.register(AutoLoad, {
    dir: join(__dirname, "/routes"),
    dirNameRoutePrefix: false,
    options: { prefix: `/api` },
  });

  // Start listening
  try {
    await app.listen({ port, host: "0.0.0.0" });

    const networkAddress = getNetworkAddress();
    logger.info(
      `Server running on port ${port} \nLocal: http://localhost:${port} \nNetwork: http://${networkAddress}:${port}`
    );
  } catch (err) {
    logger.error("APP ERROR", err);
    // dbClient.$disconnect();
    process.exit(1);
  }

  return app;
}

export default startServer;

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});
