(() => {
  if (window.DamsoleChatbotWidgetLoaded) {
    return;
  }
  window.DamsoleChatbotWidgetLoaded = true;

  const defaultConfig = {
    endpoint: '/chat',
    autoStartPayload: '__damsole_auto_start__',
    initialMessage: 'Hello! How can I help you today?',
    credentials: 'same-origin'
  };

  const mergeConfig = () => {
    const userConfig = window.DamsoleChatbotConfig || {};
    return { ...defaultConfig, ...userConfig };
  };

  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  class DamsoleChatbotWidget {
    constructor(config) {
      this.config = config;
      this.isSending = false;
      this.hasAutoStarted = false;
      this.elements = {};
    }

    mount() {
      if (!document.body) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'chatbot-widget';
      wrapper.setAttribute('aria-live', 'polite');
      wrapper.innerHTML = this.template();
      document.body.appendChild(wrapper);

      this.root = wrapper;
      this.elements.panel = wrapper.querySelector('.chatbot-panel');
      this.elements.button = wrapper.querySelector('.chatbot-floating-btn');
      this.elements.close = wrapper.querySelector('.chatbot-close-btn');
      this.elements.messages = wrapper.querySelector('.chatbot-messages');
      this.elements.textarea = wrapper.querySelector('.chatbot-textarea');
      this.elements.form = wrapper.querySelector('.chatbot-input-area');
      this.elements.sendBtn = wrapper.querySelector('.chatbot-send-btn');
      this.elements.typing = wrapper.querySelector('.chatbot-typing');

      // Don't show suggestions on initial greeting
      this.addMessage(this.config.initialMessage, 'bot', false);
      this.attachEvents();
    }

    template() {
      return `
        <div class="chatbot-panel" id="damsole-chatbot-panel" role="dialog" aria-label="Damsole AI Assistant" aria-hidden="true">
          <div class="chatbot-panel-header">
            <div>
              <p class="chatbot-panel-title">Damsole AI Assistant</p>
              <span class="chatbot-panel-status">Online</span>
            </div>
            <button class="chatbot-close-btn" type="button" aria-label="Close chat">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="chatbot-messages" role="log"></div>
          <div class="chatbot-typing chatbot-typing-hidden" aria-hidden="true">
            <span class="chatbot-typing-dot"></span>
            <span class="chatbot-typing-dot"></span>
            <span class="chatbot-typing-dot"></span>
          </div>
          <form class="chatbot-input-area" novalidate>
            <textarea class="chatbot-textarea" placeholder="Write your reply..." rows="1" aria-label="Type your message"></textarea>
            <button class="chatbot-send-btn" type="submit" aria-label="Send message">
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
        <button class="chatbot-floating-btn" type="button" aria-expanded="false" aria-controls="damsole-chatbot-panel">
          <span class="chatbot-btn-icon"><i class="fas fa-robot"></i></span>
        </button>
      `;
    }

    attachEvents() {
      const { button, close, form, textarea } = this.elements;

      button.addEventListener('click', () => this.togglePanel());
      close.addEventListener('click', () => this.togglePanel(false));

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleSend();
      });

      textarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          this.handleSend();
        }
      });

      textarea.addEventListener('input', () => this.autoResizeTextarea());

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.isPanelOpen()) {
          this.togglePanel(false);
        }
      });
    }

    isPanelOpen() {
      return this.elements.panel.classList.contains('open');
    }

    togglePanel(force) {
      const shouldOpen = typeof force === 'boolean' ? force : !this.isPanelOpen();
      this.elements.panel.classList.toggle('open', shouldOpen);
      this.elements.panel.setAttribute('aria-hidden', (!shouldOpen).toString());
      this.elements.button.setAttribute('aria-expanded', shouldOpen.toString());

      if (shouldOpen) {
        this.startConversation();
        setTimeout(() => {
          this.elements.textarea.focus();
        }, 150);
      }
    }

    startConversation() {
      if (this.hasAutoStarted) return;
      this.hasAutoStarted = true;
      this.requestReply(this.config.autoStartPayload, {
        skipUserMessage: true,
        silentFailure: false
      });
    }

    handleSend() {
      if (this.isSending) return;
      const textarea = this.elements.textarea;
      const message = textarea.value.trim();
      if (!message) return;

      textarea.value = '';
      this.autoResizeTextarea(true);
      this.requestReply(message);
    }

    autoResizeTextarea(reset = false) {
      const textarea = this.elements.textarea;
      if (reset) {
        textarea.style.height = '';
        return;
      }
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 130)}px`;
    }

    addMessage(text, sender = 'bot', showSuggestions = false) {
      if (!text) return;
      const message = document.createElement('div');
      message.className = `chatbot-message ${sender === 'user' ? 'user' : 'bot'}`;

      const avatar = document.createElement('div');
      avatar.className = 'chatbot-avatar';
      avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

      // Create content wrapper for bubble and suggestions
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'chatbot-message-content';

      const bubble = document.createElement('div');
      bubble.className = 'chatbot-bubble';
      bubble.textContent = text;

      contentWrapper.appendChild(bubble);
      
      // Add suggestions if this is a bot message with the fallback text
      if (sender === 'bot' && (showSuggestions || this.shouldShowSuggestions(text))) {
        const suggestions = this.createSuggestions();
        contentWrapper.appendChild(suggestions);
      }

      message.appendChild(avatar);
      message.appendChild(contentWrapper);
      
      this.elements.messages.appendChild(message);
      this.scrollMessagesToBottom();
    }

    shouldShowSuggestions(text, responseData = {}) {
      // Show suggestions if explicitly flagged in response
      if (responseData.showSuggestions === true) {
        return true;
      }
      // Check if the message contains the fallback text pattern
      const fallbackPattern = /I'd be happy to help! You can ask me about:/i;
      return fallbackPattern.test(text);
    }

    createSuggestions() {
      const suggestionsContainer = document.createElement('div');
      suggestionsContainer.className = 'chatbot-suggestions';
      
      const suggestions = [
        'I want to create website',
        'I want to create logo',
        'I want to create app',
        'I want marketing services',
        'Our services'
      ];

      suggestions.forEach(suggestion => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chatbot-suggestion-btn';
        btn.textContent = suggestion;
        btn.addEventListener('click', () => {
          // Remove all suggestions when one is clicked
          const allSuggestions = this.elements.messages.querySelectorAll('.chatbot-suggestions');
          allSuggestions.forEach(s => s.remove());
          // Send the suggestion as a message
          this.requestReply(suggestion);
        });
        suggestionsContainer.appendChild(btn);
      });

      return suggestionsContainer;
    }

    scrollMessagesToBottom() {
      requestAnimationFrame(() => {
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
      });
    }

    setTypingVisible(visible) {
      const typing = this.elements.typing;
      typing.classList.toggle('chatbot-typing-hidden', !visible);
      typing.setAttribute('aria-hidden', (!visible).toString());
    }

    setSendingState(state) {
      this.isSending = state;
      this.elements.sendBtn.disabled = state;
    }

    async requestReply(message, options = {}) {
      const { skipUserMessage = false, silentFailure = false } = options;

      if (!skipUserMessage) {
        this.addMessage(message, 'user');
      }

      this.setSendingState(true);
      this.setTypingVisible(true);

      try {
        const endpoint = this.config.endpoint;
        console.log('📤 Sending message to:', endpoint, 'Message:', message);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ message }),
          credentials: this.config.credentials,
          mode: 'cors'
        });

        console.log('📥 Response status:', response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Server error:', errorText);
          throw new Error(`Chatbot request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Response data:', data);
        
        const reply = data.reply || data.response || data.message;
        // If reply is empty (like for auto-start), don't add message
        // Widget already shows initial greeting
        if (reply && reply.trim()) {
          // Check if we should show suggestions for this reply
          const showSuggestions = this.shouldShowSuggestions(reply, data);
          this.addMessage(reply, 'bot', showSuggestions);
        }
      } catch (error) {
        console.error('❌ Damsole chatbot error:', error);
        console.error('Error details:', {
          message: error.message,
          endpoint: this.config.endpoint,
          stack: error.stack
        });
        
        if (!silentFailure) {
          let errorMsg = 'Sorry, I am not able to respond right now. ';
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMsg += 'Please make sure the Flask server is running on http://127.0.0.1:5000';
          } else {
            errorMsg += 'Please try again shortly.';
          }
          this.addMessage(errorMsg, 'bot');
        }
      } finally {
        this.setTypingVisible(false);
        this.setSendingState(false);
      }
    }
  }

  ready(() => {
    const config = mergeConfig();
    const widget = new DamsoleChatbotWidget(config);
    widget.mount();
    // Expose widget globally so it can be accessed from other scripts
    window.DamsoleChatbotWidgetInstance = widget;
  });
})();

