document.addEventListener('DOMContentLoaded', () => {
  const target = document.querySelector(".typewriter");
  if (!target) return;

  // 从 data-text 属性获取文本内容
  const text = target.getAttribute("data-text") || "默认文本";  // 如果没有设置 data-text 则使用默认文本
  let i = 0;
  let isDeleting = false;
  let speed = 100; // 打字/删除速度（ms）

  function typeLoop() {
    const currentText = target.innerHTML;
    
    // 打字阶段
    if (!isDeleting && i < text.length) {
      target.innerHTML = text.substring(0, i + 1);
      i++;
      speed = 400; // 打字速度
    }
    // 删除阶段
    else if (isDeleting && i >= 0) {
      target.innerHTML = text.substring(0, i);
      i--;
      speed = 50;  // 删除速度更快
    }
    // 切换阶段
    if (i === text.length) {
      isDeleting = true;
      speed = 1500; // 完成打字后暂停
    } else if (i === 0 && isDeleting) {
      isDeleting = false;
      speed = 500;  // 开始新一轮前暂停
    }

    setTimeout(typeLoop, speed);
  }

  // 启动动画
  typeLoop();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) typeLoop();
    });
  });
  observer.observe(target);  // 观察目标元素
});
