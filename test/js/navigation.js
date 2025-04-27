// 导航功能
const navButtons = document.querySelectorAll('.nav-button');
const sections = document.querySelectorAll('.section');

navButtons.forEach(button => {
    button.addEventListener('click', function() {
        // 更新按钮状态
        navButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // 显示对应的部分
        const sectionId = this.getAttribute('data-section');
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                section.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                section.classList.remove('active');
                section.classList.remove('animate__animated', 'animate__fadeIn');
            }
        });
    });
}); 