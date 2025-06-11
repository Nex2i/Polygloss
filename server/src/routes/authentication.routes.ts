import { FastifyInstance, FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import { HttpMethods } from '@/utils/HttpMethods';
import { supabase } from '@/lib/supabaseClient'; // Import server-side Supabase client

const basePath = '/auth';

// Define schema for login if you were to implement it fully
// const loginBodySchema = {
//   type: 'object',
//   properties: {
//     email: { type: 'string', format: 'email' },
//     password: { type: 'string' },
//   },
//   required: ['email', 'password'],
// } as const;

export default async function Authentication(fastify: FastifyInstance, _opts: RouteOptions) {
  // Login route - Client should handle login directly with Supabase for this project.
  // This endpoint can be used if server-side login initiation is ever needed.
  fastify.route({
    method: HttpMethods.POST,
    url: `${basePath}/login`,
    // schema: { // Uncomment and define if you build out this endpoint
    //   body: loginBodySchema,
    //   tags: ['Authentication'],
    //   summary: 'Login',
    //   description: 'Authenticate a user and return a JWT. (Currently informational)',
    // },
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
      // const { email, password } = request.body as FromSchema<typeof loginBodySchema>;
      // try {
      //   const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      //   if (error) {
      //     reply.status(401).send({ message: 'Login failed', error: error.message });
      //     return;
      //   }
      //   reply.send({ message: 'Login successful', data });
      // } catch (error: any) {
      //   reply.status(500).send({ message: 'Internal server error during login', error: error.message });
      // }
      reply.send({
        message: 'Client handles login directly with Supabase. This endpoint is informational.',
      });
    },
  });

  // Logout route
  fastify.route({
    method: HttpMethods.DELETE,
    url: `${basePath}/logout`,
    preHandler: [fastify.authPrehandler], // Ensures user is authenticated
    schema: {
      tags: ['Authentication'],
      summary: 'Logout',
      description: 'Logout the currently authenticated user.',
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers?.authorization;
      const token = authHeader?.substring('Bearer '.length);

      if (!token) {
        // This should ideally not happen if authPrehandler ran successfully
        reply.status(400).send({ message: 'No token provided for logout.' });
        return;
      }

      try {
        // For server-side logout, we need to use the admin API to sign out the user's session
        // The token represents the user's JWT that we need to invalidate
        const { error } = await supabase.auth.admin.signOut(token);
        if (error) {
          fastify.log.error(`Supabase admin signOut error: ${error.message}`);
          reply.status(500).send({ message: 'Logout failed', error: error.message });
          return;
        }
        reply.send({ message: 'Logout successful' });
      } catch (error: any) {
        fastify.log.error(`Server error during logout: ${error.message}`);
        reply
          .status(500)
          .send({ message: 'Internal server error during logout', error: error.message });
      }
    },
  });

  // Get Auth Info route
  fastify.route({
    method: HttpMethods.GET,
    url: `${basePath}`,
    preHandler: [fastify.authPrehandler], // Ensures user is authenticated
    schema: {
      tags: ['Authentication'],
      summary: 'Get Auth Info',
      description: 'Get authentication info for the current user.',
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      // The user object is attached by the authPrehandler
      // Ensure your FastifyRequest type is extended to include 'user'
      const user = (request as any).user;
      if (user) {
        reply.send(user);
      } else {
        // This case should ideally be caught by authPrehandler
        reply.status(401).send({ message: 'Unauthorized: No user data found on request.' });
      }
    },
  });

  // Delete User route - Placeholder, not fully implemented
  fastify.route({
    method: HttpMethods.DELETE,
    url: `${basePath}/user/:userId`,
    preHandler: [fastify.authPrehandler], // Protect this route
    schema: {
      tags: ['Authentication'],
      summary: 'Delete User (Not Implemented)',
      description:
        'Delete a user by userId. (This endpoint is not fully implemented and requires admin privileges.)',
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string', description: 'ID of the user to delete' },
        },
        required: ['userId'],
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply
    ) => {
      const { userId } = request.params;
      // IMPORTANT: Deleting a user is a privileged operation.
      // You would need to use the Supabase Admin SDK or a service_role key here,
      // and ensure the calling user has administrative rights.
      // Example: await supabase.auth.admin.deleteUser(userId);
      fastify.log.warn(
        `Attempt to delete user ${userId} - This functionality requires admin privileges and is not fully implemented.`
      );
      reply
        .status(501)
        .send({ message: 'Not Implemented: User deletion requires admin privileges.' });
    },
  });
}
