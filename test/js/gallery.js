// 存储图片数据
let images = [];

// DOM 元素
const fileInput = document.getElementById('file-input');
const preview = document.getElementById('preview');
const loading = document.getElementById('loading');
const gallery = document.getElementById('gallery');
const noImages = document.getElementById('no-images');

// 压缩图片
function compressImage(base64Str, maxWidth = 800) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // 计算缩放比例
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // 压缩为 JPEG 格式，质量 0.7
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
    });
}

// 从localStorage加载图片
function loadImages() {
    try {
        const savedImages = localStorage.getItem('gallery-images');
        if (savedImages) {
            images = JSON.parse(savedImages);
            console.log('Loaded images:', images.length);
            // 验证加载的图片数据
            images = images.filter(img => img && img.src && img.src.startsWith('data:image'));
            if (images.length !== JSON.parse(savedImages).length) {
                console.warn('Some images were invalid and removed');
                saveImages(); // 保存清理后的图片数组
            }
        }
    } catch (error) {
        console.error('Error loading images:', error);
        images = [];
    }
}

// 保存图片到localStorage
function saveImages() {
    try {
        // 检查localStorage是否可用
        if (typeof localStorage === 'undefined') {
            throw new Error('localStorage is not available');
        }

        // 检查存储空间
        const testKey = 'test-storage';
        try {
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
        } catch (e) {
            throw new Error('Storage is full');
        }

        // 保存图片数据
        const imagesToSave = images.map(img => ({
            src: img.src,
            timestamp: img.timestamp,
            likes: img.likes || 0,
            liked: img.liked || false
        }));

        localStorage.setItem('gallery-images', JSON.stringify(imagesToSave));
        console.log('Saved images:', imagesToSave.length);
    } catch (error) {
        console.error('Error saving images:', error);
        // 如果存储失败，尝试清理一些旧图片
        if (images.length > 0) {
            images = images.slice(-5); // 只保留最新的5张图片
            try {
                const imagesToSave = images.map(img => ({
                    src: img.src,
                    timestamp: img.timestamp,
                    likes: img.likes || 0,
                    liked: img.liked || false
                }));
                localStorage.setItem('gallery-images', JSON.stringify(imagesToSave));
                console.log('Saved reduced images:', imagesToSave.length);
            } catch (e) {
                console.error('Failed to save even reduced images:', e);
            }
        }
    }
}

// 初始化画廊
function initGallery() {
    loadImages();
    if (images.length > 0) {
        noImages.style.display = 'none';
        renderGallery();
    } else {
        noImages.style.display = 'block';
    }
}

// 渲染图片画廊
function renderGallery() {
    // 清空画廊
    gallery.innerHTML = '';
    
    if (images.length === 0) {
        gallery.innerHTML = '<div class="no-images animate__animated animate__fadeIn">还没有图片，请上传一些图片！</div>';
        return;
    }
    
    // 隐藏"没有图片"提示
    noImages.style.display = 'none';
    
    // 渲染每张图片
    images.forEach((image, index) => {
        const card = document.createElement('div');
        card.className = 'image-card animate__animated animate__fadeIn';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="image-container">
                <img src="${image.src}" alt="上传的图片" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7mnK/kuIDkuKrmlofku7Y8L3RleHQ+PC9zdmc+';">
            </div>
            <div class="image-info">
                <span>${new Date(image.timestamp).toLocaleDateString()}</span>
                <button class="like-btn ${image.liked ? 'active' : ''}" onclick="toggleLike(${index})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${image.liked ? '#e74c3c' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span class="like-count">${image.likes}</span>
                </button>
            </div>
        `;
        
        gallery.appendChild(card);
    });
}

// 切换点赞状态
function toggleLike(index) {
    if (images[index]) {
        images[index].liked = !images[index].liked;
        images[index].likes = images[index].liked ? images[index].likes + 1 : images[index].likes - 1;
        saveImages();
        renderGallery();
    }
}

// 处理文件选择
fileInput.addEventListener('change', async function(e) {
    if (this.files.length > 0) {
        console.log('Files selected:', this.files.length);
        preview.style.display = 'block';
        preview.innerHTML = '';
        loading.style.display = 'block';
        
        // 预览选择的图片
        for (const file of Array.from(this.files)) {
            if (file.type.startsWith('image/')) {
                console.log('Processing image:', file.name, 'Size:', file.size);
                try {
                    const reader = new FileReader();
                    
                    reader.onload = async function(event) {
                        console.log('File loaded successfully:', file.name);
                        try {
                            // 压缩图片
                            const compressedImage = await compressImage(event.target.result);
                            
                            // 创建预览
                            const img = document.createElement('img');
                            img.src = compressedImage;
                            img.className = 'animate__animated animate__fadeIn';
                            preview.appendChild(img);
                            
                            // 添加到图片数组
                            const newImage = {
                                src: compressedImage,
                                timestamp: Date.now(),
                                likes: 0,
                                liked: false
                            };
                            
                            images.push(newImage);
                            saveImages();
                            renderGallery();
                        } catch (error) {
                            console.error('Error processing image:', error);
                            alert('处理图片时出错，请重试');
                        }
                    };
                    
                    reader.onerror = function(error) {
                        console.error('Error reading file:', error);
                        alert('读取文件时出错，请重试');
                    };
                    
                    reader.readAsDataURL(file);
                } catch (error) {
                    console.error('Error processing file:', error);
                    alert('处理文件时出错，请重试');
                }
            } else {
                console.warn('Skipped non-image file:', file.name);
            }
        }
        
        // 完成上传
        setTimeout(() => {
            loading.style.display = 'none';
            preview.style.display = 'none';
            fileInput.value = '';
        }, 1500);
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing gallery...');
    initGallery();
}); 