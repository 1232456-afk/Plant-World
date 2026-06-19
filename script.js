/* =============================================
   Plant World — Global Script (script.js)
   Used by: all pages
   ============================================= */

// ── 1. Live Date & Time ──
function updateDateTime() {
  var now = new Date();
  var dEl = document.getElementById('currentDate');
  var tEl = document.getElementById('currentTime');
  if (dEl) dEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  if (tEl) tEl.textContent = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}
updateDateTime();
setInterval(updateDateTime, 1000);

// ── 2. Buy Plant → Google Search ──
function buyPlant(name) {
  window.open(
    'https://www.google.com/search?q=' + encodeURIComponent(name + ' plant buy online Pakistan'),
    '_blank'
  );
}

// ── 3. Search Filter (category pages) ──
var searchInput = document.getElementById('search');
if (searchInput) {
  var urlQ = new URLSearchParams(window.location.search).get('q');
  if (urlQ) { searchInput.value = urlQ; filterCards(urlQ); }
  searchInput.addEventListener('input', function () { filterCards(this.value); });
}

function filterCards(q) {
  q = q.toLowerCase().trim();
  document.querySelectorAll('.plant-card').forEach(function (card) {
    var h2 = card.querySelector('h2');
    card.style.display = (!q || (h2 && h2.textContent.toLowerCase().includes(q))) ? '' : 'none';
  });
}

// ── 4. Home Search (only on home.html) ──
var homeSearch = document.getElementById('homeSearch');
if (homeSearch) {
  homeSearch.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') goSearch();
  });
}
function goSearch() {
  var q = document.getElementById('homeSearch').value.trim();
  if (q) window.location.href = 'indoor.html?q=' + encodeURIComponent(q);
}
