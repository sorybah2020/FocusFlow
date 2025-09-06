import { GoogleGenAI } from "@google/genai";

// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TaskSuggestion {
  category: string;
  priority: "low" | "medium" | "urgent";
  estimatedDuration: number; // in minutes
  subtasks?: string[];
  reasoning: string;
}

export interface TaskGroupSuggestion {
  groupName: string;
  tasks: string[];
  reasoning: string;
  estimatedTotalTime: number;
}

export async function analyzeTask(title: string, description?: string): Promise<TaskSuggestion> {
  try {
    const prompt = `Analyze this task for someone with ADHD who needs clear, actionable steps:

Task: "${title}"
Description: "${description || 'No description provided'}"

Provide analysis in JSON format with:
- category: academic, personal, work, or health
- priority: low, medium, or urgent (based on typical student needs)
- estimatedDuration: time in minutes to complete
- subtasks: array of 2-4 smaller, specific steps if the task is complex
- reasoning: brief explanation of categorization and priority

Focus on ADHD-friendly approaches: clear steps, realistic time estimates, and manageable chunks.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            category: { type: "string" },
            priority: { type: "string" },
            estimatedDuration: { type: "number" },
            subtasks: { type: "array", items: { type: "string" } },
            reasoning: { type: "string" },
          },
          required: ["category", "priority", "estimatedDuration", "reasoning"],
        },
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return {
      category: result.category || "personal",
      priority: result.priority || "medium",
      estimatedDuration: result.estimatedDuration || 30,
      subtasks: result.subtasks || [],
      reasoning: result.reasoning || "AI analysis completed"
    };
  } catch (error) {
    console.error("AI task analysis error:", error);
    // Fallback response
    return {
      category: "personal",
      priority: "medium",
      estimatedDuration: 30,
      reasoning: "AI analysis unavailable - using defaults"
    };
  }
}

export async function suggestTaskGroups(tasks: { title: string; description?: string; priority: string }[]): Promise<TaskGroupSuggestion[]> {
  if (tasks.length < 2) return [];

  try {
    const taskList = tasks.map((task, index) => 
      `${index + 1}. ${task.title} (${task.priority} priority)${task.description ? ` - ${task.description}` : ''}`
    ).join('\n');

    const prompt = `Group these tasks for optimal ADHD productivity. Focus on:
- Similar contexts or locations
- Complementary energy levels
- Natural workflow sequences

Tasks:
${taskList}

Provide 2-3 grouping suggestions in JSON format:
{
  "groups": [
    {
      "groupName": "descriptive name",
      "tasks": ["task titles"],
      "reasoning": "why these work well together",
      "estimatedTotalTime": minutes
    }
  ]
}

Consider ADHD challenges: context switching difficulty, energy management, and hyperfocus opportunities.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            groups: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  groupName: { type: "string" },
                  tasks: { type: "array", items: { type: "string" } },
                  reasoning: { type: "string" },
                  estimatedTotalTime: { type: "number" }
                },
                required: ["groupName", "tasks", "reasoning", "estimatedTotalTime"]
              }
            }
          },
          required: ["groups"]
        },
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return result.groups || [];
  } catch (error) {
    console.error("AI task grouping error:", error);
    return [];
  }
}

export async function breakDownLargeTask(title: string, description?: string): Promise<string[]> {
  try {
    const prompt = `Break down this potentially overwhelming task into 3-6 smaller, specific, actionable steps for someone with ADHD:

Task: "${title}"
Description: "${description || 'No description provided'}"

Provide a JSON array of specific steps that are:
- Clear and actionable
- Not overwhelming (15-45 minutes each)
- In logical order
- Specific enough to start immediately

Format: {"steps": ["step 1", "step 2", ...]}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            steps: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["steps"]
        },
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return result.steps || [];
  } catch (error) {
    console.error("AI task breakdown error:", error);
    
    // Provide ADHD-friendly fallback breakdowns based on task type
    return generateFallbackBreakdown(title, description);
  }
}

function generateFallbackBreakdown(title: string, description?: string): string[] {
  const titleLower = title.toLowerCase();
  
  // Coding/Programming tasks
  if (titleLower.includes('code') || titleLower.includes('program') || titleLower.includes('develop') || titleLower.includes('project')) {
    return [
      "Set up development environment and open project files",
      "Review requirements and break down into small features",
      "Implement first small feature or function",
      "Test the implemented feature",
      "Add documentation and clean up code",
      "Commit changes and plan next steps"
    ];
  }
  
  // Study/Research tasks
  if (titleLower.includes('study') || titleLower.includes('research') || titleLower.includes('learn') || titleLower.includes('read')) {
    return [
      "Gather all materials and create a quiet study space",
      "Create an outline of topics to cover",
      "Study first section for 25 minutes with notes",
      "Take a 5-minute break and review notes",
      "Study second section and make connections",
      "Summarize key points and create review cards"
    ];
  }
  
  // Writing tasks
  if (titleLower.includes('write') || titleLower.includes('essay') || titleLower.includes('report') || titleLower.includes('paper')) {
    return [
      "Brainstorm ideas and create a rough outline",
      "Research and gather supporting materials",
      "Write the introduction paragraph",
      "Draft the main body sections",
      "Write conclusion and review overall flow",
      "Edit for clarity and check formatting"
    ];
  }
  
  // Assignment/Homework tasks
  if (titleLower.includes('assignment') || titleLower.includes('homework') || titleLower.includes('exercise')) {
    return [
      "Read assignment instructions carefully",
      "Gather all required materials and resources",
      "Break the assignment into smaller questions/parts",
      "Complete first part and check work",
      "Complete remaining parts one by one",
      "Review entire assignment before submitting"
    ];
  }
  
  // Generic task breakdown
  return [
    "Gather all materials and information needed",
    "Break the task into smaller, specific steps", 
    "Complete first step and mark progress",
    "Work on remaining steps one at a time",
    "Review and finalize the completed work"
  ];
}