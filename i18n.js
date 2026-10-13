(() => {
  const dictionary = window.SF_TRANSLATIONS;
  let lang = 'en';
  try { const saved = localStorage.getItem('sf-language'); if (saved === 'zh' || saved === 'en') lang = saved; } catch {}
  const reverse = new Map(Object.entries(dictionary).map(([zh,en]) => [en.trim(),zh]));
  const registry = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node=walker.currentNode;
    if(node.parentElement.closest('script,style,pre,[data-dynamic]')) continue;
    const value=node.textContent.trim(), key=dictionary[value]?value:reverse.get(value);
    if(key) registry.push({node,key,before:node.textContent.match(/^\s*/)[0],after:node.textContent.match(/\s*$/)[0]});
  }
  const attrs=[];
  document.querySelectorAll('[aria-label],[alt],[placeholder],[title]').forEach(node=>{
    ['aria-label','alt','placeholder','title'].forEach(attr=>{const value=node.getAttribute(attr),key=dictionary[value]?value:reverse.get(value);if(key)attrs.push({node,attr,key});});
  });
  const listeners=[];
  const t=(zh,en)=>lang==='zh'?zh:(en||dictionary[zh]||zh);
  function apply(){
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    registry.forEach(({node,key,before,after})=>node.textContent=before+t(key)+after);
    attrs.forEach(({node,attr,key})=>node.setAttribute(attr,t(key)));
    document.querySelectorAll('[data-zh][data-en]').forEach(node=>node.textContent=node.dataset[lang]);
    document.title=document.body.classList.contains('leaderboard-page')?t('IndiEval 排行榜 · Socio-Foundation','IndiEval Leaderboard · Socio-Foundation'):t('Socio-Foundation — 在变化的情境中，保留每个人的不同','Socio-Foundation — Preserving individuality');
    document.querySelectorAll('.language-switch').forEach(b=>{b.textContent=lang==='en'?'中 / EN':'EN / 中';b.setAttribute('aria-label',lang==='en'?'切换至中文':'Switch to English');});
    listeners.forEach(fn=>fn());
  }
  document.querySelectorAll('.language-switch').forEach(b=>b.addEventListener('click',()=>{lang=lang==='en'?'zh':'en';try{localStorage.setItem('sf-language',lang)}catch{}apply();}));
  window.SF_I18N={t,get lang(){return lang},onChange(fn){listeners.push(fn)}};
  apply();
})();
