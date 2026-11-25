/* CEKUP-GAJI v3.2.0 · build 7aad5d58e8 — dibangkitkan oleh build.py dari src/js/*.js */
'use strict';

const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

const BOOT = (() => {
  let b = {}; try { b = JSON.parse(localStorage.getItem('pg:boot') || '{}') || {}; } catch (e) { }
  return Object.assign({ appName: 'CEKUP-GAJI', instansi: 'Dinas Kesehatan Kabupaten Minahasa Selatan', versi: '3.0.0', siap: true }, b);
})();
const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v) => String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, (c) => ESC_MAP[c]);
const ic = (n, cls) => `<span class="ms ${cls || ''}" aria-hidden="true">${n}</span>`;
const BLN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const BLS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const RE_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 10);
const pad2 = (n) => String(n).padStart(2, '0');
const todayYmd = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const ymdOf = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
function fmtTgl(s, short) { const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return s ? esc(s) : '—'; return `${+m[3]} ${(short ? BLS : BLN)[+m[2] - 1]} ${m[1]}`; }
function fmtWaktu(s) { const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/); return m ? `${+m[3]} ${BLS[+m[2] - 1]} ${m[1]}, ${m[4]}.${m[5]}` : fmtTgl(s, true); }
function relWaktu(s) {
  const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/); if (!m) return '';
  const d = new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)); const diff = (Date.now() - d) / 60000;
  if (diff < 1) return 'baru saja'; if (diff < 60) return Math.round(diff) + ' menit lalu'; if (diff < 1440) return Math.round(diff / 60) + ' jam lalu';
  if (diff < 2880) return 'kemarin'; if (diff < 10080) return Math.round(diff / 1440) + ' hari lalu'; return fmtTgl(s, true);
}
const fmtRp = (v) => (v === '' || v === null || v === undefined || isNaN(+v)) ? '—' : 'Rp ' + Math.round(+v).toLocaleString('id-ID');
const fmtNum = (v) => (+v || 0).toLocaleString('id-ID');
function fmtNip(n) { n = String(n || ''); return n.length === 18 ? `${n.slice(0, 8)} ${n.slice(8, 14)} ${n.slice(14, 15)} ${n.slice(15)}` : n; }
function periodeLabel(p) { const m = String(p || '').match(/^(\d{4})-(\d{2})/); return m ? `${BLN[+m[2] - 1]} ${m[1]}` : p; }
function usia(tgl) { const m = String(tgl || '').match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return null; const n = new Date(); let a = n.getFullYear() - m[1]; if (n.getMonth() + 1 < +m[2] || (n.getMonth() + 1 === +m[2] && n.getDate() < +m[3])) a--; return a; }
function hariSejak(iso) { const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return 0; const a = new Date(+m[1], +m[2] - 1, +m[3]); const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((t - a) / 864e5); }
function nowIsoLocal() { const d = new Date(); return `${ymdOf(d)}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`; }
function hashStr(s) { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
function initials(n) {
  const w = String(n || '?').replace(/,.*$/, '').replace(/^(dr|drg|ns|bdn|dra|drs|apt|ir|hj|h)\.?\s+/i, '').trim().split(/\s+/).filter(Boolean);
  return ((w[0] || '?')[0] + (w[1] ? w[1][0] : '')).toUpperCase();
}
const avCls = (s) => 'c' + (1 + (hashStr(s) % 6));
const avatar = (nama, size) => `<span class="av ${size || 'sm'} ${avCls(nama)}" aria-hidden="true">${esc(initials(nama))}</span>`;
const digits = (v) => String(v || '').replace(/\D/g, '');
const parseRp = (v) => { const s = String(v === null || v === undefined ? '' : v).replace(/[^\d,-]/g, '').replace(',', '.'); return s === '' ? '' : Number(s); };
function debounce(fn, ms) { let t; return function () { const a = arguments; clearTimeout(t); t = setTimeout(() => fn.apply(this, a), ms); }; }
function salam() { const h = new Date().getHours(); return h < 11 ? 'Selamat Pagi' : h < 15 ? 'Selamat Siang' : h < 18 ? 'Selamat Sore' : 'Selamat Malam'; }
const JENIS_LABEL = { DATA_DIRI: 'Data Diri', KELUARGA: 'Tunjangan Keluarga', PANGKAT: 'Pangkat/Golongan', JABATAN: 'Jabatan', KGB: 'Masa Kerja/KGB', UNIT: 'Unit Kerja', CUTI: 'Riwayat Cuti' };
const JENIS_IC = { DATA_DIRI: 'badge', KELUARGA: 'family_restroom', PANGKAT: 'military_tech', JABATAN: 'work', KGB: 'schedule', UNIT: 'domain', CUTI: 'event_busy' };
const ROLE_LABEL = { SUPERADMIN: 'Superadmin', ADMIN_UNIT: 'Admin Unit', PEGAWAI: 'Pegawai' };
class AppErr extends Error { constructor(m, c) { super(m); this.code = c || 'ERR'; } }

const Store = (() => {
  const probe = (k) => { try { const s = window[k]; s.setItem('__p', '1'); s.removeItem('__p'); return s; } catch (e) { return null; } };
  const ls = probe('localStorage'), ss = probe('sessionStorage'), mem = {};
  return {
    get(k) { try { const v = (ss && ss.getItem(k)) || (ls && ls.getItem(k)) || mem[k]; return v === undefined ? null : v; } catch (e) { return mem[k] || null; } },
    set(k, v, persist) { try { (persist ? ls : ss || ls).setItem(k, v); } catch (e) { mem[k] = v; } },
    pref(k, v) { try { if (v === undefined) return ls ? ls.getItem(k) : mem[k]; ls ? ls.setItem(k, v) : (mem[k] = v); } catch (e) { mem[k] = v; } },
    del(k) { try { ls && ls.removeItem(k); ss && ss.removeItem(k); } catch (e) { } delete mem[k]; }
  };
})();

const API = {
  url: (typeof GAS_URL === 'string' ? GAS_URL : '').trim(),
  get ok() { return /^https?:\x2F\x2F.+/i.test(this.url) && !/XXXX|GANTI|PASTE/i.test(this.url); },
  READ: /^(bootstrap|poll|dashboard|notif\.list|profil\.get|pegawai\.(index|list|detail)|pengajuan\.(list|detail)|persetujuan\.antrean|gaji\.(periode|get|rekap)|kelola\.akun|config\.get|laporan\.data|dokumen\.get|crm\.(list|interaksi)|blast\.(list|hitung)|antrian\.list|notif\.config|rahasia\.status|pantau\.(ringkas|audit|arsipDaftar|arsipPratinjau))$/,
  NOBATCH: /^(bootstrap|dokumen\.get|laporan\.data|crm\.list)$/,
  inflight: new Map(), epoch: 0, q: [], qT: null, stat: [],
  async post(body, opt) {
    opt = opt || {};
    if (!API.ok) throw new AppErr('Alamat server (GAS_URL) belum diatur. Isi js/config.js dengan URL Web App Apps Script yang berakhiran /exec.', 'CONFIG');
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null, t0 = performance.now();
    const to = setTimeout(() => ctl && ctl.abort(), opt.timeout || 60000);
    try {
      const r = await fetch(API.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body), redirect: 'follow', cache: 'no-store', credentials: 'omit', signal: ctl ? ctl.signal : undefined });
      if (!r.ok) throw new AppErr('Server merespons HTTP ' + r.status + '. Coba lagi beberapa saat.', 'NET');
      let j; try { j = await r.json(); } catch (e) { throw new AppErr('Respons server tidak valid. Pastikan Web App di-deploy dengan akses "Anyone" dan URL /exec benar.', 'SERVER'); }
      API.catat(body.action, j && j.ms, performance.now() - t0);
      return j;
    } catch (e) {
      if (e instanceof AppErr) throw e;
      if (e && e.name === 'AbortError') throw new AppErr('Server terlalu lama merespons. Periksa koneksi lalu coba lagi.', 'TIMEOUT');
      throw new AppErr(navigator.onLine === false ? 'Anda sedang offline. Periksa koneksi internet lalu coba lagi.' : 'Koneksi ke server terputus. Periksa internet Anda lalu coba lagi.', 'NET');
    } finally { clearTimeout(to); }
  },

  catat(a, ms, total) { API.stat.push({ a, ms: +ms || 0, t: Math.round(total) }); if (API.stat.length > 50) API.stat.shift(); },
  ringkas() { const s = API.stat; if (!s.length) return null; const avg = (k) => Math.round(s.reduce((x, y) => x + y[k], 0) / s.length); return { n: s.length, server: avg('ms'), total: avg('t') }; },

  async info() {
    if (!API.ok) throw new AppErr('GAS_URL belum diatur.', 'CONFIG');
    const r = await fetch(API.url + (API.url.indexOf('?') < 0 ? '?' : '&') + 'action=info', { cache: 'no-store', credentials: 'omit', redirect: 'follow' });
    const j = await r.json(); if (!j.success) throw new AppErr(j.message, j.code); return j.data;
  },

  raw(fn, ...a) {
    if (fn === 'login') return API.post({ action: 'login', username: a[0], password: a[1], remember: !!a[2] }, { timeout: 45000 });
    if (fn === 'api') return API.post({ action: a[0], token: a[1], payload: a[2] || {} });
    return Promise.reject(new AppErr('Fungsi tidak dikenal: ' + fn, 'NOT_FOUND'));
  },
  unwrap(res) {
    if (!res) throw new AppErr('Respons server kosong.', 'SERVER');
    if (!res.success) { if (res.code === 'SESSION') Auth.expired(res.message); throw new AppErr(res.message, res.code); }
    return res.data;
  },

  call(action, payload, opt) {
    opt = opt || {};
    if (!API.READ.test(action)) { API.epoch++; API.inflight.clear(); return API.run(action, payload, opt); }
    const key = API.epoch + '|' + action + '|' + JSON.stringify(payload || {});
    if (API.inflight.has(key)) return API.inflight.get(key);
    const p = (opt.nobatch || API.NOBATCH.test(action)) ? API.run(action, payload, opt) : API.antre(action, payload, opt);
    API.inflight.set(key, p);
    const bersih = () => { if (API.inflight.get(key) === p) API.inflight.delete(key); };
    p.then(bersih, bersih);
    return p;
  },
  async run(action, payload, opt) {
    opt = opt || {};
    for (let i = 0; ; i++) {
      try { return API.unwrap(await API.post({ action, token: S.token, payload: payload || {} }, opt)); }
      catch (e) { if (i < (opt.retry || 0) && /NET|TIMEOUT/.test(e.code)) { await sleep(600 * (i + 1)); continue; } throw e; }
    }
  },
  antre(action, payload, opt) {
    return new Promise((res, rej) => { API.q.push({ action, payload: payload || {}, opt, res, rej }); if (!API.qT) API.qT = setTimeout(API.flush, 0); });
  },
  async flush() {
    const list = API.q.splice(0); API.qT = null;
    for (let i = 0; i < list.length; i += 12) {
      const grp = list.slice(i, i + 12);
      if (grp.length === 1) { const c = grp[0]; API.run(c.action, c.payload, c.opt).then(c.res, c.rej); continue; }
      API.post({ action: 'batch', token: S.token, payload: { calls: grp.map((c) => ({ action: c.action, payload: c.payload })) } }).then((res) => {
        if (!res || !res.success) { if (res && res.code === 'SESSION') Auth.expired(res.message); const e = new AppErr((res && res.message) || 'Respons server kosong.', (res && res.code) || 'SERVER'); grp.forEach((c) => c.rej(e)); return; }
        grp.forEach((c, k) => { try { c.res(API.unwrap(res.data[k])); } catch (e) { c.rej(e); } });
      }, (e) => grp.forEach((c) => (c.opt && c.opt.retry ? API.run(c.action, c.payload, c.opt).then(c.res, c.rej) : c.rej(e))));
    }
  }
};

const Sync = {
  n: 0,
  run(label, p) {
    this.n++; $('#sync-t').textContent = label || 'Menyimpan…'; $('#sync').classList.remove('hide');
    return Promise.resolve(p).finally(() => { this.n--; if (!this.n) $('#sync').classList.add('hide'); });
  }
};

function toast(type, title, msg, opt) {
  opt = opt || {};
  const icn = { ok: 'check_circle', err: 'error', warn: 'warning', info: 'info' }[type] || 'info';
  const el = document.createElement('div');
  el.className = 'toast ' + type; el.setAttribute('role', type === 'err' ? 'alert' : 'status');
  el.innerHTML = `<div class="ti">${ic(icn)}</div><div class="grow"><b>${esc(title)}</b>${msg ? `<p>${esc(msg)}</p>` : ''}${opt.action ? `<button class="link-btn" style="padding:4px 0">${esc(opt.action.label)}</button>` : ''}</div><button class="tx" aria-label="Tutup">${ic('close', 's18')}</button>`;
  const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 220); };
  el.querySelector('.tx').onclick = close;
  if (opt.action) el.querySelector('.link-btn').onclick = () => { close(); opt.action.fn(); };
  $('#toasts').appendChild(el);
  if ($$('#toasts .toast').length > 4) $('#toasts .toast').remove();
  setTimeout(close, opt.ms || (type === 'err' ? 7000 : 4200));
}
const errToast = (e, judul) => toast('err', judul || 'Gagal', e && e.message ? e.message : String(e));

const Modal = {
  stack: [],
  open(o) {
    const lay = $('#layer');
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const wrap = document.createElement('div'); wrap.className = 'modal'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML = `<div class="modal-box ${o.size || ''}"><div class="modal-h"><h3>${o.title || ''}</h3><button class="icon-btn" data-x aria-label="Tutup">${ic('close')}</button></div><div class="modal-b">${o.body || ''}</div>${o.foot ? `<div class="modal-f">${o.foot}</div>` : ''}</div>`;
    lay.appendChild(scrim); lay.appendChild(wrap);
    const prev = document.activeElement;
    const m = {
      el: wrap, body: wrap.querySelector('.modal-b'), foot: wrap.querySelector('.modal-f'),
      close: () => { if (m.closed) return; m.closed = true; scrim.remove(); wrap.remove(); Modal.stack = Modal.stack.filter((x) => x !== m); if (o.onClose) o.onClose(); try { prev && prev.focus(); } catch (e) { } }
    };
    wrap.addEventListener('mousedown', (e) => { if (e.target === wrap && !o.static) m.close(); });
    wrap.querySelector('[data-x]').onclick = m.close;
    Modal.stack.push(m);
    setTimeout(() => { const f = wrap.querySelector('[autofocus], input:not([type=hidden]):not([disabled]), select, textarea, .btn-primary'); if (f) f.focus(); }, 30);
    return m;
  },
  closeTop() { const m = Modal.stack[Modal.stack.length - 1]; if (m) { m.close(); return true; } return false; },

  confirm(o) {
    return new Promise((res) => {
      const inp = o.input ? `<div class="field mt-12"><label>${esc(o.input.label)}${o.input.required ? ' <span class="req">*</span>' : ''}</label>${o.input.area ? `<textarea class="textarea" id="cf-in" placeholder="${esc(o.input.placeholder || '')}" maxlength="500"></textarea>` : `<input class="input" id="cf-in" placeholder="${esc(o.input.placeholder || '')}" autocomplete="off">`}<div class="ferr" id="cf-err" hidden></div></div>` : '';
      let done = false;
      const m = Modal.open({
        title: o.title, size: o.size, static: !!o.input,
        body: `<div class="row top gap-12">${o.icon !== false ? `<div class="card-ic ${o.danger ? 'bad' : ''}" style="width:44px;height:44px">${ic(o.icon || (o.danger ? 'warning' : 'help'))}</div>` : ''}<div class="grow"><div>${o.msg || ''}</div>${inp}</div></div>`,
        foot: `<button class="btn btn-outline" data-no>${esc(o.cancel || 'Batal')}</button><button class="btn ${o.danger ? 'btn-danger' : 'btn-primary'}" data-yes>${esc(o.ok || 'Ya, lanjutkan')}</button>`,
        onClose: () => { if (!done) res(false); }
      });
      m.el.querySelector('[data-no]').onclick = () => m.close();
      m.el.querySelector('[data-yes]').onclick = () => {
        let v = true;
        if (o.input) {
          v = m.el.querySelector('#cf-in').value.trim();
          const er = m.el.querySelector('#cf-err');
          const bad = (o.input.required && !v) ? 'Wajib diisi.' : (o.input.match && v !== o.input.match ? (o.input.matchMsg || 'Tidak cocok.') : '');
          if (bad) { er.hidden = false; er.innerHTML = ic('error', 's14') + esc(bad); m.el.querySelector('#cf-in').focus(); return; }
        }
        done = true; m.close(); res(v);
      };
    });
  }
};
const Drawer = {
  cur: null,
  open(o) {
    this.close();
    const lay = $('#layer');
    const scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.style.zIndex = 94;

    const d = document.createElement('aside'); d.className = 'drawer' + (o.center ? ' center' : ''); d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    const tx = `<button class="icon-btn" data-x aria-label="Tutup">${ic(o.center ? 'close' : 'arrow_back')}</button>`, tj = `<div class="grow"><b style="font-size:15px">${o.title || ''}</b>${o.sub ? `<div class="muted" style="font-size:12px">${o.sub}</div>` : ''}</div>${o.actions || ''}`;
    d.innerHTML = `<div class="drawer-h">${o.center ? tj + tx : tx + tj}</div><div class="drawer-b">${o.body || ''}</div>`;
    lay.appendChild(scrim); lay.appendChild(d);
    const dr = { el: d, body: d.querySelector('.drawer-b'), close: () => { scrim.remove(); d.remove(); if (Drawer.cur === dr) Drawer.cur = null; if (o.onClose) o.onClose(); } };
    scrim.onclick = dr.close; d.querySelector('[data-x]').onclick = dr.close;
    this.cur = dr; return dr;
  },
  close() { if (this.cur) this.cur.close(); }
};
const Pop = {
  cur: null,
  toggle(anchor, html, cls) {
    if (this.cur && this.cur.anchor === anchor) return this.close();
    this.close();
    const p = document.createElement('div'); p.className = 'pop ' + (cls || ''); p.innerHTML = html;
    anchor.parentElement.appendChild(p); this.cur = { el: p, anchor };
    return p;
  },
  close() { if (this.cur) { this.cur.el.remove(); this.cur = null; } }
};
const Tip = {
  el: null,
  show(t, x, y) { const el = this.el || (this.el = $('#tip')); const parts = String(t).split('|'); el.innerHTML = `<b>${esc(parts[0])}</b>${parts.slice(1).map(esc).join('<br>')}`; el.classList.add('on'); const w = el.offsetWidth, h = el.offsetHeight; el.style.left = Math.min(window.innerWidth - w - 8, Math.max(8, x - w / 2)) + 'px'; el.style.top = Math.max(8, y - h - 12) + 'px'; },
  hide() { if (this.el) this.el.classList.remove('on'); }
};

const LIBS = {
  xlsx: ['https:/\/cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'],
  jspdf: ['https:/\/cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'https:/\/cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'],
  pdfjs: ['https:/\/cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js']
};
const libCache = {};
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.async = true; s.onload = res; s.onerror = () => rej(new AppErr('Gagal memuat pustaka. Periksa koneksi internet.')); document.head.appendChild(s); }); }
function loadLib(name) { if (!libCache[name]) libCache[name] = LIBS[name].reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve()).catch((e) => { delete libCache[name]; throw e; }); return libCache[name]; }
function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; a.rel = 'noopener'; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 5000);
}
function b64ToBytes(b64) { const bin = atob(String(b64).split(',').pop()); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }

const FILES = new Map();
function dropzone(key, o) {
  o = o || {};
  const f = FILES.get(key);
  const has = !!f;
  const existing = !has && o.existing ? `<button type="button" class="btn btn-xs btn-soft d-x" data-act="doc" data-id="${esc(o.existing)}" data-t="${esc(o.label)}">${ic('visibility', 's16')}Lihat tersimpan</button>` : '';
  return `<div class="field ${o.span ? 'full' : ''}" data-dropwrap="${esc(key)}" data-existing="${esc(o.existing || '')}">
    <label>${esc(o.label || 'Dokumen PDF')}${o.req ? ' <span class="req">*</span>' : ''}</label>
    <div class="drop ${has ? 'has' : ''}" data-drop="${esc(key)}">
      <div class="d-ic">${ic(has ? 'picture_as_pdf' : 'upload_file')}</div>
      <div class="grow" style="min-width:0">${has ? `<b class="truncate">${esc(f.name)}</b><small>${(f.size / 1024).toFixed(0)} KB · siap diunggah</small>` : `<b>${o.existing ? 'Ganti dokumen (opsional)' : 'Pilih atau seret PDF ke sini'}</b><small>${esc(o.hint || 'Format PDF, maksimal 1 MB')}</small>`}</div>
      ${has ? `<button type="button" class="btn btn-xs btn-ghost d-x" data-act="dropClear" data-k="${esc(key)}" aria-label="Hapus berkas">${ic('close', 's18')}</button>` : existing}
      ${has ? '' : `<input type="file" accept="application/pdf,.pdf" data-file="${esc(key)}" aria-label="${esc(o.label || 'Unggah PDF')}">`}
    </div><div class="ferr" hidden></div></div>`;
}
function setDropFile(key, file) {
  const wrap = document.querySelector(`[data-dropwrap="${CSS.escape(key)}"]`);
  const er = wrap && wrap.querySelector('.ferr');
  if (file) {
    const okType = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    const msg = !okType ? 'Berkas harus berformat PDF.' : (file.size > (S.cfg.maksFile || 1048576) ? `Ukuran ${(file.size / 1048576).toFixed(2)} MB melebihi batas 1 MB.` : '');
    if (msg) { if (er) { er.hidden = false; er.innerHTML = ic('error', 's14') + esc(msg); } toast('warn', 'Berkas ditolak', msg); return; }
    FILES.set(key, file);
  } else FILES.delete(key);
  if (wrap) {
    const lbl = wrap.querySelector('label').textContent.replace(/\s*\*$/, '');
    const req = !!wrap.querySelector('.req');
    wrap.outerHTML = dropzone(key, { label: lbl, req, span: wrap.classList.contains('full'), existing: wrap.dataset.existing || '', hint: wrap.dataset.hint || '' });
  }
}
function clearFiles(prefix) { Array.from(FILES.keys()).forEach((k) => { if (k.indexOf(prefix) === 0) FILES.delete(k); }); }
function readPdf(file) {
  return new Promise((res, rej) => {
    if (!file) return res(null);
    const fr = new FileReader();
    fr.onload = () => res({ name: file.name, size: file.size, data: fr.result });
    fr.onerror = () => rej(new AppErr('Gagal membaca berkas ' + file.name));
    fr.readAsDataURL(file);
  });
}
async function collectDocs(map) { const out = {}; for (const k of Object.keys(map)) { const f = FILES.get(map[k]); if (f) out[k] = await readPdf(f); } return out; }

const DOC_CACHE = {};
async function lihatDokumen(id, judul) {
  if (!id) return toast('info', 'Belum ada dokumen', 'Kategori ini belum memiliki lampiran.');
  const m = Modal.open({ title: `${ic('picture_as_pdf')} ${esc(judul || 'Pratinjau Dokumen')}`, size: 'lg', body: `<div class="pdf-view"><div class="skel" style="width:100%;height:60vh"></div></div>`, foot: `<span class="muted grow" id="pdf-meta" style="font-size:12px"></span><button class="btn btn-outline btn-sm" data-zoom="-1" aria-label="Perkecil">${ic('zoom_out', 's18')}</button><button class="btn btn-outline btn-sm" data-zoom="1" aria-label="Perbesar">${ic('zoom_in', 's18')}</button><button class="btn btn-primary btn-sm" data-dl disabled>${ic('download', 's18')}Unduh</button>` });
  try {
    const d = DOC_CACHE[id] || (DOC_CACHE[id] = await API.call('dokumen.get', { id }, { retry: 1 }));
    if (m.closed) return;
    const bytes = b64ToBytes(d.b64);
    m.el.querySelector('#pdf-meta').textContent = `${d.name} · ${(bytes.length / 1024).toFixed(0)} KB`;
    const dl = m.el.querySelector('[data-dl]'); dl.disabled = false; dl.onclick = () => downloadBlob(new Blob([bytes], { type: d.mime || 'application/pdf' }), d.name || 'dokumen.pdf');
    await renderPdf(m.el.querySelector('.pdf-view'), bytes, m);
  } catch (e) {
    if (DOC_CACHE[id] && !DOC_CACHE[id].b64) delete DOC_CACHE[id];
    m.body.innerHTML = `<div class="empty"><div class="e-ic" style="background:var(--danger-bg);color:var(--danger)">${ic('error')}</div><b>Dokumen tidak dapat ditampilkan</b><p>${esc(e.message)}</p></div>`;
  }
}
async function renderPdf(box, bytes, m) {
  let scale = window.innerWidth < 700 ? 1 : 1.35;
  try {
    await loadLib('pdfjs');
    const lib = window.pdfjsLib;
    if (!lib.GlobalWorkerOptions.workerSrc) {
      const wurl = 'https:/\/cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      try { const txt = await (await fetch(wurl)).text(); lib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([txt], { type: 'text/javascript' })); }
      catch (e) { lib.GlobalWorkerOptions.workerSrc = wurl; }
    }
    const pdf = await lib.getDocument({ data: bytes.slice() }).promise;
    const draw = async () => {
      box.innerHTML = '';
      for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
        const page = await pdf.getPage(i), vp = page.getViewport({ scale: scale * (window.devicePixelRatio > 1 ? 1.5 : 1) });
        const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height; c.style.width = (vp.width / (window.devicePixelRatio > 1 ? 1.5 : 1)) + 'px';
        box.appendChild(c); await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
      }
    };
    await draw();
    m.el.querySelectorAll('[data-zoom]').forEach((b) => { b.onclick = () => { scale = Math.max(.5, Math.min(3, scale + (+b.dataset.zoom) * .25)); draw(); }; });
  } catch (e) {
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    box.innerHTML = `<iframe src="${url}" title="Pratinjau PDF"></iframe>`;
    m.el.querySelectorAll('[data-zoom]').forEach((b) => b.remove());
  }
}

const Theme = {
  get() { return Store.pref('pg:tema') || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang'); },
  set(t, simpanServer) {
    t = t === 'gelap' ? 'gelap' : 'terang';
    document.documentElement.setAttribute('data-theme', t === 'gelap' ? 'dark' : 'light');
    Store.pref('pg:tema', t);
    $$('[data-act="tema"]').forEach((b) => b.classList.toggle('on', b.dataset.v === t));
    const mt = document.querySelector('meta[name=theme-color]'); if (mt) mt.content = '#070A1C';
    const tb = document.getElementById('tema-btn'); if (tb) { tb.querySelector('.ms').textContent = t === 'gelap' ? 'light_mode' : 'dark_mode'; tb.setAttribute('aria-label', t === 'gelap' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'); }
    if (simpanServer && S.token) API.call('tema.set', { tema: t }).catch(() => { });
  }
};

function pager(total, page, size, act) {
  const pages = Math.max(1, Math.ceil(total / size));
  if (total <= size) return `<div class="pager"><span>Menampilkan <b>${fmtNum(total)}</b> data</span></div>`;
  const nums = []; const add = (n) => nums.push(n);
  add(1); for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) add(i); if (pages > 1) add(pages);
  const uniq = [...new Set(nums)].sort((a, b) => a - b);
  let html = '', prev = 0;
  uniq.forEach((n) => { if (n - prev > 1) html += '<span class="faint">…</span>'; html += `<button class="${n === page ? 'on' : ''}" data-act="${act}" data-p="${n}" aria-label="Halaman ${n}">${n}</button>`; prev = n; });
  const a = (page - 1) * size + 1, b = Math.min(total, page * size);
  return `<div class="pager"><span>Menampilkan <b>${fmtNum(a)}–${fmtNum(b)}</b> dari <b>${fmtNum(total)}</b></span><div class="pg"><button data-act="${act}" data-p="${page - 1}" ${page <= 1 ? 'disabled' : ''} aria-label="Sebelumnya">${ic('chevron_left', 's18')}</button>${html}<button data-act="${act}" data-p="${page + 1}" ${page >= pages ? 'disabled' : ''} aria-label="Berikutnya">${ic('chevron_right', 's18')}</button></div></div>`;
}
const emptyBox = (judul, teks, icon, aksi) => `<div class="empty"><div class="e-ic">${ic(icon || 'inbox')}</div><b>${esc(judul)}</b>${teks ? `<p>${esc(teks)}</p>` : ''}${aksi || ''}</div>`;
const skelRows = (n, h) => Array.from({ length: n || 4 }, () => `<div class="skel" style="height:${h || 44}px;margin-bottom:10px"></div>`).join('');

function bStatus(s) {
  const m = { Disetujui: ['b-ok', 'check_circle'], Aktif: ['b-ok', 'check_circle'], Lengkap: ['b-ok', 'check_circle'], Pending: ['b-warn', 'schedule'], 'Belum Lengkap': ['b-warn', 'warning'], Ditolak: ['b-bad', 'cancel'], 'Tidak Aktif': ['b-bad', 'block'], Mengirim: ['b-pri', 'cloud_upload'], Gagal: ['b-bad', 'error'], Pensiun: ['b-mut', 'elderly'], Pindah: ['b-info', 'move_up'], Meninggal: ['b-mut', 'sentiment_sad'] };
  const x = m[s] || ['b-mut', 'info'];
  return `<span class="badge ${x[0]}">${ic(x[1])}${esc(s === 'Mengirim' ? 'Mengirim…' : s)}</span>`;
}

const S = {
  token: null, remember: false, user: null, cfg: {}, master: { unit: [], pangkat: [], jenisCuti: [], keaktifan: [], kategori: [] },
  dash: null, notif: { items: [], unread: 0 }, badge: {}, idx: { mode: 'full', rows: [], total: 0 }, jabatanList: [],
  profil: null, gajiPeriode: [], pengajuan: { mode: 'full', rows: [] }, antrean: null, detail: {}, route: null, params: {}, bootAt: 0
};
const ALL = ['SUPERADMIN', 'ADMIN_UNIT', 'PEGAWAI'], SA = ['SUPERADMIN'], ADM = ['SUPERADMIN', 'ADMIN_UNIT'];
const ROUTES = {
  dashboard: { label: 'Dashboard', icon: 'dashboard', group: 'UTAMA', roles: ALL },
  profil: { label: 'Profil Saya', icon: 'account_circle', group: 'UTAMA', roles: ['PEGAWAI', 'ADMIN_UNIT'], cond: () => !!(S.user && S.user.nip && S.profil) },
  cekgaji: { label: 'Cek Gaji', icon: 'payments', group: 'UTAMA', roles: ['PEGAWAI', 'SUPERADMIN'] },
  ajukan: { label: 'Ajukan Perubahan', icon: 'edit_document', group: 'UTAMA', roles: ['PEGAWAI', 'ADMIN_UNIT'] },
  riwayat: { label: 'Riwayat Pengajuan', icon: 'history', group: 'UTAMA', roles: ALL },
  pegawai: { label: 'Daftar Pegawai', icon: 'badge', group: 'UTAMA', roles: ADM },
  persetujuan: { label: 'Persetujuan', icon: 'verified', group: 'UTAMA', roles: SA, badge: () => S.badge.persetujuan },
  kelola: { label: 'Kelola Pegawai', icon: 'group', group: 'ADMINISTRASI', roles: SA, sub: [['akun', 'Daftar Akun'], ['tambah', 'Tambah Pegawai'], ['import', 'Import Pegawai'], ['admin', 'Akun Admin Unit']] },
  gaji: { label: 'Rincian Gaji', icon: 'receipt_long', group: 'ADMINISTRASI', roles: SA, sub: [['input', 'Input Manual'], ['import', 'Import Gaji']] },
  crm: { label: 'CRM & Blast WA', icon: 'campaign', group: 'ADMINISTRASI', roles: SA, sub: [['kontak', 'Kontak'], ['blast', 'Blast WhatsApp'], ['antrean', 'Antrean Pesan']] },
  pengaturan: { label: 'Pengaturan', icon: 'settings', group: 'ADMINISTRASI', roles: SA, sub: [['umum', 'Umum & Sistem'], ['notifikasi', 'Notifikasi WA & Email'], ['migrasi', 'Migrasi Data']] },
  pantau: { label: 'Pantau Database', icon: 'monitoring', group: 'ADMINISTRASI', roles: SA, sub: [['kapasitas', 'Kapasitas & Limit'], ['audit', 'Audit Log'], ['arsip', 'Arsip Data']] },
  laporan: { label: 'Laporan / Export', icon: 'download', group: 'LAINNYA', roles: ADM },
  password: { label: 'Ubah Password', icon: 'lock_reset', group: 'LAINNYA', roles: ALL },
  bantuan: { label: 'Pusat Bantuan', icon: 'support_agent', group: 'LAINNYA', roles: ALL, ext: true }
};
const PAGES = {};

const BRAND = { nama: 'CEKUP-GAJI', panjang: 'Cek & Update Gaji', tagline: 'Cek Rutin, Update Cepat, Gaji Tepat.' };
const allowed = (r) => { const d = ROUTES[r]; return !!(d && !d.ext && S.user && d.roles.indexOf(S.user.role) >= 0 && (!d.cond || d.cond())); };
const isSA = () => S.user && S.user.role === 'SUPERADMIN';
const isAdm = () => S.user && S.user.role === 'ADMIN_UNIT';
const isPeg = () => S.user && S.user.role === 'PEGAWAI';
const waLink = (teks) => S.cfg.wa || BOOT.wa ? `https:/\/wa.me/${digits(S.cfg.wa || BOOT.wa)}?text=${encodeURIComponent(teks || 'Halo Pusat Bantuan ' + (S.cfg.appName || BRAND.nama) + ', saya membutuhkan bantuan.')}` : '#';

function idxObj(r) { return { NIP: String(r[0]), Nama: r[1], StatusPegawai: r[2], UnitKerja: r[3], Golongan: r[4], Jabatan: r[5], StatusKeaktifan: r[6] || 'Aktif', Lengkap: +r[7] === 1, KategoriKosong: r[8] || '', JenisKelamin: r[9] || '', Pangkat: r[10] || '' }; }

function filterPegawai(rows, f) {
  f = f || {};
  const q = String(f.q || '').toLowerCase().trim(), qd = digits(f.q);
  return rows.filter((p) => {
    if (q && !((qd.length >= 3 && p.NIP.indexOf(qd) >= 0) || String(p.Nama).toLowerCase().indexOf(q) >= 0)) return false;
    if (f.unit && p.UnitKerja !== f.unit) return false;
    if (f.status && p.StatusPegawai !== f.status) return false;
    if (f.keaktifan && p.StatusKeaktifan !== f.keaktifan) return false;
    if (f.golongan && p.Golongan !== f.golongan) return false;
    if (f.jabatan && String(p.Jabatan).toLowerCase().indexOf(String(f.jabatan).toLowerCase()) < 0) return false;
    if (f.kelengkapan === 'Lengkap' && !p.Lengkap) return false;
    if (f.kelengkapan === 'Belum Lengkap' && p.Lengkap) return false;
    return true;
  });
}
const PEG_PAGES = new Map();

async function queryPegawai(filter, page, size) {
  if (S.idx.mode === 'full') { const rows = filterPegawai(S.idx.rows, filter).sort((a, b) => String(a.Nama).localeCompare(String(b.Nama))); return { total: rows.length, rows: rows.slice((page - 1) * size, page * size) }; }
  const key = JSON.stringify([filter, page, size]);
  if (!PEG_PAGES.has(key)) PEG_PAGES.set(key, API.call('pegawai.list', { filter, page, pageSize: size }, { retry: 1 }).then((r) => ({ total: r.total, rows: r.rows.map(idxObj) })).catch((e) => { PEG_PAGES.delete(key); throw e; }));
  const res = await PEG_PAGES.get(key);
  const nk = JSON.stringify([filter, page + 1, size]);
  if (page * size < res.total && !PEG_PAGES.has(nk)) PEG_PAGES.set(nk, API.call('pegawai.list', { filter, page: page + 1, pageSize: size }).then((r) => ({ total: r.total, rows: r.rows.map(idxObj) })).catch(() => PEG_PAGES.delete(nk)));
  return res;
}
const pegByNip = (nip) => S.idx.rows.find((p) => p.NIP === String(nip)) || null;
function upsertIdx(peg) {
  if (!peg) return;
  const o = { NIP: String(peg.NIP), Nama: peg.Nama, StatusPegawai: peg.StatusPegawai, UnitKerja: peg.UnitKerja, Golongan: peg.Golongan, Jabatan: peg.Jabatan, StatusKeaktifan: peg.StatusKeaktifan || 'Aktif', Lengkap: peg.Kelengkapan === 'Lengkap', KategoriKosong: peg.KategoriKosong || '', JenisKelamin: peg.JenisKelamin || '', Pangkat: peg.Pangkat || '' };
  const i = S.idx.rows.findIndex((p) => p.NIP === o.NIP);
  if (i >= 0) S.idx.rows[i] = o; else { S.idx.rows.push(o); S.idx.total++; }
  PEG_PAGES.clear();
}

function applyBoot(b) {
  S.user = b.user; S.cfg = b.config || {}; S.master = b.master || S.master; S.dash = b.dashboard; S.notif = b.notif || { items: [], unread: 0 };
  S.badge = b.badge || {}; S.jabatanList = b.jabatanList || []; S.profil = b.profil || null; S.gajiPeriode = b.gajiPeriode || [];
  S.idx = b.index ? { mode: b.index.mode, total: b.index.total, rows: (b.index.rows || []).map(idxObj) } : { mode: 'full', rows: [], total: 0 };
  S.pengajuan = b.pengajuan || { mode: 'full', rows: [] };
  S.bootAt = Date.now(); PEG_PAGES.clear();
  bindConfig(); renderTopbar(); renderNav(); renderNotifDot();
  if (S.user.tema && !Store.pref('pg:tema-lokal')) Theme.set(S.user.tema, false);
}
function bindConfig() {
  const c = Object.assign({}, BOOT, S.cfg || {});
  $$('[data-bind]').forEach((el) => { const v = c[el.dataset.bind]; if (v) el.textContent = v; });
  $$('[data-wa]').forEach((a) => { a.href = waLink(); });
  $$('[data-wa-forgot]').forEach((a) => { a.href = waLink('Halo Superadmin ' + (S.cfg.appName || BOOT.appName || BRAND.nama) + ', saya lupa password akun saya. NIP/Username: '); });
  if (c.logoUrl) $$('#brand-mark').forEach((m) => { m.innerHTML = `<img src="${esc(c.logoUrl)}" alt="Logo">`; });
}
const Snap = {
  key: 'pg:snap',
  save(b) { try { Store.set(this.key, JSON.stringify(b), S.remember); } catch (e) {   } },
  load() { try { return JSON.parse(Store.get(this.key) || 'null'); } catch (e) { return null; } },
  clear() { Store.del(this.key); }
};

function renderNav() {
  const groups = {};
  Object.keys(ROUTES).forEach((r) => {
    const d = ROUTES[r];
    if (!S.user || d.roles.indexOf(S.user.role) < 0 || (d.cond && !d.cond())) return;
    (groups[d.group] = groups[d.group] || []).push(r);
  });
  let h = '';
  const GL = { UTAMA: 'Navigasi Utama', ADMINISTRASI: 'Manajemen Data', LAINNYA: 'Lainnya' };
  ['UTAMA', 'ADMINISTRASI', 'LAINNYA'].forEach((g) => {
    if (!groups[g]) return;
    h += `<div class="nav-group">${GL[g]}</div>`;
    groups[g].forEach((r) => {
      const d = ROUTES[r], bd = d.badge ? d.badge() : 0;
      if (d.ext) { h += `<a class="nav-item" href="${esc(waLink())}" target="_blank" rel="noopener" data-wa>${ic(d.icon)}<span class="lbl">${d.label}</span>${ic('open_in_new', 's16 chev')}</a>`; return; }
      h += `<button class="nav-item" data-act="nav" data-r="${r}" data-nav="${r}" title="${d.label}">${ic(d.icon)}<span class="lbl">${d.label}</span>${bd ? `<span class="nav-badge" data-badge="${r}">${bd}</span>` : ''}${d.sub ? ic('expand_more', 'chev') : ''}</button>`;
      if (d.sub) h += `<div class="nav-sub" data-sub="${r}">${d.sub.map((s) => `<button data-act="nav" data-r="${r}" data-tab="${s[0]}">${s[1]}</button>`).join('')}</div>`;
    });
  });
  $('#nav').innerHTML = h;
  markNav();
}
function markNav() {
  $$('[data-nav]').forEach((b) => b.classList.toggle('active', b.dataset.nav === S.route));
  $$('[data-sub]').forEach((s) => { const on = s.dataset.sub === S.route; s.classList.toggle('open', on || s.dataset.force === '1'); const nb = $(`[data-nav="${s.dataset.sub}"]`); if (nb) nb.classList.toggle('open', s.classList.contains('open')); s.querySelectorAll('button').forEach((b) => b.classList.toggle('active', on && b.dataset.tab === (S.params.tab || ROUTES[S.route].sub[0][0]))); });
}
function setBadge(r, n) { S.badge[r] = n; const b = $(`[data-badge="${r}"]`); if (b) { if (n) b.textContent = n; else b.remove(); } else if (n) renderNav(); }

function parseHash() { const m = String(location.hash || '').match(/^#\x2F([a-z]+)(?:\x2F([a-z0-9_-]+))?/i); return m ? { r: m[1], tab: m[2] || '' } : { r: '', tab: '' }; }
function ruteAwal() { const h = parseHash(); if (h.r && allowed(h.r)) return h; const r = Store.pref('pg:route'); return { r: allowed(r) ? r : 'dashboard', tab: '' }; }
function go(r, params, opt) {
  params = params || {}; opt = opt || {};
  if (!allowed(r)) r = 'dashboard';
  const sama = S.route === r;
  S.route = r; S.params = params;
  $$('.page').forEach((p) => p.classList.toggle('active', p.id === 'pg-' + r));
  markNav(); Pop.close(); Tip.hide(); Drawer.close(); while (Modal.closeTop());
  $('#sidebar').classList.remove('open'); $('#layer').querySelector('.scrim.sb') && $('#layer').querySelector('.scrim.sb').remove();
  document.title = ROUTES[r].label + ' · ' + (S.cfg.appName || BRAND.nama);
  try { PAGES[r].show(params, sama); } catch (e) { console.error(e); $('#pg-' + r).innerHTML = `<div class="card">${emptyBox('Terjadi kesalahan saat menampilkan halaman', e.message, 'error')}</div>`; }
  if (!opt.keepScroll) $('#content').scrollTop = 0;
  Store.pref('pg:route', r);
  if (!opt.fromHistory) { const h = '#/' + r + (params.tab ? '/' + params.tab : ''); if (location.hash !== h) { try { history[sama || opt.replace ? 'replaceState' : 'pushState']({ r, tab: params.tab || '' }, '', h); } catch (e) { } } }
}
function pageHead(crumb, title, sub, right) {
  return `<div class="page-head"><div><div class="crumb">${crumb.map((c, i) => (i === crumb.length - 1 ? `<b>${esc(c)}</b>` : `${esc(c)} ${ic('chevron_right', 's14')}`)).join(' ')}</div><h1 class="page-title">${title}</h1>${sub ? `<p class="page-sub">${sub}</p>` : ''}</div>${right ? `<div class="row wrap">${right}</div>` : ''}</div>`;
}

function renderTopbar() {
  const u = S.user; if (!u) return;
  $('#greet-t').textContent = salam();
  $('#greet-n').textContent = u.role === 'SUPERADMIN' ? (u.nama || 'Superadmin') : u.nama;
  $('#me-n').textContent = u.nama; $('#me-r').textContent = ROLE_LABEL[u.role] + (u.role === 'ADMIN_UNIT' ? ' · ' + u.unit : (u.role === 'PEGAWAI' ? ' · ' + (u.unit || '') : ''));
  const av = $('#me-av'); av.textContent = initials(u.nama); av.className = 'av sm ' + avCls(u.nama);
  const sav = $('#sb-av'); if (sav) { sav.textContent = initials(u.nama); sav.className = 'av ' + avCls(u.nama); $('#sb-n').textContent = u.nama; $('#sb-r').textContent = u.role === 'SUPERADMIN' ? 'Superadmin · Penanggung Jawab Gaji' : ROLE_LABEL[u.role] + (u.unit ? ' · ' + u.unit : ''); }
  $('#q-global').placeholder = isPeg() ? 'Cari menu… (mis. gaji, cuti)' : 'Cari NIP atau nama pegawai…';
}
function renderNotifDot() { const n = (S.notif && S.notif.unread) || 0, d = $('#bell-dot'); d.hidden = !n; d.textContent = n > 9 ? '9+' : (n || ''); $('#bell').setAttribute('aria-label', n ? 'Notifikasi, ' + n + ' belum dibaca' : 'Notifikasi'); }
function notifPop(anchor) {
  const it = (S.notif.items || []);
  const p = Pop.toggle(anchor, `<div class="np-head"><b>Notifikasi</b>${S.notif.unread ? `<button class="link-btn" data-act="notifAll">Tandai semua dibaca</button>` : ''}</div><div class="np-list">${it.length ? it.map((n) => `<button class="np-item ${n.Dibaca === 'YA' ? '' : 'unread'}" data-act="notifOpen" data-id="${esc(n.ID)}" data-rute="${esc(n.Rute)}"><span class="ic">${ic(/tolak/i.test(n.Judul) ? 'cancel' : /setuju/i.test(n.Judul) ? 'check_circle' : /anak|H-/i.test(n.Judul) ? 'child_care' : 'notifications')}</span><span class="grow"><b>${esc(n.Judul)}</b><p>${esc(n.Pesan)}</p><time>${relWaktu(n.Waktu)}</time></span></button>`).join('') : emptyBox('Belum ada notifikasi', 'Pemberitahuan pengajuan & alert akan muncul di sini.', 'notifications_off')}</div>`, 'notif-pop');
  return p;
}
function meMenu(anchor) {
  Pop.toggle(anchor, `<div style="padding:8px 12px 10px"><b>${esc(S.user.nama)}</b><div class="muted" style="font-size:12px">${esc(ROLE_LABEL[S.user.role])}${S.user.nip ? ' · ' + fmtNip(S.user.nip) : ''}</div></div><hr>
    ${allowed('profil') ? `<button class="pi" data-act="nav" data-r="profil">${ic('account_circle')}Profil Saya</button>` : ''}
    <button class="pi" data-act="nav" data-r="password">${ic('lock_reset')}Ubah Password</button>
    ${PWA.bisa() ? `<button class="pi" data-act="pwa">${ic('install_mobile')}Pasang Aplikasi di HP</button>` : ''}
    <a class="pi" href="${esc(waLink())}" target="_blank" rel="noopener">${ic('support_agent')}Pusat Bantuan</a>
    <button class="pi" data-act="tentang">${ic('info')}Tentang ${esc(S.cfg.appName || BRAND.nama)}</button><hr>
    <button class="pi danger" data-act="logout">${ic('logout')}Keluar</button>`);
}

function tentangAplikasi() {
  Pop.close();
  const nama = (S.cfg && S.cfg.appName) || BOOT.appName || BRAND.nama, instansi = (S.cfg && S.cfg.instansi) || BOOT.instansi || 'Dinas Kesehatan Kabupaten Minahasa Selatan';
  const m = Modal.open({ title: `${ic('info')} Tentang ${esc(nama)}`, size: 'lg', foot: '<button class="btn btn-primary" data-ok>Tutup</button>', body: `
    <div class="row top wrap gap-16"><div class="brand-mark" style="width:56px;height:56px;border-radius:18px"><span class="ms s32">account_balance_wallet</span></div>
      <div class="grow" style="min-width:220px"><div class="caps" style="color:var(--primary-text)">${esc(BRAND.panjang)}</div><h2 style="font-size:22px;font-weight:800;letter-spacing:-.02em">${esc(nama)}</h2><p class="mt-4" style="font-size:14px;font-style:italic;color:var(--text-2)">“${esc(BRAND.tagline)}”</p></div></div>
    <div class="insight mt-20" style="margin-bottom:0"><span class="card-ic">${ic('monitor_heart', 's18')}</span><div class="grow"><b style="font-size:14px">Filosofi ${esc(BRAND.nama)}</b>
      <p class="mt-8" style="line-height:1.65">Terinspirasi dari prosedur <i>medical check-up</i> di dunia kesehatan yang bertujuan memeriksa kondisi tubuh secara berkala dan mendeteksi gejala gangguan sejak dini, ${esc(BRAND.nama)} hadir sebagai instrumen deteksi dini dan pemeliharaan kesehatan administrasi penggajian ASN di lingkungan Dinas Kesehatan.</p>
      <p class="mt-8" style="line-height:1.65">Perubahan data kepegawaian—seperti Kenaikan Gaji Berkala (KGB), kenaikan pangkat, perubahan tunjangan keluarga, hingga mutasi—sering kali menjadi titik rawan terjadinya keterlambatan proses maupun selisih bayar (kelebihan/kekurangan bayar) jika tidak terpantau secara sistematis. Melalui ${esc(BRAND.nama)}, setiap perubahan status pegawai diperiksa (<b style="display:inline">Cek</b>) dan diperbarui (<b style="display:inline">Update</b>) secara terintegrasi sebelum periode penggajian berjalan, memastikan hak keuangan setiap ASN terbayarkan secara akurat, transparan, dan tepat waktu.</p></div></div>
    <p class="faint mt-16" style="font-size:12px">${esc(instansi)}${(S.cfg && S.cfg.versi) || BOOT.versi ? ' · Versi ' + esc((S.cfg && S.cfg.versi) || BOOT.versi) : ''}</p>` });
  m.el.querySelector('[data-ok]').onclick = m.close;
}
function globalSearch(q) {
  q = String(q || '').trim(); if (!q) return;
  if (isPeg()) {
    const ql = q.toLowerCase();
    const hit = Object.keys(ROUTES).find((r) => allowed(r) && ROUTES[r].label.toLowerCase().indexOf(ql) >= 0) || (/gaji|slip/.test(ql) ? 'cekgaji' : /cuti|anak|keluarga|pangkat|jabatan|kgb/.test(ql) ? 'ajukan' : /profil|data/.test(ql) ? 'profil' : null);
    if (hit) go(hit); else toast('info', 'Menu tidak ditemukan', 'Coba kata kunci lain, mis. "gaji" atau "cuti".');
  } else go('pegawai', { filter: { q }, apply: true });
  $('#top-search').classList.remove('open'); $('#q-global').blur();
}

const Auth = {
  start(token, boot, remember) {
    S.token = token; S.remember = !!remember;
    Store.del('pg:tok'); Store.set('pg:tok', JSON.stringify({ token, remember: !!remember, u: boot.user.username }), !!remember);
    applyBoot(boot); Snap.save(boot);
    showApp();
    const ra = ruteAwal(); go(ra.r, ra.tab ? { tab: ra.tab } : {}, { replace: true });
    Idle.start(); Prefetch.run(); Poll.start();
    if (boot.user.darurat) setTimeout(() => toast('warn', 'Mode Akses Darurat', 'Anda masuk dengan akun darurat (setara Superadmin, sesi 2 jam). Segera pulihkan akun superadmin lalu keluar.', { ms: 12000 }), 300);
    else if (boot.user.harusGanti) setTimeout(promptGanti, 400);
  },
  expired(msg) { if (!S.token) return; Auth.reset(); showLogin(msg || 'Sesi Anda berakhir. Silakan login kembali.'); },
  async logout(msg) {
    const t = S.token;
    if (t) API.raw('api', 'logout', t, {}).catch(() => { });
    Auth.reset(); showLogin(msg, msg ? 'info' : null);
  },
  reset() {
    S.token = null; Store.del('pg:tok'); Snap.clear(); Poll.stop(); API.inflight.clear(); Drawer.close(); while (Modal.closeTop()); Pop.close();
    FILES.clear(); Object.keys(DOC_CACHE).forEach((k) => delete DOC_CACHE[k]); Object.keys(PAGES).forEach((k) => { PAGES[k].done = false; });
    $$('.page').forEach((p) => { p.innerHTML = ''; p.classList.remove('active'); }); S.route = null; S.detail = {}; S.antrean = null;
  }
};
function promptGanti() {
  Modal.confirm({ title: 'Amankan akun Anda', icon: 'shield_lock', msg: '<b>Anda masih memakai password awal/default.</b><p class="muted mt-4">Demi keamanan data gaji Anda, segera ganti password dengan kombinasi huruf dan angka minimal 8 karakter.</p>', ok: 'Ganti Sekarang', cancel: 'Nanti saja' }).then((ok) => { if (ok) go('password'); });
}
const Idle = {
  last: Date.now(), t: null, bound: false,
  start() {
    if (!this.bound) { ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((e) => addEventListener(e, () => { this.last = Date.now(); }, { passive: true, capture: true })); this.bound = true; }
    clearInterval(this.t); this.last = Date.now();
    this.t = setInterval(() => { const lim = (S.remember ? 360 : (S.cfg.idleMenit || 60)) * 60000; if (S.token && Date.now() - this.last > lim) Auth.logout('Anda keluar otomatis karena tidak ada aktivitas.'); }, 30000);
  }
};

const Prefetch = {
  run() {
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 800));
    idle(() => {
      if (isSA()) PAGES.persetujuan.load(true).catch(() => { });
      if (isPeg() && S.gajiPeriode[0]) PAGES.cekgaji.prefetch();
      if (!isPeg()) setTimeout(() => loadLib('xlsx').catch(() => { }), 4000);
    });
  }
};

const Poll = {
  t: null, last: 0, bound: false,
  start() {
    this.stop(); this.last = Date.now(); this.jadwal();
    if (!this.bound) { this.bound = true; document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.token && Date.now() - this.last > 60000) this.jalan(); }); addEventListener('online', () => { if (S.token) this.jalan(); }); }
  },
  stop() { clearTimeout(this.t); this.t = null; },
  jadwal() { this.stop(); this.t = setTimeout(() => this.jalan(), Date.now() - Idle.last > 120000 ? 180000 : 60000); },
  async jalan() {
    if (!S.token) return;
    if (document.visibilityState === 'visible' && navigator.onLine !== false) {
      this.last = Date.now();
      try {
        const d = await API.call('poll', {});
        const baru = (d.notif.unread || 0) > (S.notif.unread || 0);
        S.notif = d.notif; renderNotifDot();
        if (d.badge && d.badge.persetujuan !== S.badge.persetujuan) setBadge('persetujuan', d.badge.persetujuan);
        if (baru && d.notif.items[0]) toast('info', d.notif.items[0].Judul, d.notif.items[0].Pesan);
      } catch (e) {   }
    }
    if (S.token) this.jadwal();
  }
};

const PWA = {
  prompt: null, reg: null,
  standalone: () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true,
  ios: () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
  bisa() { return !this.standalone() && (!!this.prompt || this.ios()); },
  render() { $$('[data-pwa-btn]').forEach((b) => { b.hidden = !PWA.bisa(); }); },
  async pasang() {
    Pop.close();
    if (this.prompt) {
      const p = this.prompt; this.prompt = null; p.prompt();
      try { const r = await p.userChoice; if (r && r.outcome === 'accepted') toast('ok', 'Aplikasi dipasang', 'Buka ' + (S.cfg.appName || BOOT.appName) + ' dari layar utama HP Anda.'); } catch (e) { }
      this.render(); return;
    }
    const ios = this.ios();
    const m = Modal.open({ title: `${ic('install_mobile')} Pasang ${esc(S.cfg.appName || BOOT.appName)} di HP`, foot: '<button class="btn btn-primary" data-ok>Mengerti</button>', body: ios
      ? `<ol class="stack-8" style="margin:0;padding-left:18px;line-height:1.6"><li>Buka halaman ini dengan <b>Safari</b>.</li><li>Ketuk tombol <b>Bagikan</b> ${ic('ios_share', 's18')} di bawah layar.</li><li>Pilih <b>Tambahkan ke Layar Utama</b>, lalu ketuk <b>Tambah</b>.</li></ol>`
      : `<ol class="stack-8" style="margin:0;padding-left:18px;line-height:1.6"><li>Buka halaman ini dengan <b>Google Chrome</b>.</li><li>Ketuk menu <b>⋮</b> di kanan atas.</li><li>Pilih <b>Instal aplikasi</b> / <b>Tambahkan ke layar utama</b>.</li></ol>` });
    m.el.querySelector('[data-ok]').onclick = m.close;
  },
  init() {
    addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); PWA.prompt = e; PWA.render(); });
    addEventListener('appinstalled', () => { PWA.prompt = null; PWA.render(); });
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        PWA.reg = reg;
        reg.addEventListener('updatefound', () => {
          const w = reg.installing; if (!w) return;
          w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) toast('info', 'Versi baru tersedia', 'Muat ulang untuk memakai versi terbaru.', { ms: 15000, action: { label: 'Muat ulang sekarang', fn: () => location.reload() } }); });
        });
      }).catch(() => { });
    }
    PWA.render();
  }
};

async function refreshBoot(diam) {
  try {
    const b = await API.call('bootstrap', {}, { retry: 1 });
    applyBoot(b); Snap.save(b);
    Object.keys(PAGES).forEach((k) => { if (PAGES[k].dataPage) PAGES[k].done = false; });
    if (S.route && PAGES[S.route].dataPage) PAGES[S.route].show(S.params, true);
    if (!diam) toast('ok', 'Data diperbarui');
  } catch (e) { if (e.code !== 'SESSION' && !diam) errToast(e, 'Gagal memperbarui data'); }
}
let dashTimer = null;
function invalidateDash() { clearTimeout(dashTimer); dashTimer = setTimeout(() => { API.call('dashboard', {}).then((d) => { S.dash = d; PAGES.dashboard.done = false; if (S.route === 'dashboard') PAGES.dashboard.show({}, true); }).catch(() => { }); }, 1500); }

function showLogin(msg, kind) {
  $('#view-app').hidden = true; $('#view-login').hidden = false;
  const er = $('#lg-err');
  if (msg) { er.hidden = false; er.className = 'banner ' + (kind === 'info' ? 'info' : 'bad'); $('#lg-err-t').textContent = msg; } else er.hidden = true;
  setTimeout(() => $('#lg-user').focus(), 50);
}
function showApp() { $('#view-login').hidden = true; $('#view-app').hidden = false; }
function hideSplash() { window.__PG_SIAP = 1; const s = $('#splash'); if (s) { s.classList.add('hide'); setTimeout(() => s.remove(), 300); } }
function setLoginRole(v) {
  $$('[data-act="loginRole"]').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
  const peg = v === 'pegawai', inp = $('#lg-user');
  $('#lg-user-lbl').innerHTML = (peg ? 'NIP' : 'Username') + ' <span class="req">*</span>';
  inp.placeholder = peg ? '18 digit NIP' : 'superadmin / admin_unit';
  inp.inputMode = peg ? 'numeric' : 'text';
  $('#lg-user-hint').textContent = peg ? 'Contoh: 198804152014022003 (password awal = NIP)' : 'Contoh: superadmin atau admin_amurang';
  $('.input-ic .ms', $('#lg-user').parentElement).textContent = peg ? 'badge' : 'person';
}
async function doLogin(e) {
  e.preventDefault();
  const u = $('#lg-user').value.trim(), p = $('#lg-pass').value, rem = $('#lg-remember').checked, btn = $('#lg-btn');
  const er = $('#lg-err');
  if (!u || !p) { er.hidden = false; er.className = 'banner bad'; $('#lg-err-t').textContent = 'NIP/Username dan password wajib diisi.'; return; }
  btn.disabled = true; btn.innerHTML = '<span class="spin"></span><span>Memverifikasi…</span>'; er.hidden = true;
  try {
    const res = await API.raw('login', u, p, rem);
    if (!res.success) throw new AppErr(res.message, res.code);
    $('#lg-pass').value = '';
    Auth.start(res.data.token, res.data.boot, rem);
    toast('ok', salam() + ', ' + res.data.boot.user.nama.split(',')[0], 'Anda berhasil masuk.');
  } catch (x) { er.hidden = false; er.className = 'banner bad'; $('#lg-err-t').textContent = x.message; $('#lg-pass').select(); }
  finally { btn.disabled = false; btn.innerHTML = '<span>Masuk</span>' + ic('arrow_forward', 's18'); }
}

const ACT = {
  nav: (el) => { const r = el.dataset.r; const d = ROUTES[r]; if (d && d.sub && !el.dataset.tab && S.route === r && window.innerWidth >= 768) { const s = $(`[data-sub="${r}"]`); if (s) { s.dataset.force = s.classList.contains('open') ? '0' : '1'; markNav(); } return; } go(r, el.dataset.tab ? { tab: el.dataset.tab } : (el.dataset.p ? JSON.parse(el.dataset.p) : {})); },
  tema: (el) => { Store.pref('pg:tema-lokal', '1'); Theme.set(el.dataset.v, true); },
  temaToggle: () => { Store.pref('pg:tema-lokal', '1'); Theme.set(Theme.get() === 'gelap' ? 'terang' : 'gelap', true); },
  drawer: () => { const sb = $('#sidebar'); sb.classList.add('open'); const sc = document.createElement('div'); sc.className = 'scrim sb'; sc.style.zIndex = 110; sc.onclick = () => { sb.classList.remove('open'); sc.remove(); }; $('#layer').appendChild(sc); },
  searchToggle: () => { $('#top-search').classList.toggle('open'); if ($('#top-search').classList.contains('open')) $('#q-global').focus(); },
  notif: (el) => notifPop(el),
  notifAll: () => { S.notif.items.forEach((n) => { n.Dibaca = 'YA'; }); S.notif.unread = 0; renderNotifDot(); Pop.close(); Sync.run('Menandai…', API.call('notif.baca', { semua: true }).catch(() => { })); },
  notifOpen: (el) => {
    const n = S.notif.items.find((x) => x.ID === el.dataset.id);
    if (n && n.Dibaca !== 'YA') { n.Dibaca = 'YA'; S.notif.unread = Math.max(0, S.notif.unread - 1); renderNotifDot(); API.call('notif.baca', { ids: [n.ID] }).catch(() => { }); }
    Pop.close();
    const [r, arg] = String(el.dataset.rute || '').split(':');
    if (r === 'persetujuan') go('persetujuan', { id: arg }); else if (r === 'riwayat') go('riwayat', { id: arg }); else if (r === 'ajukan') go('ajukan', { jenis: arg }); else if (allowed(r)) go(r);
  },
  meMenu: (el) => meMenu(el),
  logout: () => Auth.logout('Anda telah keluar. Sampai jumpa!'),
  pwa: () => PWA.pasang(),
  loginRole: (el) => setLoginRole(el.dataset.v),
  togglePw: (el) => { const i = document.getElementById(el.dataset.t); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; el.querySelector('.ms').textContent = show ? 'visibility_off' : 'visibility'; },
  doc: (el) => lihatDokumen(el.dataset.id, el.dataset.t),
  dropClear: (el) => setDropFile(el.dataset.k, null),
  refresh: () => Sync.run('Memuat ulang…', refreshBoot(false)),
  tentang: () => tentangAplikasi()
};
document.addEventListener('click', (e) => {
  const ts = $('#top-search');
  if (ts.classList.contains('open') && !e.target.closest('#top-search') && !e.target.closest('[data-act="searchToggle"]')) ts.classList.remove('open');
  const el = e.target.closest('[data-act]');
  if (Pop.cur && !e.target.closest('.pop') && !(el && Pop.cur.anchor === el)) Pop.close();
  if (!el || el.disabled) return;
  const fn = ACT[el.dataset.act];
  if (fn) { if (el.tagName === 'A') e.preventDefault(); fn(el, e); }
});
document.addEventListener('change', (e) => {
  const f = e.target.closest('input[type=file][data-file]');
  if (f && f.files && f.files[0]) setDropFile(f.dataset.file, f.files[0]);
  const ch = e.target.closest('[data-change]');
  if (ch && CHG[ch.dataset.change]) CHG[ch.dataset.change](ch, e);
});
document.addEventListener('input', (e) => { const el = e.target.closest('[data-input]'); if (el && INP[el.dataset.input]) INP[el.dataset.input](el, e); });
const CHG = {}, INP = {}, SUBMIT = {};
document.addEventListener('submit', (e) => { const f = e.target.closest('form[data-submit]'); if (f && SUBMIT[f.dataset.submit]) { e.preventDefault(); SUBMIT[f.dataset.submit](f, e); } });
['dragenter', 'dragover'].forEach((t) => document.addEventListener(t, (e) => { const d = e.target.closest && e.target.closest('.drop'); if (d) { e.preventDefault(); d.classList.add('over'); } }));
['dragleave', 'drop'].forEach((t) => document.addEventListener(t, (e) => { const d = e.target.closest && e.target.closest('.drop'); if (d) { d.classList.remove('over'); if (t === 'drop') { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setDropFile(d.dataset.drop, f); } } }));
document.addEventListener('mouseover', (e) => { const t = e.target.closest('[data-tip]'); if (t) { const r = t.getBoundingClientRect(); Tip.show(t.dataset.tip, r.left + r.width / 2, r.top); } else Tip.hide(); });
document.addEventListener('focusin', (e) => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t) { const r = t.getBoundingClientRect(); Tip.show(t.dataset.tip, r.left + r.width / 2, r.top); } });
document.addEventListener('focusout', () => Tip.hide());
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"][data-act]:not(button)')) { e.preventDefault(); e.target.click(); return; }
  if (e.key === 'Escape') { if ($('#top-search').classList.contains('open')) { $('#top-search').classList.remove('open'); $('#q-global').blur(); return; } if (Pop.cur) return Pop.close(); if (Modal.closeTop()) return; if (Drawer.cur) return Drawer.close(); }
  if (e.key === '/' && S.token && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); $('#q-global').focus(); }
});
$('#login-form').addEventListener('submit', doLogin);
$('#top-search').addEventListener('submit', (e) => { e.preventDefault(); globalSearch($('#q-global').value); });

function segarkanInfo() {
  if (!API.ok) { tampilSetupErr('Alamat server belum diatur. Buka berkas js/config.js lalu isi GAS_URL dengan URL Web App Apps Script (berakhiran /exec), kemudian unggah ulang ke GitHub.'); return; }
  API.info().then((d) => {
    Object.assign(BOOT, d); try { localStorage.setItem('pg:boot', JSON.stringify(d)); } catch (e) { }
    bindConfig();
    if (d.siap === false && !S.token) tampilSetupErr(d.error || 'Aplikasi belum di-setup.');
  }).catch(() => {   });
}
function tampilSetupErr(msg) { showLogin(); $('#login-card').hidden = true; $('#setup-err').hidden = false; $('#setup-err-t').textContent = msg; hideSplash(); }
async function init() {
  Theme.set(Theme.get(), false);
  $('#yr').textContent = new Date().getFullYear();
  bindConfig(); setLoginRole('pegawai'); PWA.init();
  addEventListener('popstate', (ev) => { const st = (ev.state && ev.state.r) ? ev.state : parseHash(); if (S.token && st.r && (st.r !== S.route || (st.tab || '') !== (S.params.tab || ''))) go(st.r, st.tab ? { tab: st.tab } : {}, { fromHistory: true }); });
  segarkanInfo();
  if (!API.ok) return;
  let tok = null; try { tok = JSON.parse(Store.get('pg:tok') || 'null'); } catch (e) { }
  if (!tok || !tok.token) { showLogin(); hideSplash(); return; }
  S.token = tok.token; S.remember = !!tok.remember;
  const snap = Snap.load();
  if (snap && snap.user && snap.user.username === tok.u) {
    applyBoot(snap); showApp(); const ra = ruteAwal(); go(ra.r, ra.tab ? { tab: ra.tab } : {}, { replace: true }); hideSplash();
    Idle.start(); Prefetch.run(); Poll.start();
    refreshBoot(true);
  } else {
    try { const b = await API.call('bootstrap', {}, { retry: 1 }); Auth.start(S.token, b, S.remember); }
    catch (e) { if (e.code !== 'SESSION') showLogin(e.message); }
    hideSplash();
  }
}

const Chart = {

  donut(segs, o) {
    o = o || {};
    const size = o.size || 164, th = o.thick || 18, r = (size - th) / 2, C = 2 * Math.PI * r, cx = size / 2;
    const tot = segs.reduce((s, x) => s + (+x.v || 0), 0), nz = segs.filter((x) => +x.v > 0).length, gap = nz > 1 ? 3 : 0;
    let off = 0;
    const arcs = segs.map((s) => {
      const len = tot ? (+s.v / tot) * C : 0; if (!len) return '';
      const d = Math.max(0.01, len - gap);
      const el = `<circle class="seg-a" cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(${s.c})" stroke-width="${th}" stroke-dasharray="${d} ${C - d}" stroke-dashoffset="${-off}" data-tip="${esc(s.l)}|${fmtNum(s.v)} (${Math.round((+s.v / tot) * 100)}%)" tabindex="0"><title>${esc(s.l)}: ${fmtNum(s.v)}</title></circle>`;
      off += len; return el;
    }).join('');
    return `<div style="position:relative;width:${size}px;height:${size}px" role="img" aria-label="${esc(o.aria || segs.map((s) => s.l + ' ' + s.v).join(', '))}"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)"><circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(--chart-track)" stroke-width="${th}"/>${arcs}</svg><div class="kpi-center">${o.center || ''}</div></div>`;
  },
  ring(pct, o) {
    o = o || {};
    const size = o.size || 150, th = o.thick || 16, r = (size - th) / 2, C = 2 * Math.PI * r, cx = size / 2, d = Math.max(0, Math.min(1, pct / 100)) * C;
    return `<div style="position:relative;width:${size}px;height:${size}px" role="img" aria-label="${esc(o.aria || pct + '%')}"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)"><circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(${o.track || '--chart-track'})" stroke-width="${th}"/><circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(${o.c || '--chart-4'})" stroke-width="${th}" stroke-linecap="round" stroke-dasharray="${d} ${C}" style="transition:stroke-dasharray .8s var(--ease)"/></svg><div class="kpi-center">${o.center || ''}</div></div>`;
  },

  semi(segs, o) {
    o = o || {};
    const w = o.w || 240, th = o.thick || 22, r = (w - th) / 2, cx = w / 2, cy = r + th / 2, L = Math.PI * r;
    const tot = segs.reduce((s, x) => s + (+x.v || 0), 0), nz = segs.filter((x) => +x.v > 0).length, gap = nz > 1 ? 4 : 0;
    const path = `M ${th / 2} ${cy} A ${r} ${r} 0 0 1 ${w - th / 2} ${cy}`;
    let off = 0;
    const arcs = segs.map((s) => { const len = tot ? (+s.v / tot) * L : 0; if (!len) return ''; const d = Math.max(.01, len - gap); const el = `<path class="seg-a" d="${path}" fill="none" stroke="var(${s.c})" stroke-width="${th}" stroke-linecap="butt" stroke-dasharray="${d} ${L + 10}" stroke-dashoffset="${-off}" data-tip="${esc(s.l)}|${fmtNum(s.v)} (${Math.round((+s.v / tot) * 100)}%)" tabindex="0"><title>${esc(s.l)}: ${fmtNum(s.v)}</title></path>`; off += len; return el; }).join('');
    return `<div style="position:relative;width:${w}px;height:${cy + 4}px" role="img" aria-label="${esc(segs.map((s) => s.l + ' ' + s.v).join(', '))}"><svg width="${w}" height="${cy + 4}" viewBox="0 0 ${w} ${cy + 4}"><path d="${path}" fill="none" stroke="var(--chart-track)" stroke-width="${th}"/>${arcs}</svg><div class="kpi-center" style="justify-content:flex-end;padding-bottom:2px">${o.center || ''}</div></div>`;
  },

  stack(data, seri, o) {
    o = o || {};
    const h = o.h || 170, max = Math.max(1, ...data.map((x) => x.reduce((s, v) => s + v, 0)));
    const nice = Math.ceil(max / 5) * 5 || 5;
    const now = new Date(), curM = (o.tahun === String(now.getFullYear())) ? now.getMonth() : -1;
    const cols = data.map((x, i) => {
      const tot = x.reduce((s, v) => s + v, 0);
      const parts = x.map((v, k) => v ? `<div style="height:${(v / nice) * 100}%;background:var(${seri[k].c})"></div>` : '').reverse().join('');
      return `<div class="sb-col" data-tip="${BLN[i]} ${o.tahun || ''}|${seri.map((s, k) => s.l + ': ' + x[k]).join(' · ')}|Total: ${tot}" tabindex="0" style="display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;min-width:0;height:100%">
        <div style="flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center;${i === curM ? 'background:var(--primary-soft);border-radius:8px;' : ''}"><div style="width:62%;max-width:26px;height:100%;display:flex;flex-direction:column;justify-content:flex-end;border-radius:6px 6px 2px 2px;overflow:hidden;animation:grow .6s var(--ease);transform-origin:bottom">${parts}</div></div>
        <span style="font-size:10.5px;font-weight:${i === curM ? 700 : 600};color:${i === curM ? 'var(--primary-text)' : 'var(--text-2)'}">${BLS[i]}</span></div>`;
    }).join('');
    const grid = [0, 1, 2, 3, 4].map((k) => `<div style="position:absolute;left:24px;right:0;bottom:${22 + (k / 4) * (h - 22)}px;border-top:1px dashed var(--border);"><span style="position:absolute;left:-24px;top:-7px;font-size:10px;color:var(--text-3)">${Math.round((nice * k) / 4)}</span></div>`).join('');
    return `<div style="position:relative;height:${h}px;width:100%">${grid}<div style="position:absolute;inset:0 0 0 28px;display:flex;gap:4px;align-items:stretch">${cols}</div></div>`;
  },

  vbars(items, o) {
    o = o || {};
    const h = o.h || 170, max = Math.max(1, ...items.map((x) => x.v));
    return `<div style="height:${h}px;display:flex;align-items:stretch;gap:${o.gap || 5}px;width:100%">${items.map((x) => `<div data-tip="${esc(x.t || x.l)}|${fmtNum(x.v)} pegawai" tabindex="0" style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px"><div style="flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center"><div style="width:78%;max-width:22px;min-height:${x.v ? 3 : 0}px;height:${(x.v / max) * 100}%;background:var(${x.c || '--chart-1'});border-radius:5px 5px 2px 2px;animation:grow .6s var(--ease);transform-origin:bottom"></div></div><span style="font-size:9.5px;font-weight:600;color:var(--text-2);white-space:nowrap">${esc(x.l)}</span></div>`).join('')}</div>`;
  },

  hbars(items, o) {
    o = o || {};
    const max = o.max || Math.max(1, ...items.map((x) => x.v)), tot = o.total || items.reduce((s, x) => s + x.v, 0);
    return `<div class="bars-h">${items.map((x, i) => `<div class="bh" data-tip="${esc(x.l)}|${fmtNum(x.v)}${o.unit ? ' ' + o.unit : ''}${tot ? ` (${((x.v / tot) * 100).toFixed(1)}%)` : ''}"><span class="n truncate">${o.rank ? (i + 1) + '. ' : ''}${esc(x.l)}</span><span class="v">${fmtNum(x.v)}${o.pct && tot ? ` <span class="faint">(${((x.v / tot) * 100).toFixed(1)}%)</span>` : ''}</span><div class="track"><div class="fill" style="width:${(x.v / max) * 100}%;background:var(${x.c || '--chart-1'})"></div></div></div>`).join('')}</div>`;
  }
};
const SERI_COL = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5', '--chart-6'];

const dp = (o) => `data-p="${esc(JSON.stringify(o))}"`;
const NC_CUBE = '<svg class="nc-cube" viewBox="0 0 120 120" aria-hidden="true" fill="none" stroke="#A3B0D1" stroke-width="1.5" stroke-linejoin="round"><path d="M60 10 105 35v50L60 110 15 85V35Z"/><path d="M15 35l45 25 45-25M60 60v50"/></svg>';
PAGES.dashboard = {
  dataPage: true, tahun: null, cal: null, ev: [], calAll: false, fu: [], seq: 0,
  show(p, keep) {
    const el = $('#pg-dashboard'), d = S.dash;
    if (!d) {
      el.innerHTML = `<div class="dash"><div class="kpis">${[1, 2, 3].map(() => '<div class="skel" style="height:92px;border-radius:14px"></div>').join('')}</div><div class="d-row2">${[1, 2, 3].map(() => '<div class="skel" style="height:300px;border-radius:14px"></div>').join('')}</div></div>`;
      return;
    }
    if (this.done && keep === undefined) return;
    this.tahun = this.tahun && d.perBulan && d.perBulan.data[this.tahun] ? this.tahun : (d.perBulan ? d.perBulan.tahun[0] : null);
    if (!this.cal) { const n = new Date(); this.cal = { y: n.getFullYear(), m: n.getMonth(), sel: '' }; }
    this.ev = this.events(d);
    el.innerHTML = (d.role === 'SUPERADMIN' ? this.superadmin(d) : d.role === 'ADMIN_UNIT' ? this.admin(d) : this.pegawai(d)) +
      `<p class="faint t-center mt-16" style="font-size:11.5px">Data per ${fmtWaktu(d.dibuat)} · <button class="link-btn" data-act="refresh" style="font-size:11.5px">${ic('refresh', 's14')}Muat ulang</button></p>`;
    this.done = true;
  },

  hariSejak(t) { const a = Date.parse(String(t || '').slice(0, 10)), b = Date.parse(todayYmd()); return isNaN(a) ? 0 : Math.max(0, Math.round((b - a) / 864e5)); },
  ambang() { return (S.dash && S.dash.pending && S.dash.pending.ambang) || S.cfg.pendingAmbang || 3; },
  pendingRows(d) {
    const rows = S.pengajuan && S.pengajuan.mode === 'full' ? S.pengajuan.rows.filter((r) => r.Status === 'Pending') : ((d.pending && d.pending.items) || (d.terbaru || []).filter((r) => r.Status === 'Pending'));
    return rows.map((r) => Object.assign({}, r, { hari: r.hari !== undefined ? r.hari : this.hariSejak(r.TglPengajuan) }));
  },
  unitStats() {
    const m = {};
    (S.master.unit || []).forEach((u) => { m[u] = { nama: u, n: 0, ok: 0 }; });
    S.idx.rows.forEach((p) => {
      if ((p.StatusKeaktifan || 'Aktif') !== 'Aktif') return;
      const k = p.UnitKerja || '(Tanpa unit kerja)';
      const u = m[k] || (m[k] = { nama: k, n: 0, ok: 0 });
      u.n++; if (p.Lengkap) u.ok++;
    });
    return Object.keys(m).map((k) => Object.assign(m[k], { pct: m[k].n ? Math.round((m[k].ok / m[k].n) * 100) : 0 }));
  },
  events(d) {
    const ev = [], self = isPeg();
    (d.alerts || []).forEach((a) => {
      const tgl = String((a.tipe === 'KULIAH' ? a.berlaku : a.tgl21) || '').slice(0, 10); if (!tgl) return;
      ev.push({ d: tgl, r: 1, t: a.tipe === 'KULIAH' ? `Surat aktif kuliah ${a.anak} berakhir` : `${a.anak} genap 21 tahun`,
        s: (self ? '' : `${a.pegawai}${a.unit ? ' (' + a.unit + ')' : ''} · `) + (a.tipe === 'KULIAH' ? 'Wajib unggah surat semester baru' : a.dok === 'Sudah' ? 'Surat aktif kuliah sudah ada' : 'Surat aktif kuliah belum diunggah'),
        act: self ? `data-act="nav" data-r="ajukan" ${dp({ jenis: 'KELUARGA' })}` : `data-act="pgDetail" data-nip="${esc(a.nip)}" data-tab="keluarga"` });
    });
    const rows = S.pengajuan && S.pengajuan.mode === 'full' ? S.pengajuan.rows : (d.terbaru || []);
    rows.forEach((r) => {
      const t = String(r.TglPengajuan || '').slice(0, 10); if (!t) return;
      ev.push({ d: t, r: 0, t: (r.Status === 'Pending' ? 'Verifikasi ' : 'Pengajuan ') + (JENIS_LABEL[r.Jenis] || r.Jenis), s: self ? 'Status: ' + r.Status : `${r.Nama}${r.UnitKerja ? ' (' + r.UnitKerja + ')' : ''} · ${r.Status}`,
        act: isSA() && r.Status === 'Pending' ? `data-act="nav" data-r="persetujuan" ${dp({ id: r.ID })}` : `data-act="lihatPengajuan" data-id="${esc(r.ID)}"` });
    });
    return ev.sort((a, b) => a.d.localeCompare(b.d) || b.r - a.r);
  },

  kpi(o) {
    const tag = o.act ? 'button' : 'div';
    return `<${tag} ${o.act ? 'type="button" ' + o.act : ''} class="kpi-card"><span class="k-ic ${o.tone}">${ic(o.ic, 's22')}</span><span class="k-body"><span class="k-t" style="display:block">${o.t}</span><span class="k-v ${o.txt ? 'txt' : ''}" style="display:block">${o.v}${o.sub ? `<small>${o.sub}</small>` : ''}</span>${o.m ? `<span class="k-m ${o.mt || ''}" style="display:block">${o.m}</span>` : ''}</span>${o.act ? `<span class="k-x">${ic('chevron_right', 's18')}</span>` : ''}</${tag}>`;
  },
  ring(pct, sub, size) {
    size = size || 120;
    const th = 12, c = size / 2, r = (size - th) / 2, C = 2 * Math.PI * r, d = Math.max(0, Math.min(1, pct / 100)) * C, id = 'rg' + (++this.seq);
    return `<div class="d-ring" style="width:${size}px;height:${size}px" role="img" aria-label="${pct}% ${esc(sub)}"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6CC070"/><stop offset="1" stop-color="#2E9E4F"/></linearGradient></defs><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--ring-track)" stroke-width="${th}"/><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${th}" stroke-linecap="round" stroke-dasharray="${d} ${C}" transform="rotate(-90 ${c} ${c})"/><circle cx="${c}" cy="${c}" r="${r - th / 2 - 5}" fill="#1C8441"/></svg><div class="rc"><b>${pct}%</b><small>${esc(sub)}</small></div></div>`;
  },
  cRing(k, klik, judul) {
    const top = (k.kategori || []).filter((x) => x.n)[0];
    const attrs = klik ? `data-act="nav" data-r="pegawai" ${dp({ filter: { kelengkapan: 'Belum Lengkap' }, apply: true })} role="button" tabindex="0" aria-label="Lihat pegawai yang datanya belum lengkap"` : '';
    return `<div class="card ring-card ${klik ? 'click hov' : ''}" ${attrs}><div class="card-t">${judul || 'Kelengkapan Data'}<span class="ms s16 faint" data-tip="Kelengkapan Data|Lengkap = 6 kategori wajib terisi (Data Diri, Tunjangan Keluarga, Pangkat, Jabatan, KGB, Unit Kerja). Riwayat Cuti tidak dihitung." tabindex="0" aria-label="Penjelasan kelengkapan data">info</span></div>
      ${this.ring(k.persen, 'Lengkap')}
      <p>${k.belum ? `<b style="color:var(--text-1)">${fmtNum(k.belum)}</b> dari ${fmtNum(k.aktif)} pegawai aktif belum lengkap` : 'Semua data pegawai aktif lengkap'}${top ? `<br>Sering kosong: <b style="color:var(--text-1)">${esc(top.nama)}</b> (${top.n})` : ''}</p></div>`;
  },
  cSla(pend, unit) {
    const amb = this.ambang();
    if (!pend.length) return `<div class="amber-card"><span class="caps">${ic('timer', 's16')}Antrean Verifikasi</span><div class="big">0 Antrean</div><p>Semua pengajuan sudah diproses. Batas tinjau ${amb} hari.</p></div>`;
    const h = Math.max(...pend.map((r) => r.hari || 0)), lewat = pend.filter((r) => (r.hari || 0) > amb).length;
    const act = isSA() ? `data-act="nav" data-r="persetujuan"` : `data-act="nav" data-r="riwayat" ${dp({ status: 'Pending' })}`;
    return `<button type="button" class="amber-card" ${act}><span class="caps">${ic('timer', 's16')}Antrean Terlama</span><span class="big">${h ? h + ' Hari' : 'Hari ini'}</span><span class="am-p">${fmtNum(pend.length)} pengajuan ${unit ? 'unit ' : ''}menunggu persetujuan${lewat ? ` · <b>${lewat} melewati batas ${amb} hari</b>` : ` · masih dalam batas ${amb} hari`}.</span></button>`;
  },
  upItem(u, act) {
    const tone = u.pct >= 85 ? ['b-ok', 'Tinggi'] : u.pct >= 60 ? ['b-warn', 'Proses'] : ['b-bad', 'Perlu Aksi'];
    return `<button type="button" class="up-item" ${act}><span class="up-av">${esc(initials(u.nama))}</span><span style="min-width:0"><b>${esc(u.nama)}</b><small>${u.sub || `${fmtNum(u.n)} pegawai aktif · ${fmtNum(u.n - u.ok)} belum lengkap`}</small></span><span class="up-pct">${u.pct}%<span class="badge ${tone[0]}">${tone[1]}</span></span><span class="up-bar"><i style="width:${u.pct}%"></i></span></button>`;
  },
  cUnitProg(d) {
    const head = `<div class="card-h"><div class="card-t"><span class="ms s22" style="color:var(--primary-text)">apartment</span>Progres Kelengkapan Unit Kerja</div><button class="link-btn" data-act="dashUnitAll">Lihat Semua Unit ${ic('arrow_forward', 's16')}</button></div>`;
    if (S.idx.mode !== 'full' || !S.idx.rows.length) {
      const max = Math.max(1, ...d.unit.map((u) => u.n));
      return `<div class="card" style="display:flex;flex-direction:column">${head}<div class="grow">${Chart.hbars(d.unit.slice().sort((a, b) => b.n - a.n).slice(0, 6).map((u) => ({ l: u.nama, v: u.n, c: '--bar-fill' })), { max, unit: 'pegawai' })}</div></div>`;
    }
    const all = this.unitStats().filter((u) => u.n);
    const list = all.slice().sort((a, b) => a.pct - b.pct || b.n - a.n).slice(0, 4);
    const rata = all.length ? (all.reduce((s, u) => s + u.pct, 0) / all.length).toFixed(1).replace('.', ',') : '0';
    return `<div class="card" style="display:flex;flex-direction:column">${head}
      <div class="up-list">${list.length ? list.map((u) => this.upItem(u, `data-act="nav" data-r="pegawai" ${dp({ filter: { unit: u.nama, kelengkapan: 'Belum Lengkap' }, apply: true })} aria-label="Pegawai ${esc(u.nama)} yang belum lengkap"`)).join('') : emptyBox('Belum ada pegawai aktif', '', 'apartment')}</div>
      <div class="card-f"><span>Rata-rata kelengkapan unit: <b style="color:var(--text-1)">${rata}%</b>${d.unitKosong ? ` · <span style="color:var(--warning);font-weight:600">${d.unitKosong} unit tanpa pegawai aktif</span>` : ''}</span><button class="link-btn" data-act="nav" data-r="laporan">Unduh Laporan ${ic('download', 's16')}</button></div></div>`;
  },
  cKatProg(k) {
    const list = (k.kategori || []).map((x) => ({ nama: x.nama, n: k.aktif, ok: k.aktif - x.n, pct: k.aktif ? Math.round(((k.aktif - x.n) / k.aktif) * 100) : 0, sub: x.n ? `${fmtNum(x.n)} pegawai belum mengisi` : 'Seluruh pegawai sudah mengisi' })).sort((a, b) => a.pct - b.pct).slice(0, 4);
    return `<div class="card" style="display:flex;flex-direction:column"><div class="card-h"><div class="card-t"><span class="ms s22" style="color:var(--primary-text)">fact_check</span>Progres Kelengkapan per Kategori</div><button class="link-btn" data-act="nav" data-r="pegawai" ${dp({ filter: { kelengkapan: 'Belum Lengkap' }, apply: true })}>Tindak Lanjut ${ic('arrow_forward', 's16')}</button></div>
      <div class="up-list">${list.map((u) => this.upItem(u, `data-act="nav" data-r="pegawai" ${dp({ filter: { kelengkapan: 'Belum Lengkap' }, apply: true })}`)).join('')}</div>
      <div class="card-f"><span>${fmtNum(k.lengkap)} dari ${fmtNum(k.aktif)} pegawai aktif sudah lengkap (${k.persen}%)</span></div></div>`;
  },
  cPintasan(d) {
    return `<div class="navy-card"><span class="nc-ic">${ic('bolt', 's18')}</span><div><span class="caps">Layanan Data Gaji</span><h3>Kelola Bulan Ini</h3></div><p>Proses antrean persetujuan, perbarui data pegawai, lalu unggah rincian gaji periode berjalan.</p>
      <ul class="nc-list"><li>${ic('pending_actions')}<span><b>${fmtNum(d.pending.total)}</b> menunggu persetujuan</span></li><li>${ic('payments')}<span>Gaji: <b>${d.imports && d.imports.gaji && d.imports.gaji.Periode ? periodeLabel(d.imports.gaji.Periode) : 'belum diimport'}</b></span></li><li>${ic('child_care')}<span><b>${fmtNum((d.alerts || []).length)}</b> alert tunjangan anak</span></li></ul>${NC_CUBE}
      <div class="nc-act"><button class="btn btn-amber" data-act="nav" data-r="persetujuan"><span>Tinjau Antrean${d.pending.total ? ' (' + fmtNum(d.pending.total) + ')' : ''}</span>${ic('arrow_forward')}</button><button class="btn btn-white" data-act="nav" data-r="gaji" data-tab="import"><span>Import Rincian Gaji</span>${ic('upload_file')}</button></div></div>`;
  },
  cBantuan() {
    return `<div class="navy-card"><span class="nc-ic">${ic('support_agent', 's18')}</span><div><span class="caps">Layanan Kepegawaian</span><h3>Butuh Bantuan?</h3></div><p>Hubungi Pengelola Gaji Dinas Kesehatan via WhatsApp bila ada anomali NIP, SK KGB, atau data tunjangan.</p>
      <ul class="nc-list"><li>${ic('badge')}<span>Anomali NIP &amp; data diri</span></li><li>${ic('payments')}<span>Selisih gaji / SK KGB</span></li><li>${ic('family_restroom')}<span>Tunjangan keluarga</span></li></ul>${NC_CUBE}
      <div class="nc-act"><a class="btn btn-amber" href="${esc(waLink())}" target="_blank" rel="noopener"><span>Hubungi Sekarang</span>${ic('arrow_forward')}</a></div></div>`;
  },
  cLaporan(d) {
    return `<div class="navy-card"><span class="nc-ic">${ic('summarize', 's18')}</span><h3>Rekap &amp; Laporan</h3><p>Unduh rekap data pegawai, tunjangan keluarga, riwayat SK${isSA() ? ', dan rincian gaji per periode' : ''} dalam format Excel atau PDF.</p>${d && d.autoNonaktif !== undefined ? `<p class="nc-more"><b>${fmtNum(d.autoNonaktif)} anak</b> — tunjangan dinonaktifkan otomatis bulan ini.</p>` : ''}
      <div class="nc-act"><button class="btn btn-white" data-act="nav" data-r="laporan"><span>Buka Laporan / Export</span>${ic('print')}</button></div></div>`;
  },
  cPeriode() {
    const n = new Date(), y = n.getFullYear(), m = n.getMonth(), last = new Date(y, m + 1, 0).getDate();
    const act = isSA() ? 'data-act="nav" data-r="gaji" data-tab="import" aria-label="Kelola rincian gaji periode ini"' : isPeg() ? 'data-act="nav" data-r="cekgaji" aria-label="Cek gaji"' : '';
    const tag = act ? 'button' : 'div';
    return `<${tag} ${act ? 'type="button" ' + act : ''} class="periode-card rail-full"><span class="card-ic">${ic('calendar_month', 's22')}</span><span class="grow"><small>Periode Siklus Gaji</small><b>1 ${BLS[m]} – ${last} ${BLS[m]} ${y}</b></span>${act ? ic('chevron_right', 's18 muted') : ''}</${tag}>`;
  },
  cCal() {
    const c = this.cal, start = (new Date(c.y, c.m, 1).getDay() + 6) % 7, days = new Date(c.y, c.m + 1, 0).getDate(), prevDays = new Date(c.y, c.m, 0).getDate(), td = todayYmd();
    const by = {}; this.ev.forEach((e) => { const o = by[e.d] || (by[e.d] = { b: 0, r: 0 }); o[e.r ? 'r' : 'b']++; });
    const total = Math.ceil((start + days) / 7) * 7;
    let cells = '';
    for (let i = 0; i < total; i++) {
      const dd = i - start + 1; let y = c.y, m = c.m, n = dd, out = false;
      if (dd < 1) { out = true; m = c.m - 1; n = prevDays + dd; if (m < 0) { m = 11; y--; } } else if (dd > days) { out = true; m = c.m + 1; n = dd - days; if (m > 11) { m = 0; y++; } }
      const k = `${y}-${pad2(m + 1)}-${pad2(n)}`, e = by[k];
      cells += `<button type="button" class="cal-d${out ? ' out' : ''}${k === td ? ' today' : ''}${k === c.sel ? ' sel' : ''}${i % 7 === 6 ? ' sun' : ''}" data-act="calSel" data-d="${k}" aria-pressed="${k === c.sel}" aria-label="${n} ${BLN[m]} ${y}${e ? ', ' + (e.b + e.r) + ' agenda' : ''}"><span>${n}</span>${e ? `<span class="dots">${e.b ? '<i></i>' : ''}${e.r ? '<i class="r"></i>' : ''}</span>` : ''}</button>`;
    }
    return `<div class="card" data-cal><div class="cal-head"><div class="card-t">Kalender Kerja</div><div class="cal-nav"><button type="button" data-act="calNav" data-v="-1" aria-label="Bulan sebelumnya">${ic('chevron_left', 's18')}</button><span>${BLN[c.m]} ${c.y}</span><button type="button" data-act="calNav" data-v="1" aria-label="Bulan berikutnya">${ic('chevron_right', 's18')}</button></div></div>
      <div class="cal-grid">${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((x, i) => `<div class="dow ${i === 5 ? 'sat' : i === 6 ? 'sun' : ''}">${x}</div>`).join('')}${cells}</div>
      <div class="cal-leg"><span><i></i>Pengajuan masuk</span><span><i class="r"></i>Tenggat tunjangan anak</span></div></div>`;
  },
  cAgenda() {
    const c = this.cal, pre = `${c.y}-${pad2(c.m + 1)}`;
    const list = this.ev.filter((e) => (c.sel ? e.d === c.sel : e.d.slice(0, 7) === pre)), n = list.length, max = this.calAll ? 60 : 4;
    return `<div class="agenda" data-agenda><div class="row between" style="min-height:24px"><span class="caps">${c.sel ? 'Agenda ' + fmtTgl(c.sel, true) : 'Agenda ' + BLN[c.m] + ' ' + c.y}${n ? ' · ' + n : ''}</span>${c.sel ? `<button class="link-btn" data-act="calSel" data-d="${c.sel}" style="min-height:24px;padding:0">Seluruh bulan</button>` : ''}</div>
      ${n ? list.slice(0, max).map((e) => `<button type="button" class="ag-card ${e.r ? 'r' : ''}" ${e.act}><span class="ag-date"><b>${e.d.slice(8, 10)}</b><small>${BLS[+e.d.slice(5, 7) - 1]}</small></span><span style="min-width:0"><span class="ag-t" style="display:block">${esc(e.t)}</span><span class="ag-s" style="display:block">${esc(e.s)}</span></span></button>`).join('') : `<div class="ag-empty">${c.sel ? 'Tidak ada agenda pada tanggal ini.' : 'Belum ada agenda pada bulan ini.'}</div>`}
      ${n > max ? `<button class="link-btn" data-act="calAll" style="align-self:center">Tampilkan ${n - max} agenda lainnya ${ic('expand_more', 's16')}</button>` : ''}</div>`;
  },
  calRender() {
    const f = document.activeElement, fk = f && f.closest && f.closest('[data-cal],[data-agenda]') ? (f.dataset.act === 'calNav' ? `[data-act="calNav"][data-v="${f.dataset.v}"]` : f.dataset.d ? `[data-act="calSel"][data-d="${f.dataset.d}"]` : '') : '';
    const a = $('#pg-dashboard [data-cal]'), b = $('#pg-dashboard [data-agenda]');
    if (a) a.outerHTML = this.cCal();
    if (b) b.outerHTML = this.cAgenda();
    if (fk) { const n = $('#pg-dashboard [data-cal] ' + fk); if (n) n.focus(); }
  },
  fuChip(x) {
    if (x.lewat) return ['b-bad', `Pengajuan Lewat ${x.maxH} Hari`];
    if (x.aUrg) return ['b-bad', x.aTipe === 'KULIAH' ? 'SK Kuliah Segera Habis' : x.aTipe === 'LEWAT' ? 'Anak Lewat 21 Th' : `Anak Genap 21 Th (H-${x.aH})`];
    if (x.p) return ['b-warn', (JENIS_LABEL[x.pj] || 'Pengajuan') + ' Butuh Tinjauan'];
    if (x.a) return ['b-warn', 'Anak Mendekati 21 Th'];
    return ['b-warn', 'Data Belum Lengkap'];
  },
  hitungFU(d) {
    const amb = this.ambang(), by = {};
    const get = (nip) => by[nip] || (by[nip] = { p: 0, lewat: 0, maxH: -1, pid: '', pj: '', a: 0, aUrg: 0, aTipe: '', aH: 0 });
    this.pendingRows(d).forEach((r) => { const o = get(String(r.NIP)); o.p++; if (r.hari > amb) o.lewat++; if (r.hari > o.maxH) { o.maxH = r.hari; o.pid = r.ID; o.pj = r.Jenis; } });
    (d.alerts || []).forEach((a) => { const o = get(String(a.nip)), urg = a.tipe === 'LEWAT' || a.tipe === 'H-30' || (a.tipe === 'KULIAH' && a.hari <= 7); o.a++; if (urg) o.aUrg++; if (!o.aTipe || urg) { o.aTipe = a.tipe; o.aH = a.hari; } });
    const list = [];
    S.idx.rows.forEach((p) => {
      if ((p.StatusKeaktifan || 'Aktif') !== 'Aktif') return;
      const o = by[p.NIP] || get(p.NIP), k = p.Lengkap ? 0 : (String(p.KategoriKosong || '').split(',').filter((x) => x.trim()).length || 1);
      const skor = o.lewat * 100 + o.aUrg * 80 + o.p * 30 + o.a * 20 + k * 5;
      if (skor) list.push(Object.assign({}, o, { peg: p, k, skor }));
    });
    return list.sort((a, b) => b.skor - a.skor || String(a.peg.Nama).localeCompare(String(b.peg.Nama)));
  },
  fuCard(x) {
    const p = x.peg, chip = this.fuChip(x), nm = esc(p.Nama), nip = esc(p.NIP);
    const pri = isSA() && x.pid ? [`data-act="nav" data-r="persetujuan" ${dp({ id: x.pid })}`, 'fact_check', 'Tinjau pengajuan'] : isAdm() ? [`data-act="nav" data-r="ajukan" ${dp({ nip: p.NIP })}`, 'edit_document', 'Ajukan perubahan'] : [`data-act="pgDetail" data-nip="${nip}"`, 'edit_note', 'Edit data langsung'];
    return `<div class="fu-card" data-prefetch="${nip}"><div class="fu-av">${avatar(p.Nama, 'lg')}<i class="${x.lewat || x.aUrg ? 'r' : ''}"></i></div><b class="truncate">${nm}</b><small class="truncate">${esc(p.Jabatan || 'Jabatan belum diisi')} · ${esc(p.UnitKerja || '-')}</small><small class="mono">NIP ${fmtNip(p.NIP)}</small><span class="badge ${chip[0]}">${esc(chip[1])}</span>
      <div class="fu-stats"><div><b class="${x.k ? 'r' : ''}">${x.k}</b><small>Kosong</small></div><div><b class="${x.p ? 'a' : ''}">${x.p}</b><small>Pending</small></div><div><b class="${x.a ? 'b' : ''}">${x.a}</b><small>Alert Anak</small></div></div>
      <div class="fu-act"><button type="button" class="cbtn" data-act="pgDetail" data-nip="${nip}" aria-label="Lihat detail ${nm}" title="Lihat detail">${ic('visibility', 's18')}</button><button type="button" class="cbtn" data-act="pgDetail" data-nip="${nip}" data-tab="keluarga" aria-label="Data keluarga ${nm}" title="Data keluarga">${ic('family_restroom', 's18')}</button><button type="button" class="cbtn pri" ${pri[0]} aria-label="${pri[2]} ${nm}" title="${pri[2]}">${ic(pri[1], 's18')}</button></div></div>`;
  },
  tindakLanjut(d) {
    if (!S.idx.rows.length) return '';
    this.fu = this.hitungFU(d);
    const n = this.fu.length;
    if (!n) return `<div class="banner ok">${ic('task_alt')}<div><b>Tidak ada pegawai yang perlu tindak lanjut</b><p>Data lengkap, tidak ada pengajuan tertunda maupun alert tunjangan anak.</p></div></div>`;
    return `<div class="sec-h"><h2>${ic('priority_high', 's22')}Pegawai Perlu Tindak Lanjut</h2><span class="row" style="gap:10px"><small>${fmtNum(n)} pegawai butuh perhatian · urut prioritas</small>${n > 3 ? `<button class="link-btn" data-act="dashFuAll">Lihat Semua ${ic('arrow_forward', 's16')}</button>` : ''}</span></div>
      <div class="fu-grid">${this.fu.slice(0, 3).map((x) => this.fuCard(x)).join('')}</div>`;
  },
  cPerBulan(pb, judul) {
    const th = this.tahun, data = pb.data[th] || [];
    const seri = [{ l: 'Disetujui', c: '--chart-4' }, { l: 'Pending', c: '--chart-6' }, { l: 'Ditolak', c: '--chart-5' }];
    const sum = [0, 1, 2].map((k) => data.reduce((s, x) => s + x[k], 0)), tot = sum[0] + sum[1] + sum[2];
    return `<div class="card chart-card"><div class="card-h"><div style="min-width:0"><div class="card-t"><span class="ms s18" style="color:var(--primary-text)">bar_chart</span>${judul || 'Tren Pengajuan Bulanan'}</div><div class="card-s">${fmtNum(tot)} pengajuan sepanjang ${th}</div></div>
      <select class="select" style="width:auto;min-height:34px;font-size:12.5px;padding-left:12px" data-change="dashTahun" aria-label="Pilih tahun">${pb.tahun.map((y) => `<option ${y === th ? 'selected' : ''}>${y}</option>`).join('')}</select></div>
      <div class="chart-box">${Chart.stack(data, seri, { tahun: th, h: 178 })}</div>
      <div class="tren-leg">${seri.map((s, i) => `<span><i style="background:var(${s.c})"></i>${s.l} (${fmtNum(sum[i])})</span>`).join('')}</div></div>`;
  },
  cStatus(st, judul) {
    const segs = [{ v: st.Aktif, c: '--chart-1', l: 'Aktif' }, { v: st.Pensiun, c: '--chart-6', l: 'Pensiun' }, { v: st.Pindah, c: '--chart-3', l: 'Pindah' }, { v: st.Meninggal, c: '--chart-5', l: 'Meninggal' }];
    return `<div class="card chart-card"><div class="card-h"><div class="card-t"><span class="ms s18" style="color:var(--primary-text)">donut_large</span>${judul || 'Status Kepegawaian'}</div><span class="muted" style="font-size:12px">Total ${fmtNum(st.total)}</span></div>
      <div class="st-wrap">${Chart.donut(segs, { size: 150, thick: 16, center: `<div class="kpi">${fmtNum(st.Aktif)}</div><div class="caps" style="font-size:10px">Aktif</div>` })}<div class="st-leg">${segs.map((s) => `<div><span><i style="background:var(${s.c})"></i>${s.l}</span><b>${fmtNum(s.v)}</b></div>`).join('')}</div></div>
      <div class="card-f"><span>Keaktifan dari data master pegawai</span>${isPeg() ? '' : `<button class="link-btn" data-act="nav" data-r="pegawai">Daftar Pegawai ${ic('arrow_forward', 's16')}</button>`}</div></div>`;
  },
  cStatusPengajuan(st, judul) {
    const tot = st.Pending + st.Disetujui + st.Ditolak;
    return `<div class="card chart-card" style="min-height:0"><div class="card-h"><div class="card-t"><span class="ms s18" style="color:var(--primary-text)">pie_chart</span>${judul || 'Status Pengajuan Unit'}</div></div>
      <div class="st-wrap">${Chart.donut([{ v: st.Disetujui, c: '--chart-4', l: 'Disetujui' }, { v: st.Pending, c: '--chart-6', l: 'Pending' }, { v: st.Ditolak, c: '--chart-5', l: 'Ditolak' }], { size: 128, thick: 14, center: `<div class="kpi sm">${tot}</div><div class="caps" style="font-size:9.5px">Pengajuan</div>` })}
      <div class="st-leg">${[['Pending', st.Pending, '--chart-6'], ['Disetujui', st.Disetujui, '--chart-4'], ['Ditolak', st.Ditolak, '--chart-5']].map((x) => `<div><span><i style="background:var(${x[2]})"></i>${x[0]}</span><b>${x[1]}</b></div>`).join('')}</div></div></div>`;
  },
  hchip(a) { if (a.tipe === 'LEWAT' || a.hari < 0) return ['r', 'Lewat']; return [a.hari <= 7 ? 'r' : a.hari <= 30 ? 'a' : 'g', (a.tipe === 'KULIAH' ? 'SK ' : '') + 'H-' + a.hari]; },
  alItem(a, self) {
    const c = this.hchip(a);
    const act = self ? `data-act="nav" data-r="ajukan" ${dp({ jenis: 'KELUARGA' })}` : `data-act="pgDetail" data-nip="${esc(a.nip)}" data-tab="keluarga"`;
    const sub = a.tipe === 'KULIAH' ? `Surat Aktif Kuliah berakhir ${fmtTgl(a.berlaku, true)}` : `21 th pada ${fmtTgl(a.tgl21, true)} · Surat kuliah ${a.dok === 'Sudah' ? 'sudah' : 'belum'} diunggah`;
    return `<button type="button" class="al-item" ${act}><span style="min-width:0;flex:1"><b>${esc(a.anak)}${self ? '' : ` <span class="muted" style="font-weight:500">(anak ${esc(a.pegawai)})</span>`}</b><small>${self ? '' : esc(a.unit) + ' · '}${sub}</small></span><span class="hchip ${c[0]}">${c[1]}</span></button>`;
  },
  cAlert(alerts, judul, opsi) {
    opsi = opsi || {};
    const list = alerts.slice(0, opsi.max || 4);
    const upload = opsi.self && alerts.some((a) => a.dok === 'Belum' || a.tipe === 'KULIAH');
    return `<div class="card" style="display:flex;flex-direction:column"><div class="card-h"><div class="card-t"><span class="ms s18" style="color:var(--danger-fg)">warning</span>${judul || 'Peringatan Usia Anak 21 Th'}</div>${alerts.length ? `<span class="badge b-bad">${alerts.length} anak</span>` : ''}</div>
      <p class="muted" style="font-size:12px;margin:-6px 0 10px">Anak yang berusia 21 tahun ≤ 90 hari & Surat Aktif Kuliah yang habis masa semesternya ≤ 30 hari — risiko kelebihan bayar tunjangan.</p>
      <div class="al-list">${list.length ? list.map((a) => this.alItem(a, opsi.self)).join('') : `<div class="banner ok">${ic('task_alt')}<div><b>Tidak ada alert</b><p>Tidak ada anak yang mendekati usia 21 tahun.</p></div></div>`}</div>
      ${upload || alerts.length || opsi.note ? `<div class="card-f">${upload ? `<button class="btn btn-sm btn-primary" data-act="nav" data-r="ajukan" ${dp({ jenis: 'KELUARGA' })}>${ic('upload_file', 's18')}Unggah Surat Aktif Kuliah</button>` : `<span>${opsi.note || ''}</span>`}${alerts.length ? `<button class="link-btn" data-act="dashAlertAll">Kelola Semua Alert ${ic('arrow_forward', 's16')}</button>` : ''}</div>` : ''}</div>`;
  },

  alertItem(a, self) {
    if (a.tipe === 'KULIAH') {
      return `<div class="mini alert-mini ${a.hari <= 7 ? 'h30' : ''}"><div class="grow" style="min-width:0"><div class="row between"><b class="truncate">${ic('school', 's16')} ${esc(a.anak)}</b><span class="badge ${a.hari <= 7 ? 'b-bad' : 'b-warn'}">SK Kuliah</span></div>
        <small>${self ? '' : esc(a.pegawai) + ' · ' + esc(a.unit) + ' · '}Surat Aktif Kuliah berakhir <b style="display:inline;font-size:11.5px">${fmtTgl(a.berlaku, true)}</b> (${a.hari > 0 ? a.hari + ' hari lagi' : a.hari === 0 ? 'hari ini' : 'sudah lewat'})</small>
        <small>Wajib unggah surat semester berikutnya — berlaku 1 semester.</small></div></div>`;
    }
    const cls = a.tipe === 'H-90' ? '' : 'h30';
    const lbl = a.tipe === 'LEWAT' ? 'Lewat 21 th' : a.tipe;
    return `<div class="mini alert-mini ${cls}"><div class="grow" style="min-width:0"><div class="row between"><b class="truncate">${ic(a.tipe === 'H-90' ? 'warning' : 'error', 's16')} ${esc(a.anak)}</b><span class="badge ${a.tipe === 'H-90' ? 'b-warn' : 'b-bad'}">${lbl}</span></div>
      <small>${self ? '' : esc(a.pegawai) + ' · ' + esc(a.unit) + ' · '}21 th pada <b style="display:inline;font-size:11.5px">${fmtTgl(a.tgl21, true)}</b> (${a.hari > 0 ? a.hari + ' hari lagi' : 'sudah lewat'})</small>
      <small>Surat Aktif Kuliah: ${a.dok === 'Sudah' ? '<span style="color:var(--success);font-weight:600">sudah diunggah</span>' : '<span style="color:var(--danger);font-weight:600">belum diunggah</span>'}</small></div></div>`;
  },
  tabelTerbaru(rows, judul, cols, nPending) {
    const self = cols === 'self';
    return `<div class="card" style="min-width:0"><div class="card-h" style="flex-wrap:wrap"><div style="min-width:0"><div class="card-t"><span class="ms s18" style="color:var(--primary-text)">mark_email_unread</span>${judul || 'Pengajuan Terbaru'}${nPending ? `<span class="badge b-bad" title="Menunggu persetujuan">${nPending}</span>` : ''}</div><div class="card-s">Pengajuan perubahan data terkini</div></div>
      <div class="row wrap"><button class="btn btn-outline btn-sm" data-act="nav" data-r="riwayat">${ic('history', 's18')}Semua Pengajuan</button>${isSA() ? `<button class="btn btn-primary btn-sm" data-act="nav" data-r="persetujuan">Buka Layar Persetujuan${ic('open_in_new', 's16')}</button>` : ''}</div></div>
      ${rows.length ? `<div class="tbl-wrap responsive"><table class="tbl"><thead><tr>${self ? '' : '<th>Pegawai / NIP</th><th class="c-unit">Unit Kerja</th>'}<th>Jenis &amp; Nomor SK / Usulan</th><th>Tanggal Masuk</th><th>Status</th><th class="c-act">Aksi</th></tr></thead><tbody>
      ${rows.map((r) => `<tr>${self ? '' : `<td><div class="person" style="min-width:170px">${avatar(r.Nama)}<div style="min-width:0"><b>${esc(r.Nama)}</b><small class="mono">${fmtNip(r.NIP)}</small><span class="u-inl">${esc(r.UnitKerja)}</span></div></div></td><td class="c-unit">${esc(r.UnitKerja)}</td>`}<td style="max-width:240px"><span class="chip">${ic(JENIS_IC[r.Jenis] || 'description', 's14')}${esc(JENIS_LABEL[r.Jenis] || r.Jenis)}</span><div class="muted truncate mono" style="font-size:11px;margin-top:4px" title="${esc(r.Ringkasan)}">${esc(r.Ringkasan || '—')}</div></td><td class="nowrap">${fmtTgl(r.TglPengajuan, true)}</td><td>${bStatus(r.Status)}</td><td class="c-act"><button class="btn btn-xs ${r.Status === 'Pending' && isSA() ? 'btn-primary' : 'btn-outline'}" data-act="lihatPengajuan" data-id="${esc(r.ID)}">${r.Status === 'Pending' && isSA() ? 'Tinjau' : 'Detail'}</button></td></tr>`).join('')}</tbody></table></div>
      <div class="cards-list">${rows.map((r) => `<div class="li-card"><div class="row between"><div class="row" style="min-width:0">${avatar(r.Nama)}<div style="min-width:0"><b class="truncate" style="display:block">${esc(self ? JENIS_LABEL[r.Jenis] : r.Nama)}</b><div class="muted" style="font-size:12px">${esc(self ? fmtTgl(r.TglPengajuan, true) : JENIS_LABEL[r.Jenis] + ' · ' + fmtTgl(r.TglPengajuan, true))}</div></div></div>${bStatus(r.Status)}</div><div class="muted" style="font-size:12px">${esc(r.Ringkasan)}</div><button class="btn btn-sm btn-outline" data-act="lihatPengajuan" data-id="${esc(r.ID)}">Detail</button></div>`).join('')}</div>`
      : emptyBox('Belum ada pengajuan', 'Pengajuan perubahan data akan tampil di sini.', 'inbox')}</div>`;
  },
  cImport(imp) {
    const g = imp.gaji, pg = imp.pegawai;
    return `<div class="card"><div class="card-h"><div class="card-t"><span class="ms s18" style="color:var(--success-fg)">cloud_done</span>Import Gaji Terakhir</div>${g ? `<span class="badge ${+g.Gagal ? 'b-warn' : 'b-ok'}">${+g.Gagal ? 'Ada Gagal' : 'Berhasil'}</span>` : ''}</div>
      ${g ? `<div class="kvl"><div><span>Periode</span><b>${g.Periode ? periodeLabel(g.Periode) : '—'}</b></div><div><span>Tanggal Sync</span><b>${fmtWaktu(g.Waktu)}</b></div><div><span>Total Terproses</span><b style="color:var(--success)">${fmtNum(g.Berhasil)} pegawai</b></div><div><span>Gagal Validasi</span><b style="color:${+g.Gagal ? 'var(--danger)' : 'var(--text-1)'}">${fmtNum(g.Gagal)} pegawai</b></div><div><span>Oleh</span><b class="truncate">${esc(g.Oleh)}</b></div></div>` : `<p class="muted" style="font-size:12.5px">Tidak ada import gaji dalam 30 hari terakhir.</p>`}
      <div class="mini mt-12"><span class="ic">${ic('group')}</span><div class="grow" style="min-width:0"><b>Import Data Pegawai</b><small>${pg ? `${fmtWaktu(pg.Waktu)} · ${fmtNum(pg.Berhasil)} berhasil, ${fmtNum(pg.Gagal)} gagal` : 'Tidak ada import dalam 30 hari terakhir'}</small></div></div>
      <div class="row mt-12" style="gap:8px"><button class="btn btn-soft btn-sm grow" data-act="nav" data-r="kelola" data-tab="import">${ic('group_add', 's18')}Import Pegawai</button><button class="btn btn-primary btn-sm grow" data-act="nav" data-r="gaji" data-tab="import">${ic('upload_file', 's18')}Import Gaji</button></div></div>`;
  },
  cKelSaya(k, ok) {
    return `<div class="card ring-card"><div class="card-t">Kelengkapan Data Saya</div>${this.ring(Math.round((ok / 6) * 100), ok + '/6')}
      <div class="stack-8" style="gap:4px;align-self:stretch;text-align:left">${k.kategori.map((x) => `<div class="row" style="font-size:12.5px;gap:6px">${ic(x.ok ? 'check_circle' : 'radio_button_unchecked', 's16')}<span style="color:${x.ok ? 'var(--text-1)' : 'var(--text-2)'}">${esc(x.nama)}</span></div>`).join('')}</div>
      ${ok < 6 ? `<button class="btn btn-soft btn-sm btn-block" data-act="nav" data-r="ajukan">Lengkapi Data ${ic('arrow_forward', 's16')}</button>` : bStatus('Lengkap')}</div>`;
  },

  cekupBanner() {
    return `<div class="insight cekup" role="note"><span class="card-ic">${ic('monitor_heart', 's18')}</span><div class="grow" style="min-width:220px"><b style="font-size:14px">Sudah Cekup Data Bulan Ini?</b><p class="mt-4" style="color:var(--text-2);font-size:13px">Segera laporkan dan perbarui perubahan data SK KGB, Pangkat, Jabatan atau Tunjangan Keluarga sebelum batas waktu tutup buku bulanan untuk menghindari keterlambatan maupun selisih bayar.</p></div><button class="btn btn-primary btn-sm" data-act="nav" data-r="ajukan" style="align-self:center">${ic('edit_document', 's18')}Cekup Sekarang</button></div>`;
  },
  insight(list) {
    return `<div class="insight"><span class="card-ic">${ic('auto_awesome', 's18')}</span><div class="grow"><b style="font-size:13px">Ringkasan Cerdas Hari Ini</b><ul class="mt-4">${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`;
  },

  superadmin(d) {
    const st = d.status, al = d.alerts || [], amb = d.pending.ambang, pend = this.pendingRows(d);
    const totPgj = S.pengajuan && S.pengajuan.mode === 'full' ? S.pengajuan.total : Object.keys(d.perBulan.data).reduce((s, y) => s + d.perBulan.data[y].reduce((t, x) => t + x[0] + x[1] + x[2], 0), 0);
    const n30 = al.filter((a) => a.tipe === 'H-30' || a.tipe === 'LEWAT').length, n90 = al.filter((a) => a.tipe === 'H-90').length, nk = al.filter((a) => a.tipe === 'KULIAH').length;
    const segG = [{ v: d.gender.P, c: '--chart-1', l: 'Perempuan' }, { v: d.gender.L, c: '--chart-2', l: 'Laki-laki' }];
    const totG = d.gender.P + d.gender.L;
    const golItems = d.golongan.map((g) => ({ l: g.g, v: g.n, c: g.g === 'PPPK' ? '--chart-6' : (/^IV/.test(g.g) ? '--chart-4' : /^III/.test(g.g) ? '--chart-1' : /^II\x2F/.test(g.g) ? '--chart-3' : '--chart-2'), t: g.g === 'PPPK' ? 'PPPK (semua golongan)' : 'Golongan ' + g.g }));
    const golMax = d.golongan.filter((g) => g.g !== 'PPPK').sort((a, b) => b.n - a.n)[0];
    const jab = d.jabatan.top.map((j, i) => ({ l: j.nama, v: j.n, c: SERI_COL[i % 6] })).concat(d.jabatan.lainnya ? [{ l: 'Jabatan Lainnya', v: d.jabatan.lainnya, c: '--text-3' }] : []);
    return `${pageHead(['Utama', 'Dashboard'], 'Dashboard Superadmin', `Ringkasan data ±${fmtNum(st.total)} pegawai di ${S.master.unit.length} unit kerja Dinas Kesehatan Minahasa Selatan.`)}
    <div class="dash">
    ${this.insight(d.insight || [])}
    <div class="d-top"><div class="d-main">
      <div class="kpis">
        ${this.kpi({ ic: 'groups', tone: 'blue', t: 'Total Pegawai Aktif', v: fmtNum(st.Aktif), m: `Pensiun ${fmtNum(st.Pensiun)} · Pindah ${fmtNum(st.Pindah)} · Meninggal ${fmtNum(st.Meninggal)}`, act: 'data-act="nav" data-r="pegawai"' })}
        ${this.kpi({ ic: 'pending_actions', tone: 'green', t: 'Pengajuan Pending', v: fmtNum(d.pending.total), sub: `/ ${fmtNum(totPgj)} total`, m: d.pending.lewat ? `${d.pending.lewat} menunggu > ${amb} hari` : 'Tidak ada yang terlambat', mt: d.pending.lewat ? 'bad' : 'ok', act: 'data-act="nav" data-r="persetujuan"' })}
        ${this.kpi({ ic: 'child_care', tone: 'amber', t: 'Alert Tunjangan Anak', v: fmtNum(al.length), m: `H-30: ${n30} · H-90: ${n90} · SK Kuliah: ${nk}`, mt: n30 ? 'bad' : '', act: 'data-act="dashAlertAll"' })}
      </div>
      <div class="d-row2"><div class="d-stack">${this.cRing(d.kelengkapan, true)}${this.cSla(pend)}</div>${this.cUnitProg(d)}${this.cPintasan(d)}</div>
      ${this.tindakLanjut(d)}
    </div><div class="d-rail">${this.cPeriode()}${this.cCal()}${this.cAgenda()}</div></div>
    <div class="d-row3">${this.cPerBulan(d.perBulan)}${this.cStatus(st)}${this.cAlert(al)}</div>
    <div class="d-row4">${this.tabelTerbaru(d.terbaru, 'Pengajuan Terbaru', null, d.pending.total)}<div class="d-stack">${this.cImport(d.imports)}${this.cLaporan(d)}</div></div>
    <div class="sec-h"><h2><span class="ms s22" style="color:var(--primary-text)">insights</span>Statistik Kepegawaian</h2><small>Pegawai aktif</small></div>
    <div class="d-row3">
      <div class="card chart-card"><div class="card-h"><div class="card-t">Pegawai per Jenis Kelamin</div><span class="muted" style="font-size:12px">Pegawai aktif</span></div>
        <div class="chart-box" style="align-items:flex-end">${Chart.semi(segG, { w: 240, center: `<div class="kpi">${totG ? Math.round((Math.max(d.gender.P, d.gender.L) / totG) * 100) : 0}%</div><div class="muted" style="font-size:11.5px;font-weight:600">${d.gender.P >= d.gender.L ? 'Perempuan' : 'Laki-laki'}</div>` })}</div>
        <div class="grid mt-12" style="gap:10px">${segG.map((s) => `<div class="stat-bar" style="grid-column:span 6"><i style="background:var(${s.c})"></i><div><small class="muted">${s.l}</small><b>${fmtNum(s.v)} <span class="faint" style="font-size:12px;font-weight:600">(${totG ? Math.round((s.v / totG) * 100) : 0}%)</span></b></div></div>`).join('')}</div>
        ${d.gender.X ? `<p class="faint mt-8" style="font-size:11.5px">${d.gender.X} pegawai belum mengisi jenis kelamin.</p>` : ''}</div>
      <div class="card chart-card"><div class="card-h"><div><div class="card-t">Pegawai per Pangkat/Golongan</div><div class="card-s">Urut I/a → IV/e, PPPK digabung</div></div></div><div class="chart-box">${Chart.vbars(golItems, { h: 170, gap: 3 })}</div>
        <div class="card-f"><span>${golMax && golMax.n ? `Terbanyak: <b>Golongan ${golMax.g}</b> (${fmtNum(golMax.n)} pegawai)` : 'Belum ada data golongan'}</span><button class="link-btn" data-act="nav" data-r="pegawai">Daftar ${ic('arrow_forward', 's16')}</button></div></div>
      <div class="card chart-card"><div class="card-h"><div><div class="card-t">Pegawai per Jabatan (Top 10)</div><div class="card-s">${d.jabatan.jumlahJenis} jenis jabatan · sisanya "Jabatan Lainnya"</div></div></div><div style="max-height:236px;overflow-y:auto;padding-right:4px">${Chart.hbars(jab, { rank: true, pct: true, unit: 'pegawai' })}</div></div>
    </div>
    </div>`;
  },

  admin(d) {
    const st = d.pengajuanStatus, tot = st.Pending + st.Disetujui + st.Ditolak, ps = d.status, al = d.alerts || [], pend = this.pendingRows(d);
    const n30 = al.filter((a) => a.tipe === 'H-30' || a.tipe === 'LEWAT').length, n90 = al.filter((a) => a.tipe === 'H-90').length, nk = al.filter((a) => a.tipe === 'KULIAH').length;
    return `${pageHead(['Utama', 'Dashboard'], 'Dashboard Admin Unit', `Ringkasan data pegawai <b>${esc(d.unit)}</b>.`, `<button class="btn btn-primary" data-act="nav" data-r="ajukan">${ic('edit_document', 's18')}Ajukan Perubahan</button>`)}
    <div class="dash">
    ${this.cekupBanner()}
    <div class="d-top"><div class="d-main">
      <div class="kpis">
        ${this.kpi({ ic: 'groups', tone: 'blue', t: 'Pegawai Aktif Unit', v: fmtNum(ps.Aktif), sub: `/ ${fmtNum(ps.total)} total`, m: `Pensiun ${fmtNum(ps.Pensiun)} · Pindah ${fmtNum(ps.Pindah)} · Meninggal ${fmtNum(ps.Meninggal)}`, act: 'data-act="nav" data-r="pegawai"' })}
        ${this.kpi({ ic: 'pending_actions', tone: 'green', t: 'Pengajuan Pending', v: fmtNum(st.Pending), sub: `/ ${fmtNum(tot)} total`, m: `Disetujui ${fmtNum(st.Disetujui)} · Ditolak ${fmtNum(st.Ditolak)}`, act: `data-act="nav" data-r="riwayat" ${dp({ status: 'Pending' })}` })}
        ${this.kpi({ ic: 'child_care', tone: 'amber', t: 'Alert Tunjangan Anak', v: fmtNum(al.length), m: `H-30: ${n30} · H-90: ${n90} · SK Kuliah: ${nk}`, mt: n30 ? 'bad' : '', act: 'data-act="dashAlertAll"' })}
      </div>
      <div class="d-row2"><div class="d-stack">${this.cRing(d.kelengkapan, true, 'Kelengkapan Data Unit')}${this.cSla(pend, true)}</div>${this.cKatProg(d.kelengkapan)}${this.cBantuan()}</div>
      ${this.tindakLanjut(d)}
    </div><div class="d-rail">${this.cPeriode()}${this.cCal()}${this.cAgenda()}</div></div>
    <div class="d-row3">${this.cPerBulan(d.perBulan, 'Tren Pengajuan Unit')}${this.cStatus(ps, 'Status Pegawai Unit')}${this.cAlert(al, 'Peringatan Usia Anak 21 Th')}</div>
    <div class="d-row4">${this.tabelTerbaru(d.terbaru, 'Pengajuan Terbaru Unit', null, st.Pending)}<div class="d-stack">${this.cStatusPengajuan(st)}${this.cLaporan()}</div></div>
    </div>`;
  },

  pegawai(d) {
    const st = d.pengajuanStatus, tot = st.Pending + st.Disetujui + st.Ditolak, k = d.kelengkapan, ok = k.kategori.filter((x) => x.ok).length;
    const p = S.profil ? S.profil.pegawai : {}, gp = S.gajiPeriode[0];
    return `${pageHead(['Utama', 'Dashboard'], 'Halo, ' + esc(String(S.user.nama).split(',')[0]), `${esc(p.Jabatan || '-')} · ${esc(p.UnitKerja || '')} · Golongan ${esc(p.Golongan || '-')}`)}
    <div class="dash">
    ${this.cekupBanner()}
    <div class="d-top"><div class="d-main">
      <div class="kpis">
        ${this.kpi({ ic: 'fact_check', tone: ok === 6 ? 'green' : 'amber', t: 'Kelengkapan Data', v: `${ok}<small>/ 6 kategori</small>`, m: ok === 6 ? 'Data Anda sudah lengkap' : `${6 - ok} kategori belum terisi`, mt: ok === 6 ? 'ok' : 'warn', act: allowed('profil') ? 'data-act="nav" data-r="profil"' : 'data-act="nav" data-r="ajukan"' })}
        ${this.kpi({ ic: 'pending_actions', tone: 'blue', t: 'Pengajuan Pending', v: fmtNum(st.Pending), sub: `/ ${fmtNum(tot)} total`, m: `Disetujui ${fmtNum(st.Disetujui)} · Ditolak ${fmtNum(st.Ditolak)}`, act: `data-act="nav" data-r="riwayat"` })}
        ${this.kpi({ ic: 'payments', tone: 'navy', t: 'Slip Gaji Terbaru', v: gp ? periodeLabel(gp) : 'Belum ada', txt: true, m: gp ? 'Lihat rincian penghasilan & potongan' : 'Rincian gaji bulanan', act: 'data-act="nav" data-r="cekgaji"' })}
      </div>
      <div class="d-row2"><div class="d-stack">${this.cKelSaya(k, ok)}</div>${this.cAlert(d.alerts, 'Alert Tunjangan Anak Saya', { self: true, max: 3 })}${this.cBantuan()}</div>
    </div><div class="d-rail">${this.cPeriode()}${this.cCal()}${this.cAgenda()}</div></div>
    <div class="card"><div class="card-h"><div class="card-t">Pintasan</div></div><div class="grid" style="gap:12px">
      ${[['ajukan', 'edit_document', 'Ajukan Perubahan', 'Data diri, keluarga, pangkat, jabatan, KGB, unit, cuti'], ['cekgaji', 'payments', 'Cek Gaji', gp ? 'Slip terbaru: ' + periodeLabel(gp) : 'Rincian gaji bulanan'], ['profil', 'account_circle', 'Profil Saya', 'Data lengkap & dokumen Anda']].map((x) => `<button class="mini g-4" style="padding:14px" data-act="nav" data-r="${x[0]}"><span class="ic" style="width:44px;height:44px;border-radius:999px">${ic(x[1])}</span><span class="grow" style="min-width:0"><b>${x[2]}</b><small class="truncate">${x[3]}</small></span>${ic('arrow_forward', 's18 muted')}</button>`).join('')}</div></div>
    <div class="d-row4">${this.tabelTerbaru(d.terbaru, 'Riwayat Pengajuan Terbaru', 'self')}<div class="d-stack">${this.cStatusPengajuan(st, 'Status Pengajuan Saya')}</div></div>
    </div>`;
  }
};
CHG.dashTahun = (el) => { PAGES.dashboard.tahun = el.value; PAGES.dashboard.show({}, true); };
ACT.calNav = (el) => { const P = PAGES.dashboard, c = P.cal; c.m += +el.dataset.v; if (c.m < 0) { c.m = 11; c.y--; } if (c.m > 11) { c.m = 0; c.y++; } c.sel = ''; P.calAll = false; P.calRender(); };
ACT.calSel = (el) => { const P = PAGES.dashboard, c = P.cal, k = el.dataset.d; c.sel = c.sel === k ? '' : k; c.y = +k.slice(0, 4); c.m = +k.slice(5, 7) - 1; P.calAll = false; P.calRender(); };
ACT.calAll = () => { PAGES.dashboard.calAll = true; PAGES.dashboard.calRender(); };
ACT.dashAlertAll = () => {
  const a = S.dash.alerts || [];
  Modal.open({ title: `${ic('child_care')} Alert Tunjangan Anak (${a.length})`, size: 'lg', body: a.length ? `<div class="stack-8">${a.map((x) => PAGES.dashboard.alertItem(x, isPeg())).join('')}</div>` : emptyBox('Tidak ada alert', 'Tidak ada anak yang mendekati usia 21 tahun.', 'task_alt') });
};
ACT.dashUnitAll = () => {
  const P = PAGES.dashboard;
  if (S.idx.mode !== 'full' || !S.idx.rows.length) {
    const d = S.dash, max = Math.max(1, ...d.unit.map((u) => u.n));
    Modal.open({ title: `${ic('apartment')} Pegawai Aktif per Unit Kerja`, size: 'lg', body: `<div class="unit-bars">${Chart.hbars(d.unit.map((u) => ({ l: u.nama, v: u.n, c: u.n ? '--chart-1' : '--chart-5' })), { max, unit: 'pegawai' })}</div>` });
    return;
  }
  const all = P.unitStats().sort((a, b) => a.nama.localeCompare(b.nama));
  Modal.open({ title: `${ic('apartment')} Kelengkapan Data per Unit Kerja (${all.length})`, size: 'lg', body: `<p class="muted mb-12" style="font-size:12.5px">Persentase pegawai aktif yang 6 kategori wajibnya sudah lengkap. Klik unit untuk membuka daftar pegawai yang belum lengkap.</p>
    <div class="up-list">${all.map((u) => (u.n ? P.upItem(u, `data-act="nav" data-r="pegawai" ${dp({ filter: { unit: u.nama, kelengkapan: 'Belum Lengkap' }, apply: true })}`) : `<div class="up-item" style="opacity:.75"><span class="up-av">${esc(initials(u.nama))}</span><span style="min-width:0"><b>${esc(u.nama)}</b><small style="color:var(--warning)">Belum ada pegawai aktif terdaftar</small></span><span class="up-pct">—</span></div>`)).join('')}</div>` });
};
ACT.dashFuAll = () => {
  const P = PAGES.dashboard;
  Modal.open({ title: `${ic('priority_high')} Pegawai Perlu Tindak Lanjut (${P.fu.length})`, size: 'lg', body: `<div class="stack-8">${P.fu.map((x) => { const c = P.fuChip(x); return `<div class="mini" style="flex-wrap:wrap">${avatar(x.peg.Nama)}<div class="grow" style="min-width:160px"><b class="truncate">${esc(x.peg.Nama)}</b><small class="truncate">${esc(x.peg.UnitKerja || '-')} · ${x.k} kosong · ${x.p} pending · ${x.a} alert anak</small></div><span class="badge ${c[0]}">${esc(c[1])}</span><button class="btn btn-xs btn-outline" data-act="dashFuOpen" data-nip="${esc(x.peg.NIP)}">${ic('visibility', 's16')}Detail</button></div>`; }).join('')}</div>` });
};
ACT.dashFuOpen = (el) => { while (Modal.closeTop()); bukaDetailPegawai(el.dataset.nip, el.dataset.tab); };

const FS = {
  DATA_DIRI: [
    { k: 'Nama', l: 'Nama Lengkap', t: 'text', req: 1, max: 120, span: 2 },
    { k: 'NIK', l: 'NIK', t: 'text', re: /^\d{16}$/, msg: 'NIK harus 16 digit angka.', im: 'numeric', max: 16, ph: '16 digit' },
    { k: 'JenisKelamin', l: 'Jenis Kelamin', t: 'select', opts: ['Laki-laki', 'Perempuan'] },
    { k: 'NoTelepon', l: 'No. Telepon / WhatsApp', t: 'tel', re: /^[0-9+\-\s]{8,18}$/, msg: 'Nomor telepon tidak valid.', ph: '08…' },
    { k: 'Email', l: 'Email (untuk notifikasi)', t: 'email', re: RE_EMAIL, msg: 'Format email tidak valid.', ph: 'nama@contoh.id' },
    { k: 'Alamat', l: 'Alamat', t: 'textarea', span: 'full', max: 300 }
  ],
  DATA_DIRI_SA: [
    { k: 'StatusPegawai', l: 'Status Pegawai', t: 'select', req: 1, opts: ['PNS', 'PPPK'] },
    { k: 'StatusKeaktifan', l: 'Status Keaktifan', t: 'select', req: 1, opts: () => S.master.keaktifan }
  ],
  PANGKAT: [
    { k: 'Golongan', l: 'Pangkat / Golongan', t: 'gol', req: 1 },
    { k: 'MasaKerja', l: 'Masa Kerja Golongan', t: 'text', ph: 'mis. 10 Thn 0 Bln', max: 40 },
    { k: 'TglDitetapkan', l: 'Tanggal Ditetapkan', t: 'date', req: 1 },
    { k: 'TglBerlaku', l: 'Tanggal Berlaku (TMT)', t: 'date', req: 1 },
    { k: 'NomorSK', l: 'Nomor SK', t: 'sk', req: 1, max: 120 },
    { k: 'GajiPokok', l: 'Gaji Pokok Baru (Rp)', t: 'money', req: 1 }
  ],
  JABATAN: [
    { k: 'Jabatan', l: 'Jabatan', t: 'jabatan', req: 1, max: 150, span: 2 },
    { k: 'TglDitetapkan', l: 'Tanggal Ditetapkan', t: 'date', req: 1 },
    { k: 'TglBerlaku', l: 'Tanggal Berlaku', t: 'date', req: 1 },
    { k: 'NomorSK', l: 'Nomor SK', t: 'sk', req: 1, max: 120, span: 2 }
  ],
  KGB: [
    { k: 'MasaKerja', l: 'Masa Kerja Baru', t: 'text', req: 1, ph: 'mis. 12 Thn 0 Bln', max: 40 },
    { k: 'GajiPokok', l: 'Gaji Pokok Baru (Rp)', t: 'money', req: 1 },
    { k: 'TglDitetapkan', l: 'Tanggal Penetapan', t: 'date', req: 1 },
    { k: 'TglBerlaku', l: 'Tanggal Berlaku', t: 'date', req: 1 },
    { k: 'NomorSK', l: 'Nomor SK', t: 'sk', req: 1, max: 120, span: 2 }
  ],
  UNIT: [
    { k: 'UnitKerja', l: 'Unit Kerja Baru', t: 'unit', req: 1, span: 2 },
    { k: 'TglDitetapkan', l: 'Tanggal Penetapan', t: 'date', req: 1 },
    { k: 'TglBerlaku', l: 'Tanggal Berlaku', t: 'date', req: 1 },
    { k: 'NomorSK', l: 'Nomor SK', t: 'sk', req: 1, max: 120, span: 2 }
  ],
  CUTI: [
    { k: 'JenisCuti', l: 'Jenis Cuti', t: 'select', req: 1, opts: () => S.master.jenisCuti, span: 2 },
    { k: 'TglMulai', l: 'Tanggal Mulai', t: 'date', req: 1 },
    { k: 'TglSelesai', l: 'Tanggal Berakhir', t: 'date', req: 1 },
    { k: 'Keterangan', l: 'Keterangan', t: 'textarea', span: 'full', max: 300 }
  ]
};
const FS_LABEL = {}; Object.keys(FS).forEach((k) => FS[k].forEach((f) => { FS_LABEL[f.k] = f.l; }));
Object.assign(FS_LABEL, { Pangkat: 'Pangkat', UnitKerja: 'Unit Kerja', JenisAnggota: 'Jenis Anggota', TanggalLahir: 'Tanggal Lahir', Pekerjaan: 'Pekerjaan', Hubungan: 'Hubungan', AnakKe: 'Anak ke-', StatusASN: 'Pasangan ASN', NIPPasangan: 'NIP Pasangan', StatusTunjangan: 'Status Tunjangan' });

function golOptions(val) {
  const pns = S.master.pangkat.filter((p) => p.j !== 'PPPK'), pppk = S.master.pangkat.filter((p) => p.j === 'PPPK');
  const o = (p) => `<option value="${esc(p.g)}" ${p.g === val ? 'selected' : ''}>${esc(p.g)} — ${esc(p.p)}</option>`;
  return `<option value="">— Pilih golongan —</option><optgroup label="PNS">${pns.map(o).join('')}</optgroup>${pppk.length ? `<optgroup label="PPPK">${pppk.map(o).join('')}</optgroup>` : ''}`;
}
const unitOptions = (val, kosong) => `<option value="">${esc(kosong || '— Pilih unit kerja —')}</option>` + S.master.unit.map((u) => `<option ${u === val ? 'selected' : ''}>${esc(u)}</option>`).join('');
const optList = (opts, val, kosong) => `<option value="">${esc(kosong || '— Pilih —')}</option>` + (typeof opts === 'function' ? opts() : opts).map((o) => `<option ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('');
const moneyFmt = (v) => (v === '' || v === null || v === undefined || isNaN(+v)) ? '' : Math.round(+v).toLocaleString('id-ID');

function fieldHtml(f, val, pfx) {
  const id = pfx + f.k, v = val === undefined || val === null ? '' : val;
  const lab = `<label for="${id}">${esc(f.l)}${f.req ? ' <span class="req">*</span>' : ''}</label>`;
  const span = f.span === 'full' ? 'full' : (f.span === 2 ? 'span2' : '');
  let inp;
  switch (f.t) {
    case 'select': inp = `<select class="select" id="${id}" name="${f.k}">${optList(f.opts, v)}</select>`; break;
    case 'gol': inp = `<select class="select" id="${id}" name="${f.k}">${golOptions(v)}</select>`; break;
    case 'unit': inp = `<select class="select" id="${id}" name="${f.k}">${unitOptions(v)}</select>`; break;
    case 'textarea': inp = `<textarea class="textarea" id="${id}" name="${f.k}" maxlength="${f.max || 300}" placeholder="${esc(f.ph || '')}">${esc(v)}</textarea>`; break;
    case 'date': inp = `<input class="input" type="date" id="${id}" name="${f.k}" value="${esc(String(v).slice(0, 10))}" max="2100-12-31">`; break;
    case 'money': inp = `<div class="input-ic"><span style="position:absolute;left:12px;top:12px;font-weight:600;color:var(--text-2)">Rp</span><input class="input num" id="${id}" name="${f.k}" inputmode="numeric" data-input="money" value="${esc(moneyFmt(v))}" placeholder="0" style="padding-left:38px"></div>`; break;
    case 'sk': inp = `<div class="input-ic">${ic('gavel')}<input class="input mono" id="${id}" name="${f.k}" value="${esc(v)}" maxlength="${f.max || 120}" placeholder="mis. 821/BKPSDM-MS/SK/IV/2026" autocomplete="off"></div>`; break;
    case 'jabatan': inp = `<input class="input" id="${id}" name="${f.k}" value="${esc(v)}" maxlength="${f.max || 150}" list="dl-jabatan" placeholder="Ketik atau pilih jabatan" autocomplete="off">`; break;
    default: inp = `<input class="input" type="${f.t === 'email' ? 'email' : f.t === 'tel' ? 'tel' : 'text'}" id="${id}" name="${f.k}" value="${esc(v)}" maxlength="${f.max || 200}" ${f.im ? `inputmode="${f.im}"` : ''} placeholder="${esc(f.ph || '')}" autocomplete="off">`;
  }
  return `<div class="field ${span}" data-f="${f.k}">${lab}${inp}<div class="ferr" hidden></div>${f.hint ? `<div class="fhint">${esc(f.hint)}</div>` : ''}</div>`;
}
const formHtml = (spec, vals, pfx, cls) => `<div class="fgrid ${cls || ''}">${spec.map((f) => fieldHtml(f, (vals || {})[f.k], pfx || 'f-')).join('')}</div>`;
const jabatanDatalist = () => `<datalist id="dl-jabatan">${(S.jabatanList || []).map((j) => `<option value="${esc(j)}">`).join('')}</datalist>`;
function readForm(root, spec) {
  const vals = {}, errs = {};
  spec.forEach((f) => {
    const el = root.querySelector(`[data-f="${f.k}"] [name="${f.k}"]`); if (!el) return;
    let v = String(el.value || '').trim();
    if (f.t === 'money') v = parseRp(v);
    if (f.k === 'NIK') v = digits(v);
    vals[f.k] = v;
    if (f.req && (v === '' || v === null)) errs[f.k] = f.l + ' wajib diisi.';
    else if (v !== '' && f.re && !f.re.test(String(v))) errs[f.k] = f.msg || f.l + ' tidak valid.';
  });
  if (vals.TglMulai && vals.TglSelesai && vals.TglSelesai < vals.TglMulai) errs.TglSelesai = 'Tanggal berakhir tidak boleh sebelum tanggal mulai.';
  return { vals, errs };
}
function showErrs(root, errs, noScroll) {
  $$('.field.err', root).forEach((f) => { f.classList.remove('err'); const e = f.querySelector('.ferr'); if (e) e.hidden = true; });
  let first = null;
  Object.keys(errs).forEach((k) => {
    const f = root.querySelector(`[data-f="${k}"], [data-dropwrap$="${k}"]`); if (!f) return;
    f.classList.add('err'); const e = f.querySelector('.ferr'); if (e) { e.hidden = false; e.innerHTML = ic('error', 's14') + esc(errs[k]); }
    if (!first) first = f;
  });
  if (first && !noScroll) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); const i = first.querySelector('input,select,textarea'); if (i) setTimeout(() => i.focus({ preventScroll: true }), 250); }
  return Object.keys(errs).length;
}
INP.money = (el) => { const d = digits(el.value); const pos = el.value.length - el.selectionStart; el.value = d ? Number(d).toLocaleString('id-ID') : ''; const np = Math.max(0, el.value.length - pos); try { el.setSelectionRange(np, np); } catch (e) { } };

function semesterKode(kode) {
  const m = String(kode || '').match(/^(\d{4})-([12])$/); if (!m) return null;
  const y = +m[1], n = +m[2];
  return { kode: y + '-' + n, label: (n === 1 ? 'Ganjil ' : 'Genap ') + y + '/' + (y + 1), akhir: (y + 1) + (n === 1 ? '-01-31' : '-07-31') };
}
function semesterDari(ymd) { const y = +String(ymd).slice(0, 4), mo = +String(ymd).slice(5, 7); return semesterKode((mo >= 8 ? y : y - 1) + '-' + ((mo >= 8 || mo === 1) ? 1 : 2)); }
function semesterBerikut(sm) { const y = +sm.kode.slice(0, 4); return semesterKode(sm.kode.slice(-1) === '1' ? y + '-2' : (y + 1) + '-1'); }

function kuliahInfo(k) {
  if (!k || !k.DokKuliah) return { ada: false, berlaku: false, sisa: null, sampai: '' };
  if (!k.KuliahBerlaku) return { ada: true, berlaku: true, sisa: null, sampai: '' };
  const sisa = -hariSejak(k.KuliahBerlaku);
  return { ada: true, berlaku: sisa >= 0, sisa, sampai: k.KuliahBerlaku };
}
function hariMenuju21(tgl) { const m = String(tgl || '').match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return null; return -hariSejak(`${+m[1] + 21}-${m[2]}-${m[3]}`); }

function memberCard(i, m, o) {
  o = o || {};
  m = m || { JenisAnggota: '' };
  const pfx = o.pfx || 'kel', key = `${pfx}:a${i}`;
  const umur = usia(m.TanggalLahir), anak = m.JenisAnggota === 'Anak', pas = m.JenisAnggota === 'Pasangan';
  const perluKuliah = anak && umur !== null && umur >= 21;
  const ex = m.ID && o.existing ? o.existing : null, exK = kuliahInfo(ex);
  const h21 = anak ? hariMenuju21(m.TanggalLahir) : null, kuliahSegera = anak && !perluKuliah && h21 !== null && h21 <= 90;
  const tampilKuliah = perluKuliah || kuliahSegera;
  const kuliahWajib = perluKuliah && !o.docOptional && !(ex && exK.berlaku && ex.StatusTunjangan === 'Aktif');
  const semKini = semesterDari(todayYmd()), semNext = semesterBerikut(semKini);
  const semPilih = m.KuliahSemester || (exK.berlaku && exK.sisa !== null && exK.sisa <= 30 ? semNext.kode : semKini.kode);
  const kuliahStatus = !ex ? '' : !exK.ada ? '' : !exK.berlaku ? `<p style="color:var(--danger);font-weight:600">Surat tersimpan sudah kedaluwarsa (berakhir ${fmtTgl(exK.sampai)}).</p>` : exK.sampai ? `<p>Surat tersimpan berlaku s.d. <strong>${fmtTgl(exK.sampai)}</strong>${exK.sisa <= 30 ? ` — ${exK.sisa} hari lagi, unggah surat semester berikutnya.` : '.'}</p>` : '';
  const tag = m.ID ? `<span class="badge b-info">${ic('sync')}Perbarui data terdaftar</span>` : `<span class="badge b-pri">${ic('person_add')}Anggota baru</span>`;
  return `<div class="member ${anak ? 'anak' : ''} ${perluKuliah ? 'warn' : ''}" data-member="${i}" data-id="${esc(m.ID || '')}">
    <div class="member-h"><div class="row wrap"><span class="badge b-pri" data-no>Anggota ${i + 1}</span><b style="font-size:14px">${pas ? 'Pasangan (Istri/Suami)' : anak ? 'Anak' : 'Pilih jenis anggota'}</b>${tag}${umur !== null ? `<span class="badge ${perluKuliah ? 'b-warn' : 'b-mut'}">${ic(perluKuliah ? 'warning' : 'cake')}Usia ${umur} tahun</span>` : ''}</div>
      ${o.removable !== false ? `<button type="button" class="btn btn-ic btn-danger-o" data-act="memDel" data-i="${i}" aria-label="Hapus anggota ${i + 1}" title="Hapus anggota ini">${ic('delete', 's18')}</button>` : ''}</div>
    <div class="fgrid c4">
      <div class="field" data-f="JenisAnggota"><label>Jenis Anggota <span class="req">*</span></label><select class="select" name="JenisAnggota" data-change="memJenis" ${m.ID ? 'disabled' : ''}>${optList(['Pasangan', 'Anak'], m.JenisAnggota, '— Pilih —')}</select><div class="ferr" hidden></div></div>
      <div class="field span2" data-f="Nama"><label>Nama Lengkap <span class="req">*</span></label><input class="input" name="Nama" value="${esc(m.Nama || '')}" maxlength="120" placeholder="Sesuai KTP/KK/Akta"><div class="ferr" hidden></div></div>
      <div class="field" data-f="TanggalLahir"><label>Tanggal Lahir <span class="req">*</span></label><input class="input" type="date" name="TanggalLahir" value="${esc(m.TanggalLahir || '')}" max="${todayYmd()}" data-change="memTgl"><div class="ferr" hidden></div></div>
      <div class="field ${pas ? 'span2' : ''}" data-f="Pekerjaan"><label>Pekerjaan</label><input class="input" name="Pekerjaan" value="${esc(m.Pekerjaan || '')}" maxlength="100" placeholder="${anak ? 'mis. Pelajar/Mahasiswa' : 'mis. Wiraswasta'}"></div>
      ${anak ? `<div class="field" data-f="Hubungan"><label>Status Anak</label><select class="select" name="Hubungan">${optList(['Kandung', 'Tiri', 'Angkat'], m.Hubungan || 'Kandung', '— Pilih —')}</select></div>
      <div class="field" data-f="AnakKe"><label>Anak ke-</label><input class="input" name="AnakKe" value="${esc(m.AnakKe || '')}" inputmode="numeric" maxlength="2" placeholder="1"></div>` : ''}
      ${o.sa && m.ID ? `<div class="field" data-f="StatusTunjangan"><label>Status Tunjangan</label><select class="select" name="StatusTunjangan">${optList(['Aktif', 'Tidak Aktif'], m.StatusTunjangan, '— Tetap —')}</select></div>` : ''}
    </div>
    ${pas ? `<div class="asn-box"><div><b>Apakah pasangan berstatus ASN (PNS/PPPK)?</b><div class="muted" style="font-size:12px">Jika Ya, tunjangan hanya dapat diterima salah satu pihak — NIP pasangan wajib diisi.</div></div>
      <div class="row wrap gap-16"><div class="radio-row" role="radiogroup"><label class="check"><input type="radio" name="StatusASN${key}" value="Ya" data-change="memAsn" ${m.StatusASN === 'Ya' ? 'checked' : ''}>Ya (ASN)</label><label class="check"><input type="radio" name="StatusASN${key}" value="Tidak" data-change="memAsn" ${m.StatusASN !== 'Ya' ? 'checked' : ''}>Bukan ASN</label></div>
      <div class="field" data-f="NIPPasangan" ${m.StatusASN === 'Ya' ? '' : 'hidden'} style="min-width:220px"><label>NIP Pasangan <span class="req">*</span></label><input class="input mono" name="NIPPasangan" value="${esc(m.NIPPasangan || '')}" inputmode="numeric" maxlength="21" placeholder="18 digit"><div class="ferr" hidden></div></div></div></div>` : ''}
    ${perluKuliah ? `<div class="banner warn">${ic('warning')}<div><b>Anak telah berusia ${umur} tahun (lahir ${fmtTgl(m.TanggalLahir)})</b><p>Tunjangan anak usia ≥ 21 tahun hanya dibayarkan bila masih mahasiswa aktif. <strong>Surat Keterangan Aktif Kuliah berlaku 1 semester</strong> dan wajib diperbarui setiap semester.</p>${kuliahStatus}</div></div>` : kuliahSegera ? `<div class="banner info">${ic('school')}<div><b>Genap 21 tahun dalam ${h21} hari</b><p>Bila masih kuliah, lampirkan Surat Keterangan Aktif Kuliah sekarang agar tunjangan tidak dinonaktifkan saat anak berusia 21 tahun.</p></div></div>` : ''}
    ${m.JenisAnggota && (!o.sharedDocs || tampilKuliah) ? `<div>${o.sharedDocs ? '' : '<div class="flabel mb-8">Lampiran dokumen sah (PDF, maks. 1 MB per berkas)</div>'}<div class="fgrid ${!o.sharedDocs && tampilKuliah ? 'c3' : ''}">
      ${o.sharedDocs ? '' : dropzone(key + '.DokKP4', { label: 'Formulir KP4', req: !(ex && ex.DokKP4) && !o.docOptional, existing: ex ? ex.DokKP4 : '', hint: 'Ditandatangani pimpinan' })}
      ${o.sharedDocs ? '' : dropzone(key + '.DokKK', { label: 'Kartu Keluarga', req: !(ex && ex.DokKK) && !o.docOptional, existing: ex ? ex.DokKK : '', hint: 'KK terbaru / legalisir' })}
      ${tampilKuliah ? dropzone(key + '.DokKuliah', { label: 'Surat Keterangan Aktif Kuliah (PDF)', req: kuliahWajib, existing: ex ? ex.DokKuliah : '', hint: 'Dari perguruan tinggi · berlaku 1 semester' }) : ''}
      ${tampilKuliah ? `<div class="field" data-f="KuliahSemester"><label>Berlaku untuk semester</label><select class="select" name="KuliahSemester">${[semKini, semNext].map((x) => `<option value="${x.kode}" ${x.kode === semPilih ? 'selected' : ''}>${x.label} (s.d. ${fmtTgl(x.akhir, true)})</option>`).join('')}</select><div class="fhint">Dipakai bila Anda mengunggah surat baru.</div></div>` : ''}
    </div></div>` : ''}
  </div>`;
}
function readMember(card) {
  const g = (n) => { const e = card.querySelector(`[name="${n}"]`); return e ? String(e.value || '').trim() : ''; };
  const asn = card.querySelector('input[type=radio][value="Ya"]');
  const m = { ID: card.dataset.id || '', JenisAnggota: g('JenisAnggota'), Nama: g('Nama'), TanggalLahir: g('TanggalLahir'), Pekerjaan: g('Pekerjaan'), Hubungan: g('Hubungan'), AnakKe: digits(g('AnakKe')), StatusASN: asn ? (asn.checked ? 'Ya' : 'Tidak') : '', NIPPasangan: digits(g('NIPPasangan')) };
  const st = card.querySelector('[name="StatusTunjangan"]'); if (st && st.value) m.StatusTunjangan = st.value;
  const ks = card.querySelector('[name="KuliahSemester"]'); if (ks && ks.value) m.KuliahSemester = ks.value;
  return m;
}
function validateMember(card, m, pfx, docOptional, exist, sharedDocs) {
  const errs = {}, key = `${pfx}:a${card.dataset.member}`;
  if (!m.JenisAnggota) errs.JenisAnggota = 'Pilih jenis anggota.';
  if (!m.Nama) errs.Nama = 'Nama wajib diisi.';
  if (!m.TanggalLahir) errs.TanggalLahir = 'Tanggal lahir wajib diisi.'; else if (m.TanggalLahir > todayYmd()) errs.TanggalLahir = 'Tidak boleh di masa depan.';
  if (m.JenisAnggota === 'Pasangan' && m.StatusASN === 'Ya' && !/^\d{18}$/.test(m.NIPPasangan)) errs.NIPPasangan = 'NIP pasangan wajib 18 digit angka.';
  if (!docOptional && m.JenisAnggota) {
    if (!sharedDocs && !FILES.get(key + '.DokKP4') && !(exist && exist.DokKP4)) errs[key + '.DokKP4'] = 'Formulir KP4 (PDF) wajib.';
    if (!sharedDocs && !FILES.get(key + '.DokKK') && !(exist && exist.DokKK)) errs[key + '.DokKK'] = 'Kartu Keluarga (PDF) wajib.';
    const u = usia(m.TanggalLahir);
    if (m.JenisAnggota === 'Anak' && u !== null && u >= 21 && !FILES.get(key + '.DokKuliah') && !(exist && kuliahInfo(exist).berlaku && exist.StatusTunjangan === 'Aktif')) errs[key + '.DokKuliah'] = exist && kuliahInfo(exist).ada ? 'Surat Aktif Kuliah tersimpan sudah kedaluwarsa — unggah surat semester terbaru.' : 'Surat Keterangan Aktif Kuliah wajib (usia ≥ 21 tahun).';
  }
  return errs;
}
function rerenderMember(card, o) {
  const i = +card.dataset.member, m = readMember(card);
  const ex = (o.existingList || []).find((x) => x.ID === m.ID);
  const tmp = document.createElement('div'); tmp.innerHTML = memberCard(i, m, Object.assign({}, o, { existing: ex }));
  const box = card.closest('[data-roster]');
  card.replaceWith(tmp.firstElementChild);
  renumberMembers(box);
}
function renumberMembers(box) { if (!box) return; $$('[data-member]', box).forEach((c, i) => { const b = c.querySelector('[data-no]'); if (b) b.textContent = 'Anggota ' + (i + 1); }); }
CHG.memJenis = (el) => { const c = el.closest('[data-member]'); rerenderMember(c, MEMCTX.get(c)); };
CHG.memTgl = (el) => { const c = el.closest('[data-member]'); rerenderMember(c, MEMCTX.get(c)); };
CHG.memAsn = (el) => { const c = el.closest('[data-member]'); const f = c.querySelector('[data-f="NIPPasangan"]'); if (f) { f.hidden = el.value !== 'Ya'; if (el.value === 'Ya') f.querySelector('input').focus(); } };

const MEMCTX = { get(card) { const box = card.closest('[data-roster]'); return box && box._ctx ? box._ctx : { pfx: 'kel' }; } };

const DTABS = [['diri', 'Data Diri', 'badge', 'Data Diri'], ['keluarga', 'Tunjangan Keluarga', 'family_restroom', 'Tunjangan Keluarga'], ['pangkat', 'Pangkat/Golongan', 'military_tech', 'Pangkat/Golongan'], ['jabatan', 'Jabatan', 'work', 'Jabatan'], ['kgb', 'Masa Kerja/KGB', 'schedule', 'Masa Kerja/KGB'], ['unit', 'Unit Kerja', 'domain', 'Unit Kerja'], ['cuti', 'Riwayat Cuti', 'event_busy', null]];
const TAB_KAT = { pangkat: 'PANGKAT', jabatan: 'JABATAN', kgb: 'KGB', unit: 'UNIT', cuti: 'CUTI' };
const Detail = {
  html(d, o) {
    o = o || {}; const p = d.pegawai, tab = o.tab || 'diri', kosong = d.kelengkapan.kosong || [];
    return `<div data-detail="${esc(p.NIP)}" data-mode="${o.sa ? 'sa' : o.self ? 'self' : 'view'}">
      <div class="card p-lg" style="background:linear-gradient(120deg,var(--surface-2),var(--surface));">
        <div class="row top gap-16 wrap">${avatar(p.Nama, 'xl')}
          <div class="grow" style="min-width:220px"><div class="row wrap"><span class="caps" style="color:var(--primary-text)">${esc(p.StatusPegawai || '')}</span>${bStatus(p.StatusKeaktifan || 'Aktif')}</div>
            <h2 style="font-size:20px;font-weight:700;margin-top:4px">${esc(p.Nama)}</h2>
            <div class="muted mono mt-4">NIP ${fmtNip(p.NIP)}</div>
            <div class="row wrap mt-8" style="gap:6px"><span class="chip">${ic('domain', 's14')}${esc(p.UnitKerja || '-')}</span><span class="chip">${ic('work', 's14')}${esc(p.Jabatan || 'Jabatan belum diisi')}</span><span class="chip">${ic('military_tech', 's14')}${esc(p.Golongan ? p.Golongan + ' · ' + (p.Pangkat || '') : 'Golongan belum diisi')}</span></div></div>
          <div class="col" style="align-items:flex-end;gap:8px">${d.kelengkapan.status === 'Lengkap' ? bStatus('Lengkap') : `<span class="badge b-warn" data-tip="Belum lengkap|${esc(kosong.join(', '))}" tabindex="0">${ic('warning')}Data Belum Lengkap (${kosong.length})</span>`}
            ${o.self ? `<button class="btn btn-sm btn-primary" data-act="nav" data-r="ajukan">${ic('edit_document', 's18')}Ajukan Perubahan</button>` : ''}</div></div>
        ${kosong.length ? `<div class="banner warn mt-16">${ic('info')}<div><b>Kategori yang belum lengkap: ${esc(kosong.join(', '))}</b><p>${o.sa ? 'Lengkapi langsung melalui tombol Tambah/Edit pada tab terkait.' : o.self ? 'Lengkapi melalui menu Ajukan Perubahan agar perhitungan gaji & tunjangan akurat.' : 'Ajukan perubahan atas nama pegawai ini untuk melengkapinya.'}</p></div></div>` : ''}
        ${d.pending && d.pending.length ? `<div class="banner info mt-12">${ic('hourglass_top')}<div><b>${d.pending.length} pengajuan menunggu persetujuan</b><p>${d.pending.map((x) => esc(JENIS_LABEL[x.Jenis] + ': ' + x.Ringkasan)).join(' · ')}</p></div></div>` : ''}
      </div>
      <div class="tabs mt-16" role="tablist">${DTABS.map((t) => `<button class="tab ${t[0] === tab ? 'on' : ''}" role="tab" aria-selected="${t[0] === tab}" data-act="dtab" data-tab="${t[0]}">${ic(t[2], 's16')}${t[1]}${t[3] && kosong.indexOf(t[3]) >= 0 ? '<span class="warn-dot" title="Belum lengkap"></span>' : ''}</button>`).join('')}</div>
      <div class="mt-16" data-dbody>${this.body(d, tab, o)}</div></div>`;
  },
  body(d, tab, o) {
    const p = d.pegawai, sa = o.sa;
    if (tab === 'diri') {
      const kv = [['Nama Lengkap', p.Nama], ['NIP', fmtNip(p.NIP)], ['Status Pegawai', p.StatusPegawai], ['NIK', p.NIK], ['Jenis Kelamin', p.JenisKelamin], ['No. Telepon', p.NoTelepon], ['Email', p.Email], ['Status Keaktifan', p.StatusKeaktifan || 'Aktif'], ['Unit Kerja', p.UnitKerja], ['Pangkat/Golongan', p.Golongan ? p.Golongan + ' — ' + (p.Pangkat || '') : ''], ['Jabatan', p.Jabatan], ['Gaji Pokok Terkini', p.GajiPokok ? fmtRp(p.GajiPokok) : ''], ['Alamat', p.Alamat, 'full']];
      return `<div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('badge', 's18')}</span>Data Diri</div>${sa ? `<button class="btn btn-sm btn-primary" data-act="edDiri">${ic('edit', 's18')}Edit</button>` : o.self ? `<button class="btn btn-sm btn-soft" data-act="nav" data-r="ajukan" data-p='{"jenis":"DATA_DIRI"}'>${ic('edit', 's18')}Ajukan Perubahan</button>` : ''}</div>
        <dl class="kv c3">${kv.map((x) => `<div class="${x[2] || ''}"><dt>${x[0]}</dt><dd>${x[1] ? esc(x[1]) : '<span class="faint">— belum diisi —</span>'}</dd></div>`).join('')}</dl>
        <p class="faint mt-16" style="font-size:12px">${ic('info', 's14')} Perubahan Data Diri tidak memerlukan dokumen pendukung.${p.DiperbaruiPada ? ' Terakhir diperbarui ' + fmtWaktu(p.DiperbaruiPada) + '.' : ''}</p></div>`;
    }
    if (tab === 'keluarga') {
      const tidak = String(p.TidakAdaTanggungan).toUpperCase() === 'YA';
      return `<div class="stack">
        ${sa ? `<div class="card flat row between wrap"><label class="check"><input type="checkbox" data-change="togTanggungan" ${tidak ? 'checked' : ''}> Tandai <b>Tidak Ada Tanggungan Keluarga</b></label><button class="btn btn-sm btn-primary" data-act="edKel">${ic('person_add', 's18')}Tambah Anggota</button></div>` : o.self ? `<div class="row between wrap"><span class="muted">Data tanggungan untuk perhitungan tunjangan keluarga.</span><button class="btn btn-sm btn-soft" data-act="nav" data-r="ajukan" data-p='{"jenis":"KELUARGA"}'>${ic('edit', 's18')}Ajukan Perubahan</button></div>` : ''}
        ${tidak ? `<div class="banner info">${ic('info')}<div><b>Pegawai menyatakan Tidak Ada Tanggungan Keluarga</b><p>Kategori Tunjangan Keluarga dianggap lengkap.</p></div></div>` : ''}
        ${d.keluarga.length ? `<div class="grid" style="gap:14px">${d.keluarga.map((k) => this.kelCard(k, sa)).join('')}</div>` : (tidak ? '' : `<div class="card">${emptyBox('Belum ada data keluarga', 'Data pasangan/anak belum terdaftar.', 'family_restroom')}</div>`)}</div>`;
    }
    const kat = TAB_KAT[tab], list = d[tab] || [];
    const judul = { PANGKAT: 'Riwayat Pangkat/Golongan', JABATAN: 'Riwayat Jabatan', KGB: 'Riwayat Masa Kerja/KGB', UNIT: 'Riwayat Unit Kerja', CUTI: 'Riwayat Cuti' }[kat];
    return `<div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic(JENIS_IC[kat], 's18')}</span>${judul}<span class="chip">${list.length}</span></div>${sa ? `<button class="btn btn-sm btn-primary" data-act="edRiw" data-k="${kat}">${ic('add', 's18')}Tambah</button>` : o.self ? `<button class="btn btn-sm btn-soft" data-act="nav" data-r="ajukan" data-p='${JSON.stringify({ jenis: kat })}'>${ic(kat === 'CUTI' ? 'add' : 'edit', 's18')}${kat === 'CUTI' ? 'Catat Cuti' : 'Ajukan Perubahan'}</button>` : ''}</div>
      ${list.length ? `<div class="tl">${list.map((r, i) => this.riwItem(kat, r, i === 0 && kat !== 'CUTI', sa)).join('')}</div>` : emptyBox('Belum ada data', kat === 'CUTI' ? 'Riwayat cuti tidak wajib untuk kelengkapan data.' : 'Kategori ini wajib diisi agar data pegawai lengkap.', JENIS_IC[kat])}</div>`;
  },
  riwItem(kat, r, now, sa) {
    const f = { PANGKAT: [['Golongan', (r.Golongan || '') + (r.Pangkat ? ' — ' + r.Pangkat : '')], ['Masa Kerja', r.MasaKerja], ['Ditetapkan', fmtTgl(r.TglDitetapkan)], ['Berlaku (TMT)', fmtTgl(r.TglBerlaku)], ['Gaji Pokok', fmtRp(r.GajiPokok)]], JABATAN: [['Jabatan', r.Jabatan], ['Ditetapkan', fmtTgl(r.TglDitetapkan)], ['Berlaku', fmtTgl(r.TglBerlaku)]], KGB: [['Masa Kerja', r.MasaKerja], ['Gaji Pokok', fmtRp(r.GajiPokok)], ['Penetapan', fmtTgl(r.TglDitetapkan)], ['Berlaku', fmtTgl(r.TglBerlaku)]], UNIT: [['Unit Kerja', r.UnitKerja], ['Penetapan', fmtTgl(r.TglDitetapkan)], ['Berlaku', fmtTgl(r.TglBerlaku)]], CUTI: [['Jenis', r.JenisCuti], ['Mulai', fmtTgl(r.TglMulai)], ['Berakhir', fmtTgl(r.TglSelesai)], ['Keterangan', r.Keterangan]] }[kat];
    return `<div class="tl-item ${now ? 'now' : ''}"><div class="tl-card"><div class="row between wrap mb-8">${now ? `<span class="badge b-pri">${ic('verified')}Berlaku saat ini</span>` : `<span class="faint" style="font-size:12px">${esc(r.Sumber || '')}${r.DibuatPada ? ' · ' + fmtTgl(r.DibuatPada, true) : ''}</span>`}
      <div class="row">${r.DokumenID ? `<button class="btn btn-xs btn-outline" data-act="doc" data-id="${esc(r.DokumenID)}" data-t="${esc((JENIS_LABEL[kat] || '') + ' — ' + (r.NomorSK || r.JenisCuti || ''))}">${ic('visibility', 's16')}Lihat Dokumen</button>` : `<span class="faint" style="font-size:11.5px">${ic('description', 's14')} Tanpa dokumen</span>`}
      ${sa ? `<button class="btn btn-xs btn-ghost" data-act="edRiw" data-k="${kat}" data-id="${esc(r.ID)}" aria-label="Edit">${ic('edit', 's16')}</button><button class="btn btn-xs btn-ghost" data-act="hapusRiw" data-k="${kat}" data-id="${esc(r.ID)}" aria-label="Hapus" style="color:var(--danger)">${ic('delete', 's16')}</button>` : ''}</div></div>
      <dl class="kv c3">${f.map((x) => `<div><dt>${x[0]}</dt><dd>${x[1] ? esc(x[1]) : '—'}</dd></div>`).join('')}</dl>
      ${r.NomorSK ? `<div class="sk-box mt-12"><div><div class="caps" style="font-size:10px">Nomor SK</div><span class="mono">${esc(r.NomorSK)}</span></div>${ic('gavel', 'muted')}</div>` : ''}</div></div>`;
  },
  kelCard(k, sa) {
    const u = k.Usia, anak = k.JenisAnggota === 'Anak', warn = anak && u !== null && u >= 21, ki = kuliahInfo(k);
    const kuliahBanner = !warn ? '' : !ki.ada ? `<div class="banner warn">${ic('warning')}<div><b>Usia ≥ 21 tahun tanpa Surat Aktif Kuliah</b><p>Tunjangan anak berisiko kelebihan bayar.</p></div></div>`
      : !ki.berlaku ? `<div class="banner bad">${ic('event_busy')}<div><b>Surat Aktif Kuliah kedaluwarsa (${fmtTgl(ki.sampai)})</b><p>Unggah surat semester terbaru agar tunjangan dapat diaktifkan kembali.</p></div></div>`
      : ki.sisa !== null && ki.sisa <= 30 ? `<div class="banner warn">${ic('schedule')}<div><b>Surat Aktif Kuliah berakhir ${fmtTgl(ki.sampai)} (${ki.sisa} hari lagi)</b><p>Surat hanya berlaku 1 semester — siapkan surat semester berikutnya.</p></div></div>` : '';
    const docs = [['DokKP4', 'KP4'], ['DokKK', 'Kartu Keluarga'], ['DokKuliah', 'Surat Aktif Kuliah']].filter((x) => k[x[0]]);
    return `<div class="g-6"><div class="member ${anak ? 'anak' : ''} ${warn ? 'warn' : ''}" style="height:100%">
      <div class="member-h"><div class="row">${avatar(k.Nama)}<div><b>${esc(k.Nama)}</b><div class="muted" style="font-size:12px">${anak ? `Anak ${k.AnakKe ? 'ke-' + esc(k.AnakKe) : ''} · ${esc(k.Hubungan || 'Kandung')}` : 'Pasangan (Istri/Suami)'}</div></div></div>${bStatus(k.StatusTunjangan || 'Aktif')}</div>
      <dl class="kv"><div><dt>Tanggal Lahir</dt><dd>${fmtTgl(k.TanggalLahir)}</dd></div><div><dt>Usia</dt><dd>${u === null ? '—' : u + ' tahun'}</dd></div><div><dt>Pekerjaan</dt><dd>${esc(k.Pekerjaan || '—')}</dd></div>${anak ? '' : `<div><dt>Pasangan ASN</dt><dd>${esc(k.StatusASN || 'Tidak')}${k.NIPPasangan ? `<div class="mono muted">${fmtNip(k.NIPPasangan)}</div>` : ''}</dd></div>`}</dl>
      ${anak && ki.sampai ? `<div class="muted" style="font-size:12px">${ic('school', 's16')} Surat Aktif Kuliah semester ${esc(semesterDari(ki.sampai).label)} — berlaku s.d. <b>${fmtTgl(ki.sampai)}</b></div>` : ''}
      ${kuliahBanner}
      <div class="row wrap between"><div class="docs-list">${docs.length ? docs.map((x) => `<button class="doc-btn" data-act="doc" data-id="${esc(k[x[0]])}" data-t="${esc(x[1] + ' — ' + k.Nama)}">${ic('picture_as_pdf', 's18')}${x[1]}</button>`).join('') : '<span class="faint" style="font-size:12px">Belum ada dokumen</span>'}</div>
      ${sa ? `<div class="row"><button class="btn btn-xs btn-outline" data-act="edKel" data-id="${esc(k.ID)}">${ic('edit', 's16')}Edit</button><button class="btn btn-xs btn-ghost" data-act="hapusKel" data-id="${esc(k.ID)}" style="color:var(--danger)" aria-label="Hapus">${ic('delete', 's16')}</button></div>` : ''}</div></div></div>`;
  },

  refresh(nip) {
    const root = document.querySelector(`[data-detail="${CSS.escape(String(nip))}"]`); if (!root) return;
    const d = S.detail[nip] || (S.profil && S.profil.pegawai.NIP === nip ? S.profil : null); if (!d) return;
    const tab = (root.querySelector('.tab.on') || {}).dataset ? root.querySelector('.tab.on').dataset.tab : 'diri';
    const mode = root.dataset.mode;
    const tmp = document.createElement('div'); tmp.innerHTML = this.html(d, { tab, sa: mode === 'sa', self: mode === 'self' });
    root.replaceWith(tmp.firstElementChild);
  }
};
ACT.dtab = (el) => {
  const root = el.closest('[data-detail]'), nip = root.dataset.detail, mode = root.dataset.mode;
  const d = S.detail[nip] || S.profil;
  root.querySelectorAll('.tab').forEach((t) => { const on = t === el; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); });
  root.querySelector('[data-dbody]').innerHTML = Detail.body(d, el.dataset.tab, { sa: mode === 'sa', self: mode === 'self' });
};

function curNip(el) { const r = el.closest('[data-detail]'); return r ? r.dataset.detail : null; }
async function simpanEdit(nip, payload, optimis, label) {
  const d = S.detail[nip], backup = JSON.stringify(d);
  if (optimis) { optimis(d); Detail.refresh(nip); }
  return Sync.run(label || 'Menyimpan perubahan…', API.call('pegawai.edit', Object.assign({ nip }, payload)).then((fresh) => {
    S.detail[nip] = fresh; upsertIdx(fresh.pegawai); Detail.refresh(nip); invalidateDash();
    if (PAGES.pegawai.done) PAGES.pegawai.renderList();
    toast('ok', 'Perubahan tersimpan', 'Data master pegawai diperbarui & tercatat di audit log.');
    return fresh;
  }).catch((e) => { S.detail[nip] = JSON.parse(backup); Detail.refresh(nip); errToast(e, 'Perubahan dibatalkan'); throw e; }));
}
ACT.edDiri = (el) => {
  const nip = curNip(el), p = S.detail[nip].pegawai, spec = FS.DATA_DIRI.concat(FS.DATA_DIRI_SA);
  const m = Modal.open({ title: `${ic('edit')} Edit Data Diri — ${esc(p.Nama)}`, size: 'lg', body: `<form id="f-ed">${formHtml(spec, p, 'ed-')}</form><p class="faint mt-12" style="font-size:12px">${ic('history', 's14')} Perubahan langsung diterapkan tanpa proses pengajuan dan tercatat di audit log.</p>`, foot: `<button class="btn btn-outline" data-x2>Batal</button><button class="btn btn-primary" data-ok>${ic('save', 's18')}Simpan</button>` });
  m.el.querySelector('[data-x2]').onclick = m.close;
  m.el.querySelector('[data-ok]').onclick = () => {
    const { vals, errs } = readForm(m.el, spec); if (showErrs(m.el, errs)) return;
    m.close(); simpanEdit(nip, { op: 'diri', data: vals }, (d) => Object.assign(d.pegawai, vals)).catch(() => { });
  };
};
ACT.edRiw = (el) => {
  const nip = curNip(el), kat = el.dataset.k, id = el.dataset.id, d = S.detail[nip];
  const tabKey = Object.keys(TAB_KAT).find((t) => TAB_KAT[t] === kat), row = id ? (d[tabKey] || []).find((x) => x.ID === id) : {};
  const dk = 'ed:' + kat; clearFiles(dk);
  const m = Modal.open({ title: `${ic(id ? 'edit' : 'add')} ${id ? 'Edit' : 'Tambah'} ${JENIS_LABEL[kat]}`, size: 'lg', body: `<form id="f-ed">${formHtml(FS[kat], row || {}, 'er-')}<div class="fgrid mt-16">${dropzone(dk, { label: kat === 'CUTI' ? 'Berkas Surat Cuti (PDF)' : 'Dokumen SK (PDF)', req: kat === 'CUTI' && !id, existing: row && row.DokumenID, span: 1, hint: 'Opsional untuk Superadmin — maks. 1 MB' })}</div></form>${jabatanDatalist()}`, foot: `<button class="btn btn-outline" data-x2>Batal</button><button class="btn btn-primary" data-ok>${ic('save', 's18')}Simpan</button>` });
  m.el.querySelector('[data-x2]').onclick = m.close;
  m.el.querySelector('[data-ok]').onclick = async () => {
    const { vals, errs } = readForm(m.el, FS[kat]);
    if (kat === 'CUTI' && !id && !FILES.get(dk)) errs[dk] = 'Berkas cuti wajib dilampirkan.';
    if (showErrs(m.el, errs)) return;
    const docs = FILES.get(dk) ? { DokumenID: await readPdf(FILES.get(dk)) } : {};
    if (id) vals.ID = id;
    m.close(); clearFiles(dk);
    simpanEdit(nip, { op: 'riwayat', kategori: kat, data: vals, docs }, (dd) => {
      const arr = dd[tabKey] = dd[tabKey] || [];
      if (id) Object.assign(arr.find((x) => x.ID === id) || {}, vals); else arr.unshift(Object.assign({ ID: 'tmp-' + uid(), Sumber: 'Menyimpan…' }, vals));
      if (kat === 'PANGKAT') dd.pegawai.Golongan = vals.Golongan; if (kat === 'JABATAN') dd.pegawai.Jabatan = vals.Jabatan; if (kat === 'UNIT') dd.pegawai.UnitKerja = vals.UnitKerja;
    }).catch(() => { });
  };
};
ACT.hapusRiw = async (el) => {
  const nip = curNip(el), kat = el.dataset.k, id = el.dataset.id;
  const ok = await Modal.confirm({ title: 'Hapus data riwayat?', danger: true, msg: `Data <b>${JENIS_LABEL[kat]}</b> ini akan dihapus permanen dari data master dan tercatat di audit log.`, ok: 'Hapus' });
  if (!ok) return;
  const tabKey = Object.keys(TAB_KAT).find((t) => TAB_KAT[t] === kat);
  simpanEdit(nip, { op: 'hapusRiwayat', kategori: kat, id }, (d) => { d[tabKey] = (d[tabKey] || []).filter((x) => x.ID !== id); }, 'Menghapus…').catch(() => { });
};
ACT.edKel = (el) => {
  const nip = curNip(el), id = el.dataset.id, d = S.detail[nip], k = id ? d.keluarga.find((x) => x.ID === id) : { JenisAnggota: '' };
  clearFiles('edk:');
  const m = Modal.open({ title: `${ic(id ? 'edit' : 'person_add')} ${id ? 'Edit' : 'Tambah'} Anggota Keluarga`, size: 'lg', body: `<div data-roster></div><p class="faint mt-12" style="font-size:12px">Dokumen opsional untuk edit langsung Superadmin. Status tunjangan anak ≥ 21 tahun mengikuti ada/tidaknya Surat Aktif Kuliah, kecuali diubah manual.</p>`, foot: `<button class="btn btn-outline" data-x2>Batal</button><button class="btn btn-primary" data-ok>${ic('save', 's18')}Simpan</button>` });
  const box = m.el.querySelector('[data-roster]'); box._ctx = { pfx: 'edk', removable: false, docOptional: true, sa: true, existingList: d.keluarga };
  box.innerHTML = memberCard(0, k, Object.assign({}, box._ctx, { existing: id ? k : null }));
  m.el.querySelector('[data-x2]').onclick = m.close;
  m.el.querySelector('[data-ok]').onclick = async () => {
    const card = box.querySelector('[data-member]'), mm = readMember(card), errs = validateMember(card, mm, 'edk', true);
    if (showErrs(card, errs)) return;
    const docs = {}; for (const x of ['DokKP4', 'DokKK', 'DokKuliah']) { const f = FILES.get('edk:a0.' + x); if (f) docs[x] = await readPdf(f); }
    m.close(); clearFiles('edk:');
    simpanEdit(nip, { op: 'keluarga', data: mm, docs }, (dd) => { if (id) Object.assign(dd.keluarga.find((x) => x.ID === id), mm); else dd.keluarga.push(Object.assign({ ID: 'tmp-' + uid(), StatusTunjangan: 'Aktif', Usia: usia(mm.TanggalLahir) }, mm)); }).catch(() => { });
  };
};
ACT.hapusKel = async (el) => {
  const nip = curNip(el), id = el.dataset.id, k = S.detail[nip].keluarga.find((x) => x.ID === id);
  const ok = await Modal.confirm({ title: 'Hapus anggota keluarga?', danger: true, msg: `<b>${esc(k ? k.Nama : '')}</b> akan dihapus dari data tunjangan keluarga.`, ok: 'Hapus' });
  if (ok) simpanEdit(nip, { op: 'hapusKeluarga', id }, (d) => { d.keluarga = d.keluarga.filter((x) => x.ID !== id); }, 'Menghapus…').catch(() => { });
};
CHG.togTanggungan = (el) => { const nip = curNip(el); simpanEdit(nip, { op: 'tanggungan', nilai: el.checked }, (d) => { d.pegawai.TidakAdaTanggungan = el.checked ? 'YA' : 'TIDAK'; }).catch(() => { }); };

PAGES.profil = {
  dataPage: true,
  show(p, keep) {
    const el = $('#pg-profil'), d = S.profil;
    if (!d) { el.innerHTML = `<div class="card">${emptyBox('Profil tidak tersedia', 'Akun ini belum terhubung ke data pegawai.', 'person_off')}</div>`; return; }
    if (this.done && keep === undefined) return;
    S.detail[d.pegawai.NIP] = d;
    el.innerHTML = pageHead(['Utama', 'Profil Saya'], 'Profil Saya', 'Seluruh data kepegawaian Anda (hanya-baca). Perubahan diajukan melalui menu Ajukan Perubahan.') + Detail.html(d, { self: true, tab: p.tab });
    this.done = true;
  }
};

const KAT_ORDER = ['DATA_DIRI', 'KELUARGA', 'PANGKAT', 'JABATAN', 'KGB', 'UNIT', 'CUTI'];
const KAT_INFO = {
  DATA_DIRI: { d: 'NIK, alamat, kontak & email', tag: ['Tanpa dokumen', 'b-info'] },
  KELUARGA: { d: 'Pasangan & anak tanggungan', tag: ['KP4 + KK', 'b-warn'] },
  PANGKAT: { d: 'Kenaikan pangkat/golongan', tag: ['Wajib SK', 'b-pri'] },
  JABATAN: { d: 'Mutasi atau promosi jabatan', tag: ['Wajib SK', 'b-pri'] },
  KGB: { d: 'Kenaikan gaji berkala', tag: ['Wajib SK', 'b-pri'] },
  UNIT: { d: 'Perpindahan unit kerja', tag: ['Wajib SK', 'b-pri'] },
  CUTI: { d: 'Catat riwayat cuti', tag: ['Langsung', 'b-ok'] }
};
const KAT_TAB = { PANGKAT: 'pangkat', JABATAN: 'jabatan', KGB: 'kgb', UNIT: 'unit', CUTI: 'cuti' };
const KETENTUAN = {
  DATA_DIRI: ['Tidak memerlukan dokumen pendukung.', 'Nama & NIK harus sesuai KTP/Kartu Keluarga.', 'Email dipakai untuk notifikasi status pengajuan.'],
  KELUARGA: ['Formulir KP4 & Kartu Keluarga cukup diunggah SEKALI untuk seluruh anggota dalam satu usulan.', 'Anak berusia ≥ 21 tahun wajib Surat Keterangan Aktif Kuliah (per anak) — hanya berlaku 1 semester dan wajib diperbarui setiap semester.', 'Jika pasangan ASN, NIP pasangan wajib diisi — tunjangan hanya diterima salah satu pihak.', 'Anggota yang sudah terdaftar cukup dipilih "Perbarui" bila ada perubahan.'],
  SK: ['Lampirkan scan SK asli dalam format PDF (maks. 1 MB).', 'Nomor & tanggal SK harus sesuai dokumen.', 'Data baru berlaku setelah disetujui Superadmin dan tercatat sebagai riwayat.'],
  CUTI: ['Riwayat cuti langsung tersimpan tanpa persetujuan.', 'Lampirkan surat/berkas cuti (PDF, maks. 1 MB).', 'Riwayat cuti tidak memengaruhi kelengkapan data.']
};

function ringkasLokal(j, d, x) {
  const p = d.pegawai, last = (k) => ((d[k] || [])[0] || {});
  if (j === 'DATA_DIRI') return 'Ubah ' + FS.DATA_DIRI.filter((f) => String(p[f.k] || '') !== String(x[f.k] || '')).map((f) => f.l).join(', ');
  if (j === 'KELUARGA') return x.tidakAda ? 'Tidak ada tanggungan keluarga' : (x.anggota.length + ' anggota: ' + x.anggota.map((a) => a.JenisAnggota + ' ' + a.Nama).join(', ')).slice(0, 180);
  if (j === 'PANGKAT') return (last('pangkat').Golongan ? last('pangkat').Golongan + ' → ' : '') + x.Golongan + ' · SK ' + x.NomorSK;
  if (j === 'JABATAN') return x.Jabatan + ' · SK ' + x.NomorSK;
  if (j === 'KGB') return 'KGB ' + x.MasaKerja + ' · SK ' + x.NomorSK;
  if (j === 'UNIT') return (p.UnitKerja ? p.UnitKerja + ' → ' : '') + x.UnitKerja + ' · SK ' + x.NomorSK;
  return '';
}

const CMP_F = {
  DATA_DIRI: [['Nama', 'Nama Lengkap'], ['NIK', 'NIK'], ['JenisKelamin', 'Jenis Kelamin'], ['NoTelepon', 'No. Telepon'], ['Email', 'Email'], ['Alamat', 'Alamat']],
  PANGKAT: [['Golongan', 'Golongan'], ['Pangkat', 'Pangkat'], ['MasaKerja', 'Masa Kerja'], ['TglDitetapkan', 'Tgl Ditetapkan'], ['TglBerlaku', 'Tgl Berlaku (TMT)'], ['NomorSK', 'Nomor SK'], ['GajiPokok', 'Gaji Pokok']],
  JABATAN: [['Jabatan', 'Jabatan'], ['TglDitetapkan', 'Tgl Ditetapkan'], ['TglBerlaku', 'Tgl Berlaku'], ['NomorSK', 'Nomor SK']],
  KGB: [['MasaKerja', 'Masa Kerja'], ['GajiPokok', 'Gaji Pokok'], ['TglDitetapkan', 'Tgl Penetapan'], ['TglBerlaku', 'Tgl Berlaku'], ['NomorSK', 'Nomor SK']],
  UNIT: [['UnitKerja', 'Unit Kerja'], ['TglDitetapkan', 'Tgl Penetapan'], ['TglBerlaku', 'Tgl Berlaku'], ['NomorSK', 'Nomor SK']]
};
const KEL_F = [['Nama', 'Nama'], ['TanggalLahir', 'Tanggal Lahir'], ['Pekerjaan', 'Pekerjaan'], ['Hubungan', 'Status Anak'], ['AnakKe', 'Anak ke-'], ['StatusASN', 'Pasangan ASN'], ['NIPPasangan', 'NIP Pasangan']];
function fmtVal(k, v) {
  if (v === '' || v === null || v === undefined) return '<span class="faint">—</span>';
  if (/^Tgl|TanggalLahir/.test(k)) return fmtTgl(v);
  if (k === 'GajiPokok') return fmtRp(v);
  if (k === 'NIPPasangan' || k === 'NIK' || k === 'NomorSK') return `<span class="mono">${k === 'NIPPasangan' ? fmtNip(v) : esc(v)}</span>`;
  return esc(v);
}
const Cmp = {
  head(pg) {
    const oleh = pg.PeranPengaju === 'ADMIN_UNIT' ? `Admin Unit (${esc(pg.DiajukanOleh)})` : pg.PeranPengaju === 'PEGAWAI' ? 'Pegawai ybs.' : esc(pg.DiajukanOleh || '-');
    return `<div class="row top between wrap" style="gap:12px"><div class="row">${avatar(pg.Nama, 'lg')}<div style="min-width:0"><b style="font-size:16px">${esc(pg.Nama)}</b><div class="muted mono" style="font-size:12px">NIP ${fmtNip(pg.NIP)}</div><div class="muted" style="font-size:12px">${esc(pg.UnitKerja || '')}</div></div></div>
      <div class="col" style="align-items:flex-end;gap:6px">${bStatus(pg.Status)}<span class="chip">${ic(JENIS_IC[pg.Jenis] || 'description', 's14')}${esc(JENIS_LABEL[pg.Jenis] || pg.Jenis)}</span></div></div>
      <dl class="kv c3 mt-16"><div><dt>Diajukan</dt><dd>${fmtWaktu(pg.TglPengajuan)}</dd></div><div><dt>Diajukan oleh</dt><dd>${oleh}</dd></div><div><dt>${pg.Status === 'Pending' ? 'Lama menunggu' : 'Diputuskan'}</dt><dd>${pg.Status === 'Pending' ? (hariSejak(pg.TglPengajuan) ? hariSejak(pg.TglPengajuan) + ' hari' : 'Hari ini') : fmtWaktu(pg.TglKeputusan) + (pg.DiputuskanOleh ? `<div class="muted" style="font-size:12px;font-weight:500">oleh ${esc(pg.DiputuskanOleh)}</div>` : '')}</dd></div></dl>
      ${pg.Status === 'Ditolak' ? `<div class="banner bad mt-12">${ic('cancel')}<div><b>Alasan penolakan</b><p>${esc(pg.AlasanTolak || '-')}</p></div></div>` : ''}
      ${pg.Status === 'Disetujui' ? `<div class="banner ok mt-12">${ic('check_circle')}<div><b>Disetujui & sudah diterapkan ke data master</b>${pg.Catatan ? `<p>Catatan: ${esc(pg.Catatan)}</p>` : ''}</div></div>` : ''}`;
  },
  col(title, badge, fields, obj, other, isNew) {
    return `<div class="cmp-col ${isNew ? 'new' : ''}"><div class="row between"><b>${title}</b>${badge}</div>${fields.map((f) => { const chg = isNew && other && String(other[f[0]] === undefined ? '' : other[f[0]]) !== String(obj[f[0]] === undefined ? '' : obj[f[0]]); return `<div class="cmp-f ${chg ? 'chg' : ''}"><div class="k">${f[1]}</div><div class="v">${fmtVal(f[0], obj[f[0]])}</div></div>`; }).join('')}</div>`;
  },
  body(pg) {
    const j = pg.Jenis, sb = pg.DataSebelum || {}, dj = pg.DataDiajukan || {}, dok = pg.Dokumen || {};
    if (j === 'KELUARGA') {
      if (dj.tidakAda) return `<div class="banner info">${ic('info')}<div><b>Pernyataan: Tidak Ada Tanggungan Keluarga</b><p>Kategori Tunjangan Keluarga akan dianggap lengkap tanpa data anggota.</p></div></div>${dok['tidakAda.DokKP4'] ? `<div class="docs-list mt-12"><button class="doc-btn" data-act="doc" data-id="${esc(dok['tidakAda.DokKP4'])}" data-t="Formulir KP4 / Surat Pernyataan">${ic('picture_as_pdf', 's18')}KP4 / Surat Pernyataan</button></div>` : ''}`;
      const lama = {}; (sb.anggota || []).forEach((a) => { lama[a.ID] = a; });
      const bersama = [['DokKP4', 'Formulir KP4'], ['DokKK', 'Kartu Keluarga']].filter((x) => dok[x[0]]);
      return `<div class="stack">${bersama.length ? `<div class="sk-banner"><div style="min-width:0"><div class="caps" style="font-size:10px">Dokumen usulan (berlaku untuk seluruh anggota)</div><div class="docs-list mt-4">${bersama.map((x) => `<button class="doc-btn" data-act="doc" data-id="${esc(dok[x[0]])}" data-t="${esc(x[1])}">${ic('picture_as_pdf', 's18')}${x[1]}</button>`).join('')}</div></div></div>` : ''}${(dj.anggota || []).map((a, i) => {
        const ex = a.ID ? lama[a.ID] : null, u = usia(a.TanggalLahir), anak = a.JenisAnggota === 'Anak';
        const fields = KEL_F.filter((f) => anak ? ['StatusASN', 'NIPPasangan'].indexOf(f[0]) < 0 : ['Hubungan', 'AnakKe'].indexOf(f[0]) < 0);
        const docs = [['DokKP4', 'KP4'], ['DokKK', 'Kartu Keluarga'], ['DokKuliah', 'Surat Aktif Kuliah']].map((x) => { const baru = dok['a' + i + '.' + x[0]], lamaId = ex && !(x[0] !== 'DokKuliah' && dok[x[0]]) ? ex[x[0]] : ''; return baru ? `<button class="doc-btn" data-act="doc" data-id="${esc(baru)}" data-t="${esc(x[1] + ' — ' + a.Nama)}">${ic('picture_as_pdf', 's18')}${x[1]} <span class="badge b-pri" style="padding:1px 6px">baru</span></button>` : lamaId ? `<button class="doc-btn" data-act="doc" data-id="${esc(lamaId)}" data-t="${esc(x[1] + ' — ' + a.Nama)}">${ic('picture_as_pdf', 's18')}${x[1]} <span class="faint" style="font-size:11px">tersimpan</span></button>` : ''; }).join('');
        return `<div class="member ${anak ? 'anak' : ''} ${anak && u >= 21 ? 'warn' : ''}"><div class="member-h"><div class="row wrap"><span class="badge b-pri">Anggota ${i + 1}</span><b>${anak ? 'Anak' : 'Pasangan'} — ${esc(a.Nama)}</b>${ex ? `<span class="badge b-info">${ic('sync')}Perbarui data</span>` : `<span class="badge b-ok">${ic('person_add')}Anggota baru</span>`}${u !== null ? `<span class="badge ${anak && u >= 21 ? 'b-warn' : 'b-mut'}">${u} tahun</span>` : ''}</div></div>
          ${ex ? `<div class="cmp">${this.col('Data Terdaftar', '<span class="badge b-mut">Sebelum</span>', fields, ex)}${this.col('Data Diajukan', '<span class="badge b-pri">Baru</span>', fields, a, ex, true)}</div>` : `<div class="kv c3">${fields.map((f) => `<div><dt>${f[1]}</dt><dd>${fmtVal(f[0], a[f[0]])}</dd></div>`).join('')}</div>`}
          ${anak && u >= 21 ? `<div class="banner warn">${ic('school')}<div><b>Anak berusia ${u} tahun</b><p>Tunjangan hanya dibayarkan jika Surat Keterangan Aktif Kuliah valid (berlaku 1 semester).${dok['a' + i + '.DokKuliah'] && semesterKode(a.KuliahSemester) ? ` Surat baru untuk <strong>Semester ${esc(semesterKode(a.KuliahSemester).label)}</strong>, berlaku s.d. <strong>${fmtTgl(semesterKode(a.KuliahSemester).akhir)}</strong>.` : ''}</p></div></div>` : ''}
          <div class="docs-list">${docs || '<span class="faint" style="font-size:12px">Tidak ada lampiran</span>'}</div></div>`;
      }).join('')}</div>`;
    }
    const f = CMP_F[j] || [];
    const sk = j !== 'DATA_DIRI' ? `<div class="sk-banner mb-12"><div style="min-width:0"><div class="caps" style="font-size:10px">Nomor SK diajukan</div><div class="no mono">${esc(dj.NomorSK || '-')}</div></div>${dok.DokumenID ? `<button class="btn btn-primary btn-sm" data-act="doc" data-id="${esc(dok.DokumenID)}" data-t="${esc('SK ' + (dj.NomorSK || ''))}">${ic('picture_as_pdf', 's18')}Lihat Dokumen SK</button>` : ''}</div>` : '';
    const kiri = sb._kosong ? `<div class="cmp-col"><div class="row between"><b>${j === 'DATA_DIRI' ? 'Data Saat Ini' : 'Riwayat Terakhir'}</b><span class="badge b-mut">Sebelum</span></div>${emptyBox('Belum ada data sebelumnya', 'Ini akan menjadi riwayat pertama.', JENIS_IC[j])}</div>` : this.col(j === 'DATA_DIRI' ? 'Data Saat Ini' : 'Riwayat Terakhir', '<span class="badge b-mut">Sebelum</span>', f, sb);
    return sk + `<div class="cmp">${kiri}${this.col(j === 'DATA_DIRI' ? 'Data Diajukan' : 'Riwayat Baru', '<span class="badge b-pri">Diajukan</span>', f, dj, sb._kosong ? null : sb, true)}</div>
      ${j === 'DATA_DIRI' ? `<p class="faint mt-8" style="font-size:12px">${ic('info', 's14')} Field berlatar ungu (●) adalah data yang berubah.</p>` : `<p class="faint mt-8" style="font-size:12px">${ic('info', 's14')} Riwayat baru ditambahkan tanpa menghapus riwayat lama; nilai terkini mengikuti tanggal berlaku terbaru.</p>`}`;
  },
  html(pg) { return `<div class="stack">${this.head(pg)}<div>${this.body(pg)}</div></div>`; }
};

const PJ = {};
async function bukaPengajuan(id) {
  if (String(id).indexOf('tmp-') === 0) return toast('info', 'Masih dikirim', 'Pengajuan ini sedang dikirim ke server.');
  const m = Modal.open({ title: `${ic('description')} Detail Pengajuan`, size: 'lg', body: skelRows(5, 54), foot: `<span class="grow"></span><button class="btn btn-outline" data-close>Tutup</button>` });
  m.foot.querySelector('[data-close]').onclick = m.close;
  try {
    const pg = PJ[id] || (PJ[id] = await API.call('pengajuan.detail', { id }, { retry: 1 }));
    if (m.closed) return;
    m.body.innerHTML = Cmp.html(pg);
    const bisaUlang = pg.Status === 'Ditolak' && !isSA() && pg.Jenis !== 'CUTI';
    if (bisaUlang) {
      const b = document.createElement('button'); b.className = 'btn btn-primary'; b.innerHTML = ic('restart_alt', 's18') + 'Ajukan Ulang';
      b.onclick = () => { m.close(); go('ajukan', { nip: pg.NIP, jenis: pg.Jenis, prefill: pg.DataDiajukan }); };
      m.foot.appendChild(b);
    }
    if (isSA() && pg.Status === 'Pending') {
      const b = document.createElement('button'); b.className = 'btn btn-primary'; b.innerHTML = ic('how_to_reg', 's18') + 'Tinjau & Putuskan';
      b.onclick = () => { m.close(); go('persetujuan', { id: pg.ID }); }; m.foot.appendChild(b);
    }
  } catch (e) { if (!m.closed) m.body.innerHTML = `<div class="empty"><div class="e-ic" style="background:var(--danger-bg);color:var(--danger)">${ic('error')}</div><b>Detail tidak dapat dimuat</b><p>${esc(e.message)}</p></div>`; }
}
ACT.lihatPengajuan = (el) => {
  const id = el.dataset.id;
  const r = (S.pengajuan.rows || []).find((x) => x.ID === id) || ((S.dash && S.dash.terbaru) || []).find((x) => x.ID === id) || ((S.dash && S.dash.pending && S.dash.pending.items) || []).find((x) => x.ID === id);
  if (isSA() && r && r.Status === 'Pending') return go('persetujuan', { id });
  bukaPengajuan(id);
};

PAGES.ajukan = {
  st: { nip: '', jenis: null, prefill: null, sent: null }, memSeq: 0,
  show(p, sama) {
    p = p || {};
    if (this.done && !p.jenis && !p.nip && !p.prefill && !p.force) return;
    if (p.nip) this.st.nip = String(p.nip);
    else if (!this.st.nip) this.st.nip = S.user.nip && S.profil ? S.user.nip : '';
    if (p.jenis) { this.st.jenis = p.jenis; this.st.sent = null; }
    this.st.prefill = p.prefill || null;
    this.render(!!p.keepFiles);
  },
  det() { const n = this.st.nip; if (!n) return null; if (S.profil && S.profil.pegawai.NIP === n) return S.profil; return S.detail[n] || null; },
  render(keepFiles) {
    const adm = isAdm();
    $('#pg-ajukan').innerHTML = pageHead(['Utama', 'Ajukan Perubahan'], 'Ajukan Perubahan Data', adm ? `Ajukan perubahan atas nama Anda atau pegawai di <b>${esc(S.user.unit)}</b>. Semua perubahan (kecuali Riwayat Cuti) berlaku setelah disetujui Superadmin.` : 'Pilih jenis perubahan, isi formulir, dan lampirkan dokumen sah. Perubahan berlaku setelah disetujui Superadmin.', `<button class="btn btn-outline" data-act="nav" data-r="riwayat">${ic('history', 's18')}Riwayat Pengajuan</button>`)
      + (adm ? this.targetCard() : '') + '<div data-ajk-body></div>';
    this.done = true;
    this.renderBody(keepFiles);
  },
  targetCard() {
    const rows = S.idx.rows.slice().sort((a, b) => String(a.Nama).localeCompare(String(b.Nama)));
    const own = S.user.nip && S.profil;
    const sel = this.st.nip;
    return `<div class="card mb-12" style="padding:16px 18px"><div class="row wrap gap-12"><span class="card-ic">${ic('person_search', 's18')}</span><div class="grow" style="min-width:220px"><label class="flabel" for="ajk-target">Ajukan atas nama</label>
      ${S.idx.mode === 'full' ? `<select class="select mt-4" id="ajk-target" data-change="ajkTarget"><option value="">— Pilih pegawai (${rows.length}) —</option>${own ? `<option value="${esc(S.user.nip)}" ${sel === S.user.nip ? 'selected' : ''}>Diri saya — ${esc(S.profil.pegawai.Nama)}</option>` : ''}${rows.filter((r) => r.NIP !== S.user.nip).map((r) => `<option value="${esc(r.NIP)}" ${sel === r.NIP ? 'selected' : ''}>${esc(r.Nama)} — ${esc(r.NIP)}</option>`).join('')}</select>`
        : `<form class="row mt-4" data-submit="ajkNip"><input class="input mono" name="nip" inputmode="numeric" maxlength="18" placeholder="Ketik 18 digit NIP pegawai" value="${esc(sel)}"><button class="btn btn-outline">Pilih</button></form>`}</div>
      <span class="chip">${ic('domain', 's14')}${esc(S.user.unit)}</span></div></div>`;
  },
  renderBody(keepFiles) {
    const box = $('[data-ajk-body]'), nip = this.st.nip;
    if (!box) return;
    if (!nip) { box.innerHTML = `<div class="card">${emptyBox('Pilih pegawai terlebih dahulu', 'Gunakan pilihan "Ajukan atas nama" di atas untuk menentukan pegawai.', 'person_search')}</div>`; return; }
    const d = this.det();
    if (!d) {
      box.innerHTML = `<div class="card">${skelRows(2, 96)}</div>`;
      API.call('pegawai.detail', { nip }, { retry: 1 }).then((x) => { S.detail[nip] = x; if (this.st.nip === nip) this.renderBody(keepFiles); })
        .catch((e) => { box.innerHTML = `<div class="card">${emptyBox('Data pegawai tidak dapat dimuat', e.message, 'error')}</div>`; });
      return;
    }
    box.innerHTML = `<div class="card"><div class="card-h"><div><div class="card-t">Pilih Jenis Perubahan</div><div class="card-s">${esc(d.pegawai.Nama)} · NIP ${fmtNip(d.pegawai.NIP)}</div></div>${d.kelengkapan.status === 'Lengkap' ? bStatus('Lengkap') : `<span class="badge b-warn">${ic('warning')}${d.kelengkapan.kosong.length} kategori belum lengkap</span>`}</div><div class="cat-grid" role="radiogroup" aria-label="Jenis perubahan">${KAT_ORDER.map((j) => this.catHtml(d, j)).join('')}</div></div>
      <div class="grid mt-16"><div class="g-8" data-ajk-form></div><div class="g-4"><div class="stack" data-ajk-side></div></div></div>`;
    this.renderForm(keepFiles);
  },
  pending(d, j) {
    const aktif = (r) => r.Jenis === j && (r.Status === 'Pending' || r.Status === 'Mengirim');
    const dariList = (S.pengajuan.rows || []).find((r) => r.NIP === d.pegawai.NIP && aktif(r));
    return S.pengajuan.mode === 'full' ? dariList : (dariList || (d.pending || []).find(aktif));
  },
  catHtml(d, j) {
    const on = this.st.jenis === j, pend = j !== 'CUTI' && this.pending(d, j), kosong = (d.kelengkapan.kosong || []).indexOf(JENIS_LABEL[j]) >= 0, inf = KAT_INFO[j];
    return `<button type="button" class="cat ${on ? 'on' : ''}" role="radio" aria-checked="${on}" data-act="ajkCat" data-j="${j}"><div class="top"><span class="ic">${ic(JENIS_IC[j], 's18')}</span>${pend ? `<span class="tg b-warn">Pending</span>` : kosong ? `<span class="tg b-bad">Belum lengkap</span>` : `<span class="tg ${inf.tag[1]}">${inf.tag[0]}</span>`}</div><b>${JENIS_LABEL[j]}</b><small>${inf.d}</small></button>`;
  },
  renderForm(keepFiles) {
    const j = this.st.jenis, d = this.det(), form = $('[data-ajk-form]'), side = $('[data-ajk-side]');
    if (!form) return;
    side.innerHTML = this.sideHtml(d, j);
    if (!keepFiles) { clearFiles('ajk:'); clearFiles('kel:'); }
    this.memSeq = 0;
    if (!j) { form.innerHTML = `<div class="card">${emptyBox('Pilih jenis perubahan', 'Klik salah satu kategori di atas untuk menampilkan formulir pengajuan.', 'touch_app')}</div>`; return; }
    if (this.st.sent && this.st.sent.Jenis === j) { form.innerHTML = this.suksesHtml(this.st.sent); return; }
    const pend = j !== 'CUTI' && this.pending(d, j);
    if (pend) {
      form.innerHTML = `<div class="card"><div class="banner warn">${ic('hourglass_top')}<div><b>Masih ada pengajuan ${JENIS_LABEL[j]} yang menunggu persetujuan</b><p>${esc(pend.Ringkasan || '')} · diajukan ${fmtTgl(pend.TglPengajuan, true)}. Pengajuan baru untuk kategori yang sama dapat dibuat setelah Superadmin memutuskan.</p></div></div><div class="row mt-16"><button class="btn btn-outline" data-act="lihatPengajuan" data-id="${esc(pend.ID)}">${ic('visibility', 's18')}Lihat Pengajuan</button></div></div>`;
      return;
    }
    const pre = this.st.prefill || {};
    let inner = '';
    if (j === 'KELUARGA') inner = this.kelHtml(d, pre);
    else if (j === 'DATA_DIRI') inner = formHtml(FS.DATA_DIRI, Object.assign({}, d.pegawai, this.st.prefill || {}), 'aj-');
    else inner = formHtml(FS[j], pre, 'aj-') + `<div class="fgrid mt-16">${dropzone('ajk:DokumenID', { label: j === 'CUTI' ? 'Surat / Berkas Cuti (PDF)' : 'Dokumen SK (PDF)', req: 1, span: 1, hint: j === 'CUTI' ? 'Surat izin cuti yang sudah ditandatangani' : 'Scan SK asli · PDF maks. 1 MB' })}</div>`;
    const intro = j === 'DATA_DIRI' ? 'Ubah data yang perlu diperbarui. Data lain biarkan seperti semula.' : j === 'KELUARGA' ? 'Tambahkan atau perbarui pasangan/anak yang menjadi tanggungan tunjangan.' : j === 'CUTI' ? 'Riwayat cuti langsung tersimpan setelah dikirim.' : 'Isi sesuai SK terbaru. Riwayat lama tetap tersimpan.';
    form.innerHTML = `<form class="card" data-submit="ajukan" novalidate><div class="card-h"><div><div class="card-t"><span class="card-ic">${ic(JENIS_IC[j], 's18')}</span>${j === 'CUTI' ? 'Catat Riwayat Cuti' : 'Formulir ' + JENIS_LABEL[j]}</div><div class="card-s">${intro}</div></div><span class="badge ${KAT_INFO[j].tag[1]}">${KAT_INFO[j].tag[0]}</span></div>
      ${this.st.prefill ? `<div class="banner info mb-12">${ic('restart_alt')}<div><b>Isian sebelumnya dipulihkan</b><p>Periksa kembali data${j === 'KELUARGA' || j !== 'DATA_DIRI' ? ' dan lampiran dokumen' : ''} sebelum mengirim.</p></div></div>` : ''}
      ${inner}${j === 'JABATAN' ? jabatanDatalist() : ''}
      <div class="row between wrap mt-20" style="border-top:1px solid var(--border);padding-top:16px;gap:12px"><span class="faint" style="font-size:12px">${ic('lock', 's14')} Dokumen disimpan aman di Google Drive instansi.</span><div class="row"><button type="button" class="btn btn-outline" data-act="ajkReset">${ic('restart_alt', 's18')}Reset</button><button class="btn btn-primary" type="submit">${ic(j === 'CUTI' ? 'save' : 'send', 's18')}${j === 'CUTI' ? 'Simpan Cuti' : 'Kirim Pengajuan'}</button></div></div></form>`;
    if (j === 'KELUARGA') this.kelInit(d, pre);
  },
  sideHtml(d, j) {
    const p = d.pegawai;
    let cur = '';
    if (!j) cur = `<div class="card"><div class="card-h"><div class="card-t">Ringkasan Pegawai</div></div><div class="row mb-12">${avatar(p.Nama, 'lg')}<div style="min-width:0"><b class="truncate" style="display:block">${esc(p.Nama)}</b><small class="muted mono">${fmtNip(p.NIP)}</small></div></div><dl class="kv"><div><dt>Unit Kerja</dt><dd>${esc(p.UnitKerja || '—')}</dd></div><div><dt>Golongan</dt><dd>${esc(p.Golongan || '—')}</dd></div><div class="full"><dt>Jabatan</dt><dd>${esc(p.Jabatan || '—')}</dd></div></dl>${(d.kelengkapan.kosong || []).length ? `<div class="banner warn mt-12">${ic('warning')}<div><b>Belum lengkap</b><p>${esc(d.kelengkapan.kosong.join(', '))}</p></div></div>` : ''}</div>`;
    else if (j === 'DATA_DIRI') cur = `<div class="card"><div class="card-h"><div class="card-t">Data Saat Ini</div></div><dl class="kv">${FS.DATA_DIRI.map((f) => `<div class="${f.k === 'Alamat' || f.k === 'Nama' ? 'full' : ''}"><dt>${f.l}</dt><dd>${p[f.k] ? esc(p[f.k]) : '<span class="faint">— belum diisi —</span>'}</dd></div>`).join('')}</dl></div>`;
    else if (j === 'KELUARGA') cur = `<div class="card"><div class="card-h"><div class="card-t">Tanggungan Terdaftar</div><span class="chip">${d.keluarga.length}</span></div>${d.keluarga.length ? `<div class="stack-8">${d.keluarga.map((k) => `<div class="mini">${avatar(k.Nama)}<div class="grow" style="min-width:0"><b class="truncate">${esc(k.Nama)}</b><small>${k.JenisAnggota} · ${k.Usia === null ? '-' : k.Usia + ' th'}</small></div>${bStatus(k.StatusTunjangan || 'Aktif')}</div>`).join('')}</div>` : `<p class="muted" style="font-size:13px">${String(p.TidakAdaTanggungan).toUpperCase() === 'YA' ? 'Tercatat: tidak ada tanggungan keluarga.' : 'Belum ada data tanggungan.'}</p>`}</div>`;
    else {
      const list = d[KAT_TAB[j]] || [], r = list[0];
      cur = `<div class="card"><div class="card-h"><div class="card-t">${j === 'CUTI' ? 'Cuti Terakhir' : 'Data Saat Ini'}</div><span class="chip">${list.length} riwayat</span></div>${r ? (j === 'CUTI' ? `<div class="stack-8">${list.slice(0, 3).map((c) => `<div class="mini"><span class="ic">${ic('event_busy', 's18')}</span><div class="grow" style="min-width:0"><b class="truncate">${esc(c.JenisCuti)}</b><small>${fmtTgl(c.TglMulai, true)} – ${fmtTgl(c.TglSelesai, true)}</small></div></div>`).join('')}</div>` : `<dl class="kv">${(CMP_F[j] || []).map((f) => `<div class="${f[0] === 'NomorSK' || f[0] === 'Jabatan' || f[0] === 'UnitKerja' ? 'full' : ''}"><dt>${f[1]}</dt><dd>${fmtVal(f[0], r[f[0]])}</dd></div>`).join('')}</dl>${r.DokumenID ? `<button class="btn btn-sm btn-outline btn-block mt-12" data-act="doc" data-id="${esc(r.DokumenID)}" data-t="SK ${esc(r.NomorSK || '')}">${ic('visibility', 's18')}Lihat SK Terakhir</button>` : ''}`) : `<p class="muted" style="font-size:13px">Belum ada data ${JENIS_LABEL[j]}.</p>`}</div>`;
    }
    const ket = j ? (KETENTUAN[j] || KETENTUAN.SK) : ['Pilih kategori sesuai data yang berubah.', 'Pengajuan diproses Superadmin; Anda mendapat notifikasi & email saat diputuskan.', 'Satu kategori hanya dapat memiliki satu pengajuan Pending.'];
    return cur + `<div class="card flat"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('rule', 's18')}</span>Ketentuan</div></div><ul style="margin:0;padding-left:18px;font-size:12.5px;color:var(--text-2)" class="stack-8">${ket.map((k) => `<li>${esc(k)}</li>`).join('')}</ul><a class="btn btn-ghost btn-sm mt-12" href="${esc(waLink())}" target="_blank" rel="noopener" data-wa>${ic('support_agent', 's18')}Butuh bantuan? Hubungi via WhatsApp</a></div>`;
  },
  suksesHtml(t) {
    const cuti = t.Jenis === 'CUTI';
    return `<div class="card t-center" style="padding:36px 20px"><div class="e-ic" style="width:64px;height:64px;border-radius:20px;margin:0 auto 12px;display:grid;place-items:center;background:var(--success-bg);color:var(--success)">${ic(cuti ? 'event_available' : 'mark_email_read', 's32')}</div>
      <h2 style="font-size:19px;font-weight:700">${cuti ? 'Riwayat cuti disimpan' : 'Pengajuan terkirim'}</h2>
      <p class="muted mt-4" style="max-width:460px;margin-left:auto;margin-right:auto">${esc(t.Ringkasan || '')}</p>
      <p class="mt-8">${cuti ? bStatus('Disetujui').replace('Disetujui', 'Tersimpan') : bStatus('Pending')}</p>
      <p class="faint mt-8" style="font-size:12px">${cuti ? 'Data cuti tercatat di profil pegawai.' : 'Anda akan menerima notifikasi & email setelah Superadmin memutuskan.'}</p>
      <div class="row wrap mt-20" style="justify-content:center"><button class="btn btn-outline" data-act="nav" data-r="${cuti && allowed('profil') ? 'profil' : 'riwayat'}" ${cuti && allowed('profil') ? `data-p='{"tab":"cuti"}'` : ''}>${ic(cuti ? 'account_circle' : 'history', 's18')}${cuti && allowed('profil') ? 'Lihat di Profil' : 'Lihat Riwayat'}</button><button class="btn btn-primary" data-act="ajkBaru">${ic('add', 's18')}Ajukan Perubahan Lain</button></div></div>`;
  },

  kelHtml(d, pre) {
    const ex = d.keluarga || [], tidak = !!pre.tidakAda;
    return `<div class="stack">
      ${ex.length ? `<div><div class="flabel mb-8">Anggota terdaftar — pilih "Perbarui" bila ada perubahan / dokumen baru</div><div class="stack-8">${ex.map((k) => { const kuliah = k.JenisAnggota === 'Anak' && k.Usia >= 21, ki = kuliahInfo(k); return `<div class="mini" data-exrow="${esc(k.ID)}">${avatar(k.Nama)}<div class="grow" style="min-width:0"><b class="truncate">${esc(k.Nama)}</b><small>${k.JenisAnggota === 'Anak' ? 'Anak' : 'Pasangan'} · ${k.Usia === null ? '-' : k.Usia + ' th'} · ${[k.DokKP4 && 'KP4', k.DokKK && 'KK', k.DokKuliah && ('Aktif Kuliah' + (ki.sampai ? ' s.d. ' + fmtTgl(ki.sampai, true) : ''))].filter(Boolean).join(', ') || 'tanpa dokumen'}</small></div>${kuliah && !ki.berlaku ? `<span class="badge b-warn">${ic('school')}${ki.ada ? 'SK Kuliah kedaluwarsa' : 'Perlu SK Kuliah'}</span>` : kuliah && ki.sisa !== null && ki.sisa <= 30 ? `<span class="badge b-warn">${ic('schedule')}SK Kuliah ${ki.sisa} hari lagi</span>` : bStatus(k.StatusTunjangan || 'Aktif')}<button type="button" class="btn btn-xs btn-soft" data-act="kelPerbarui" data-id="${esc(k.ID)}">${ic('edit', 's16')}Perbarui</button></div>`; }).join('')}</div></div>` : ''}
      <label class="check f-section" style="align-items:flex-start"><input type="checkbox" name="tidakAda" data-change="kelTidak" ${tidak ? 'checked' : ''} style="margin-top:3px"><span><b>Tidak ada tanggungan keluarga</b><span class="muted" style="display:block;font-size:12px;font-weight:400">Centang bila belum menikah / tidak memiliki tanggungan. Wajib melampirkan formulir KP4 atau surat pernyataan.</span></span></label>
      <div data-kel-tidak ${tidak ? '' : 'hidden'}><div class="fgrid">${dropzone('kel:tidakAda.DokKP4', { label: 'Formulir KP4 / Surat Pernyataan (PDF)', req: 1, span: 1 })}</div></div>
      <div data-kel-main ${tidak ? 'hidden' : ''}><div class="stack" data-roster></div>
        <div class="row wrap mt-12"><button type="button" class="btn btn-outline" data-act="kelAdd" data-j="Pasangan">${ic('favorite', 's18')}Tambah Pasangan</button><button type="button" class="btn btn-outline" data-act="kelAdd" data-j="Anak">${ic('child_care', 's18')}Tambah Anak</button></div>
        <div class="f-section mt-16" data-kel-docs><h4>${ic('upload_file', 's16')} Dokumen pendukung usulan — cukup sekali untuk semua anggota</h4>
          <div class="fgrid">${dropzone('kel:DokKP4', { label: 'Formulir KP4', req: 1, hint: 'Satu formulir mencakup seluruh anggota keluarga' })}${dropzone('kel:DokKK', { label: 'Kartu Keluarga', req: 1, hint: 'KK terbaru / legalisir' })}</div>
          <p class="faint mt-8" style="font-size:12px">${ic('info', 's14')} Berlaku untuk semua anggota yang diusulkan di atas. Tidak wajib bila hanya memperbarui anggota yang KP4 & KK-nya sudah tersimpan (mis. sekadar memperbarui Surat Aktif Kuliah).</p></div></div>
    </div>`;
  },
  kelInit(d, pre) {
    const box = $('[data-ajk-form] [data-roster]');
    box._ctx = { pfx: 'kel', existingList: d.keluarga || [], sharedDocs: true };
    const ang = (pre && pre.anggota) || [];
    if (ang.length) ang.forEach((m) => this.addMember(Object.assign({}, m), m.ID ? d.keluarga.find((x) => x.ID === m.ID) : null, true));
    else if (!(d.keluarga || []).length && !pre.tidakAda) this.addMember({ JenisAnggota: '' }, null, true);
    this.kelButtons();
  },
  addMember(m, ex, silent) {
    const box = $('[data-ajk-form] [data-roster]'); if (!box) return;
    const n = this.memSeq++;
    box.insertAdjacentHTML('beforeend', memberCard(n, m, Object.assign({}, box._ctx, { existing: ex || null })));
    renumberMembers(box); this.kelButtons();
    if (!silent) { const c = box.lastElementChild; c.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); const i = c.querySelector('input[name=Nama]'); if (i) setTimeout(() => i.focus({ preventScroll: true }), 200); }
  },
  kelButtons() {
    const f = $('[data-ajk-form]'); if (!f) return;
    const d = this.det(), ids = $$('[data-roster] [data-member]', f).map((c) => c.dataset.id).filter(Boolean);
    const adaPas = (d.keluarga || []).some((k) => k.JenisAnggota === 'Pasangan') || $$('[data-roster] [data-member]', f).some((c) => { const s = c.querySelector('[name=JenisAnggota]'); return s && s.value === 'Pasangan'; });
    const bp = f.querySelector('[data-act="kelAdd"][data-j="Pasangan"]'); if (bp) { bp.disabled = adaPas; bp.title = adaPas ? 'Pasangan sudah terdaftar — gunakan "Perbarui"' : ''; }
    $$('[data-act="kelPerbarui"]', f).forEach((b) => { const on = ids.indexOf(b.dataset.id) >= 0; b.disabled = on; b.innerHTML = on ? ic('check', 's16') + 'Dipilih' : ic('edit', 's16') + 'Perbarui'; });
    ['DokKP4', 'DokKK'].forEach((k) => {
      const lbl = f.querySelector(`[data-dropwrap="kel:${k}"] > label`); if (!lbl) return;
      const wajib = this.kelDokWajib(k), ada = lbl.querySelector('.req');
      if (wajib && !ada) lbl.insertAdjacentHTML('beforeend', ' <span class="req">*</span>'); else if (!wajib && ada) ada.remove();
    });
  },

  kelDokWajib(k) {
    const f = $('[data-ajk-form]'), d = this.det(); if (!f || !d) return true;
    const cards = $$('[data-roster] [data-member]', f);
    return !cards.length || cards.some((c) => { const ex = c.dataset.id ? (d.keluarga || []).find((x) => x.ID === c.dataset.id) : null; return !(ex && ex[k]); });
  },

  submit(f) {
    const j = this.st.jenis, nip = this.st.nip, d = this.det();
    if (!j || !d) return;
    let data; const docsMap = {};
    if (j === 'KELUARGA') {
      const tidak = f.querySelector('[name=tidakAda]').checked;
      if (tidak) {
        if (!FILES.get('kel:tidakAda.DokKP4')) { showErrs(f, { 'kel:tidakAda.DokKP4': 'Lampirkan formulir KP4 / surat pernyataan (PDF).' }); return; }
        data = { tidakAda: true, anggota: [] }; docsMap['tidakAda.DokKP4'] = 'kel:tidakAda.DokKP4';
      } else {
        const cards = $$('[data-roster] [data-member]', f);
        if (!cards.length) return toast('warn', 'Belum ada anggota', 'Tambahkan minimal satu anggota keluarga, atau centang "Tidak ada tanggungan keluarga".');
        const ang = []; let first = null;
        cards.forEach((c, pos) => {
          const m = readMember(c), ex = m.ID ? d.keluarga.find((x) => x.ID === m.ID) : null, e = validateMember(c, m, 'kel', false, ex, true);
          showErrs(c, e, true); if (!first && Object.keys(e).length) first = c.querySelector('.field.err');
          const kk = `kel:a${c.dataset.member}.DokKuliah`; if (FILES.get(kk)) docsMap[`a${pos}.DokKuliah`] = kk; else delete m.KuliahSemester;
          delete m.StatusTunjangan; ang.push(m);
        });
        const box = f.querySelector('[data-kel-docs]'), eDok = {};
        ['DokKP4', 'DokKK'].forEach((k) => {
          if (FILES.get('kel:' + k)) docsMap[k] = 'kel:' + k;
          else if (this.kelDokWajib(k)) eDok['kel:' + k] = (k === 'DokKP4' ? 'Formulir KP4' : 'Kartu Keluarga') + ' (PDF) wajib — cukup satu berkas untuk seluruh anggota.';
        });
        if (box) { showErrs(box, eDok, true); if (!first && Object.keys(eDok).length) first = box.querySelector('.field.err'); }
        if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); return toast('warn', 'Periksa kembali isian', 'Ada data anggota keluarga yang belum lengkap.'); }
        if (ang.filter((a) => a.JenisAnggota === 'Pasangan').length > 1) return toast('warn', 'Pasangan lebih dari satu', 'Hanya satu pasangan yang dapat didaftarkan untuk tunjangan.');
        data = { tidakAda: false, anggota: ang };
      }
    } else {
      const r = readForm(f, FS[j]); data = r.vals;
      if (j !== 'DATA_DIRI') { if (!FILES.get('ajk:DokumenID')) r.errs['ajk:DokumenID'] = (j === 'CUTI' ? 'Berkas cuti' : 'Dokumen SK') + ' (PDF) wajib dilampirkan.'; docsMap.DokumenID = 'ajk:DokumenID'; }
      if (showErrs(f, r.errs)) return;
      if (j === 'DATA_DIRI' && !FS.DATA_DIRI.some((x) => String(d.pegawai[x.k] || '') !== String(data[x.k] || ''))) return toast('info', 'Tidak ada perubahan', 'Ubah minimal satu data sebelum mengirim pengajuan.');
    }
    this.kirim(j, nip, d, data, docsMap);
  },
  async kirim(j, nip, d, data, docsMap) {
    let docs;
    try { docs = await collectDocs(docsMap); } catch (e) { return errToast(e); }
    const snap = Object.keys(docsMap).map((k) => [j === 'KELUARGA' ? 'kel:' + k : docsMap[k], FILES.get(docsMap[k])]).filter((x) => x[1]);
    const restore = (e) => {
      snap.forEach((x) => FILES.set(x[0], x[1]));
      const reopen = () => go('ajukan', { nip, jenis: j, prefill: data, keepFiles: true });
      if (S.route === 'ajukan' && this.st.nip === nip) { this.st.sent = null; reopen(); }
      else this.done = false;
      toast('err', j === 'CUTI' ? 'Riwayat cuti gagal disimpan' : 'Pengajuan gagal dikirim', e.message + ' Isian Anda sudah dipulihkan.', { action: S.route === 'ajukan' ? null : { label: 'Buka formulir', fn: reopen }, ms: 10000 });
    };
    const p = d.pegawai;
    if (j === 'CUTI') {
      const rec = Object.assign({ ID: 'tmp-' + uid(), NIP: nip, DokumenID: '', DiinputOleh: S.user.username, DibuatPada: nowIsoLocal() }, data);
      (d.cuti = d.cuti || []).unshift(rec);
      this.st.sent = { Jenis: 'CUTI', Ringkasan: `${data.JenisCuti} · ${fmtTgl(data.TglMulai, true)} – ${fmtTgl(data.TglSelesai, true)}` };
      this.st.prefill = null; this.renderBody();
      PAGES.profil.done = false;
      Sync.run('Menyimpan cuti…', API.call('cuti.submit', { nip, data, docs })).then((saved) => {
        const i = d.cuti.indexOf(rec); if (i >= 0) d.cuti[i] = saved; Detail.refresh(nip);
        toast('ok', 'Riwayat cuti tersimpan', data.JenisCuti + ' tercatat di profil pegawai.');
      }).catch((e) => { d.cuti = d.cuti.filter((x) => x !== rec); Detail.refresh(nip); restore(e); });
      return;
    }
    const tmp = { ID: 'tmp-' + uid(), NIP: nip, Nama: p.Nama, UnitKerja: p.UnitKerja, Jenis: j, JenisLabel: JENIS_LABEL[j], Ringkasan: ringkasLokal(j, d, data), DiajukanOleh: S.user.username, PeranPengaju: S.user.role, Status: 'Mengirim', TglPengajuan: nowIsoLocal() };
    S.pengajuan.rows.unshift(tmp); d.pending = (d.pending || []).concat([tmp]);
    this.st.sent = tmp; this.st.prefill = null;
    this.renderBody();
    PAGES.riwayat.done = false;
    Sync.run('Mengirim pengajuan…', API.call('pengajuan.submit', { jenis: j, nip, data, docs })).then((row) => {
      const i = S.pengajuan.rows.indexOf(tmp); if (i >= 0) S.pengajuan.rows[i] = row;
      d.pending = d.pending.map((x) => (x === tmp ? row : x));
      if (this.st.sent === tmp) this.st.sent = row;
      if (S.route === 'riwayat') PAGES.riwayat.renderList();
      toast('ok', 'Pengajuan terkirim', `${JENIS_LABEL[j]} menunggu persetujuan Superadmin.`);
      invalidateDash();
    }).catch((e) => {
      S.pengajuan.rows = S.pengajuan.rows.filter((x) => x !== tmp); d.pending = d.pending.filter((x) => x !== tmp);
      if (S.route === 'riwayat') PAGES.riwayat.renderList();
      restore(e);
    });
  }
};
ACT.ajkCat = (el) => {
  const pg = PAGES.ajukan, j = el.dataset.j;
  if (pg.st.jenis === j && !pg.st.sent) return;
  pg.st.jenis = j; pg.st.sent = null; pg.st.prefill = null;
  $$('[data-act="ajkCat"]').forEach((c) => { const on = c.dataset.j === j; c.classList.toggle('on', on); c.setAttribute('aria-checked', on); });
  pg.renderForm();
  if (window.innerWidth < 1024) setTimeout(() => { const f = $('[data-ajk-form]'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
};
ACT.ajkBaru = () => { const pg = PAGES.ajukan; pg.st.sent = null; pg.st.jenis = null; pg.renderBody(); $('#content').scrollTop = 0; };
ACT.ajkReset = async () => {
  const ok = await Modal.confirm({ title: 'Reset formulir?', msg: 'Semua isian dan lampiran pada formulir ini akan dikosongkan.', ok: 'Reset' });
  if (ok) { PAGES.ajukan.st.prefill = null; PAGES.ajukan.renderForm(); }
};
CHG.ajkTarget = (el) => { const pg = PAGES.ajukan; pg.st.nip = el.value; pg.st.sent = null; pg.st.prefill = null; pg.renderBody(); };
SUBMIT.ajkNip = (f) => { const n = digits(f.nip.value); if (n.length !== 18) return toast('warn', 'NIP tidak valid', 'Masukkan 18 digit NIP.'); const pg = PAGES.ajukan; pg.st.nip = n; pg.st.sent = null; pg.renderBody(); };
SUBMIT.ajukan = (f) => PAGES.ajukan.submit(f);
ACT.kelAdd = (el) => PAGES.ajukan.addMember({ JenisAnggota: el.dataset.j });
ACT.kelPerbarui = (el) => { const d = PAGES.ajukan.det(), k = d.keluarga.find((x) => x.ID === el.dataset.id); if (k) PAGES.ajukan.addMember(Object.assign({}, k), k); };
ACT.memDel = (el) => {
  const c = el.closest('[data-member]'), box = c.closest('[data-roster]');
  clearFiles(`${(box._ctx || {}).pfx || 'kel'}:a${c.dataset.member}.`);
  c.remove(); renumberMembers(box); PAGES.ajukan.kelButtons();
};
CHG.kelTidak = (el) => { const f = el.closest('form'); f.querySelector('[data-kel-tidak]').hidden = !el.checked; f.querySelector('[data-kel-main]').hidden = el.checked; };
const _memJenis = CHG.memJenis; CHG.memJenis = (el) => { _memJenis(el); PAGES.ajukan.kelButtons(); };

PAGES.riwayat = {
  dataPage: true, f: {}, page: 1, size: 20,
  show(p) {
    p = p || {};
    if (p.status !== undefined) this.f.status = p.status;
    const sa = isSA(), peg = isPeg();
    const kanan = sa ? `<button class="btn btn-primary" data-act="nav" data-r="persetujuan">${ic('how_to_reg', 's18')}Antrean Persetujuan</button>` : `<button class="btn btn-primary" data-act="nav" data-r="ajukan">${ic('add', 's18')}Ajukan Perubahan</button>`;
    $('#pg-riwayat').innerHTML = pageHead(['Utama', 'Riwayat Pengajuan'], 'Riwayat Pengajuan', peg ? 'Pantau status seluruh pengajuan perubahan data Anda.' : isAdm() ? `Seluruh pengajuan pegawai di <b>${esc(S.user.unit)}</b>.` : 'Seluruh pengajuan perubahan data pegawai.', kanan)
      + `<div class="tabs mb-12" data-rw-tabs></div>
      <form class="card filter" data-submit="rwCari" novalidate>
        ${peg ? '' : `<div class="field" style="grid-column:span ${sa ? 3 : 4}"><label for="rw-q">Cari pegawai</label><div class="input-ic">${ic('search')}<input class="input" id="rw-q" name="q" value="${esc(this.f.q || '')}" placeholder="Nama atau NIP" data-input="rwLive"></div></div>`}
        <div class="field" style="grid-column:span ${peg ? 4 : sa ? 3 : 3}"><label for="rw-j">Jenis Perubahan</label><select class="select" id="rw-j" name="jenis" data-change="rwLive"><option value="">Semua jenis</option>${KAT_ORDER.filter((k) => k !== 'CUTI').map((k) => `<option value="${k}" ${this.f.jenis === k ? 'selected' : ''}>${JENIS_LABEL[k]}</option>`).join('')}</select></div>
        ${sa ? `<div class="field" style="grid-column:span 2"><label for="rw-u">Unit Kerja</label><select class="select" id="rw-u" name="unit" data-change="rwLive">${unitOptions(this.f.unit, 'Semua unit')}</select></div>` : ''}
        <div class="field" style="grid-column:span ${peg ? 3 : 2}"><label for="rw-d">Dari tanggal</label><input class="input" type="date" id="rw-d" name="dari" value="${esc(this.f.dari || '')}" data-change="rwLive"></div>
        <div class="field" style="grid-column:span ${peg ? 3 : sa ? 2 : 3}"><label for="rw-s">Sampai tanggal</label><input class="input" type="date" id="rw-s" name="sampai" value="${esc(this.f.sampai || '')}" data-change="rwLive"></div>
        <div class="fa"><span class="info" data-rw-info></span><div class="btns row"><button type="button" class="btn btn-outline" data-act="rwReset">${ic('filter_alt_off', 's18')}Reset</button><button class="btn btn-primary">${ic('search', 's18')}Cari</button></div></div>
      </form><div class="card mt-16" data-rw-list></div>`;
    this.done = true; this.page = 1;
    this.renderList();
    if (p.id) setTimeout(() => ACT.lihatPengajuan({ dataset: { id: p.id } }), 0);
  },
  readF() { const f = $('[data-submit="rwCari"]'); if (!f) return; const g = (n) => (f.elements[n] ? String(f.elements[n].value || '').trim() : ''); Object.assign(this.f, { q: g('q'), jenis: g('jenis'), unit: g('unit'), dari: g('dari'), sampai: g('sampai') }); },
  match(r, f, noStatus) {
    if (f.jenis && r.Jenis !== f.jenis) return false;
    if (!noStatus && f.status && r.Status !== f.status && !(f.status === 'Pending' && r.Status === 'Mengirim')) return false;
    if (f.unit && r.UnitKerja !== f.unit) return false;
    const t = String(r.TglPengajuan).slice(0, 10);
    if (f.dari && t < f.dari) return false; if (f.sampai && t > f.sampai) return false;
    if (f.q) { const q = f.q.toLowerCase(), qd = digits(f.q); if (String(r.Nama).toLowerCase().indexOf(q) < 0 && !(qd.length >= 3 && String(r.NIP).indexOf(qd) >= 0)) return false; }
    return true;
  },
  async renderList() {
    const box = $('[data-rw-list]'); if (!box) return;
    let rows, total, base;
    if (S.pengajuan.mode !== 'paged') {
      base = S.pengajuan.rows.filter((r) => this.match(r, this.f, true));
      const all = base.filter((r) => this.match(r, this.f));
      total = all.length; rows = all.slice((this.page - 1) * this.size, this.page * this.size);
    } else {
      box.innerHTML = skelRows(6);
      try { const res = await API.call('pengajuan.list', { filter: this.f, page: this.page }, { retry: 1 }); rows = res.rows; total = res.total; base = null; } catch (e) { box.innerHTML = emptyBox('Gagal memuat', e.message, 'error'); return; }
    }
    const cnt = { '': 0, Pending: 0, Disetujui: 0, Ditolak: 0 };
    (base || rows).forEach((r) => { cnt['']++; const s = r.Status === 'Mengirim' ? 'Pending' : r.Status; if (cnt[s] !== undefined) cnt[s]++; });
    $('[data-rw-tabs]').innerHTML = [['', 'Semua', 'list'], ['Pending', 'Pending', 'schedule'], ['Disetujui', 'Disetujui', 'check_circle'], ['Ditolak', 'Ditolak', 'cancel']].map((t) => `<button class="tab ${(this.f.status || '') === t[0] ? 'on' : ''}" data-act="rwStatus" data-v="${t[0]}">${ic(t[2], 's16')}${t[1]}${base ? `<span class="cnt">${cnt[t[0]]}</span>` : ''}</button>`).join('');
    const inf = $('[data-rw-info]'); if (inf) inf.innerHTML = `${ic('info', 's16')} ${fmtNum(total)} pengajuan ditemukan`;
    const peg = isPeg(), no0 = (this.page - 1) * this.size;
    if (!rows.length) { box.innerHTML = emptyBox('Tidak ada pengajuan', S.pengajuan.rows.length ? 'Tidak ada data yang cocok dengan filter.' : 'Belum ada pengajuan perubahan data.', 'inbox', peg || isAdm() ? `<button class="btn btn-primary btn-sm mt-8" data-act="nav" data-r="ajukan">${ic('add', 's18')}Ajukan Perubahan</button>` : ''); return; }
    const aksi = (r) => `<button class="btn btn-xs ${r.Status === 'Pending' && isSA() ? 'btn-soft' : 'btn-outline'}" data-act="lihatPengajuan" data-id="${esc(r.ID)}" ${r.Status === 'Mengirim' ? 'disabled' : ''}>${r.Status === 'Pending' && isSA() ? 'Tinjau' : 'Detail'}</button>`;
    const st = (r) => r.Status === 'Ditolak' && r.AlasanTolak ? `<span data-tip="Alasan penolakan|${esc(r.AlasanTolak)}" tabindex="0">${bStatus(r.Status)}</span>` : bStatus(r.Status);
    box.innerHTML = `<div class="tbl-wrap responsive"><table class="tbl"><thead><tr><th class="c-no">No</th>${peg ? '' : '<th>Pegawai</th>'}${isSA() ? '<th>Unit Kerja</th>' : ''}<th>Jenis & Ringkasan</th><th>Diajukan</th><th>Status</th><th class="c-act">Aksi</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr><td class="c-no">${no0 + i + 1}</td>${peg ? '' : `<td><div class="person">${avatar(r.Nama)}<div><b>${esc(r.Nama)}</b><small class="mono">${fmtNip(r.NIP)}</small></div></div></td>`}${isSA() ? `<td style="max-width:180px">${esc(r.UnitKerja)}</td>` : ''}<td><div class="row top">${ic(JENIS_IC[r.Jenis] || 'description', 's18 muted')}<div style="min-width:0"><b style="font-weight:600">${esc(JENIS_LABEL[r.Jenis] || r.Jenis)}</b><div class="muted" style="font-size:12px;max-width:340px">${esc(r.Ringkasan)}</div>${r.PeranPengaju === 'ADMIN_UNIT' && !isAdm() ? `<div class="faint" style="font-size:11px">via Admin Unit</div>` : ''}</div></div></td><td class="nowrap">${fmtTgl(r.TglPengajuan, true)}<div class="faint" style="font-size:11px">${relWaktu(r.TglPengajuan)}</div></td><td>${st(r)}</td><td class="c-act">${aksi(r)}</td></tr>`).join('')}</tbody></table></div>
      <div class="cards-list">${rows.map((r) => `<div class="li-card"><div class="row between top"><div class="row" style="min-width:0">${peg ? `<span class="card-ic">${ic(JENIS_IC[r.Jenis] || 'description', 's18')}</span>` : avatar(r.Nama)}<div style="min-width:0"><b class="truncate" style="display:block">${esc(peg ? JENIS_LABEL[r.Jenis] : r.Nama)}</b><div class="muted" style="font-size:12px">${peg ? fmtTgl(r.TglPengajuan, true) : esc(JENIS_LABEL[r.Jenis]) + ' · ' + fmtTgl(r.TglPengajuan, true)}</div></div></div>${bStatus(r.Status)}</div><div class="muted" style="font-size:12.5px">${esc(r.Ringkasan)}</div>${r.Status === 'Ditolak' && r.AlasanTolak ? `<div class="banner bad" style="padding:8px 10px">${ic('info', 's18')}<p style="margin:0">${esc(r.AlasanTolak)}</p></div>` : ''}${aksi(r).replace('btn-xs', 'btn-sm')}</div>`).join('')}</div>
      ${pager(total, this.page, this.size, 'rwPage')}`;
  }
};
ACT.rwPage = (el) => { PAGES.riwayat.page = +el.dataset.p; PAGES.riwayat.renderList(); $('[data-rw-list]').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
ACT.rwStatus = (el) => { PAGES.riwayat.f.status = el.dataset.v; PAGES.riwayat.page = 1; PAGES.riwayat.renderList(); };
ACT.rwReset = () => { const s = PAGES.riwayat.f.status; PAGES.riwayat.f = { status: s }; PAGES.riwayat.show({}); };
SUBMIT.rwCari = () => { const pg = PAGES.riwayat; pg.readF(); pg.page = 1; pg.renderList(); };
const rwLive = debounce(() => { const pg = PAGES.riwayat; pg.readF(); pg.page = 1; if (S.pengajuan.mode !== 'paged') pg.renderList(); }, 120);
INP.rwLive = rwLive; CHG.rwLive = rwLive;

const DET_REQ = {}, DET_AT = {};

function fetchDetail(nip, force) {
  nip = String(nip);
  if (!force && S.detail[nip] && Date.now() - (DET_AT[nip] || 0) < 60000) return Promise.resolve(S.detail[nip]);
  if (!DET_REQ[nip]) DET_REQ[nip] = API.call('pegawai.detail', { nip }, { retry: 1 }).then((d) => { S.detail[nip] = d; DET_AT[nip] = Date.now(); upsertIdx(d.pegawai); return d; }).finally(() => { delete DET_REQ[nip]; });
  return DET_REQ[nip];
}
let prefetchT = null;
document.addEventListener('mouseover', (e) => {
  const t = e.target.closest && e.target.closest('[data-prefetch]');
  clearTimeout(prefetchT);
  if (t && S.token && !isPeg()) prefetchT = setTimeout(() => fetchDetail(t.dataset.prefetch).catch(() => { }), 140);
});

async function bukaDetailPegawai(nip, tab) {
  nip = String(nip);
  const p = pegByNip(nip) || (S.detail[nip] && S.detail[nip].pegawai) || { NIP: nip, Nama: 'Detail Pegawai' };
  const aksi = isSA()
    ? `<button class="btn btn-sm btn-outline" data-act="pgReset" data-nip="${esc(nip)}" title="Reset password ke NIP">${ic('lock_reset', 's18')}<span class="hide-sm">Reset Password</span></button><button class="btn btn-sm btn-danger-o btn-ic" data-act="pgHapus" data-nip="${esc(nip)}" aria-label="Hapus pegawai" title="Hapus permanen">${ic('delete', 's18')}</button>`
    : `<button class="btn btn-sm btn-primary" data-act="nav" data-r="ajukan" data-p='${JSON.stringify({ nip })}'>${ic('edit_document', 's18')}<span class="hide-sm">Ajukan Perubahan</span></button>`;
  const dr = Drawer.open({ center: true, title: esc(p.Nama), sub: 'NIP ' + fmtNip(nip) + (isSA() ? ' · mode edit langsung' : ' · hanya-baca'), actions: aksi, body: `<div class="card">${skelRows(1, 120)}</div><div class="mt-16">${skelRows(4, 60)}</div>` });
  const render = (d) => { if (Drawer.cur !== dr) return; const cur = dr.body.querySelector('[data-detail]'); if (cur) Detail.refresh(nip); else dr.body.innerHTML = Detail.html(d, { sa: isSA(), tab }); };
  if (S.detail[nip]) render(S.detail[nip]);
  try { const d = await fetchDetail(nip); render(d); }
  catch (e) { if (Drawer.cur === dr && !S.detail[nip]) dr.body.innerHTML = `<div class="card">${emptyBox('Detail tidak dapat dimuat', e.message, 'error', `<button class="btn btn-outline btn-sm mt-8" data-act="pgDetail" data-nip="${esc(nip)}">Coba lagi</button>`)}</div>`; }
}
ACT.pgDetail = (el) => bukaDetailPegawai(el.dataset.nip, el.dataset.tab);
ACT.pgReset = async (el) => {
  const nip = el.dataset.nip, p = pegByNip(nip) || {};
  const ok = await Modal.confirm({ title: 'Reset password pegawai?', icon: 'lock_reset', msg: `Password akun <b>${esc(p.Nama || nip)}</b> akan dikembalikan ke <b>NIP</b>. Pegawai wajib menggantinya saat login berikutnya dan seluruh sesi aktifnya akan berakhir.`, ok: 'Reset Password' });
  if (!ok) return;
  Sync.run('Mereset password…', API.call('kelola.reset', { username: nip })).then((r) => toast('ok', 'Password direset', `Password baru: ${r.passwordBaru}. Sampaikan kepada pegawai.`, { ms: 8000 })).catch((e) => errToast(e, 'Reset gagal'));
};
ACT.pgHapus = async (el) => {
  const nip = el.dataset.nip, p = pegByNip(nip) || (S.detail[nip] || {}).pegawai || {};
  const v = await Modal.confirm({ title: 'Hapus pegawai secara permanen?', danger: true, icon: 'delete_forever', msg: `<b>${esc(p.Nama || nip)}</b> beserta akun, riwayat, data keluarga, pengajuan, rincian gaji, dan dokumen di Drive akan <b>dihapus permanen</b>. Tindakan ini tidak dapat dibatalkan.`, input: { label: 'Ketik ulang NIP untuk konfirmasi', required: true, placeholder: nip, match: nip, matchMsg: 'NIP tidak cocok.' }, ok: 'Hapus Permanen' });
  if (!v) return;
  const i = S.idx.rows.findIndex((x) => x.NIP === nip), row = S.idx.rows[i];
  if (i >= 0) { S.idx.rows.splice(i, 1); S.idx.total--; } PEG_PAGES.clear(); delete S.detail[nip];
  Drawer.close(); if (PAGES.pegawai.done) PAGES.pegawai.renderList(); if (PAGES.kelola.done) PAGES.kelola.renderAkun();
  toast('ok', 'Pegawai dihapus', `${p.Nama || nip} dihapus dari seluruh data.`);
  Sync.run('Menghapus data…', API.call('kelola.hapus', { nip, konfirmasi: v })).then(() => invalidateDash()).catch((e) => {
    if (row) { S.idx.rows.splice(Math.max(0, i), 0, row); S.idx.total++; } PEG_PAGES.clear();
    if (PAGES.pegawai.done) PAGES.pegawai.renderList(); if (PAGES.kelola.done) PAGES.kelola.renderAkun();
    errToast(e, 'Penghapusan dibatalkan');
  });
};

PAGES.pegawai = {
  dataPage: true, f: {}, page: 1,
  size() { return S.cfg.ukuranHalaman || 25; },
  show(p) {
    p = p || {};
    if (p.filter) { this.f = Object.assign({}, p.apply ? {} : this.f, p.filter); this.page = 1; }
    const sa = isSA(), f = this.f;
    const kanan = (sa ? `<button class="btn btn-outline" data-act="nav" data-r="kelola" data-tab="import">${ic('upload_file', 's18')}Import</button><button class="btn btn-primary" data-act="nav" data-r="kelola" data-tab="tambah">${ic('person_add', 's18')}Tambah Pegawai</button>` : `<button class="btn btn-primary" data-act="nav" data-r="ajukan">${ic('edit_document', 's18')}Ajukan Perubahan</button>`) + `<button class="btn btn-outline" data-act="nav" data-r="laporan">${ic('download', 's18')}Export</button>`;
    const gol = `<option value="">Semua golongan</option>${S.master.pangkat.map((x) => `<option value="${esc(x.g)}" ${f.golongan === x.g ? 'selected' : ''}>${esc(x.g)}${x.j === 'PPPK' ? ' (PPPK)' : ''}</option>`).join('')}`;
    $('#pg-pegawai').innerHTML = pageHead(['Utama', 'Daftar Pegawai'], 'Daftar Pegawai', sa ? 'Seluruh pegawai Dinas Kesehatan Kab. Minahasa Selatan. Klik pegawai untuk melihat & mengedit data secara langsung.' : `Pegawai di <b>${esc(S.user.unit)}</b>. Klik pegawai untuk melihat detail data (hanya-baca).`, kanan)
      + `<form class="card filter" data-submit="pgCari" novalidate>
        <div class="field" style="grid-column:span ${sa ? 4 : 5}"><label for="pg-q">Cari</label><div class="input-ic">${ic('search')}<input class="input" id="pg-q" name="q" value="${esc(f.q || '')}" placeholder="NIP atau nama pegawai" data-input="pgLive" autocomplete="off"></div></div>
        ${sa ? `<div class="field" style="grid-column:span 3"><label for="pg-u">Unit Kerja</label><select class="select" id="pg-u" name="unit" data-change="pgLive">${unitOptions(f.unit, 'Semua unit kerja')}</select></div>` : ''}
        <div class="field" style="grid-column:span 2"><label for="pg-s">Status</label><select class="select" id="pg-s" name="status" data-change="pgLive">${optList(['PNS', 'PPPK'], f.status, 'PNS & PPPK')}</select></div>
        <div class="field" style="grid-column:span ${sa ? 3 : 5}"><label for="pg-g">Golongan</label><select class="select" id="pg-g" name="golongan" data-change="pgLive">${gol}</select></div>
        <div class="field" style="grid-column:span 4"><label for="pg-j">Jabatan</label><input class="input" id="pg-j" name="jabatan" list="dl-jabatan" value="${esc(f.jabatan || '')}" placeholder="Semua jabatan" data-input="pgLive" autocomplete="off"></div>
        <div class="field" style="grid-column:span 4"><label for="pg-k">Status Keaktifan</label><select class="select" id="pg-k" name="keaktifan" data-change="pgLive">${optList(S.master.keaktifan, f.keaktifan, 'Semua status')}</select></div>
        <div class="field" style="grid-column:span 4"><label for="pg-l">Kelengkapan Data</label><select class="select" id="pg-l" name="kelengkapan" data-change="pgLive">${optList(['Lengkap', 'Belum Lengkap'], f.kelengkapan, 'Semua')}</select></div>
        <div class="fa"><span class="info" data-pg-info></span><div class="btns row"><button type="button" class="btn btn-outline" data-act="pgReset0">${ic('filter_alt_off', 's18')}Reset</button><button class="btn btn-primary">${ic('search', 's18')}Cari</button></div></div>
      </form>${jabatanDatalist()}<div class="card mt-16" data-pg-list></div>`;
    this.done = true;
    this.renderList();
  },
  readF() { const fm = $('[data-submit="pgCari"]'); if (!fm) return; const g = (n) => (fm.elements[n] ? String(fm.elements[n].value || '').trim() : ''); this.f = { q: g('q'), unit: g('unit'), status: g('status'), golongan: g('golongan'), jabatan: g('jabatan'), keaktifan: g('keaktifan'), kelengkapan: g('kelengkapan') }; },
  async renderList() {
    const box = $('[data-pg-list]'); if (!box) return;
    const size = this.size(), f = Object.assign({}, this.f);
    Object.keys(f).forEach((k) => { if (!f[k]) delete f[k]; });
    let res;
    if (S.idx.mode !== 'full') { box.innerHTML = skelRows(8); }
    try { res = await queryPegawai(f, this.page, size); } catch (e) { box.innerHTML = emptyBox('Gagal memuat daftar', e.message, 'error'); return; }
    if (S.route !== 'pegawai' && !this.done) return;
    const inf = $('[data-pg-info]');
    const aktifF = Object.keys(f).length;
    if (inf) inf.innerHTML = `${ic('groups', 's16')} <b>${fmtNum(res.total)}</b>&nbsp;pegawai${aktifF ? ` · ${aktifF} filter aktif` : ''}${S.idx.mode === 'full' ? '' : ' · mode data besar (server)'}`;
    if (!res.rows.length) { box.innerHTML = emptyBox('Tidak ada pegawai', aktifF ? 'Tidak ada pegawai yang cocok dengan filter. Coba ubah atau reset filter.' : 'Belum ada data pegawai.', 'person_search', aktifF ? `<button class="btn btn-outline btn-sm mt-8" data-act="pgReset0">Reset filter</button>` : ''); return; }
    const sa = isSA(), no0 = (this.page - 1) * size;
    const kel = (r) => r.Lengkap ? bStatus('Lengkap') : `<span class="badge b-warn" data-tip="Belum lengkap|${esc(r.KategoriKosong || '-')}" tabindex="0">${ic('warning')}Belum Lengkap</span>`;
    box.innerHTML = `<div class="tbl-wrap responsive"><table class="tbl"><thead><tr><th class="c-no">No</th><th>Pegawai</th><th>Status</th>${sa ? '<th>Unit Kerja</th>' : ''}<th>Golongan</th><th>Jabatan</th><th>Kelengkapan</th><th class="c-act">Aksi</th></tr></thead><tbody>
      ${res.rows.map((r, i) => `<tr data-act="pgDetail" data-nip="${esc(r.NIP)}" data-prefetch="${esc(r.NIP)}" style="cursor:pointer"><td class="c-no">${no0 + i + 1}</td><td><div class="person">${avatar(r.Nama)}<div><b>${esc(r.Nama)}</b><small class="mono">${fmtNip(r.NIP)}</small></div></div></td><td><div class="col" style="align-items:flex-start"><span class="chip">${esc(r.StatusPegawai || '-')}</span>${r.StatusKeaktifan && r.StatusKeaktifan !== 'Aktif' ? bStatus(r.StatusKeaktifan) : ''}</div></td>${sa ? `<td style="max-width:190px">${esc(r.UnitKerja || '-')}</td>` : ''}<td>${r.Golongan ? `<span class="tag-gol">${esc(r.Golongan)}</span>` : '<span class="faint">—</span>'}</td><td style="max-width:220px"><span class="truncate" style="display:block">${esc(r.Jabatan || '—')}</span></td><td>${kel(r)}</td><td class="c-act"><button class="btn btn-xs btn-outline" data-act="pgDetail" data-nip="${esc(r.NIP)}" aria-label="Lihat detail ${esc(r.Nama)}">${ic('visibility', 's16')}Detail</button></td></tr>`).join('')}</tbody></table></div>
      <div class="cards-list">${res.rows.map((r) => `<div class="li-card"><div class="row between top"><div class="row" style="min-width:0">${avatar(r.Nama)}<div style="min-width:0"><b class="truncate" style="display:block">${esc(r.Nama)}</b><small class="muted mono">${fmtNip(r.NIP)}</small></div></div>${bStatus(r.StatusKeaktifan || 'Aktif')}</div>
        <div class="kv2"><div><span>Status</span>${esc(r.StatusPegawai || '-')}</div><div><span>Golongan</span>${esc(r.Golongan || '—')}</div><div style="grid-column:1/-1"><span>Jabatan</span>${esc(r.Jabatan || '—')}</div>${sa ? `<div style="grid-column:1/-1"><span>Unit Kerja</span>${esc(r.UnitKerja || '—')}</div>` : ''}</div>
        <div class="row between">${kel(r)}<button class="btn btn-sm btn-outline" data-act="pgDetail" data-nip="${esc(r.NIP)}">Lihat Detail</button></div></div>`).join('')}</div>
      ${pager(res.total, this.page, size, 'pgPage')}`;
  }
};
ACT.pgPage = (el) => { PAGES.pegawai.page = +el.dataset.p; PAGES.pegawai.renderList(); $('[data-pg-list]').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
ACT.pgReset0 = () => { PAGES.pegawai.f = {}; PAGES.pegawai.page = 1; PAGES.pegawai.show({}); };
SUBMIT.pgCari = () => { const pg = PAGES.pegawai; pg.readF(); pg.page = 1; pg.renderList(); };
const pgLive = debounce(() => { if (S.idx.mode !== 'full') return; const pg = PAGES.pegawai; pg.readF(); pg.page = 1; pg.renderList(); }, 120);
INP.pgLive = pgLive; CHG.pgLive = pgLive;

function infoEmailKeputusan(em, pg, wa) {
  if (!em) return;
  const waTxt = wa && wa.status === 'antri' ? ` · WhatsApp ke ${wa.ke.join(', ')}` : '';
  if (em.status === 'antri' || em.status === 'terkirim') return toast('ok', 'Notifikasi keputusan dijadwalkan', 'Email ke ' + em.ke.join(', ') + waTxt + ' — terkirim otomatis dalam ±1 menit.', { ms: 6500 });
  if (waTxt) return toast('ok', 'Notifikasi WhatsApp dijadwalkan', waTxt.slice(3) + ' — terkirim otomatis dalam ±1 menit.' + (em.status === 'tanpa-penerima' ? ' (Pegawai belum punya email.)' : ''), { ms: 6500 });
  const sebab = em.status === 'tanpa-penerima' ? `${pg.Nama} belum memiliki alamat email di Data Diri/akun. Keputusan tetap muncul sebagai notifikasi di aplikasi — isi email pegawai melalui Daftar Pegawai → Lihat Detail → Data Diri.`
    : em.status === 'nonaktif' ? 'Email notifikasi dinonaktifkan di Pengaturan → Notifikasi WA & Email.'
      : em.status === 'dimatikan' ? 'Email untuk kejadian "Keputusan pengajuan" dimatikan di matriks Pengaturan → Notifikasi WA & Email.'
        : em.status === 'kuota' ? 'Kuota email harian akun Google pemilik aplikasi sudah habis. Coba lagi besok.'
          : 'Gagal menjadwalkan email: ' + String(em.status).replace(/^gagal:\s*/, '');
  toast('warn', 'Email ke pegawai tidak terkirim', sebab, { ms: 12000 });
}
let refreshT = null;
function scheduleRefresh() { clearTimeout(refreshT); refreshT = setTimeout(() => refreshBoot(true), 3500); }
PAGES.persetujuan = {
  sel: null, tab: 'pending', f: { q: '', jenis: '' }, sf: { status: '', q: '' }, spage: 1, loading: null, at: 0,
  load(silent) {
    if (this.loading) return this.loading;
    this.loading = API.call('persetujuan.antrean', {}, { retry: 1 }).then((a) => { S.antrean = a; this.at = Date.now(); setBadge('persetujuan', a.pending.length); return a; }).finally(() => { this.loading = null; });
    return this.loading;
  },
  head() {
    return pageHead(['Utama', 'Persetujuan'], 'Persetujuan Perubahan Data', 'Tinjau perbandingan data lama ↔ baru beserta dokumen. Data master hanya berubah setelah Anda menyetujui.', `<button class="btn btn-outline" data-act="psReload">${ic('refresh', 's18')}Muat Ulang</button>`);
  },
  show(p) {
    p = p || {};
    if (p.id) { this.sel = p.id; this.tab = 'pending'; }
    const el = $('#pg-persetujuan');
    if (!S.antrean) {
      el.innerHTML = this.head() + `<div class="split"><div class="queue-pane">${skelRows(5, 92)}</div><div class="detail-pane"><div class="card">${skelRows(6, 60)}</div></div></div>`;
      this.load().then(() => { if (S.route === 'persetujuan') this.render(); }).catch((e) => { el.innerHTML = this.head() + `<div class="card">${emptyBox('Antrean gagal dimuat', e.message, 'error', `<button class="btn btn-primary btn-sm mt-8" data-act="psReload">Coba lagi</button>`)}</div>`; });
      return;
    }
    this.render();
    if (Date.now() - this.at > 60000) this.load().then(() => { if (S.route === 'persetujuan') this.render(true); }).catch(() => { });
  },
  list() {
    const f = this.f, q = String(f.q || '').toLowerCase(), qd = digits(f.q);
    return S.antrean.pending.filter((x) => (!f.jenis || x.Jenis === f.jenis) && (!q || String(x.Nama).toLowerCase().indexOf(q) >= 0 || (qd.length >= 3 && String(x.NIP).indexOf(qd) >= 0) || String(x.UnitKerja).toLowerCase().indexOf(q) >= 0));
  },
  render(keepScroll) {
    const a = S.antrean, el = $('#pg-persetujuan');
    const qs = el.querySelector('.queue') ? el.querySelector('.queue').scrollTop : 0;
    if (this.sel && !a.pending.some((x) => x.ID === this.sel)) {
      const done = a.selesai.find((x) => x.ID === this.sel);
      if (done && this.tab === 'pending') { setTimeout(() => toast('info', 'Pengajuan sudah diputuskan', `${done.Nama} — ${done.Status}`), 50); }
      this.sel = null;
    }
    const list = this.list();
    if (!this.sel && list.length && window.innerWidth >= 1024) this.sel = list[0].ID;
    const tabs = `<div class="tabs mb-16"><button class="tab ${this.tab === 'pending' ? 'on' : ''}" data-act="psTab" data-v="pending">${ic('hourglass_top', 's16')}Menunggu<span class="cnt">${a.pending.length}</span></button><button class="tab ${this.tab === 'selesai' ? 'on' : ''}" data-act="psTab" data-v="selesai">${ic('task_alt', 's16')}Sudah Diputuskan<span class="cnt">${a.jumlah.Disetujui + a.jumlah.Ditolak}</span></button></div>`;
    if (this.tab === 'selesai') { el.innerHTML = this.head() + tabs + `<div class="card" data-ps-done></div>`; this.renderSelesai(); return; }
    const lewat = a.pending.filter((x) => x.lewat).length;
    el.innerHTML = this.head() + tabs + `<div class="split ${this.sel ? 'detail-on' : ''}">
      <div class="queue-pane"><div class="card" style="padding:14px"><div class="stack-8">
        <div class="input-ic">${ic('search')}<input class="input" placeholder="Cari nama, NIP, atau unit" value="${esc(this.f.q)}" data-input="psQ" aria-label="Cari antrean"></div>
        <select class="select" data-change="psJenis" aria-label="Filter jenis"><option value="">Semua jenis (${a.pending.length})</option>${KAT_ORDER.filter((k) => k !== 'CUTI').map((k) => { const n = a.pending.filter((x) => x.Jenis === k).length; return n ? `<option value="${k}" ${this.f.jenis === k ? 'selected' : ''}>${JENIS_LABEL[k]} (${n})</option>` : ''; }).join('')}</select>
        ${lewat ? `<div class="banner bad" style="padding:8px 10px">${ic('alarm', 's18')}<p style="margin:0"><b style="display:inline">${lewat} pengajuan</b> menunggu lebih dari ${a.ambang} hari.</p></div>` : ''}</div>
        <div class="queue mt-12" style="max-height:calc(100dvh - 330px);min-height:200px;overflow-y:auto;padding:2px">${list.length ? list.map((x) => this.qCard(x)).join('') : emptyBox(a.pending.length ? 'Tidak ada yang cocok' : 'Antrean kosong 🎉', a.pending.length ? 'Ubah kata kunci atau filter jenis.' : 'Semua pengajuan sudah diproses.', 'task_alt')}</div></div></div>
      <div class="detail-pane">${this.detailHtml()}</div></div>`;
    if (keepScroll) { const q = el.querySelector('.queue'); if (q) q.scrollTop = qs; }
  },
  qCard(x) {
    return `<button class="q-card ${x.ID === this.sel ? 'on' : ''}" data-act="psSel" data-id="${esc(x.ID)}" data-q="${esc(x.ID)}"><div class="row between top" style="gap:8px"><div class="row" style="min-width:0">${avatar(x.Nama)}<div style="min-width:0"><b class="truncate" style="display:block;font-size:13.5px">${esc(x.Nama)}</b><small class="muted truncate" style="display:block">${esc(x.UnitKerja)}</small></div></div>${x.lewat ? `<span class="badge b-bad">${ic('alarm')}${x.hari} hari</span>` : `<span class="badge b-warn">${x.hari ? x.hari + ' hari' : 'Baru'}</span>`}</div>
      <div class="row" style="gap:6px"><span class="chip">${ic(JENIS_IC[x.Jenis], 's14')}${esc(JENIS_LABEL[x.Jenis])}</span>${x.PeranPengaju === 'ADMIN_UNIT' ? '<span class="chip">via Admin Unit</span>' : ''}</div>
      <small class="muted" style="font-size:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(x.Ringkasan)}</small></button>`;
  },
  detailHtml() {
    const pg = S.antrean.pending.find((x) => x.ID === this.sel);
    if (!pg) return `<div class="card">${emptyBox('Pilih pengajuan', 'Klik salah satu pengajuan di antrean untuk meninjau perbandingan data & dokumen.', 'rule')}</div>`;
    return `<div class="card"><div class="row between wrap mb-12"><button class="btn btn-sm btn-ghost" data-act="psBack">${ic('arrow_back', 's18')}Antrean</button><div class="row"><button class="btn btn-sm btn-outline" data-act="pgDetail" data-nip="${esc(pg.NIP)}">${ic('badge', 's18')}Data Pegawai</button></div></div>${Cmp.html(pg)}</div>
      <div class="card decision mt-12" style="box-shadow:var(--shadow-pop)"><div class="row between wrap" style="gap:12px"><div class="muted" style="font-size:12.5px;max-width:420px">${ic('info', 's16')} Menyetujui akan langsung memperbarui data master & mengirim notifikasi ke pegawai.</div>
        <div class="row"><button class="btn btn-danger-o" data-act="psPutus" data-a="TOLAK">${ic('close', 's18')}Tolak</button><button class="btn btn-ok" data-act="psPutus" data-a="SETUJU">${ic('check', 's18')}Setujui</button></div></div></div>`;
  },
  async putuskan(aksi) {
    const a = S.antrean, pg = a.pending.find((x) => x.ID === this.sel); if (!pg) return;
    let alasan = '', catatan = '';
    if (aksi === 'TOLAK') {
      alasan = await Modal.confirm({ title: 'Tolak pengajuan?', danger: true, icon: 'cancel', msg: `Pengajuan <b>${JENIS_LABEL[pg.Jenis]}</b> atas nama <b>${esc(pg.Nama)}</b> akan ditolak. Pegawai menerima notifikasi beserta alasan.`, input: { label: 'Alasan penolakan', required: true, area: true, placeholder: 'mis. Nomor SK tidak sesuai dengan dokumen yang dilampirkan' }, ok: 'Tolak Pengajuan' });
      if (!alasan) return;
    } else {
      const r = await Modal.confirm({ title: 'Setujui pengajuan?', icon: 'verified', msg: `Data master <b>${esc(pg.Nama)}</b> akan diperbarui sesuai pengajuan <b>${JENIS_LABEL[pg.Jenis]}</b>. Tindakan ini tercatat di audit log.`, input: { label: 'Catatan untuk pegawai (opsional)', area: true, placeholder: 'Opsional' }, ok: 'Setujui' });
      if (r === false) return; catatan = r === true ? '' : r;
    }
    const st = aksi === 'SETUJU' ? 'Disetujui' : 'Ditolak';
    const list = this.list(), pos = list.indexOf(pg), next = list[pos + 1] || list[pos - 1] || null;
    const idx = a.pending.indexOf(pg); a.pending.splice(idx, 1);
    const light = Object.assign({}, pg, { Status: st, AlasanTolak: alasan, Catatan: catatan, TglKeputusan: nowIsoLocal(), DiputuskanOleh: S.user.username });
    a.selesai.unshift(light); a.jumlah[st]++;
    const row = S.pengajuan.rows.find((x) => x.ID === pg.ID), rowBak = row ? Object.assign({}, row) : null;
    if (row) Object.assign(row, { Status: st, AlasanTolak: alasan, Catatan: catatan, TglKeputusan: light.TglKeputusan, DiputuskanOleh: light.DiputuskanOleh });
    PJ[pg.ID] = light;
    setBadge('persetujuan', a.pending.length);
    const card = $(`[data-q="${CSS.escape(pg.ID)}"]`); if (card) card.classList.add('leaving');
    this.sel = next ? next.ID : null;
    setTimeout(() => { if (S.route === 'persetujuan') this.render(true); }, 170);
    PAGES.riwayat.done = false;
    toast(aksi === 'SETUJU' ? 'ok' : 'warn', aksi === 'SETUJU' ? 'Pengajuan disetujui' : 'Pengajuan ditolak', `${pg.Nama} — ${JENIS_LABEL[pg.Jenis]}`);
    Sync.run('Menyimpan keputusan…', API.call('persetujuan.putuskan', { id: pg.ID, aksi, alasan, catatan })).then((r) => {
      delete S.detail[pg.NIP]; invalidateDash(); scheduleRefresh();
      infoEmailKeputusan(r && r.email, pg, r && r.wa);
    }).catch((e) => {
      a.selesai = a.selesai.filter((x) => x !== light); a.jumlah[st]--; delete PJ[pg.ID];
      if (row) Object.assign(row, rowBak);
      if (e.code === 'KONFLIK') { this.load().then(() => { if (S.route === 'persetujuan') this.render(); }).catch(() => { }); }
      else { a.pending.splice(Math.min(idx, a.pending.length), 0, pg); this.sel = pg.ID; setBadge('persetujuan', a.pending.length); if (S.route === 'persetujuan') this.render(true); }
      errToast(e, 'Keputusan gagal disimpan');
    });
  },
  renderSelesai() {
    const box = $('[data-ps-done]'); if (!box) return;
    const a = S.antrean, f = this.sf, q = String(f.q || '').toLowerCase();
    const rows = a.selesai.filter((x) => (!f.status || x.Status === f.status) && (!q || String(x.Nama).toLowerCase().indexOf(q) >= 0 || String(x.NIP).indexOf(digits(q) || '#') >= 0));
    const size = 20, total = rows.length, page = Math.min(this.spage, Math.max(1, Math.ceil(total / size))), view = rows.slice((page - 1) * size, page * size);
    box.innerHTML = `<div class="row wrap between mb-12" style="gap:10px"><div class="tabs">${[['', 'Semua'], ['Disetujui', 'Disetujui'], ['Ditolak', 'Ditolak']].map((t) => `<button class="tab ${f.status === t[0] ? 'on' : ''}" data-act="psSf" data-v="${t[0]}">${t[1]}${t[0] ? `<span class="cnt">${a.jumlah[t[0]]}</span>` : ''}</button>`).join('')}</div><div class="input-ic" style="min-width:240px">${ic('search')}<input class="input" placeholder="Cari nama / NIP" value="${esc(f.q)}" data-input="psSq"></div></div>
      ${view.length ? `<div class="tbl-wrap responsive"><table class="tbl"><thead><tr><th>Pegawai</th><th>Jenis</th><th>Diputuskan</th><th>Status</th><th class="c-act">Aksi</th></tr></thead><tbody>${view.map((x) => `<tr><td><div class="person">${avatar(x.Nama)}<div><b>${esc(x.Nama)}</b><small>${esc(x.UnitKerja)}</small></div></div></td><td><b style="font-weight:600">${esc(JENIS_LABEL[x.Jenis])}</b><div class="muted" style="font-size:12px;max-width:320px">${esc(x.Ringkasan)}</div></td><td class="nowrap">${fmtTgl(x.TglKeputusan, true)}<div class="faint" style="font-size:11px">oleh ${esc(x.DiputuskanOleh || '-')}</div></td><td>${bStatus(x.Status)}</td><td class="c-act"><button class="btn btn-xs btn-outline" data-act="lihatPengajuan" data-id="${esc(x.ID)}">Detail</button></td></tr>`).join('')}</tbody></table></div>
      <div class="cards-list">${view.map((x) => `<div class="li-card"><div class="row between">${avatar(x.Nama)}<div class="grow" style="min-width:0"><b class="truncate" style="display:block">${esc(x.Nama)}</b><small class="muted">${esc(JENIS_LABEL[x.Jenis])} · ${fmtTgl(x.TglKeputusan, true)}</small></div>${bStatus(x.Status)}</div><button class="btn btn-sm btn-outline" data-act="lihatPengajuan" data-id="${esc(x.ID)}">Detail</button></div>`).join('')}</div>${pager(total, page, size, 'psSp')}` : emptyBox('Belum ada keputusan', 'Pengajuan yang sudah disetujui/ditolak tampil di sini.', 'inbox')}`;
  }
};
ACT.psSel = (el) => {
  const pg = PAGES.persetujuan; pg.sel = el.dataset.id;
  $$('.q-card').forEach((c) => c.classList.toggle('on', c.dataset.id === pg.sel));
  const sp = $('#pg-persetujuan .split'); sp.classList.add('detail-on');
  sp.querySelector('.detail-pane').innerHTML = pg.detailHtml();
  if (window.innerWidth < 1024) $('#content').scrollTop = 0;
};
ACT.psBack = () => { const pg = PAGES.persetujuan; if (window.innerWidth < 1024) { pg.sel = null; pg.render(true); } else { const q = $('.q-card.on'); if (q) q.focus(); } };
ACT.psPutus = (el) => PAGES.persetujuan.putuskan(el.dataset.a);
ACT.psTab = (el) => { const pg = PAGES.persetujuan; pg.tab = el.dataset.v; pg.render(); };
ACT.psSf = (el) => { const pg = PAGES.persetujuan; pg.sf.status = el.dataset.v; pg.spage = 1; pg.renderSelesai(); };
ACT.psSp = (el) => { PAGES.persetujuan.spage = +el.dataset.p; PAGES.persetujuan.renderSelesai(); };
ACT.psReload = () => { const pg = PAGES.persetujuan; Sync.run('Memuat antrean…', pg.load().then(() => { if (S.route === 'persetujuan') pg.render(true); toast('ok', 'Antrean diperbarui'); }).catch((e) => errToast(e))); };
CHG.psJenis = (el) => { const pg = PAGES.persetujuan; pg.f.jenis = el.value; pg.sel = null; pg.render(); };
INP.psQ = debounce((el) => {
  const pg = PAGES.persetujuan; pg.f.q = el.value;
  const list = pg.list(), q = $('#pg-persetujuan .queue');
  if (q) q.innerHTML = list.length ? list.map((x) => pg.qCard(x)).join('') : emptyBox('Tidak ada yang cocok', 'Ubah kata kunci pencarian.', 'search_off');
}, 100);
INP.psSq = debounce((el) => {
  const pg = PAGES.persetujuan; pg.sf.q = el.value; pg.spage = 1;
  const pos = el.selectionStart; pg.renderSelesai();
  const n = $('[data-input="psSq"]'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) { } }
}, 150);

const nk = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
function selYmd(d) { const x = new Date(d.getTime() + 12 * 3600e3); return ymdOf(x); }

async function bacaExcel(file, o) {
  await loadLib('xlsx');
  if (file.size > 15 * 1048576) throw new AppErr('Berkas terlalu besar (maks. 15 MB).');
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
  const wajib = (o.wajib || []).map(nk), teks = (o.teks || []).map(nk);
  for (const name of wb.SheetNames) {
    const aoa = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: true, defval: '' });
    for (let h = 0; h < Math.min(15, aoa.length); h++) {
      const head = aoa[h].map((x) => String(x).trim()), keys = head.map(nk);
      if (!wajib.every((w) => keys.indexOf(w) >= 0)) continue;
      const rows = [], flags = {};
      for (let i = h + 1; i < aoa.length; i++) {
        const r = aoa[i]; if (!r.some((v) => String(v).trim() !== '')) continue;
        const obj = {}, baris = rows.length + 2;
        head.forEach((k, c) => {
          if (!k) return; let v = r[c];
          if (v instanceof Date) v = isNaN(v) ? '' : selYmd(v);
          else if (typeof v === 'number' && teks.indexOf(keys[c]) >= 0) {
            if (!Number.isSafeInteger(v)) { (flags[baris] = flags[baris] || []).push(k); v = keys[c] === 'nip' ? '' : v.toLocaleString('fullwide', { useGrouping: false }); }
            else v = String(v);
          } else if (typeof v === 'string') v = v.replace(/^'/, '').trim();
          obj[k] = v;
        });
        rows.push(obj);
      }
      return { sheet: name, rows, flags, baris0: h + 1 };
    }
  }
  throw new AppErr(`Header wajib tidak ditemukan (${(o.wajib || []).join(', ')}). Gunakan template yang disediakan.`);
}
async function unduhXlsx(sheets, nama) {
  await loadLib('xlsx');
  const wb = XLSX.utils.book_new();
  sheets.forEach((s) => XLSX.utils.book_append_sheet(wb, s.ws, s.name));
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  downloadBlob(new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), nama);
}

function wsTemplate(headers, contoh, teksCols, n) {
  const ws = XLSX.utils.aoa_to_sheet([headers, headers.map((h) => (contoh[h] === undefined ? '' : contoh[h]))]);
  const tset = teksCols.map(nk);
  headers.forEach((h, c) => {
    if (tset.indexOf(nk(h)) < 0) return;
    for (let r = 1; r <= (n || 300); r++) { const a = XLSX.utils.encode_cell({ r, c }); const cur = ws[a]; ws[a] = { t: 's', v: cur ? String(cur.v) : '', z: '@' }; }
  });
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: n || 300, c: headers.length - 1 } });
  ws['!cols'] = headers.map((h) => ({ wch: Math.max(12, h.length + 3) }));
  ws['!freeze'] = { xSplit: 2, ySplit: 1 };
  return ws;
}
const wsAoa = (aoa, cols) => { const ws = XLSX.utils.aoa_to_sheet(aoa); if (cols) ws['!cols'] = cols.map((w) => ({ wch: w })); return ws; };
function ringkasImport(r, jenis) {
  const it = jenis === 'gaji'
    ? [['Total Baris', r.total, 'list_alt', ''], ['Data Baru', r.ok - r.ganti, 'add_circle', 'ok'], ['Menimpa Periode Sama', r.ganti, 'sync', 'warn'], ['Gagal Validasi', r.gagal, 'error', 'bad']]
    : [['Total Baris', r.total, 'list_alt', ''], ['Valid (Baru)', r.ok, 'check_circle', 'ok'], ['NIP Sudah Ada', r.duplikat, 'content_copy', 'warn'], ['Gagal Validasi', r.gagal, 'error', 'bad'], ['Anak ≥ 21 Tahun', r.anak21, 'child_care', 'warn']];
  return `<div class="row wrap" style="gap:10px;align-items:stretch">${it.map((x) => `<div class="stat-bar" style="padding:12px;flex:1 1 150px"><span class="card-ic ${x[3]}">${ic(x[2], 's18')}</span><div><small class="muted">${x[0]}</small><b style="font-size:18px">${fmtNum(x[1])}</b></div></div>`).join('')}</div>`;
}

const GAJI_CACHE = {};
const SLIP = {
  hasil: ['Gaji Pokok', 'Tunjangan Keluarga', 'Tunjangan Jabatan', 'Tunjangan Fungsional', 'Tunjangan Fungsional Umum', 'Tunjangan Beras', 'Tunjangan PPh', 'Pembulatan Gaji', 'Tunjangan Khusus Papua', 'Tunjangan Jaminan Hari Tua'],
  iuran: ['Iuran Jaminan Kesehatan', 'Iuran Jaminan Kecelakaan Kerja', 'Iuran Jaminan Kematian', 'Iuran Simpanan Tapera', 'Iuran Pensiun'],
  potong: ['Potongan IWP', 'Potongan PPh 21', 'Zakat', 'Bulog'],
  identitas: ['Nama', 'NIP', 'NIK', 'NPWP', 'Tanggal Lahir', 'Status ASN', 'Golongan', 'Masa Kerja Golongan', 'Tipe Jabatan', 'Nama Jabatan', 'Eselon', 'Alamat'],
  keluarga: ['Status Pernikahan', 'Jumlah Istri/Suami', 'Jumlah Anak', 'Jumlah Tanggungan', 'Pasangan PNS', 'NIP Pasangan']
};
const num = (v) => (v === '' || v === null || v === undefined || isNaN(+v)) ? 0 : +v;
function ambilGaji(nip, per) {
  const k = nip + '|' + per;
  if (!GAJI_CACHE[k]) GAJI_CACHE[k] = API.call('gaji.get', { nip, periode: per }, { retry: 1 }).catch((e) => { delete GAJI_CACHE[k]; throw e; });
  return GAJI_CACHE[k];
}
PAGES.cekgaji = {
  nip: null, per: null, periode: [], eye: false,
  prefetch() { if (isPeg() && S.gajiPeriode[0]) { ambilGaji(S.user.nip, S.gajiPeriode[0]).catch(() => { }); if (S.gajiPeriode[1]) ambilGaji(S.user.nip, S.gajiPeriode[1]).catch(() => { }); } },
  show(p) {
    p = p || {};
    const sa = isSA();
    if (!sa) { this.nip = S.user.nip; this.periode = S.gajiPeriode || []; }
    if (p.nip) { this.nip = String(p.nip); this.per = null; this.periode = []; }
    if (p.periode) this.per = p.periode;
    $('#pg-cekgaji').innerHTML = pageHead(['Utama', 'Cek Gaji'], 'Cek Gaji', sa ? 'Lihat rincian gaji bulanan pegawai mana pun berdasarkan NIP atau nama.' : 'Rincian gaji bulanan Anda (hanya-baca). Data bersumber dari daftar gaji resmi yang diunggah Superadmin.')
      + (sa ? `<form class="card mb-16" data-submit="cgCari" style="padding:16px 18px"><div class="row wrap gap-12"><div class="grow" style="min-width:240px"><label class="flabel" for="cg-q">Pegawai</label><div class="input-ic mt-4">${ic('person_search')}<input class="input" id="cg-q" name="q" list="dl-peg" placeholder="Ketik nama atau NIP lalu pilih" value="${esc(this.nip ? (pegByNip(this.nip) || {}).Nama || this.nip : '')}" autocomplete="off" data-change="cgPick"></div></div><button class="btn btn-primary" style="align-self:flex-end">${ic('search', 's18')}Tampilkan</button></div>${S.idx.mode === 'full' ? `<datalist id="dl-peg">${S.idx.rows.map((r) => `<option value="${esc(r.NIP)}">${esc(r.Nama)}</option>`).join('')}</datalist>` : ''}</form>` : '')
      + '<div data-cg-body></div>';
    this.done = true;
    this.body();
  },
  async body() {
    const box = $('[data-cg-body]'); if (!box) return;
    if (!this.nip) { box.innerHTML = `<div class="card">${emptyBox('Pilih pegawai', 'Ketik nama atau NIP pegawai pada kolom di atas.', 'person_search')}</div>`; return; }
    if (isSA() && !this.periode.length) {
      box.innerHTML = `<div class="card">${skelRows(3, 70)}</div>`;
      try { this.periode = await API.call('gaji.periode', { nip: this.nip }, { retry: 1 }); } catch (e) { box.innerHTML = `<div class="card">${emptyBox('Gagal memuat periode', e.message, 'error')}</div>`; return; }
    }
    if (!this.periode.length) { box.innerHTML = `<div class="card">${emptyBox('Belum ada rincian gaji', isSA() ? 'Pegawai ini belum memiliki data gaji. Input melalui menu Rincian Gaji.' : 'Rincian gaji Anda belum diunggah oleh Superadmin.', 'receipt_long', isSA() ? `<button class="btn btn-primary btn-sm mt-8" data-act="nav" data-r="gaji" data-tab="input">Input Rincian Gaji</button>` : '')}</div>`; return; }
    if (!this.per || this.periode.indexOf(this.per) < 0) this.per = this.periode[0];
    box.innerHTML = `<div class="row between wrap mb-12 no-print" style="gap:10px"><div class="tabs" role="tablist" aria-label="Periode gaji">${this.periode.slice(0, 24).map((p) => `<button class="tab ${p === this.per ? 'on' : ''}" data-act="cgPer" data-p="${p}" role="tab" aria-selected="${p === this.per}">${ic('calendar_month', 's16')}${BLS[+p.slice(5, 7) - 1]} ${p.slice(0, 4)}</button>`).join('')}</div></div><div data-cg-slip></div>`;
    this.slip();
  },
  async slip() {
    const box = $('[data-cg-slip]'); if (!box) return;
    const nip = this.nip, per = this.per, k = nip + '|' + per;
    if (!GAJI_CACHE[k] || !GAJI_CACHE[k].done) box.innerHTML = `<div class="grid"><div class="g-12"><div class="skel" style="height:150px;border-radius:20px"></div></div><div class="g-7">${skelRows(6, 40)}</div><div class="g-5">${skelRows(5, 40)}</div></div>`;
    let g;
    try { g = await ambilGaji(nip, per); GAJI_CACHE[k].done = true; } catch (e) { box.innerHTML = `<div class="card">${emptyBox('Rincian gaji tidak dapat dimuat', e.message, 'error')}</div>`; return; }
    if (this.nip !== nip || this.per !== per || !$('[data-cg-slip]')) return;
    if (!g) { box.innerHTML = `<div class="card">${emptyBox('Data periode ini tidak ditemukan', '', 'receipt_long')}</div>`; return; }
    const i = this.periode.indexOf(per), prevP = this.periode[i + 1];
    const prev = prevP && GAJI_CACHE[nip + '|' + prevP] && GAJI_CACHE[nip + '|' + prevP].val;
    GAJI_CACHE[k].val = g;
    box.innerHTML = this.slipHtml(g, prev, prevP);
    if (prevP && !GAJI_CACHE[nip + '|' + prevP]) ambilGaji(nip, prevP).then((x) => { GAJI_CACHE[nip + '|' + prevP].val = x; GAJI_CACHE[nip + '|' + prevP].done = true; if (this.per === per && $('[data-cg-slip]')) $('[data-cg-slip]').innerHTML = this.slipHtml(g, x, prevP); }).catch(() => { });
  },
  slipHtml(g, prev, prevP) {
    const rek = String(g['No. Rekening Bank'] || ''), masked = rek.length > 4 ? '•••• ' + rek.slice(-4) : rek;
    const row = (k, sub) => `<div class="slip-row" ${sub ? 'style="padding-left:26px"' : ''}><span class="${sub ? 'muted' : ''}" style="${sub ? 'font-size:12.5px' : ''}">${sub ? '↳ ' : ''}${esc(k)}</span><span class="v ${sub ? 'muted' : ''}">${fmtRp(num(g[k]))}</span></div>`;
    const list = (keys, subOf) => { const vis = keys.filter((k) => num(g[k]) !== 0); const hid = keys.length - vis.length; return vis.map((k) => row(k) + (k === 'Tunjangan Keluarga' && subOf ? ['Perhitungan Suami/Istri', 'Perhitungan Anak'].filter((x) => num(g[x])).map((x) => row(x, true)).join('') : '')).join('') + (hid ? `<p class="faint" style="font-size:11.5px;padding:4px 10px">${hid} komponen bernilai Rp 0 tidak ditampilkan</p>` : ''); };
    const bersih = num(g['Jumlah Ditransfer']), delta = prev ? bersih - num(prev['Jumlah Ditransfer']) : null;
    const kv = (keys) => `<dl class="kv">${keys.map((k) => `<div class="${k === 'Alamat' || k === 'Nama Jabatan' ? 'full' : ''}"><dt>${esc(k)}</dt><dd>${g[k] !== '' && g[k] !== undefined ? (k === 'NIP' || k === 'NIP Pasangan' ? `<span class="mono">${fmtNip(g[k])}</span>` : k === 'Tanggal Lahir' ? fmtTgl(g[k]) : esc(g[k])) : '<span class="faint">—</span>'}</dd></div>`).join('')}</dl>`;
    return `<div class="print-area"><div class="grid">
      <div class="g-12"><div class="hero-slip"><div class="row between wrap top" style="gap:14px;position:relative;z-index:1"><div><span class="caps" style="color:var(--primary-text)">Gaji Bersih Diterima · ${periodeLabel(g.Periode)}</span><div class="hero-amt mt-4">${fmtRp(bersih)}</div>
        <div class="row wrap mt-8" style="gap:6px"><span class="chip">${ic('account_balance', 's14')}${esc(g['Nama Bank'] || 'Bank')} · <span class="mono" data-rek>${esc(this.eye ? rek : masked)}</span><button class="link-btn no-print" data-act="cgEye" aria-label="Tampilkan/sembunyikan nomor rekening" style="padding:0 0 0 4px">${ic(this.eye ? 'visibility_off' : 'visibility', 's14')}</button></span><span class="chip">${ic('military_tech', 's14')}${esc(g.Golongan || '-')}</span>${delta !== null && delta !== 0 ? `<span class="badge ${delta > 0 ? 'b-ok' : 'b-warn'}">${ic(delta > 0 ? 'trending_up' : 'trending_down')}${delta > 0 ? '+' : '−'}${fmtRp(Math.abs(delta)).replace('Rp ', 'Rp ')} vs ${BLS[+prevP.slice(5, 7) - 1]}</span>` : ''}</div></div>
        <div class="row no-print"><button class="btn btn-outline btn-sm" data-act="cgPrint">${ic('print', 's18')}Cetak</button><button class="btn btn-primary btn-sm" data-act="cgPdf">${ic('picture_as_pdf', 's18')}Unduh PDF</button></div></div></div></div>
      <div class="g-7"><div class="stack">
        <div class="card"><div class="card-h"><div class="card-t"><span class="card-ic ok">${ic('add_card', 's18')}</span>Penghasilan</div></div>${list(SLIP.hasil, true)}<div class="slip-total" style="background:var(--success-bg);color:var(--success)"><span>Jumlah Gaji & Tunjangan</span><span>${fmtRp(num(g['Jumlah Gaji dan Tunjangan']))}</span></div></div>
        <div class="card"><div class="card-h"><div class="card-t"><span class="card-ic bad">${ic('remove_circle', 's18')}</span>Iuran & Potongan</div></div><div class="flabel" style="padding:0 10px 4px">Iuran & Jaminan</div>${list(SLIP.iuran)}<div class="flabel" style="padding:10px 10px 4px">Potongan</div>${list(SLIP.potong)}<div class="slip-total" style="background:var(--danger-bg);color:var(--danger)"><span>Jumlah Potongan</span><span>${fmtRp(num(g['Jumlah Potongan']))}</span></div>
          <div class="slip-total" style="background:var(--primary);color:var(--on-primary)"><span>Jumlah Ditransfer</span><span>${fmtRp(bersih)}</span></div></div></div></div>
      <div class="g-5"><div class="stack"><div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('badge', 's18')}</span>Identitas</div></div>${kv(SLIP.identitas)}</div>
        <div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('family_restroom', 's18')}</span>Keluarga & Rekening</div></div>${kv(SLIP.keluarga.concat(['Kode Bank', 'Nama Bank']))}</div>
        <p class="faint" style="font-size:11.5px">${ic('info', 's14')} Diperbarui ${fmtWaktu(g.DiperbaruiPada)}. Bila ada ketidaksesuaian, hubungi Pusat Bantuan.</p></div></div></div></div>`;
  },
  async pdf() {
    const g = (GAJI_CACHE[this.nip + '|' + this.per] || {}).val; if (!g) return;
    try {
      await loadLib('jspdf');
      const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = 210;
      doc.setFillColor(26, 31, 77); doc.rect(0, 0, W, 24, 'F'); doc.setTextColor(255);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text('RINCIAN GAJI PEGAWAI', 14, 11);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text((S.cfg.instansi || BOOT.instansi || 'Dinas Kesehatan Kabupaten Minahasa Selatan') + ' · Periode ' + periodeLabel(g.Periode), 14, 18);
      doc.setTextColor(30);
      const rp = (k) => 'Rp ' + Math.round(num(g[k])).toLocaleString('id-ID');
      doc.autoTable({ startY: 30, theme: 'plain', styles: { fontSize: 9, cellPadding: 1.2 }, columnStyles: { 0: { cellWidth: 42, textColor: 110 } }, body: [['Nama', g.Nama], ['NIP', fmtNip(g.NIP)], ['Golongan / MKG', (g.Golongan || '-') + ' / ' + (g['Masa Kerja Golongan'] || '-')], ['Jabatan', g['Nama Jabatan'] || '-'], ['Bank / Rekening', (g['Nama Bank'] || '-') + ' / ' + (g['No. Rekening Bank'] || '-')]] });
      const sec = (judul, keys, total, col) => { const b = keys.filter((k) => num(g[k])).map((k) => [k, rp(k)]); b.push([{ content: total, styles: { fontStyle: 'bold' } }, { content: rp(total), styles: { fontStyle: 'bold' } }]); doc.autoTable({ startY: doc.lastAutoTable.finalY + 5, head: [[judul, 'Jumlah']], body: b, styles: { fontSize: 9 }, headStyles: { fillColor: col }, columnStyles: { 1: { halign: 'right', cellWidth: 50 } } }); };
      sec('Penghasilan', SLIP.hasil.concat(['Perhitungan Suami/Istri', 'Perhitungan Anak']), 'Jumlah Gaji dan Tunjangan', [28, 132, 65]);
      sec('Iuran & Potongan', SLIP.iuran.concat(SLIP.potong), 'Jumlah Potongan', [211, 47, 47]);
      const y = doc.lastAutoTable.finalY + 6; doc.setFillColor(224, 232, 255); doc.roundedRect(14, y, W - 28, 12, 2, 2, 'F'); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(31, 95, 224); doc.text('JUMLAH DITRANSFER', 18, y + 7.8); doc.text(rp('Jumlah Ditransfer'), W - 18, y + 7.8, { align: 'right' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(140); doc.text('Dokumen ini dicetak dari aplikasi ' + (S.cfg.appName || BRAND.nama) + ' pada ' + fmtWaktu(nowIsoLocal()) + '. Bukan pengganti slip resmi bendahara.', 14, 290);
      doc.save(`Rincian_Gaji_${g.NIP}_${g.Periode}.pdf`);
    } catch (e) { errToast(e, 'PDF gagal dibuat'); }
  }
};
ACT.cgPer = (el) => { const pg = PAGES.cekgaji; pg.per = el.dataset.p; $$('[data-act="cgPer"]').forEach((b) => { const on = b.dataset.p === pg.per; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); }); pg.slip(); };
ACT.cgEye = () => { const pg = PAGES.cekgaji; pg.eye = !pg.eye; pg.slip(); };
ACT.cgPrint = () => window.print();
ACT.cgPdf = () => PAGES.cekgaji.pdf();
function cgPilih(v) {
  v = String(v || '').trim(); if (!v) return;
  let nip = digits(v);
  if (nip.length !== 18) { const q = v.toLowerCase(), hit = S.idx.rows.filter((r) => String(r.Nama).toLowerCase().indexOf(q) >= 0); if (hit.length === 1) nip = hit[0].NIP; else return toast('info', hit.length ? 'Lebih dari satu pegawai cocok' : 'Pegawai tidak ditemukan', hit.length ? 'Pilih dari daftar saran atau ketik NIP lengkap.' : 'Periksa kembali nama/NIP.'); }
  const pg = PAGES.cekgaji; pg.nip = nip; pg.per = null; pg.periode = [];
  const p = pegByNip(nip); const inp = $('#cg-q'); if (inp && p) inp.value = p.Nama;
  pg.body();
}
SUBMIT.cgCari = (f) => cgPilih(f.q.value);
CHG.cgPick = (el) => { if (/^\d{18}$/.test(el.value.trim())) cgPilih(el.value); };

const TAMBAH_SPEC = [
  { k: 'NIP', l: 'NIP', t: 'text', req: 1, re: /^\d{18}$/, msg: 'NIP harus 18 digit angka.', im: 'numeric', max: 18, ph: '18 digit' },
  { k: 'Nama', l: 'Nama Lengkap (dengan gelar)', t: 'text', req: 1, max: 120 },
  { k: 'StatusPegawai', l: 'Status Pegawai', t: 'select', req: 1, opts: ['PNS', 'PPPK'] },
  { k: 'UnitKerja', l: 'Unit Kerja', t: 'unit', req: 1 },
  { k: 'NIK', l: 'NIK (opsional)', t: 'text', re: /^\d{16}$/, msg: 'NIK harus 16 digit angka.', im: 'numeric', max: 16 },
  { k: 'JenisKelamin', l: 'Jenis Kelamin', t: 'select', opts: ['Laki-laki', 'Perempuan'] },
  { k: 'Email', l: 'Email (opsional)', t: 'email', re: RE_EMAIL, msg: 'Format email tidak valid.', span: 2 }
];
const ADMIN_SPEC = [
  { k: 'Username', l: 'Username', t: 'text', req: 1, re: /^[a-z][a-z0-9_.]{3,30}$/, msg: '4–31 karakter huruf kecil/angka/_/. diawali huruf.', ph: 'mis. admin_amurang' },
  { k: 'Nama', l: 'Nama Operator', t: 'text', req: 1, max: 120 },
  { k: 'UnitKerja', l: 'Unit Kerja', t: 'unit', req: 1, span: 2 },
  { k: 'Email', l: 'Email', t: 'email', re: RE_EMAIL, msg: 'Format email tidak valid.' },
  { k: 'NIP', l: 'NIP (opsional)', t: 'text', re: /^\d{18}$/, msg: 'NIP harus 18 digit.', im: 'numeric', max: 18 }
];
PAGES.kelola = {
  tab: 'akun', f: { q: '' }, page: 1, akun: null, imp: null,
  show(p) {
    p = p || {};
    this.tab = p.tab || 'akun';
    const T = { akun: ['Daftar Akun Pegawai', 'Akun login pegawai (username = NIP). Reset password atau hapus pegawai secara permanen.'], tambah: ['Tambah Pegawai', 'Daftarkan pegawai baru beserta akun loginnya (password awal = NIP).'], import: ['Import Data Pegawai', 'Unggah banyak pegawai sekaligus dari Excel — divalidasi dulu (dry-run) sebelum disimpan.'], admin: ['Akun Admin Unit', 'Kelola operator Admin Unit untuk 19 unit kerja.'] }[this.tab];
    $('#pg-kelola').innerHTML = pageHead(['Administrasi', 'Kelola Pegawai', T[0]], T[0], T[1]) + `<div class="tabs mb-16">${ROUTES.kelola.sub.map((s) => `<button class="tab ${s[0] === this.tab ? 'on' : ''}" data-act="nav" data-r="kelola" data-tab="${s[0]}">${ic({ akun: 'manage_accounts', tambah: 'person_add', import: 'upload_file', admin: 'admin_panel_settings' }[s[0]], 's16')}${s[1]}</button>`).join('')}</div><div data-kl-body></div>`;
    this.done = true;
    ({ akun: () => this.akunShell(), tambah: () => this.tambah(), import: () => this.importUi(), admin: () => this.admin() })[this.tab]();
  },

  akunShell() {
    $('[data-kl-body]').innerHTML = `<div class="card"><div class="row between wrap mb-12" style="gap:10px"><div class="input-ic grow" style="max-width:420px">${ic('search')}<input class="input" placeholder="Cari NIP atau nama" value="${esc(this.f.q)}" data-input="klQ" aria-label="Cari akun"></div><div class="row"><span class="chip">${ic('key', 's14')}Password awal = NIP</span></div></div><div data-kl-akun></div></div>`;
    this.renderAkun();
  },
  async renderAkun() {
    const box = $('[data-kl-akun]'); if (!box) return;
    const size = 20; let res;
    try { res = await queryPegawai(this.f.q ? { q: this.f.q } : {}, this.page, size); } catch (e) { box.innerHTML = emptyBox('Gagal memuat', e.message, 'error'); return; }
    if (!res.rows.length) { box.innerHTML = emptyBox('Tidak ada akun', 'Tidak ada pegawai yang cocok.', 'person_off'); return; }
    box.innerHTML = `<div class="tbl-wrap responsive"><table class="tbl"><thead><tr><th>Pegawai</th><th>Username</th><th>Unit Kerja</th><th>Status</th><th class="c-act">Aksi</th></tr></thead><tbody>${res.rows.map((r) => `<tr><td><div class="person">${avatar(r.Nama)}<div><b>${esc(r.Nama)}</b><small>${esc(r.StatusPegawai || '')} · ${esc(r.Golongan || '-')}</small></div></div></td><td class="mono">${esc(r.NIP)}</td><td style="max-width:200px">${esc(r.UnitKerja || '-')}</td><td>${bStatus(r.StatusKeaktifan || 'Aktif')}</td><td class="c-act"><div class="row" style="justify-content:flex-end"><button class="btn btn-xs btn-ghost" data-act="pgDetail" data-nip="${esc(r.NIP)}" data-prefetch="${esc(r.NIP)}" title="Lihat detail" aria-label="Lihat detail">${ic('visibility', 's16')}</button><button class="btn btn-xs btn-outline" data-act="pgReset" data-nip="${esc(r.NIP)}">${ic('lock_reset', 's16')}Reset</button><button class="btn btn-xs btn-danger-o" data-act="pgHapus" data-nip="${esc(r.NIP)}" aria-label="Hapus ${esc(r.Nama)}">${ic('delete', 's16')}</button></div></td></tr>`).join('')}</tbody></table></div>
      <div class="cards-list">${res.rows.map((r) => `<div class="li-card"><div class="row">${avatar(r.Nama)}<div class="grow" style="min-width:0"><b class="truncate" style="display:block">${esc(r.Nama)}</b><small class="muted mono">${esc(r.NIP)}</small></div></div><div class="row"><button class="btn btn-sm btn-outline grow" data-act="pgReset" data-nip="${esc(r.NIP)}">${ic('lock_reset', 's16')}Reset Password</button><button class="btn btn-sm btn-danger-o" data-act="pgHapus" data-nip="${esc(r.NIP)}" aria-label="Hapus">${ic('delete', 's16')}</button></div></div>`).join('')}</div>${pager(res.total, this.page, size, 'klPage')}`;
  },

  tambah() {
    $('[data-kl-body]').innerHTML = `<div class="grid"><div class="g-8"><form class="card" data-submit="klTambah" novalidate><div class="card-h"><div class="card-t"><span class="card-ic">${ic('person_add', 's18')}</span>Data Pegawai Baru</div></div>${formHtml(TAMBAH_SPEC, {}, 'kt-')}
      <div class="row between wrap mt-20" style="border-top:1px solid var(--border);padding-top:16px;gap:10px"><span class="faint" style="font-size:12px">${ic('info', 's14')} Data riwayat (pangkat, jabatan, KGB, keluarga) dilengkapi lewat Daftar Pegawai → Lihat Detail.</span><button class="btn btn-primary">${ic('save', 's18')}Simpan Pegawai</button></div></form></div>
      <div class="g-4"><div class="card flat"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('tips_and_updates', 's18')}</span>Setelah disimpan</div></div><ul class="stack-8" style="margin:0;padding-left:18px;font-size:12.5px;color:var(--text-2)"><li>Akun login otomatis dibuat: <b>username & password awal = NIP</b>.</li><li>Pegawai diminta mengganti password saat login pertama.</li><li>Status kelengkapan "Belum Lengkap" sampai 6 kategori wajib terisi.</li><li>Untuk banyak pegawai sekaligus gunakan <button class="link-btn" data-act="nav" data-r="kelola" data-tab="import" style="font-size:12.5px">Import Excel</button>.</li></ul></div></div></div>`;
  },

  async admin(force) {
    const body = $('[data-kl-body]');
    if (!this.akun || force) {
      body.innerHTML = `<div class="card">${skelRows(5)}</div>`;
      try { this.akun = await API.call('kelola.akun', {}, { retry: 1 }); } catch (e) { body.innerHTML = `<div class="card">${emptyBox('Gagal memuat akun', e.message, 'error')}</div>`; return; }
      if (S.route !== 'kelola' || this.tab !== 'admin') return;
    }
    const adm = this.akun.filter((a) => a.Peran === 'ADMIN_UNIT'), sa = this.akun.filter((a) => a.Peran === 'SUPERADMIN');
    const tanpa = S.master.unit.filter((u) => !adm.some((a) => a.UnitKerja === u && a.Status === 'Aktif'));
    body.innerHTML = `<div class="card"><div class="card-h"><div><div class="card-t">Admin Unit <span class="chip">${adm.length}</span></div><div class="card-s">${tanpa.length ? `<span style="color:var(--warning);font-weight:600">${tanpa.length} unit belum memiliki Admin Unit aktif</span>` : 'Setiap unit kerja sudah memiliki Admin Unit'}</div></div><button class="btn btn-primary btn-sm" data-act="klAdmin">${ic('add', 's18')}Tambah Admin Unit</button></div>
      ${adm.length ? `<div class="tbl-wrap responsive"><table class="tbl"><thead><tr><th>Operator</th><th>Username</th><th>Unit Kerja</th><th>Status</th><th>Login Terakhir</th><th class="c-act">Aksi</th></tr></thead><tbody>${adm.map((a) => `<tr><td><div class="person">${avatar(a.Nama)}<div><b>${esc(a.Nama)}</b><small>${esc(a.Email || 'tanpa email')}</small></div></div></td><td class="mono">${esc(a.Username)}</td><td>${esc(a.UnitKerja)}</td><td>${a.Status === 'Aktif' ? bStatus('Aktif') : '<span class="badge b-mut">' + ic('block') + 'Nonaktif</span>'}</td><td class="nowrap">${a.LoginTerakhir ? relWaktu(a.LoginTerakhir) : '<span class="faint">belum pernah</span>'}</td><td class="c-act"><div class="row" style="justify-content:flex-end"><button class="btn btn-xs btn-outline" data-act="klAdmin" data-u="${esc(a.Username)}">${ic('edit', 's16')}Edit</button><button class="btn btn-xs btn-ghost" data-act="klAdminReset" data-u="${esc(a.Username)}" title="Reset password" aria-label="Reset password">${ic('lock_reset', 's16')}</button><button class="btn btn-xs btn-danger-o" data-act="klAdminHapus" data-u="${esc(a.Username)}" aria-label="Hapus">${ic('delete', 's16')}</button></div></td></tr>`).join('')}</tbody></table></div>
      <div class="cards-list">${adm.map((a) => `<div class="li-card"><div class="row">${avatar(a.Nama)}<div class="grow" style="min-width:0"><b class="truncate" style="display:block">${esc(a.Nama)}</b><small class="muted">${esc(a.Username)} · ${esc(a.UnitKerja)}</small></div></div><div class="row"><button class="btn btn-sm btn-outline grow" data-act="klAdmin" data-u="${esc(a.Username)}">Edit</button><button class="btn btn-sm btn-outline" data-act="klAdminReset" data-u="${esc(a.Username)}" aria-label="Reset password">${ic('lock_reset', 's16')}</button><button class="btn btn-sm btn-danger-o" data-act="klAdminHapus" data-u="${esc(a.Username)}" aria-label="Hapus">${ic('delete', 's16')}</button></div></div>`).join('')}</div>` : emptyBox('Belum ada Admin Unit', 'Tambahkan operator untuk setiap unit kerja.', 'admin_panel_settings')}</div>
      ${tanpa.length ? `<div class="card flat mt-16"><div class="card-h"><div class="card-t">Unit tanpa Admin Unit aktif</div></div><div class="row wrap" style="gap:6px">${tanpa.map((u) => `<span class="chip">${ic('domain', 's14')}${esc(u)}</span>`).join('')}</div></div>` : ''}
      <div class="card flat mt-16"><div class="card-h"><div class="card-t">Akun Superadmin</div></div><div class="stack-8">${sa.map((a) => `<div class="mini"><span class="ic">${ic('shield_person', 's18')}</span><div class="grow"><b>${esc(a.Nama)}</b><small>${esc(a.Username)} · login terakhir ${a.LoginTerakhir ? relWaktu(a.LoginTerakhir) : '-'}</small></div></div>`).join('')}</div></div>`;
  },

  importUi() {
    const st = this.imp;
    $('[data-kl-body]').innerHTML = `<div class="grid"><div class="g-12"><div class="card"><div class="row wrap" style="gap:14px;align-items:stretch">
      ${[['1', 'Unduh template', 'Template Excel berisi kolom Data Diri, Keluarga (pasangan & 5 anak), Pangkat, Jabatan, KGB, dan Unit.', `<button class="btn btn-outline btn-sm" data-act="klTpl">${ic('download', 's18')}Template Excel</button>`], ['2', 'Isi & unggah', 'Kolom NIP sudah berformat teks. Tanggal boleh format tanggal Excel atau YYYY-MM-DD.', `<label class="btn btn-primary btn-sm" style="cursor:pointer">${ic('upload_file', 's18')}Pilih Berkas<input type="file" accept=".xlsx,.xls,.csv" data-change="klFile" hidden></label>`], ['3', 'Periksa & simpan', 'Sistem memvalidasi setiap baris (dry-run). Data baru tersimpan setelah Anda konfirmasi.', '']].map((x) => `<div class="feat grow" style="flex:1 1 240px"><span class="card-ic" style="font-weight:800">${x[0]}</span><div class="grow"><b>${x[1]}</b><p>${x[2]}</p>${x[3] ? `<div class="mt-8">${x[3]}</div>` : ''}</div></div>`).join('')}
      </div></div></div><div class="g-12" data-imp-res>${st && st.res ? '' : `<div class="card">${emptyBox('Belum ada berkas', 'Unggah berkas Excel hasil isian template untuk melihat pratinjau validasi.', 'table_view')}</div>`}</div></div>`;
    if (st && st.res) this.impRender();
  },
  impRender() {
    const st = this.imp, box = $('[data-imp-res]'); if (!box || !st) return;
    if (st.loading) { box.innerHTML = `<div class="card"><div class="row mb-12"><span class="spin"></span><b>Memvalidasi ${fmtNum(st.rows.length)} baris dari ${esc(st.file)}…</b></div>${skelRows(4)}</div>`; return; }
    const r = st.res, f = st.filter || '', flags = st.flags || {};
    const hasil = r.hasil.map((h) => (flags[h.baris] ? Object.assign({}, h, { status: 'GAGAL', alasan: `Kolom ${flags[h.baris].join(', ')} tersimpan sebagai angka di Excel (digit terakhir hilang). Format kolom sebagai Teks lalu ketik ulang.` + (h.alasan && h.status === 'GAGAL' ? '; ' + h.alasan : '') }) : h));
    const view = hasil.filter((h) => !f || h.status === f);
    const timpa = st.timpa || (st.timpa = new Set());
    const nSimpan = hasil.filter((h) => h.status === 'OK').length + hasil.filter((h) => h.status === 'DUPLIKAT' && timpa.has(h.nip)).length;
    const nTanpaSK = hasil.filter((h) => h.status !== 'GAGAL' && h.catatan).length;
    const ring = Object.assign({}, r.ringkas, { gagal: hasil.filter((h) => h.status === 'GAGAL').length, ok: hasil.filter((h) => h.status === 'OK').length });
    box.innerHTML = `<div class="card"><div class="card-h"><div><div class="card-t"><span class="card-ic">${ic('fact_check', 's18')}</span>Hasil Validasi (Dry-run)</div><div class="card-s">${esc(st.file)} · sheet "${esc(st.sheet)}"${st.saved ? ' · <b style="color:var(--success)">sudah disimpan</b>' : ''}</div></div><button class="btn btn-sm btn-ghost" data-act="klImpClear">${ic('close', 's18')}Tutup</button></div>
      ${ringkasImport(ring, 'pegawai')}
      ${ring.anak21 ? `<div class="banner warn mt-12">${ic('child_care')}<div><b>${ring.anak21} anak berusia ≥ 21 tahun terdeteksi</b><p>Status tunjangannya perlu ditinjau — pegawai wajib melampirkan Surat Keterangan Aktif Kuliah.</p></div></div>` : ''}
      ${nTanpaSK ? `<div class="banner info mt-12">${ic('info')}<div><b>${fmtNum(nTanpaSK)} pegawai tanpa Nomor SK</b><p>Golongan/Jabatan/Masa Kerja disimpan sebagai data terkini. Kategori terkait tetap “Belum Lengkap” sampai pegawai atau Admin Unit melengkapinya lewat Ajukan Perubahan (dengan Nomor SK &amp; dokumen).</p></div></div>` : ''}
      ${st.saved ? `<div class="banner ok mt-12">${ic('task_alt')}<div><b>Import selesai</b><p>${esc(st.saved.Catatan || '')}</p></div></div>` : ''}
      <div class="row between wrap mt-16" style="gap:10px"><div class="tabs">${[['', 'Semua', hasil.length], ['OK', 'Valid', ring.ok], ['DUPLIKAT', 'NIP sudah ada', ring.duplikat], ['GAGAL', 'Gagal', ring.gagal]].map((t) => `<button class="tab ${f === t[0] ? 'on' : ''}" data-act="klImpF" data-v="${t[0]}">${t[1]}<span class="cnt">${t[2]}</span></button>`).join('')}</div>
        <div class="row wrap">${ring.duplikat ? `<button class="btn btn-sm btn-outline" data-act="klTimpaAll">${ic('sync', 's18')}${hasil.filter((h) => h.status === 'DUPLIKAT').every((h) => timpa.has(h.nip)) ? 'Batal timpa semua' : 'Timpa semua duplikat'}</button>` : ''}${ring.gagal ? `<button class="btn btn-sm btn-outline" data-act="klImpErr">${ic('download', 's18')}Unduh daftar gagal</button>` : ''}</div></div>
      <div class="tbl-wrap mt-12" style="max-height:420px;overflow:auto"><table class="tbl compact"><thead><tr><th>Baris</th><th>NIP</th><th>Nama</th><th>Status</th><th>Keterangan</th><th>Timpa?</th></tr></thead><tbody>${view.slice(0, 500).map((h) => `<tr><td class="c-no">${h.baris}</td><td class="mono nowrap">${esc(h.nip || '—')}</td><td>${esc(h.nama || '—')}</td><td>${h.status === 'OK' ? '<span class="badge b-ok">' + ic('check') + 'Valid</span>' : h.status === 'DUPLIKAT' ? '<span class="badge b-warn">' + ic('content_copy') + 'Sudah ada</span>' : '<span class="badge b-bad">' + ic('error') + 'Gagal</span>'}</td><td style="font-size:12px;max-width:420px">${esc(h.alasan || [h.status === 'DUPLIKAT' ? 'Dilewati kecuali dipilih "Timpa" (data kosong tidak menimpa data lama).' : '', h.catatan].filter(Boolean).join(' ')) || '<span class="faint">—</span>'}${h.anak21 ? ` <span class="badge b-warn">${h.anak21} anak ≥ 21</span>` : ''}</td><td>${h.status === 'DUPLIKAT' ? `<label class="check" style="min-height:0"><input type="checkbox" data-change="klTimpa" data-nip="${esc(h.nip)}" ${timpa.has(h.nip) ? 'checked' : ''}> Timpa</label>` : ''}</td></tr>`).join('')}</tbody></table>${view.length > 500 ? `<p class="faint t-center mt-8">Menampilkan 500 dari ${view.length} baris.</p>` : ''}</div>
      <div class="row between wrap mt-16" style="border-top:1px solid var(--border);padding-top:16px;gap:10px"><span class="muted" style="font-size:12.5px">${ic('info', 's16')} Baris gagal tidak akan disimpan. Perbaiki di Excel lalu unggah ulang.</span><button class="btn btn-primary" data-act="klImpSave" ${!nSimpan || st.saved ? 'disabled' : ''}>${ic('cloud_upload', 's18')}Simpan ${fmtNum(nSimpan)} Pegawai</button></div></div>`;
  },
  async impFile(file) {
    let parsed;
    try { parsed = await bacaExcel(file, { wajib: ['NIP', 'Nama', 'Status Pegawai', 'Unit Kerja'], teks: ['NIP', 'NIK', 'Pasangan NIP', 'No Telepon'] }); } catch (e) { return errToast(e, 'Berkas tidak dapat dibaca'); }
    if (!parsed.rows.length) return toast('warn', 'Berkas kosong', 'Tidak ada baris data di bawah header.');
    if (parsed.rows.length > 5000) return toast('warn', 'Terlalu banyak baris', 'Maksimal 5.000 baris per import. Pecah berkas menjadi beberapa bagian.');
    const rows = parsed.rows.map((r) => { const o = Object.assign({}, r); return o; });
    this.imp = { file: file.name, sheet: parsed.sheet, rows, flags: parsed.flags, loading: true, timpa: new Set() };
    this.impRender();
    try { this.imp.res = await API.call('pegawai.import', { rows, dryRun: true }); }
    catch (e) { this.imp = null; if (S.route === 'kelola') this.importUi(); return errToast(e, 'Validasi gagal'); }
    this.imp.loading = false;
    if (S.route === 'kelola' && this.tab === 'import') this.impRender();
  },
  async impSave() {
    const st = this.imp; if (!st || !st.res) return;
    const flagged = new Set(Object.keys(st.flags || {}).map(Number));
    const rows = st.rows.map((r, i) => (flagged.has(i + 2) ? Object.assign({}, r, { NIP: '' }) : r));
    const timpa = Array.from(st.timpa || []);
    const ok = await Modal.confirm({ title: 'Simpan hasil import?', icon: 'cloud_upload', msg: `Data pegawai valid akan disimpan${timpa.length ? `, dan <b>${timpa.length}</b> pegawai yang sudah ada akan diperbarui` : ''}. Akun login baru dibuat otomatis (password awal = NIP).`, ok: 'Simpan Sekarang' });
    if (!ok) return;
    const btn = $('[data-act="klImpSave"]'); if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Menyimpan…'; }
    Sync.run('Menyimpan import…', API.call('pegawai.import', { rows, dryRun: false, timpa })).then((r) => {
      st.res = r; st.saved = r.log; if (S.route === 'kelola' && this.tab === 'import') this.impRender();
      toast('ok', 'Import berhasil', r.log.Catatan);
      refreshBoot(true); invalidateDash();
    }).catch((e) => { if (btn) { btn.disabled = false; btn.innerHTML = ic('cloud_upload', 's18') + 'Coba Simpan Lagi'; } errToast(e, 'Import gagal'); });
  }
};
ACT.klPage = (el) => { PAGES.kelola.page = +el.dataset.p; PAGES.kelola.renderAkun(); };
INP.klQ = debounce((el) => { const pg = PAGES.kelola; pg.f.q = el.value; pg.page = 1; pg.renderAkun(); }, 150);
SUBMIT.klTambah = (f) => {
  const { vals, errs } = readForm(f, TAMBAH_SPEC);
  if (vals.NIP && pegByNip(vals.NIP)) errs.NIP = 'NIP ini sudah terdaftar.';
  if (showErrs(f, errs)) return;
  const btn = f.querySelector('.btn-primary'); btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Menyimpan…';
  API.call('kelola.tambah', vals).then((r) => {
    upsertIdx(r.pegawai); invalidateDash(); PAGES.pegawai.done = false;
    f.reset(); $$('.field.err', f).forEach((x) => x.classList.remove('err'));
    Modal.confirm({ title: 'Pegawai ditambahkan', icon: 'task_alt', msg: `<b>${esc(r.pegawai.Nama)}</b> berhasil didaftarkan.<div class="sk-box mt-12"><div><div class="caps" style="font-size:10px">Username / Password awal</div><span class="mono">${esc(r.pegawai.NIP)}</span></div>${ic('key', 'muted')}</div><p class="muted mt-8" style="font-size:12.5px">Lengkapi data riwayat agar status kelengkapan menjadi Lengkap.</p>`, ok: 'Lengkapi Data Sekarang', cancel: 'Tambah Lagi' }).then((go2) => { if (go2) { go('pegawai'); setTimeout(() => bukaDetailPegawai(r.pegawai.NIP), 50); } });
  }).catch((e) => errToast(e, 'Gagal menambah pegawai')).finally(() => { btn.disabled = false; btn.innerHTML = ic('save', 's18') + 'Simpan Pegawai'; });
};
ACT.klAdmin = (el) => {
  const pg = PAGES.kelola, u = el.dataset.u, a = u ? pg.akun.find((x) => x.Username === u) : null;
  const spec = a ? ADMIN_SPEC.concat([{ k: 'Status', l: 'Status Akun', t: 'select', req: 1, opts: ['Aktif', 'Nonaktif'] }]) : ADMIN_SPEC;
  const m = Modal.open({ title: `${ic(a ? 'edit' : 'person_add')} ${a ? 'Edit' : 'Tambah'} Admin Unit`, size: 'lg', body: `<form data-x-form>${formHtml(spec, a || {}, 'ka-')}</form>${a ? '' : `<p class="faint mt-12" style="font-size:12px">${ic('key', 's14')} Password awal dibuat acak oleh sistem & ditampilkan sekali setelah disimpan.</p>`}`, foot: `<button class="btn btn-outline" data-no>Batal</button><button class="btn btn-primary" data-ok>${ic('save', 's18')}Simpan</button>` });
  if (a) { const iu = m.el.querySelector('[name=Username]'); iu.readOnly = true; }
  m.el.querySelector('[data-no]').onclick = m.close;
  m.el.querySelector('[data-ok]').onclick = () => {
    const { vals, errs } = readForm(m.el, spec); if (showErrs(m.el, errs)) return;
    const b = m.el.querySelector('[data-ok]'); b.disabled = true; b.innerHTML = '<span class="spin"></span>Menyimpan…';
    API.call('kelola.admin.simpan', Object.assign(vals, { edit: !!a })).then((r) => {
      pg.akun = r.akun; m.close(); if (S.route === 'kelola') pg.admin();
      if (r.passwordAwal) Modal.confirm({ title: 'Admin Unit dibuat', icon: 'task_alt', msg: `Sampaikan kredensial berikut kepada operator (hanya ditampilkan sekali):<div class="sk-box mt-12"><div><div class="caps" style="font-size:10px">Username</div><span class="mono">${esc(vals.Username)}</span></div></div><div class="sk-box mt-8"><div><div class="caps" style="font-size:10px">Password awal</div><span class="mono" style="font-size:15px">${esc(r.passwordAwal)}</span></div><button class="btn btn-xs btn-soft" data-act="copy" data-v="${esc(r.passwordAwal)}">Salin</button></div>`, ok: 'Selesai', cancel: 'Tutup' });
      else toast('ok', 'Admin Unit diperbarui');
    }).catch((e) => { b.disabled = false; b.innerHTML = ic('save', 's18') + 'Simpan'; errToast(e, 'Gagal menyimpan'); });
  };
};
ACT.klAdminReset = async (el) => {
  const u = el.dataset.u;
  const ok = await Modal.confirm({ title: 'Reset password Admin Unit?', icon: 'lock_reset', msg: `Password <b>${esc(u)}</b> akan diganti dengan password acak baru dan semua sesi aktifnya berakhir.`, ok: 'Reset' });
  if (!ok) return;
  Sync.run('Mereset…', API.call('kelola.reset', { username: u })).then((r) => Modal.confirm({ title: 'Password baru', icon: 'key', msg: `<div class="sk-box"><div><div class="caps" style="font-size:10px">${esc(u)}</div><span class="mono" style="font-size:15px">${esc(r.passwordBaru)}</span></div></div><p class="muted mt-8" style="font-size:12.5px">Ditampilkan sekali. Operator wajib menggantinya saat login.</p>`, ok: 'Selesai', cancel: 'Tutup' })).catch((e) => errToast(e));
};
ACT.klAdminHapus = async (el) => {
  const pg = PAGES.kelola, u = el.dataset.u;
  const ok = await Modal.confirm({ title: 'Hapus akun Admin Unit?', danger: true, msg: `Akun <b>${esc(u)}</b> akan dihapus. Data pegawai & pengajuan tidak terpengaruh.`, ok: 'Hapus' });
  if (!ok) return;
  const bak = pg.akun; pg.akun = pg.akun.filter((x) => x.Username !== u); pg.admin();
  Sync.run('Menghapus…', API.call('kelola.admin.hapus', { username: u })).then((list) => { pg.akun = list; toast('ok', 'Akun dihapus'); }).catch((e) => { pg.akun = bak; if (S.route === 'kelola') pg.admin(); errToast(e); });
};
ACT.klTpl = async () => {
  try {
    await loadLib('xlsx');
    const H = S.master.kolomImportPegawai || [];
    const contoh = { 'NIP': '199001012015031001', 'Nama': 'Contoh Pegawai, S.Kep., Ns.', 'Status Pegawai': 'PNS', 'NIK': '7105010101900001', 'Jenis Kelamin': 'L', 'Alamat': 'Jl. Contoh No. 1, Amurang', 'No Telepon': '081234567890', 'Email': 'contoh@email.com', 'Unit Kerja': S.master.unit[1] || S.master.unit[0], 'Status Keaktifan': 'Aktif', 'Tidak Ada Tanggungan': 'TIDAK', 'Pasangan Nama': 'Nama Pasangan', 'Pasangan Tanggal Lahir': '1991-05-20', 'Pasangan Pekerjaan': 'Wiraswasta', 'Pasangan Status ASN': 'Tidak', 'Anak1 Nama': 'Nama Anak Pertama', 'Anak1 Tanggal Lahir': '2016-08-17', 'Anak1 Pekerjaan': 'Pelajar', 'Anak1 Hubungan': 'Kandung', 'Golongan': 'III/a', 'Pangkat Masa Kerja': '10 Thn 0 Bln', 'Pangkat Tgl Ditetapkan': '2025-03-10', 'Pangkat Tgl Berlaku': '2025-04-01', 'Pangkat Gaji Pokok': 3373600, 'Pangkat Nomor SK': '821/BKPSDM/SK/III/2025', 'Jabatan': 'Perawat Ahli Pertama', 'Jabatan Tgl Ditetapkan': '2024-01-05', 'Jabatan Tgl Berlaku': '2024-01-05', 'Jabatan Nomor SK': '800/BKPSDM/I/2024', 'KGB Masa Kerja': '10 Thn 0 Bln', 'KGB Tgl Ditetapkan': '2025-03-10', 'KGB Tgl Berlaku': '2025-04-01', 'KGB Gaji Pokok': 3373600, 'KGB Nomor SK': '822/KGB/2025', 'Unit Tgl Ditetapkan': '2015-03-01', 'Unit Tgl Berlaku': '2015-03-01', 'Unit Nomor SK': '820/MUTASI/2015' };
    const pet = [['PETUNJUK PENGISIAN IMPORT DATA PEGAWAI — ' + (S.cfg.appName || BRAND.nama)], [], ['Kolom wajib', 'NIP (18 digit, format Teks), Nama, Status Pegawai (PNS/PPPK), Unit Kerja (sesuai daftar di bawah)'], ['Jenis Kelamin', 'L / P'], ['Tanggal', 'Format tanggal Excel atau YYYY-MM-DD'], ['Pasangan Status ASN', 'Ya / Tidak — jika Ya, Pasangan NIP wajib 18 digit'], ['Anak1..Anak5 Hubungan', 'Kandung / Tiri / Angkat'], ['Tidak Ada Tanggungan', 'YA jika tidak memiliki tanggungan keluarga'], ['Riwayat & Nomor SK', 'Nomor SK boleh kosong. Bila kosong, Golongan/Jabatan/Masa Kerja disimpan sebagai data terkini dan kategori terkait tetap "Belum Lengkap" sampai dilengkapi pegawai/Admin Unit lewat Ajukan Perubahan (dengan Nomor SK & dokumen).'], ['Duplikat', 'NIP yang sudah terdaftar dilewati, kecuali dipilih "Timpa" saat pratinjau'], ['Hapus baris contoh', 'Hapus baris ke-2 (contoh) sebelum mengunggah'], [], ['DAFTAR UNIT KERJA']].concat(S.master.unit.map((u) => ['', u])).concat([[], ['DAFTAR GOLONGAN']]).concat(S.master.pangkat.map((p) => ['', p.g + ' — ' + p.p + (p.j === 'PPPK' ? ' (PPPK)' : '')]));
    await unduhXlsx([{ name: 'Data Pegawai', ws: wsTemplate(H, contoh, ['NIP', 'NIK', 'Pasangan NIP', 'No Telepon'], 300) }, { name: 'Petunjuk', ws: wsAoa(pet, [28, 90]) }], 'Template_Import_Pegawai_CEKUP-GAJI.xlsx');
  } catch (e) { errToast(e, 'Template gagal dibuat'); }
};
CHG.klFile = (el) => { const f = el.files && el.files[0]; el.value = ''; if (f) PAGES.kelola.impFile(f); };
ACT.klImpF = (el) => { PAGES.kelola.imp.filter = el.dataset.v; PAGES.kelola.impRender(); };
CHG.klTimpa = (el) => { const t = PAGES.kelola.imp.timpa; if (el.checked) t.add(el.dataset.nip); else t.delete(el.dataset.nip); PAGES.kelola.impRender(); };
ACT.klTimpaAll = () => { const st = PAGES.kelola.imp, d = st.res.hasil.filter((h) => h.status === 'DUPLIKAT'); const all = d.every((h) => st.timpa.has(h.nip)); d.forEach((h) => (all ? st.timpa.delete(h.nip) : st.timpa.add(h.nip))); PAGES.kelola.impRender(); };
ACT.klImpClear = () => { PAGES.kelola.imp = null; PAGES.kelola.importUi(); };
ACT.klImpSave = () => PAGES.kelola.impSave();
ACT.klImpErr = async () => {
  const st = PAGES.kelola.imp, flags = st.flags || {};
  const bad = st.res.hasil.filter((h) => h.status === 'GAGAL' || flags[h.baris]);
  try { await unduhXlsx([{ name: 'Baris Gagal', ws: wsAoa([['Baris', 'NIP', 'Nama', 'Keterangan']].concat(bad.map((h) => [h.baris, h.nip, h.nama, flags[h.baris] ? 'Kolom ' + flags[h.baris].join(', ') + ' tersimpan sebagai angka (format Teks). ' + (h.alasan || '') : h.alasan])), [8, 22, 34, 90]) }], 'Import_Pegawai_Gagal.xlsx'); } catch (e) { errToast(e); }
};

const GAJI_GRUP = [
  ['Identitas Pegawai', 'badge', ['NIP', 'Nama', 'NIK', 'NPWP', 'Tanggal Lahir', 'Status ASN', 'Golongan', 'Masa Kerja Golongan', 'Tipe Jabatan', 'Nama Jabatan', 'Eselon', 'Alamat']],
  ['Keluarga', 'family_restroom', ['Status Pernikahan', 'Jumlah Istri/Suami', 'Jumlah Anak', 'Jumlah Tanggungan', 'Pasangan PNS', 'NIP Pasangan']],
  ['Rekening Bank', 'account_balance', ['Kode Bank', 'Nama Bank', 'No. Rekening Bank']],
  ['Penghasilan', 'add_card', ['Gaji Pokok', 'Perhitungan Suami/Istri', 'Perhitungan Anak', 'Tunjangan Keluarga', 'Tunjangan Jabatan', 'Tunjangan Fungsional', 'Tunjangan Fungsional Umum', 'Tunjangan Beras', 'Tunjangan PPh', 'Pembulatan Gaji', 'Tunjangan Khusus Papua', 'Tunjangan Jaminan Hari Tua']],
  ['Iuran & Potongan', 'remove_circle', ['Iuran Jaminan Kesehatan', 'Iuran Jaminan Kecelakaan Kerja', 'Iuran Jaminan Kematian', 'Iuran Simpanan Tapera', 'Iuran Pensiun', 'Potongan IWP', 'Potongan PPh 21', 'Zakat', 'Bulog']],
  ['Jumlah', 'functions', ['Jumlah Gaji dan Tunjangan', 'Jumlah Potongan', 'Jumlah Ditransfer']]
];
const bulanIni = () => todayYmd().slice(0, 7);
PAGES.gaji = {
  tab: 'input', per: null, nip: '', rekap: null, imp: null, cur: null,
  show(p) {
    p = p || {};
    this.tab = p.tab || 'input';
    if (!this.per) this.per = bulanIni();
    $('#pg-gaji').innerHTML = pageHead(['Administrasi', 'Rincian Gaji'], 'Rincian Gaji', 'Input manual per pegawai atau import massal dari <b>format_daftar_gaji.xlsx</b> (45 kolom). Data yang sama (NIP + periode) akan ditimpa.')
      + `<div class="tabs mb-16">${ROUTES.gaji.sub.map((s) => `<button class="tab ${s[0] === this.tab ? 'on' : ''}" data-act="nav" data-r="gaji" data-tab="${s[0]}">${ic(s[0] === 'input' ? 'edit_note' : 'upload_file', 's16')}${s[1]}</button>`).join('')}</div>
      <div class="grid"><div class="g-8" data-gj-body></div><div class="g-4" data-gj-side></div></div>`;
    this.done = true;
    if (this.tab === 'import') this.importUi(); else this.inputUi();
    this.side();
  },
  async side(force) {
    const box = $('[data-gj-side]'); if (!box) return;
    if (!this.rekap || force) { box.innerHTML = `<div class="card">${skelRows(4, 40)}</div>`; try { this.rekap = await API.call('gaji.rekap', {}, { retry: 1 }); } catch (e) { box.innerHTML = `<div class="card">${emptyBox('Rekap gagal dimuat', e.message, 'error')}</div>`; return; } }
    if (!$('[data-gj-side]')) return;
    const max = Math.max(1, ...this.rekap.map((r) => r.jumlah));
    $('[data-gj-side]').innerHTML = `<div class="card"><div class="card-h"><div><div class="card-t"><span class="card-ic">${ic('calendar_month', 's18')}</span>Rekap per Periode</div><div class="card-s">Jumlah pegawai yang memiliki rincian gaji</div></div></div>${this.rekap.length ? Chart.hbars(this.rekap.slice(0, 12).map((r) => ({ l: periodeLabel(r.periode), v: r.jumlah, c: '--chart-1' })), { max, unit: 'pegawai' }) : emptyBox('Belum ada data gaji', '', 'receipt_long')}</div>
      <div class="card flat mt-16"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('rule', 's18')}</span>Aturan</div></div><ul class="stack-8" style="margin:0;padding-left:18px;font-size:12.5px;color:var(--text-2)"><li>NIP wajib terdaftar di Data Diri.</li><li>Periode + NIP yang sama akan <b>menimpa</b> data lama.</li><li>Pegawai melihat hasilnya di menu Cek Gaji.</li></ul></div>`;
  },

  inputUi() {
    const box = $('[data-gj-body]');
    box.innerHTML = `<div class="card"><div class="fgrid c3"><div class="field"><label for="gj-per">Periode (bulan) <span class="req">*</span></label><input class="input" type="month" id="gj-per" value="${esc(this.per)}" max="2100-12" data-change="gjPer"></div>
      <div class="field span2"><label for="gj-nip">Pegawai <span class="req">*</span></label><div class="input-ic">${ic('person_search')}<input class="input" id="gj-nip" list="dl-gpeg" placeholder="Ketik nama atau NIP lalu pilih" value="${esc(this.nip)}" data-change="gjNip" autocomplete="off"></div>${S.idx.mode === 'full' ? `<datalist id="dl-gpeg">${S.idx.rows.map((r) => `<option value="${esc(r.NIP)}">${esc(r.Nama)}</option>`).join('')}</datalist>` : ''}</div></div></div><div class="mt-16" data-gj-form></div>`;
    this.form();
  },
  async form() {
    const box = $('[data-gj-form]'); if (!box) return;
    if (!this.nip || !this.per) { box.innerHTML = `<div class="card">${emptyBox('Pilih periode & pegawai', 'Formulir 45 kolom rincian gaji akan tampil setelah pegawai dipilih.', 'edit_note')}</div>`; return; }
    box.innerHTML = `<div class="card">${skelRows(6, 48)}</div>`;
    const nip = this.nip, per = this.per;
    let g = null;
    try { g = await ambilGaji(nip, per); } catch (e) { box.innerHTML = `<div class="card">${emptyBox('Gagal memuat', e.message, 'error')}</div>`; return; }
    if (this.nip !== nip || this.per !== per || !$('[data-gj-form]')) return;
    const p = pegByNip(nip) || {};
    const v = g || { NIP: nip, Nama: p.Nama || '', Golongan: p.Golongan || '', 'Nama Jabatan': p.Jabatan || '', 'Status ASN': p.StatusPegawai || '' };
    const teks = S.master.kolomGajiTeks || [];
    box.innerHTML = `<form class="card" data-submit="gjSimpan" novalidate><div class="card-h"><div><div class="card-t"><span class="card-ic">${ic('receipt_long', 's18')}</span>${esc(p.Nama || nip)} · ${periodeLabel(per)}</div><div class="card-s">${g ? `Data sudah ada (diperbarui ${fmtWaktu(g.DiperbaruiPada)}) — menyimpan akan menimpa.` : 'Data baru untuk periode ini.'}</div></div>${g ? '<span class="badge b-warn">' + ic('sync') + 'Timpa</span>' : '<span class="badge b-pri">' + ic('add') + 'Baru</span>'}</div>
      <div class="stack">${GAJI_GRUP.map((gr) => `<div class="f-section"><h4>${ic(gr[1], 's16')} ${gr[0]}</h4><div class="fgrid c3">${gr[2].map((k) => { const isT = teks.indexOf(k) >= 0, val = v[k] === undefined ? '' : v[k]; const id = 'gk-' + nk(k); return `<div class="field ${k === 'Alamat' || k === 'Nama' || k === 'Nama Jabatan' ? 'span2' : ''}" data-f="${esc(k)}"><label for="${id}">${esc(k)}${k === 'NIP' || k === 'Jumlah Ditransfer' ? ' <span class="req">*</span>' : ''}</label>${k === 'Tanggal Lahir' ? `<input class="input" type="date" id="${id}" name="${esc(k)}" value="${esc(String(val).slice(0, 10))}">` : isT ? `<input class="input ${/NIP|NIK|NPWP|Rekening/.test(k) ? 'mono' : ''}" id="${id}" name="${esc(k)}" value="${esc(val)}" ${k === 'NIP' ? 'readonly' : ''} maxlength="200">` : `<input class="input num" id="${id}" name="${esc(k)}" inputmode="numeric" data-input="${gr[0] === 'Jumlah' || gr[0] === 'Penghasilan' || gr[0] === 'Iuran & Potongan' ? 'gjMoney' : 'money'}" value="${esc(moneyFmt(val))}" placeholder="0">`}<div class="ferr" hidden></div></div>`; }).join('')}</div>${gr[0] === 'Jumlah' ? '<div data-gj-cek class="mt-12"></div>' : ''}</div>`).join('')}</div>
      <div class="row between wrap mt-20" style="border-top:1px solid var(--border);padding-top:16px;gap:10px"><span class="faint" style="font-size:12px">${ic('info', 's14')} Nilai uang diisi angka tanpa titik juga boleh.</span><button class="btn btn-primary">${ic('save', 's18')}Simpan Rincian Gaji</button></div></form>`;
    this.cek();
  },
  cek() {
    const f = $('[data-submit="gjSimpan"]'), box = f && f.querySelector('[data-gj-cek]'); if (!box) return;
    const g = (k) => num(parseRp(f.elements[k] ? f.elements[k].value : ''));
    const bruto = g('Jumlah Gaji dan Tunjangan'), pot = g('Jumlah Potongan'), net = g('Jumlah Ditransfer');
    box.innerHTML = bruto || pot || net ? (Math.round(bruto - pot) === Math.round(net) ? `<div class="banner ok" style="padding:8px 12px">${ic('check_circle', 's18')}<p style="margin:0">Jumlah Ditransfer sesuai (Gaji & Tunjangan − Potongan).</p></div>` : `<div class="banner warn" style="padding:8px 12px">${ic('warning', 's18')}<p style="margin:0">Gaji & Tunjangan − Potongan = <b style="display:inline">${fmtRp(bruto - pot)}</b>, berbeda dengan Jumlah Ditransfer (${fmtRp(net)}). Periksa kembali — tetap dapat disimpan.</p></div>`) : '';
  },
  async simpan(f) {
    const data = {}, teks = S.master.kolomGajiTeks || [];
    (S.master.kolomGaji || []).forEach((k) => { const el = f.elements[k]; if (!el) return; data[k] = teks.indexOf(k) >= 0 ? String(el.value || '').trim() : parseRp(el.value); });
    const errs = {}; if (!/^\d{18}$/.test(digits(data.NIP))) errs.NIP = 'NIP harus 18 digit.'; if (data['Jumlah Ditransfer'] === '') errs['Jumlah Ditransfer'] = 'Wajib diisi.';
    if (showErrs(f, errs)) return;
    const btn = f.querySelector('.btn-primary'); btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Menyimpan…';
    try {
      const r = await API.call('gaji.simpan', { periode: this.per, data });
      const k = this.nip + '|' + this.per; GAJI_CACHE[k] = Promise.resolve(r.data); GAJI_CACHE[k].val = r.data; GAJI_CACHE[k].done = true;
      toast('ok', r.diganti ? 'Rincian gaji diperbarui' : 'Rincian gaji tersimpan', `${data.Nama || data.NIP} · ${periodeLabel(this.per)}`);
      this.rekap = null; this.side(); this.form();
    } catch (e) { errToast(e, 'Gagal menyimpan'); btn.disabled = false; btn.innerHTML = ic('save', 's18') + 'Simpan Rincian Gaji'; }
  },

  importUi() {
    const st = this.imp;
    $('[data-gj-body]').innerHTML = `<div class="card"><div class="fgrid c3"><div class="field"><label for="gi-per">Periode (bulan) <span class="req">*</span></label><input class="input" type="month" id="gi-per" value="${esc(this.per)}" data-change="gjPer"></div>
      <div class="field span2"><label>Berkas daftar gaji</label><div class="row wrap"><label class="btn btn-primary" style="cursor:pointer">${ic('upload_file', 's18')}Pilih Berkas Excel<input type="file" accept=".xlsx,.xls,.csv" data-change="gjFile" hidden></label><button class="btn btn-outline" data-act="gjTpl">${ic('download', 's18')}Template 45 Kolom</button></div></div></div>
      <p class="faint mt-12" style="font-size:12px">${ic('info', 's14')} Header dicari otomatis (kolom NIP & Jumlah Ditransfer wajib ada). Pastikan kolom NIP/NIK/NPWP/No. Rekening berformat Teks.</p></div><div class="mt-16" data-gi-res>${st && st.res ? '' : `<div class="card">${emptyBox('Belum ada berkas', 'Pilih periode lalu unggah berkas format_daftar_gaji.xlsx.', 'table_view')}</div>`}</div>`;
    if (st) this.impRender();
  },
  impRender() {
    const st = this.imp, box = $('[data-gi-res]'); if (!box || !st) return;
    if (st.loading) { box.innerHTML = `<div class="card"><div class="row mb-12"><span class="spin"></span><b>Memvalidasi ${fmtNum(st.rows.length)} baris…</b></div>${skelRows(4)}</div>`; return; }
    const flags = st.flags || {}, f = st.filter || '';
    const hasil = st.res.hasil.map((h) => (flags[h.baris] ? Object.assign({}, h, { status: h.status === 'GAGAL' || flags[h.baris].some((k) => nk(k) === 'nip') ? 'GAGAL' : h.status, alasan: [`Kolom ${flags[h.baris].join(', ')} tersimpan sebagai angka (digit terakhir hilang) — format sebagai Teks`, h.alasan].filter(Boolean).join('; ') }) : h));
    const ring = { total: hasil.length, ok: hasil.filter((h) => h.status !== 'GAGAL').length, gagal: hasil.filter((h) => h.status === 'GAGAL').length, ganti: hasil.filter((h) => h.status === 'GANTI').length };
    const view = hasil.filter((h) => !f || h.status === f);
    box.innerHTML = `<div class="card"><div class="card-h"><div><div class="card-t"><span class="card-ic">${ic('fact_check', 's18')}</span>Pratinjau Import · ${periodeLabel(st.res.ringkas.periode)}</div><div class="card-s">${esc(st.file)}${st.saved ? ' · <b style="color:var(--success)">sudah disimpan</b>' : ''}</div></div><button class="btn btn-sm btn-ghost" data-act="gjImpClear">${ic('close', 's18')}Tutup</button></div>
      ${ringkasImport(ring, 'gaji')}
      ${st.saved ? `<div class="banner ok mt-12">${ic('task_alt')}<div><b>Import gaji selesai</b><p>${st.saved.baru} data baru, ${st.saved.diganti} data ditimpa.</p></div></div>` : ''}
      <div class="tabs mt-16">${[['', 'Semua', ring.total], ['OK', 'Baru', ring.ok - ring.ganti], ['GANTI', 'Menimpa', ring.ganti], ['GAGAL', 'Gagal', ring.gagal]].map((t) => `<button class="tab ${f === t[0] ? 'on' : ''}" data-act="gjImpF" data-v="${t[0]}">${t[1]}<span class="cnt">${t[2]}</span></button>`).join('')}</div>
      <div class="tbl-wrap mt-12" style="max-height:420px;overflow:auto"><table class="tbl compact"><thead><tr><th>Baris</th><th>NIP</th><th>Nama</th><th class="t-right">Ditransfer</th><th>Status</th><th>Keterangan</th></tr></thead><tbody>${view.slice(0, 500).map((h) => `<tr><td class="c-no">${h.baris}</td><td class="mono nowrap">${esc(h.nip || '—')}</td><td>${esc(h.nama || '—')}</td><td class="t-right nowrap">${h.jumlah === '' ? '—' : fmtRp(h.jumlah)}</td><td>${h.status === 'OK' ? '<span class="badge b-ok">' + ic('add') + 'Baru</span>' : h.status === 'GANTI' ? '<span class="badge b-warn">' + ic('sync') + 'Timpa</span>' : '<span class="badge b-bad">' + ic('error') + 'Gagal</span>'}</td><td style="font-size:12px;max-width:380px">${esc(h.alasan || '') || '<span class="faint">—</span>'}</td></tr>`).join('')}</tbody></table></div>
      <div class="row between wrap mt-16" style="border-top:1px solid var(--border);padding-top:16px;gap:10px"><span class="muted" style="font-size:12.5px">${ic('info', 's16')} Baris gagal dilewati.</span><button class="btn btn-primary" data-act="gjImpSave" ${!ring.ok || st.saved ? 'disabled' : ''}>${ic('cloud_upload', 's18')}Simpan ${fmtNum(ring.ok)} Rincian Gaji</button></div></div>`;
  },
  async impFile(file) {
    const per = this.per; if (!/^\d{4}-\d{2}$/.test(per || '')) return toast('warn', 'Pilih periode', 'Tentukan bulan/tahun periode gaji terlebih dahulu.');
    let parsed;
    try { parsed = await bacaExcel(file, { wajib: ['NIP', 'Jumlah Ditransfer'], teks: S.master.kolomGajiTeks || ['NIP'] }); } catch (e) { return errToast(e, 'Berkas tidak dapat dibaca'); }
    if (!parsed.rows.length) return toast('warn', 'Berkas kosong', 'Tidak ada baris data.');
    const flags = parsed.flags || {};
    const rows = parsed.rows.map((r, i) => (flags[i + 2] && flags[i + 2].some((k) => nk(k) === 'nip') ? Object.assign({}, r, { NIP: '' }) : r));
    this.imp = { file: file.name, rows, flags, per, loading: true };
    this.impRender();
    try { this.imp.res = await API.call('gaji.import', { periode: per, rows, dryRun: true }); }
    catch (e) { this.imp = null; if (S.route === 'gaji') this.importUi(); return errToast(e, 'Validasi gagal'); }
    this.imp.loading = false;
    if (S.route === 'gaji' && this.tab === 'import') this.impRender();
  },
  async impSave() {
    const st = this.imp; if (!st) return;
    const ok = await Modal.confirm({ title: 'Simpan rincian gaji?', icon: 'cloud_upload', msg: `Rincian gaji periode <b>${periodeLabel(st.per)}</b> akan disimpan. Data dengan NIP & periode yang sama akan ditimpa.`, ok: 'Simpan' });
    if (!ok) return;
    const btn = $('[data-act="gjImpSave"]'); if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Menyimpan…'; }
    Sync.run('Menyimpan gaji…', API.call('gaji.import', { periode: st.per, rows: st.rows, dryRun: false })).then((r) => {
      st.res = r; st.saved = r.tulis; Object.keys(GAJI_CACHE).forEach((k) => { if (k.slice(-7) === st.per) delete GAJI_CACHE[k]; });
      this.rekap = null; if (S.route === 'gaji') { this.side(); if (this.tab === 'import') this.impRender(); }
      toast('ok', 'Import gaji berhasil', `${r.tulis.baru} baru · ${r.tulis.diganti} ditimpa`); invalidateDash();
    }).catch((e) => { if (btn) { btn.disabled = false; btn.innerHTML = ic('cloud_upload', 's18') + 'Coba Simpan Lagi'; } errToast(e, 'Import gagal'); });
  }
};
CHG.gjPer = (el) => { const pg = PAGES.gaji; pg.per = el.value; if (pg.tab === 'input') pg.form(); };
CHG.gjNip = (el) => {
  const v = el.value.trim(); let nip = digits(v);
  if (nip.length !== 18) { const hit = S.idx.rows.filter((r) => String(r.Nama).toLowerCase().indexOf(v.toLowerCase()) >= 0); if (hit.length === 1) { nip = hit[0].NIP; el.value = nip; } else return; }
  PAGES.gaji.nip = nip; PAGES.gaji.form();
};
INP.gjMoney = (el) => { INP.money(el); PAGES.gaji.cek(); };
SUBMIT.gjSimpan = (f) => PAGES.gaji.simpan(f);
CHG.gjFile = (el) => { const f = el.files && el.files[0]; el.value = ''; if (f) PAGES.gaji.impFile(f); };
ACT.gjImpF = (el) => { PAGES.gaji.imp.filter = el.dataset.v; PAGES.gaji.impRender(); };
ACT.gjImpClear = () => { PAGES.gaji.imp = null; PAGES.gaji.importUi(); };
ACT.gjImpSave = () => PAGES.gaji.impSave();
ACT.gjTpl = async () => {
  try { await loadLib('xlsx'); await unduhXlsx([{ name: 'Daftar Gaji', ws: wsTemplate(S.master.kolomGaji, {}, S.master.kolomGajiTeks, 300) }], 'Template_Daftar_Gaji_45_Kolom.xlsx'); } catch (e) { errToast(e, 'Template gagal dibuat'); }
};

const LAP_JENIS = [['DATA_DIRI', 'Data Diri', 'badge'], ['KELUARGA', 'Tunjangan Keluarga', 'family_restroom'], ['PANGKAT', 'Pangkat/Golongan', 'military_tech'], ['JABATAN', 'Jabatan', 'work'], ['KGB', 'Masa Kerja/KGB', 'schedule'], ['UNIT', 'Unit Kerja', 'domain'], ['GAJI', 'Rincian Gaji', 'payments']];
const LAP_CACHE = {};
PAGES.laporan = {
  dataPage: false, o: { jenis: 'DATA_DIRI', unit: '', status: '', keaktifan: '', terkini: true, periode: '' }, data: null,
  show() {
    const o = this.o, sa = isSA();
    $('#pg-laporan').innerHTML = pageHead(['Lainnya', 'Laporan / Export'], 'Laporan / Export', sa ? 'Ekspor data seluruh pegawai ke Excel atau PDF.' : `Ekspor data pegawai <b>${esc(S.user.unit)}</b> ke Excel atau PDF.`)
      + `<div class="card"><div class="card-h"><div class="card-t">1. Pilih jenis laporan</div></div><div class="cat-grid">${LAP_JENIS.filter((j) => sa || j[0] !== 'GAJI').map((j) => `<button type="button" class="cat ${o.jenis === j[0] ? 'on' : ''}" data-act="lpJenis" data-j="${j[0]}" aria-pressed="${o.jenis === j[0]}"><div class="top"><span class="ic">${ic(j[2], 's18')}</span></div><b>${j[1]}</b><small>${j[0] === 'GAJI' ? 'Per periode · 45 kolom' : j[0] === 'DATA_DIRI' ? 'Termasuk status kelengkapan' : j[0] === 'KELUARGA' ? 'Pasangan & anak + status' : 'Riwayat SK'}</small></button>`).join('')}</div></div>
      <div class="card mt-16"><div class="card-h"><div class="card-t">2. Atur filter</div></div><div class="filter">
        ${sa ? `<div class="field" style="grid-column:span 3"><label for="lp-u">Unit Kerja</label><select class="select" id="lp-u" data-change="lpOpt" data-k="unit">${unitOptions(o.unit, 'Semua unit kerja')}</select></div>` : ''}
        <div class="field" style="grid-column:span ${sa ? 2 : 3}"><label for="lp-s">Status Pegawai</label><select class="select" id="lp-s" data-change="lpOpt" data-k="status">${optList(['PNS', 'PPPK'], o.status, 'PNS & PPPK')}</select></div>
        <div class="field" style="grid-column:span ${sa ? 2 : 3}"><label for="lp-k">Keaktifan</label><select class="select" id="lp-k" data-change="lpOpt" data-k="keaktifan">${optList(S.master.keaktifan, o.keaktifan, 'Semua')}</select></div>
        ${o.jenis === 'GAJI' ? `<div class="field" style="grid-column:span ${sa ? 5 : 6}"><label for="lp-p">Periode <span class="req">*</span></label><input class="input" type="month" id="lp-p" value="${esc(o.periode || bulanIni())}" data-change="lpOpt" data-k="periode"></div>` : ['DATA_DIRI', 'KELUARGA'].indexOf(o.jenis) < 0 ? `<div class="field" style="grid-column:span ${sa ? 5 : 6}"><label>Cakupan riwayat</label><div class="seg" role="radiogroup"><button type="button" class="${o.terkini ? 'on' : ''}" data-act="lpTerkini" data-v="1">Terkini saja</button><button type="button" class="${!o.terkini ? 'on' : ''}" data-act="lpTerkini" data-v="0">Seluruh riwayat</button></div></div>` : ''}
        <div class="fa"><span class="info" data-lp-info>${ic('info', 's16')} Data dibuat langsung di browser — tidak ada berkas yang tersimpan di server.</span><div class="btns row"><button class="btn btn-outline" data-act="lpGo" data-f="pdf">${ic('picture_as_pdf', 's18')}PDF</button><button class="btn btn-primary" data-act="lpGo" data-f="xlsx">${ic('table_view', 's18')}Excel</button></div></div></div></div>
      <div class="card mt-16" data-lp-prev></div>`;
    this.done = true; this.preview();
  },
  key() { const o = this.o; return JSON.stringify([o.jenis, o.unit, o.status, o.keaktifan, o.terkini, o.jenis === 'GAJI' ? (o.periode || bulanIni()) : '']); },
  fetch() {
    const k = this.key(), o = this.o;
    if (!LAP_CACHE[k] || Date.now() - LAP_CACHE[k].at > 120000) { const p = API.call('laporan.data', { jenis: o.jenis, unit: o.unit, status: o.status, keaktifan: o.keaktifan, terkini: o.terkini, periode: o.periode || bulanIni() }, { retry: 1 }); LAP_CACHE[k] = { p, at: Date.now() }; p.catch(() => delete LAP_CACHE[k]); }
    return LAP_CACHE[k].p;
  },
  async preview() {
    const box = $('[data-lp-prev]'); if (!box) return;
    box.innerHTML = `<div class="card-h"><div class="card-t">3. Pratinjau</div></div>${skelRows(5, 36)}`;
    const k = this.key();
    let d; try { d = await this.fetch(); } catch (e) { box.innerHTML = `<div class="card-h"><div class="card-t">3. Pratinjau</div></div>${emptyBox('Data gagal dimuat', e.message, 'error')}`; return; }
    if (k !== this.key() || !$('[data-lp-prev]')) return;
    this.data = d;
    const n = Math.min(50, d.rows.length);
    box.innerHTML = `<div class="card-h"><div><div class="card-t">3. Pratinjau — ${esc(d.judul)}</div><div class="card-s">${fmtNum(d.rows.length)} baris · ${d.headers.length} kolom · ${esc(d.cakupan)}${d.rows.length > n ? ` · menampilkan ${n} baris pertama` : ''}</div></div></div>
      ${d.rows.length ? `<div class="tbl-wrap" style="max-height:440px;overflow:auto"><table class="tbl compact"><thead><tr><th class="c-no">#</th>${d.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${d.rows.slice(0, n).map((r, i) => `<tr><td class="c-no">${i + 1}</td>${r.map((v) => `<td class="nowrap" style="max-width:240px;overflow:hidden;text-overflow:ellipsis">${typeof v === 'number' && v > 9999 ? fmtNum(v) : esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : emptyBox('Tidak ada data', 'Tidak ada data yang cocok dengan filter laporan.', 'inbox')}`;
  },
  async exportXlsx() {
    const d = await this.fetch();
    if (!d.rows.length) return toast('info', 'Tidak ada data', 'Laporan kosong untuk filter ini.');
    await loadLib('xlsx');
    const aoa = [[`Laporan ${d.judul}`], [S.cfg.instansi || BOOT.instansi || 'Dinas Kesehatan Kabupaten Minahasa Selatan'], [`Cakupan: ${d.cakupan} · Dibuat: ${fmtWaktu(d.dibuat)} oleh ${d.oleh}`], [], d.headers].concat(d.rows);
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!merges'] = [0, 1, 2].map((r) => ({ s: { r, c: 0 }, e: { r, c: Math.max(0, d.headers.length - 1) } }));
    ws['!cols'] = d.headers.map((h, c) => ({ wch: Math.min(40, Math.max(h.length + 2, ...d.rows.slice(0, 200).map((r) => String(r[c] === undefined ? '' : r[c]).length + 1))) }));
    d.headers.forEach((h, c) => { if (/^NIP|NIK|NPWP|Rekening/i.test(h)) for (let r = 5; r < aoa.length; r++) { const a = XLSX.utils.encode_cell({ r, c }); if (ws[a]) { ws[a].t = 's'; ws[a].v = String(ws[a].v); } } else for (let r = 5; r < aoa.length; r++) { const a = XLSX.utils.encode_cell({ r, c }); if (ws[a] && ws[a].t === 'n' && Math.abs(ws[a].v) >= 1000) ws[a].z = '#,##0'; } });
    ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 4, c: 0 }, e: { r: aoa.length - 1, c: d.headers.length - 1 } }) };
    await unduhXlsx([{ name: d.judul.slice(0, 30).replace(/[\\\x2F?*[\]:]/g, '-'), ws }], `Laporan_${d.judul.replace(/\W+/g, '_')}_${todayYmd()}.xlsx`);
    toast('ok', 'Excel diunduh', `${fmtNum(d.rows.length)} baris`);
  },
  async exportPdf() {
    const d = await this.fetch();
    if (!d.rows.length) return toast('info', 'Tidak ada data', 'Laporan kosong untuk filter ini.');
    await loadLib('jspdf');
    let headers = d.headers, rows = d.rows, note = '';
    if (this.o.jenis === 'GAJI') { const pick = ['NIP', 'Nama', 'Golongan', 'Gaji Pokok', 'Tunjangan Keluarga', 'Tunjangan Jabatan', 'Tunjangan Fungsional', 'Tunjangan Beras', 'Jumlah Gaji dan Tunjangan', 'Jumlah Potongan', 'Jumlah Ditransfer'].map((h) => d.headers.indexOf(h)).filter((i) => i >= 0); headers = pick.map((i) => d.headers[i]); rows = d.rows.map((r) => pick.map((i) => r[i])); note = 'Kolom ringkas — data 45 kolom lengkap tersedia pada ekspor Excel.'; }
    const big = headers.length > 10, doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: big ? 'a3' : 'a4' }), W = doc.internal.pageSize.getWidth();
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text(('Laporan ' + d.judul).toUpperCase(), 14, 14);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(90); doc.text(S.cfg.instansi || BOOT.instansi || 'Dinas Kesehatan Kabupaten Minahasa Selatan', 14, 20); doc.text(`Cakupan: ${d.cakupan} · Dibuat ${fmtWaktu(d.dibuat)} oleh ${d.oleh} · ${fmtNum(rows.length)} baris`, 14, 25);
    if (note) doc.text(note, 14, 30);
    doc.autoTable({ startY: note ? 34 : 30, head: [['No'].concat(headers)], body: rows.map((r, i) => [i + 1].concat(r.map((v) => (typeof v === 'number' && Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('id-ID') : (v === undefined ? '' : String(v)))))), styles: { fontSize: big ? 6.5 : 7.5, cellPadding: 1.4, overflow: 'linebreak' }, headStyles: { fillColor: [26, 31, 77], textColor: 255, fontStyle: 'bold' }, alternateRowStyles: { fillColor: [241, 243, 255] }, margin: { left: 10, right: 10 },
      didDrawPage: () => { doc.setFontSize(7.5); doc.setTextColor(140); doc.text(`${S.cfg.appName || BRAND.nama} · Halaman ${doc.internal.getNumberOfPages()}`, W - 10, doc.internal.pageSize.getHeight() - 6, { align: 'right' }); } });
    doc.save(`Laporan_${d.judul.replace(/\W+/g, '_')}_${todayYmd()}.pdf`);
    toast('ok', 'PDF diunduh', `${fmtNum(rows.length)} baris`);
  }
};
ACT.lpJenis = (el) => { const pg = PAGES.laporan; pg.o.jenis = el.dataset.j; if (pg.o.jenis === 'GAJI' && !pg.o.periode) pg.o.periode = bulanIni(); pg.show(); };
ACT.lpTerkini = (el) => { PAGES.laporan.o.terkini = el.dataset.v === '1'; $$('[data-act="lpTerkini"]').forEach((b) => b.classList.toggle('on', b === el)); PAGES.laporan.preview(); };
CHG.lpOpt = (el) => { PAGES.laporan.o[el.dataset.k] = el.value; PAGES.laporan.preview(); };
ACT.lpGo = (el) => { const pg = PAGES.laporan; const old = el.innerHTML; el.disabled = true; el.innerHTML = '<span class="spin"></span>Menyiapkan…'; (el.dataset.f === 'pdf' ? pg.exportPdf() : pg.exportXlsx()).catch((e) => errToast(e, 'Ekspor gagal')).finally(() => { el.disabled = false; el.innerHTML = old; }); };

function skorPw(p) { let s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return Math.min(4, s); }
PAGES.password = {
  show() {
    const pw = (id, l, ac) => `<div class="field" data-f="${id}"><label for="${id}">${l} <span class="req">*</span></label><div class="pw-wrap"><input class="input" type="password" id="${id}" name="${id}" autocomplete="${ac}" ${id === 'pw-baru' ? 'data-input="pwMeter"' : ''}><button type="button" class="icon-btn eye" data-act="togglePw" data-t="${id}" aria-label="Tampilkan password">${ic('visibility', 's18')}</button></div><div class="ferr" hidden></div></div>`;
    $('#pg-password').innerHTML = pageHead(['Lainnya', 'Ubah Password'], 'Ubah Password', 'Gunakan password yang kuat dan jangan bagikan kepada siapa pun.')
      + `<div class="grid"><div class="g-7"><form class="card" data-submit="pwUbah" novalidate><div class="card-h"><div class="card-t"><span class="card-ic">${ic('lock_reset', 's18')}</span>Ganti Password</div></div>
        ${S.user.harusGanti ? `<div class="banner warn mb-12">${ic('shield_lock')}<div><b>Anda masih memakai password awal</b><p>Segera ganti untuk melindungi data gaji Anda.</p></div></div>` : ''}
        <div class="stack">${pw('pw-lama', 'Password Saat Ini', 'current-password')}<div>${pw('pw-baru', 'Password Baru', 'new-password')}<div class="meter mt-8"><i data-pw-bar style="width:0"></i></div><div class="row between mt-4" style="font-size:12px"><span class="muted" data-pw-lbl>Kekuatan password</span></div></div>${pw('pw-ulang', 'Ulangi Password Baru', 'new-password')}</div>
        <div class="row between wrap mt-20" style="border-top:1px solid var(--border);padding-top:16px;gap:10px"><span class="faint" style="font-size:12px">${ic('devices', 's14')} Sesi di perangkat lain akan berakhir otomatis.</span><button class="btn btn-primary">${ic('save', 's18')}Simpan Password</button></div></form></div>
        <div class="g-5"><div class="card flat"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('checklist', 's18')}</span>Syarat Password</div></div><div class="stack-8" data-pw-rules>${this.rules('')}</div></div>
        <div class="card flat mt-16"><div class="row top gap-12"><span class="card-ic warn">${ic('help', 's18')}</span><div><b>Lupa password?</b><p class="muted" style="font-size:12.5px;margin-top:2px">Hubungi Superadmin melalui Pusat Bantuan untuk reset password ke NIP.</p><a class="btn btn-sm btn-outline mt-8" href="${esc(waLink('Halo Superadmin ' + (S.cfg.appName || BRAND.nama) + ', saya perlu bantuan reset password.'))}" target="_blank" rel="noopener">${ic('support_agent', 's18')}Pusat Bantuan</a></div></div></div></div></div>`;
    this.done = true;
  },
  rules(p) {
    const u = S.user || {};
    return [[p.length >= 8, 'Minimal 8 karakter'], [/[A-Za-z]/.test(p), 'Mengandung huruf'], [/\d/.test(p), 'Mengandung angka'], [!!p && p !== String(u.nip || '') && p.toLowerCase() !== String(u.username || '').toLowerCase(), 'Tidak sama dengan NIP/username']].map((r) => `<div class="row" style="font-size:13px;color:${r[0] ? 'var(--success)' : 'var(--text-2)'}">${ic(r[0] ? 'check_circle' : 'radio_button_unchecked', 's18')}${r[1]}</div>`).join('');
  }
};
INP.pwMeter = (el) => {
  const p = el.value, s = skorPw(p), col = ['--danger-fg', '--danger-fg', '--warning-fg', '--success-fg', '--success-fg'][s], lbl = ['Sangat lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat kuat'][s];
  const bar = $('[data-pw-bar]'); bar.style.width = (p ? (s + 1) * 20 : 0) + '%'; bar.style.background = `var(${col})`;
  $('[data-pw-lbl]').textContent = p ? 'Kekuatan: ' + lbl : 'Kekuatan password';
  $('[data-pw-rules]').innerHTML = PAGES.password.rules(p);
};
SUBMIT.pwUbah = (f) => {
  const lama = f['pw-lama'].value, baru = f['pw-baru'].value, ulang = f['pw-ulang'].value, errs = {}, u = S.user;
  if (!lama) errs['pw-lama'] = 'Password saat ini wajib diisi.';
  if (baru.length < 8 || !/[A-Za-z]/.test(baru) || !/\d/.test(baru)) errs['pw-baru'] = 'Minimal 8 karakter, mengandung huruf dan angka.';
  else if (baru === String(u.nip || '') || baru.toLowerCase() === String(u.username).toLowerCase()) errs['pw-baru'] = 'Tidak boleh sama dengan NIP/username.';
  else if (baru === lama) errs['pw-baru'] = 'Password baru harus berbeda dari password saat ini.';
  if (!errs['pw-baru'] && ulang !== baru) errs['pw-ulang'] = 'Konfirmasi password tidak sama.';
  if (showErrs(f, errs)) return;
  const btn = f.querySelector('.btn-primary'); btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Menyimpan…';
  API.call('password.ubah', { lama, baru, remember: S.remember }).then((r) => {
    S.token = r.token; Store.del('pg:tok'); Store.set('pg:tok', JSON.stringify({ token: r.token, remember: S.remember, u: S.user.username }), S.remember);
    S.user.harusGanti = false; f.reset(); PAGES.password.show();
    toast('ok', 'Password berhasil diubah', 'Gunakan password baru pada login berikutnya.');
  }).catch((e) => { btn.disabled = false; btn.innerHTML = ic('save', 's18') + 'Simpan Password'; if (/lama/i.test(e.message)) showErrs(f, { 'pw-lama': e.message }); else errToast(e, 'Gagal mengubah password'); });
};

const CFG_SPEC = [
  { k: 'APP_NAME', l: 'Nama Aplikasi', t: 'text', req: 1, max: 60 },
  { k: 'INSTANSI', l: 'Nama Instansi', t: 'text', req: 1, max: 150 },
  { k: 'WA_BANTUAN', l: 'WhatsApp Pusat Bantuan (format 62…)', t: 'tel', re: /^62\d{8,13}$/, msg: 'Gunakan format 62 diikuti nomor, mis. 6281234567890.' },
  { k: 'EMAIL_SUPERADMIN', l: 'Email Notifikasi Superadmin', t: 'email', re: RE_EMAIL, msg: 'Format email tidak valid.' },
  { k: 'PENDING_AMBANG_HARI', l: 'Ambang Pending Terlambat (hari)', t: 'text', re: /^\d{1,2}$/, msg: 'Angka 1–99.', im: 'numeric' },
  { k: 'SESSION_IDLE_MENIT', l: 'Batas Sesi Tidak Aktif (menit)', t: 'text', re: /^\d{1,4}$/, msg: 'Angka menit.', im: 'numeric' },
  { k: 'SESSION_INGAT_HARI', l: '"Ingat Sesi" Berlaku (hari)', t: 'text', re: /^\d{1,2}$/, msg: 'Angka 1–30.', im: 'numeric' },
  { k: 'PWA_URL', l: 'URL Aplikasi (GitHub Pages) — dipakai sebagai tautan {link} di pesan WA/email', t: 'text', ph: 'https:/\/username.github.io/cekup-gaji/', span: 2 },
  { k: 'LOGO_URL', l: 'URL Logo Instansi (opsional)', t: 'text', ph: 'https:/\/…/logo.png', span: 2 }
];
const MIG_LABEL = { UNIT: 'Master Unit Kerja', PANGKAT: 'Master Pangkat', PEGAWAI: 'Data Diri', AKUN: 'Akun', R_PANGKAT: 'Riwayat Pangkat', R_JABATAN: 'Riwayat Jabatan', R_KGB: 'Riwayat KGB', R_UNIT: 'Riwayat Unit Kerja', KELUARGA: 'Tunjangan Keluarga', CUTI: 'Riwayat Cuti', PENGAJUAN: 'Pengajuan', GAJI: 'Rincian Gaji', ALERT: 'Log Alert Anak', IMPORT: 'Log Import', NOTIF: 'Notifikasi in-app', AUDIT: 'Audit Log' };
const PS_IC = { umum: 'tune', notifikasi: 'notifications_active', migrasi: 'move_down' };
const okIc = (v) => v ? `<span class="badge b-ok">${ic('check')}Ada</span>` : `<span class="badge b-warn">${ic('warning')}Belum</span>`;
PAGES.pengaturan = {
  tab: 'umum', cfg: null, mig: null, nc: null, rh: null,
  show(p) {
    p = p || {};
    this.tab = p.tab || 'umum';
    $('#pg-pengaturan').innerHTML = pageHead(['Administrasi', 'Pengaturan'], 'Pengaturan', 'Konfigurasi aplikasi, notifikasi, sistem, dan migrasi data dari spreadsheet versi lama.')
      + `<div class="tabs mb-16">${ROUTES.pengaturan.sub.map((s) => `<button class="tab ${s[0] === this.tab ? 'on' : ''}" data-act="nav" data-r="pengaturan" data-tab="${s[0]}">${ic(PS_IC[s[0]] || 'tune', 's16')}${s[1]}</button>`).join('')}</div><div data-ps-body></div>`;
    this.done = true;
    if (this.tab === 'migrasi') this.migrasi(); else if (this.tab === 'notifikasi') this.notifikasi(); else this.umum();
  },
  async umum() {
    const box = $('[data-ps-body]');
    if (!this.cfg) { box.innerHTML = `<div class="card">${skelRows(6, 48)}</div>`; try { this.cfg = await API.call('config.get', {}, { retry: 1 }); } catch (e) { box.innerHTML = `<div class="card">${emptyBox('Pengaturan gagal dimuat', e.message, 'error')}</div>`; return; } if (S.route !== 'pengaturan' || this.tab !== 'umum') return; }
    const vals = {}; this.cfg.forEach((c) => { vals[c.Kunci] = c.Nilai; });
    const t = Theme.get();
    box.innerHTML = `<div class="grid"><div class="g-8"><form class="card" data-submit="psSimpan" novalidate><div class="card-h"><div class="card-t"><span class="card-ic">${ic('tune', 's18')}</span>Pengaturan Umum</div></div>${formHtml(CFG_SPEC, vals, 'cf-')}
      <div class="row between wrap mt-20" style="border-top:1px solid var(--border);padding-top:16px;gap:10px"><span class="faint" style="font-size:12px">${ic('history', 's14')} Perubahan tercatat di audit log.</span><button class="btn btn-primary">${ic('save', 's18')}Simpan Pengaturan</button></div></form></div>
      <div class="g-4"><div class="stack">
        <div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('contrast', 's18')}</span>Tampilan</div></div><div class="seg" role="radiogroup" aria-label="Tema"><button type="button" data-act="tema" data-v="terang" class="${t === 'terang' ? 'on' : ''}">${ic('light_mode', 's18')}Terang</button><button type="button" data-act="tema" data-v="gelap" class="${t === 'gelap' ? 'on' : ''}">${ic('dark_mode', 's18')}Gelap</button></div><p class="faint mt-8" style="font-size:12px">Preferensi tema tersimpan per akun.</p></div>
        <div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('settings_suggest', 's18')}</span>Sistem</div></div><div class="stack-8">
          <button class="btn btn-outline btn-block" style="justify-content:flex-start" data-act="psAlert">${ic('child_care', 's18')}Jalankan pemeriksaan alert anak</button>
          <button class="btn btn-outline btn-block" style="justify-content:flex-start" data-act="psEmail">${ic('forward_to_inbox', 's18')}Kirim email uji</button>
          <button class="btn btn-outline btn-block" style="justify-content:flex-start" data-act="refresh">${ic('refresh', 's18')}Muat ulang data aplikasi</button></div>
          <dl class="kv mt-16"><div><dt>Versi</dt><dd>${esc(S.cfg.versi || '-')}</dd></div><div><dt>Mode daftar</dt><dd>${S.idx.mode === 'full' ? 'Instan (browser)' : 'Server (data besar)'}</dd></div><div><dt>Unit kerja</dt><dd>${S.master.unit.length}</dd></div><div><dt>Golongan</dt><dd>${S.master.pangkat.length}</dd></div>${(() => { const t = API.ringkas(); return t ? `<div class="full"><dt>Latensi rata-rata (${t.n} panggilan terakhir)</dt><dd>Server ${fmtNum(t.server)} ms · total ${fmtNum(t.total)} ms</dd></div>` : ''; })()}</dl>
          <p class="faint mt-12" style="font-size:11.5px">Pemeriksaan alert otomatis berjalan setiap hari pukul 06.00 WITA; antrean email/WA diproses setiap ±1 menit melalui trigger.</p></div>
        <div class="card" data-rh-box><div class="card-h"><div class="card-t"><span class="card-ic">${ic('key', 's18')}</span>Keamanan & Kunci Rahasia</div></div>${this.rh ? this.rhHtml() : skelRows(3, 30)}</div>
        <div class="card flat"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('install_mobile', 's18')}</span>Aplikasi HP (PWA)</div></div><p class="muted" style="font-size:12.5px">Aplikasi ini dapat dipasang di HP seperti aplikasi biasa. Bagikan tautan berikut ke pegawai:</p>
          <div class="row mt-8" style="gap:8px"><code class="mono grow" style="font-size:12px;word-break:break-all">${esc(S.cfg.pwaUrl || (location.origin + location.pathname))}</code><button class="btn btn-outline btn-sm" data-act="copy" data-v="${esc(S.cfg.pwaUrl || (location.origin + location.pathname))}">${ic('content_copy', 's16')}Salin</button></div>
          <button class="btn btn-soft btn-block mt-12" data-act="pwa" data-pwa-btn ${PWA.bisa() ? '' : 'hidden'}>${ic('install_mobile', 's18')}Pasang di perangkat ini</button></div>
      </div></div></div>`;
    if (!this.rh) API.call('rahasia.status', {}).then((r) => { this.rh = r; const b = $('[data-rh-box]'); if (b) b.innerHTML = b.querySelector('.card-h').outerHTML + this.rhHtml(); }).catch(() => { });
  },
  rhHtml() {
    const r = this.rh, tg = r.trigger || {};
    const row = (l, v) => `<div class="row between" style="padding:7px 0;border-bottom:1px solid var(--border);gap:8px"><span style="font-size:13px">${l}</span>${v}</div>`;
    return `<p class="faint" style="font-size:11.5px;margin-bottom:6px">${ic('lock', 's14')} Disimpan di <b>Script Properties</b> server — tidak pernah dikirim ke browser.</p>
      ${row('Kunci sesi (SESSION_SECRET)', okIc(r.SESSION_SECRET.ada))}${row('Pepper sandi (PEPPER)', okIc(r.PEPPER.ada))}
      ${row('Token Fonnte (WhatsApp)', r.FONNTE_TOKEN.ada ? `<span class="mono" style="font-size:12px">${esc(r.FONNTE_TOKEN.samar)}</span>` : '<span class="badge b-mut">Belum diisi</span>')}
      ${row('Akses darurat (' + esc(r.darurat.user) + ')', r.darurat.terkunci ? `<span class="badge b-bad">${ic('lock')}Terkunci 15 mnt</span>` : okIc(r.darurat.ada))}
      ${row('Trigger harian · cache · antrean', `<span style="font-size:12px;font-weight:600">${['harian', 'cache', 'antrean'].map((k) => (tg[k] ? '✓' : '✗')).join(' · ')}</span>`)}
      ${tg.harian && tg.cache && tg.antrean ? '' : `<button class="btn btn-outline btn-block btn-sm mt-12" data-act="psTrigger">${ic('build', 's16')}Pasang ulang trigger</button>`}`;
  },
  async simpan(f) {
    const { vals, errs } = readForm(f, CFG_SPEC);
    if (vals.PWA_URL && !/^https:\x2F\x2F.+/i.test(vals.PWA_URL)) errs.PWA_URL = 'Harus diawali https:/\/';
    if (vals.LOGO_URL && !/^https:\x2F\x2F.+/i.test(vals.LOGO_URL)) errs.LOGO_URL = 'Harus diawali https:/\/';
    if (showErrs(f, errs)) return;
    const btn = f.querySelector('.btn-primary'); btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Menyimpan…';
    try {
      this.cfg = await API.call('config.simpan', { pairs: vals });
      Object.assign(S.cfg, { appName: vals.APP_NAME, instansi: vals.INSTANSI, wa: vals.WA_BANTUAN, pendingAmbang: +vals.PENDING_AMBANG_HARI || 3, idleMenit: +vals.SESSION_IDLE_MENIT || 60, pwaUrl: vals.PWA_URL, logoUrl: vals.LOGO_URL });
      bindConfig(); renderNav(); Idle.start();
      toast('ok', 'Pengaturan disimpan');
    } catch (e) { errToast(e, 'Gagal menyimpan'); }
    finally { btn.disabled = false; btn.innerHTML = ic('save', 's18') + 'Simpan Pengaturan'; }
  },

  async notifikasi() {
    const box = $('[data-ps-body]');
    if (!this.nc) {
      box.innerHTML = `<div class="grid"><div class="g-8"><div class="card">${skelRows(7, 44)}</div></div><div class="g-4"><div class="card">${skelRows(4, 40)}</div></div></div>`;
      try { this.nc = await API.call('notif.config', {}, { retry: 1 }); } catch (e) { box.innerHTML = `<div class="card">${emptyBox('Pengaturan notifikasi gagal dimuat', e.message, 'error')}</div>`; return; }
      if (S.route !== 'pengaturan' || this.tab !== 'notifikasi') return;
    }
    const c = this.nc, st = c.stat || {};
    box.innerHTML = `<div class="grid"><div class="g-8"><form class="card" data-submit="ntSimpan" novalidate>
      <div class="card-h"><div class="card-t"><span class="card-ic">${ic('notifications_active', 's18')}</span>Saluran & Kejadian Notifikasi</div></div>
      <div class="banner info mb-16">${ic('bolt')}<div><b>Tanpa menunggu</b><p>Email & WhatsApp tidak dikirim saat tombol diklik, melainkan masuk <span style="font-weight:700">antrean</span> lalu dikirim server otomatis setiap ±1 menit — aplikasi tetap responsif.</p></div></div>
      <div class="fgrid">
        <div class="field"><label>Email (MailApp akun pemilik)</label><label class="check"><input type="checkbox" name="emailAktif" ${c.emailAktif ? 'checked' : ''}>Kirim notifikasi email</label><div class="fhint">Sisa kuota hari ini: ${c.kuotaEmail === null || c.kuotaEmail === undefined ? '—' : fmtNum(c.kuotaEmail)} email</div></div>
        <div class="field"><label>WhatsApp (Fonnte)</label><label class="check"><input type="checkbox" name="waAktif" ${c.waSaklar ? 'checked' : ''}>Kirim notifikasi WhatsApp</label><div class="fhint">${c.token.ada ? 'Token tersimpan: <span class="mono">' + esc(c.token.samar) + '</span>' : '<b style="color:var(--warning-fg)">Token Fonnte belum diisi</b> — isi di panel kanan.'}</div></div>
        <div class="field" data-f="waSuper"><label for="nt-super">Nomor WA Superadmin</label><input class="input" type="tel" id="nt-super" name="waSuper" value="${esc(c.waSuper)}" placeholder="0812…, 0813…" autocomplete="off"><div class="ferr" hidden></div><div class="fhint">Penerima WA "pengajuan baru". Pisahkan dengan koma.</div></div>
        <div class="field" data-f="jeda"><label for="nt-jeda">Jeda acak antarpesan WA (detik)</label><input class="input" id="nt-jeda" name="jeda" value="${esc(c.jeda)}" placeholder="3-8" autocomplete="off"><div class="ferr" hidden></div><div class="fhint">Format min-maks (mis. 3-8) — mencegah nomor diblokir.</div></div>
      </div>
      <div class="sub-h"><b>Matriks kejadian</b><span class="faint" style="font-size:12px">Saklar per kejadian berlaku bila saluran utama aktif.</span></div>
      <div class="tbl-wrap"><table class="tbl compact"><thead><tr><th>Kejadian</th><th>Penerima</th><th class="t-center">WA</th><th class="t-center">Email</th><th class="c-act">Pesan WA</th></tr></thead><tbody>
        ${c.events.map((e, i) => `<tr data-ev="${esc(e.kode)}"><td><b style="font-weight:600">${esc(e.label)}</b>${e.pesan !== e.bawaan ? ' <span class="chip">disesuaikan</span>' : ''}</td><td class="muted" style="font-size:12.5px">${esc(e.ke)}</td><td class="t-center"><input type="checkbox" class="cbx" data-k="wa" ${e.wa ? 'checked' : ''} aria-label="WhatsApp: ${esc(e.label)}"></td><td class="t-center"><input type="checkbox" class="cbx" data-k="email" ${e.email ? 'checked' : ''} aria-label="Email: ${esc(e.label)}"></td><td class="c-act"><button type="button" class="btn btn-ghost btn-sm" data-act="ntPesan" data-i="${i}">${ic('edit', 's16')}Ubah</button></td></tr>`).join('')}
      </tbody></table></div>
      <div class="row between wrap mt-20" style="border-top:1px solid var(--border);padding-top:16px;gap:10px"><span class="faint" style="font-size:12px">${ic('history', 's14')} Perubahan tercatat di audit log.</span><button class="btn btn-primary">${ic('save', 's18')}Simpan Notifikasi</button></div>
    </form></div>
    <div class="g-4"><div class="stack">
      <form class="card" data-submit="ntToken" novalidate autocomplete="off"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('key', 's18')}</span>Token Fonnte</div></div>
        <p class="muted" style="font-size:12.5px">Disimpan di <b>Script Properties</b> server (tidak di spreadsheet & tidak dikirim ke browser). ${c.token.ada ? 'Token aktif: <span class="mono">' + esc(c.token.samar) + '</span>' : 'Belum ada token.'}</p>
        <div class="pw-wrap mt-12"><input class="input mono" type="password" name="token" id="nt-token" placeholder="${c.token.ada ? 'Tempel token baru (kosong = tidak diubah)' : 'Tempel token dari fonnte.com'}" autocomplete="new-password" spellcheck="false"></div>
        <div class="row wrap mt-12" style="gap:8px"><button class="btn btn-primary btn-sm">${ic('save', 's16')}Simpan Token</button>${c.token.ada ? `<button type="button" class="btn btn-danger-o btn-sm" data-act="ntHapusToken">${ic('delete', 's16')}Hapus</button>` : ''}</div>
        <p class="faint mt-12" style="font-size:11.5px">Cara memperoleh: daftar di fonnte.com → <b>Device</b> → tambah & hubungkan nomor WhatsApp (scan QR) → salin <b>Token</b>.</p></form>
      <div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('send', 's18')}</span>Uji Kirim</div></div>
        <label class="flabel" for="nt-tes">Nomor WhatsApp tujuan</label><div class="row mt-4" style="gap:8px"><input class="input grow" type="tel" id="nt-tes" placeholder="08…" inputmode="tel" autocomplete="off"><button class="btn btn-outline" data-act="ntTesWa" ${c.token.ada ? '' : 'disabled'}>${ic('chat', 's18')}Tes WA</button></div>
        <button class="btn btn-outline btn-block mt-12" style="justify-content:flex-start" data-act="psEmail">${ic('forward_to_inbox', 's18')}Kirim email uji ke Superadmin</button>
        <p class="faint mt-8" style="font-size:11.5px">Uji kirim dikirim langsung (tanpa antrean) agar hasilnya terlihat seketika.</p></div>
      <div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('queue', 's18')}</span>Antrean Pesan</div></div>
        <div class="kv"><div><dt>Menunggu</dt><dd>${fmtNum(st.Antri)}</dd></div><div><dt>Terkirim</dt><dd style="color:var(--success)">${fmtNum(st.Terkirim)}</dd></div><div><dt>Gagal</dt><dd style="color:var(--danger)">${fmtNum(st.Gagal)}</dd></div><div><dt>Dibatalkan</dt><dd>${fmtNum(st.Batal)}</dd></div></div>
        <div class="row wrap mt-12" style="gap:8px"><button class="btn btn-soft btn-sm" data-act="ntProses">${ic('play_arrow', 's16')}Proses sekarang</button><button class="btn btn-ghost btn-sm" data-act="nav" data-r="crm" data-tab="antrean">${ic('list', 's16')}Lihat antrean</button></div></div>
    </div></div></div>`;
  },
  ntBaca(f) {
    const c = this.nc;
    $$('tr[data-ev]', f).forEach((tr) => { const e = c.events.find((x) => x.kode === tr.dataset.ev); if (e) { e.wa = tr.querySelector('[data-k=wa]').checked; e.email = tr.querySelector('[data-k=email]').checked; } });

    Object.assign(c, { emailAktif: f.emailAktif.checked, waSaklar: f.waAktif.checked, waSuper: f.waSuper.value.trim(), jeda: f.jeda.value.trim() });
    return { emailAktif: c.emailAktif, waAktif: c.waSaklar, waSuper: c.waSuper, jeda: c.jeda, events: c.events.map((e) => ({ kode: e.kode, wa: e.wa, email: e.email, pesan: e.pesan })) };
  },
  async ntSimpan(f) {
    const p = this.ntBaca(f), errs = {};
    if (!/^\d{1,2}\s*-\s*\d{1,2}$/.test(p.jeda)) errs.jeda = 'Gunakan format min-maks, mis. 3-8.';
    const salah = p.waSuper.split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean).filter((x) => !/^(\+?62|0)8\d{7,12}$/.test(x.replace(/[\s.-]/g, '')));
    if (salah.length) errs.waSuper = 'Nomor tidak valid: ' + salah.join(', ');
    if (showErrs(f, errs)) return;
    if (p.waAktif && !this.nc.token.ada) toast('warn', 'Token Fonnte belum diisi', 'Saklar WA disimpan, namun WhatsApp baru terkirim setelah token diisi.');
    const btn = f.querySelector('.btn-primary'); btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Menyimpan…';
    try { this.nc = await API.call('notif.simpan', p); toast('ok', 'Pengaturan notifikasi disimpan'); if (S.route === 'pengaturan' && this.tab === 'notifikasi') this.notifikasi(); }
    catch (e) { errToast(e, 'Gagal menyimpan'); btn.disabled = false; btn.innerHTML = ic('save', 's18') + 'Simpan Notifikasi'; }
  },
  ntPesan(i) {
    const e = this.nc.events[i]; if (!e) return;
    const contoh = { nama: 'Bapak/Ibu Pegawai', aplikasi: S.cfg.appName || BRAND.nama, instansi: S.cfg.instansi || BOOT.instansi, link: S.cfg.pwaUrl || location.origin + location.pathname, jenis: 'Pangkat/Golongan', status: 'DISETUJUI', ringkasan: 'III/d → IV/a', pegawai: 'Nama Pegawai', nip: '198001012005011001', unit: 'Puskesmas Amurang', pengaju: 'Operator Unit', anak: 'Nama Anak', tgl21: '2027-01-15', berlaku: '2027-01-31', semester: 'Ganjil 2026/2027', alasan: '', catatan: '' };
    const pratinjau = (t) => esc(String(t).replace(/\{(\w+)\}/g, (m, k) => (contoh[k] !== undefined ? contoh[k] : m))).replace(/\*([^*\n]+)\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    const m = Modal.open({ title: `${ic('chat')} Pesan WA — ${esc(e.label)}`, size: 'lg', foot: `<button class="btn btn-ghost" data-reset>Kembalikan bawaan</button><button class="btn btn-outline" data-x2>Batal</button><button class="btn btn-primary" data-ok>Terapkan</button>`, body: `
      <label class="flabel" for="nt-tpl">Template pesan</label><textarea class="textarea mono mt-4" id="nt-tpl" rows="8" maxlength="1000" style="font-size:13px">${esc(e.pesan)}</textarea>
      <div class="row wrap mt-8" style="gap:6px">${e.vars.map((v) => `<button type="button" class="chip" data-var="${v}">{${v}}</button>`).join('')}</div>
      <p class="faint mt-8" style="font-size:11.5px">Klik variabel untuk menyisipkan. Teks di antara *bintang* menjadi tebal di WhatsApp.</p>
      <div class="sub-h"><b>Pratinjau</b></div><div class="wa-bubble" data-prev>${pratinjau(e.pesan)}</div>` });
    const ta = m.el.querySelector('#nt-tpl'), prev = m.el.querySelector('[data-prev]');
    ta.addEventListener('input', () => { prev.innerHTML = pratinjau(ta.value); });
    m.el.querySelectorAll('[data-var]').forEach((b) => { b.onclick = () => { const v = '{' + b.dataset.var + '}', p0 = ta.selectionStart || ta.value.length; ta.value = ta.value.slice(0, p0) + v + ta.value.slice(ta.selectionEnd || p0); ta.focus(); ta.selectionStart = ta.selectionEnd = p0 + v.length; prev.innerHTML = pratinjau(ta.value); }; });
    m.el.querySelector('[data-reset]').onclick = () => { ta.value = e.bawaan; prev.innerHTML = pratinjau(ta.value); };
    m.el.querySelector('[data-x2]').onclick = m.close;
    m.el.querySelector('[data-ok]').onclick = () => {
      const v = ta.value.trim(); if (v.length < 5) return toast('warn', 'Pesan terlalu pendek');
      const f = $('form[data-submit="ntSimpan"]'); if (f) this.ntBaca(f);
      e.pesan = v; m.close(); this.notifikasi(); toast('info', 'Template diterapkan', 'Klik "Simpan Notifikasi" untuk menyimpan ke server.');
    };
  },
  async ntToken(f) {
    const v = f.token.value.trim(); if (!v) return toast('warn', 'Token kosong', 'Tempel token dari dashboard Fonnte.');
    const btn = f.querySelector('.btn-primary'); btn.disabled = true;
    const fs = $('form[data-submit="ntSimpan"]'); if (fs) this.ntBaca(fs);
    try { const r = await API.call('rahasia.simpan', { kunci: 'FONNTE_TOKEN', nilai: v }); f.token.value = ''; this.rh = r; this.nc.token = { ada: r.FONNTE_TOKEN.ada, samar: r.FONNTE_TOKEN.samar }; toast('ok', 'Token Fonnte disimpan', 'Tersimpan aman di Script Properties: ' + r.FONNTE_TOKEN.samar); this.notifikasi(); }
    catch (e) { errToast(e, 'Token gagal disimpan'); btn.disabled = false; }
  },
  migrasi() {
    const m = this.mig || {};
    $('[data-ps-body]').innerHTML = `<div class="grid"><div class="g-8"><div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('move_down', 's18')}</span>Migrasi dari Spreadsheet Lama</div></div>
      <div class="banner info mb-16">${ic('shield')}<div><b>Aman & dapat diulang</b><p>Spreadsheet lama hanya <b>dibaca</b>. Kolom dicocokkan berdasarkan nama header; data dengan kunci sama diperbarui (upsert), tidak diduplikasi. Kredensial akun & keputusan pengajuan tidak ditimpa.</p></div></div>
      <form class="row wrap" data-submit="migPindai" style="gap:10px"><div class="grow" style="min-width:260px"><label class="flabel" for="mg-src">ID atau URL spreadsheet lama</label><input class="input mono mt-4" id="mg-src" name="src" value="${esc(m.src || '')}" placeholder="https:/\/docs.google.com/spreadsheets/d/…" autocomplete="off"></div><button class="btn btn-primary" style="align-self:flex-end">${ic('search', 's18')}Pindai (Dry-run)</button></form>
      <div class="mt-16" data-mig-res>${m.res ? '' : emptyBox('Belum dipindai', 'Hasil pindai menampilkan jumlah baris yang akan ditambah/diperbarui per sheet, tanpa mengubah data.', 'manage_search')}</div></div></div>
      <div class="g-4"><div class="card flat"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('route', 's18')}</span>Langkah Aman</div></div><ol class="stack-8" style="margin:0;padding-left:18px;font-size:12.5px;color:var(--text-2)"><li>Pastikan spreadsheet lama memakai nama sheet & header yang sama dengan versi ini.</li><li>Jalankan <b>Pindai</b> — tidak ada data yang berubah.</li><li>Periksa ringkasan, lalu <b>Jalankan Migrasi</b> (per sheet, berurutan).</li><li>Sebelum cutover, ulangi pindai & jalankan untuk delta-sync perubahan terakhir.</li><li>Kelengkapan data dihitung ulang otomatis.</li></ol></div>
      <form class="card mt-16" data-submit="migPepper" novalidate autocomplete="off"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('key', 's18')}</span>Sandi Akun Lama</div></div>
        <p class="muted" style="font-size:12.5px">Agar pegawai & admin tetap login dengan <b>password lamanya</b>, salin nilai <span class="mono">PEPPER</span> dari Script Properties proyek Apps Script <b>lama</b> lalu tempel di sini.</p>
        <div class="mt-8" data-pepper-st>${this.rh ? (this.rh.PEPPER_LAMA.ada ? `<span class="badge b-ok">${ic('check')}PEPPER_LAMA terpasang</span>` : '<span class="badge b-warn">Belum dipasang</span>') : ''}</div>
        <input class="input mono mt-8" type="password" name="pepper" placeholder="Tempel nilai PEPPER proyek lama" autocomplete="new-password" spellcheck="false">
        <button class="btn btn-primary btn-sm mt-12">${ic('save', 's16')}Simpan PEPPER_LAMA</button>
        <p class="faint mt-8" style="font-size:11.5px">Tanpa ini, akun hasil migrasi perlu di-reset password-nya oleh Superadmin. Password otomatis dinaikkan ke hash baru saat pemiliknya login.</p></form></div></div>`;
    if (!this.rh) API.call('rahasia.status', {}).then((r) => { this.rh = r; const b = $('[data-pepper-st]'); if (b) b.innerHTML = r.PEPPER_LAMA.ada ? `<span class="badge b-ok">${ic('check')}PEPPER_LAMA terpasang</span>` : '<span class="badge b-warn">Belum dipasang</span>'; }).catch(() => { });
    if (m.res) this.migRender();
  },
  migRender() {
    const m = this.mig, box = $('[data-mig-res]'); if (!box || !m || !m.res) return;
    const rows = m.res.hasil, adaKerja = rows.some((r) => r.ada && (r.ditambah || r.diperbarui) && !(m.done || {})[r.sheet]);
    box.innerHTML = `<div class="row between wrap mb-12" style="gap:10px"><div><b>Sumber: ${esc(m.res.sumber)}</b><div class="muted" style="font-size:12px">Dipindai ${fmtWaktu(m.at)}</div></div><button class="btn btn-primary" data-act="migJalan" ${!adaKerja || m.running ? 'disabled' : ''}>${m.running ? '<span class="spin"></span>Menjalankan…' : ic('play_arrow', 's18') + 'Jalankan Migrasi'}</button></div>
      <div class="tbl-wrap"><table class="tbl compact"><thead><tr><th>Sheet</th><th class="t-right">Baris Sumber</th><th class="t-right">Ditambah</th><th class="t-right">Diperbarui</th><th class="t-right">Dilewati</th><th>Status</th></tr></thead><tbody>${rows.map((r) => { const d = (m.done || {})[r.sheet], x = d || r; return `<tr><td><b style="font-weight:600">${esc(MIG_LABEL[r.sheet] || r.sheet)}</b><div class="faint" style="font-size:11px">${esc(r.nama)}</div></td>${r.ada ? `<td class="t-right">${fmtNum(r.baris)}</td><td class="t-right" style="color:var(--success);font-weight:700">${fmtNum(x.ditambah)}</td><td class="t-right" style="color:var(--primary-text);font-weight:700">${fmtNum(x.diperbarui)}</td><td class="t-right faint">${fmtNum(x.dilewati)}</td><td>${d ? (d.error ? `<span class="badge b-bad" data-tip="Gagal|${esc(d.error)}" tabindex="0">${ic('error')}Gagal</span>` : `<span class="badge b-ok">${ic('check')}Selesai</span>`) : (m.cur === r.sheet ? '<span class="badge b-pri"><span class="spin" style="width:10px;height:10px"></span>Proses</span>' : (r.ditambah || r.diperbarui) ? '<span class="badge b-warn">Siap</span>' : '<span class="badge b-mut">Tidak ada perubahan</span>')}</td>` : `<td colspan="5"><span class="faint">Sheet tidak ditemukan di sumber — dilewati</span></td>`}</tr>`; }).join('')}</tbody></table></div>`;
  },
  async pindai(src) {
    src = String(src || '').trim(); if (!src) return toast('warn', 'Sumber kosong', 'Masukkan ID atau URL spreadsheet lama.');
    this.mig = { src, loading: true };
    const box = $('[data-mig-res]'); if (box) box.innerHTML = `<div class="row mb-12"><span class="spin"></span><b>Memindai spreadsheet sumber…</b></div>${skelRows(5, 36)}`;
    try { this.mig.res = await API.call('migrasi.pindai', { sumber: src }); this.mig.at = nowIsoLocal(); this.mig.done = {}; }
    catch (e) { this.mig = { src }; if (box) box.innerHTML = emptyBox('Pindai gagal', e.message, 'error'); return; }
    if (S.route === 'pengaturan' && this.tab === 'migrasi') this.migRender();
  },
  async jalankan() {
    const m = this.mig; if (!m || !m.res) return;
    const ok = await Modal.confirm({ title: 'Jalankan migrasi?', icon: 'move_down', msg: 'Data dari spreadsheet lama akan ditambahkan/diperbarui ke database aplikasi per sheet secara berurutan. Spreadsheet lama tidak diubah. Proses dapat diulang dengan aman.', ok: 'Jalankan' });
    if (!ok) return;
    m.running = true; this.migRender();
    for (const r of m.res.hasil) {
      if (!r.ada || !(r.ditambah || r.diperbarui) || (m.done[r.sheet] && !m.done[r.sheet].error)) continue;
      m.cur = r.sheet; this.migRender();
      try { m.done[r.sheet] = await API.call('migrasi.jalankan', { sumber: m.src, sheet: r.sheet }); }
      catch (e) { m.done[r.sheet] = { error: e.message, ditambah: 0, diperbarui: 0, dilewati: 0 }; }
    }
    m.running = false; m.cur = null; this.migRender();
    const gagal = Object.keys(m.done).filter((k) => m.done[k].error).length;
    toast(gagal ? 'warn' : 'ok', gagal ? `Migrasi selesai dengan ${gagal} sheet gagal` : 'Migrasi selesai', gagal ? 'Periksa status per sheet lalu jalankan ulang.' : 'Data aplikasi dimuat ulang.');
    refreshBoot(true); invalidateDash();
  }
};
SUBMIT.psSimpan = (f) => PAGES.pengaturan.simpan(f);
SUBMIT.ntSimpan = (f) => PAGES.pengaturan.ntSimpan(f);
SUBMIT.ntToken = (f) => PAGES.pengaturan.ntToken(f);
SUBMIT.migPepper = (f) => { const v = f.pepper.value.trim(); if (!v) return toast('warn', 'Nilai kosong', 'Tempel nilai PEPPER dari proyek lama.'); Sync.run('Menyimpan…', API.call('rahasia.simpan', { kunci: 'PEPPER_LAMA', nilai: v })).then((r) => { PAGES.pengaturan.rh = r; f.pepper.value = ''; const b = $('[data-pepper-st]'); if (b) b.innerHTML = `<span class="badge b-ok">${ic('check')}PEPPER_LAMA terpasang</span>`; toast('ok', 'PEPPER_LAMA disimpan', 'Akun lama kini dapat login dengan password lamanya.'); }).catch((e) => errToast(e, 'Gagal menyimpan')); };
ACT.ntPesan = (el) => PAGES.pengaturan.ntPesan(+el.dataset.i);
ACT.ntHapusToken = () => Modal.confirm({ title: 'Hapus token Fonnte?', icon: 'delete', msg: 'Notifikasi & blast WhatsApp berhenti sampai token baru diisi.', ok: 'Hapus', danger: true }).then((ok) => { if (!ok) return; Sync.run('Menghapus…', API.call('rahasia.simpan', { kunci: 'FONNTE_TOKEN', nilai: '__HAPUS__' })).then((r) => { PAGES.pengaturan.rh = r; PAGES.pengaturan.nc.token = { ada: false, samar: '' }; PAGES.pengaturan.notifikasi(); toast('ok', 'Token dihapus'); }).catch((e) => errToast(e)); });
ACT.ntTesWa = (el) => { const no = ($('#nt-tes') || {}).value || ''; if (!/^(\+?62|0)8\d{7,12}$/.test(no.replace(/[\s.-]/g, ''))) return toast('warn', 'Nomor tidak valid', 'Gunakan format 08… atau 62…'); el.disabled = true; Sync.run('Mengirim WA uji…', API.call('notif.tesWA', { nomor: no })).then((r) => toast(r.terkirim ? 'ok' : 'warn', r.terkirim ? 'WA uji terkirim ke ' + r.nomor : 'WA uji gagal', r.detail, { ms: 8000 })).catch((e) => errToast(e)).finally(() => { el.disabled = false; }); };
ACT.ntProses = (el) => { el.disabled = true; Sync.run('Memproses antrean…', API.call('antrian.proses', {})).then((r) => { const h = r.hasil || {}; toast('ok', 'Antrean diproses', `Email: ${h.email || 0} · WA: ${h.wa || 0} · gagal: ${h.gagal || 0} · sisa: ${h.sisa || 0}`, { ms: 7000 }); if (PAGES.pengaturan.nc) PAGES.pengaturan.nc.stat = r.stat; if (S.route === 'pengaturan') PAGES.pengaturan.notifikasi(); if (S.route === 'crm') { PAGES.crm.aq = { stat: r.stat, rows: r.rows }; PAGES.crm.bl = null; if (PAGES.crm.tab === 'antrean') PAGES.crm.antrean(); } }).catch((e) => errToast(e)).finally(() => { el.disabled = false; }); };
ACT.psTrigger = (el) => { el.disabled = true; Sync.run('Memasang trigger…', API.call('sistem.trigger', {})).then((r) => { PAGES.pengaturan.rh = r; const b = $('[data-rh-box]'); if (b) b.innerHTML = b.querySelector('.card-h').outerHTML + PAGES.pengaturan.rhHtml(); toast('ok', 'Trigger diperiksa & dipasang'); }).catch((e) => errToast(e)).finally(() => { el.disabled = false; }); };
SUBMIT.migPindai = (f) => PAGES.pengaturan.pindai(f.src.value);
ACT.migJalan = () => PAGES.pengaturan.jalankan();
ACT.psAlert = (el) => { el.disabled = true; Sync.run('Memeriksa…', API.call('sistem.cekAlert', {})).then((r) => { toast('ok', 'Pemeriksaan selesai', `H-90: ${r.h90} · H-30: ${r.h30} · dinonaktifkan: ${r.nonaktif} · email: ${r.email}`, { ms: 8000 }); invalidateDash(); }).catch((e) => errToast(e)).finally(() => { el.disabled = false; }); };
ACT.psEmail = (el) => { el.disabled = true; Sync.run('Mengirim…', API.call('sistem.tesEmail', {})).then((r) => toast(r.terkirim ? 'ok' : 'warn', r.terkirim ? 'Email uji terkirim' : 'Email tidak terkirim', r.terkirim ? 'Periksa kotak masuk: ' + (r.ke || []).join(', ') : (r.status === 'kuota' ? 'Kuota email harian habis.' : r.status === 'tanpa-penerima' ? 'Email Superadmin belum diisi.' : String(r.status || '')))).catch((e) => errToast(e)).finally(() => { el.disabled = false; }); };

ACT.copy = (el) => { const v = el.dataset.v; const done = () => { el.textContent = 'Tersalin'; }; const manual = () => toast('info', 'Salin manual', v, { ms: 12000 }); try { navigator.clipboard.writeText(v).then(done, manual); } catch (e) { manual(); } };

const CRM_COLS_IDX = (cols) => { const o = {}; cols.forEach((c, i) => { o[c] = i; }); return o; };
function crmObj(cols, r) { const i = CRM_COLS_IDX(cols), o = {}; cols.forEach((c) => { o[c] = r[i[c]]; }); let info = {}; try { info = JSON.parse(o.Info || '{}'); } catch (e) { } o.info = info; o.OptOut = !!+o.OptOut; o.Duplikat = !!+o.Duplikat; o.tags = String(o.Tag || '').split(',').map((x) => x.trim()).filter(Boolean); return o; }
const waBadge = (s) => s === 'Terdaftar' ? `<span class="badge b-ok">${ic('check_circle')}WA aktif</span>` : s === 'Tidak Terdaftar' ? `<span class="badge b-bad">${ic('cancel')}Bukan WA</span>` : `<span class="badge b-mut">${ic('help')}Belum dicek</span>`;
const ST_ANTRIAN = { Antri: ['b-warn', 'schedule'], Terkirim: ['b-ok', 'check_circle'], Gagal: ['b-bad', 'error'], Batal: ['b-mut', 'block'], Berjalan: ['b-pri', 'sync'], Selesai: ['b-ok', 'check_circle'], Dihentikan: ['b-mut', 'stop_circle'] };
const stBadge = (s) => { const x = ST_ANTRIAN[s] || ['b-mut', 'info']; return `<span class="badge ${x[0]}">${ic(x[1])}${esc(s || '-')}</span>`; };
const CRM_IC = { kontak: 'contacts', blast: 'campaign', antrean: 'queue' };

PAGES.crm = {
  tab: 'kontak', d: null, f: { q: '', segmen: '', wa: '', opt: '', tag: '' }, page: 1, size: 25,
  bl: null, aq: null, af: { status: '', kanal: '' }, draft: null, hit: null, blT: null,
  show(p) {
    p = p || {};
    this.tab = p.tab || 'kontak';
    clearTimeout(this.blT);
    $('#pg-crm').innerHTML = pageHead(['Administrasi', 'CRM & Blast WA'], 'CRM & Blast WhatsApp', 'Kontak pegawai & admin dari data aplikasi, pesan massal ber-batch anti-blokir, dan pemantauan antrean email/WhatsApp.')
      + `<div class="tabs mb-16">${ROUTES.crm.sub.map((s) => `<button class="tab ${s[0] === this.tab ? 'on' : ''}" data-act="nav" data-r="crm" data-tab="${s[0]}">${ic(CRM_IC[s[0]], 's16')}${s[1]}</button>`).join('')}</div><div data-crm-body></div>`;
    this.done = true;
    if (this.tab === 'blast') this.blast(); else if (this.tab === 'antrean') this.antrean(); else this.kontak();
  },
  async muat(force) {
    if (this.d && !force) return this.d;
    const r = await API.call('crm.list', {}, { retry: 1 });
    this.terima(r); return this.d;
  },
  terima(r) { this.d = { rows: r.rows.map((x) => crmObj(r.cols, x)), waAktif: r.waAktif, tokenAda: r.tokenAda }; },

  async kontak() {
    const box = $('[data-crm-body]');
    if (!this.d) {
      box.innerHTML = `<div class="card">${skelRows(8, 44)}</div>`;
      try { await this.muat(); } catch (e) { box.innerHTML = `<div class="card">${emptyBox('Kontak gagal dimuat', e.message, 'error')}</div>`; return; }
      if (S.route !== 'crm' || this.tab !== 'kontak') return;
    }
    const rows = this.d.rows, segs = [...new Set(rows.map((k) => k.Segmen).filter(Boolean))].sort(), tags = [...new Set([].concat(...rows.map((k) => k.tags)))].sort();
    const n = (fn) => rows.filter(fn).length, f = this.f;
    box.innerHTML = `${!this.d.tokenAda ? `<div class="banner warn mb-16">${ic('key')}<div><b>Token Fonnte belum diisi</b><p>Cek nomor WA & blast memerlukan token. Isi di <button class="link-btn" data-act="nav" data-r="pengaturan" data-tab="notifikasi">Pengaturan → Notifikasi WA & Email</button>.</p></div></div>` : ''}
      <div class="card"><div class="kv c3">
        <div><dt>Total kontak</dt><dd>${fmtNum(rows.length)}</dd></div><div><dt>WhatsApp aktif</dt><dd style="color:var(--success)">${fmtNum(n((k) => k.StatusWA === 'Terdaftar'))}</dd></div><div><dt>Bukan WhatsApp</dt><dd style="color:var(--danger)">${fmtNum(n((k) => k.StatusWA === 'Tidak Terdaftar'))}</dd></div>
        <div><dt>Belum dicek / tanpa nomor</dt><dd>${fmtNum(n((k) => k.NoWA && !k.StatusWA))} / ${fmtNum(n((k) => !k.NoWA))}</dd></div><div><dt>Opt-out (tidak menerima blast)</dt><dd>${fmtNum(n((k) => k.OptOut))}</dd></div><div><dt>Nomor ganda</dt><dd style="color:var(--warning-fg)">${fmtNum(n((k) => k.Duplikat))}</dd></div></div></div>
      <div class="card mt-16"><div class="filter">
        <div class="field" style="grid-column:span 4"><label for="ck-q">Cari nama, NIP, nomor, email</label><div class="input-ic">${ic('search')}<input class="input" id="ck-q" value="${esc(f.q)}" data-input="ckLive" data-k="q" placeholder="Ketik untuk mencari…" autocomplete="off"></div></div>
        <div class="field" style="grid-column:span 2"><label for="ck-s">Segmen</label><select class="select" id="ck-s" data-change="ckLive" data-k="segmen">${optList(segs, f.segmen, 'Semua segmen')}</select></div>
        <div class="field" style="grid-column:span 2"><label for="ck-w">Status WA</label><select class="select" id="ck-w" data-change="ckLive" data-k="wa">${optList(['Terdaftar', 'Tidak Terdaftar', 'Belum dicek', 'Tanpa nomor', 'Nomor ganda'], f.wa, 'Semua')}</select></div>
        <div class="field" style="grid-column:span 2"><label for="ck-o">Opt-out</label><select class="select" id="ck-o" data-change="ckLive" data-k="opt">${optList(['Menerima blast', 'Opt-out'], f.opt, 'Semua')}</select></div>
        <div class="field" style="grid-column:span 2"><label for="ck-t">Tag</label><select class="select" id="ck-t" data-change="ckLive" data-k="tag">${optList(tags, f.tag, 'Semua tag')}</select></div>
        <div class="fa"><span class="info" data-ck-info></span><div class="row wrap" style="gap:8px">
          <button class="btn btn-outline btn-sm" data-act="ckSync">${ic('sync', 's16')}Sinkronkan data pegawai</button>
          <button class="btn btn-outline btn-sm" data-act="ckValidasi" ${this.d.tokenAda ? '' : 'disabled'}>${ic('verified', 's16')}Cek nomor WA</button>
          <button class="btn btn-primary btn-sm" data-act="ckTambah">${ic('person_add', 's16')}Tambah kontak</button></div></div></div></div>
      <div class="card mt-16" data-ck-list></div>`;
    this.renderList();
  },
  filtered() {
    const f = this.f, q = String(f.q || '').toLowerCase().trim(), qd = digits(f.q);
    return this.d.rows.filter((k) => {
      if (q && !(String(k.Nama).toLowerCase().indexOf(q) >= 0 || String(k.Email).toLowerCase().indexOf(q) >= 0 || (qd.length >= 3 && (digits(k.NoWA).indexOf(qd) >= 0 || String(k.RefID).indexOf(qd) >= 0)))) return false;
      if (f.segmen && k.Segmen !== f.segmen) return false;
      if (f.wa === 'Terdaftar' && k.StatusWA !== 'Terdaftar') return false;
      if (f.wa === 'Tidak Terdaftar' && k.StatusWA !== 'Tidak Terdaftar') return false;
      if (f.wa === 'Belum dicek' && !(k.NoWA && !k.StatusWA)) return false;
      if (f.wa === 'Tanpa nomor' && k.NoWA) return false;
      if (f.wa === 'Nomor ganda' && !k.Duplikat) return false;
      if (f.opt === 'Opt-out' && !k.OptOut) return false;
      if (f.opt === 'Menerima blast' && k.OptOut) return false;
      if (f.tag && k.tags.indexOf(f.tag) < 0) return false;
      return true;
    }).sort((a, b) => String(a.Nama).localeCompare(String(b.Nama)));
  },
  renderList() {
    const box = $('[data-ck-list]'); if (!box) return;
    const all = this.filtered(), pages = Math.max(1, Math.ceil(all.length / this.size)); this.page = Math.min(this.page, pages);
    const rows = all.slice((this.page - 1) * this.size, this.page * this.size);
    const inf = $('[data-ck-info]'); if (inf) inf.innerHTML = `${ic('contacts', 's16')} <b>${fmtNum(all.length)}</b>&nbsp;kontak`;
    if (!rows.length) { box.innerHTML = emptyBox('Tidak ada kontak', this.d.rows.length ? 'Tidak ada kontak yang cocok dengan filter.' : 'Klik "Sinkronkan data pegawai" untuk mengisi kontak dari Data Diri & Akun.', 'contacts'); return; }
    box.innerHTML = `<div class="tbl-wrap responsive"><table class="tbl"><thead><tr><th>Kontak</th><th>WhatsApp</th><th>Email</th><th>Tag</th><th class="t-right">Pesan</th><th class="c-act"></th></tr></thead><tbody>${rows.map((k) => `<tr>
      <td><div class="person">${avatar(k.Nama)}<div style="min-width:0"><b>${esc(k.Nama)}</b><small>${esc(k.Segmen || '-')}${k.info.unit ? ' · ' + esc(k.info.unit) : ''}${k.info.status && k.info.status !== 'Aktif' ? ` · <span style="color:var(--warning-fg)">${esc(k.info.status)}</span>` : ''}</small></div></div></td>
      <td>${k.NoWA ? `<div class="mono" style="font-size:12.5px">${esc(k.NoWA)}</div><div class="row mt-4" style="gap:4px">${waBadge(k.StatusWA)}${k.Duplikat ? `<span class="badge b-warn" data-tip="Nomor ganda|Nomor ini dipakai lebih dari satu kontak" tabindex="0">${ic('content_copy')}Ganda</span>` : ''}</div>` : '<span class="faint">—</span>'}</td>
      <td style="font-size:12.5px;word-break:break-all">${k.Email ? esc(k.Email) : '<span class="faint">—</span>'}</td>
      <td>${k.OptOut ? `<span class="badge b-mut">${ic('notifications_off')}Opt-out</span> ` : ''}${k.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join(' ')}</td>
      <td class="t-right"><b>${fmtNum(k.JumlahPesan)}</b><div class="faint" style="font-size:11px">${k.TerakhirDihubungi ? relWaktu(k.TerakhirDihubungi) : ''}</div></td>
      <td class="c-act"><button class="btn btn-ghost btn-sm" data-act="ckBuka" data-id="${esc(k.KontakID)}">${ic('open_in_new', 's16')}Detail</button></td></tr>`).join('')}</tbody></table></div>
      <div class="cards-list">${rows.map((k) => `<div class="li-card"><div class="row between top" style="gap:8px"><div class="row" style="min-width:0">${avatar(k.Nama)}<div style="min-width:0"><b class="truncate" style="display:block">${esc(k.Nama)}</b><small class="muted">${esc(k.Segmen || '-')}${k.info.unit ? ' · ' + esc(k.info.unit) : ''}</small></div></div>${k.OptOut ? `<span class="badge b-mut">${ic('notifications_off')}Opt-out</span>` : ''}</div>
        <div class="row wrap" style="gap:6px">${k.NoWA ? `<span class="mono" style="font-size:12.5px">${esc(k.NoWA)}</span>${waBadge(k.StatusWA)}${k.Duplikat ? `<span class="badge b-warn">${ic('content_copy')}Ganda</span>` : ''}` : '<span class="faint">Tanpa nomor WA</span>'}${k.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        <button class="btn btn-sm btn-outline" data-act="ckBuka" data-id="${esc(k.KontakID)}">${ic('open_in_new', 's16')}Detail · ${fmtNum(k.JumlahPesan)} pesan</button></div>`).join('')}</div>${pager(all.length, this.page, this.size, 'ckPage')}`;
  },
  buka(id) {
    const k = this.d.rows.find((x) => x.KontakID === id); if (!k) return;
    const manual = k.Sumber === 'Manual', dup = k.Duplikat ? this.d.rows.filter((x) => x.KontakID !== k.KontakID && x.NoWA === k.NoWA) : [];
    const dr = Drawer.open({ title: esc(k.Nama), sub: esc((k.Segmen || '') + ' · Sumber: ' + (k.Sumber || '-') + (k.RefID ? ' (' + k.RefID + ')' : '')), body: `
      <dl class="kv"><div><dt>WhatsApp</dt><dd>${k.NoWA ? esc(k.NoWA) + ' ' + waBadge(k.StatusWA) : '—'}</dd></div><div><dt>Email</dt><dd>${esc(k.Email || '—')}</dd></div>
        <div><dt>Unit</dt><dd>${esc(k.info.unit || '—')}</dd></div><div><dt>Pesan terkirim</dt><dd>${fmtNum(k.JumlahPesan)}${k.TerakhirDihubungi ? ' · ' + relWaktu(k.TerakhirDihubungi) : ''}</dd></div></dl>
      <form class="mt-16" data-submit="ckSimpan" data-id="${esc(k.KontakID)}" novalidate>
        ${manual ? formHtml([{ k: 'Nama', l: 'Nama', req: 1, max: 120 }, { k: 'NoWA', l: 'No. WhatsApp', t: 'tel', ph: '08…' }, { k: 'Email', l: 'Email', t: 'email' }, { k: 'Segmen', l: 'Segmen', ph: 'Umum' }], { Nama: k.Nama, NoWA: k.NoWA, Email: k.Email, Segmen: k.Segmen }, 'cd-') : `<p class="faint" style="font-size:12px">${ic('sync', 's14')} Nama, nomor & email mengikuti ${esc(k.Sumber)} (diperbarui saat sinkron). Ubah datanya melalui Daftar Pegawai/Akun.</p>`}
        <div class="field mt-12"><label for="cd-tag">Tag (pisahkan koma)</label><input class="input" id="cd-tag" name="Tag" value="${esc(k.tags.join(', '))}" placeholder="mis. bendahara, prioritas" autocomplete="off"></div>
        <div class="field mt-12"><label for="cd-cat">Catatan</label><textarea class="textarea" id="cd-cat" name="Catatan" maxlength="1000">${esc(k.Catatan || '')}</textarea></div>
        <label class="check mt-8"><input type="checkbox" name="OptOut" ${k.OptOut ? 'checked' : ''}>Opt-out — jangan kirimi pesan blast/broadcast</label>
        <div class="row wrap mt-12" style="gap:8px"><button class="btn btn-primary btn-sm">${ic('save', 's16')}Simpan</button>${manual ? `<button type="button" class="btn btn-danger-o btn-sm" data-act="ckHapus" data-id="${esc(k.KontakID)}">${ic('delete', 's16')}Hapus</button>` : ''}
          ${manual && dup.length ? `<button type="button" class="btn btn-outline btn-sm" data-act="ckGabung" data-id="${esc(k.KontakID)}" data-ke="${esc(dup[0].KontakID)}">${ic('merge', 's16')}Gabung ke ${esc(dup[0].Nama)}</button>` : ''}</div></form>
      <div class="sub-h"><b>Riwayat interaksi</b></div>
      <form class="row wrap" data-submit="ckInteraksi" data-id="${esc(k.KontakID)}" style="gap:8px" novalidate><select class="select" name="kanal" style="width:auto">${optList(['Telepon', 'Kunjungan', 'WA', 'Email', 'Lainnya'], 'Telepon', null).replace(/<option value="">[^<]*<\x2Foption>/, '')}</select><select class="select" name="arah" style="width:auto"><option>Keluar</option><option>Masuk</option></select><input class="input grow" name="ringkasan" placeholder="Ringkasan interaksi…" maxlength="500" style="min-width:160px"><button class="btn btn-soft btn-sm">${ic('add', 's16')}Catat</button></form>
      <div class="mt-12" data-ck-int>${skelRows(3, 40)}</div>` });
    API.call('crm.interaksi', { kontakId: id }).then((list) => { const b = dr.body.querySelector('[data-ck-int]'); if (b) b.innerHTML = this.intHtml(list); }).catch((e) => { const b = dr.body.querySelector('[data-ck-int]'); if (b) b.innerHTML = emptyBox('Gagal memuat', e.message, 'error'); });
  },
  intHtml(list) {
    if (!list.length) return emptyBox('Belum ada interaksi', 'Pesan WA/email yang terkirim & catatan manual akan muncul di sini.', 'forum');
    return `<div class="tl">${list.map((x, i) => `<div class="tl-item ${i ? '' : 'now'}"><div class="tl-card"><div class="row between" style="gap:8px"><b style="font-size:13px">${ic(x.Kanal === 'WA' ? 'chat' : x.Kanal === 'Email' ? 'mail' : x.Kanal === 'Telepon' ? 'call' : 'forum', 's16')} ${esc(x.Kanal)} · ${esc(x.Arah)}</b><time class="faint" style="font-size:11.5px">${fmtWaktu(x.Tanggal)}</time></div><p class="mt-4" style="font-size:12.5px;color:var(--text-2)">${esc(x.Ringkasan)}</p><small class="faint">oleh ${esc(x.Oleh)}</small></div></div>`).join('')}</div>`;
  },
  tambah() {
    const m = Modal.open({ title: `${ic('person_add')} Tambah Kontak Manual`, foot: '<button class="btn btn-outline" data-x2>Batal</button><button class="btn btn-primary" data-ok>Simpan</button>', body: `<form data-ck-baru novalidate>${formHtml([{ k: 'Nama', l: 'Nama', req: 1, max: 120, span: 'full' }, { k: 'NoWA', l: 'No. WhatsApp', t: 'tel', ph: '08…' }, { k: 'Email', l: 'Email', t: 'email' }, { k: 'Segmen', l: 'Segmen', ph: 'Umum' }, { k: 'Tag', l: 'Tag (pisahkan koma)' }], {}, 'cn-')}</form>` });
    m.el.querySelector('[data-x2]').onclick = m.close;
    m.el.querySelector('[data-ok]').onclick = async () => {
      const f = m.el.querySelector('form'), { vals, errs } = readForm(f, [{ k: 'Nama', l: 'Nama', req: 1 }, { k: 'NoWA', l: 'No. WhatsApp' }, { k: 'Email', l: 'Email', re: RE_EMAIL, msg: 'Format email tidak valid.' }, { k: 'Segmen' }, { k: 'Tag' }]);
      if (vals.NoWA && !/^(\+?62|0)8\d{7,12}$/.test(vals.NoWA.replace(/[\s.-]/g, ''))) errs.NoWA = 'Nomor tidak valid (08… / 62…).';
      if (!vals.NoWA && !vals.Email) errs.NoWA = 'Isi nomor WA atau email.';
      if (showErrs(f, errs, true)) return;
      const b = m.el.querySelector('[data-ok]'); b.disabled = true;
      try { const r = await API.call('crm.simpan', vals); this.terima(r); m.close(); toast('ok', 'Kontak ditambahkan', vals.Nama); this.kontak(); }
      catch (e) { b.disabled = false; errToast(e, 'Gagal menyimpan'); }
    };
  },
  async validasi(el) {
    const ok = await Modal.confirm({ title: 'Cek nomor WhatsApp?', icon: 'verified', msg: 'Nomor yang belum pernah dicek (atau dicek > 30 hari lalu) diperiksa ke Fonnte, maksimal 50 nomor per permintaan. Proses berjalan bertahap sampai selesai.', ok: 'Mulai cek' });
    if (!ok) return;
    el.disabled = true; let total = 0;
    try {
      for (let i = 0; i < 20; i++) {
        const r = await Sync.run('Mengecek nomor WA… (' + total + ')', API.call('crm.validasi', { maks: 300 }));
        total += r.diperbarui; this.terima(r);
        if (r.galat) { toast('warn', 'Pengecekan berhenti', r.galat, { ms: 9000 }); break; }
        if (!r.sisa || !r.diperiksa) break;
      }
      toast('ok', 'Cek nomor selesai', fmtNum(total) + ' kontak diperbarui.');
    } catch (e) { errToast(e, 'Cek nomor gagal'); }
    el.disabled = false; if (S.route === 'crm' && this.tab === 'kontak') this.kontak();
  },

  async blast() {
    const box = $('[data-crm-body]');
    if (!this.d || !this.bl) {
      box.innerHTML = `<div class="grid"><div class="g-7"><div class="card">${skelRows(8, 44)}</div></div><div class="g-5"><div class="card">${skelRows(4, 60)}</div></div></div>`;
      try { const [d, bl] = await Promise.all([this.d ? Promise.resolve(this.d) : this.muat(), API.call('blast.list', {})]); this.bl = bl; } catch (e) { box.innerHTML = `<div class="card">${emptyBox('Data blast gagal dimuat', e.message, 'error')}</div>`; return; }
      if (S.route !== 'crm' || this.tab !== 'blast') return;
    }
    const dft = this.draft || (this.draft = { judul: '', pesan: 'Yth. {nama},\n\n\n\n— ' + (S.cfg.appName || BRAND.nama) + ' · ' + (S.cfg.instansi || BOOT.instansi), ukuran: 20, jeda: '3-8', filter: { segmen: '', unit: '', tag: '', hanyaTerdaftar: false, semuaStatus: false } });
    const segs = [...new Set(this.d.rows.map((k) => k.Segmen).filter(Boolean))].sort(), tags = [...new Set([].concat(...this.d.rows.map((k) => k.tags)))].sort(), units = [...new Set(this.d.rows.map((k) => k.info.unit).filter(Boolean))].sort();
    box.innerHTML = `${!this.d.waAktif ? `<div class="banner warn mb-16">${ic('warning')}<div><b>Kanal WhatsApp belum aktif</b><p>Isi token Fonnte & aktifkan saklar WhatsApp di <button class="link-btn" data-act="nav" data-r="pengaturan" data-tab="notifikasi">Pengaturan → Notifikasi WA & Email</button> sebelum mengirim blast.</p></div></div>` : ''}
      <div class="grid"><div class="g-7"><form class="card" data-submit="blKirim" novalidate>
        <div class="card-h"><div class="card-t"><span class="card-ic">${ic('campaign', 's18')}</span>Tulis Pesan Blast</div></div>
        <div class="field" data-f="judul"><label for="bl-j">Judul (internal) <span class="req">*</span></label><input class="input" id="bl-j" name="judul" value="${esc(dft.judul)}" maxlength="120" placeholder="mis. Pengingat pemutakhiran data Desember" data-input="blDraft" autocomplete="off"><div class="ferr" hidden></div></div>
        <div class="field mt-12" data-f="pesan"><label for="bl-p">Isi pesan <span class="req">*</span></label><textarea class="textarea" id="bl-p" name="pesan" rows="7" maxlength="4000" data-input="blDraft">${esc(dft.pesan)}</textarea><div class="ferr" hidden></div>
          <div class="row between wrap mt-4" style="gap:6px"><div class="row wrap" style="gap:6px">${['nama', 'unit', 'nip', 'jabatan', 'link', 'aplikasi', 'instansi'].map((v) => `<button type="button" class="chip" data-act="blVar" data-v="${v}">{${v}}</button>`).join('')}</div><span class="faint" style="font-size:11.5px" data-bl-len>${dft.pesan.length}/4000</span></div></div>
        <div class="sub-h"><b>Sasaran</b><span class="faint" style="font-size:12px">Kontak opt-out & nomor tidak valid selalu dikecualikan.</span></div>
        <div class="fgrid c3">
          <div class="field"><label for="bl-s">Segmen</label><select class="select" id="bl-s" data-change="blF" data-k="segmen">${optList(segs, dft.filter.segmen, 'Semua segmen')}</select></div>
          <div class="field"><label for="bl-u">Unit kerja</label><select class="select" id="bl-u" data-change="blF" data-k="unit">${optList(units, dft.filter.unit, 'Semua unit')}</select></div>
          <div class="field"><label for="bl-t">Tag</label><select class="select" id="bl-t" data-change="blF" data-k="tag">${optList(tags, dft.filter.tag, 'Semua tag')}</select></div></div>
        <div class="row wrap mt-8" style="gap:16px"><label class="check"><input type="checkbox" data-change="blF" data-k="hanyaTerdaftar" ${dft.filter.hanyaTerdaftar ? 'checked' : ''}>Hanya nomor WA terverifikasi</label><label class="check"><input type="checkbox" data-change="blF" data-k="semuaStatus" ${dft.filter.semuaStatus ? 'checked' : ''}>Sertakan pegawai nonaktif/pensiun</label></div>
        <div class="sub-h"><b>Pengiriman anti-blokir</b></div>
        <div class="fgrid"><div class="field"><label>Ukuran batch per putaran</label><div class="seg" role="radiogroup" aria-label="Ukuran batch">${[10, 20, 50].map((n) => `<button type="button" class="${dft.ukuran === n ? 'on' : ''}" data-act="blUkuran" data-v="${n}">${n} pesan</button>`).join('')}</div></div>
          <div class="field" data-f="jeda"><label for="bl-jd">Jeda acak antarpesan (detik)</label><input class="input" id="bl-jd" name="jeda" value="${esc(dft.jeda)}" placeholder="3-8" data-input="blDraft" autocomplete="off"><div class="ferr" hidden></div></div></div>
        <div class="banner info mt-16" data-bl-hit>${ic('groups')}<div><b>Menghitung sasaran…</b></div></div>
        <div class="row between wrap mt-16" style="border-top:1px solid var(--border);padding-top:16px;gap:10px"><span class="faint" style="font-size:12px">${ic('shield', 's14')} Dikirim bertahap oleh server; aman ditinggal.</span><button class="btn btn-primary" ${this.d.waAktif ? '' : 'disabled'}>${ic('send', 's18')}Kirim Blast</button></div>
      </form></div>
      <div class="g-5"><div class="stack"><div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('visibility', 's18')}</span>Pratinjau</div></div><div class="wa-bubble" data-bl-prev></div></div>
        <div class="card"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('history', 's18')}</span>Riwayat Blast</div><button class="icon-btn" data-act="blMuat" aria-label="Muat ulang riwayat blast">${ic('refresh')}</button></div><div data-bl-list>${this.blHtml()}</div></div></div></div></div>`;
    this.pratinjau(); this.hitung(); this.pantau();
  },
  pratinjau() {
    const b = $('[data-bl-prev]'); if (!b || !this.draft) return;
    const k = (this.hit && this.hit.contoh && this.hit.contoh[0]) || { Nama: 'Nama Penerima' };
    const contoh = { nama: k.Nama, unit: 'Puskesmas Amurang', nip: '198001012005011001', jabatan: 'Perawat', link: S.cfg.pwaUrl || location.origin + location.pathname, aplikasi: S.cfg.appName || BRAND.nama, instansi: S.cfg.instansi || BOOT.instansi };
    b.innerHTML = esc(this.draft.pesan.replace(/\{(\w+)\}/g, (m, x) => (contoh[x] !== undefined ? contoh[x] : m))).replace(/\*([^*\n]+)\*/g, '<b>$1</b>').replace(/\n/g, '<br>') || '<span class="faint">Pesan kosong</span>';
    const l = $('[data-bl-len]'); if (l) l.textContent = this.draft.pesan.length + '/4000';
  },
  hitung: debounce(function () {
    const pg = PAGES.crm, b = $('[data-bl-hit]'); if (!b || !pg.draft) return;
    API.call('blast.hitung', { filter: pg.draft.filter }).then((r) => {
      pg.hit = r; const box = $('[data-bl-hit]'); if (!box) return;
      const d = pg.draft, menit = r.total ? Math.ceil(r.total / d.ukuran) * Math.max(1, Math.ceil(((+(d.jeda.split('-')[0]) || 3) + (+(d.jeda.split('-')[1]) || 8)) / 2 * d.ukuran / 60)) : 0;
      box.className = 'banner ' + (r.total ? 'info' : 'warn') + ' mt-16';
      box.innerHTML = `${ic('groups')}<div><b>${fmtNum(r.total)} penerima</b><p>${r.total ? `Contoh: ${r.contoh.map((x) => esc(x.Nama)).join(', ')}${r.total > r.contoh.length ? ', …' : ''} · estimasi selesai ±${menit} menit (${Math.ceil(r.total / d.ukuran)} batch).` : 'Tidak ada kontak yang memenuhi sasaran. Ubah filter atau sinkronkan/cek kontak.'}</p></div>`;
      pg.pratinjau();
    }).catch(() => { });
  }, 350),
  blHtml() {
    const list = this.bl || [];
    if (!list.length) return emptyBox('Belum ada blast', 'Blast yang dikirim akan tampil di sini beserta progresnya.', 'campaign');
    return `<div class="stack-8">${list.map((b) => { const t = +b.Total || 0, s = +b.Terkirim || 0, g = +b.Gagal || 0, p = t ? Math.round((s + g) / t * 100) : 0; return `<div class="mini" style="flex-direction:column;align-items:stretch;gap:8px"><div class="row between" style="gap:8px"><b style="font-size:13px">${esc(b.Judul)}</b>${stBadge(b.Status)}</div>
      <div class="meter" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Progres ${esc(b.Judul)}"><i style="width:${p}%;background:${b.Status === 'Dihentikan' ? 'var(--text-3)' : 'var(--success)'}"></i></div>
      <div class="row between" style="gap:8px;font-size:12px"><span class="muted">${fmtNum(s)} terkirim${g ? ' · ' + fmtNum(g) + ' gagal' : ''} / ${fmtNum(t)} · batch ${esc(b.UkuranBatch)} · jeda ${esc(b.JedaDetik)} dtk</span>${b.Status === 'Berjalan' ? `<button class="btn btn-danger-o btn-xs" data-act="blStop" data-id="${esc(b.BlastID)}">${ic('stop', 's16')}Hentikan</button>` : `<time class="faint">${fmtWaktu(b.Tanggal)}</time>`}</div></div>`; }).join('')}</div>`;
  },

  pantau() {
    clearTimeout(this.blT);
    if (!(this.bl || []).some((b) => b.Status === 'Berjalan')) return;
    this.blT = setTimeout(() => {
      if (S.route !== 'crm' || this.tab !== 'blast') return;
      if (document.visibilityState !== 'visible') return this.pantau();
      API.call('blast.list', {}).then((bl) => { this.bl = bl; const b = $('[data-bl-list]'); if (b) b.innerHTML = this.blHtml(); this.pantau(); }).catch(() => this.pantau());
    }, 20000);
  },
  async kirim(f) {
    const d = this.draft, errs = {};
    if (!d.judul.trim()) errs.judul = 'Judul wajib diisi.';
    if (d.pesan.trim().length < 5) errs.pesan = 'Isi pesan minimal 5 karakter.';
    const mj = d.jeda.replace(/\s/g, '').match(/^(\d{1,2})-(\d{1,2})$/); if (!mj || +mj[1] < 2 || +mj[2] < +mj[1]) errs.jeda = 'Format min-maks, minimal 2 detik (mis. 3-8).';
    if (showErrs(f, errs)) return;
    const n = this.hit ? this.hit.total : 0; if (!n) return toast('warn', 'Tidak ada penerima', 'Ubah filter sasaran terlebih dahulu.');
    const ok = await Modal.confirm({ title: 'Kirim blast WhatsApp?', icon: 'campaign', msg: `<b>${fmtNum(n)} penerima</b> · batch ${d.ukuran} pesan · jeda acak ${esc(d.jeda)} detik.<p class="muted mt-4">Pesan dikirim bertahap oleh server melalui antrean. Anda dapat menghentikannya kapan saja dari Riwayat Blast.</p>`, ok: 'Kirim sekarang' });
    if (!ok) return;
    const btn = f.querySelector('.btn-primary'); btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Menjadwalkan…';
    try {
      const r = await API.call('blast.buat', { judul: d.judul, pesan: d.pesan, ukuranBatch: d.ukuran, jeda: d.jeda, filter: d.filter });
      this.bl = r.list; this.draft = null; this.hit = null;
      toast('ok', 'Blast dijadwalkan', `${fmtNum(r.total)} pesan masuk antrean · estimasi ±${r.estimasiMenit} menit.`, { ms: 8000 });
      this.blast();
    } catch (e) { errToast(e, 'Blast gagal dibuat'); btn.disabled = false; btn.innerHTML = ic('send', 's18') + 'Kirim Blast'; }
  },

  async antrean(force) {
    const box = $('[data-crm-body]');
    if (!this.aq || force) {
      if (!this.aq) box.innerHTML = `<div class="card">${skelRows(8, 40)}</div>`;
      try { this.aq = await API.call('antrian.list', {}, { retry: 1 }); } catch (e) { box.innerHTML = `<div class="card">${emptyBox('Antrean gagal dimuat', e.message, 'error')}</div>`; return; }
      if (S.route !== 'crm' || this.tab !== 'antrean') return;
    }
    const st = this.aq.stat, af = this.af;
    const rows = this.aq.rows.filter((r) => (!af.status || r.Status === af.status) && (!af.kanal || r.Kanal === af.kanal));
    box.innerHTML = `<div class="card"><div class="row between wrap" style="gap:12px">
        <div class="seg" role="radiogroup" aria-label="Filter status" style="flex:1;min-width:260px;max-width:560px">${[['', 'Semua', st.total], ['Antri', 'Menunggu', st.Antri], ['Terkirim', 'Terkirim', st.Terkirim], ['Gagal', 'Gagal', st.Gagal], ['Batal', 'Batal', st.Batal]].map((x) => `<button type="button" class="${af.status === x[0] ? 'on' : ''}" data-act="aqF" data-k="status" data-v="${x[0]}">${x[1]} <span class="faint">${fmtNum(x[2])}</span></button>`).join('')}</div>
        <div class="row wrap" style="gap:8px"><select class="select" style="width:auto" data-change="aqK">${optList([['WA', 'WhatsApp'], ['EMAIL', 'Email']].map((x) => x[0]), af.kanal, 'Semua kanal')}</select>
          <button class="btn btn-outline btn-sm" data-act="aqMuat">${ic('refresh', 's16')}Muat ulang</button>
          ${st.Gagal ? `<button class="btn btn-outline btn-sm" data-act="aqUlang">${ic('replay', 's16')}Ulangi yang gagal</button>` : ''}
          <button class="btn btn-primary btn-sm" data-act="ntProses">${ic('play_arrow', 's16')}Proses sekarang</button></div></div>
      <p class="faint mt-12" style="font-size:12px">${ic('info', 's14')} Server memproses antrean otomatis setiap ±1 menit (maks. ${40} email & ${50} WA per putaran; blast mengikuti ukuran batch). Gagal diulang otomatis hingga 3 kali. Menampilkan 150 pesan terbaru.</p></div>
      <div class="card mt-16">${rows.length ? `<div class="tbl-wrap responsive"><table class="tbl compact"><thead><tr><th>Waktu</th><th>Kanal</th><th>Penerima</th><th>Kejadian / isi</th><th>Status</th></tr></thead><tbody>${rows.map((r) => `<tr>
        <td style="white-space:nowrap;font-size:12px">${fmtWaktu(r.DibuatPada)}${r.DikirimPada ? `<div class="faint">kirim ${fmtWaktu(r.DikirimPada).split(', ')[1] || ''}</div>` : ''}</td>
        <td>${r.Kanal === 'WA' ? `<span class="chip">${ic('chat', 's14')}WA</span>` : `<span class="chip">${ic('mail', 's14')}Email</span>`}</td>
        <td style="min-width:160px"><b style="font-weight:600;font-size:13px">${esc(r.NamaPenerima || '—')}</b><div class="faint mono" style="font-size:11.5px;word-break:break-all">${esc(r.Tujuan)}</div></td>
        <td style="min-width:220px;font-size:12.5px"><b style="font-weight:600">${esc(r.BlastID ? 'Blast: ' + r.Subjek : r.Label)}</b><div class="muted" style="font-size:12px">${esc(String(r.Ringkas || '').slice(0, 120))}</div></td>
        <td>${stBadge(r.Status)}${+r.Percobaan > 1 || r.Status === 'Gagal' ? `<div class="faint" style="font-size:11px">percobaan ${esc(r.Percobaan)}</div>` : ''}${r.Respon && r.Status !== 'Terkirim' ? `<div class="faint" style="font-size:11px;max-width:200px" data-tip="Respon|${esc(r.Respon)}" tabindex="0">${esc(String(r.Respon).slice(0, 48))}</div>` : ''}</td></tr>`).join('')}</tbody></table></div>
      <div class="cards-list">${rows.map((r) => `<div class="li-card"><div class="row between top" style="gap:8px"><div style="min-width:0"><b class="truncate" style="display:block">${r.Kanal === 'WA' ? ic('chat', 's16') : ic('mail', 's16')} ${esc(r.NamaPenerima || r.Tujuan)}</b><small class="muted">${esc(r.BlastID ? 'Blast: ' + r.Subjek : r.Label)} · ${fmtWaktu(r.DibuatPada)}</small></div>${stBadge(r.Status)}</div><p class="muted" style="font-size:12px">${esc(String(r.Ringkas || '').slice(0, 120))}</p>${r.Respon && r.Status !== 'Terkirim' ? `<small class="faint">${esc(String(r.Respon).slice(0, 80))}</small>` : ''}</div>`).join('')}</div>` : emptyBox('Antrean kosong', 'Belum ada pesan untuk filter ini.', 'inbox')}</div>`;
  }
};
const ckLive = debounce((el) => { const pg = PAGES.crm; pg.f[el.dataset.k] = el.value; pg.page = 1; pg.renderList(); }, 120);
INP.ckLive = ckLive; CHG.ckLive = ckLive;
ACT.ckPage = (el) => { PAGES.crm.page = +el.dataset.p; PAGES.crm.renderList(); $('[data-ck-list]').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
ACT.ckBuka = (el) => PAGES.crm.buka(el.dataset.id);
ACT.ckTambah = () => PAGES.crm.tambah();
ACT.ckValidasi = (el) => PAGES.crm.validasi(el);
ACT.ckSync = (el) => { el.disabled = true; Sync.run('Menyinkronkan kontak…', API.call('crm.sync', {})).then((r) => { PAGES.crm.terima(r); toast('ok', 'Kontak disinkronkan', `Baru: ${r.hasil.ditambah} · diperbarui: ${r.hasil.diperbarui} · total: ${r.hasil.total}`); if (S.route === 'crm') PAGES.crm.kontak(); }).catch((e) => { el.disabled = false; errToast(e); }); };
SUBMIT.ckSimpan = (f) => {
  const id = f.dataset.id, pg = PAGES.crm, k = pg.d.rows.find((x) => x.KontakID === id); if (!k) return;
  const p = { KontakID: id, Tag: f.Tag.value, Catatan: f.Catatan.value, OptOut: f.OptOut.checked ? 'YA' : 'TIDAK' };
  if (k.Sumber === 'Manual') { Object.assign(p, { Nama: f.Nama.value.trim(), NoWA: f.NoWA.value.trim(), Email: f.Email.value.trim(), Segmen: f.Segmen.value.trim() }); if (!p.Nama) return showErrs(f, { Nama: 'Nama wajib diisi.' }, true); }

  const bak = Object.assign({}, k); Object.assign(k, { tags: p.Tag.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean), Tag: p.Tag, Catatan: p.Catatan, OptOut: p.OptOut === 'YA' });
  Drawer.close(); pg.renderList(); toast('ok', 'Kontak disimpan', k.Nama);
  Sync.run('Menyimpan kontak…', API.call('crm.simpan', p)).then((r) => { pg.terima(r); if (S.route === 'crm' && pg.tab === 'kontak') pg.renderList(); }).catch((e) => { Object.assign(k, bak); pg.renderList(); errToast(e, 'Kontak gagal disimpan'); });
};
SUBMIT.ckInteraksi = (f) => {
  const v = f.ringkasan.value.trim(); if (!v) return toast('warn', 'Ringkasan kosong');
  const box = f.parentElement.querySelector('[data-ck-int]'); f.ringkasan.value = '';
  Sync.run('Mencatat…', API.call('crm.interaksi.tambah', { kontakId: f.dataset.id, kanal: f.kanal.value, arah: f.arah.value, ringkasan: v })).then((list) => { if (box) box.innerHTML = PAGES.crm.intHtml(list); }).catch((e) => errToast(e));
};
ACT.ckHapus = (el) => Modal.confirm({ title: 'Hapus kontak manual?', icon: 'delete', danger: true, msg: 'Kontak & tag-nya dihapus. Riwayat interaksi tetap tersimpan di sheet.', ok: 'Hapus' }).then((ok) => { if (!ok) return; Drawer.close(); Sync.run('Menghapus…', API.call('crm.hapus', { id: el.dataset.id })).then((r) => { PAGES.crm.terima(r); PAGES.crm.renderList(); toast('ok', 'Kontak dihapus'); }).catch((e) => errToast(e)); });
ACT.ckGabung = (el) => Modal.confirm({ title: 'Gabungkan kontak?', icon: 'merge', msg: 'Tag, catatan, opt-out & riwayat interaksi kontak manual ini dipindahkan ke kontak tujuan, lalu kontak manual dihapus.', ok: 'Gabungkan' }).then((ok) => { if (!ok) return; Drawer.close(); Sync.run('Menggabungkan…', API.call('crm.gabung', { utama: el.dataset.ke, lain: el.dataset.id })).then((r) => { PAGES.crm.terima(r); PAGES.crm.kontak(); toast('ok', 'Kontak digabung'); }).catch((e) => errToast(e)); });
INP.blDraft = (el) => { const d = PAGES.crm.draft; if (!d) return; d[el.name] = el.value; PAGES.crm.pratinjau(); if (el.name === 'jeda') PAGES.crm.hitung(); };
CHG.blF = (el) => { const d = PAGES.crm.draft; if (!d) return; d.filter[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value; PAGES.crm.hitung(); };
ACT.blUkuran = (el) => { const d = PAGES.crm.draft; d.ukuran = +el.dataset.v; $$('[data-act="blUkuran"]').forEach((b) => b.classList.toggle('on', b === el)); PAGES.crm.hitung(); };
ACT.blVar = (el) => { const ta = $('#bl-p'); if (!ta) return; const v = '{' + el.dataset.v + '}', p0 = ta.selectionStart || ta.value.length; ta.value = ta.value.slice(0, p0) + v + ta.value.slice(ta.selectionEnd || p0); ta.focus(); ta.selectionStart = ta.selectionEnd = p0 + v.length; PAGES.crm.draft.pesan = ta.value; PAGES.crm.pratinjau(); };
ACT.blMuat = () => Sync.run('Memuat…', API.call('blast.list', {})).then((bl) => { PAGES.crm.bl = bl; const b = $('[data-bl-list]'); if (b) b.innerHTML = PAGES.crm.blHtml(); PAGES.crm.pantau(); }).catch((e) => errToast(e));
ACT.blStop = (el) => Modal.confirm({ title: 'Hentikan blast?', icon: 'stop_circle', danger: true, msg: 'Pesan yang belum terkirim akan dibatalkan. Pesan yang sudah terkirim tidak dapat ditarik.', ok: 'Hentikan' }).then((ok) => { if (!ok) return; Sync.run('Menghentikan…', API.call('blast.stop', { id: el.dataset.id })).then((bl) => { PAGES.crm.bl = bl; const b = $('[data-bl-list]'); if (b) b.innerHTML = PAGES.crm.blHtml(); toast('ok', 'Blast dihentikan'); }).catch((e) => errToast(e)); });
SUBMIT.blKirim = (f) => PAGES.crm.kirim(f);
ACT.aqF = (el) => { PAGES.crm.af[el.dataset.k] = el.dataset.v; PAGES.crm.antrean(); };
CHG.aqK = (el) => { PAGES.crm.af.kanal = el.value; PAGES.crm.antrean(); };
ACT.aqMuat = () => Sync.run('Memuat antrean…', PAGES.crm.antrean(true));
ACT.aqUlang = () => Modal.confirm({ title: 'Ulangi pesan gagal?', icon: 'replay', msg: 'Semua pesan berstatus Gagal dijadwalkan ulang (percobaan direset).', ok: 'Ulangi' }).then((ok) => { if (!ok) return; Sync.run('Menjadwalkan ulang…', API.call('antrian.ulang', { semua: true })).then((r) => { PAGES.crm.aq = r; PAGES.crm.antrean(); toast('ok', r.diulang + ' pesan dijadwalkan ulang'); }).catch((e) => errToast(e)); });

init();

const PT_IC = { kapasitas: 'monitoring', audit: 'policy', arsip: 'inventory_2' };
const PT_LV = { aman: ['b-ok', 'check_circle', 'Aman', '--chart-4'], waspada: ['b-warn', 'warning', 'Waspada', '--chart-6'], kritis: ['b-bad', 'error', 'Kritis', '--chart-5'] };
function fmtByte(b) {
  b = +b || 0;
  const f = (v, d) => v.toLocaleString('id-ID', { maximumFractionDigits: d });
  return b >= 1e9 ? f(b / 1e9, 2) + ' GB' : b >= 1e6 ? f(b / 1e6, 1) + ' MB' : b >= 1e3 ? f(b / 1e3, 0) + ' KB' : fmtNum(b) + ' B';
}
const ptPct = (v) => (+v || 0).toLocaleString('id-ID', { maximumFractionDigits: (+v || 0) < 10 ? 1 : 0 }) + '%';
const ptLv = (lv) => { const x = PT_LV[lv] || PT_LV.aman; return `<span class="badge ${x[0]}">${ic(x[1])}${x[2]}</span>`; };
const ptAksi = (a) => String(a || '').toLowerCase().split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const ptAksiTone = (a) => /HAPUS|TOLAK|NONAKTIF|DIHENTIKAN/.test(a) ? 'b-bad' : /ARSIP|MIGRASI/.test(a) ? 'b-pri' : /RESET|DARURAT|RAHASIA|LAMBAT/.test(a) ? 'b-warn' : /SETUJU|TAMBAH|SELESAI/.test(a) ? 'b-ok' : 'b-mut';

PAGES.pantau = {
  tab: 'kapasitas', d: null, au: null, af: { q: '', aksi: '', peran: '', dari: '', sampai: '' }, apage: 1,
  ar: null, pv: null, pilih: '', running: false, prog: null,
  show(p) {
    p = p || {};
    this.tab = ['kapasitas', 'audit', 'arsip'].indexOf(p.tab) >= 0 ? p.tab : 'kapasitas';
    if (p.arsip) { this.pilih = p.arsip; this.pv = null; }
    $('#pg-pantau').innerHTML = pageHead(['Administrasi', 'Pantau Database'], 'Pantau Database', 'Kapasitas & limit Supabase paket gratis, jejak aktivitas (audit log), dan pemindahan data lama ke arsip Google Drive.')
      + `<div class="tabs mb-16">${ROUTES.pantau.sub.map((s) => `<button class="tab ${s[0] === this.tab ? 'on' : ''}" data-act="nav" data-r="pantau" data-tab="${s[0]}">${ic(PT_IC[s[0]], 's16')}${s[1]}</button>`).join('')}</div><div data-pt-body></div>`;
    this.done = true;
    if (this.tab === 'audit') this.audit(); else if (this.tab === 'arsip') this.arsip(); else this.kapasitas();
  },
  body() { return $('[data-pt-body]'); },
  aktif(tab) { return S.route === 'pantau' && this.tab === tab; },

  async kapasitas(segar) {
    const box = this.body();
    if (!this.d || segar) {
      if (!this.d) box.innerHTML = `<div class="grid">${[1, 2, 3].map(() => '<div class="g-4"><div class="skel" style="height:230px;border-radius:14px"></div></div>').join('')}</div><div class="card mt-16">${skelRows(6, 40)}</div>`;
      try { this.d = await API.call('pantau.ringkas', segar ? { segar: true } : {}, { retry: 1 }); }
      catch (e) { box.innerHTML = `<div class="card">${emptyBox('Data kapasitas gagal dimuat', e.message, 'error')}</div>`; return; }
      if (!this.aktif('kapasitas')) return;
      if (segar && this.d.dibatasi) toast('info', 'Baru saja diperbarui', 'Angka kapasitas dapat disegarkan lagi 1 menit setelah pembaruan terakhir.');
    }
    const d = this.d, db = d.db, eg = d.egress, dt = d.detak, lim = d.limit;
    const terburuk = [db.level, eg.level].indexOf('kritis') >= 0 ? 'kritis' : [db.level, eg.level].indexOf('waspada') >= 0 ? 'waspada' : 'aman';
    const ring = (pct, lv, isi) => Chart.ring(Math.min(100, pct), { size: 128, thick: 13, c: PT_LV[lv][3], center: isi });
    const detakTelat = dt.jam === null || dt.jam > dt.interval * 2 || dt.galat;
    const maxB = Math.max(1, ...d.tabel.map((t) => t.byte));
    const egMax = Math.max(1, ...eg.harian.map((x) => x.keluar));
    const pr = d.prediksi;
    const prTeks = !pr.cukup ? 'Perkiraan muncul setelah ≥ 3 hari pencatatan ukuran database (otomatis setiap 12 jam).'
      : pr.perHari <= 0 ? 'Ukuran database stabil atau menurun dalam ' + pr.hari + ' hari terakhir — tidak ada risiko penuh dalam waktu dekat.'
        : `Tumbuh ±${fmtByte(pr.perHari)}/hari (${pr.hari} hari terakhir) → batas ${fmtByte(lim.db)} tercapai ±<b>${pr.sisaHari > 730 ? Math.round(pr.sisaHari / 365) + ' tahun' : pr.sisaHari > 60 ? Math.round(pr.sisaHari / 30) + ' bulan' : fmtNum(pr.sisaHari) + ' hari'}</b> lagi.`;
    box.innerHTML = `${terburuk !== 'aman' ? `<div class="banner ${terburuk === 'kritis' ? 'bad' : 'warn'}" style="margin-bottom:16px">${ic(terburuk === 'kritis' ? 'error' : 'warning')}<div class="grow"><b>Kapasitas ${terburuk === 'kritis' ? 'hampir penuh' : 'mendekati batas'} paket gratis</b><p>Database ${ptPct(db.persen)} · egress bulan ini ${ptPct(eg.persen)}. Pindahkan data lama ke arsip Google Drive agar aplikasi tetap lancar.</p></div><button class="btn btn-sm ${terburuk === 'kritis' ? 'btn-danger' : 'btn-outline'}" data-act="nav" data-r="pantau" data-tab="arsip">${ic('inventory_2', 's16')}Buka Arsip Data</button></div>` : ''}
      ${!d.live ? `<div class="banner info" style="margin-bottom:16px">${ic('info')}<div><b>Masa peralihan</b><p>Detak anti-jeda dan pencatatan harian mulai berjalan otomatis setelah Web App versi Supabase dibuka pertama kali.</p></div></div>` : ''}
      <div class="grid">
        <div class="g-4"><div class="card" style="height:100%"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('database', 's18')}</span>Ukuran Database</div>${ptLv(db.level)}</div>
          <div class="row gap-12" style="align-items:center">${ring(db.persen, db.level, `<div class="kpi sm">${ptPct(db.persen)}</div><div class="caps" style="font-size:9.5px">terpakai</div>`)}
          <div class="grow" style="min-width:0"><div class="kpi sm">${fmtByte(db.byte)}</div><div class="muted" style="font-size:12.5px">dari ${fmtByte(lim.db)} (paket gratis)</div>
          <div class="faint mt-12" style="font-size:11.5px">Data aplikasi ${fmtByte(db.app)}${db.wal !== null ? ` · WAL ${fmtByte(db.wal)}` : ''}<br>Angka nyata dari PostgreSQL</div></div></div></div></div>
        <div class="g-4"><div class="card" style="height:100%"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('cloud_download', 's18')}</span>Egress Bulan Ini</div>${ptLv(eg.level)}</div>
          <div class="row gap-12" style="align-items:center">${ring(eg.persen, eg.level, `<div class="kpi sm">${ptPct(eg.persen)}</div><div class="caps" style="font-size:9.5px">terpakai</div>`)}
          <div class="grow" style="min-width:0"><div class="kpi sm">${fmtByte(eg.bulan)}</div><div class="muted" style="font-size:12.5px">dari ${fmtByte(lim.egress)} / bulan</div>
          <div class="faint mt-12" style="font-size:11.5px">Hari ini ${fmtByte(eg.hariIni.keluar)} · ${fmtNum(eg.hariIni.n)} panggilan<br>30 hari ${fmtByte(eg.hari30)} · perkiraan server</div></div></div></div></div>
        <div class="g-4"><div class="card" style="height:100%"><div class="card-h"><div class="card-t"><span class="card-ic ${detakTelat ? 'warn' : 'ok'}">${ic('monitor_heart', 's18')}</span>Anti-Jeda Otomatis</div>${detakTelat ? `<span class="badge b-warn">${ic('warning')}Periksa</span>` : `<span class="badge b-ok">${ic('check_circle')}Aktif</span>`}</div>
          <div class="kpi sm">${dt.terakhir ? esc(relWaktu(dt.terakhir)) : 'Belum ada detak'}</div>
          <p class="muted" style="font-size:12.5px;margin-top:4px">Detak terakhir${dt.n ? ' · ke-' + fmtNum(dt.n) : ''}. Server menulis 1 baris kecil ke database setiap ${dt.interval} jam, jauh di bawah batas jeda 7 hari.</p>
          ${dt.galat ? `<p class="faint mt-12" style="font-size:11.5px;color:var(--danger)">${ic('error', 's14')} ${esc(dt.galat)}</p>` : ''}
          <button class="btn btn-outline btn-sm mt-12" data-act="ptDetak">${ic('favorite', 's16')}Kirim detak sekarang</button></div></div>
      </div>
      <div class="grid mt-16">
        <div class="g-7"><div class="card" style="height:100%"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('trending_up', 's18')}</span>Perkiraan Penuh</div></div>
          <p style="font-size:13.5px">${prTeks}</p>
          <div class="caps mt-16" style="font-size:10.5px">Egress harian · 30 hari</div>
          <div role="img" aria-label="Grafik egress harian 30 hari" style="display:flex;align-items:flex-end;gap:2px;height:72px;margin-top:8px">${eg.harian.map((x) => `<div title="${esc(fmtTgl(x.h, true) + ': ' + fmtByte(x.keluar) + ' · ' + x.n + ' panggilan')}" style="flex:1;min-width:2px;border-radius:3px 3px 0 0;background:var(--chart-1);opacity:${x.keluar ? 1 : 0.25};height:${Math.max(3, Math.round(x.keluar / egMax * 100))}%"></div>`).join('')}</div>
          <div class="row between faint" style="font-size:11px;margin-top:4px"><span>${fmtTgl(eg.harian[0].h, true)}</span><span>hari ini</span></div></div></div>
        <div class="g-5"><div class="card" style="height:100%"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('info', 's18')}</span>Batas Paket Gratis</div></div>
          <div class="kv"><div><dt>Database</dt><dd>${fmtByte(lim.db)}</dd></div><div><dt>Egress / bulan</dt><dd>${fmtByte(lim.egress)}</dd></div><div><dt>Disk (baca-saja di 95%)</dt><dd>${fmtByte(lim.disk)}</dd></div><div><dt>Tidak aktif → dijeda</dt><dd>7 hari</dd></div></div>
          <p class="faint mt-12" style="font-size:11.5px">Angka resmi & periode tagihan ada di dasbor Supabase. Egress di sini diukur dari respons yang diterima server aplikasi (sebelum kompresi), jadi cenderung sedikit lebih tinggi.</p>
          <div class="row wrap mt-12" style="gap:8px">${d.dasbor ? `<a class="btn btn-outline btn-sm" href="${esc(d.dasbor)}" target="_blank" rel="noopener">${ic('open_in_new', 's16')}Dasbor proyek</a>` : ''}<a class="btn btn-outline btn-sm" href="${esc(d.pemakaianResmi)}" target="_blank" rel="noopener">${ic('open_in_new', 's16')}Pemakaian resmi</a></div></div></div>
      </div>
      <div class="card mt-16"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('table_chart', 's18')}</span>Ukuran per Tabel</div><span class="faint" style="font-size:12px">Diperbarui ${esc(relWaktu(d.diambil))} · <button class="link-btn" data-act="ptSegar">Segarkan</button></span></div>
        <div class="tbl-wrap responsive"><table class="tbl compact"><thead><tr><th>Tabel</th><th style="text-align:right">Baris</th><th style="min-width:200px">Ukuran (data + indeks)</th><th style="text-align:right">Indeks</th><th></th></tr></thead><tbody>${d.tabel.map((t) => `<tr>
          <td><b style="font-weight:600">${esc(t.nama)}</b></td><td style="text-align:right">${fmtNum(t.baris)}</td>
          <td><div class="row" style="align-items:center;gap:8px"><div class="meter grow"><i style="width:${Math.max(2, t.byte / maxB * 100)}%;background:var(--chart-1)"></i></div><span style="font-size:12px;white-space:nowrap">${fmtByte(t.byte)}</span></div></td>
          <td style="text-align:right;font-size:12px" class="muted">${fmtByte(t.indeks)}</td>
          <td style="text-align:right">${t.arsip ? `<button class="btn btn-outline btn-sm" data-act="ptKeArsip" data-k="${esc(t.key)}">${ic('inventory_2', 's16')}Arsipkan</button>` : '<span class="faint" style="font-size:11.5px">data inti</span>'}</td></tr>`).join('')}</tbody></table></div>
        <div class="cards-list">${d.tabel.map((t) => `<div class="li-card"><div class="row between" style="gap:8px"><b class="truncate">${esc(t.nama)}</b><span style="font-size:12px;white-space:nowrap">${fmtByte(t.byte)}</span></div><div class="meter"><i style="width:${Math.max(2, t.byte / maxB * 100)}%;background:var(--chart-1)"></i></div><div class="row between"><small class="muted">${fmtNum(t.baris)} baris · indeks ${fmtByte(t.indeks)}</small>${t.arsip ? `<button class="btn btn-outline btn-sm" data-act="ptKeArsip" data-k="${esc(t.key)}">${ic('inventory_2', 's16')}Arsipkan</button>` : '<small class="faint">data inti</small>'}</div></div>`).join('')}</div>
        <p class="faint mt-12" style="font-size:11.5px">${ic('info', 's14')} Tabel inti (pegawai, akun, riwayat SK, keluarga, master, pengaturan) tidak dapat diarsipkan karena dipakai aturan bisnis.</p></div>`;
  },

  formAudit() {
    const f = this.af, aksi = this.au ? Object.keys(this.au.aksi || {}).sort() : [];
    this.body().innerHTML = `<form class="card filter" data-submit="ptAuCari" novalidate>
        <div class="field" style="grid-column:span 3"><label for="pa-q">Cari</label><div class="input-ic">${ic('search')}<input class="input" id="pa-q" name="q" value="${esc(f.q)}" placeholder="Pelaku, target, ringkasan" maxlength="80" autocomplete="off"></div></div>
        <div class="field" style="grid-column:span 3"><label for="pa-a">Aksi</label><select class="select" id="pa-a" name="aksi"><option value="">Semua aksi</option>${aksi.map((a) => `<option value="${esc(a)}" ${a === f.aksi ? 'selected' : ''}>${esc(ptAksi(a))} (${fmtNum(this.au.aksi[a])})</option>`).join('')}</select></div>
        <div class="field" style="grid-column:span 2"><label for="pa-p">Peran</label><select class="select" id="pa-p" name="peran">${[['', 'Semua peran'], ['SUPERADMIN', 'Superadmin'], ['ADMIN_UNIT', 'Admin Unit'], ['PEGAWAI', 'Pegawai'], ['SISTEM', 'Sistem']].map((x) => `<option value="${x[0]}" ${x[0] === f.peran ? 'selected' : ''}>${x[1]}</option>`).join('')}</select></div>
        <div class="field" style="grid-column:span 2"><label for="pa-d">Dari tanggal</label><input class="input" type="date" id="pa-d" name="dari" value="${esc(f.dari)}" max="${todayYmd()}"></div>
        <div class="field" style="grid-column:span 2"><label for="pa-s">Sampai tanggal</label><input class="input" type="date" id="pa-s" name="sampai" value="${esc(f.sampai)}" max="${todayYmd()}"></div>
        <div class="fa"><span class="info" data-pa-info></span><div class="btns row"><button type="button" class="btn btn-outline" data-act="ptAuReset">${ic('filter_alt_off', 's18')}Reset</button><button class="btn btn-primary">${ic('search', 's18')}Cari</button></div></div>
      </form><div class="card mt-16" data-pt-au></div>`;
  },

  async audit(muat) {
    if (!muat || !$('[data-pt-au]')) this.formAudit();
    if (this.au && !muat) { this.renderAudit(); return; }
    const list = $('[data-pt-au]'), pertama = !this.au;
    list.innerHTML = skelRows(8, 40);
    try { this.au = await API.call('pantau.audit', Object.assign({ page: this.apage, size: 50 }, this.af), { retry: 1 }); }
    catch (e) { list.innerHTML = emptyBox('Audit log gagal dimuat', e.message, 'error'); return; }
    if (!this.aktif('audit')) return;
    if (pertama) this.formAudit();
    this.renderAudit();
  },
  renderAudit() {
    const list = $('[data-pt-au]'); if (!list || !this.au) return;
    const a = this.au, rows = a.rows;
    const info = $('[data-pa-info]'); if (info) info.innerHTML = `${ic('policy', 's16')} ${fmtNum(a.total)} entri`;
    list.innerHTML = rows.length ? `<div class="row between wrap mb-12" style="gap:8px"><span class="faint" style="font-size:12px">${ic('info', 's14')} Terbaru di atas. Entri lebih dari 90 hari dapat dipindah ke arsip Google Drive.</span><button class="btn btn-outline btn-sm" data-act="ptAuUnduh">${ic('download', 's16')}Unduh halaman ini (.xlsx)</button></div>
      <div class="tbl-wrap responsive"><table class="tbl compact"><thead><tr><th>Waktu</th><th>Pelaku</th><th>Aksi</th><th>Target</th><th>Ringkasan</th></tr></thead><tbody>${rows.map((r) => `<tr>
        <td style="white-space:nowrap;font-size:12px">${fmtWaktu(r.Waktu)}</td>
        <td style="min-width:120px"><b style="font-weight:600;font-size:13px">${esc(r.Pelaku || '—')}</b><div class="faint" style="font-size:11px">${esc(r.Peran || '')}</div></td>
        <td><span class="badge ${ptAksiTone(r.Aksi)}">${esc(ptAksi(r.Aksi))}</span></td>
        <td class="mono" style="font-size:11.5px;word-break:break-all;max-width:170px">${esc(r.Target || '—')}</td>
        <td style="min-width:240px;font-size:12.5px" class="muted">${esc(String(r.Ringkasan || '').slice(0, 220))}${String(r.Ringkasan || '').length > 220 ? '…' : ''}</td></tr>`).join('')}</tbody></table></div>
      <div class="cards-list">${rows.map((r) => `<div class="li-card"><div class="row between top" style="gap:8px"><div style="min-width:0"><b class="truncate" style="display:block">${esc(r.Pelaku || '—')}</b><small class="muted">${fmtWaktu(r.Waktu)} · ${esc(r.Peran || '')}</small></div><span class="badge ${ptAksiTone(r.Aksi)}">${esc(ptAksi(r.Aksi))}</span></div>${r.Target ? `<small class="mono faint" style="word-break:break-all">${esc(r.Target)}</small>` : ''}<p class="muted" style="font-size:12px">${esc(String(r.Ringkasan || '').slice(0, 160))}</p></div>`).join('')}</div>
      ${pager(a.total, a.page, a.size, 'ptAuPage')}` : emptyBox('Tidak ada entri', 'Ubah filter atau rentang tanggal.', 'search_off');
  },

  async arsip(muat) {
    const box = this.body();
    if (!this.ar || muat) {
      if (!this.ar) box.innerHTML = `<div class="card">${skelRows(6, 44)}</div>`;
      try { this.ar = await API.call('pantau.arsipDaftar', {}, { retry: 1 }); }
      catch (e) { box.innerHTML = `<div class="card">${emptyBox('Data arsip gagal dimuat', e.message, 'error')}</div>`; return; }
      if (!this.aktif('arsip')) return;
    }
    const ar = this.ar, job = ar.job;
    const t = ar.tabel.find((x) => x.key === this.pilih) || ar.tabel[0];
    this.pilih = t.key;
    const pv = this.pv && this.pv.tabel === t.key ? this.pv : null;
    box.innerHTML = `${job && !this.running ? `<div class="banner warn" style="margin-bottom:16px">${ic('pending')}<div class="grow"><b>Arsip ${esc(job.label)} belum selesai</b><p>${fmtNum(job.n)} dari ${fmtNum(job.total)} baris sudah dipindah (dimulai ${esc(relWaktu(job.mulai))} oleh ${esc(job.oleh)}). Data yang belum terarsip tetap aman di Supabase.</p></div><div class="row wrap" style="gap:8px"><button class="btn btn-outline btn-sm" data-act="ptArHenti">${ic('stop_circle', 's16')}Hentikan</button><button class="btn btn-primary btn-sm" data-act="ptArLanjut">${ic('play_arrow', 's16')}Lanjutkan</button></div></div>` : ''}
      <div class="grid">
        <div class="g-7"><div class="card" style="height:100%"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('inventory_2', 's18')}</span>Pindahkan Data Lama ke Arsip</div></div>
          <form class="filter" data-submit="ptArPratinjau" novalidate>
            <div class="field" style="grid-column:span 7"><label for="ar-t">Data</label><select class="select" id="ar-t" name="tabel" data-change="ptArTabel" ${this.running ? 'disabled' : ''}>${ar.tabel.map((x) => `<option value="${x.key}" ${x.key === t.key ? 'selected' : ''}>${esc(x.label)} · min. ${x.minHari >= 365 ? Math.round(x.minHari / 365) + ' tahun' : x.minHari + ' hari'}</option>`).join('')}</select></div>
            <div class="field" style="grid-column:span 5"><label for="ar-s">${t.bulan ? 'Periode sebelum' : 'Data sebelum tanggal'}</label><input class="input" type="${t.bulan ? 'month' : 'date'}" id="ar-s" name="sampai" value="${esc(pv ? pv.sampai : t.maks)}" max="${esc(t.maks)}" ${this.running ? 'disabled' : ''}></div>
            <div class="fa"><span class="info">${ic('lock', 's16')} Paling akhir: ${esc(t.bulan ? t.maks : fmtTgl(t.maks, true))}</span><div class="btns row"><button class="btn btn-outline" ${this.running ? 'disabled' : ''}>${ic('manage_search', 's18')}Pratinjau</button></div></div>
          </form>
          <div data-ar-hasil class="mt-16">${this.running && this.prog ? this.progHtml() : pv ? this.pvHtml(pv) : `<p class="faint" style="font-size:12.5px">Pilih data & batas tanggal, lalu tekan <b>Pratinjau</b>. Belum ada data yang berubah.</p>`}</div></div></div>
        <div class="g-5"><div class="card" style="height:100%"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('help', 's18')}</span>Cara Kerja</div></div>
          <ol class="stack-8" style="margin:0;padding-left:18px;font-size:12.5px;color:var(--text-2)">
            <li>Baris lama disalin ke <b>Google Spreadsheet baru</b> di folder Drive <b>Arsip Database (Supabase)</b> — gratis, di akun Google Anda.</li>
            <li>Setiap batch diverifikasi di spreadsheet dulu, <b>baru</b> dihapus dari Supabase. Bila koneksi putus, tekan Lanjutkan — tidak ada baris ganda.</li>
            <li>Arsip ${ar.tabel.filter((x) => x.pulih).length ? 'Audit Log, Notifikasi, Log Import, Pengajuan & Rincian Gaji' : ''} dapat dipulihkan kapan saja lewat <button class="link-btn" data-act="nav" data-r="pengaturan" data-tab="migrasi">Pengaturan → Migrasi Data</button> (tempel URL spreadsheet arsip).</li>
            <li>Ruang yang dibebaskan langsung dipakai ulang oleh data baru; angka ukuran di dasbor turun bertahap setelah <i>autovacuum</i>.</li>
          </ol></div></div>
      </div>
      <div class="card mt-16"><div class="card-h"><div class="card-t"><span class="card-ic">${ic('history', 's18')}</span>Riwayat Arsip</div></div>${ar.riwayat.length ? `<div class="tbl-wrap responsive"><table class="tbl compact"><thead><tr><th>Selesai</th><th>Data</th><th>Sebelum</th><th style="text-align:right">Baris</th><th>Status</th><th></th></tr></thead><tbody>${ar.riwayat.map((r) => `<tr><td style="white-space:nowrap;font-size:12px">${fmtWaktu(r.selesai)}<div class="faint">${esc(r.oleh || '')}</div></td><td>${esc(r.label)}</td><td>${esc(r.sampai)}</td><td style="text-align:right">${fmtNum(r.n)}</td><td>${r.status === 'Selesai' ? `<span class="badge b-ok">${ic('check_circle')}Selesai</span>` : `<span class="badge b-mut">${ic('stop_circle')}Dihentikan</span>`}</td><td style="text-align:right">${r.url ? `<a class="btn btn-outline btn-sm" href="${esc(r.url)}" target="_blank" rel="noopener">${ic('open_in_new', 's16')}Buka arsip</a>` : ''}</td></tr>`).join('')}</tbody></table></div>
        <div class="cards-list">${ar.riwayat.map((r) => `<div class="li-card"><div class="row between top" style="gap:8px"><div style="min-width:0"><b class="truncate" style="display:block">${esc(r.label)}</b><small class="muted">sebelum ${esc(r.sampai)} · ${fmtNum(r.n)} baris · ${fmtWaktu(r.selesai)}</small></div>${r.status === 'Selesai' ? `<span class="badge b-ok">Selesai</span>` : `<span class="badge b-mut">Dihentikan</span>`}</div>${r.url ? `<a class="btn btn-outline btn-sm" href="${esc(r.url)}" target="_blank" rel="noopener">${ic('open_in_new', 's16')}Buka arsip</a>` : ''}</div>`).join('')}</div>` : emptyBox('Belum ada arsip', 'Riwayat pemindahan data akan tampil di sini.', 'inventory_2')}</div>`;
  },
  pvHtml(pv) {
    return `<div class="kv c3"><div><dt>Baris dipindah</dt><dd>${fmtNum(pv.n)}</dd></div><div><dt>Perkiraan ukuran</dt><dd>${fmtByte(pv.byte)}</dd></div><div><dt>Rentang</dt><dd style="font-size:12.5px">${pv.n ? esc(String(pv.min).slice(0, 10)) + ' – ' + esc(String(pv.max).slice(0, 10)) : '—'}</dd></div></div>
      ${pv.n ? `<div class="row between wrap mt-12" style="gap:8px"><span class="faint" style="font-size:12px">${pv.pulih ? ic('restore', 's14') + ' Dapat dipulihkan lewat Migrasi Data.' : ic('info', 's14') + ' Hanya disimpan sebagai arsip (tidak dipulihkan ke aplikasi).'}</span><button class="btn btn-danger btn-sm" data-act="ptArJalan">${ic('inventory_2', 's16')}Arsipkan ${fmtNum(pv.n)} baris</button></div>` : `<p class="faint mt-12" style="font-size:12.5px">Tidak ada data ${esc(pv.label)} sebelum batas ini.</p>`}`;
  },
  progHtml() {
    const p = this.prog || {}, pct = p.total ? Math.min(100, p.n / p.total * 100) : 0;
    return `<div class="row between" style="gap:8px"><b style="font-size:13px"><span class="spin"></span> Memindahkan ${esc(p.label || '')}…</b><span class="muted" style="font-size:12.5px">${fmtNum(p.n || 0)} / ${fmtNum(p.total || 0)} baris</span></div>
      <div class="meter mt-12" style="height:8px"><i style="width:${pct}%;background:var(--chart-4)"></i></div>
      <p class="faint mt-12" style="font-size:12px">${ic('info', 's14')} Berjalan per batch. Halaman boleh ditinggal; bila koneksi putus, lanjutkan dari menu ini tanpa data ganda.</p>`;
  },
  async jalan(payload) {
    if (this.running) return;
    this.running = true;
    const ar = this.ar || {}, t = (ar.tabel || []).find((x) => x.key === (payload.tabel || (ar.job && ar.job.tabel))) || {};
    this.prog = { label: t.label || (ar.job && ar.job.label), n: (ar.job && ar.job.n) || 0, total: (ar.job && ar.job.total) || (this.pv && this.pv.n) || 0 };
    if (this.aktif('arsip')) this.arsip();
    let r = null;
    try {
      for (let i = 0; i < 2000; i++) {
        r = await API.call('pantau.arsipJalankan', payload, { timeout: 90000 });
        payload = {};
        Object.assign(this.prog, { n: r.n, total: r.total || this.prog.total, label: r.label || this.prog.label });
        const h = $('[data-ar-hasil]'); if (h && this.aktif('arsip')) h.innerHTML = this.progHtml();
        if (r.selesai) break;
      }
      toast('ok', 'Arsip selesai', fmtNum(r.n) + ' baris ' + r.label + ' dipindah ke Google Drive.' + (r.pulih ? ' Dapat dipulihkan lewat Migrasi Data.' : ''));
    } catch (e) { errToast(e, 'Arsip terhenti — data aman, tekan Lanjutkan'); }
    this.running = false; this.prog = null; this.pv = null; this.d = null;
    if (this.aktif('arsip')) this.arsip(true);
  }
};

ACT.ptSegar = () => Sync.run('Memperbarui kapasitas…', PAGES.pantau.kapasitas(true));
ACT.ptDetak = (el) => { el.disabled = true; Sync.run('Mengirim detak…', API.call('pantau.detak', {})).then((d) => { PAGES.pantau.d = d; toast('ok', 'Detak terkirim', 'Database Supabase tercatat aktif.'); if (PAGES.pantau.aktif('kapasitas')) PAGES.pantau.kapasitas(); }).catch((e) => { el.disabled = false; errToast(e, 'Detak gagal'); }); };
ACT.ptKeArsip = (el) => go('pantau', { tab: 'arsip', arsip: el.dataset.k });
SUBMIT.ptAuCari = (f) => { const g = (n) => String(f.elements[n].value || '').trim(); const P = PAGES.pantau; Object.assign(P.af, { q: g('q'), aksi: g('aksi'), peran: g('peran'), dari: g('dari'), sampai: g('sampai') }); if (P.af.dari && P.af.sampai && P.af.dari > P.af.sampai) return toast('warn', 'Rentang tanggal terbalik', '"Dari" harus sebelum "Sampai".'); P.apage = 1; P.audit(true); };
ACT.ptAuReset = () => { const P = PAGES.pantau; P.af = { q: '', aksi: '', peran: '', dari: '', sampai: '' }; P.apage = 1; P.formAudit(); P.audit(true); };
ACT.ptAuPage = (el) => { const P = PAGES.pantau; P.apage = Math.max(1, +el.dataset.p); P.audit(true).then(() => { const l = $('[data-pt-au]'); if (l) l.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); };
ACT.ptAuUnduh = async () => {
  const a = PAGES.pantau.au; if (!a || !a.rows.length) return;
  try {
    await loadLib('xlsx');
    const H = ['Waktu', 'Pelaku', 'Peran', 'Aksi', 'Target', 'Ringkasan'];
    const ws = XLSX.utils.aoa_to_sheet([H].concat(a.rows.map((r) => H.map((h) => String(r[h] || '')))));
    await unduhXlsx([{ name: 'Audit_Log', ws }], 'Audit_Log_hal-' + a.page + '_' + todayYmd() + '.xlsx');
  } catch (e) { errToast(e, 'Unduhan gagal'); }
};
CHG.ptArTabel = (el) => { const P = PAGES.pantau; P.pilih = el.value; P.pv = null; P.arsip(); };
SUBMIT.ptArPratinjau = (f) => {
  const P = PAGES.pantau, tabel = f.elements.tabel.value, sampai = String(f.elements.sampai.value || '').trim();
  if (!sampai) return toast('warn', 'Isi batas tanggal');
  const h = $('[data-ar-hasil]'); if (h) h.innerHTML = skelRows(2, 40);
  API.call('pantau.arsipPratinjau', { tabel, sampai }).then((pv) => { P.pv = pv; if (P.aktif('arsip')) { const x = $('[data-ar-hasil]'); if (x) x.innerHTML = P.pvHtml(pv); } }).catch((e) => { if (h) h.innerHTML = `<div class="banner bad">${ic('error')}<div><b>Tidak dapat dipratinjau</b><p>${esc(e.message)}</p></div></div>`; });
};
ACT.ptArJalan = () => {
  const P = PAGES.pantau, pv = P.pv; if (!pv || !pv.n) return;
  Modal.confirm({ title: 'Pindahkan ke arsip?', icon: 'inventory_2', danger: true, size: 'sm',
    msg: `<b>${fmtNum(pv.n)} baris ${esc(pv.label)}</b> sebelum <b>${esc(pv.sampai)}</b> akan disalin ke spreadsheet arsip di Google Drive, lalu <b>dihapus dari Supabase</b>.${pv.pulih ? ' Data dapat dipulihkan lewat Pengaturan → Migrasi Data.' : ' Data ini tidak dipulihkan ke aplikasi (hanya arsip).'}`,
    input: { label: 'Ketik ARSIPKAN untuk melanjutkan', placeholder: 'ARSIPKAN', required: true, match: 'ARSIPKAN', matchMsg: 'Ketik ARSIPKAN (huruf kapital).' }, ok: 'Arsipkan' })
    .then((v) => { if (v) P.jalan({ tabel: pv.tabel, sampai: pv.sampai, konfirmasi: v }); });
};
ACT.ptArLanjut = () => PAGES.pantau.jalan({});
ACT.ptArHenti = () => Modal.confirm({ title: 'Hentikan arsip?', icon: 'stop_circle', msg: 'Baris yang sudah tersalin tetap di arsip & dihapus dari Supabase; sisanya tetap di Supabase. Arsip dapat dimulai lagi kapan saja.', ok: 'Hentikan' })
  .then((ok) => { if (!ok) return; Sync.run('Menghentikan arsip…', API.call('pantau.arsipHentikan', {})).then((r) => { toast('ok', 'Arsip dihentikan', fmtNum(r.n) + ' baris sudah terarsip.'); PAGES.pantau.arsip(true); }).catch((e) => errToast(e)); });
