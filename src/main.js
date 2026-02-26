// Main JS for IMPERIA
import { db } from './modules/db.js';
import { translations, setLanguage, getCurrentLanguage } from './modules/i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  // Halo Cursor Logic
  const cursorHalo = document.getElementById('cursor-halo');

  if (window.innerWidth > 1024 && cursorHalo) {
    document.addEventListener('mousemove', (e) => {
      cursorHalo.style.left = `${e.clientX}px`;
      cursorHalo.style.top = `${e.clientY}px`;
    });

    // Reactive Glow Interactions
    const updateInteractives = () => {
      const interactives = document.querySelectorAll('a, button, .talent-card, h1, h2, .split-image, .syllabus-card');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorHalo.style.width = '220px';
          cursorHalo.style.height = '220px';
          cursorHalo.style.opacity = '0.6';
          cursorHalo.style.filter = 'blur(35px)';

          if (el.classList.contains('btn') || el.tagName === 'BUTTON') {
            cursorHalo.style.background = 'radial-gradient(circle, #FF4FA3 0%, transparent 70%)';
          }
        });

        el.addEventListener('mouseleave', () => {
          cursorHalo.style.width = '150px';
          cursorHalo.style.height = '150px';
          cursorHalo.style.opacity = '0.35';
          cursorHalo.style.filter = 'blur(25px)';
          cursorHalo.style.background = 'radial-gradient(circle, var(--color-pink-vibrant) 0%, transparent 70%)';
        });
      });
    };
    updateInteractives();
  }

  // Academy Syllabus Card Expansion
  const syllabusCards = document.querySelectorAll('.syllabus-card');
  syllabusCards.forEach(card => {
    const header = card.querySelector('.card-header');
    header.addEventListener('click', () => {
      // Close other cards
      syllabusCards.forEach(otherCard => {
        if (otherCard !== card) otherCard.classList.remove('active');
      });
      // Toggle current card
      card.classList.toggle('active');
    });
  });

  // Ash Particles Effect (Hero)
  const ashContainer = document.getElementById('ash-container');
  if (ashContainer) {
    for (let i = 0; i < 40; i++) {
      const ash = document.createElement('div');
      ash.className = 'ash';

      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 10;

      ash.style.width = `${size}px`;
      ash.style.height = `${size}px`;
      ash.style.left = `${left}%`;
      ash.style.bottom = `-5%`;
      ash.style.opacity = Math.random() * 0.3;
      ash.style.animation = `floatAsh ${duration}s linear infinite`;
      ash.style.animationDelay = `${delay}s`;

      ashContainer.appendChild(ash);
    }
  }

  // Navigation Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Mobile Sidebar Toggle Logic ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileSidebar = document.getElementById('mobile-sidebar');
  const navOverlay = document.getElementById('nav-overlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-links a');

  const toggleMenu = () => {
    mobileMenuToggle.classList.toggle('active');
    mobileSidebar.classList.toggle('active');
    navOverlay.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (mobileSidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', toggleMenu);
  }

  // Close sidebar when a link is clicked
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileSidebar.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Talent Form Submission
  const talentForm = document.getElementById('talent-form');
  const formSuccess = document.getElementById('form-success');

  if (talentForm) {
    talentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        artistName: document.getElementById('artistName').value,
        realName: document.getElementById('realName').value,
        city: document.getElementById('city').value,
        age: document.getElementById('age').value,
        experience: document.getElementById('experience').value,
        specialty: document.getElementById('specialty').value,
        description: document.getElementById('description').value,
        social: document.getElementById('social').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        photos: Array.from(document.getElementById('photos').files).map(f => f.name)
      };

      db.saveArtist(formData);

      talentForm.style.display = 'none';
      formSuccess.style.display = 'block';

      renderTalents();
    });
  }

  // Render Talents Catalog
  const talentsContainer = document.getElementById('talents-container');

  function renderTalents() {
    if (!talentsContainer) return;

    const publicArtists = db.getPublicArtists();

    if (publicArtists.length === 0) {
      talentsContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #666;">Próximamente estaremos presentando a nuestros talentos destacados.</p>';
      return;
    }

    talentsContainer.innerHTML = publicArtists.map(artist => `
            <div class="talent-card fade-in">
                <div class="talent-image-wrapper">
                    <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400" alt="${artist.artistName}" class="talent-image">
                    <div class="card-glow-overlay"></div>
                </div>
                <div class="talent-info">
                    <h3 class="talent-name">${artist.artistName}</h3>
                    <p class="talent-city">${artist.city}</p>
                    <span class="talent-specialty">${artist.specialty}</span>
                    <a href="#" class="btn btn-card" style="margin-top: 1rem; padding: 0.5rem 1.5rem; font-size: 0.8rem; border-radius: 4px; background: var(--grad-pink); color: white;">Ver Perfil</a>
                </div>
            </div>
        `).join('');
  }

  // --- Language Switcher Logic ---
  const currentLang = getCurrentLanguage();
  setLanguage(currentLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // --- Sound Experience Logic ---
  const soundToggle = document.getElementById('sound-toggle');
  let isSpeaking = false;

  const speakWelcome = () => {
    const lang = getCurrentLanguage();
    const message = translations[lang]["welcome-msg"];
    const utterance = new SpeechSynthesisUtterance(message);

    // Set a more sophisticated voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => (v.name.includes('Female') || v.name.includes('Google')) && v.lang.startsWith(lang));

    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.pitch = 1.1;
    utterance.rate = 0.9;

    utterance.onstart = () => {
      isSpeaking = true;
      soundToggle.classList.add('active');
    };

    utterance.onend = () => {
      isSpeaking = false;
      soundToggle.classList.remove('active');
    };

    window.speechSynthesis.speak(utterance);
  };

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        soundToggle.classList.remove('active');
      } else {
        speakWelcome();
      }
    });
  }

  // Reload voices when they change (browser compatibility)
  window.speechSynthesis.onvoiceschanged = () => { };

  renderTalents();
});
