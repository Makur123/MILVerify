import { type User, type InsertUser, type Analysis, type InsertAnalysis, type LearningModule, type InsertLearningModule, type UserProgress, type InsertUserProgress, type Achievement, type InsertAchievement } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Analysis management
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysesByUser(userId: string, limit?: number): Promise<Analysis[]>;
  getAnalysis(id: string): Promise<Analysis | undefined>;

  // Learning modules
  getLearningModules(): Promise<LearningModule[]>;
  createLearningModule(module: InsertLearningModule): Promise<LearningModule>;

  // User progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(userId: string, moduleId: string, progress: Partial<UserProgress>): Promise<UserProgress>;

  // Achievements
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analyses: Map<string, Analysis>;
  private learningModules: Map<string, LearningModule>;
  private userProgress: Map<string, UserProgress>;
  private achievements: Map<string, Achievement>;

  constructor() {
    this.users = new Map();
    this.analyses = new Map();
    this.learningModules = new Map();
    this.userProgress = new Map();
    this.achievements = new Map();

    // Initialize with default learning modules
    this.initializeDefaultModules();
  }

  private initializeDefaultModules() {
    const modules = [
      {
        id: randomUUID(),
        title: "AI Content Basics",
        description: "Understanding AI-generated content and its implications",
        content: {
          sections: [
            {
              title: "What is AI-Generated Content?",
              type: "text",
              content: "Learn about different types of AI-generated content and how they're created."
            },
            {
              title: "Common AI Tools",
              type: "interactive",
              content: "Explore popular AI tools and their capabilities."
            }
          ]
        },
        order: 1,
        isActive: true
      },
      {
        id: randomUUID(),
        title: "Deepfake Detection",
        description: "Learn to identify AI-generated faces and manipulated videos",
        content: {
          sections: [
            {
              title: "Spotting Facial Inconsistencies",
              type: "video",
              content: "Video tutorial on detecting deepfakes"
            },
            {
              title: "Interactive Quiz",
              type: "quiz",
              content: "Test your deepfake detection skills"
            }
          ]
        },
        order: 2,
        isActive: true
      },
      {
        id: randomUUID(),
        title: "Source Verification",
        description: "Learn to trace information to its original source and verify credibility",
        content: {
          sections: [
            {
              title: "The SIFT Method",
              type: "text",
              content: "Stop, Investigate, Find, Trace - a systematic approach to verification"
            }
          ]
        },
        order: 3,
        isActive: true
      },
      {
        id: randomUUID(),
        title: "Critical Thinking",
        description: "Advanced techniques for evaluating claims and identifying bias",
        content: {
          sections: [
            {
              title: "Cognitive Biases",
              type: "interactive",
              content: "Understanding how biases affect information processing"
            }
          ]
        },
        order: 4,
        isActive: true
      }
    ];

    modules.forEach(module => {
      this.learningModules.set(module.id, module as LearningModule);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      learningProgress: {},
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = randomUUID();
    const analysis: Analysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date()
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAnalysesByUser(userId: string, limit = 10): Promise<Analysis[]> {
    return Array.from(this.analyses.values())
      .filter(analysis => analysis.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }

  async getLearningModules(): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values())
      .filter(module => module.isActive)
      .sort((a, b) => a.order - b.order);
  }

  async createLearningModule(insertModule: InsertLearningModule): Promise<LearningModule> {
    const id = randomUUID();
    const module: LearningModule = {
      ...insertModule,
      id
    };
    this.learningModules.set(id, module);
    return module;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId);
  }

  async updateUserProgress(userId: string, moduleId: string, progressUpdate: Partial<UserProgress>): Promise<UserProgress> {
    const existingKey = `${userId}-${moduleId}`;
    const existing = Array.from(this.userProgress.values())
      .find(p => p.userId === userId && p.moduleId === moduleId);

    const id = existing?.id || randomUUID();
    const progress: UserProgress = {
      id,
      userId,
      moduleId,
      completed: false,
      progress: 0,
      lastAccessed: new Date(),
      ...existing,
      ...progressUpdate
    };

    this.userProgress.set(id, progress);
    return progress;
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime());
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      earnedAt: new Date()
    };
    this.achievements.set(id, achievement);
    return achievement;
  }
}

export const storage = new MemStorage();
