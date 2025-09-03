import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTaskSchema, insertFocusSessionSchema, insertNoteSchema, insertHabitSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Legacy user routes (for development/testing)
  const SAMPLE_USER_ID = "sample-user-id";
  
  app.get("/api/users/current", async (req, res) => {
    try {
      const user = await storage.getUser(SAMPLE_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.patch("/api/users/current", async (req, res) => {
    try {
      const updatedUser = await storage.updateUser(SAMPLE_USER_ID, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks(SAMPLE_USER_ID);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      // Convert dueDate string back to Date object if it exists
      const fullTaskData = { 
        ...req.body, 
        userId: SAMPLE_USER_ID,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
      };
      
      const taskData = insertTaskSchema.parse(fullTaskData);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTask = await storage.updateTask(id, req.body);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Focus Sessions
  app.get("/api/focus-sessions", async (req, res) => {
    try {
      const sessions = await storage.getFocusSessions(SAMPLE_USER_ID);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get focus sessions" });
    }
  });

  app.post("/api/focus-sessions", async (req, res) => {
    try {
      const sessionData = insertFocusSessionSchema.parse({ ...req.body, userId: SAMPLE_USER_ID });
      const session = await storage.createFocusSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  // Notes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getNotes(SAMPLE_USER_ID);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const noteData = insertNoteSchema.parse({ ...req.body, userId: SAMPLE_USER_ID });
      const note = await storage.createNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.patch("/api/notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedNote = await storage.updateNote(id, req.body);
      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(updatedNote);
    } catch (error) {
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteNote(id);
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Habits
  app.get("/api/habits", async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const habits = await storage.getHabits(SAMPLE_USER_ID, date);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Failed to get habits" });
    }
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse({ ...req.body, userId: SAMPLE_USER_ID });
      const habit = await storage.createHabit(habitData);
      res.status(201).json(habit);
    } catch (error) {
      res.status(400).json({ message: "Invalid habit data" });
    }
  });

  app.patch("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedHabit = await storage.updateHabit(id, req.body);
      if (!updatedHabit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      res.json(updatedHabit);
    } catch (error) {
      res.status(500).json({ message: "Failed to update habit" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
