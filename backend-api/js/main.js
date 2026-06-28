/**
 * Backend API 页面交互逻辑
 * Trae 沙龙 Demo
 */

(function () {
    'use strict';

    /* ========== 1. 模拟 API 状态检测 ========== */
    function checkApiStatus() {
        const statusEl = document.getElementById('api-status');
        const dotEl = document.getElementById('status-dot');
        const timeEl = document.getElementById('response-time');

        if (!statusEl || !dotEl) return;

        // 模拟随机在线状态（90% 概率在线）
        const isOnline = Math.random() > 0.1;
        const responseTime = isOnline ? Math.floor(Math.random() * 300 + 80) : 0;

        if (isOnline) {
            statusEl.textContent = '在线';
            statusEl.style.color = '#16a34a';
            dotEl.classList.add('online');
            dotEl.classList.remove('offline');
        } else {
            statusEl.textContent = '离线';
            statusEl.style.color = '#dc2626';
            dotEl.classList.add('offline');
            dotEl.classList.remove('online');
        }

        if (timeEl) {
            timeEl.textContent = isOnline ? `${responseTime} ms` : '-- ms';
        }
    }

    // 初次检测 + 每 8 秒刷新一次
    checkApiStatus();
    setInterval(checkApiStatus, 8000);

    /* ========== 2. Tab 切换 ========== */
    function initTabs() {
        const tabGroups = new Map();

        document.querySelectorAll('.api-tab').forEach(tab => {
            const parentCard = tab.closest('.api-card');
            if (!parentCard) return;

            const cardKey = parentCard.dataset.api;
            if (!tabGroups.has(cardKey)) {
                tabGroups.set(cardKey, []);
            }
            tabGroups.get(cardKey).push(tab);

            tab.addEventListener('click', () => {
                // 移除同组所有 active
                tabGroups.get(cardKey).forEach(t => t.classList.remove('active'));
                // 激活当前
                tab.classList.add('active');

                // 切换内容面板
                const targetId = tab.dataset.tab;
                parentCard.querySelectorAll('.api-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    /* ========== 3. 代码复制功能 ========== */
    function initCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const targetId = btn.dataset.copy;
                const codeEl = document.getElementById(targetId);
                if (!codeEl) return;

                const text = codeEl.textContent;

                try {
                    await navigator.clipboard.writeText(text);
                    const originalText = btn.textContent;
                    btn.textContent = '已复制';
                    btn.classList.add('copied');

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('copied');
                    }, 1500);
                } catch (err) {
                    // 降级方案
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        const originalText = btn.textContent;
                        btn.textContent = '已复制';
                        btn.classList.add('copied');
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.classList.remove('copied');
                        }, 1500);
                    } catch (e) {
                        console.error('复制失败', e);
                    }
                    document.body.removeChild(textarea);
                }
            });
        });
    }

    /* ========== 4. 动态刷新响应时间（平滑动画） ========== */
    function animateResponseTime() {
        const timeEl = document.getElementById('response-time');
        if (!timeEl) return;

        // 在已有值基础上小幅波动，模拟真实监控
        setInterval(() => {
            const dotEl = document.getElementById('status-dot');
            const isOnline = dotEl && dotEl.classList.contains('online');
            if (!isOnline) return;

            const currentText = timeEl.textContent.replace(' ms', '');
            let current = parseInt(currentText, 10);
            if (isNaN(current)) current = 200;

            const change = Math.floor(Math.random() * 40) - 20;
            let next = current + change;
            next = Math.max(60, Math.min(500, next));
            timeEl.textContent = `${next} ms`;
        }, 3000);
    }

    /* ========== 初始化 ========== */
    document.addEventListener('DOMContentLoaded', () => {
        initTabs();
        initCopyButtons();
        animateResponseTime();
    });
})();
