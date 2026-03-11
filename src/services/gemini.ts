import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const getGeminiModel = (modelName = "gemini-3.1-pro-preview") => {
  return ai;
};

export const generateFrenchContent = async (prompt: string, systemInstruction: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  return response.text;
};

export const getWritingFeedback = async (text: string) => {
  const systemInstruction = `Tu es un examinateur expert du DELF B2 / DALF C1. 
  Analyse le texte fourni par l'étudiant. 
  Donne des corrections précises sur la grammaire, le vocabulaire et la structure.
  Suggère des expressions plus sophistiquées (niveau C1).
  Réponds en français de manière encourageante mais rigoureuse.
  Utilise le format Markdown.`;

  return generateFrenchContent(`Voici mon texte : \n\n${text}`, systemInstruction);
};

export const generateReadingArticle = async (topic: string, level: 'B2' | 'C1') => {
  const systemInstruction = `Génère un article de presse ou un essai court en français sur le sujet suivant : ${topic}.
  Le niveau doit être strictement ${level}.
  Inclus un titre accrocheur.
  Après l'article, propose 5 mots de vocabulaire difficiles avec leurs définitions en français.
  Propose également 3 questions de compréhension.
  IMPORTANT: Formatte les questions de la manière suivante :
  ### Questions de compréhension
  1. [Question 1]
  2. [Question 2]
  3. [Question 3]
  
  Formatte le tout en Markdown.`;

  return generateFrenchContent(`Sujet : ${topic}`, systemInstruction);
};

export const evaluateReadingAnswers = async (article: string, questions: string, answers: string) => {
  const systemInstruction = `Tu es un examinateur expert du DELF B2 / DALF C1.
  Tu vas recevoir un article, des questions de compréhension sur cet article, et les réponses d'un étudiant.
  Ton rôle est de :
  1. Évaluer la pertinence et la précision de chaque réponse par rapport à l'article.
  2. Corriger les erreurs de grammaire, de syntaxe et de vocabulaire dans les réponses de l'étudiant.
  3. Donner une note globale sur 10 pour la compréhension.
  4. Proposer des versions améliorées (niveau C1) des réponses de l'étudiant.
  Réponds en français de manière constructive en utilisant le format Markdown.`;

  const prompt = `
  ARTICLE:
  ${article}

  QUESTIONS:
  ${questions}

  RÉPONSES DE L'ÉTUDIANT:
  ${answers}
  `;

  return generateFrenchContent(prompt, systemInstruction);
};
