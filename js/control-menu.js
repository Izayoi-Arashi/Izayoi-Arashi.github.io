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
        // 如果是首次访问，默认启用花瓣效果
        if (localStorage.getItem("first-visit") === null) {
            petalsEnabled = true;
            localStorage.setItem("first-visit", "true");
        }

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
   document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const modeIcon = darkModeToggle.querySelector("i");

    let darkMode = localStorage.getItem("dark-mode");

    // 根据时间自动切换深色模式
    function autoSwitchDarkMode() {
        const hours = new Date().getHours();
        // 假设晚上7点到早上7点为深色模式
        if (hours >= 19 || hours < 7) {
            if (darkMode !== "true") {
                applyDarkMode(true);
            }
        } else {
            if (darkMode !== "false") {
                applyDarkMode(false);
            }
        }
    }

    // 应用深色模式
    function applyDarkMode(state) {
        document.body.classList.toggle("dark-mode", state);
        localStorage.setItem("dark-mode", state);
        updateButtonIcon(state);
    }

    // 更新按钮图标
    function updateButtonIcon(state) {
        modeIcon.className = state ? "fas fa-sun" : "fas fa-moon";
    }

    // 手动切换深色模式
    darkModeToggle.addEventListener("click", function (e) {
        e.stopPropagation(); // 防止事件冒泡
        darkMode = darkMode === "true" ? "false" : "true";
        applyDarkMode(darkMode === "true");
    });

    // 初始化时检查并应用深色模式
    if (darkMode === null) {
        autoSwitchDarkMode();  // 如果没有手动设置，按照时间自动切换
    } else {
        applyDarkMode(darkMode === "true");
    }
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

    // 邮箱复制功能优化
emailCopy.addEventListener("click", function (e) {
    e.stopPropagation();
    
    // 尝试使用mailto打开邮件客户端
    const emailAddress = "arashiizayoi@qq.com";
    const mailtoLink = `mailto:${emailAddress}`;

    // 创建一个隐藏的 <a> 标签并触发点击事件
    const mailtoLinkElement = document.createElement('a');
    mailtoLinkElement.href = mailtoLink;
    mailtoLinkElement.style.display = 'none';
    document.body.appendChild(mailtoLinkElement);

    // 监听邮件客户端是否成功打开
    const openEmailClient = setTimeout(() => {
        // 如果在短时间内邮件客户端没有打开，尝试复制邮箱地址
        navigator.clipboard.writeText(emailAddress)
            .then(() => showNotification("邮箱已复制"))
            .catch(() => showNotification("复制失败", true));
    }, 2000);

    // 尝试打开邮件客户端
    mailtoLinkElement.click();

    // 如果邮件客户端成功打开，清除超时定时器
    clearTimeout(openEmailClient);

    // 移除临时创建的 <a> 标签
    document.body.removeChild(mailtoLinkElement);
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

    for (let i = 0; i < 30; i++) {  // 增加花瓣数量
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // 设置花瓣的大小、动画时间、延迟等
        const size = Math.random() * 15 + 5;  // 设置花瓣的大小在10px到20px之间
        const duration = Math.random() * 6 + 4; // 设置飘落时间在4秒到10秒之间
        const delay = Math.random() * 5;  // 设置随机延迟
        const rotation = Math.random() * 360;  // 随机旋转角度
        
        // 设置花瓣的位置、动画时间和旋转角度
        petal.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            left: ${Math.random() * 100}vw;  // 随机横向位置
            top: -${size}px;  // 从上方掉落
            background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);  // 花瓣渐变色
            transform: rotate(${rotation}deg);
            animation-name: fall, sway;
        `;
        
        container.appendChild(petal);
    }
}

// 停止花瓣效果
function stopPetals() {
    const existing = document.querySelector('.falling-petals');
    if (existing) existing.remove();
}

// 添加动画效果
const styles = document.createElement('style');
styles.innerHTML = `
    @keyframes fall {
        0% { top: -10px; }
        100% { top: 100vh; }
    }
    @keyframes sway {
        0% { transform: rotate(0deg) translateX(0); }
        50% { transform: rotate(10deg) translateX(30px); }
        100% { transform: rotate(-10deg) translateX(-30px); }
    }
`;
document.head.appendChild(styles);


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
