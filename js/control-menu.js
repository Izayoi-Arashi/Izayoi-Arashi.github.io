@@ -127,100 +127,100 @@
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
         const size = Math.random() * 15 + 10;  // 设置花瓣的大小在10px到25px之间
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
