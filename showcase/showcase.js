(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const page = document.body.classList.contains('sf-showcase-page');
  let language = 'en';
  if (page) { try { language = localStorage.getItem('sf-language') === 'zh' ? 'zh' : 'en'; } catch {} }
  const lang = () => page ? language : (window.SF_I18N?.lang || 'en');
  const t = pair => pair[lang() === 'zh' ? 1 : 0];
  const people = {motong:'Motong Chen', elysia:'Elysia Cyrene', furina:'Furina Recardo'};
  const featuredPeople = {student:'motong', customer:'elysia', negotiation:'furina'};
  const states = Object.fromEntries(['student','customer','negotiation'].map(id => [id, {person:featuredPeople[id], round:id === 'student' ? 0 : 3, open:false}]));
  const scenes = {
    student: {
      number:'01', category:['TUTORING','教学练习'], title:['A student who<br>can be wrong.','让学生，<br>可以真的不懂。'],
      description:['Test how a tutor responds to misconceptions, hesitation and follow-up questions.','让教学助手面对误解、犹豫与追问，练习如何解释。'],
      traits:[['Initial misconception','初始误解'],['Gradual learning','渐进学习']],
      observations:{socio:['Thinks aloud','边想边问'], qwen3:['Prior belief drifts','回述前情偏移'], gpt55:['Tidy rule summary','规则总结式表达']},
      speaker:['TEACHER','教师']
    },
    customer: {
      number:'02', category:['CUSTOMER SUPPORT','客服交互'], title:['A customer with<br>a deadline.','让顾客，<br>有自己的期限。'],
      description:['Test whether a support agent responds to the person’s priorities, beyond quoting a policy.','让客服助手回应顾客的实际诉求，练习如何给出有用的方案。'],
      traits:[['Two-day deadline','两天期限'],['Natural pushback','自然表达不满']],
      observations:{socio:['Keeps the urgency','守住两天期限'], qwen3:['Deadline drifts','期限发生漂移'], gpt55:['Checklist-like voice','清单式表达']},
      speaker:['SUPPORT AGENT','客服']
    },
    negotiation: {
      number:'03', category:['NEGOTIATION','谈判演练'], title:['A buyer with<br>firm limits.','让买家，<br>守住自己的底线。'],
      description:['Practice changing offers with a buyer whose budget and inspection requirements still matter.','让谈判助手面对不断变化的报价，以及买家不变的预算与验车要求。'],
      traits:[['¥650 total cap','650元总预算'],['Inspect before paying','付款前验车']],
      observations:{socio:['Budget + inspection','兼顾预算与验车'], qwen3:['Price vs. total blurred','车价与总预算混淆'], gpt55:['Formal terms-checking','条款确认式表达']},
      speaker:['SELLER','卖家']
    }
  };
  const profiles = {
    student_motong:['Starts with 1/8 > 1/6 because 8 > 6. Cautious, unsure, and willing to ask questions.','一开始因“8比6大”而认为1/8比1/6大；谨慎、怕出错，不懂时会提问。'],
    student_elysia:['Already knows 1/6 > 1/8 for the same whole. Likes counterexamples, but may overlook whole size.','已知道同样大的整体中1/6比1/8大，喜欢找反例，有时忽略整体大小。'],
    student_furina:['Has memorized 1/6 > 1/8 without understanding why. Unsure when numerators differ.','背过1/6比1/8大的规则，却不理解原因；分子不同时会困惑，也容易附和老师。'],
    customer_motong:['Prefers a refund and wants the policy and next steps confirmed in writing.','倾向退款，希望获得明确政策与书面确认。'],
    customer_elysia:['Needs headphones for an event in two days. Initially wants a fast replacement; five days is too late.','两天后的活动急需耳机，最初偏好快速换货，五天送达来不及。'],
    customer_furina:['Prefers a replacement to avoid waste. Can wait a week; has a defect photo but has not sent it.','为避免浪费倾向换货，可以等一周；有故障照片，但尚未发送。'],
    negotiation_motong:['A ¥650 total cap, including service. Can wait until tomorrow; must personally test brakes and inspect the frame before paying.','含保养费总预算650元，可以等到明天；付款前必须亲自测试刹车、检查车架。'],
    negotiation_elysia:['Needs a usable bike today. Accepts cosmetic wear; has a ¥760 total cap.','今天就需要能用的自行车，接受外观磨损，总预算760元。'],
    negotiation_furina:['Can wait until tomorrow. Values inspection and a receipt; has a ¥740 total cap.','可以等到明天，重视验车和收据，总预算740元。'],
  };
  const variants = {
    student_elysia:{title:['A student who<br>asks “what if.”','让学生，<br>主动追问条件。'],traits:[['Prior knowledge','已有知识'],['Counterexamples','喜欢反例']],observations:{socio:['Explores the boundary','继续试探边界'],qwen3:['Textbook-like phrasing','标准解题式措辞'],gpt55:['Quickly closes the rule','迅速收束规则']}},
    student_furina:{title:['Knowing the rule.<br>Missing the reason.','记住了口诀，<br>却没理解原因。'],traits:[['Memorized rule','背过口诀'],['Still uncertain','仍有不确定']],observations:{socio:['Admits confusion','承认自己困惑'],qwen3:['Prepared learning plan','答题总结式计划'],gpt55:['Formal math explanation','正式数学解释']}},
    customer_motong:{title:['A customer who<br>wants a refund.','让顾客，<br>明确自己的诉求。'],traits:[['Refund preferred','倾向退款'],['Written confirmation','书面确认']],observations:{socio:['Keeps refund preference','坚持退款偏好'],qwen3:['Support-email tone','客服邮件式措辞'],gpt55:['Drafted-request voice','申请清单式表达']}},
    customer_furina:{title:['A customer who<br>can wait.','让顾客，<br>有不同的选择。'],traits:[['Replacement preferred','倾向换货'],['Can wait a week','可等一周']],observations:{socio:['Patient & concise','耐心且简洁'],qwen3:['Formal support request','正式客服请求'],gpt55:['Checklist-like voice','清单式表达']}},
    negotiation_elysia:{traits:[['Pickup today','今天取车'],['¥760 total cap','760元总预算']],observations:{socio:['Keeps today central','始终围绕今天取车'],qwen3:['Adds unavailable check','加入未提供的检查'],gpt55:['Adds unavailable checks','加入未提供的检查']}},
    negotiation_furina:{title:['A buyer who<br>values assurance.','让买家，<br>重视交易保障。'],description:['Practice with a buyer who values inspection, a receipt and a deal they can trust.','让谈判助手回应买家对验车、收据与价格的考量，练习如何建立交易信任。'],traits:[['¥740 total cap','740元总预算'],['Inspection & receipt','验车与收据']],observations:{socio:['Polite counteroffer','礼貌提出还价'],qwen3:['Rechecks offered terms','重复确认已有条件'],gpt55:['Tidy, formal terms','完整条款式表达']}}
  };
  const activePerson = id => page ? states[id].person : featuredPeople[id];
  const sceneConfig = id => ({...scenes[id], ...variants[id+'_'+activePerson(id)]});
  function illustration(id) {
    const person=activePerson(id);
    if (id === 'student') return `<div class="sf-illustration sf-fraction" aria-label="${t(['A learner compares fractions of the same whole','学生比较相同整体的分数'])}">
      <div class="sf-thought">${t(person==='motong' ? ['Initial belief: 1/8 &gt; 1/6','初始认知：1/8 比 1/6 大'] : person==='elysia' ? ['Knows the rule. Tests its limits.','已知规则，喜欢试探适用边界。'] : ['Memorized the rule. Unsure why.','背过规则，还不理解原因。'])}</div>
      <div class="sf-pizzas"><div><div class="sf-pizza six"><i></i></div><b>1/6</b></div><span class="sf-fraction-compare">&gt;</span><div><div class="sf-pizza eight"><i></i></div><b>1/8</b></div></div>
      <span class="sf-stage-label">${t(['Same whole. More pieces. Smaller shares.','相同整体，更多等份，更小的每一份。'])}</span></div>`;
    if (id === 'customer') return `<div class="sf-illustration sf-support" aria-label="${t(['A two-day deadline compared with a five-day replacement','两天期限与五天换货的冲突'])}">
      <div class="sf-headphone"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6" aria-hidden="true"><path d="M18 58V45a32 32 0 0 1 64 0v13"/><rect x="13" y="50" width="18" height="32" rx="8"/><rect x="69" y="50" width="18" height="32" rx="8"/><path d="M75 82 62 87" stroke-width="3"/></svg><span class="sf-defect">!</span></div>
      <div class="sf-time-comparison"><div><strong>${person==='elysia'?'2':person==='furina'?'7':'30'}<span>${t(['days','天'])}</span></strong><small>${t(person==='elysia'?['My deadline','我的期限']:person==='furina'?['Can wait','可以等待']:['Return policy','退货期限'])}</small></div><span class="sf-not-equal">${person==='elysia'?'≠':person==='furina'?'≥':'↔'}</span><div><strong>${person==='motong'?t(['Refund','退款']):'5'}${person==='motong'?'':`<span>${t(['days','天'])}</span>`}</strong><small>${t(person==='motong'?['My preference','我的诉求']:['Replacement','换货送达'])}</small></div></div>
      <span class="sf-stage-label">${t(['A policy is not a solution for everyone.','相同的政策，未必满足每个人的诉求。'])}</span></div>`;
    return `<div class="sf-illustration sf-bargain" aria-label="${t(['Two offers compared against the buyer’s budget and priorities','两种报价与买家的预算、偏好对比'])}">
      <div class="sf-budget"><span>${t(['TOTAL BUDGET','总预算'])}</span><b>¥${person==='motong'?'650':person==='elysia'?'760':'740'}</b></div>
      <div class="sf-offers"><div class="sf-offer sf-offer-today ${person==='elysia'?'sf-offer-chosen':''}"><small>${t(['TODAY','今天'])}</small><strong>¥640</strong><span><i>×</i> ${t(['No inspection','不能验车'])}</span></div><div class="sf-offer sf-offer-tomorrow ${person!=='elysia'?'sf-offer-chosen':''}"><small>${t(['TOMORROW','明天'])}</small><strong>¥650</strong><span><i>✓</i> ${t(['Inspect first','先验车'])}</span></div></div>
      <span class="sf-stage-label">${t(['Bike + ¥40 service. More than the price.','车价 + 40元保养。考量不止价格。'])}</span></div>`;
  }
  function observations(id) {
    const s = sceneConfig(id);
    return `<div class="sf-model-signals"><div class="sf-signal-ours"><span><img src="${page ? '../' : ''}assets/capybara.svg" alt="">Socio-Foundation</span><b>${t(s.observations.socio)}</b></div><div><span>Qwen3-8B</span><b>${t(s.observations.qwen3)}</b></div><div><span>GPT-5.5</span><b>${t(s.observations.gpt55)}</b></div></div>`;
  }
  function renderCards() {
    document.querySelectorAll('[data-showcase]').forEach(grid => {
      const detailed = grid.dataset.showcase === 'detail', root = grid.dataset.root || '';
      grid.innerHTML = Object.keys(scenes).map(id => {const s=sceneConfig(id);return `<article class="sf-scene sf-${id}" id="${detailed ? id : 'preview-'+id}">
        <div class="sf-scene-heading"><span>${s.number} / ${t(s.category)}</span><span class="sf-scene-dot" aria-hidden="true">↗</span></div>
        <h3>${t(s.title)}</h3>${illustration(id)}
        <div class="sf-scene-copy"><p>${t(s.description)}</p><div class="sf-trait-tags">${s.traits.map(x=>`<span>${t(x)}</span>`).join('')}</div></div>
        <div class="sf-comparison-label">${people[activePerson(id)]} · ${t(['CASE OBSERVATIONS','案例差异'])}</div>${observations(id)}
        ${detailed ? `<details class="sf-dialogue" data-scene="${id}" ${states[id].open ? 'open' : ''}><summary><span>${t(['View dialogue & model outputs','展开对话与模型输出'])}</span><span class="sf-expand" aria-hidden="true">+</span></summary><div class="sf-dialogue-content"></div></details>` : `<a class="sf-scene-link" href="${root}index.html?v=20261013-showcase#${id}">${t(['Explore this application','探索这个应用'])}<span>↗</span></a>`}
      </article>`;}).join('');
    });
    document.querySelectorAll('.sf-dialogue').forEach(details => {
      const id = details.dataset.scene;
      details.addEventListener('toggle', () => {states[id].open = details.open; if (details.open && !details.querySelector('.sf-dialogue-content').children.length) renderDialogue(id);});
      if (details.open) renderDialogue(id);
    });
  }
  function renderDialogue(id) {
    const state = states[id], c = window.SF_DEMO_DATA.cases.find(c => c.id === id + '_' + state.person);
    const s = scenes[id], root = $(`.sf-dialogue[data-scene="${id}"] .sf-dialogue-content`), models = window.SF_DEMO_DATA.models;
    root.innerHTML = `<label class="sf-person-selector">${t(['SIMULATED PERSON','模拟人物'])}<select aria-label="${t(['Choose the person for '+s.category[0],'选择'+s.category[1]+'的人物'])}">${Object.entries(people).map(([key,name])=>`<option value="${key}" ${key === state.person ? 'selected' : ''}>${name}</option>`).join('')}</select></label>
      <div class="sf-setup"><span>${t(['STARTING PROFILE','初始人物设定'])}</span><p>${esc(t(profiles[c.id]))}</p><details class="sf-private-profile"><summary>${t(['Full profile','完整设定'])}</summary><p>${esc(c.context)}</p><p>${esc(c.profile)}</p></details></div>
      <div class="sf-round-label"><span>${t(['CONVERSATION ROUND','对话轮次'])}</span><small>${state.round + 1} / 5</small></div><div class="sf-rounds" role="group" aria-label="${t(['Conversation round','对话轮次'])}">${[0,1,2,3,4].map(n=>`<button type="button" data-round="${n}" aria-pressed="${n === state.round}">${n+1}</button>`).join('')}</div>
      <div class="sf-counterpart"><span>${t(s.speaker)}</span><p>${esc(c.models.socio.turns[state.round].counterpart)}</p></div><p class="sf-original-language">${t(['Original English dialogue','英文对话原文'])}</p>
      ${models.map(m=>`<div class="sf-output ${m.id === 'socio' ? 'ours' : ''}"><h4>${esc(m.name)}</h4><p class="sf-output-reply">${esc(c.models[m.id].turns[state.round].response)}</p><details class="sf-output-note"><summary>${t(['Conversation notes','对话表现标签的依据'])}</summary><p>${esc(c.review.model_notes[m.id][lang()])}</p></details></div>`).join('')}`;
    $('select',root).addEventListener('change',ev=>{state.person=ev.target.value;renderCards();updateMotion();});
    root.querySelectorAll('[data-round]').forEach(button=>button.addEventListener('click',()=>{state.round=Number(button.dataset.round);renderDialogue(id);}));
  }
  function applyLanguage() {
    if (page) {
      document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
      document.querySelectorAll('[data-en][data-zh]').forEach(el=>{el.innerHTML = el.dataset[language];});
      document.title = t(['Applications · Socio-Foundation','应用场景 · Socio-Foundation']);
      $('#sf-language').textContent = language === 'en' ? '中 / EN' : 'EN / 中';
      $('#sf-language').setAttribute('aria-label', language === 'en' ? '切换至中文' : 'Switch to English');
    }
    renderCards();renderVideoLibrary();updateMotion();
  }
  function loadVideos(library) {
    library.querySelectorAll('video').forEach(video=>{
      if(!video.getAttribute('src')){video.src=video.dataset.src;video.poster=video.dataset.poster;video.preload='metadata';video.load();}
    });
  }
  function renderVideoLibrary() {
    document.querySelectorAll('.sf-video-library').forEach(library=>{
      const mediaRoot=library.dataset.mediaRoot || '', key=lang();
      if(!library.children.length){
        library.innerHTML='<div class="sf-video-header"><span class="sf-video-play" aria-hidden="true">▶</span><h3 class="sf-video-heading"></h3><span class="sf-video-hint"></span></div><div class="sf-video-grid"></div>';
      }
      $('.sf-video-heading',library).textContent=t(['Watch the application films','观看应用视频 Demo']);
      $('.sf-video-hint',library).textContent=t(['20-second scene films','每段约20秒']);
      library.setAttribute('aria-label',t(['Application films','应用场景视频']));
      if(library.dataset.language!==key){
        library.dataset.language=key;
        $('.sf-video-grid',library).innerHTML=Object.keys(scenes).map(id=>{
          const base=mediaRoot+id+'-'+key;
          return `<figure><figcaption><span>${t(scenes[id].category)}</span><a href="${base}.mp4" download aria-label="${t(['Download '+scenes[id].category[0]+' video','下载'+scenes[id].category[1]+'视频'])}">${t(['Download ↓','下载 ↓'])}</a></figcaption><video controls playsinline preload="none" data-src="${base}.mp4" data-poster="${base}.jpg" aria-label="${t([scenes[id].category[0]+' application film',scenes[id].category[1]+'场景视频'])}"></video></figure>`;
        }).join('');
      }
      loadVideos(library);
    });
  }
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateMotion() {
    document.querySelectorAll('[data-showcase]').forEach(el=>el.classList.toggle('sf-motion-paused', paused));
    const button=$('#sf-motion'); if (button) {button.textContent=t(paused ? ['Play motion ▷','播放动画 ▷'] : ['Pause motion Ⅱ','暂停动画 Ⅱ']);button.setAttribute('aria-pressed',String(paused));}
  }
  if (page) {
    $('#sf-language').addEventListener('click',()=>{language=language==='en'?'zh':'en';try{localStorage.setItem('sf-language',language);}catch{}applyLanguage();});
    $('#sf-motion').addEventListener('click',()=>{paused=!paused;updateMotion();});
    $('#sf-close-all').addEventListener('click',()=>document.querySelectorAll('.sf-dialogue').forEach(el=>{el.open=false;}));
  } else window.SF_I18N?.onChange(applyLanguage);
  applyLanguage();
})();
