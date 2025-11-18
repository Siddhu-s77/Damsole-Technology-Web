    document.addEventListener('DOMContentLoaded', function() {
      // ================== Language Detection & Translation ==================
      let currentLang = 'en';
      
      // Detect user's country and set language - Works for ALL countries
      function detectUserLanguage() {
        // Check if language is stored in localStorage (user preference)
        const savedLang = localStorage.getItem('websiteLanguage');
        if (savedLang && translations[savedLang]) {
          currentLang = savedLang;
          applyTranslations();
          return;
        }

        // Primary method: Use browser language (works for all countries)
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        
        // Map browser languages to our supported languages
        // Chinese languages
        if (browserLang.startsWith('zh')) {
          currentLang = 'zh';
        }
        // Indian English or English variants
        else if (browserLang.startsWith('en-IN') || browserLang === 'en-IN') {
          currentLang = 'en-IN';
        }
        // All other English variants (US, UK, AU, CA, etc.)
        else if (browserLang.startsWith('en')) {
          currentLang = 'en';
        }
        // For any other language, default to English but try to detect
        else {
          // Try geolocation as secondary method for better accuracy
          try {
            fetch('https://ipapi.co/json/')
              .then(response => response.json())
              .then(data => {
                const countryCode = data.country_code;
                // Map countries to languages
                const countryLanguageMap = {
                  'CN': 'zh',      // China
                  'TW': 'zh',      // Taiwan
                  'HK': 'zh',      // Hong Kong
                  'MO': 'zh',      // Macau
                  'SG': 'en',      // Singapore
                  'IN': 'en-IN',   // India
                  'US': 'en',      // United States
                  'GB': 'en',      // United Kingdom
                  'AU': 'en',      // Australia
                  'CA': 'en',      // Canada
                  'NZ': 'en',      // New Zealand
                  'IE': 'en',      // Ireland
                  'ZA': 'en',      // South Africa
                  'PH': 'en',      // Philippines
                  'MY': 'en',      // Malaysia
                  'PK': 'en',      // Pakistan
                  'BD': 'en',      // Bangladesh
                  'NG': 'en',      // Nigeria
                  'KE': 'en',      // Kenya
                  'GH': 'en',      // Ghana
                  'TZ': 'en',      // Tanzania
                  'UG': 'en',      // Uganda
                  'ZW': 'en',      // Zimbabwe
                  'ZM': 'en'       // Zambia
                };
                
                // If country is in our map, use mapped language
                if (countryLanguageMap[countryCode]) {
                  currentLang = countryLanguageMap[countryCode];
                }
                // For Chinese-speaking countries, use Chinese
                else if (['CN', 'TW', 'HK', 'MO'].includes(countryCode)) {
                  currentLang = 'zh';
                }
                // For Indian subcontinent, use Indian English
                else if (['IN', 'PK', 'BD', 'LK', 'NP'].includes(countryCode)) {
                  currentLang = 'en-IN';
                }
                // Default to English for all other countries
                else {
                  currentLang = 'en';
                }
                applyTranslations();
              })
              .catch(() => {
                // If API fails, use browser language detection result
                applyTranslations();
              });
          } catch (error) {
            // If everything fails, use browser language detection result
            applyTranslations();
          }
          return; // Exit early, translation will be applied in the fetch callback
        }
        
        // Apply translations immediately if we determined language from browser
        applyTranslations();
      }

      // Apply translations to the page
      function applyTranslations() {
        if (!translations[currentLang]) return;
        
        const t = translations[currentLang];
        
        // Update navigation
        document.querySelectorAll('[data-translate="nav.home"]').forEach(el => el.textContent = t.nav.home);
        document.querySelectorAll('[data-translate="nav.about"]').forEach(el => el.textContent = t.nav.about);
        document.querySelectorAll('[data-translate="nav.service"]').forEach(el => el.textContent = t.nav.service);
        document.querySelectorAll('[data-translate="nav.portfolio"]').forEach(el => el.textContent = t.nav.portfolio);
        document.querySelectorAll('[data-translate="nav.contact"]').forEach(el => el.textContent = t.nav.contact);
        
        // Update hero section
        document.querySelectorAll('[data-translate="hero.badge"]').forEach(el => el.textContent = t.hero.badge);
        document.querySelectorAll('[data-translate="hero.title"]').forEach(el => el.textContent = t.hero.title);
        document.querySelectorAll('[data-translate="hero.subtitle"]').forEach(el => el.textContent = t.hero.subtitle);
        document.querySelectorAll('[data-translate="hero.emailPlaceholder"]').forEach(el => el.placeholder = t.hero.emailPlaceholder);
        document.querySelectorAll('[data-translate="hero.startTrial"]').forEach(el => el.textContent = t.hero.startTrial);
        document.querySelectorAll('[data-translate="hero.support24"]').forEach(el => el.textContent = t.hero.support24);
        document.querySelectorAll('[data-translate="hero.supportDesc"]').forEach(el => el.textContent = t.hero.supportDesc);
        document.querySelectorAll('[data-translate="hero.awardAgency"]').forEach(el => el.textContent = t.hero.awardAgency);
        document.querySelectorAll('[data-translate="hero.awardDesc"]').forEach(el => el.textContent = t.hero.awardDesc);
        document.querySelectorAll('[data-translate="hero.reviews"]').forEach(el => el.textContent = t.hero.reviews);
        document.querySelectorAll('[data-translate="hero.visitors"]').forEach(el => el.textContent = t.hero.visitors);
        
        // Update companies section
        document.querySelectorAll('[data-translate="companies.title"]').forEach(el => el.textContent = t.companies.title);
        document.querySelectorAll('[data-translate="companies.subtitle"]').forEach(el => el.textContent = t.companies.subtitle);
        
        // Update about section
        document.querySelectorAll('[data-translate="about.badge"]').forEach(el => el.textContent = t.about.badge);
        document.querySelectorAll('[data-translate="about.title"]').forEach(el => el.textContent = t.about.title);
        document.querySelectorAll('[data-translate="about.description"]').forEach(el => el.textContent = t.about.description);
        document.querySelectorAll('[data-translate="about.feature1"]').forEach(el => el.textContent = t.about.feature1);
        document.querySelectorAll('[data-translate="about.feature2"]').forEach(el => el.textContent = t.about.feature2);
        document.querySelectorAll('[data-translate="about.feature3"]').forEach(el => el.textContent = t.about.feature3);
        document.querySelectorAll('[data-translate="about.discoverMore"]').forEach(el => el.textContent = t.about.discoverMore);
        
        // Update services section
        document.querySelectorAll('[data-translate="services.badge"]').forEach(el => el.textContent = t.services.badge);
        document.querySelectorAll('[data-translate="services.title"]').forEach(el => el.textContent = t.services.title);
        document.querySelectorAll('[data-translate="services.digitalMarketing"]').forEach(el => el.textContent = t.services.digitalMarketing);
        document.querySelectorAll('[data-translate="services.digitalMarketingDesc"]').forEach(el => el.textContent = t.services.digitalMarketingDesc);
        document.querySelectorAll('[data-translate="services.productDesign"]').forEach(el => el.textContent = t.services.productDesign);
        document.querySelectorAll('[data-translate="services.productDesignDesc"]').forEach(el => el.textContent = t.services.productDesignDesc);
        document.querySelectorAll('[data-translate="services.webDesign"]').forEach(el => el.textContent = t.services.webDesign);
        document.querySelectorAll('[data-translate="services.webDesignDesc"]').forEach(el => el.textContent = t.services.webDesignDesc);
        document.querySelectorAll('[data-translate="services.softwareDev"]').forEach(el => el.textContent = t.services.softwareDev);
        document.querySelectorAll('[data-translate="services.softwareDevDesc"]').forEach(el => el.textContent = t.services.softwareDevDesc);
        document.querySelectorAll('[data-translate="services.businessStrategy"]').forEach(el => el.textContent = t.services.businessStrategy);
        document.querySelectorAll('[data-translate="services.businessStrategyDesc"]').forEach(el => el.textContent = t.services.businessStrategyDesc);
        document.querySelectorAll('[data-translate="services.research"]').forEach(el => el.textContent = t.services.research);
        document.querySelectorAll('[data-translate="services.researchDesc"]').forEach(el => el.textContent = t.services.researchDesc);
        document.querySelectorAll('[data-translate="services.chatbot"]').forEach(el => el.textContent = t.services.chatbot);
        document.querySelectorAll('[data-translate="services.chatbotDesc"]').forEach(el => el.textContent = t.services.chatbotDesc);
        document.querySelectorAll('[data-translate="services.brandLogo"]').forEach(el => el.textContent = t.services.brandLogo);
        document.querySelectorAll('[data-translate="services.brandLogoDesc"]').forEach(el => el.textContent = t.services.brandLogoDesc);
        document.querySelectorAll('[data-translate="services.knowMore"]').forEach(el => el.textContent = t.services.knowMore);
        
        // Update pricing section
        document.querySelectorAll('[data-translate="pricing.badge"]').forEach(el => el.textContent = t.pricing.badge);
        document.querySelectorAll('[data-translate="pricing.title"]').forEach(el => el.textContent = t.pricing.title);
        document.querySelectorAll('[data-translate="pricing.description"]').forEach(el => el.textContent = t.pricing.description);
        document.querySelectorAll('[data-translate="pricing.featuresTitle"]').forEach(el => el.textContent = t.pricing.featuresTitle);
        document.querySelectorAll('[data-translate="pricing.feature1"]').forEach(el => el.textContent = t.pricing.feature1);
        document.querySelectorAll('[data-translate="pricing.feature2"]').forEach(el => el.textContent = t.pricing.feature2);
        document.querySelectorAll('[data-translate="pricing.feature3"]').forEach(el => el.textContent = t.pricing.feature3);
        document.querySelectorAll('[data-translate="pricing.feature4"]').forEach(el => el.textContent = t.pricing.feature4);
        document.querySelectorAll('[data-translate="pricing.feature5"]').forEach(el => el.textContent = t.pricing.feature5);
        document.querySelectorAll('[data-translate="pricing.feature6"]').forEach(el => el.textContent = t.pricing.feature6);
        document.querySelectorAll('[data-translate="pricing.planTitle"]').forEach(el => el.textContent = t.pricing.planTitle);
        document.querySelectorAll('[data-translate="pricing.planNote"]').forEach(el => el.textContent = t.pricing.planNote);
        document.querySelectorAll('[data-translate="pricing.contactSales"]').forEach(el => el.textContent = t.pricing.contactSales);
        
        // Update reviews section
        document.querySelectorAll('[data-translate="reviews.badge"]').forEach(el => el.textContent = t.reviews.badge);
        document.querySelectorAll('[data-translate="reviews.title"]').forEach(el => el.textContent = t.reviews.title);
        document.querySelectorAll('[data-translate="reviews.subtitle"]').forEach(el => el.textContent = t.reviews.subtitle);
        
        // Update footer
        document.querySelectorAll('[data-translate="footer.title"]').forEach(el => el.innerHTML = t.footer.title.replace(/\n/g, '<br>'));
        document.querySelectorAll('[data-translate="footer.emailPlaceholder"]').forEach(el => el.placeholder = t.footer.emailPlaceholder);
        document.querySelectorAll('[data-translate="footer.subscribe"]').forEach(el => el.textContent = t.footer.subscribe);
        document.querySelectorAll('[data-translate="footer.callOn"]').forEach(el => el.textContent = t.footer.callOn);
        document.querySelectorAll('[data-translate="footer.time"]').forEach(el => el.textContent = t.footer.time);
        document.querySelectorAll('[data-translate="footer.email"]').forEach(el => el.textContent = t.footer.email);
        document.querySelectorAll('[data-translate="footer.sundayClose"]').forEach(el => el.textContent = t.footer.sundayClose);
        document.querySelectorAll('[data-translate="footer.quickLinks"]').forEach(el => el.textContent = t.footer.quickLinks);
        document.querySelectorAll('[data-translate="footer.aboutUs"]').forEach(el => el.textContent = t.footer.aboutUs);
        document.querySelectorAll('[data-translate="footer.contactUs"]').forEach(el => el.textContent = t.footer.contactUs);
        document.querySelectorAll('[data-translate="footer.community"]').forEach(el => el.textContent = t.footer.community);
        document.querySelectorAll('[data-translate="footer.privacyPolicy"]').forEach(el => el.textContent = t.footer.privacyPolicy);
        document.querySelectorAll('[data-translate="footer.termsOfService"]').forEach(el => el.textContent = t.footer.termsOfService);
        document.querySelectorAll('[data-translate="footer.supports"]').forEach(el => el.textContent = t.footer.supports);
        document.querySelectorAll('[data-translate="footer.followOn"]').forEach(el => el.textContent = t.footer.followOn);
        document.querySelectorAll('[data-translate="footer.copyright"]').forEach(el => el.textContent = t.footer.copyright);
        document.querySelectorAll('[data-translate="footer.language"]').forEach(el => el.textContent = t.footer.language);
        
        // Update common
        document.querySelectorAll('[data-translate="common.letsTalk"]').forEach(el => el.textContent = t.common.letsTalk);
        
        // Restart typing animation with new language words
        startTypingAnimation();
      }

      // Update typing animation phrases (one by one)
      function getTypingPhrases() {
        const phrasesMap = {
          'en': ['Web Dev', 'UI/UX Design', 'Digital Marketing'],
          'zh': ['网页开发', 'UI/UX设计', '数字营销'],
          'en-IN': ['Web Dev', 'UI/UX Design', 'Digital Marketing']
        };
        return phrasesMap[currentLang] || phrasesMap['en'];
      }

      // Typing animation variables
      let typingTimeout = null;
      let typingPhraseIndex = 0;
      let typingCharIndex = 0;

      // Start typing animation
      function startTypingAnimation() {
        const typedSpan = document.querySelector('.typed-inline');
        const caretSpan = document.querySelector('.typed-caret');
        
        if (!typedSpan) {
          console.error('Typed span element not found!');
          return false;
        }
        
        // Make sure element is visible
        typedSpan.style.display = 'inline-block';
        typedSpan.style.visibility = 'visible';
        typedSpan.style.opacity = '1';
        typedSpan.style.color = 'var(--accent)'; // Blue color
        
        // Clear any existing animation
        if (typingTimeout) {
          clearTimeout(typingTimeout);
          typingTimeout = null;
        }
        
        // Reset animation state
        typedSpan.textContent = '';
        typingPhraseIndex = 0;
        typingCharIndex = 0;
        
        const phrases = getTypingPhrases();
        if (!phrases || phrases.length === 0) {
          console.error('No typing phrases found!');
          return false;
        }
        
        const typingDelay = 80; // Speed of typing (milliseconds per character)
        const erasingDelay = 50; // Speed of erasing
        const pauseAfterPhrase = 1500; // Pause after typing each phrase
        const pauseBeforeRestart = 2000; // Pause before restarting cycle

        function typePhrase() {
          const currentPhrase = phrases[typingPhraseIndex];
          
          if (typingCharIndex < currentPhrase.length) {
            // Type current character
            typedSpan.textContent += currentPhrase.charAt(typingCharIndex);
            typingCharIndex++;
            typingTimeout = setTimeout(typePhrase, typingDelay);
          } else {
            // Finished typing current phrase, pause then erase
            typingTimeout = setTimeout(erasePhrase, pauseAfterPhrase);
          }
        }

        function erasePhrase() {
          if (typingCharIndex > 0) {
            // Erase one character
            typedSpan.textContent = typedSpan.textContent.substring(0, typingCharIndex - 1);
            typingCharIndex--;
            typingTimeout = setTimeout(erasePhrase, erasingDelay);
          } else {
            // Finished erasing, move to next phrase
            typingPhraseIndex++;
            
            if (typingPhraseIndex < phrases.length) {
              // Start typing next phrase
              typingTimeout = setTimeout(typePhrase, 500);
            } else {
              // All phrases done, restart cycle
              typingTimeout = setTimeout(function() {
                typedSpan.textContent = '';
                typingPhraseIndex = 0;
                typingCharIndex = 0;
                typingTimeout = setTimeout(typePhrase, 800);
              }, pauseBeforeRestart);
            }
          }
        }

        // Start animation after a short delay
        typingTimeout = setTimeout(typePhrase, 800);
        return true;
      }

      // Language switcher - Works for all countries
      function initLanguageSwitcher() {
        const languageBtn = document.querySelector('.language-btn');
        if (languageBtn) {
          languageBtn.addEventListener('click', function() {
            // Cycle through all available languages
            const languages = ['en', 'zh', 'en-IN'];
            const currentIndex = languages.indexOf(currentLang);
            const nextIndex = (currentIndex + 1) % languages.length;
            currentLang = languages[nextIndex];
            
            // Save to localStorage (works across all countries)
            localStorage.setItem('websiteLanguage', currentLang);
            
            // Apply translations
            applyTranslations();
          });
        }
      }

      // Initialize language detection and translation
      detectUserLanguage();
      initLanguageSwitcher();
      
      // Start typing animation - try multiple times to ensure it works
      function initTypingAnimation() {
        const typedSpan = document.querySelector('.typed-inline');
        if (typedSpan) {
          startTypingAnimation();
        } else {
          // Retry if element not found yet
          setTimeout(initTypingAnimation, 100);
        }
      }
      
      // Start immediately and also after DOM is fully ready
      initTypingAnimation();
      
      // Also ensure it starts after a delay as backup
      setTimeout(function() {
        if (document.querySelector('.typed-inline')) {
          startTypingAnimation();
        }
      }, 500);

      // ================== Companies Carousel Slider Animation ==================
      const carouselTrack = document.querySelector('.carousel-track');
      if (carouselTrack) {
        // Duplicate logos for seamless loop
        const logos = Array.from(carouselTrack.children);
        logos.forEach(logo => {
          const clone = logo.cloneNode(true);
          carouselTrack.appendChild(clone);
        });
      }

      // ================== Random Visitor Avatars ==================
      function getRandomAvatars() {
        const avatarIds = ['avatar1', 'avatar2', 'avatar3', 'avatar4'];
        const usedImageIds = new Set();
        
        avatarIds.forEach((avatarId, index) => {
          const avatarElement = document.getElementById(avatarId);
          if (avatarElement) {
            let imageUrl;
            let attempts = 0;
            
            // Use reliable avatar service with unique IDs
            do {
              // Use different avatar services for better reliability
              const randomId = Math.floor(Math.random() * 70) + 1;
              const imageKey = `avatar-${randomId}`;
              
              if (!usedImageIds.has(imageKey)) {
                usedImageIds.add(imageKey);
                // Primary: Use pravatar.cc (more reliable)
                imageUrl = `https://i.pravatar.cc/150?img=${randomId}`;
                break;
              }
              attempts++;
            } while (attempts < 50);
            
            // Fallback if we can't find unique image
            if (!imageUrl) {
              const fallbackId = Math.floor(Math.random() * 70) + 1;
              imageUrl = `https://i.pravatar.cc/150?img=${fallbackId}`;
            }
            
            // Set image source
            avatarElement.src = imageUrl;
            avatarElement.alt = 'Visitor avatar';
            
            // Multiple fallback options if primary fails
            avatarElement.onerror = function() {
              // Fallback 1: Try different pravatar ID
              const fallbackId1 = Math.floor(Math.random() * 70) + 1;
              this.src = `https://i.pravatar.cc/150?img=${fallbackId1}`;
              
              // Fallback 2: If still fails, use UI Avatars
              this.onerror = function() {
                const fallbackId2 = Math.floor(Math.random() * 70) + 1;
                this.src = `https://ui-avatars.com/api/?name=User${fallbackId2}&background=random&size=150&rounded=true`;
                
                // Fallback 3: Use placeholder
                this.onerror = function() {
                  this.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23ddd' width='150' height='150'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='50' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E${index + 1}%3C/text%3E%3C/svg%3E`;
                };
              };
            };
          }
        });
      }

      // Load random avatars on page load
      getRandomAvatars();

      // ================== Smooth Scroll Navigation ==================
      // Handle all navlink clicks for smooth scrolling
      function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"], .dropdown-item[href^="#"]');
        const siteHeader = document.querySelector('.site-header');
        
        // Calculate header height dynamically
        function getHeaderHeight() {
          return siteHeader ? siteHeader.offsetHeight : 80;
        }

        navLinks.forEach(link => {
          link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle anchor links (starting with # and not just #)
            if (href && href.startsWith('#') && href.length > 1) {
              const targetId = href.substring(1);
              const targetSection = document.getElementById(targetId);
              
              if (targetSection) {
                e.preventDefault();
                e.stopPropagation();
                
                // Calculate the position with offset for fixed header
                const headerHeight = getHeaderHeight();
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll to the target section
                window.scrollTo({
                  top: Math.max(0, targetPosition),
                  behavior: 'smooth'
                });

                // Close mobile menu if open (Bootstrap collapse)
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                  const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                  if (bsCollapse) {
                    bsCollapse.hide();
                  } else {
                    const newCollapse = new bootstrap.Collapse(navbarCollapse, {
                      toggle: false
                    });
                    newCollapse.hide();
                  }
                }
              }
            }
          });
        });
      }

      // Initialize smooth scroll
      initSmoothScroll();
    });
    
    // Additional fallback - ensure typing animation starts on window load
    window.addEventListener('load', function() {
      setTimeout(function() {
        const typedSpan = document.querySelector('.typed-inline');
        if (typedSpan && typedSpan.textContent.trim() === '') {
          // Force start typing animation - type phrases one by one
          const phrases = ['Web Dev', 'UI/UX Design', 'Digital Marketing'];
          let phraseIndex = 0;
          let charIndex = 0;
          let typingTimer = null;
          
          function typePhraseText() {
            const currentPhrase = phrases[phraseIndex];
            
            if (charIndex < currentPhrase.length) {
              typedSpan.textContent += currentPhrase.charAt(charIndex);
              typedSpan.style.display = 'inline-block';
              typedSpan.style.visibility = 'visible';
              typedSpan.style.opacity = '1';
              typedSpan.style.color = '#001E8E'; // Blue color
              charIndex++;
              typingTimer = setTimeout(typePhraseText, 80);
            } else {
              // Finished typing phrase, pause then erase
              typingTimer = setTimeout(erasePhraseText, 1500);
            }
          }

          function erasePhraseText() {
            if (charIndex > 0) {
              typedSpan.textContent = typedSpan.textContent.substring(0, charIndex - 1);
              charIndex--;
              typingTimer = setTimeout(erasePhraseText, 50);
            } else {
              // Finished erasing, move to next phrase
              phraseIndex++;
              if (phraseIndex < phrases.length) {
                typingTimer = setTimeout(typePhraseText, 500);
              } else {
                // All phrases done, restart cycle
                typingTimer = setTimeout(function() {
                  typedSpan.textContent = '';
                  phraseIndex = 0;
                  charIndex = 0;
                  typingTimer = setTimeout(typePhraseText, 800);
                }, 2000);
              }
            }
          }
          
          typingTimer = setTimeout(typePhraseText, 500);
        }
      }, 1000);
    });
