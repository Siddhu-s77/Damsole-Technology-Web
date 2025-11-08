    document.addEventListener('DOMContentLoaded', function() {
      // ================== Typing Animation ==================
      const typedSpan = document.querySelector('.typed-inline');
      const caretSpan = document.querySelector('.typed-caret');

      if (typedSpan && caretSpan) {
        const words = ['Web Dev', 'UI/UX Design', 'Digital Marketing'];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 1800;
        let wIndex = 0;
        let charIndex = 0;

        function type() {
          if (charIndex < words[wIndex].length) {
            typedSpan.textContent += words[wIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
          } else {
            setTimeout(erase, newTextDelay);
          }
        }

        function erase() {
          if (charIndex > 0) {
            typedSpan.textContent = words[wIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
          } else {
            wIndex = (wIndex + 1) % words.length;
            setTimeout(type, typingDelay + 500);
          }
        }

        // start
        setTimeout(type, 600);
      }

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
        
        avatarIds.forEach(avatarId => {
          const avatarElement = document.getElementById(avatarId);
          if (avatarElement) {
            let randomId;
            let imageUrl;
            let attempts = 0;
            
            // Ensure unique image ID (no duplicates)
            do {
              const gender = Math.random() > 0.5 ? 'men' : 'women';
              randomId = Math.floor(Math.random() * 100);
              const imageKey = `${gender}-${randomId}`;
              
              if (!usedImageIds.has(imageKey)) {
                usedImageIds.add(imageKey);
                // Add timestamp to prevent caching and ensure fresh image on refresh
                const uniqueId = Date.now() + Math.floor(Math.random() * 10000);
                imageUrl = `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg?${uniqueId}`;
                break;
              }
              attempts++;
            } while (attempts < 50); // Prevent infinite loop
            
            // Fallback if we can't find unique image
            if (!imageUrl) {
              const gender = Math.random() > 0.5 ? 'men' : 'women';
              randomId = Math.floor(Math.random() * 100);
              const uniqueId = Date.now() + Math.floor(Math.random() * 10000);
              imageUrl = `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg?${uniqueId}`;
            }
            
            avatarElement.src = imageUrl;
            avatarElement.onerror = function() {
              // Fallback if image fails to load
              const fallbackId = Math.floor(Math.random() * 70) + 1;
              this.src = `https://i.pravatar.cc/150?img=${fallbackId}`;
            };
          }
        });
      }

      // Load random avatars on page load
      getRandomAvatars();
    });
