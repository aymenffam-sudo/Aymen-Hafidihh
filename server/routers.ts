import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { authenticateUser, registerUser, validateUsername, validatePasswordStrength } from "./auth";
import { sanitizeInput, validateFlouritKeyFormat, hasSQLInjectionPatterns, hasXSSPatterns, getClientIP } from "./security";
import { sendResetCommandToBot, getBotResponse } from "./telegram";
import { createFlouritKey, getFlouritKeysByUserId, updateFlouritKey, getAllUsers, createUser, deleteUser, updateUser } from "./db";
import { createAuditLog } from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    login: publicProcedure
      .input(z.object({
        username: z.string().min(3),
        password: z.string().min(8),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          if (hasSQLInjectionPatterns(input.username) || hasSQLInjectionPatterns(input.password)) {
            await createAuditLog({
              action: 'login_attempt',
              details: 'SQL injection detected',
              ipAddress: getClientIP(ctx.req),
              userAgent: ctx.req.headers['user-agent'] as string,
              status: 'failure',
            });
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
          }

          const user = await authenticateUser(input.username, input.password);
          
          if (!user) {
            await createAuditLog({
              userId: undefined,
              action: 'login_attempt',
              details: `Failed login attempt for username: ${input.username}`,
              ipAddress: getClientIP(ctx.req),
              userAgent: ctx.req.headers['user-agent'] as string,
              status: 'failure',
            });
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
          }

          await createAuditLog({
            userId: user.id,
            action: 'login_success',
            details: `User ${user.username} logged in`,
            ipAddress: getClientIP(ctx.req),
            userAgent: ctx.req.headers['user-agent'] as string,
            status: 'success',
          });

          return {
            success: true,
            user,
          };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Login failed' });
        }
      }),

    register: publicProcedure
      .input(z.object({
        username: z.string().min(3),
        password: z.string().min(8),
        name: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const usernameValidation = validateUsername(input.username);
          if (!usernameValidation.valid) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: usernameValidation.error });
          }

          const passwordValidation = validatePasswordStrength(input.password);
          if (!passwordValidation.valid) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: passwordValidation.errors.join(', ') });
          }

          if (hasSQLInjectionPatterns(input.username) || hasXSSPatterns(input.name || '')) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid input' });
          }

          const user = await registerUser(input.username, input.password, input.name);
          
          if (!user) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Registration failed' });
          }

          await createAuditLog({
            userId: user.id,
            action: 'user_registration',
            details: `New user registered: ${user.username}`,
            ipAddress: getClientIP(ctx.req),
            userAgent: ctx.req.headers['user-agent'] as string,
            status: 'success',
          });

          return {
            success: true,
            user,
          };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Registration failed' });
        }
      }),
  }),

  flourite: router({
    submitKey: protectedProcedure
      .input(z.object({
        keyCode: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          if (!validateFlouritKeyFormat(input.keyCode)) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid key format' });
          }

          if (hasSQLInjectionPatterns(input.keyCode)) {
            await createAuditLog({
              userId: ctx.user.id,
              action: 'key_submission',
              details: 'SQL injection detected in key',
              ipAddress: getClientIP(ctx.req),
              userAgent: ctx.req.headers['user-agent'] as string,
              status: 'failure',
            });
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid key' });
          }

          const botResult = await sendResetCommandToBot(input.keyCode);
          
          if (!botResult.success) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: botResult.error });
          }

          const keyRecord = await createFlouritKey({
            userId: ctx.user.id,
            keyCode: input.keyCode.toUpperCase(),
            status: 'processing',
            telegramMessageId: botResult.messageId,
          });

          await createAuditLog({
            userId: ctx.user.id,
            action: 'key_submission',
            details: `Key submitted: ${input.keyCode}`,
            ipAddress: getClientIP(ctx.req),
            userAgent: ctx.req.headers['user-agent'] as string,
            status: 'success',
          });

          return {
            success: true,
            keyId: 1,
            message: 'Key submitted successfully. Waiting for bot response...',
          };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to submit key' });
        }
      }),

    getKeys: protectedProcedure
      .query(async ({ ctx }) => {
        try {
          const keys = await getFlouritKeysByUserId(ctx.user.id);
          return keys;
        } catch (error) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch keys' });
        }
      }),
  }),

  admin: router({
    getUsers: protectedProcedure
      .query(async ({ ctx }) => {
        try {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
          }

          const users = await getAllUsers();
          return users.map(u => ({
            ...u,
            passwordHash: undefined,
          }));
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch users' });
        }
      }),

    createUser: protectedProcedure
      .input(z.object({
        username: z.string().min(3),
        password: z.string().min(8),
        name: z.string().optional(),
        role: z.enum(['user', 'admin']).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
          }

          const user = await registerUser(input.username, input.password, input.name);
          
          if (!user) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User creation failed' });
          }

          if (input.role === 'admin') {
            await updateUser(user.id, { role: 'admin' });
          }

          await createAuditLog({
            userId: ctx.user.id,
            action: 'user_created',
            details: `Admin created user: ${input.username}`,
            ipAddress: getClientIP(ctx.req),
            userAgent: ctx.req.headers['user-agent'] as string,
            status: 'success',
          });

          return { success: true, user };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User creation failed' });
        }
      }),

    deleteUser: protectedProcedure
      .input(z.object({
        userId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
          }

          await deleteUser(input.userId);

          await createAuditLog({
            userId: ctx.user.id,
            action: 'user_deleted',
            details: `Admin deleted user ID: ${input.userId}`,
            ipAddress: getClientIP(ctx.req),
            userAgent: ctx.req.headers['user-agent'] as string,
            status: 'success',
          });

          return { success: true };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User deletion failed' });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
