import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { HttpMethods } from '@/utils/HttpMethods';

const apiKey = process.env.ELEVENLABS_API_KEY;
const spanishAgentId = process.env.ELEVENLABS_AGENT_ID_SPANISH;

const elevenlabs = new ElevenLabsClient({ apiKey: apiKey });

const basePath = '/elevenlabs';

interface GetSignedUrlRequest {
  Body: {
    lessonLevel?: number;
  };
}

export default async function ElevenLabs(fastify: FastifyInstance, _opts: RouteOptions) {
  // Get signed URL for Eleven Labs conversation
  fastify.route<GetSignedUrlRequest>({
    method: HttpMethods.POST,
    url: `${basePath}/signed-url`,
    preHandler: [fastify.authPrehandler],
    handler: async (req: FastifyRequest<GetSignedUrlRequest>, reply: FastifyReply) => {
      try {
        if (!apiKey) {
          return reply.status(500).send({
            error: 'Eleven Labs API key not configured',
            message: 'ELEVENLABS_API_KEY environment variable is required',
          });
        }

        if (!spanishAgentId) {
          return reply.status(500).send({
            error: 'Eleven Labs Agent ID not configured',
            message: 'ELEVENLABS_AGENT_ID environment variable is required',
          });
        }

        // Get lesson level from request body (optional)
        const { lessonLevel } = req.body || {};

        console.log('APIKEY', apiKey);
        console.log('AGENTID', spanishAgentId);

        // Call Eleven Labs API to get signed URL
        const response = await elevenlabs.conversationalAi.conversations.getSignedUrl({
          agentId: spanishAgentId,
        });

        return reply.status(200).send({
          signedUrl: response.signedUrl,
          agentId: spanishAgentId,
          lessonLevel,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // URLs typically expire in 5 minutes
        });
      } catch (error) {
        fastify.log.error(
          {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
          'Unexpected error in signed URL generation'
        );

        return reply.status(500).send({
          error: 'Internal server error',
          message: 'Failed to generate signed URL',
        });
      }
    },
    schema: {
      tags: ['ElevenLabs'],
      summary: 'Get Signed URL for Eleven Labs Conversation',
      description: 'Generates a signed URL for secure Eleven Labs conversation access.',
      body: {
        type: 'object',
        properties: {
          lessonLevel: {
            type: 'number',
            minimum: 1,
            maximum: 10,
            description: 'Optional lesson level (1-10) for conversation context',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            signedUrl: { type: 'string' },
            agentId: { type: 'string' },
            lessonLevel: { type: 'number' },
            expiresAt: { type: 'string' },
          },
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            status: { type: 'number' },
          },
        },
      },
    },
  });

  // Health check route
  fastify.route({
    method: HttpMethods.GET,
    url: `${basePath}/health`,
    handler: (_req: FastifyRequest, reply: FastifyReply) => {
      return reply.status(200).send({
        message: 'Eleven Labs integration is available',
        hasApiKey: !!process.env.ELEVENLABS_API_KEY,
        hasAgentId: !!process.env.ELEVENLABS_AGENT_ID,
      });
    },
    schema: {
      tags: ['ElevenLabs'],
      summary: 'Eleven Labs Health Check',
      description: 'Health check for the Eleven Labs integration.',
    },
  });
}
