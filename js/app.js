// 核心元素获取
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.querySelector('.play-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const progressBar = document.querySelector('.progress-bar');
const progressTrack = document.querySelector('.progress-track');
const progressThumb = document.querySelector('.progress-thumb');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const musicCover = document.querySelector('.music-cover');
const musicTitle = document.querySelector('.music-title');
const musicSinger = document.querySelector('.music-singer');
const playlist = document.querySelector('.playlist');
const playlistItems = document.querySelectorAll('.playlist li');
const volumeBar = document.querySelector('.volume-bar');
const volumeTrack = document.querySelector('.volume-track');
const volumeThumb = document.querySelector('.volume-thumb');

// 播放列表索引
let currentSongIndex = 0;
// 歌曲列表数据
let songs = [];

// 初始化歌曲列表
function initSongs() {
    playlistItems.forEach((item, index) => {
        songs.push({
            src: item.dataset.src,
            cover: item.dataset.cover,
            title: item.dataset.title,
            singer: item.dataset.singer,
            element: item
        });
    });
}

// 格式化时间 (秒 -> mm:ss)
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 加载歌曲
function loadSong(songIndex) {
    // 重置激活状态
    playlistItems.forEach(item => item.classList.remove('active'));
    songs[songIndex].element.classList.add('active');
    
    // 更新歌曲信息
    audioPlayer.src = songs[songIndex].src;
    musicCover.src = songs[songIndex].cover;
    musicTitle.textContent = songs[songIndex].title;
    musicSinger.textContent = songs[songIndex].singer;
    
    // 重置进度条
    progressTrack.style.width = '0%';
    progressThumb.style.left = '0%';
    
    // 加载完成后更新总时长
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    }, { once: true });
    
    currentSongIndex = songIndex;
}

// 播放/暂停切换
function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.innerHTML = '<i class="fa fa-pause"></i>';
        musicCover.style.animationPlayState = 'running';
    } else {
        audioPlayer.pause();
        playBtn.innerHTML = '<i class="fa fa-play"></i>';
        musicCover.style.animationPlayState = 'paused';
    }
}

// 更新进度条
function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressTrack.style.width = `${progress}%`;
    progressThumb.style.left = `${progress}%`;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
}

// 跳转到指定时间
function seekProgress(e) {
    const progressWidth = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / progressWidth) * duration;
}

// 调整音量
function adjustVolume(e) {
    const volumeWidth = volumeBar.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / volumeWidth;
    audioPlayer.volume = volume;
    volumeTrack.style.width = `${volume * 100}%`;
    volumeThumb.style.left = `${volume * 100}%`;
}

// 上一曲
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (!audioPlayer.paused) {
        audioPlayer.play();
    }
}

// 下一曲
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (!audioPlayer.paused) {
        audioPlayer.play();
    }
}

// 播放列表点击事件
function handlePlaylistClick(e) {
    if (e.target.tagName === 'LI') {
        const index = Array.from(playlistItems).indexOf(e.target);
        loadSong(index);
        togglePlay();
    }
}

// 初始化播放器
function initPlayer() {
    initSongs();
    loadSong(currentSongIndex);
    
    // 事件监听
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('click', seekProgress);
    volumeBar.addEventListener('click', adjustVolume);
    playlist.addEventListener('click', handlePlaylistClick);
    
    // 歌曲播放结束自动下一曲
    audioPlayer.addEventListener('ended', nextSong);
}

// 页面加载完成初始化
document.addEventListener('DOMContentLoaded', initPlayer);