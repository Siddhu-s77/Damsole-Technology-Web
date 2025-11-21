class WebsiteManager {
  constructor() {
    this.currentLang = 'en';
    this.typingTimeout = null;
    this.isLoading = false;
    this.init();
  }

  init() {
    this.setupLoadingState();
    this.ensureSocialLinksClickable();
    this.initLinkSecurity();
    this.detectUserLanguage();
    this.initLanguageSwitcher();
    this.initTypingAnimation();
    this.initCompaniesCarousel();
    this.initRandomAvatars();
    this.initSmoothScroll();
    this.initFormHandlers();
    this.initButtonRedirects();
    this.initPerformanceMonitoring();
    this.setupIntersectionObserver();
    this.setupErrorHandling();
  }

  setupLoadingState() {
    const spinner = document.getElementById('loading-spinner');
    if (!spinner) return;

    spinner.classList.add('show');

    window.addEventListener('load', () => {
      setTimeout(() => {
        spinner.classList.remove('show');
      }, 500);
    });

    setTimeout(() => {
      spinner.classList.remove('show');
    }, 3000);
  }

  detectUserLanguage() {
    let savedLang = null;

    try {
      savedLang = localStorage.getItem('websiteLanguage');
    } catch (e) {
      console.warn('localStorage unavailable', e);
    }

    if (savedLang && typeof translations !== 'undefined' && translations[savedLang]) {
      this.currentLang = savedLang;
      this.applyTranslations();
      return;
    }

    const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();

    const languageMap = {
      'zh': 'zh',
      'zh-cn': 'zh',
      'zh-tw': 'zh',
      'zh-hk': 'zh',
      'en': 'en',
      'en-in': 'en-IN'
    };

    const fullMatch = languageMap[browserLang];
    const baseMatch = languageMap[browserLang.split('-')[0]];

    this.currentLang = fullMatch || baseMatch || 'en';
    this.applyTranslations();
  }

  applyTranslations() {
    if (typeof translations === 'undefined') {
      console.warn('translations object is not defined');
      return;
    }

    const t = translations[this.currentLang];

    if (!t) {
      console.warn(`Translations not found for language: ${this.currentLang}`);
      return;
    }

    try {
      document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (!key) return;

        const keys = key.split('.');
        let value = t;

        for (const k of keys) {
          value = value?.[k];
          if (value === undefined || value === null) break;
        }

        if (typeof value === 'string') {
          if (element.hasAttribute('placeholder')) {
            element.placeholder = value;
          } else {
            element.textContent = value;
          }
        }
      });

      this.restartTypingAnimation();
    } catch (error) {
      console.error('Translation error:', error);
    }
  }

  initLanguageSwitcher() {
    const languageBtn = document.querySelector('.language-btn');
    if (!languageBtn) return;

    languageBtn.addEventListener('click', () => {
      const languages = ['en', 'zh', 'en-IN'];
      const currentIndex = languages.indexOf(this.currentLang);
      const nextIndex = (currentIndex + 1) % languages.length;
      this.currentLang = languages[nextIndex];

      try {
        localStorage.setItem('websiteLanguage', this.currentLang);
      } catch (e) {
        console.warn('localStorage unavailable', e);
      }

      this.applyTranslations();
    });
  }

  initTypingAnimation() {
    this.restartTypingAnimation();
  }

  restartTypingAnimation() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    const typedSpan = document.querySelector('.typed-inline');
    if (!typedSpan) return;

    const phrases = this.getTypingPhrases();
    if (!phrases || !phrases.length) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting && charIndex < currentPhrase.length) {
        typedSpan.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        this.typingTimeout = setTimeout(type, 80);
      } else if (isDeleting && charIndex > 0) {
        typedSpan.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        this.typingTimeout = setTimeout(type, 40);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        this.typingTimeout = setTimeout(type, isDeleting ? 1200 : 500);
      }
    };

    this.typingTimeout = setTimeout(type, 500);
  }

  getTypingPhrases() {
    const phrasesMap = {
      en: ['Web Development', 'UI/UX Design', 'Digital Marketing'],
      zh: ['网页开发', 'UI/UX设计', '数字营销'],
      'en-IN': ['Web Development', 'UI/UX Design', 'Digital Marketing']
    };
    return phrasesMap[this.currentLang] || phrasesMap.en;
  }

  initCompaniesCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    if (!carouselTrack) return;

    carouselTrack.innerHTML = '';

    const companies = [
      'company-1.png', 'company-2.png', 'company-3.png',
      'company-4.png', 'company-5.png', 'company-6.png',
      'company-7.png', 'company-8.png', 'company-9.png'
    ];

    companies.forEach(logo => {
      const img = document.createElement('img');
      img.className = 'carousel-logo';
      img.src = `assets/images/${logo}`;
      img.alt = 'Company logo';
      img.loading = 'lazy';
      img.width = 120;
      img.height = 60;
      carouselTrack.appendChild(img);
    });

    const originalLogos = Array.from(carouselTrack.children);
    originalLogos.forEach(node => {
      carouselTrack.appendChild(node.cloneNode(true));
    });
  }

  initRandomAvatars() {
    const avatarIds = ['avatar1', 'avatar2', 'avatar3', 'avatar4'];
    const usedIds = new Set();

    avatarIds.forEach(avatarId => {
      const avatarElement = document.getElementById(avatarId);
      if (avatarElement) {
        const randomId = this.getUniqueRandomId(usedIds);
        this.setAvatarSource(avatarElement, randomId);
      }
    });
  }

  getUniqueRandomId(usedIds, max = 70) {
    let randomId;
    let safety = 0;

    do {
      randomId = Math.floor(Math.random() * max) + 1;
      safety++;
      if (safety > max + 5) break;
    } while (usedIds.has(randomId) && usedIds.size < max);

    usedIds.add(randomId);
    return randomId;
  }

  setAvatarSource(element, id) {
    const sources = [
      `https://i.pravatar.cc/150?img=${id}`,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      `https://ui-avatars.com/api/?name=User${id}&background=random&size=150`
    ];

    let currentSource = 0;

    const tryNextSource = () => {
      if (currentSource < sources.length) {
        element.src = sources[currentSource];
        currentSource++;
      } else {
        element.style.display = 'none';
      }
    };

    element.onerror = tryNextSource;
    element.src = sources[0];
  }

  initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('.site-header');

    const getHeaderHeight = () => (header ? header.offsetHeight : 80);

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || !href.startsWith('#')) return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const headerHeight = getHeaderHeight();
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });

        this.closeMobileMenu();
      });
    });
  }

  closeMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse.show');
    if (!navbarCollapse || !window.bootstrap || !window.bootstrap.Collapse) return;

    const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse);
    if (bsCollapse) {
      bsCollapse.hide();
    }
  }

  initFormHandlers() {
    const heroForm = document.querySelector('.hero-cta form');
    if (heroForm) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = heroForm.querySelector('.email-input');
        if (!emailInput) return;

        const email = emailInput.value.trim();
        if (this.validateEmail(email)) {
          this.handleFormSubmission('hero-trial', { email });
          heroForm.reset();
        } else {
          this.showNotification('error', 'Invalid Email', 'Please enter a valid email.');
        }
      });
    }

    const footerForm = document.querySelector('.footer-subscribe');
    if (footerForm) {
      footerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = footerForm.querySelector('.footer-email-input');
        if (!emailInput) return;

        const email = emailInput.value.trim();
        if (this.validateEmail(email)) {
          this.handleFormSubmission('newsletter', { email });
          footerForm.reset();
        } else {
          this.showNotification('error', 'Invalid Email', 'Please enter a valid email.');
        }
      });
    }
  }

  initButtonRedirects() {
    // Handle "Start trial!" button click
    const startTrialButton = document.querySelector('.cta-button');
    if (startTrialButton) {
      startTrialButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'ContactUs.html';
      });
    }

    // Handle Subscribe button click in footer
    const subscribeButton = document.querySelector('.footer-subscribe-btn, .Subscribe-btn');
    if (subscribeButton) {
      subscribeButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Check if email is valid before redirecting
        const emailInput = document.querySelector('.footer-email-input');
        if (emailInput && emailInput.value.trim()) {
          const email = emailInput.value.trim();
          if (this.validateEmail(email)) {
            window.location.href = 'ContactUs.html';
          } else {
            this.showNotification('error', 'Invalid Email', 'Please enter a valid email.');
          }
        } else {
          // Redirect even if email is empty (optional validation)
          window.location.href = 'ContactUs.html';
        }
      });
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  handleFormSubmission(formType, data) {
    console.log(`Form submitted: ${formType}`, data);
    this.showNotification('success', 'Thank you!', 'We will be in touch soon.');
  }

  showNotification(type, title, message) {
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    // yaha baad me tum custom toast / popup UI add kar sakta hai
  }

  initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.log(`${entry.entryType} - ${entry.name}:`, entry.value ?? entry.duration);
          });
        });

        observer.observe({
          entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']
        });
      } catch (e) {
        console.warn('PerformanceObserver not fully supported', e);
      }
    }

    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      resources.forEach(resource => {
        console.log(`${resource.name} loaded in ${resource.duration}ms`);
      });
    });
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document
      .querySelectorAll('.service-card, .review-card, .project-card')
      .forEach(el => observer.observe(el));
  }

  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error || e.message || e);
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
    });

    document.addEventListener('error', (e) => {
      const target = e.target;
      if (target && target.tagName === 'IMG') {
        console.warn('Image failed to load:', target.src);
        target.style.display = 'none';
      }
    }, true);
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  ensureSocialLinksClickable() {
    // Ensure all social media links are clickable
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
      // Remove any event listeners that might prevent default
      link.style.pointerEvents = 'auto';
      link.style.cursor = 'pointer';
      link.style.zIndex = '1000';
      
      // Ensure the link works
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('#')) {
          // Allow the default behavior for external links
          // Don't prevent default
          console.log('Social link clicked:', href);
        }
      }, { passive: true });
    });
  }

  initLinkSecurity() {
    // List of trusted domains (whitelist)
    const trustedDomains = [
      'damsole.com',
      'damsoletechnologies.com',
      'damsole-technology-website.onrender.com',
      'render.com',
      'onrender.com',
      'facebook.com',
      'instagram.com',
      'twitter.com',
      'x.com',
      'linkedin.com',
      'youtube.com',
      'github.com',
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com',
      'cdn.tailwindcss.com',
      'bootstrap.com',
      'fontawesome.com',
      'google.com',
      'googleapis.com',
      'gstatic.com'
    ];

    // Suspicious patterns to block (URL shorteners and known phishing domains)
    const suspiciousPatterns = [
      /bit\.ly/i,
      /tinyurl\.com/i,
      /t\.co/i,
      /goo\.gl/i,
      /ow\.ly/i,
      /is\.gd/i,
      /v\.gd/i,
      /short\.link/i,
      /cutt\.ly/i,
      /rebrand\.ly/i,
      /shorte\.st/i,
      /adf\.ly/i,
      /ad\.fly/i,
      /bc\.vc/i,
      /ouo\.io/i,
      /linkbucks\.com/i,
      /adfoc\.us/i,
      /sh\.st/i,
      /adfocus\.me/i
    ];

    // Function to extract domain from URL
    const extractDomain = (url) => {
      try {
        if (!url || url === '#' || url.startsWith('#')) return null;
        if (url.startsWith('mailto:') || url.startsWith('tel:')) return null;
        const urlObj = new URL(url, window.location.origin);
        return urlObj.hostname.replace('www.', '');
      } catch (e) {
        return null;
      }
    };

    // Function to check if domain is trusted
    const isTrustedDomain = (domain) => {
      if (!domain) return true; // Allow relative links and mailto/tel
      
      // Always trust the current domain (same origin)
      const currentDomain = window.location.hostname.replace('www.', '');
      if (domain === currentDomain || domain.endsWith('.' + currentDomain)) {
        return true;
      }
      
      return trustedDomains.some(trusted => 
        domain === trusted || domain.endsWith('.' + trusted)
      );
    };

    // Function to check for suspicious patterns
    const isSuspicious = (url) => {
      if (!url) return false;
      return suspiciousPatterns.some(pattern => pattern.test(url));
    };

    // Function to validate and secure a link
    const secureLink = (link) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return; // Allow internal links, mailto, and tel links
      }

      const domain = extractDomain(href);
      
      // Check for suspicious patterns
      if (isSuspicious(href)) {
        link.setAttribute('data-original-href', href);
        link.removeAttribute('href');
        link.style.cursor = 'not-allowed';
        link.style.opacity = '0.5';
        link.title = '⚠️ This link has been blocked for security reasons';
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          alert('⚠️ This link has been blocked for security reasons. Suspicious URL detected.');
          return false;
        }, true);
        console.warn('🚫 Blocked suspicious link:', href);
        return;
      }

      // Check if domain is trusted
      if (domain && !isTrustedDomain(domain)) {
        // Add warning for untrusted external links
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.addEventListener('click', (e) => {
          const confirmed = confirm(
            `⚠️ Security Warning\n\n` +
            `You are about to visit: ${domain}\n\n` +
            `This is an external website. Make sure you trust this link before proceeding.\n\n` +
            `Do you want to continue?`
          );
          if (!confirmed) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        });
        console.warn('⚠️ Untrusted external link detected:', href);
      }
    };

    // Secure all links on page load
    const allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(secureLink);

    // Secure dynamically added links (MutationObserver)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'A' && node.hasAttribute('href')) {
              secureLink(node);
            }
            // Also check for links inside added nodes
            const links = node.querySelectorAll?.('a[href]');
            if (links) {
              links.forEach(secureLink);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new WebsiteManager();
});
