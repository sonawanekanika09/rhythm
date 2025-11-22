// ------------------ MULTIPLE USERS ---------------------

const USERS = {
    "admin": "12345",
    "rahul": "11111",
    "kedar": "99999",
    "test": "00000"
};

// ----------------------- AUTH MODULE -------------------------

const Auth = {
    login() {
        const user = document.getElementById("username").value.trim();
        const pass = document.getElementById("password").value.trim();

        if (!user || !pass) {
            return this.showMsg("loginMsg", "Enter username & password");
        }

        if (!USERS[user] || USERS[user] !== pass) {
            return this.showMsg("loginMsg", "Invalid Login Details");
        }

        localStorage.setItem("user", user);
        window.location.href = "dashboard.html";
    },

    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("activeSongs");
        window.location.href = "index.html";
    },

    checkLogin() {
        if (!localStorage.getItem("user")) {
            window.location.href = "index.html";
        }
    },

    showProfile() {
        const user = localStorage.getItem("user");
        document.getElementById("profileUser").innerText = user;
    },

    showMsg(id, msg) {
        document.getElementById(id).innerHTML = `<span style='color:#ff5252;'>${msg}</span>`;
    }
};

// Protect pages
if (location.pathname.includes("dashboard.html") || location.pathname.includes("profile.html")) {
    Auth.checkLogin();
}



// ----------------------- MUSIC MODULE -------------------------

const Music = {
    getUserSongs() {
        const user = localStorage.getItem("user");
        return JSON.parse(localStorage.getItem("songs_" + user) || "[]");
    },

    saveUserSongs(songs) {
        const user = localStorage.getItem("user");
        localStorage.setItem("songs_" + user, JSON.stringify(songs));
    },

    upload() {
        const file = document.getElementById("songFile").files[0];

        if (!file) {
            return Auth.showMsg("uploadMsg", "Select an audio file");
        }

        if (!file.type.startsWith("audio/")) {
            return Auth.showMsg("uploadMsg", "Only audio files allowed");
        }

        let songs = this.getUserSongs();

        if (songs.some(s => s.name === file.name)) {
            return Auth.showMsg("uploadMsg", "Song already exists!");
        }

        songs.push({
            name: file.name,
            url: URL.createObjectURL(file)
        });

        this.saveUserSongs(songs);
        this.loadSongs();

        Auth.showMsg("uploadMsg", "<span style='color:#00e676;'>Uploaded!</span>");
    },

    delete(index) {
        let songs = this.getUserSongs();
        songs.splice(index, 1);
        this.saveUserSongs(songs);
        this.loadSongs();
    },

    loadSongs() {
        const list = document.getElementById("songList");
        if (!list) return;

        list.innerHTML = "";

        let songs = this.getUserSongs();

        songs.forEach((song, index) => {
            const li = document.createElement("li");

            li.innerHTML = `
                <span>${song.name}</span>
                <button class="deleteBtn" onclick="Music.delete(${index})">X</button>
            `;

            li.onclick = (e) => {
                if (e.target.tagName === "BUTTON") return; 
                const player = document.getElementById("player");
                player.src = song.url;
                player.play();
            };

            list.appendChild(li);
        });
    }
};

if (location.pathname.includes("dashboard.html")) {
    Music.loadSongs();
    document.getElementById("activeUser").innerText = "👤 " + localStorage.getItem("user");
}

if (location.pathname.includes("profile.html")) {
    Auth.showProfile();
}
