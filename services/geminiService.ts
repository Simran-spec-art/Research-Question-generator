import { GoogleGenAI, Type } from '@google/genai';
import { FormData, GeneratedQuestion } from '../types';

// FIX: Removed API key check to adhere to coding guidelines, which assume the key is always present.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of four generated research questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The full text of the research question."
                    },
                    variantType: {
                        type: Type.STRING,
                        description: "The type of question variant (e.g., 'Primary Question', 'Sensitivity Analysis', 'Confounding Bias', 'Effect Modification')."
                    }
                },
                required: ["question", "variantType"],
            }
        }
    },
    required: ["questions"],
};

export const generateQuestions = async (formData: FormData): Promise<GeneratedQuestion[]> => {
  const {
    researchIdea,
    primaryRole,
    mainTask,
    exposure,
    outcome,
    population,
    timeframe,
    dataSource,
    covariates,
    preferredDesign,
    lagDays,
    objectiveTone
  } = formData;

  const prompt = `
    You are an expert research methodologist specializing in causal inference and study design.
    Your task is to generate four distinct research questions based on the provided study scaffold.
    For each question, adopt a slightly different framing or analytical perspective.
    Ensure you incorporate concepts relevant to the user's selected role, task, and preferred analytical design.

    **Study Context:**
    - **Research Idea:** ${researchIdea}
    - **Primary Role:** ${primaryRole}
    - **Main Task:** ${mainTask}
    - **Exposure:** ${exposure}
    - **Outcome:** ${outcome}
    - **Population:** ${population}
    - **Timeframe:** ${timeframe}
    - **Data Source:** ${dataSource}
    - **Covariates to consider:** ${covariates.join(', ') || 'None specified'}
    - **Preferred Analytical Design:** ${preferredDesign}
    - **Lag Days for Exposure-Outcome:** ${lagDays}
    - **Tone:** ${objectiveTone ? 'Objective and formal' : 'Inquisitive and exploratory'}

    **Instructions:**
    1. Generate exactly four research questions.
    2. Variant 1 (Primary Question): A direct primary research question based on the inputs.
    3. Variant 2 (Sensitivity Analysis): A question framed as a sensitivity analysis (e.g., "How sensitive are the results to the definition of a key variable or the choice of lag days?").
    4. Variant 3 (Confounding/Bias): A question that considers potential confounding or bias, relevant to the chosen design (e.g., "To what extent does unmeasured confounding by a plausible factor affect the estimated relationship?").
    5. Variant 4 (Effect Modification): A question focused on effect modification or heterogeneity (e.g., "Does the association differ across subgroups defined by a demographic or clinical factor?").

    Return the output as a JSON object adhering to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions as GeneratedQuestion[];
    } else {
        throw new Error("Invalid response format from AI. Expected a 'questions' array.");
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions. Please check your inputs or API key.");
  }
};