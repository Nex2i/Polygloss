import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { HttpMethods } from '@/utils/HttpMethods';

const basePath = '/chat';

export default async function Chat(fastify: FastifyInstance, _opts: RouteOptions) {
  // Optionally, keep a health check route for /chat
  fastify.route({
    method: HttpMethods.GET,
    url: `/chat`,
    handler: (_req: FastifyRequest, reply: FastifyReply) => {
      return reply.status(200).send({ message: 'Chat socket.io endpoint is available.' });
    },
    schema: {
      tags: ['Chat'],
      summary: 'Chat Health Check',
      description: 'Health check for the chat endpoint.',
    },
  });
}
