function toggleParticles() {
    const particlesJS = document.getElementById('particles-js');
    const particlesCanvas = document.querySelector('.particles-js-canvas-el');
    if (particlesJS.style.display === 'none') {
        particlesJS.style.display = 'block'; // 显示
        if (!particlesCanvas) {
            newParticlesJS();
        }
        window.localStorage.setItem("particlesDisplay", "block");
    } else {
        particlesJS.style.display = 'none'; //隐藏
        window.localStorage.setItem("particlesDisplay", "none");
    }
    
}

