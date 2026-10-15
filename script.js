// ==========================
// VARIABLES
// ==========================
let currentSongIndex = 0;
let playlists = {};

const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");

// ==========================
// SHOW SONGS
// ==========================

function showSongs(songArray = songs) {
    const songList = document.getElementById("songList");
    songList.innerHTML = "";
    songArray.forEach((song) => {
        const card = document.createElement("div");
        card.classList.add("song-card");
        card.innerHTML = `
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
            <small>${song.genre}</small>
        `;
        card.addEventListener("click", () => {
            currentSongIndex = songs.findIndex(s => s.id === song.id);
            renderCurrentSong();
        });
        songList.appendChild(card);
    });
}

// ==========================
// CURRENT SONG
// ==========================

function renderCurrentSong() {
    const song = songs[currentSongIndex];

    document.getElementById("songImage").src = song.image;
    document.getElementById("songTitle").textContent = song.title;
    document.getElementById("songArtist").textContent = song.artist;

    audio.src = song.audio;
    audio.load();
   
    audio.pause();
    playBtn.textContent = "▶";

}
// ==========================
// INITIAL LOAD
// ==========================

showSongs();
renderCurrentSong();

// ==========================
// GENRE FILTER
// ==========================

document.getElementById("genreFilter").addEventListener("change", function () {
    if (this.value === "All") {
        showSongs();
    } else {
        const filtered = songs.filter(song => song.genre === this.value);
        showSongs(filtered);
    }
});

// ==========================
// SEARCH SONG
// ==========================

document.getElementById("searchSong").addEventListener("keyup", function () {
    const text = this.value.toLowerCase();
    const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(text) ||
        song.artist.toLowerCase().includes(text)
    );
    showSongs(filtered);
});

// ==========================
// PLAY / PAUSE
// ==========================

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
});

// ==========================
// NEXT BUTTON
// ==========================

document.getElementById("nextBtn").addEventListener("click", () => {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    renderCurrentSong();
});

// ==========================
// PREVIOUS BUTTON
// ==========================

document.getElementById("prevBtn").addEventListener("click", () => {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    renderCurrentSong();
});

// ==========================
// THEME TOGGLE
// ==========================

document.getElementById("themeBtn").addEventListener("click", () => {
    const body = document.body;
    if (body.dataset.theme === "dark") {
        body.dataset.theme = "light";
    } else {
        body.dataset.theme = "dark";
    }
});

// ==========================
// CREATE PLAYLIST
// ==========================

const playlistInput = document.getElementById("playlistName");
const createPlaylistBtn = document.getElementById("createPlaylistBtn");
const playlistSelect = document.getElementById("playlistSelect");
const playlistList = document.getElementById("playlistList");
const playlistSongs = document.getElementById("playlistSongs");

createPlaylistBtn.addEventListener("click", () => {
    const name = playlistInput.value.trim();
    if (name === "") {
        alert("Enter playlist name");
        return;
    }
    if (playlists[name]) {
        alert("Playlist already exists");
        return;
    }
    playlists[name] = [];
    playlistInput.value = "";
    updatePlaylistUI();
});

// ==========================
// UPDATE PLAYLIST UI
// ==========================

function updatePlaylistUI() {
    playlistSelect.innerHTML = `<option value="">Select Playlist</option>`;
    playlistList.innerHTML = "";
    for (let name in playlists) {

        // dropdown

        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        playlistSelect.appendChild(option);

        // playlist names

        const div = document.createElement("div");
        div.classList.add("playlist-item");
        div.textContent = name;
        div.addEventListener("click", () => {
            showPlaylistSongs(name);
        });
        playlistList.appendChild(div);
    }
}

// ==========================
// ADD SONG TO PLAYLIST
// ==========================

document.getElementById("addPlaylistBtn").addEventListener("click", () => {
    const playlistName = playlistSelect.value;
    if (playlistName === "") {
        alert("Select a playlist first");
        return;
    }
    const song = songs[currentSongIndex];
    const exists = playlists[playlistName].some(s => s.id === song.id);
    if (!exists) {
        playlists[playlistName].push(song);
    }
    showPlaylistSongs(playlistName);
});

// ==========================
// SHOW PLAYLIST SONGS
// ==========================

function showPlaylistSongs(name) {
    playlistSongs.innerHTML = "";
    playlists[name].forEach(song => {
        const div = document.createElement("div");
        div.classList.add("song-card");
        div.innerHTML = `
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
        `;
        playlistSongs.appendChild(div);
    });
}

// ==========================
// SEARCH PLAYLIST
// ==========================

document.getElementById("searchPlaylist").addEventListener("keyup", function () {
    const text = this.value.toLowerCase();
    playlistList.innerHTML = "";
    for (let name in playlists) {
        if (name.toLowerCase().includes(text)) {
            const div = document.createElement("div");
            div.classList.add("playlist-item");
            div.textContent = name;
            div.onclick = () => showPlaylistSongs(name);
            playlistList.appendChild(div);
        }
    }

});

// ==========================
// AUTO NEXT SONG
// ==========================
audio.addEventListener("ended", () => {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    renderCurrentSong();
});