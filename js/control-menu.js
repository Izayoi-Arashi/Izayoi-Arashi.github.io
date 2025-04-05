// 确保 marked.js 已加载
function checkMarked() {
  return new Promise((resolve) => {
    if (window.marked) return resolve();
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  // 等待必要资源
  await checkMarked();

  // 原始DOM引用保持不变
  const menuToggle = document.getElementById("menu-toggle");
  const menuContent = document.getElementById("menu-content");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const musicControl = document.getElementById("music-control");
  const musicPlayer = document.getElementById("music-player");
  const musicIcon = document.getElementById("music-icon");
  const announcementToggle = document.getElementById("announcement-toggle");
  const announcementModal = document.getElementById("announcement-modal");
  const closeModal = document.querySelector(".close-modal");
  const announcementContent = document.getElementById("announcement-content");

  // 菜单状态控制（完全保留原始逻辑）
  let isMenuOpen = localStorage.getItem("menu-open") === "true";
  updateMenuState();

  function updateMenuState() {
    if (isMenuOpen) {
      menuContent.style.opacity = "1";
      menuContent.style.visibility = "visible";
      menuContent.style.transform = "translateY(calc(-100% - 10px))";
      menuToggle.textContent = "✕";
    } else {
      menuContent.style.opacity = "0";
      menuContent.style.visibility = "hidden";
      menuContent.style.transform = "translateY(0)";
      menuToggle.textContent = "☰";
    }
  }

  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
    localStorage.setItem("menu-open", isMenuOpen);
    updateMenuState();
  });

  document.addEventListener("click", function (e) {
    if (!menuContent.contains(e.target) && e.target !== menuToggle) {
      isMenuOpen = false;
      localStorage.setItem("menu-open", isMenuOpen);
      updateMenuState();
    }
  });

  // 深色模式（完全保留原始逻辑）
  let darkMode = localStorage.getItem("dark-mode");

  function applyDarkMode(state) {
    document.body.classList.toggle("dark-mode", state);
    darkModeToggle.textContent = state ? "☀️" : "🌙";
    localStorage.setItem("dark-mode", state);
  }

  const hour = new Date().getHours();
  const shouldBeDark = hour >= 18 || hour < 6;
  if (darkMode === null) darkMode = shouldBeDark ? "true" : "false";

  darkModeToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    darkMode = darkMode === "true" ? "false" : "true";
    applyDarkMode(darkMode === "true");
  });

  applyDarkMode(darkMode === "true");

  // 音乐控制（完全保留原始逻辑）
  let isMusicExpanded = localStorage.getItem("music-expanded") !== "false";

  function initMusicPlayer() {
    if (isMusicExpanded) {
      musicPlayer.style.width = "280px";
      musicPlayer.style.height = "86px";
    } else {
      musicPlayer.style.width = "0";
      musicPlayer.style.height = "0";
    }
  }

  musicControl.addEventListener("click", function (e) {
    e.stopPropagation();
    isMusicExpanded = !isMusicExpanded;
    localStorage.setItem("music-expanded", isMusicExpanded);
    initMusicPlayer();
  });

  initMusicPlayer();

  // 公告功能改造重点
  function getCorrectAnnouncementPath() {
    // 获取Jekyll配置的路径
    const rawPath = "{{ site.announcement_path | default: '/announcements/am.md' }}";
    
    // 已经是绝对路径或完整URL
    if (rawPath.startsWith('http') || rawPath.startsWith('/')) {
      return "{{ site.url }}{{ site.baseurl }}" + rawPath;
    }
    
    // 处理相对路径（计算当前页面深度）
    const depth = window.location.pathname.split('/').filter(Boolean).length - 1;
    return '../'.repeat(depth) + rawPath;
  }

  async function loadAnnouncement() {
    try {
      const url = getCorrectAnnouncementPath() + `?t=${Date.now()}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      let text = await response.text();
      text = text.replace(/^---[\s\S]*?---/, '').trim();
      
      announcementContent.innerHTML = text ? 
        marked.parse(text) : 
        '<p class="no-content">暂无公告</p>';
      
      announcementModal.style.display = "block";
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error('公告加载失败:', error);
      announcementContent.innerHTML = `
        <div class="alert-error">
          <strong>⚠️ 加载失败</strong>
          <p>${error.message}</p>
          <small>路径: ${getCorrectAnnouncementPath()}</small>
          <button onclick="location.reload()" style="margin-top:10px;">刷新重试</button>
        </div>
      `;
      announcementModal.style.display = "block";
    }
  }

  // 事件绑定（保持原始交互逻辑）
  announcementToggle.addEventListener("click", function(e) {
    e.stopPropagation();
    loadAnnouncement();
  });

  closeModal.addEventListener("click", function() {
    announcementModal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  window.addEventListener("click", function(event) {
    if (event.target === announcementModal) {
      announcementModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // 响应式调整（完全保留原始逻辑）
  function handleResize() {
    if (window.innerWidth <= 768) {
      musicPlayer.style.right = "60px";
      musicPlayer.style.bottom = "10px";
      musicPlayer.style.maxWidth = "80vw";
    } else {
      musicPlayer.style.right = "80px";
      musicPlayer.style.bottom = "20px";
      musicPlayer.style.maxWidth = "none";
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }

  window.addEventListener("resize", debounce(handleResize, 200));
  handleResize();
});
