// Main JS for IMPERIA
import { db } from './modules/db.js';

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      navLinks.classList.remove('active');
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
        // Files would normally be uploaded to a server
        // Here we'll just store names as placeholder
        photos: Array.from(document.getElementById('photos').files).map(f => f.name)
      };

      db.saveArtist(formData);

      talentForm.style.display = 'none';
      formSuccess.style.display = 'block';

      // Reset catalog to show changes (though new ones are pending)
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
                </div>
                <div class="talent-info">
                    <h3 class="talent-name">${artist.artistName}</h3>
                    <p class="talent-city">${artist.city}</p>
                    <span class="talent-specialty">${artist.specialty}</span>
                    <a href="#" class="btn-card">Ver Perfil</a>
                </div>
            </div>
        `).join('');
  }

  renderTalents();
});
