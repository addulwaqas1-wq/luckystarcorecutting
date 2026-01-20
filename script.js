var navToggle = document.getElementById('navToggle');
var nav = document.getElementById('nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', function () {
    nav.classList.toggle('open');
  });
}

var yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

var chatToggle = document.getElementById('chatToggle');
var chatPanel = document.getElementById('chatPanel');
var chatClose = document.getElementById('chatClose');
var chatBody = document.getElementById('chatBody');
var chatInput = document.getElementById('chatInput');
var chatSend = document.getElementById('chatSend');

var botState = {
  step: 'welcome',
  intent: '',
  service: '',
  name: '',
  phone: ''
};

function appendMsg(text, who) {
  var el = document.createElement('div');
  el.className = 'msg ' + who;
  el.textContent = text;
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function appendQuick(options) {
  var row = document.createElement('div');
  row.className = 'quick-row';
  options.forEach(function (opt) {
    var b = document.createElement('button');
    b.className = 'quick';
    b.textContent = opt.label;
    b.dataset.value = opt.value;
    b.addEventListener('click', function () {
      handleInput(opt.value, true);
    });
    row.appendChild(b);
  });
  chatBody.appendChild(row);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function openBot() {
  chatPanel.style.display = 'block';
  chatBody.innerHTML = '';
  botState = { step: 'welcome', intent: '', service: '', name: '', phone: '' };
  appendMsg('Welcome to Lucky Star Core Cutting Services.', 'bot');
  appendMsg('How can I help you today?', 'bot');
  appendQuick([
    { label: 'Get a Quote', value: 'quote' },
    { label: 'Book Service', value: 'book' },
    { label: 'Ask a Question', value: 'ask' }
  ]);
}

function closeBot() {
  chatPanel.style.display = 'none';
}

function handleInput(text, fromQuick) {
  if (!text) return;
  if (!fromQuick) appendMsg(text, 'user');
  if (botState.step === 'welcome') {
    var intent = text.toLowerCase();
    if (intent.indexOf('quote') !== -1) botState.intent = 'quote';
    else if (intent.indexOf('book') !== -1) botState.intent = 'book';
    else botState.intent = 'ask';
    botState.step = 'service';
    appendMsg('Which service do you need?', 'bot');
    appendQuick([
      { label: 'Core Cutting', value: 'Core Cutting' },
      { label: 'Slab Cutting', value: 'Slab Cutting' },
      { label: 'Wall Sawing', value: 'Wall Sawing' },
      { label: 'Wire Sawing', value: 'Wire Sawing' },
      { label: 'Diamond Drilling', value: 'Diamond Drilling' }
    ]);
    return;
  }
  if (botState.step === 'service') {
    botState.service = text;
    botState.step = 'name';
    appendMsg('Got it. May I have your name?', 'bot');
    return;
  }
  if (botState.step === 'name') {
    botState.name = text;
    botState.step = 'phone';
    appendMsg('Please share your contact number.', 'bot');
    return;
  }
  if (botState.step === 'phone') {
    botState.phone = text;
    botState.step = 'summary';
    var summary = 'Thank you ' + botState.name + '.';
    summary += ' We will contact you at ' + botState.phone + ' for ' + botState.service + '.';
    appendMsg(summary, 'bot');
    var waText = 'Hello Lucky Star Core Cutting, I need ' + botState.service +
      '. My name is ' + botState.name + ' and my number is ' + botState.phone + '.';
    var waUrl = 'https://wa.me/971509600595?text=' + encodeURIComponent(waText);
    appendQuick([{ label: 'WhatsApp Now', value: waUrl }]);
    return;
  }
  if (botState.step === 'summary') {
    if (text.indexOf('https://wa.me/') === 0) {
      window.open(text, '_blank');
      return;
    }
    appendMsg('You can tap WhatsApp to send details instantly.', 'bot');
    return;
  }
}

if (chatToggle) {
  chatToggle.addEventListener('click', openBot);
}
if (chatClose) {
  chatClose.addEventListener('click', closeBot);
}
if (chatSend && chatInput) {
  chatSend.addEventListener('click', function () {
    var t = chatInput.value.trim();
    chatInput.value = '';
    handleInput(t, false);
  });
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var t = chatInput.value.trim();
      chatInput.value = '';
      handleInput(t, false);
    }
  });
}
