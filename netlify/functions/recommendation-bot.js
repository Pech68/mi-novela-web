const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch');

// Inicializa el cliente de Google AI con tu API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { question } = JSON.parse(event.body);
    const siteUrl = process.env.URL;

    // 1. Obtiene el "catálogo" completo de novelas del sitio
    const catalogResponse = await fetch(`${siteUrl}/novels.json`);
    if (!catalogResponse.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: "No se pudo cargar el catálogo de novelas." }) };
    }
    const catalog = await catalogResponse.json();
    const catalogAsString = JSON.stringify(catalog, null, 2);

    // 2. Prepara el prompt para la IA
    // ===== LÍNEA CORREGIDA AQUÍ =====
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const prompt = `Eres "El Bibliotecario", un asistente de IA para el sitio de novelas PechsNovel. Tu misión es ayudar a los lectores a descubrir historias y responder preguntas sobre el contenido del sitio.

    BASA TUS RESPUESTAS ÚNICA Y EXCLUSIVAMENTE EN EL SIGUIENTE CATÁLOGO DE NOVELAS:
    ${catalogAsString}

    Puedes hacer dos cosas:
    1.  Si el usuario describe un tipo de trama, tema o personaje, recomienda la novela del catálogo que mejor se ajuste y explica brevemente por qué.
    2.  Si el usuario hace una pregunta analítica sobre el contenido (ej: "¿Qué novela tiene más capítulos?"), analiza el catálogo para encontrar la respuesta.

    Sé amable, directo y servicial. Si no puedes responder con la información del catálogo, di que no tienes esa información.

    PREGUNTA DEL LECTOR:
    "${question}"

    RESPUESTA DEL BIBLIOTECARIO:`;

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
    console.error("Error en la función del recomendador:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hubo un error al procesar tu pregunta." }),
    };
  }
};
