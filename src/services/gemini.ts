import { GoogleGenAI } from "@google/genai";

export async function generateGeminiArticle(
  topic: string, 
  tone: string, 
  length: string, 
  language: string, 
  apiKey: string
) {
  const key = apiKey || process.env.GEMINI_API_KEY || '';
  if (!key) throw new Error('API Key no configurada');
  
  const ai = new GoogleGenAI({ apiKey: key });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: 'user', parts: [{ text: `Actúa como un experto redactor de blogs para Blogger. Genera un artículo completo, atractivo y de alta calidad.
    Tema: "${topic}"
    Idioma: ${language}
    Tono: ${tone}
    Extensión: ${length}
    Formato: Genera ÚNICAMENTE código HTML semántico limpio (h1 para título, h2/h3 para subtítulos, p para párrafos, strong para énfasis, ul/li para listas). NO incluyas bloques de código markdown (\`\`\`html). El resultado debe estar listo para usarse directamente en el editor HTML de Blogger.` }]}]
  });

  return response.text?.replace(/```html|```/g, '').trim() || '';
}

export async function runGeminiAssistant(
  type: 'fix' | 'extend', 
  content: string, 
  language: string, 
  apiKey: string
) {
  const key = apiKey || process.env.GEMINI_API_KEY || '';
  if (!key) throw new Error('API Key no configurada');

  const ai = new GoogleGenAI({ apiKey: key });
  const prompt = type === 'fix' 
    ? `Corrige la ortografía, gramática y mejora sustancialmente el estilo de redacción del siguiente contenido HTML en idioma ${language}, manteniendo todas las etiquetas HTML intactas: ` 
    : `Añade una sección adicional (un párrafo interesante o una lista útil) que complemente el siguiente contenido HTML en idioma ${language}, siguiendo el mismo estilo y tono: `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: 'user', parts: [{ text: prompt + content }]}]
  });
  
  return response.text?.replace(/```html|```/g, '').trim() || '';
}
