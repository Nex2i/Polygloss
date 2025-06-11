import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { HttpMethods } from '@/utils/HttpMethods';
import { getAvailableSkillLevels, getLessonPlanBySkillLevel } from '@/data/lessonPlansDict';

const basePath = '/lesson-plans';

interface GetLessonPlanRequest {
  Querystring: {
    skillLevel: number;
  };
}

export default async function LessonPlans(fastify: FastifyInstance, _opts: RouteOptions) {
  // Get lesson plan by skill level
  fastify.route<GetLessonPlanRequest>({
    method: HttpMethods.GET,
    url: `${basePath}`,
    handler: async (req: FastifyRequest<GetLessonPlanRequest>, reply: FastifyReply) => {
      try {
        const { skillLevel } = req.query;

        // Validate skill level
        if (!skillLevel || skillLevel < 1 || skillLevel > 10) {
          return reply.status(400).send({
            error: 'Invalid skill level',
            message: 'Skill level must be a number between 1 and 10',
          });
        }

        // Get lesson plan from dictionary
        const lessonPlan = getLessonPlanBySkillLevel(skillLevel);

        if (!lessonPlan) {
          return reply.status(404).send({
            error: 'Lesson plan not found',
            message: `No lesson plan available for skill level ${skillLevel}`,
          });
        }

        return reply.status(200).send({
          success: true,
          data: lessonPlan,
        });
      } catch (error) {
        fastify.log.error(
          {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
          'Unexpected error in lesson plans retrieval'
        );

        return reply.status(500).send({
          error: 'Internal server error',
          message: 'Failed to retrieve lesson plan',
        });
      }
    },
    schema: {
      tags: ['Lesson Plans'],
      summary: 'Get Lesson Plan by Skill Level',
      description: 'Retrieves a lesson plan based on the specified skill level (1-10).',
      querystring: {
        type: 'object',
        required: ['skillLevel'],
        properties: {
          skillLevel: {
            type: 'number',
            minimum: 1,
            maximum: 10,
            description:
              'The skill level for the lesson plan (1-10, where 1 is beginner and 10 is advanced)',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                skillLevel: { type: 'number' },
                objectives: {
                  type: 'array',
                  items: { type: 'string' },
                },
                activities: {
                  type: 'array',
                  items: { type: 'string' },
                },
                duration: { type: 'string' },
                vocabulary: {
                  type: 'array',
                  items: { type: 'string' },
                },
                grammar: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
          },
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  });

  // Get all available skill levels
  fastify.route({
    method: HttpMethods.GET,
    url: `${basePath}/levels`,
    handler: (_req: FastifyRequest, reply: FastifyReply) => {
      const availableLevels = getAvailableSkillLevels().map((skillLevel) => {
        const lessonPlan = getLessonPlanBySkillLevel(skillLevel);
        if (!lessonPlan) {
          throw new Error(`Lesson plan not found for skill level ${skillLevel}`);
        }
        return {
          skillLevel,
          title: lessonPlan.title,
          description: lessonPlan.description,
        };
      });

      return reply.status(200).send({
        success: true,
        data: availableLevels,
      });
    },
    schema: {
      tags: ['Lesson Plans'],
      summary: 'Get Available Skill Levels',
      description: 'Retrieves all available skill levels with their lesson plan titles.',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  skillLevel: { type: 'number' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
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
        message: 'Lesson Plans API is available',
        availableLevels: getAvailableSkillLevels(),
      });
    },
    schema: {
      tags: ['Lesson Plans'],
      summary: 'Lesson Plans Health Check',
      description: 'Health check for the lesson plans API.',
    },
  });
}
