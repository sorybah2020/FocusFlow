import { 
  type User, 
  type InsertUser, 
  type UpsertUser,
  type Task, 
  type InsertTask,
  type FocusSession,
  type InsertFocusSession,
  type Note,
  type InsertNote,
  type Habit,
  type InsertHabit,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Tasks
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // Focus Sessions
  getFocusSessions(userId: string): Promise<FocusSession[]>;
  createFocusSession(session: InsertFocusSession): Promise<FocusSession>;

  // Notes
  getNotes(userId: string): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;

  // Habits
  getHabits(userId: string, date?: Date): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<string, Task>;
  private focusSessions: Map<string, FocusSession>;
  private notes: Map<string, Note>;
  private habits: Map<string, Habit>;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.focusSessions = new Map();
    this.notes = new Map();
    this.habits = new Map();

    // Initialize with a sample user
    const sampleUser: User = {
      id: "sample-user-id",
      firstName: "Jordan",
      lastName: "Smith",
      email: "jordan@example.com",
      profileImageUrl: null,
      level: 12,
      totalFocusTime: 150, // 2.5 hours
      currentStreak: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(sampleUser.id, sampleUser);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id!;
    const existingUser = this.users.get(id);
    const user: User = {
      id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      level: existingUser?.level || 1,
      totalFocusTime: existingUser?.totalFocusTime || 0,
      currentStreak: existingUser?.currentStreak || 0,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id, 
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      level: insertUser.level || 1,
      totalFocusTime: insertUser.totalFocusTime || 0,
      currentStreak: insertUser.currentStreak || 0,
      createdAt: new Date(),
      updatedAt: new Date()
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

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = { 
      ...insertTask, 
      id, 
      completed: false,
      description: insertTask.description || null,
      dueDate: insertTask.dueDate || null,
      createdAt: new Date() 
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Focus Sessions
  async getFocusSessions(userId: string): Promise<FocusSession[]> {
    return Array.from(this.focusSessions.values()).filter(session => session.userId === userId);
  }

  async createFocusSession(insertSession: InsertFocusSession): Promise<FocusSession> {
    const id = randomUUID();
    const session: FocusSession = { 
      ...insertSession, 
      id, 
      taskId: insertSession.taskId || null,
      completedAt: new Date() 
    };
    this.focusSessions.set(id, session);
    return session;
  }

  // Notes
  async getNotes(userId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.userId === userId);
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = { 
      ...insertNote, 
      id, 
      tags: insertNote.tags || null,
      createdAt: now,
      updatedAt: now 
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const updatedNote = { ...note, ...updates, updatedAt: new Date() };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Habits
  async getHabits(userId: string, date?: Date): Promise<Habit[]> {
    const habits = Array.from(this.habits.values()).filter(habit => habit.userId === userId);
    if (date) {
      const targetDate = date.toDateString();
      return habits.filter(habit => habit.date?.toDateString() === targetDate);
    }
    return habits;
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = randomUUID();
    const habit: Habit = { 
      ...insertHabit, 
      id, 
      completed: insertHabit.completed || false,
      date: new Date() 
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;
    
    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Tasks - using memory storage for now, can implement database later
  private memStorage = new MemStorage();

  async getTasks(userId: string): Promise<Task[]> {
    return this.memStorage.getTasks(userId);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.memStorage.getTask(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    return this.memStorage.createTask(task);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    return this.memStorage.updateTask(id, updates);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.memStorage.deleteTask(id);
  }

  async getFocusSessions(userId: string): Promise<FocusSession[]> {
    return this.memStorage.getFocusSessions(userId);
  }

  async createFocusSession(session: InsertFocusSession): Promise<FocusSession> {
    return this.memStorage.createFocusSession(session);
  }

  async getNotes(userId: string): Promise<Note[]> {
    return this.memStorage.getNotes(userId);
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.memStorage.getNote(id);
  }

  async createNote(note: InsertNote): Promise<Note> {
    return this.memStorage.createNote(note);
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined> {
    return this.memStorage.updateNote(id, updates);
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.memStorage.deleteNote(id);
  }

  async getHabits(userId: string, date?: Date): Promise<Habit[]> {
    return this.memStorage.getHabits(userId, date);
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    return this.memStorage.createHabit(habit);
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    return this.memStorage.updateHabit(id, updates);
  }
}

// Use database storage for production with Replit Auth
export const storage = new DatabaseStorage();
