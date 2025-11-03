document.addEventListener('DOMContentLoaded', function() {
      // ================== Typing Animation ==================
      const typedSpan = document.querySelector('.typed-inline');
      const caretSpan = document.querySelector('.typed-caret');

      if (typedSpan && caretSpan) {
        const words = ['Web Dev', 'UI/UX Design', 'Web Design'];
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
    });
