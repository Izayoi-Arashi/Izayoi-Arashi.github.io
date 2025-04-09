document.addEventListener("DOMContentLoaded", function () {
    // DOM元素引用
    const menuToggle = document.getElementById("menu-toggle");
    const menuContent = document.getElementById("menu-content");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const musicControl = document.getElementById("music-control");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const musicPlayer = document.getElementById("music-player");
    const petalsToggle = document.getElementById("petals-toggle");
    const emailCopy = document.getElementById("email-copy");

    // 状态变量
    let isMenuOpen = localStorage.getItem("menu-open") === "true";
    let darkMode = localStorage.getItem("dark-mode");
    let petalsEnabled = localStorage.getItem("petals-enabled") === "true";

    // 初始化函数
    function init() {
        updateMenuState();
        applyDarkMode(darkMode === "true");
        initMusicPlayer();
        if (petalsEnabled) startPetals();
    }

    // 菜单控制
    function updateMenuState() {
        const menuIcon = menuToggle.querySelector("i");
        if (isMenuOpen) {
            menuContent.style.opacity = "1";
            menuContent.style.visibility = "visible";
            menuIcon.className = "fas fa-times";
        } else {
            menuContent.style.opacity = "0";
            menuContent.style.visibility = "hidden";
            menuIcon.className = "fas fa-bars";
        }
    }

    menuToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        localStorage.setItem("menu-open", isMenuOpen);
        updateMenuState();
    });

    // 深色模式
    function applyDarkMode(state) {
        const modeIcon = darkModeToggle.querySelector("i");
        document.body.classList.toggle("dark-mode", state);
        modeIcon.className = state ? "fas fa-sun" : "fas fa-moon";
        localStorage.setItem("dark-mode", state);
    }

    darkModeToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        darkMode = darkMode === "true" ? "false" : "true";
        applyDarkMode(darkMode === "true");
    });

    // 音乐控制
    function initMusicPlayer() {
        const playIcon = playPauseBtn.querySelector("i");
        musicPlayer.play().then(() => {
            playIcon.className = "fas fa-pause";
        }).catch(() => {
            playIcon.className = "fas fa-play";
        });

        playPauseBtn.addEventListener("click", function () {
            if (musicPlayer.paused) {
                musicPlayer.play();
                playIcon.className = "fas fa-pause";
            } else {
                musicPlayer.pause();
                playIcon.className = "fas fa-play";
            }
        });
    }

    // 邮箱复制功能
    emailCopy.addEventListener("click", function (e) {
        e.stopPropagation();
        navigator.clipboard.writeText("your-email@example.com")
            .then(() => showNotification("邮箱已复制"))
            .catch(() => showNotification("复制失败", true));
    });

    // 显示提示通知
    function showNotification(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `notification-toast${isError ? ' error' : ''}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // 花瓣效果
    petalsToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        petalsEnabled = !petalsEnabled;
        localStorage.setItem("petals-enabled", petalsEnabled);
        petalsEnabled ? startPetals() : stopPetals();
    });

    function startPetals() {
        stopPetals(); // 先清除现有花瓣
        const container = document.createElement('div');
        container.className = 'falling-petals';
        document.body.appendChild(container);

        for (let i = 0; i < 20; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.cssText = `
                animation-duration: ${Math.random() * 5 + 4}s;
                animation-delay: ${Math.random() * 5}s;
                left: ${Math.random() * 100}vw;
                ${document.body.classList.contains('dark-mode') ? 
                    'background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' : 
                    'background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'}
            `;
            container.appendChild(petal);
        }
    }

    function stopPetals() {
        const existing = document.querySelector('.falling-petals');
        if (existing) existing.remove();
    }

    // 响应式调整
    function handleResize() {
        if (window.innerWidth <= 768) {
            musicPlayer.style.right = "60px";
            musicPlayer.style.bottom = "15px";
        } else {
            musicPlayer.style.right = "80px";
            musicPlayer.style.bottom = "20px";
        }
    }

    window.addEventListener('resize', debounce(handleResize, 200));
    handleResize();

    // 工具函数
    function debounce(func, wait) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    // 页面加载完成后隐藏加载页面并显示内容
    window.addEventListener('load', function() {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    });

    // 初始化所有功能
    init();
});
