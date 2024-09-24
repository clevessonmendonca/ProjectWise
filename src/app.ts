import fastify from 'fastify';
import cors from '@fastify/cors';
import FastifyOauth2 from '@fastify/oauth2';
import authRoutes from './api/routes/authRoutes';
import boardRoutes from './api/routes/boardRoutes';
import profileRoutes from './api/routes/profileRoutes';
import projectRoutes from './api/routes/projectRoutes';
import roleRoutes from './api/routes/roleRoutes';
import taskRoutes from './api/routes/taskRoutes';
import userRoutes from './api/routes/userRoutes';
import workspaceRoutes from './api/routes/workspaceRoutes';
import openaiRoutes from './IA/openAI/routes/openaiRoutes';

export const app = fastify();

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Configuração do OAuth2 do Google
app.register(FastifyOauth2, {
  name: 'googleOAuth2',
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID as string,
      secret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    auth: FastifyOauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/login/google',
  callbackUri: 'http://localhost:5000/login/google/callback',
  scope: ['profile', 'email'],
});

app.register(authRoutes);
app.register(profileRoutes, { prefix: '/profile' });
app.register(userRoutes, { prefix: '/users' });
app.register(roleRoutes, { prefix: '/roles' });
app.register(projectRoutes, { prefix: '/projects' });
app.register(boardRoutes, { prefix: '/boards' });
app.register(taskRoutes, { prefix: '/tasks' });
app.register(workspaceRoutes, { prefix: '/workspace' });

app.register(openaiRoutes, { prefix: '/ia/openai' }); 

async function start() {
  try {
    const address = await app.listen({ port: 5000 });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
