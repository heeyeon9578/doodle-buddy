(() => {
  const vscode = acquireVsCodeApi();
  const pet = document.getElementById('pet');
  const walker = document.getElementById('walker');
  const speech = document.getElementById('speech');
  let idleTimer;
  let actionTimer;
  let speechTimer;
  let sleeping = false;
  function say(text) {
    speech.textContent = text;
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => { speech.textContent = sleeping ? 'Z z z …' : ''; }, 3500);
  }
  function wake() {
    sleeping = false;
    pet.classList.remove('sleeping');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      sleeping = true;
      pet.classList.add('sleeping');
      say('Z z z …');
    }, 45000);
  }
  function act(kind) {
    wake();
    clearTimeout(actionTimer);
    pet.classList.remove('typing', 'jump', 'happy');
    void pet.offsetWidth;
    pet.classList.add(kind);
    actionTimer = setTimeout(() => pet.classList.remove(kind), 900);
  }
  window.addEventListener('message', ({ data }) => {
    if (data.type === 'typing') act('typing');
    if (data.type === 'save') { act('jump'); say('저장했다!'); }
  });
  pet.addEventListener('click', () => {
    act('happy');
    const lines = ['응? 불렀어?', '나 여기 있어.', '조금만 쉬었다 해도 돼.', '오늘도 꼬물꼬물.', '쓰담 받았다!'];
    say(lines[Math.floor(Math.random() * lines.length)]);
  });
  document.getElementById('choose').addEventListener('click', () => vscode.postMessage({ type: 'choose' }));
  document.getElementById('reset').addEventListener('click', () => vscode.postMessage({ type: 'reset' }));
  setInterval(() => {
    if (sleeping || document.hidden) return;
    walker.style.setProperty('--wander', `${Math.round(Math.random() * 64 - 32)}px`);
  }, 5500);
  wake();
})();
