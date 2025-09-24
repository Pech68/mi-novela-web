document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById('open-chatbot-btn');
  const closeBtn = document.getElementById('close-chatbot-btn');
  const sendBtn = document.getElementById('send-chatbot-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const messagesContainer = document.getElementById('chatbot-messages');
  const input = document.getElementById('chatbot-input');

  // Obtener el slug de la novela de la URL actual.
  // Esto asume que la URL es como /novelas/nombre-de-la-novela/
  const pathParts = window.location.pathname.split('/');
  const novelSlug = pathParts[2]; // El slug de la novela es la tercera parte de la ruta

  openBtn.addEventListener('click', () => {
    chatWindow.classList.remove('hidden');
    openBtn.classList.add('hidden');
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
    openBtn.classList.remove('hidden');
  });

  const sendMessage = async () => {
    const question = input.value.trim();
    if (question === '') return;

    // Muestra la pregunta del usuario
    addMessage(question, 'user');
    input.value = '';
    addMessage('Pensando...', 'bot', true); // Muestra "Pensando..."

    try {
      // Llama a nuestra función de IA
      const response = await fetch('/.netlify/functions/lore-chatbot', {
        method: 'POST',
        body: JSON.stringify({
          question: question,
          novel_slug: novelSlug
        })
      });

      // Reemplaza "Pensando..." con la respuesta real
      const thinkingMessage = document.getElementById('thinking-message');
      messagesContainer.removeChild(thinkingMessage);

      if (!response.ok) {
        addMessage('Lo siento, hubo un error al conectar con el experto.', 'bot');
        return;
      }

      const data = await response.json();
      addMessage(data.answer, 'bot');

    } catch (error) {
      const thinkingMessage = document.getElementById('thinking-message');
      if (thinkingMessage) messagesContainer.removeChild(thinkingMessage);
      addMessage('Lo siento, no pude contactar al experto. Revisa tu conexión.', 'bot');
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  function addMessage(text, sender, isThinking = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    if (isThinking) {
      messageDiv.id = 'thinking-message';
    }
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
