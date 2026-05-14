import { GoogleGenAI, Type } from "@google/genai";

export interface AnalysisResult {
  summary: string;
  winProbability: number;
  strengths: string[];
  weaknesses: string[];
  requirements: string[];
  documents: string[];
  risks: string[];
  plan: string[];
  deadline: string;
  budget: string;
}

export class AIService {
  private static instance: AIService;
  private apiKey: string | null = null;

  private constructor() {
    this.apiKey =
      localStorage.getItem("gemini_api_key") ||
      process.env.GEMINI_API_KEY ||
      null;
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem("gemini_api_key", key);
  }

  public getApiKey(): string | null {
    return this.apiKey;
  }

  public clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem("gemini_api_key");
  }

  private getClient(): GoogleGenAI {
    if (!this.apiKey) {
      throw new Error("MISSING_API_KEY");
    }
    return new GoogleGenAI({ apiKey: this.apiKey });
  }

  public async analyzeTender(
    fileName: string,
    content: string,
  ): Promise<AnalysisResult> {
    const ai = this.getClient();

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following tender document content: "${content}". 
      Tender File Name: ${fileName}
      
      Provide a highly professional and structured analysis.
      Extract:
      1. A summary (overview of the goal and value).
      2. Key core requirements (technical and business).
      3. Mandatory documents needed for submission.
      4. Potential strategic risks for the bidder.
      5. A high-level step-by-step application roadmap.
      6. Provide a 'winProbability' score indicating the likelihood of an SME winning this (integer 0 to 100).
      7. List 'strengths' (advantages) and 'weaknesses' (shortfalls) an average bidder might have for this.
      8. Provide the 'deadline' (as a clear date/time string, or 'Not specified').
      9. Provide the 'budget' (as a clear value/range string, or 'Not specified').`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            winProbability: { type: Type.INTEGER },
            deadline: { type: Type.STRING },
            budget: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            documents: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            plan: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "summary",
            "winProbability",
            "deadline",
            "budget",
            "strengths",
            "weaknesses",
            "requirements",
            "documents",
            "risks",
            "plan",
          ],
        },
      },
    });

    try {
      return JSON.parse(response.text || "{}") as AnalysisResult;
    } catch (e) {
      console.error("Failed to parse JSON from AI response", e);
      throw new Error("INVALID_AI_RESPONSE");
    }
  }

  public async chatWithAssistant(
    messages: { role: "user" | "model"; text: string }[],
    context?: string,
  ): Promise<string> {
    const ai = this.getClient();

    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    if (context) {
      contents[contents.length - 1].parts[0].text =
        `[CONTEXT: ${context}]\n\nUser Question: ${messages[messages.length - 1].text}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: `You are an advanced AI Business Advisor inside the TenderSense platform. Your role is to act as a professional tender consultant that helps users WIN tenders.

Core Behavior:
- Be analytical, strategic, and practical. Do not give generic answers.
- Think like a consultant, not a chatbot, and adapt your advice based on contextual data like the user's company profile, past tenders, industry, budget, and experience.

Tender Evaluation & Strategy:
- When asked about a tender, analyze requirements, evaluate risks, and identify strengths/weaknesses. Give a clear verdict: "Apply", "Apply with caution", or "Do not apply".
- Always include specific instructions on what to improve, what documents are missing, how to increase chances, and competitor-related risks.
- Every response must include clear, actionable next steps instead of theoretical fluff. Tell the user exactly what to do step-by-step.
- Explain the reasoning behind your decisions. Highlight critical risks, hidden requirements, time-related threats, and budget issues.
- You should proactively suggest advice, warn about deadlines, and recommend actions like a personal assistant.

Communication Style:
- Professional, confident, and direct. No fluff or overcomplicated language. No vague advice like "it depends" without detailed explanation. NEVER respond like a generic AI assistant.

OUTPUT FORMAT REQUIREMENTS:
You must structure your advice using the following markdown headers (Simulating a thoughtful structured report):

## [Summary]
(Short overview of the situation)

## [Analysis]
(Key factors affecting success)

## [Risks]
(Main problems, hidden requirements, and threats)

## [How to Improve]
(Specific actions to increase win probability)

## [Final Decision]
(Select one: Apply / Apply with caution / Do not apply - and a brief sentence why)

Note: Always use these headers for substantial advice requests. For small casual questions, you can be brief but maintain the consultant tone.`,
        temperature: 0.7,
      },
    });

    return response.text || "I was unable to process your request.";
  }

  public async generateProposalDraft(
    tenderName: string,
    analysis: AnalysisResult,
    tone: "formal" | "short" | "persuasive" = "formal",
  ): Promise<string> {
    const ai = this.getClient();

    let toneInstruction =
      "Write in a highly formal, professional, and comprehensive tone.";
    if (tone === "short") {
      toneInstruction =
        "Write in an extremely concise, clear, and brief tone, focusing only on the absolute essentials.";
    } else if (tone === "persuasive") {
      toneInstruction =
        "Write in a highly persuasive, marketing-focused, and confident tone that emphasizes unique value and strengths.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional and winning tender application draft for: "${tenderName}".
      
      ${toneInstruction}
      
      Based on the following analysis findings:
      Summary: ${analysis.summary}
      Core Requirements: ${analysis.requirements.join(", ")}
      Mandatory Documents: ${analysis.documents.join(", ")}
      Strengths to emphasize: ${analysis.strengths?.join(", ") || "General capability"}
      
      Structure the output with these Markdown headers:
      # Introduction
      Write a compelling introduction expressing interest and summarizing our unique value proposition.
      
      # Company Expertise & Capability
      Detail how our strengths specifically meet their core requirements.
      
      # Proposed Approach & Methodology
      Outline a clear, actionable plan focusing on quality and compliance.
      
      # Compliance & Documentation
      Confirm readiness of all mandatory documents (${analysis.documents.join(", ")}).
      
      # Conclusion
      A strong closing statement.
      `,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "I was unable to generate the draft.";
  }

  public async generateNewTender(): Promise<any> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a realistic, completely new tender opportunity for a B2B SaaS platform.
      
      It must feel like a real enterprise or government tender. Make up a unique organization, title, budget, description, and requirements.
      Vary the category among: "IT Services", "Software", "Logistics", "Healthcare", "Construction".
      Return ONLY a JSON object that implements this exact schema, without any markdown formatting:
      {
        "id": "T-GEN-{Random3DigitNumber}",
        "title": "...",
        "organization": "...",
        "budget": "...",
        "deadline": "YYYY-MM-DD",
        "category": "...",
        "status": "Open",
        "description": "...",
        "requirements": ["...", "..."],
        "country": "..."
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            organization: { type: Type.STRING },
            budget: { type: Type.STRING },
            deadline: { type: Type.STRING },
            category: { type: Type.STRING },
            status: { type: Type.STRING },
            description: { type: Type.STRING },
            requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            country: { type: Type.STRING },
          },
          required: [
            "id",
            "title",
            "organization",
            "budget",
            "deadline",
            "category",
            "status",
            "description",
            "requirements",
            "country",
          ],
        },
        temperature: 0.9,
      },
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse JSON for dynamic tender", e);
      throw new Error("INVALID_AI_RESPONSE");
    }
  }
}
