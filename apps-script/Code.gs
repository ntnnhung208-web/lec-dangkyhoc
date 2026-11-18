/** LEC · dangkyhoc.lucinaenglishclass.com — máy chủ đăng ký + trang quản trị (Apps Script)
 *  2 bản triển khai cùng mã:
 *   - "Bất kỳ ai"   → API công khai cho trang đăng ký (doPost)
 *   - "Chỉ mình tôi" → trang quản trị (doGet), chỉ chủ tài khoản mở được
 */
const SHEET_ID = '12WhYXo8Z088C8ZOh-6AUxlTW2eiEwv2uhI88GyjUrIA';
const OWNER = 'ntn.nhung208@gmail.com';
const OFFER_MS = 48 * 3600 * 1000, PAY_MS = 15 * 60 * 1000;
const PRICES = {"3": {"1-6": [3990000, 2899000], "1-2": [5990000, 4899000], "1-1": [9990000, 8899000]}, "6": {"1-6": [7980000, 5680000], "1-2": [11980000, 9680000], "1-1": [19980000, 17680000]}};
const P48 = {"3": {"1-6": 2599000, "1-2": 4599000, "1-1": 8599000}, "6": {"1-6": 4490000, "1-2": 8190000, "1-1": 15990000}};
const STATUSES = ['Mới đăng ký','Đã liên hệ','Đã thanh toán','Đang học','Dừng học','Đã hủy'];

const SH = {
  leads:  ['Đăng ký', ['id','vid','createdAt','mode','name','phone','email','course','source','medium','campaign','referrer','click','orderCode','amount','discounted','orderAt','status','note','updatedAt']],
  orders: ['Mã thanh toán', ['id','leadId','code','createdAt','pkg','cls','amount','discounted','expiresAt']],
  visits: ['Lượt truy cập', ['id','day','source','medium','campaign','referrer','click','createdAt']],
  offers: ['Ưu đãi 48h', ['vid','startedAt']],
};

function ss_(){ return SpreadsheetApp.openById(SHEET_ID); }
function sh_(key){
  const [name, cols] = SH[key];
  let s = ss_().getSheetByName(name);
  if (!s){ s = ss_().insertSheet(name); s.getRange(1, 1, 1, cols.length).setValues([cols]); s.setFrozenRows(1); }
  s.getRange(1, 1, s.getMaxRows(), cols.length).setNumberFormat('@');
  return s;
}
function out_(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function now_(){ return Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', "yyyy-MM-dd'T'HH:mm:ss"); }
function today_(){ return Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'); }
function str_(v, n){ return String(v == null ? '' : v).slice(0, n || 300); }
function rows_(key){
  const s = sh_(key), cols = SH[key][1], v = s.getDataRange().getValues(); v.shift();
  return v.map((r, i) => { const o = {_row: i + 2}; cols.forEach((c, j) => o[c] = r[j] instanceof Date ? Utilities.formatDate(r[j], 'Asia/Ho_Chi_Minh', "yyyy-MM-dd'T'HH:mm:ss") : String(r[j])); return o; });
}
function add_(key, obj){
  const s = sh_(key), cols = SH[key][1];
  if (s.getLastRow() >= s.getMaxRows()) s.insertRowsAfter(s.getMaxRows(), 100);
  s.getRange(s.getLastRow() + 1, 1, 1, cols.length).setNumberFormat('@').setValues([cols.map(c => str_(obj[c], 2000))]);
}
function set_(key, row, field, val){ sh_(key).getRange(row, SH[key][1].indexOf(field) + 1).setValue(str_(val, 2000)); }

/* ---------- ưu đãi 48h theo từng khách (vid lưu ở trình duyệt) ---------- */
function offerOf_(vid, start){
  let startedAt = null;
  if (vid){
    const r = rows_('offers').find(x => x.vid === vid);
    if (r) startedAt = Number(r.startedAt);
    else if (start){ startedAt = Date.now(); add_('offers', {vid, startedAt}); }
  }
  const t = Date.now(), expiresAt = startedAt ? startedAt + OFFER_MS : null;
  return {startedAt, expiresAt, serverTime: t, status: !startedAt ? 'not_started' : (t >= expiresAt ? 'expired' : 'active')};
}
function src_(v){
  v = v || {};
  return str_(v.source, 100) || str_(v.click, 40) || (v.referrer ? String(v.referrer).replace(/^www\./, '') : '');
}

/* ---------- API công khai ---------- */
function doPost(e){
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents || '{}'), a = b.action, vid = str_(b.vid, 64);
    if (a === 'offer') return out_({ok: true, offer: offerOf_(vid, false)});
    if (a === 'offer/start') return out_({ok: true, offer: offerOf_(vid, true)});
    if (a === 'visits'){
      const id = str_(b.id, 64), day = today_(), v = b;
      if (id && !rows_('visits').some(r => r.id === id && r.day === day))
        add_('visits', {id, day, source: src_(v), medium: v.medium, campaign: v.campaign, referrer: v.referrer, click: v.click, createdAt: now_()});
      return out_({ok: true});
    }
    if (a === 'leads'){
      const name = str_(b.name, 120).trim(), phone = str_(b.phone, 40).trim();
      if (!b.id || !name || !phone) return out_({ok: false, error: 'Thiếu họ tên hoặc số điện thoại.'});
      const offer = offerOf_(vid, true), v = b.visit || {};
      const ex = rows_('leads').find(r => r.id === b.id);
      if (!ex) add_('leads', {id: b.id, vid, createdAt: now_(), mode: b.mode, name, phone, email: b.email, course: b.course,
        source: src_(v), medium: v.medium, campaign: v.campaign, referrer: v.referrer, click: v.click, status: 'Mới đăng ký', updatedAt: now_()});
      return out_({ok: true, offer});
    }
    if (a === 'orders'){
      const lead = rows_('leads').find(r => r.id === b.leadId);
      if (!lead) return out_({ok: false, error: 'Không tìm thấy đăng ký.'});
      const pkg = String(b.pkg), cls = String(b.cls);
      if (!PRICES[pkg] || !PRICES[pkg][cls]) return out_({ok: false, error: 'Gói học không hợp lệ.'});
      const offer = offerOf_(vid || lead.vid, false), discounted = offer.status !== 'expired';
      const amount = discounted ? P48[pkg][cls] : PRICES[pkg][cls][1];
      const code = 'LEC' + Utilities.getUuid().replace(/-/g, '').slice(0, 6).toUpperCase();
      const expiresAt = Date.now() + PAY_MS;
      add_('orders', {id: str_(b.id, 64), leadId: lead.id, code, createdAt: now_(), pkg, cls, amount, discounted, expiresAt});
      set_('leads', lead._row, 'orderCode', code); set_('leads', lead._row, 'amount', amount);
      set_('leads', lead._row, 'discounted', discounted ? 'Có' : ''); set_('leads', lead._row, 'orderAt', now_());
      return out_({ok: true, offer, order: {code, amount, discounted, expiresAt}});
    }
    return out_({ok: false, error: 'Yêu cầu không hợp lệ.'});
  } catch (err) {
    return out_({ok: false, error: 'Lỗi máy chủ: ' + err.message});
  } finally { lock.releaseLock(); }
}

/* ---------- Trang quản trị (chỉ chủ tài khoản) ---------- */
function scopeHint_(){ return Session.getEffectiveUser().getEmail(); } // chỉ để Google cấp quyền đọc email
function isOwner_(){ return String(Session.getActiveUser().getEmail() || '').toLowerCase() === OWNER; }
function doGet(){
  if (!isOwner_()) return out_({ok: true, service: 'lec-dangkyhoc'});
  const html = Utilities.newBlob(Utilities.base64Decode(HTML_B64)).getDataAsString('UTF-8');
  return HtmlService.createHtmlOutput(html).setTitle('Quản trị · LEC đăng ký học').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
function api(action, b){
  if (!isOwner_()) return {ok: false, error: 'Tài khoản này không có quyền.'};
  b = b || {};
  if (action === 'list') return {ok: true, statuses: STATUSES,
    regs: rows_('leads').map(r => { delete r.vid; return r; }),
    visits: rows_('visits').map(r => ({day: String(r.day).slice(0, 10), source: r.source}))};
  if (action === 'update'){
    const lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      const r = rows_('leads').find(x => x.id === b.id);
      if (!r) return {ok: false, error: 'Không tìm thấy khách.'};
      ['name','phone','email','course','status','note'].forEach(c => { if (b.fields && c in b.fields) set_('leads', r._row, c, b.fields[c]); });
      set_('leads', r._row, 'updatedAt', now_());
      return {ok: true};
    } finally { lock.releaseLock(); }
  }
  if (action === 'import'){
    const lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      const have = new Set(rows_('leads').map(r => r.name + '|' + r.phone + '|' + r.createdAt)); let n = 0;
      (b.rows || []).forEach(r => { const k = r.name + '|' + r.phone + '|' + r.createdAt; if (!r.name || have.has(k)) return;
        add_('leads', Object.assign({id: Utilities.getUuid(), status: 'Mới đăng ký', updatedAt: now_()}, r)); have.add(k); n++; });
      return {ok: true, imported: n};
    } finally { lock.releaseLock(); }
  }
  return {ok: false, error: 'Yêu cầu không hợp lệ.'};
}
