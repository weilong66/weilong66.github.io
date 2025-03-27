$(document).ready(function () {

    /* const $reloadSvg = $('#reload-swf');
    const playButton = $('<svg id="pause-icon" width="20px" viewBox="0 0 64 64"><rect x="10" y="4" width="15" height="55" fill="white"></rect><rect x="44" y="4" width="15" height="55" fill="white"></rect></svg>');
    playButton.insertBefore($reloadSvg);

    const newSvg = $('<svg width="20px" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VolumeUpIcon"><path d="M3 9v6h4l5 5V4L7 9zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77" fill="white"></path></svg>');
    const $infoSvg = $('#toggle-info');
    newSvg.insertBefore($infoSvg);
    newS.insertBefore(newSvg); */

    // 创建播放/暂停按钮
    const playPauseButton = $('<i>', {
        id: 'play-pause-button',
        class: 'fas fa-pause' // 音量图标
    });

    // 创建音量按钮
    const volumeButton = $('<i>', {
        id: 'volume-button',
        class: 'fas fa-volume-up' // 音量图标
    });

    // 创建音量滑块
    const volumeSlider = $('<input>', {
        type: 'range',
        id: 'volume-slider',
        min: 0.00,
        max: 1.00,
        value: 0.50,
        step: 0.01
    });


    const $toggleInfo = $('#toggle-info');
    // 将播放按钮插入到#button-reload后面
    $toggleInfo.after(playPauseButton);
    // 将音量按钮和音量滑块插入到#button-reload前面
    $toggleInfo.before(volumeButton);
    $toggleInfo.before(volumeSlider);

    // 监听播放/暂停按钮的点击事件
    playPauseButton.on('click', function () {
        if ($(this).attr('class').includes('fa-pause')) {
            $(this).removeClass('fa-pause').addClass('fa-play'); // 播放图标
            player.ruffle().suspend() //暂停ruffle中的swf文件
        } else {
            $(this).removeClass('fa-play').addClass('fa-pause'); // 暂停图标
            player.ruffle().resume() //播放或恢复ruffle中的swf文件
        }
    });
    //监听ruffle的播放按钮点击事件
    if(player){
        $(player.shadowRoot).find('#play-button').first().on('click', function () {
            if (!player.ruffle().suspended) {
                playPauseButton.removeClass('fa-play').addClass('fa-pause'); // 暂停图标
            }
        });
    }
    

    let volume = 0.50; // 初始音量值
    volumeSlider.val(volume);

    // 监听音量滑块的变化
    volumeSlider.on('input', function () {
        event.preventDefault();//阻止默认行为
        volume = $(this).val();
        player.ruffle().volume = volume;
        if (volume > 0 && volumeButton.attr('class').includes('fa-volume-mute')) {
            volumeButton.removeClass('fa-volume-mute').addClass('fa-volume-up'); // 音量图标
        } else if (volume == 0) {
            volumeButton.removeClass('fa-volume-up').addClass('fa-volume-mute'); // 静音图标
        }
    });

    // 监听音量按钮的点击事件
    let oldVolume = volume; //上次音量值
    volumeButton.on('click', function () {
        if (volume > 0) {
            // 保存当前音量
            oldVolume = volume;
            // 静音
            volume = 0;
            player.ruffle().volume = volume;
            volumeSlider.val(volume);
            $(this).removeClass('fa-volume-up').addClass('fa-volume-mute'); // 静音图标
        } else {
            // 恢复音量
            volume = oldVolume;
            player.ruffle().volume = volume;
            volumeSlider.val(volume);
            $(this).removeClass('fa-volume-mute').addClass('fa-volume-up'); // 音量图标
        }
    });

})