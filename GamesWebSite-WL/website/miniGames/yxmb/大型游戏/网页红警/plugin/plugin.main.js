$(function(){
    function attemptInsertButton(attemptNumber = 1, maxAttempts = 5) {
        var $closeButton = $('.close-button');

        if ($closeButton.length) {
            console.log('元素已找到，执行脚本...');
            
            // 创建一个新的button元素
            var $newButton = $('<a>', {
                id: 'about-button',
                href: './plugin/content/about.html',
                target: '_blank',
                title: '详细说明',
                text: 'About' // 给新按钮添加一些文本
            });

            // 在close-button之后插入新的button
            $closeButton.after($newButton);
        } else if (attemptNumber < maxAttempts) {
            // 使用setTimeout确保延迟执行
            setTimeout(function() {
                attemptInsertButton(attemptNumber + 1, maxAttempts);
            }, 2000); // 延迟1秒(1000毫秒)
        } else {
            console.log('元素未找到，请手动打开');
        }
    }

    // 开始第一次尝试
    setTimeout(function() {
        attemptInsertButton();
    }, 1000);
    
});