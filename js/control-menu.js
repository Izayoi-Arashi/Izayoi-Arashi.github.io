document.addEventListener("DOMContentLoaded", function () {
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

    const announcementPath = "{{ site.announcement_path | default: '/announcements/announcement.md' }}";

    let isMenuOpen = localStorage.getItem("menu-open") === "true";
    updateMenuState();

    menuToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        localStorage.setItem("menu-open", isMenuOpen);
        updateMenuState();
    });

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

    document.addEventListener("click", function (e) {
        if (!menuContent.contains(e.target) && e.target !== menuToggle) {
            isMenuOpen = false;
            localStorage.setItem("menu-open", isMenuOpen);
            updateMenuState();
        }
    });

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

    announcementToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        loadAnnouncement();
        announcementModal.style.display = "block";
        document.body.style.overflow = "hidden";
    });

    closeModal.addEventListener("click", function () {
        announcementModal.style.display = "none";
        document.body.style.overflow = "auto";
    });

    window.addEventListener("click", function (event) {
        if (event.target === announcementModal) {
            announcementModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    function loadAnnouncement() {
        const announcementUrl = "{{ site.url }}{{ site.baseurl }}{{ site.announcement_path }}?t=" + Date.now();

        fetch(announcementUrl)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.text();
            })
            .then(text => {
                const content = text.replace(/^---[\s\S]*?---/, '').trim();
                announcementContent.innerHTML =
                    content ? marked.parse(content) : '<p class="no-content">暂无公告</p>';
            })
            .catch(error => {
                announcementContent.innerHTML = `
                    <div class="alert-error">
                        <strong>⚠️ 加载失败</strong>
                        <p>${error.message}</p>
                        <small>尝试访问: ${announcementUrl}</small>
                    </div>
                `;
            })
            .finally(() => {
                announcementModal.style.display = "block";
            });
    }

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

    window.addEventListener("resize", debounce(handleResize, 200));
    handleResize();

    function debounce(func, wait) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }
});
