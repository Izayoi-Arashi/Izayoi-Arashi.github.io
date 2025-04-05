/**
 * 主应用初始化
 */
class App {
  constructor() {
    this.elements = {
      menuToggle: document.getElementById("menu-toggle"),
      menuContent: document.getElementById("menu-content"),
      darkModeToggle: document.getElementById("dark-mode-toggle"),
      musicControl: document.getElementById("music-control"),
      musicPlayer: document.getElementById("music-player"),
      announcementToggle: document.getElementById("announcement-toggle"),
      announcementModal: document.getElementById("announcement-modal"),
      announcementContent: document.getElementById("announcement-content")
    };
    
    this.state = {
      isMenuOpen: localStorage.getItem("menu-open") === "true",
      darkMode: localStorage.getItem("dark-mode") || 
                (new Date().getHours() >= 18 || new Date().getHours() < 6 ? "true" : "false"),
      musicExpanded: localStorage.getItem("music-expanded") !== "false"
    };
  }

  init() {
    this.initMenu();
    this.initDarkMode();
    this.initMusicPlayer();
    this.initAnnouncement();
    this.initResizeHandler();
  }

  initMenu() {
    if (!this.elements.menuToggle) return;
    
    this.updateMenuState();
    
    this.elements.menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      this.state.isMenuOpen = !this.state.isMenuOpen;
      localStorage.setItem("menu-open", this.state.isMenuOpen);
      this.updateMenuState();
    });

    document.addEventListener("click", (e) => {
      if (!this.elements.menuContent.contains(e.target) && 
          e.target !== this.elements.menuToggle) {
        this.state.isMenuOpen = false;
        localStorage.setItem("menu-open", this.state.isMenuOpen);
        this.updateMenuState();
      }
    });
  }

  updateMenuState() {
    if (this.state.isMenuOpen) {
      this.elements.menuContent.style.opacity = "1";
      this.elements.menuContent.style.visibility = "visible";
      this.elements.menuContent.style.transform = "translateY(calc(-100% - 10px))";
      this.elements.menuToggle.textContent = "✕";
    } else {
      this.elements.menuContent.style.opacity = "0";
      this.elements.menuContent.style.visibility = "hidden";
      this.elements.menuContent.style.transform = "translateY(0)";
      this.elements.menuToggle.textContent = "☰";
    }
  }

  initDarkMode() {
    if (!this.elements.darkModeToggle) return;
    
    this.applyDarkMode(this.state.darkMode === "true");
    
    this.elements.darkModeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      this.state.darkMode = this.state.darkMode === "true" ? "false" : "true";
      this.applyDarkMode(this.state.darkMode === "true");
    });
  }

  applyDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);
    this.elements.darkModeToggle.textContent = enabled ? "☀️" : "🌙";
    localStorage.setItem("dark-mode", enabled);
  }

  initMusicPlayer() {
    if (!this.elements.musicControl) return;
    
    this.updateMusicPlayer();
    
    this.elements.musicControl.addEventListener("click", (e) => {
      e.stopPropagation();
      this.state.musicExpanded = !this.state.musicExpanded;
      localStorage.setItem("music-expanded", this.state.musicExpanded);
      this.updateMusicPlayer();
    });
  }

  updateMusicPlayer() {
    if (this.state.musicExpanded) {
      this.elements.musicPlayer.style.width = "280px";
      this.elements.musicPlayer.style.height = "86px";
    } else {
      this.elements.musicPlayer.style.width = "0";
      this.elements.musicPlayer.style.height = "0";
    }
  }

  initAnnouncement() {
    if (!this.elements.announcementToggle) return;
    
    // 事件委托处理所有弹窗交互
    document.body.addEventListener("click", (e) => {
      if (e.target.closest("#announcement-toggle")) {
        e.preventDefault();
        this.loadAnnouncement();
      }
      
      if (e.target.closest(".close-modal") || e.target === this.elements.announcementModal) {
        this.elements.announcementModal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }

  async loadAnnouncement() {
    try {
      // 动态生成绝对路径
      const path = "{{ site.announcement_path | default: '/announcements/am.md' }}";
      const baseUrl = "{{ site.url }}{{ site.baseurl }}";
      const announcementUrl = `${baseUrl}${path}?t=${Date.now()}`;
      
      const response = await fetch(announcementUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      let text = await response.text();
      text = text.replace(/^---[\s\S]*?---/, '').trim();
      
      this.elements.announcementContent.innerHTML = text 
        ? marked.parse(text) 
        : '<p class="no-content">暂无公告内容</p>';
      
      this.elements.announcementModal.style.display = "block";
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("公告加载失败:", error);
      this.elements.announcementContent.innerHTML = `
        <div class="alert-error">
          <strong>⚠️ 加载失败</strong>
          <p>${error.message}</p>
          <button class="retry-btn">点击重试</button>
        </div>
      `;
      this.elements.announcementModal.style.display = "block";
      
      // 添加重试按钮事件
      document.querySelector(".retry-btn")?.addEventListener("click", () => {
        this.loadAnnouncement();
      });
    }
  }

  initResizeHandler() {
    const debounce = (func, wait) => {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
      };
    };

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        this.elements.musicPlayer.style.right = "60px";
        this.elements.musicPlayer.style.bottom = "10px";
        this.elements.musicPlayer.style.maxWidth = "80vw";
      } else {
        this.elements.musicPlayer.style.right = "80px";
        this.elements.musicPlayer.style.bottom = "20px";
        this.elements.musicPlayer.style.maxWidth = "none";
      }
    };

    window.addEventListener("resize", debounce(handleResize, 200));
    handleResize();
  }
}

// 启动应用
document.addEventListener("DOMContentLoaded", () => {
  // 确保marked.js已加载
  if (!window.marked) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.onload = () => new App().init();
    document.head.appendChild(script);
  } else {
    new App().init();
  }
});
