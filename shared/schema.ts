import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  learningProgress: jsonb("learning_progress").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  contentType: text("content_type").notNull(), // 'text', 'image', 'audio'
  contentText: text("content_text"),
  fileName: text("file_name"),
  fileType: text("file_type"),
  fileSize: integer("file_size"),
  results: jsonb("results").notNull(),
  overallConfidence: real("overall_confidence").notNull(),
  isAiGenerated: boolean("is_ai_generated").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const learningModules = pgTable("learning_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: jsonb("content").notNull(),
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  moduleId: varchar("module_id").references(() => learningModules.id).notNull(),
  completed: boolean("completed").default(false),
  progress: real("progress").default(0),
  lastAccessed: timestamp("last_accessed").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'first_analysis', 'streak', 'module_complete', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessed: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type LearningModule = typeof learningModules.$inferSelect;
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
