(() => {
  let state = null;
  let receivedAt = 0;
  let startPending = null;
  let refreshing = null;
  const now = () => state ? state.serverTime + performance.now() - receivedAt : Date.now();
  const notify = () => document.dispatchEvent(new Event('lec-offer-change'));

  function accept(offer) {
    if (!offer || !Number.isFinite(offer.serverTime)) throw new Error('Invalid offer');
    state = offer;
    receivedAt = performance.now();
    notify();
    return snapshot();
  }

  function snapshot() {
    if (!state) return null;
    return { ...state, status: state.expiresAt && now() >= state.expiresAt ? 'expired' : state.status };
  }

  async function request(path, body) {
    const response = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
    if (!response.ok) { const error = new Error('Không kết nối được với LEC.'); error.status = response.status; throw error; }
    const data = await response.json();
    accept(data.offer);
    return data;
  }

  function refresh() {
    if (!refreshing) refreshing = request('/api/lec/offer').finally(() => { refreshing = null; });
    return refreshing;
  }

  const ready = refresh();
  ready.catch(() => {});
  window.lecOffer = {
    ready,
    refresh,
    current: snapshot,
    now,
    accept,
    async start() {
      await refresh();
      if (snapshot()?.startedAt) return snapshot();
      if (!startPending) startPending = request('/api/lec/offer/start', {}).then(data => data.offer).finally(() => { startPending = null; });
      return startPending;
    },
    async order(data) {
      await refresh();
      return (await request('/api/lec/orders', data)).order;
    },
  };
  setInterval(() => { if (state?.startedAt) notify(); }, 1000);
  window.addEventListener('focus', () => refresh().catch(() => {}));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refresh().catch(() => {});
  });
})();
