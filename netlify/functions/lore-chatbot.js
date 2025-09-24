const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch');

// Inicializa el cliente de Google AI con tu API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async function(event, context) {
  // Solo permite peticiones POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { question, novel_slug } = JSON.parse(event.body);
    const siteUrl = process.env.URL; // URL base de tu sitio desde Netlify

    // 1. Obtiene el "libro de consulta" de la novela
    const knowledgeResponse = await fetch(`${siteUrl}/lore/${novel_slug}.json`);
    if (!knowledgeResponse.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: "No se pudo encontrar el libro de consulta para esta novela." }) };
    }
    const knowledgeBase = await knowledgeResponse.json();
    const novelContent = knowledgeBase.content.join("\n\n---\n\n");

    // 2. Prepara el prompt para la IA
    // ===== LÍNEA CORREGIDA AQUÍ =====
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Eres un experto en el universo de la novela "${knowledgeBase.title}" escrita por ${knowledgeBase.author}. Usando SOLAMENTE el siguiente contexto, responde la pregunta del usuario de forma amable y concisa. Si la respuesta no está en el contexto, di amablemente que no tienes esa información.

    CONTEXTO DE LA NOVELA:
    ${novelContent}

    PREGUNTA DEL USUARIO:
    ${question}

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
