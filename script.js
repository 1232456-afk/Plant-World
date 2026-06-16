// ============================
// BUY PLANT - Google Search
// ============================
function buyPlant(name) {
  window.open(`https://www.google.com/search?q=${encodeURIComponent(name + ' plant buy online Pakistan')}`, '_blank');
}

// ============================
// LIVE DATE & TIME
// ============================
function updateDateTime() {
  const now = new Date();
  const dateEl = document.getElementById('currentDate');
  const timeEl = document.getElementById('currentTime');
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
}
updateDateTime();
setInterval(updateDateTime, 1000);

// ============================
// USERNAME
// ============================
const userEl = document.getElementById('userName');
if (userEl) userEl.textContent = localStorage.getItem('username') || 'Guest';

// ============================
// LOGOUT
// ============================
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

// ============================
// SEARCH FILTER
// ============================
const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.plant-card').forEach(card => {
      const name = card.querySelector('h2')?.textContent.toLowerCase() || '';
      card.style.display = name.includes(q) ? '' : 'none';
    });
  });
}
