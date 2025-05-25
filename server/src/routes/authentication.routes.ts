import { FastifyInstance, RouteOptions } from "fastify";
import { HttpMethods } from "@/utils/HttpMethods";

const basePath = "/auth";

export default async function Authentication(
  fastify: FastifyInstance,
  _opts: RouteOptions
) {
  fastify.route({
    method: HttpMethods.POST,
    url: `${basePath}/login`,
    handler: () => {},
    schema: {
      tags: ["Authentication"],
      summary: "Login",
      description: "Authenticate a user and return a JWT.",
    },
  });

  fastify.route({
    method: HttpMethods.DELETE,
    url: `${basePath}/logout`,
    handler: () => {},
    preHandler: [fastify.authPrehandler],
    schema: {
      tags: ["Authentication"],
      summary: "Logout",
      description: "Logout a user.",
    },
  });

  fastify.route({
    method: HttpMethods.GET,
    url: `${basePath}`,
    handler: () => {},
    preHandler: [fastify.authPrehandler],
    schema: {
      tags: ["Authentication"],
      summary: "Get Auth Info",
      description: "Get authentication info for the current user.",
    },
  });

  fastify.route({
    method: HttpMethods.DELETE,
    url: `${basePath}/user/:userId`,
    handler: () => {},
    preHandler: [fastify.authPrehandler],
    schema: {
      tags: ["Authentication"],
      summary: "Delete User",
      description: "Delete a user by userId.",
    },
  });
}
