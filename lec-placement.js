(() => {
'use strict';
function offerMessage(offer) {
  return offer.status === 'expired'
      ? '<p class="note"><strong>Ưu đãi 48h của bạn đã kết thúc.</strong> Bạn đã bỏ lỡ chương trình và vẫn muốn đăng ký giá ưu đãi? <a href="https://zalo.me/0877986766" target="_blank" rel="noopener">Nhắn Zalo LEC để được hỗ trợ nhé!</a></p>'
      : '<p class="note">Ưu đãi đăng ký có hiệu lực trong 48h kể từ lần đầu nhận tư vấn trên website này. Hạn của bạn là ' + new Date(offer.expiresAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) + ' (giờ Việt Nam).</p>';
}
function refreshOfferMessage() {
  const node = document.getElementById('lt-offer-message');
  const offer = window.lecOffer?.current();
  if (node && offer) node.innerHTML = offerMessage(offer);
}
document.addEventListener('lec-offer-change', refreshOfferMessage);
const QUESTIONS = [
{s:0,b:0,q:"___ name is Linh. Nice to meet you.",o:["My", "I", "Me", "Mine"],a:0},
{s:0,b:0,q:"She ___ a teacher at a primary school.",o:["is", "are", "am", "be"],a:0},
{s:-1,b:0,q:"I ___ coffee every morning before work.",o:["drink", "drinks", "drinking", "am drink"],a:0},
{s:1,b:0,q:"There ___ two meetings this afternoon.",o:["are", "is", "be", "has"],a:0},
{s:1,b:0,q:"“What time is it?” — “It’s ___.”",o:["half past seven", "seven half", "in seven", "at seven half"],a:0},
{s:-1,b:0,q:"They ___ from Hà Nội.",o:["are", "is", "am", "be"],a:0},
{s:2,b:0,q:"___ you like milk tea?",o:["Do", "Does", "Are", "Is"],a:0},
{s:2,b:0,q:"My brother ___ in a bank.",o:["works", "work", "working", "is work"],a:0},
{s:-1,b:0,q:"Can I borrow ___ umbrella?",o:["an", "a", "some", "two"],a:0},
{s:0,b:0,say:"Hi, I am Tom. I am from Canada, and I work as a nurse in a big hospital.",q:"🎧 Tom làm nghề gì?",o:["A nurse", "A teacher", "A driver", "A doctor"],a:0},
{s:0,b:0,say:"The meeting starts at nine thirty, in room two.",q:"🎧 Cuộc họp bắt đầu lúc mấy giờ?",o:["9:30", "9:13", "9:03", "3:30"],a:0},
{s:1,b:0,say:"My phone number is zero nine one two, three four five, six seven eight.",q:"🎧 Số điện thoại là gì?",o:["0912 345 678", "0921 345 678", "0912 354 678", "0912 345 687"],a:0},
{s:1,b:0,say:"I usually go to work by bus, but today I am taking a taxi.",q:"🎧 Hôm nay người nói đi làm bằng gì?",o:["A taxi", "A bus", "A motorbike", "On foot"],a:0},
{s:2,b:0,say:"Can I have a coffee with milk, no sugar, please?",q:"🎧 Người nói gọi gì?",o:["Coffee with milk, no sugar", "Coffee with sugar, no milk", "Black coffee", "Tea with milk"],a:0},
{s:2,b:0,say:"My birthday is on the fifteenth of May.",q:"🎧 Sinh nhật người nói là ngày nào?",o:["May 15th", "March 15th", "May 5th", "May 16th"],a:0},
{s:0,b:1,q:"Yesterday I ___ home very late.",o:["went", "go", "goes", "going"],a:0},
{s:0,b:1,q:"___ you ever been to Đà Nẵng?",o:["Have", "Did", "Are", "Do"],a:0},
{s:-1,b:1,q:"This hotel is ___ than the one we stayed at last year.",o:["cheaper", "more cheap", "cheapest", "the cheaper"],a:0},
{s:1,b:1,q:"Could you ___ me the menu, please?",o:["give", "giving", "to give", "gave"],a:0},
{s:1,b:1,q:"I’m looking forward ___ you next week.",o:["to meeting", "to meet", "meeting", "meet"],a:0},
{s:-1,b:1,q:"We ___ dinner when the phone rang.",o:["were having", "had", "have", "are having"],a:0},
{s:2,b:1,q:"You ___ wear a helmet on a motorbike. It’s the law.",o:["must", "mustn’t", "don’t have to", "needn’t"],a:0},
{s:2,b:1,q:"How ___ water do you drink a day?",o:["much", "many", "long", "often"],a:0},
{s:-1,b:1,q:"She’s the ___ person in our team.",o:["friendliest", "friendlier", "most friendly than", "friendly"],a:0},
{s:0,b:1,say:"Sorry, I can not come on Friday. How about Saturday morning?",q:"🎧 Người nói muốn gặp khi nào?",o:["Saturday morning", "Friday morning", "Friday evening", "Saturday evening"],a:0},
{s:0,b:1,say:"Turn left at the bank. The pharmacy is next to the supermarket.",q:"🎧 Hiệu thuốc ở đâu?",o:["Next to the supermarket", "Opposite the bank", "Behind the supermarket", "Next to the bank"],a:0},
{s:1,b:1,say:"The train to Hai Phong is delayed by forty minutes because of the heavy rain.",q:"🎧 Tàu trễ bao lâu?",o:["40 minutes", "14 minutes", "4 hours", "45 minutes"],a:0},
{s:1,b:1,say:"I am afraid the blue shirt is sold out, but we have it in white and black.",q:"🎧 Cửa hàng còn áo màu gì?",o:["White and black", "Blue only", "Blue and white", "Black only"],a:0},
{s:2,b:1,say:"Could you send me the report by Thursday afternoon? I need it for the meeting on Friday.",q:"🎧 Hạn gửi báo cáo là khi nào?",o:["Thursday afternoon", "Friday morning", "Thursday morning", "Friday afternoon"],a:0},
{s:2,b:1,say:"I used to live in Da Lat, but I moved to Saigon three years ago.",q:"🎧 Câu nào đúng?",o:["Người nói hiện sống ở Sài Gòn", "Người nói vẫn sống ở Đà Lạt", "Người nói sắp chuyển đến Đà Lạt", "Người nói sống ở Sài Gòn trước khi đến Đà Lạt"],a:0},
{s:0,b:2,q:"If I ___ more free time, I would learn to play the guitar.",o:["had", "have", "will have", "would have"],a:0},
{s:0,b:2,q:"The report ___ by the end of today.",o:["must be finished", "must finish", "must finishing", "must to finish"],a:0},
{s:-1,b:2,q:"I’m not used ___ up this early.",o:["to getting", "to get", "get", "getting"],a:0},
{s:1,b:2,q:"Your colleague says: “Let’s call it a day.” What does she mean?",o:["Let’s stop working for today", "Let’s phone a customer", "Let’s plan a day off", "Let’s choose a date"],a:0},
{s:1,b:2,q:"She asked me where ___.",o:["I worked", "did I work", "do I work", "I working"],a:0},
{s:-1,b:2,q:"I wish I ___ speak English fluently.",o:["could", "can", "will", "would have"],a:0},
{s:2,b:2,q:"This is the restaurant ___ we had our first meeting.",o:["where", "which", "who", "what"],a:0},
{s:2,b:2,q:"He suggested ___ the meeting to Friday.",o:["moving", "to move", "move", "moved"],a:0},
{s:-1,b:2,q:"I’ve been working here ___ 2019.",o:["since", "for", "from", "during"],a:0},
{s:0,b:2,say:"I would love to help, but I am snowed under this week. Could we look at it on Monday?",q:"🎧 Người nói có ý gì?",o:["He is very busy this week", "It is snowing outside", "He does not want to help at all", "He is free this week"],a:0},
{s:0,b:2,say:"The client was happy with the design, but they asked us to cut the price by ten percent.",q:"🎧 Khách hàng muốn gì?",o:["A lower price", "A new design", "More time", "Ten more products"],a:0},
{s:1,b:2,say:"If we do not get the approval by Monday, we will have to postpone the launch.",q:"🎧 Nếu không được duyệt trước thứ Hai thì sao?",o:["The launch will be postponed", "The launch will happen on Monday", "The launch is cancelled forever", "They will launch without approval"],a:0},
{s:1,b:2,say:"I am not really into horror films. I would rather watch something light-hearted.",q:"🎧 Người nói thích xem gì?",o:["Light, cheerful films", "Horror films", "No films at all", "Sad films"],a:0},
{s:2,b:2,say:"Sorry, could you speak up a bit? The line is breaking up.",q:"🎧 Vấn đề là gì?",o:["The phone connection is bad", "The speaker is angry", "The call has ended", "The speaker wants to hang up"],a:0},
{s:2,b:2,say:"We ran out of printer paper, so I have ordered some more. It should arrive tomorrow.",q:"🎧 Câu nào đúng?",o:["There is no paper now", "They have too much paper", "The printer is broken", "The paper arrived today"],a:0},
{s:0,b:3,q:"By the time we arrive, the meeting ___.",o:["will have started", "will start", "has started", "starts"],a:0},
{s:0,b:3,q:"___ the heavy traffic, she still arrived on time.",o:["Despite", "Although", "Because", "However"],a:0},
{s:-1,b:3,q:"I’d rather you ___ this to anyone yet.",o:["didn’t mention", "don’t mention", "not mention", "won’t mention"],a:0},
{s:1,b:3,q:"Which is the most polite way to disagree in a meeting?",o:["I see your point, but I’m not sure that will work.", "You’re wrong about this.", "That is a bad idea.", "No. I don’t agree with you."],a:0},
{s:1,b:3,q:"Had I known about the delay, I ___ earlier.",o:["would have left", "would leave", "will leave", "had left"],a:0},
{s:-1,b:3,q:"Not only ___ late, but he also forgot the documents.",o:["was he", "he was", "did he", "he did"],a:0},
{s:2,b:3,q:"The new app, ___ was launched last year, has been a big success.",o:["which", "that", "what", "who"],a:0},
{s:2,b:3,q:"You’d better ___ your manager before you decide.",o:["consult", "to consult", "consulting", "consulted"],a:0},
{s:-1,b:3,q:"It’s high time we ___ a decision.",o:["made", "make", "will make", "have made"],a:0},
{s:0,b:3,say:"Frankly, the proposal looks good on paper, but I am not convinced it will work in practice.",q:"🎧 Thái độ của người nói là gì?",o:["Doubtful", "Very excited", "Angry", "Completely positive"],a:0},
{s:0,b:3,say:"Had the shipment arrived on time, we would not have lost the contract.",q:"🎧 Chuyện gì đã xảy ra?",o:["The shipment was late and they lost the contract", "The shipment arrived on time", "They won the contract", "They cancelled the shipment"],a:0},
{s:1,b:3,say:"To be honest, the figures are encouraging, but it is too early to draw any firm conclusions.",q:"🎧 Ý người nói là gì?",o:["The results look good but are not final", "The results are terrible", "They have made a final decision", "The figures are wrong"],a:0},
{s:1,b:3,say:"She was supposed to lead the workshop, but she came down with the flu at the last minute.",q:"🎧 Chuyện gì đã xảy ra?",o:["She got sick and could not lead it", "She led the workshop", "She refused to lead it", "She arrived late"],a:0},
{s:2,b:3,say:"Given the tight deadline, we might want to bring in some extra help.",q:"🎧 Người nói đề xuất gì?",o:["Getting more people because time is short", "Extending the deadline", "Cancelling the project", "Working alone"],a:0},
{s:2,b:3,say:"I will take you up on that offer next time I am in town.",q:"🎧 Ý người nói là gì?",o:["He will accept the offer later", "He refuses the offer", "He is in town now", "He is making an offer"],a:0},
{s:0,b:0,pr:1,q:"🗣️ Phát âm · Từ nào có phần trong [ ] đọc KHÁC các từ còn lại?",o:["c[a]ke", "c[a]t", "h[a]t", "m[a]p"],a:0},
{s:1,b:0,pr:1,say:"sheep",q:"🔊 Phát âm · Bạn nghe thấy từ nào?",o:["sheep", "ship", "cheap", "chip"],a:0},
{s:2,b:0,pr:1,q:"🗣️ Phát âm · Từ nào có phần trong [ ] đọc KHÁC các từ còn lại?",o:["n[i]ce", "s[i]t", "b[i]g", "f[i]sh"],a:0},
{s:0,b:1,pr:1,say:"thirty",q:"🔊 Phát âm · Bạn nghe thấy từ nào?",o:["thirty", "thirteen", "three", "third"],a:0},
{s:1,b:1,pr:1,q:"🗣️ Phát âm · Từ nào có đuôi -ed đọc là /ɪd/?",o:["wanted", "played", "worked", "cleaned"],a:0},
{s:2,b:1,pr:1,say:"walk",q:"🔊 Phát âm · Bạn nghe thấy từ nào?",o:["walk", "work", "woke", "wake"],a:0},
{s:0,b:2,pr:1,q:"🗣️ Phát âm · Từ nào có trọng âm rơi vào âm tiết thứ HAI?",o:["hotel", "happy", "window", "teacher"],a:0},
{s:1,b:2,pr:1,say:"full",q:"🔊 Phát âm · Bạn nghe thấy từ nào?",o:["full", "fool", "fall", "fill"],a:0},
{s:2,b:2,pr:1,q:"🗣️ Phát âm · Từ nào có đuôi -s/-es đọc là /ɪz/?",o:["watches", "plays", "books", "cats"],a:0},
{s:0,b:3,pr:1,say:"think",q:"🔊 Phát âm · Bạn nghe thấy từ nào?",o:["think", "sink", "thing", "tink"],a:0},
{s:1,b:3,pr:1,q:"🗣️ Phát âm · Từ nào có chữ cái CÂM (viết nhưng không đọc)?",o:["knife", "kite", "keep", "kind"],a:0},
{s:2,b:3,pr:1,say:"rice",q:"🔊 Phát âm · Bạn nghe thấy từ nào?",o:["rice", "lice", "rise", "ride"],a:0}
];
const COURSES = {
  "ds": [
    {
      "title": "3 Tháng Xóa Mất Gốc Nghe Nói Tiếng Anh",
      "target": "A0 – A1"
    },
    {
      "title": "3 Tháng Xây Nền Tiếng Anh Vững Vàng",
      "target": "A1 – A2"
    },
    {
      "title": "3 Tháng Bứt Tốc Nghe Nói Tiếng Anh",
      "target": "A2 – B1"
    },
    {
      "title": "3 Tháng Đột Phá Nghe Nói Tiếng Anh",
      "target": "B1 – B2"
    },
    {
      "title": "3 Tháng Vượt Bậc Nghe Nói Tiếng Anh",
      "target": "B2 – C1"
    }
  ],
  "cv": [
    null,
    {
      "title": "24 Chủ Đề Công Sở Thực Tế",
      "target": "A1 – A2"
    },
    {
      "title": "24 Chủ Đề Công Sở Nâng Cao",
      "target": "A2 – B1"
    },
    {
      "title": "24 Chủ Đề Công Sở Chuyên Sâu",
      "target": "B1 – B2"
    },
    {
      "title": "Thiết Kế Riêng Theo Ngành Nghề",
      "target": "B1 – C1"
    }
  ]
};

const BANDS = ['A0', 'A1', 'A2', 'B1', 'B2'];
const FEEDBACK = [
  'Bắt đầu với mẫu câu đơn giản, âm cơ bản và phản xạ trong tình huống quen thuộc.',
  'Củng cố câu cơ bản và luyện phản xạ hỏi đáp trong các tình huống thường gặp.',
  'Luyện nối ý, kể lại tình huống và giao tiếp linh hoạt hơn.',
  'Tập diễn đạt ý rõ ràng, phản hồi tự nhiên và xử lý tình huống phức tạp hơn.',
  'Luyện diễn đạt sắc thái, lập luận và xử lý hội thoại chuyên sâu.',
];

function shuffle(values) {
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

function getLevel(scores) {
  const firstBelowThreshold = scores.findIndex(score => score < 3);
  return firstBelowThreshold < 0 ? scores.length : firstBelowThreshold;
}

const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cancelAudio = () => window.speechSynthesis?.cancel();

function openPlacement() {
  if (document.getElementById('lt-ov')) return;
  const overlay = document.createElement('dialog');
  overlay.id = 'lt-ov';
  overlay.setAttribute('aria-labelledby', 'lt-title');
  overlay.innerHTML = '<div class="wrap"><button id="lt-x" type="button" aria-label="Đóng bài kiểm tra">×</button><div class="top"><span id="lt-title">Bài kiểm tra đầu vào LEC</span><small id="lt-lbl" aria-live="polite"></small></div><div class="card" id="lt-app"></div></div>';
  document.body.appendChild(overlay);
  const app = overlay.querySelector('#lt-app');
  const label = overlay.querySelector('#lt-lbl');
  const on = (selector, callback) => app.querySelector(selector)?.addEventListener('click', callback);
  const close = () => overlay.close();
  overlay.querySelector('#lt-x').addEventListener('click', close);
  overlay.addEventListener('close', () => {
    cancelAudio();
    overlay.remove();
  });

  let set = Math.floor(Math.random() * 3);
  let order, answers, plays, current;

  function reset() {
    order = QUESTIONS.filter(question => question.s === set)
      .sort((a, b) => a.b - b.b)
      .map(question => {
        const options = shuffle([0, 1, 2, 3]);
        return { ...question, o: options.map(index => question.o[index]), a: options.indexOf(question.a) };
      });
    answers = Array(order.length).fill(-1);
    plays = Array(order.length).fill(0);
    current = -1;
    render();
  }

  function step(next) {
    cancelAudio();
    current = next;
    render();
    overlay.scrollTop = 0;
    app.querySelector('h1, .q')?.focus({ preventScroll: true });
  }

  function play(question) {
    const audio = window.speechSynthesis;
    const button = app.querySelector('#lt-play');
    const notice = app.querySelector('#lt-audio-status');
    const index = current;
    if (!audio || !window.SpeechSynthesisUtterance) {
      notice.textContent = 'Trình duyệt này chưa hỗ trợ phần nghe. Bạn có thể thử mở bằng Chrome hoặc Safari.';
      return;
    }
    cancelAudio();
    const voices = audio.getVoices().filter(voice => /^en[-_]/i.test(voice.lang));
    const voice = voices.find(item => /Google US English|Samantha|Ava|Aria|Jenny/i.test(item.name))
      || voices.find(item => /^en[-_]US$/i.test(item.lang)) || voices[0];
    const utterance = new SpeechSynthesisUtterance(question.say);
    utterance.lang = voice?.lang || 'en-US';
    if (voice) utterance.voice = voice;
    utterance.rate = question.pr ? 0.75 : question.b < 2 ? 0.85 : 0.95;
    button.disabled = true;
    utterance.onstart = () => {
      plays[index]++;
      if (current === index) notice.textContent = 'Còn ' + (3 - plays[index]) + ' lượt nghe';
    };
    utterance.onend = () => { button.disabled = plays[index] >= 3; };
    utterance.onerror = event => {
      button.disabled = plays[index] >= 3;
      if (current === index && !['interrupted', 'canceled'].includes(event.error)) {
        notice.textContent = 'Chưa phát được âm thanh. Hãy bật âm lượng hoặc thử trình duyệt khác.';
      }
    };
    audio.speak(utterance);
  }

  function render() {
    if (current < 0) {
      label.textContent = '';
      app.innerHTML = '<div class="eb">Bài kiểm tra đầu vào</div><h1 tabindex="-1">Bạn nên bắt đầu ở level nào?</h1><p class="lead">Làm bài để nhận gợi ý level cho lớp tiếng Anh giao tiếp học cùng giáo viên LEC. Câu nào chưa biết, bạn có thể chọn “Mình chưa biết”.</p><div class="facts"><div><b>20</b><span>câu · có phần nghe</span></div><div><b>~6</b><span>phút</span></div><div><b>0–4</b><span>level lớp LEC</span></div></div><button class="btn full" type="button" id="lt-go">Bắt đầu làm bài</button><p class="note">Bật loa hoặc đeo tai nghe. Mỗi câu có âm thanh được nghe tối đa 3 lượt. Bài chấm tự động, gồm nhận biết âm, nghe, ngữ pháp và từ vựng.</p>';
      on('#lt-go', () => step(0));
      return;
    }
    if (current === order.length) {
      renderResult();
      return;
    }
    const question = order[current];
    label.textContent = 'Câu ' + (current + 1) + '/' + order.length;
    const progress = order.map((_, index) => '<i class="' + (index < current ? 'on' : index === current ? 'cur' : '') + '"></i>').join('');
    const remaining = 3 - plays[current];
    const audio = question.say ? '<div style="display:flex;gap:12px;align-items:center;margin-top:12px;flex-wrap:wrap"><button class="btn" type="button" id="lt-play"' + (remaining ? '' : ' disabled') + '>▶ Nghe</button><span id="lt-audio-status" role="status">Còn ' + remaining + ' lượt nghe</span></div>' : '';
    const options = [...question.o, 'Mình chưa biết'].map((option, index) =>
      '<button class="opt" type="button" data-answer="' + index + '" aria-pressed="' + (answers[current] === index) + '"><span class="k">' + 'ABCD?'[index] + '</span><span>' + escape(option) + '</span></button>'
    ).join('');
    app.innerHTML = '<div class="prog" aria-hidden="true">' + progress + '</div><span class="lvl">Phần ' + (question.b + 1) + ' · ' + BANDS[question.b + 1] + (question.pr ? ' · Nhận biết âm' : question.say ? ' · Nghe' : '') + '</span>' + audio + '<h2 class="q" tabindex="-1">' + escape(question.q).replace('___', '<u></u>') + '</h2><div class="opts">' + options + '</div><div class="nav">' + (current ? '<button id="lt-back" type="button">← Câu trước</button>' : '') + '</div>';
    app.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
      answers[current] = Number(button.dataset.answer);
      step(current + 1);
    }));
    on('#lt-play', () => play(question));
    on('#lt-back', () => step(current - 1));
  }

  async function renderResult(track = 'ds') {
    label.textContent = 'Kết quả';
    let offer;
    try {
      offer = await window.lecOffer.start();
    } catch {
      app.innerHTML = '<h1>Kết quả đã sẵn sàng</h1><p>Chưa kết nối được với LEC để hiển thị tư vấn. Bạn bấm thử lại nhé.</p><button class="btn" type="button" id="lt-result-retry">Hiển thị kết quả tư vấn</button>';
      on('#lt-result-retry', () => renderResult(track));
      return;
    }
    if (!overlay.open || !overlay.isConnected) return;
    const scores = [0, 0, 0, 0];
    order.forEach((question, index) => { if (answers[index] === question.a) scores[question.b]++; });
    const level = getLevel(scores);
    const band = BANDS[level];
    const score = scores.reduce((sum, value) => sum + value, 0);
    const course = COURSES[track][level];
    window.lecPlacementResult = { level, band, score };
    const breakdown = scores.map((value, index) => '<div><b>' + value + '/5</b>Phần ' + BANDS[index + 1] + '</div>').join('');
    const tracks = level ? '<div class="nav"><span>Chọn mục tiêu học</span><div><button type="button" id="lt-life" aria-pressed="' + (track === 'ds') + '">Đời Sống</button> · <button type="button" id="lt-work" aria-pressed="' + (track === 'cv') + '">Công Việc</button></div></div>' : '';
    app.innerHTML = '<div class="eb">Kết quả tham khảo</div><h1 tabindex="-1">' + band + ' · Gợi ý Level ' + level + '</h1><div class="score">Đúng ' + score + '/' + order.length + ' câu</div><div class="bands">' + breakdown + '</div>' + tracks +
      '<div class="rec"><div class="t">LỚP HỌC CÙNG GIÁO VIÊN</div><h3>Level ' + level + ' · ' + (track === 'cv' ? 'Công Việc' : 'Đời Sống') + '</h3><p><strong>' + course.title + '</strong><br>Lộ trình ' + course.target + '. ' + (track === 'cv' && level === 4 ? 'Giáo viên tư vấn lộ trình theo ngành nghề và tình huống công việc của bạn.' : FEEDBACK[level]) + '</p></div>' +
      (level === 0 ? '<p class="alt">Nếu mục tiêu của bạn là giao tiếp công việc, hãy học Level 0 Đời Sống trước. Nhánh Công Việc bắt đầu từ Level 1.</p>' : '') +
      '<div id="lt-offer-message">' + offerMessage(offer) + '</div><p class="note">Kết quả là gợi ý xếp lớp từ bài trắc nghiệm. Giáo viên có thể kiểm tra thêm phản xạ nói khi tư vấn.</p><div class="cta"><button class="btn full" type="button" id="lt-consult">Nhận tư vấn Level ' + level + '</button><button class="btn ghost full" type="button" id="lt-course">Xem lộ trình Level ' + level + '</button><button class="btn ghost full" type="button" id="lt-again">Làm lại bài test</button></div>';
    function choose(destination) {
      close();
      document.dispatchEvent(new CustomEvent('lec-placement-choice', { detail: { level, track, destination } }));
    }
    on('#lt-consult', () => choose('form'));
    on('#lt-course', () => choose('course'));
    on('#lt-life', () => { renderResult('ds'); app.querySelector('#lt-life').focus(); });
    on('#lt-work', () => { renderResult('cv'); app.querySelector('#lt-work').focus(); });
    on('#lt-again', () => { set = (set + 1) % 3; reset(); step(0); });
  }

  reset();
  overlay.showModal();
  app.querySelector('#lt-go').focus();
}

document.addEventListener('click', event => {
  if (!event.target.closest('[data-lec-placement]')) return;
  event.preventDefault();
  openPlacement();
});
if (location.hash === '#kiem-tra' || /^\/bai-test\/?$/.test(location.pathname)) openPlacement();
})();
