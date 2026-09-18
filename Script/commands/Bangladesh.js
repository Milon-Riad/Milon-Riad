const axios = require('axios');
const crypto = require('crypto');

// ======================= AUTHOR LOCK (V2) =======================
const AUTHOR = "𝕸𝖎𝖑𝖔𝖓";
const AUTHOR_HASH = crypto.createHash('sha256').update(AUTHOR).digest('hex');

function verifyAuthor() {
  const currentHash = crypto.createHash('sha256').update(AUTHOR).digest('hex');
  if (currentHash !== AUTHOR_HASH) {
    throw new Error(`⛔ এই কোডটি শুধুমাত্র ${AUTHOR} এর জন্য লক করা।`);
  }
}
// ================================================================

// Configuration
const API_BASE = 'https://bdapi.vercel.app/api/v1';
const TIMEOUT = 10000;
const MAX_RETRIES = 2;
const ITEMS_PER_PAGE = 20;
const CACHE_TTL = 86400000; // 1 day

// Caches
const cache = new Map();
const sessions = new Map();

// ------------------------------------------------------------------
// Helper: fetch with retry & timeout
async function fetchWithRetry(url, retries = MAX_RETRIES) {
  try {
    const response = await axios.get(url, { timeout: TIMEOUT });
    return response.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

// ------------------------------------------------------------------
// Cache helpers
function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ------------------------------------------------------------------
// API wrappers (cached)
async function getDivisions() {
  const cached = getCached('divisions');
  if (cached) return cached;
  const data = await fetchWithRetry(`${API_BASE}/divisions`);
  setCached('divisions', data);
  return data;
}

async function getDistricts(divisionId) {
  const key = `districts_${divisionId}`;
  const cached = getCached(key);
  if (cached) return cached;
  const data = await fetchWithRetry(`${API_BASE}/districts?division_id=${divisionId}`);
  setCached(key, data);
  return data;
}

async function getUpazilas(districtId) {
  const key = `upazilas_${districtId}`;
  const cached = getCached(key);
  if (cached) return cached;
  const data = await fetchWithRetry(`${API_BASE}/upazilas?district_id=${districtId}`);
  setCached(key, data);
  return data;
}

async function getUnions(upazilaId) {
  const key = `unions_${upazilaId}`;
  const cached = getCached(key);
  if (cached) return cached;
  const data = await fetchWithRetry(`${API_BASE}/unions?upazila_id=${upazilaId}`);
  setCached(key, data);
  return data;
}

// ------------------------------------------------------------------
// Format list with pagination
function formatList(items, page, totalPages, levelName, parentName = '') {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, items.length);
  const pageItems = items.slice(start, end);

  let msg = `🇧🇩 বাংলাদেশ\n`;
  if (parentName) msg += `📌 ${parentName}\n`;
  msg += `📋 ${levelName} তালিকা (পৃষ্ঠা ${page}/${totalPages})\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;

  pageItems.forEach((item, index) => {
    const serial = start + index + 1;
    const name = item.bn_name || item.name || 'অজানা';
    msg += `${serial}. ${name}\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  const nav = [];
  if (totalPages > 1) {
    nav.push(`📖 ${page}/${totalPages}`);
    if (page > 1) nav.push(`⬅️ 'prev'`);
    if (page < totalPages) nav.push(`➡️ 'next'`);
  }
  nav.push(`🔙 '0' পেছনে`);
  nav.push(`❌ 'cancel' বাতিল`);
  msg += nav.join(' | ');
  return msg;
}

// ------------------------------------------------------------------
// Session management
function getSession(chatId) {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, {
      step: null,
      parentName: '',
      divisionName: '',
      districtName: '',
      selectedDivision: null,
      selectedDistrict: null,
      selectedUpazila: null,
      items: [],
      page: 1,
      totalPages: 1,
    });
  }
  return sessions.get(chatId);
}

function clearSession(chatId) {
  sessions.delete(chatId);
}

// ------------------------------------------------------------------
// Main command
async function handle(ctx) {
  try {
    verifyAuthor();
  } catch (err) {
    return ctx.reply(err.message);
  }

  const chatId = ctx.chat.id;
  try {
    const divisions = await getDivisions();
    if (!Array.isArray(divisions) || divisions.length === 0) {
      return ctx.reply('⚠️ বিভাগের তালিকা লোড করা সম্ভব হয়নি।');
    }

    const session = getSession(chatId);
    session.step = 'division';
    session.items = divisions;
    session.parentName = '';
    session.divisionName = '';
    session.districtName = '';
    session.selectedDivision = null;
    session.selectedDistrict = null;
    session.selectedUpazila = null;
    session.page = 1;
    session.totalPages = Math.ceil(divisions.length / ITEMS_PER_PAGE);

    await ctx.reply(formatList(divisions, 1, session.totalPages, 'বিভাগ'));
  } catch (error) {
    console.error('Error in /bd:', error);
    await ctx.reply('⚠️ একটি ত্রুটি ঘটেছে, দয়া করে আবার চেষ্টা করুন।');
  }
}

// ------------------------------------------------------------------
// Reply handler
async function handleReply(ctx) {
  try {
    verifyAuthor();
  } catch (err) {
    return ctx.reply(err.message);
  }

  const chatId = ctx.chat.id;
  const userInput = ctx.text.trim();

  if (!sessions.has(chatId)) {
    return ctx.reply('⚠️ কোনো সক্রিয় সেশন নেই। /bd দিয়ে শুরু করুন।');
  }

  const session = getSession(chatId);

  // Cancel
  if (userInput.toLowerCase() === 'cancel') {
    clearSession(chatId);
    return ctx.reply('❌ বাতিল করা হয়েছে।');
  }

  // Back (0)
  if (userInput === '0') {
    if (session.step === 'division') {
      clearSession(chatId);
      return ctx.reply('🔙 শুরুতে ফিরে গেছেন। /bd দিয়ে আবার শুরু করুন।');
    } else if (session.step === 'district') {
      // back to divisions
      const divisions = getCached('divisions');
      if (!divisions) {
        clearSession(chatId);
        return ctx.reply('⚠️ ডেটা পাওয়া যায়নি, আবার /bd দিন।');
      }
      session.step = 'division';
      session.selectedDivision = null;
      session.items = divisions;
      session.page = 1;
      session.totalPages = Math.ceil(divisions.length / ITEMS_PER_PAGE);
      session.parentName = '';
      return ctx.reply(formatList(divisions, 1, session.totalPages, 'বিভাগ'));
    } else if (session.step === 'upazila') {
      // back to districts
      const divisionId = session.selectedDivision;
      const districts = getCached(`districts_${divisionId}`);
      if (!districts) {
        clearSession(chatId);
        return ctx.reply('⚠️ ডেটা পাওয়া যায়নি, আবার /bd দিন।');
      }
      session.step = 'district';
      session.selectedDistrict = null;
      session.items = districts;
      session.page = 1;
      session.totalPages = Math.ceil(districts.length / ITEMS_PER_PAGE);
      session.parentName = session.divisionName || '';
      return ctx.reply(formatList(districts, 1, session.totalPages, 'জেলা', session.parentName));
    } else if (session.step === 'union') {
      // back to upazilas
      const districtId = session.selectedDistrict;
      const upazilas = getCached(`upazilas_${districtId}`);
      if (!upazilas) {
        clearSession(chatId);
        return ctx.reply('⚠️ ডেটা পাওয়া যায়নি, আবার /bd দিন।');
      }
      session.step = 'upazila';
      session.selectedUpazila = null;
      session.items = upazilas;
      session.page = 1;
      session.totalPages = Math.ceil(upazilas.length / ITEMS_PER_PAGE);
      session.parentName = session.districtName || '';
      return ctx.reply(formatList(upazilas, 1, session.totalPages, 'উপজেলা', session.parentName));
    }
    return;
  }

  // Pagination: next / prev (supports 'n' / 'p')
  const lower = userInput.toLowerCase();
  if (lower === 'next' || lower === 'n') {
    if (session.page < session.totalPages) {
      session.page++;
      const level = session.step === 'division' ? 'বিভাগ' : (session.step === 'district' ? 'জেলা' : (session.step === 'upazila' ? 'উপজেলা' : 'ইউনিয়ন'));
      return ctx.reply(formatList(session.items, session.page, session.totalPages, level, session.parentName));
    } else {
      return ctx.reply('📌 আপনি শেষ পৃষ্ঠায় আছেন।');
    }
  }
  if (lower === 'prev' || lower === 'p') {
    if (session.page > 1) {
      session.page--;
      const level = session.step === 'division' ? 'বিভাগ' : (session.step === 'district' ? 'জেলা' : (session.step === 'upazila' ? 'উপজেলা' : 'ইউনিয়ন'));
      return ctx.reply(formatList(session.items, session.page, session.totalPages, level, session.parentName));
    } else {
      return ctx.reply('📌 আপনি প্রথম পৃষ্ঠায় আছেন।');
    }
  }

  // Selection (number)
  const num = parseInt(userInput, 10);
  if (!isNaN(num) && num >= 1 && num <= ITEMS_PER_PAGE) {
    const start = (session.page - 1) * ITEMS_PER_PAGE;
    const index = start + num - 1;
    if (index >= session.items.length) {
      return ctx.reply('⚠️ ভুল নম্বর, আবার চেষ্টা করুন।');
    }
    const selected = session.items[index];

    if (session.step === 'division') {
      const divisionId = selected.id || selected._id;
      if (!divisionId) return ctx.reply('⚠️ বিভাগ আইডি পাওয়া যায়নি।');
      try {
        const districts = await getDistricts(divisionId);
        if (!Array.isArray(districts) || districts.length === 0) {
          return ctx.reply('⚠️ এই বিভাগে কোনো জেলা নেই।');
        }
        session.step = 'district';
        session.selectedDivision = divisionId;
        session.items = districts;
        session.page = 1;
        session.totalPages = Math.ceil(districts.length / ITEMS_PER_PAGE);
        session.divisionName = selected.bn_name || selected.name || 'বিভাগ';
        session.parentName = session.divisionName;
        return ctx.reply(formatList(districts, 1, session.totalPages, 'জেলা', session.parentName));
      } catch (error) {
        console.error('Error fetching districts:', error);
        return ctx.reply('⚠️ জেলার তালিকা লোড করতে ত্রুটি হয়েছে।');
      }
    } else if (session.step === 'district') {
      const districtId = selected.id || selected._id;
      if (!districtId) return ctx.reply('⚠️ জেলা আইডি পাওয়া যায়নি।');
      try {
        const upazilas = await getUpazilas(districtId);
        if (!Array.isArray(upazilas) || upazilas.length === 0) {
          return ctx.reply('⚠️ এই জেলায় কোনো উপজেলা নেই।');
        }
        session.step = 'upazila';
        session.selectedDistrict = districtId;
        session.items = upazilas;
        session.page = 1;
        session.totalPages = Math.ceil(upazilas.length / ITEMS_PER_PAGE);
        session.districtName = selected.bn_name || selected.name || 'জেলা';
        session.parentName = session.districtName;
        return ctx.reply(formatList(upazilas, 1, session.totalPages, 'উপজেলা', session.parentName));
      } catch (error) {
        console.error('Error fetching upazilas:', error);
        return ctx.reply('⚠️ উপজেলার তালিকা লোড করতে ত্রুটি হয়েছে।');
      }
    } else if (session.step === 'upazila') {
      const upazilaId = selected.id || selected._id;
      if (!upazilaId) return ctx.reply('⚠️ উপজেলা আইডি পাওয়া যায়নি।');
      try {
        const unions = await getUnions(upazilaId);
        if (!Array.isArray(unions) || unions.length === 0) {
          return ctx.reply('⚠️ এই উপজেলায় কোনো ইউনিয়ন নেই।');
        }
        session.step = 'union';
        session.selectedUpazila = upazilaId;
        session.items = unions;
        session.page = 1;
        session.totalPages = Math.ceil(unions.length / ITEMS_PER_PAGE);
        session.parentName = selected.bn_name || selected.name || 'উপজেলা';
        return ctx.reply(formatList(unions, 1, session.totalPages, 'ইউনিয়ন', session.parentName));
      } catch (error) {
        console.error('Error fetching unions:', error);
        return ctx.reply('⚠️ ইউনিয়নের তালিকা লোড করতে ত্রুটি হয়েছে।');
      }
    } else if (session.step === 'union') {
      const unionName = selected.bn_name || selected.name || 'ইউনিয়ন';
      await ctx.reply(`✅ ${unionName} নির্বাচিত হয়েছে।\n🔚 সেশন শেষ।`);
      clearSession(chatId);
      return;
    }
  } else {
    return ctx.reply('⚠️ সঠিক নম্বর, 'next', 'prev', '0' অথবা 'cancel' দিন।');
  }
}

// ------------------------------------------------------------------
// Export (Mirai V3)
module.exports = [
  {
    name: 'bd',
    aliases: ['বাংলাদেশ'],
    category: 'সেবা',
    description: 'বাংলাদেশের প্রশাসনিক বিভাগ, জেলা, উপজেলা ও ইউনিয়নের তালিকা দেখান।',
    usage: '/bd',
    handle,
    handleReply,
  },
];
