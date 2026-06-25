const http = require('http');
const fs   = require('fs');
const path = require('path');

const DIR  = __dirname;
const PORT = 3000;

const CAT_FILES = {
  indoor:    'indoor.html',
  outdoor:   'outdoor.html',
  cactus:    'cactus.html',
  flowering: 'flowering.html',
  herbs:     'herbs.html',
  exotic:    'exotic.html',
};

const CAT_LABELS = {
  indoor:    'Indoor Plant',
  outdoor:   'Outdoor Plant',
  cactus:    'Cactus & Succulent',
  flowering: 'Flowering Plant',
  herbs:     'Herbs & Medicinal',
  exotic:    'Rare / Exotic Plant',
};

const SEASON_EMOJI = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
};

// ── Card HTML banana ──
function makeCard(data) {
  var seasonRow = '';
  if (data.seasons && data.seasons.length > 0) {
    var tags = data.seasons.map(function(s) {
      return '<span>' + (SEASON_EMOJI[s] || '') + ' ' + s[0].toUpperCase() + s.slice(1) + '</span>';
    }).join('');
    seasonRow = '\n      <div class="info">' + tags + '</div>';
  }

  return [
    '',
    '  <div class="plant-card">',
    '    <div class="img-wrap"><img src="' + data.imgUrl + '" alt="' + data.name + '" style="width:100%;height:100%;object-fit:cover;" loading="lazy"></div>',
    '    <div class="card-body">',
    '      <h2>' + data.name + '</h2>',
    '      <p class="category">' + (CAT_LABELS[data.category] || data.category) + '</p>',
    '      <div class="info"><span>💧 ' + data.water + '</span><span>☀️ ' + data.sun + '</span></div>' + seasonRow,
    '      <button class="buy-btn" onclick="buyPlant(\'' + data.name + '\')">🛒 Buy Now</button>',
    '    </div>',
    '  </div>',
  ].join('\n');
}

// ── File mein card insert karna ──
function insertCard(fileName, cardHTML) {
  var filePath = path.join(DIR, fileName);
  
  if (!fs.existsSync(filePath)) {
    return 'File nahi mili: ' + fileName;
  }

  var content = fs.readFileSync(filePath, 'utf8');

  // plants-container ka closing </div> dhundho
  // Strategy: <footer se pehle jo aakhri </div> hai wahan insert karo
  var footerPos = content.indexOf('<footer');
  if (footerPos < 0) {
    return 'footer tag nahi mila ' + fileName + ' mein';
  }

  var insertPos = content.lastIndexOf('</div>', footerPos);
  if (insertPos < 0) {
    return 'insert position nahi mili';
  }

  // Card insert karo
  var newContent = content.slice(0, insertPos) + cardHTML + '\n\n' + content.slice(insertPos);
  fs.writeFileSync(filePath, newContent, 'utf8');
  return null; // null = no error
}

// ── POST body parse karna ──
function readBody(req, callback) {
  var body = '';
  req.on('data', function(chunk) { body += chunk.toString(); });
  req.on('end', function() {
    try { callback(null, JSON.parse(body)); }
    catch(e) { callback('JSON parse error'); }
  });
}

// ── Static file serve karna ──
function serveFile(res, filePath) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('File not found: ' + filePath);
    return;
  }
  var ext  = path.extname(filePath).toLowerCase();
  var mime = ext === '.html' ? 'text/html' :
             ext === '.css'  ? 'text/css'  :
             ext === '.js'   ? 'application/javascript' : 'text/plain';
  res.writeHead(200, { 'Content-Type': mime + '; charset=utf-8' });
  res.end(fs.readFileSync(filePath));
}

// ── HTTP Server ──
var server = http.createServer(function(req, res) {

  // CORS — Live Server se bhi kaam kare
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  var urlPath = req.url.split('?')[0];

  // ── API: Plant add karo ──
  if (req.method === 'POST' && urlPath === '/api/add-plant') {
    readBody(req, function(err, data) {
      res.setHeader('Content-Type', 'application/json');

      if (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
        return;
      }

      if (!data.name || !data.category || !data.water || !data.sun || !data.imgUrl) {
        res.writeHead(400);
        res.end(JSON.stringify({ ok: false, error: 'Saari fields zaroori hain' }));
        return;
      }

      if (!CAT_FILES[data.category]) {
        res.writeHead(400);
        res.end(JSON.stringify({ ok: false, error: 'Galat category: ' + data.category }));
        return;
      }

      var fileName = CAT_FILES[data.category];
      var cardHTML = makeCard(data);
      var error    = insertCard(fileName, cardHTML);

      if (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ ok: false, error: error }));
      } else {
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true, file: fileName, plant: data.name }));
      }
    });
    return;
  }

  // ── Static files ──
  var filePath;
  if (urlPath === '/' || urlPath === '/admin' || urlPath === '/admin.html') {
    filePath = path.join(DIR, 'admin.html');
  } else {
    filePath = path.join(DIR, urlPath.replace(/^\//, ''));
  }

  serveFile(res, filePath);
});

server.listen(PORT, function() {
  console.log('');
  console.log('  ====================================');
  console.log('    Plant World - Admin Server');
  console.log('  ====================================');
  console.log('');
  console.log('  Server chal raha hai!');
  console.log('');
  console.log('  Admin Panel:  http://localhost:' + PORT + '/admin.html');
  console.log('  Website:      http://localhost:' + PORT + '/home.html');
  console.log('');
  console.log('  Band karna ho to: Ctrl+C');
  console.log('');
});
