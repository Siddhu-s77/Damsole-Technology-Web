(() => {
  // Chatbot endpoint - uses relative path since frontend and backend are on same server
  // If running separately, change to: 'http://127.0.0.1:5000/chat'
  const DEFAULT_ENDPOINT = '/chat';

  // Load existing config if any
  const existingConfig = window.DamsoleChatbotConfig || {};

  // Set global config for chatbot widget
  window.DamsoleChatbotConfig = {
    endpoint: existingConfig.endpoint || DEFAULT_ENDPOINT,
    credentials: existingConfig.credentials || 'same-origin',
    autoStartPayload: '__damsole_auto_start__'
  };

  console.log('🤖 Chatbot config loaded:', window.DamsoleChatbotConfig);
})();

