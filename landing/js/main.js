        // 导航栏滚动效果
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // 数字递增动画
        function animateNumbers() {
            const counters = [
                { id: 'count1', target: 1200, suffix: '+', duration: 2000 },
                { id: 'count2', target: 5000, suffix: '+', duration: 2000 },
                { id: 'count3', target: 94, suffix: '%', duration: 2000 },
                { id: 'count4', target: 60, suffix: '%', duration: 2000 }
            ];

            counters.forEach(counter => {
                const element = document.getElementById(counter.id);
                if (!element) return;
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            let current = 0;
                            const increment = counter.target / (counter.duration / 16);
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= counter.target) {
                                    element.textContent = counter.target + counter.suffix;
                                    clearInterval(timer);
                                } else {
                                    element.textContent = Math.floor(current) + counter.suffix;
                                }
                            }, 16);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.3 });
                
                observer.observe(element);
            });
        }

        // 视口动画
        function setupScrollAnimations() {
            const elements = document.querySelectorAll('.animate-on-scroll');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            elements.forEach(element => observer.observe(element));
        }

        // 聊天功能模拟
        const SMART_REPLIES = {
            default: [
                "感谢您的咨询 \uD83D\uDE0A 让我来帮您解答～",
                "好的，我了解您的问题了，请稍等……",
                "这是一个常见问题，我来为您详细说明一下 \uD83D\uDC47"
            ],
            order: [
                "您好！订单一般在下单后 24-48 小时内安排发货哦 \uD83D\uDCE6\n\n如果您需要查询具体订单的发货状态，请提供订单号，我可以帮您进一步确认。",
                "我们一般会在 1-2 个工作日内发货，物流信息会在发货后同步更新 \uD83D\uDCEE"
            ],
            refund: [
                "退款退货流程很简单哦！我们支持7天无理由退换服务 \uD83D\uDD04\n\n操作步骤：进入「我的订单」→ 选择需要退货的商品 → 点击「申请售后」→ 填写退货原因 → 提交后等待审核。",
                "退货很方便的！审核通过后您会收到退货地址，退款将在收到退货后 3-5 个工作日内原路返回 \uD83D\uDCB0"
            ],
            payment: [
                "目前我们支持微信支付、支付宝、银行卡支付等方式 \uD83D\uDCB3\n\n所有支付均通过加密通道，安全有保障 \uD83D\uDD12",
                "付款方式多多！微信支付 / 支付宝最快捷，也支持银行卡和Apple Pay～"
            ],
            greet: [
                "您好！欢迎来到AI智能客服助手 \uD83D\uDE4C 有什么可以帮您的吗？",
                "Hi～很高兴为您服务 \uD83D\uDE0A 请问有什么想了解的？"
            ],
            fallback: [
                "抱歉，这个问题涉及到具体信息，建议您联系人工客服处理哦 \uD83D\uDCDE",
                "这个问题我需要更多信息才能准确回答 \uD83D\uDE0A 还有什么其他我能帮您的吗？"
            ]
        };

        function getAIReply(userMsg) {
            const text = userMsg.toLowerCase().replace(/\s/g, '');
            
            if (/你好|hi|hello|在吗/.test(text)) {
                return pickRandom(SMART_REPLIES.greet);
            }
            if (/发货|物流|订单.*什么时候|快递/.test(text)) {
                return pickRandom(SMART_REPLIES.order);
            }
            if (/退款|退货|退换|退钱/.test(text)) {
                return pickRandom(SMART_REPLIES.refund);
            }
            if (/支付|付款|微信|支付宝|银行卡/.test(text)) {
                return pickRandom(SMART_REPLIES.payment);
            }
            
            if (text.length > 8 && !/[吗呢吧啊？?]$/.test(text)) {
                return pickRandom(SMART_REPLIES.fallback);
            }
            
            return pickRandom(SMART_REPLIES.default);
        }

        function pickRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function sendChatMessage() {
            const input = document.getElementById('chatInput');
            const messagesArea = document.getElementById('chatMessages');
            const msgText = input.value.trim();
            
            if (!msgText) return;
            
            // 添加用户消息
            const userMessage = `
                <div class="message-row user">
                    <div class="message-bubble user">${msgText}</div>
                    <div class="message-avatar user">\uD83D\uDC64</div>
                </div>
            `;
            messagesArea.innerHTML += userMessage;
            
            input.value = '';
            messagesArea.scrollTop = messagesArea.scrollHeight;
            
            // 模拟AI回复
            setTimeout(() => {
                const reply = getAIReply(msgText);
                const aiMessage = `
                    <div class="message-row">
                        <div class="message-avatar ai">\uD83E\uDD16</div>
                        <div class="message-bubble ai">
                            <div class="message-label">✦ AI 回复</div>
                            ${reply}
                        </div>
                    </div>
                `;
                messagesArea.innerHTML += aiMessage;
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }, 800 + Math.random() * 600);
        }

        // 绑定聊天发送事件
        document.getElementById('chatSend').addEventListener('click', sendChatMessage);
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });

        // 表单提交处理
        document.getElementById('ctaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('nameInput').value.trim();
            const phone = document.getElementById('phoneInput').value.trim();
            
            if (!name || !phone) {
                showToast('请填写完整信息', 'error');
                return;
            }
            
            showToast('提交成功！我们将尽快与您联系', 'success');
            document.getElementById('ctaForm').reset();
        });

        // Toast通知函数
        function showToast(message, type = 'success') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
                <span class="toast-message">${message}</span>
            `;
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        // 初始化
        document.addEventListener('DOMContentLoaded', () => {
            animateNumbers();
            setupScrollAnimations();
        });
