const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { question, novel_slug } = JSON.parse(event.body);
    const siteUrl = process.env.URL;

    // 1. Obtiene la base de conocimiento ESTRUCTURADA de la novela
    const knowledgeResponse = await fetch(`${siteUrl}/lore/${novel_slug}.json`);
    if (!knowledgeResponse.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: "No se pudo encontrar el libro de consulta para esta novela." }) };
    }
    const knowledgeBase = await knowledgeResponse.json();
    const knowledgeAsString = JSON.stringify(knowledgeBase.chapters, null, 2);

    // 2. Prepara el NUEVO Y MÁS PODEROSO prompt para la IA
    // ===== LÍNEA CORREGIDA AQUÍ =====
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const prompt = `Eres un asistente de IA experto y conversacional para el sitio de novelas PechsNovel. Estás especializado en la novela "${knowledgeBase.title}" de ${knowledgeBase.author}.

    HAS RECIBIDO EL CONTENIDO COMPLETO DE LA NOVELA, ESTRUCTURADO POR CAPÍTULOS, A CONTINUACIÓN:
    ${knowledgeAsString}

    Tus tareas son:
    1.  **Responder preguntas** sobre la trama, personajes y el universo basándote en el contenido.
    2.  Si un usuario te pide un **resumen de un capítulo específico** (ej: "resume el capítulo 2"), busca ese capítulo en el contenido y crea un resumen detallado.
    3.  Si un usuario te hace una pregunta general, responde basándote en la información que tienes.

    Sé amable y servicial. Basa tus respuestas ÚNICAMENTE en la información proporcionada.

    PREGUNTA DEL LECTOR:
    "${question}"

    RESPUESTA:`;

    // 3. Llama a la IA y obtiene la respuesta
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 4. Envía la respuesta de vuelta al usuario
    return {
      statusCode: 200,
      body: JSON.stringify({ answer: text }),
    };

  } catch (error) {
    console.error("Error en la función del chatbot:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hubo un error al procesar tu pregunta." }),
    };
  }
};
