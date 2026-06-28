// ==================== STATE ====================
const QUICK_QUESTIONS = [
  "我的订单什么时候发货？",
  "如何申请退款退货？",
  "产品有质量问题怎么办？",
  "支持哪些支付方式？",
  "如何修改收货地址？"
];

const DEFAULT_BRAND = "潮品数码商城 — 专注年轻人的数码好物，覆盖手机配件、耳机、智能穿戴等品类，7天无理由退换，极速发货。";

let messages = [];
let brandInfo = DEFAULT_BRAND;
let editingBrand = false;
let loading = false;

// ==================== AI SIMULATION ====================
const SMART_REPLIES = {
  default: [
    "感谢您的咨询 😊 让我来帮您解答～",
    "好的，我了解您的问题了，请稍等……",
    "这是一个常见问题，我来为您详细说明一下 👇"
  ],
  order: [
    "您好！订单一般在下单后 24-48 小时内安排发货哦 📦\n\n如果您需要查询具体订单的发货状态，请提供订单号，我可以帮您进一步确认。一般情况下，发货后您会收到包含物流单号的短信提醒。",
    "我们一般会在 1-2 个工作日内发货，物流信息会在发货后同步更新 📮\n\n如遇活动期间订单量较大，可能会有轻微延迟，敬请谅解。如需加急，可以联系人工客服哦～",
    "发货时效：正常 48 小时内发出 ✈️\n\n您可以关注短信通知或在小程序「我的订单」中查看物流进度。如果超过 48 小时仍未发货，可能是商品临时缺货，建议联系人工客服确认～"
  ],
  refund: [
    "退款退货流程很简单哦，跟着下面几步就行 🙌\n\n1️⃣ 在「我的订单」中找到对应订单\n2️⃣ 点击「申请退款/退货」\n3️⃣ 选择退款原因并提交\n4️⃣ 审核通过后会生成退货地址\n5️⃣ 寄回商品后等待退款到账\n\n我们支持 7 天无理由退换，审核一般 24 小时内完成 💚",
    "退货很方便的！我们支持 7 天无理由退换服务 🔄\n\n操作步骤：\n→ 进入「我的订单」\n→ 选择需要退货的商品\n→ 点击「申请售后」\n→ 填写退货原因\n→ 提交后等待审核（通常 1 个工作日内）\n\n审核通过后您会收到退货地址，退款将在收到退货后 3-5 个工作日内原路返回 💰"
  ],
  quality: [
    "非常抱歉给您带来不便！如果产品存在质量问题，我们一定会负责到底 💪\n\n📋 请按以下步骤处理：\n1. 先拍照/录视频保留凭证\n2. 在订单详情页点击「申请售后」\n3. 选择「质量问题」并上传凭证\n4. 客服会在 24 小时内审核处理\n\n可申请换货或退款，来回运费由我们承担。再次为不好的体验道歉 🙏",
    "产品有质量问题？别担心，我们一定帮您处理好 😊\n\n首先请您拍几张能体现问题的照片，然后在订单页面提交售后申请，选择「商品质量问题」+ 上传图片。\n\n我们的售后团队会在收到申请后尽快处理，支持免费换新或全额退款，不需要您承担任何运费 🛡️"
  ],
  payment: [
    "目前我们支持以下支付方式 💳\n\n✅ 微信支付\n✅ 支付宝\n✅ 银行卡支付（借记卡/信用卡）\n✅ Apple Pay\n\n暂时不支持货到付款哦～支付过程中如遇到问题，随时找我 😊",
    "付款方式多多！您可以用以下几种：\n\n📱 微信支付 / 支付宝 — 最快捷\n💳 银行卡 — 支持国内主流银行\n🍎 Apple Pay — iOS 用户专属\n\n所有支付均通过加密通道，安全有保障 🔒 暂不支持货到付款和分期哦～"
  ],
  address: [
    "修改收货地址很简单，看这里 🏠\n\n如果订单还未发货：\n→ 进入「我的订单」→ 找到对应订单 → 点击「修改地址」即可\n\n如果订单已经发货：\n→ 需要联系人工客服协助更改，我们会帮您联系快递公司修改配送信息\n\n建议下单前仔细核对地址，避免不必要的麻烦哦 📍",
    "收货地址怎么改？分两种情况 📝\n\n❌ 未发货订单：直接在「我的订单」页面修改，即时生效\n✅ 已发货订单：需要联系人工客服，由我们帮您联系物流修改\n\n📌 小提示：发货后修改地址可能会增加 1-2 天的配送时间哦～"
  ],
  greet: [
    "您好！欢迎来到潮品数码商城 🙌 有什么可以帮您的吗？",
    "Hi～很高兴为您服务 😊 请问有什么想了解的？",
    "您好呀！有什么需要帮忙的吗？无论是产品咨询还是售后问题，都可以问我哦 💬"
  ],
  fallback: [
    "抱歉，这个问题涉及到具体的账户/订单信息，建议您联系人工客服处理哦 📞\n\n您可以拨打客服热线或在公众号留言，我们会尽快为您解决～",
    "这个问题我需要更多信息才能准确回答 😊 建议您：\n\n1. 在订单页查看相关说明\n2. 联系人工客服获取一对一服务\n3. 在工作时间拨打 400 客服热线\n\n还有什么其他我能帮您的吗？"
  ]
};

function getAIReply(userMsg) {
  const text = userMsg.toLowerCase().replace(/\s/g, '');

  if (/你好|hi|hello|在吗/.test(text)) {
    return pickRandom(SMART_REPLIES.greet);
  }
  if (/发货|物流|订单.*什么时候|什么时候.*发|快递|发货时间/.test(text)) {
    return pickRandom(SMART_REPLIES.order);
  }
  if (/退款|退货|退换|退钱|申请退款|如何退/.test(text)) {
    return pickRandom(SMART_REPLIES.refund);
  }
  if (/质量|坏了|有问题|瑕疵|破损|次品|不能用/.test(text)) {
    return pickRandom(SMART_REPLIES.quality);
  }
  if (/支付|付款|微信|支付宝|银行卡|怎么付|支付方式/.test(text)) {
    return pickRandom(SMART_REPLIES.payment);
  }
  if (/地址|收货|修改地址|收货地址|改地址/.test(text)) {
    return pickRandom(SMART_REPLIES.address);
  }

  // Longer unknown queries → fallback
  if (text.length > 8 && !/[吗呢吧啊？?]$/.test(text)) {
    return pickRandom(SMART_REPLIES.fallback);
  }

  return pickRandom(SMART_REPLIES.default);
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ==================== DOM HELPERS ====================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ==================== RENDER ====================
function renderQuickBtns() {
  const container = document.getElementById('quickBtns');
  container.innerHTML = QUICK_QUESTIONS.map(q =>
    `<button class="quick-btn" onclick="sendMessage('${q.replace(/'/g, "\\'")}')" ${loading ? 'disabled' : ''}>${q}</button>`
  ).join('');
}

function renderBrandDisplay() {
  const text = brandInfo;
  document.getElementById('brandDisplay').innerHTML =
    (text.length > 60 ? text.slice(0, 60) + '…' : text) +
    '<div class="edit-hint">点击编辑 ✎</div>';
}

function renderMessages() {
  const container = document.getElementById('messages');
  const emptyState = document.getElementById('emptyState');

  if (messages.length === 0) {
    container.innerHTML = '';
    container.appendChild(createEmptyState());
    return;
  }

  let html = '<div class="welcome-banner"><div class="wb-icon">✨</div><div class="wb-text"><h4>Demo 演示模式</h4><p>本 Demo 为离线演示版本，模拟 AI 客服智能应答。实际产品接入 DeepSeek 大模型。</p></div></div>';

  messages.forEach(msg => {
    const isUser = msg.role === 'user';
    html += `<div class="msg-row ${isUser ? 'user' : 'assistant'}">`;
    if (!isUser) {
      html += '<div class="msg-avatar ai">🤖</div>';
    }
    html += `<div class="msg-bubble ${isUser ? 'user' : 'ai'}">`;
    if (!isUser) {
      html += '<div class="ai-label">✦ AI 回复</div>';
    }
    html += `<div style="white-space:pre-wrap">${escHtml(msg.content)}</div>`;
    html += '</div>';
    if (isUser) {
      html += '<div class="msg-avatar user">👤</div>';
    }
    html += '</div>';
  });

  if (loading) {
    html += `
      <div class="msg-row assistant">
        <div class="msg-avatar ai">🤖</div>
        <div class="msg-bubble ai" style="padding:14px 18px;">
          <div class="typing-dots">
            <div class="dot"></div><div class="dot"></div><div class="dot"></div>
          </div>
        </div>
      </div>`;
  }

  container.innerHTML = html;
  scrollToBottom();
}

function createEmptyState() {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.id = 'emptyState';
  div.innerHTML = '<div class="icon-lg">💬</div><h3>有什么可以帮你的？</h3><p>点击左侧常见问题或直接输入</p>';
  return div;
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function scrollToBottom() {
  const container = document.getElementById('messages');
  setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
}

// ==================== BRAND EDIT ====================
function startEditBrand() {
  if (loading) return;
  editingBrand = true;
  document.getElementById('brandInput').value = brandInfo;
  document.getElementById('brandView').style.display = 'none';
  document.getElementById('brandEdit').style.display = 'block';
  document.getElementById('brandInput').focus();
}

function saveBrand() {
  brandInfo = document.getElementById('brandInput').value.trim() || DEFAULT_BRAND;
  editingBrand = false;
  document.getElementById('brandView').style.display = 'block';
  document.getElementById('brandEdit').style.display = 'none';
  renderBrandDisplay();
}

function cancelEditBrand() {
  editingBrand = false;
  document.getElementById('brandInput').value = brandInfo;
  document.getElementById('brandView').style.display = 'block';
  document.getElementById('brandEdit').style.display = 'none';
}

// ==================== CHAT LOGIC ====================
async function sendMessage(text) {
  const input = document.getElementById('msgInput');
  const msgText = (text || input.value.trim());

  if (!msgText || loading) return;

  messages.push({ role: 'user', content: msgText });
  input.value = '';
  input.style.height = 'auto';
  loading = true;
  updateSendBtn();
  renderMessages();
  renderQuickBtns();

  // Simulate AI thinking delay
  await sleep(600 + Math.random() * 800);

  const reply = getAIReply(msgText);
  messages.push({ role: 'assistant', content: reply });
  loading = false;
  renderMessages();
  renderQuickBtns();
  updateSendBtn();
  input.focus();
}

function clearChat() {
  if (loading) return;
  messages = [];
  renderMessages();
  document.getElementById('msgInput').focus();
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  updateSendBtn();
}

function updateSendBtn() {
  const input = document.getElementById('msgInput');
  const btn = document.getElementById('sendBtn');
  const hasText = input.value.trim().length > 0;
  btn.className = 'send-btn ' + (hasText && !loading ? 'active' : 'inactive');
}

// ==================== SIDEBAR TOGGLE ====================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// ==================== INIT ====================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function init() {
  renderBrandDisplay();
  renderQuickBtns();
  renderMessages();
  document.getElementById('msgInput').addEventListener('input', () => updateSendBtn());
  document.getElementById('msgInput').focus();
}

init();
