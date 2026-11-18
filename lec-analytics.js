(() => {
  const params = new URLSearchParams(location.search);
  const clean = (value, limit) => (value || '').trim().slice(0, limit);
  let referrer = '';
  try { referrer = new URL(document.referrer).hostname; } catch {}
  const attribution = {
    source: clean(params.get('utm_source'), 100),
    medium: clean(params.get('utm_medium'), 100),
    campaign: clean(params.get('utm_campaign'), 150),
    referrer,
    click: params.has('ttclid') ? 'tiktok' : params.has('fbclid') ? 'facebook' : params.has('gclid') ? 'google' : '',
  };
  const hosts = ['dangkyhoc.lucinaenglishclass.com', 'lec-giao-tiep.ntn-nhung208.chatgpt.site'];
  if (hosts.includes(referrer)) attribution.referrer = '';
  const visit = { ...attribution, id: crypto.randomUUID() };
  const post = (path, body) => fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  });
  window.lecAnalytics = {
    async register(lead, id) {
      await window.lecOffer.refresh();
      const response = await post('/api/lec/leads', { ...lead, id, visit });
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      window.lecOffer.accept(data.offer);
      return data;
    },
  };
  post('/api/lec/visits', visit).catch(() => {});
})();
