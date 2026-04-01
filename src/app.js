import { greetings } from './data/greetings';
import { birthdayGreetings } from './data/birthdayGreetings';
import { messages } from './data/messages';
import { formatDateRu, isBirthday } from './utils/date';
import { typeText } from './utils/typing';
import { shuffleArray } from './utils/shuffle';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function initApp() {
  const tg = window.Telegram?.WebApp;

  if (tg) {
    tg.ready();
    tg.expand();
    tg.disableVerticalSwipes?.();
  }

  const app = document.querySelector('#app');

  app.innerHTML = `
    <div class="screen" id="screen">
      <video class="bg-video" autoplay muted loop playsinline preload="auto">
        <source src="/video/space-loop.mp4" type="video/mp4" />
      </video>

      <div class="overlay">
        <div class="top-block">
          <h1 class="title" id="title">Привет, Тахмина</h1>
          <div class="date" id="dateLine"></div>
        </div>

        <div class="message-wrap">
          <div class="message cursor" id="message"></div>
        </div>

        <div class="hint" id="hint">коснись экрана, когда захочешь</div>
      </div>
    </div>
  `;

  const titleEl = document.querySelector('#title');
  const dateLine = document.querySelector('#dateLine');
  const messageEl = document.querySelector('#message');
  const hintEl = document.querySelector('#hint');
  const screenEl = document.querySelector('#screen');

  let typingLocked = true;
  let currentMessagesPool = shuffleArray(messages);

  function getTelegramName() {
    return tg?.initDataUnsafe?.user?.first_name || 'Тахмина';
  }

  function getNextMessage() {
    if (currentMessagesPool.length === 0) {
      currentMessagesPool = shuffleArray(messages);
    }

    return currentMessagesPool.pop();
  }

  async function showIntro() {
    const today = new Date();
    const introPool = isBirthday(today) ? birthdayGreetings : greetings;
    const introText = shuffleArray(introPool)[0].replaceAll('{name}', getTelegramName());

    titleEl.textContent = `Привет, ${getTelegramName()}`;
    dateLine.textContent = formatDateRu(today);

    messageEl.classList.remove('is-hidden');
    messageEl.classList.add('cursor');

    await typeText(messageEl, introText, isBirthday(today) ? 38 : 42);

    messageEl.classList.remove('cursor');
    typingLocked = false;
  }

  async function showNextMessage() {
    if (typingLocked) return;

    typingLocked = true;
    hintEl.classList.add('is-hidden');

    messageEl.classList.remove('is-hidden');
    messageEl.classList.add('cursor');
    messageEl.textContent = '';

    const nextText = getNextMessage().replaceAll('{name}', getTelegramName());

    await typeText(messageEl, nextText, 36);

    messageEl.classList.remove('cursor');

    await wait(5000);

    messageEl.classList.add('is-hidden');

    await wait(800);

    messageEl.textContent = '';
    messageEl.classList.remove('is-hidden');

    typingLocked = false;
  }

  const triggerNextMessage = () => {
    showNextMessage();
  };

  screenEl.addEventListener('click', triggerNextMessage);
  screenEl.addEventListener('touchstart', triggerNextMessage, { passive: true });

  showIntro();

  setInterval(() => {
    dateLine.textContent = formatDateRu(new Date());
  }, 60000);
}
