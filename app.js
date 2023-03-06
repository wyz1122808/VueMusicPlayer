const App = Vue.createApp({

    data() {
        return {
            audio: null,
            circleLeft: null,
            barWidth: null,
            duration: null,
            currentTime: null,
            isTimerPlaying: false,
            isLooping: false,
            tracks: [
                {
                    name: "DU-DDU DU-DDU",
                    artist: "BLACKPINK",
                    cover: "https://www.billboard.com/wp-content/uploads/2023/02/blackpink-sept-2022-billboard-1548.jpg",
                    source: "https://assets.codepen.io/8792744/DUDUDU.m4a",
                    favorited: false
                },
                {
                    name: "PINK VENOM",
                    artist: "BLACKPINK",
                    cover: "https://www.allkpop.com/upload/2023/01/content/230036/1674452213-8.jpg",
                    source: "https://assets.codepen.io/8792744/pink+venom.m4a",
                    favorited: false
                },
                {
                    name: "HOW YOU LIKE THAT",
                    artist: "BLACKPINK",
                    cover: "https://www.nme.com/wp-content/uploads/2021/07/blackpink-2020-seasonsgreetings-conceptphoto-696x442.jpeg",
                    source: "https://assets.codepen.io/8792744/How+you+like+that.m4a",
                    favorited: false
                },
                {
                    name: "KILL THIS LOVE",
                    artist: "BLACKPINK",
                    cover: "https://imgix.bustle.com/uploads/image/2022/7/29/29fe069b-8552-46b2-b9b0-021227ef4d78-black-pink-ready-for-love.jpg?w=900&h=566&fit=crop&crop=focalpoint&auto=format%2Ccompress&fp-x=0.4853&fp-y=0.5297",
                    source: "https://assets.codepen.io/8792744/KILL+THIS+LOVE.m4a",
                    favorited: false
                }
            ],
            currentTrack: null,
            currentTrackIndex: 0,
            transitionName: null,
            currentCover: ""
        };
    },
    computed: {

        render(){
            document.getElementById('coverp').style.backgroundImage = 'url(https://www.billboard.com/wp-content/uploads/2023/02/blackpink-sept-2022-billboard-1548.jpg)';
        }
    },
    methods: {

        play() {
            if (this.audio.paused) {
                this.audio.play();
                this.isTimerPlaying = true;
            } else {
                this.audio.pause();
                this.isTimerPlaying = false;
            }
        },
        generateTime() {
            let width = (100 / this.audio.duration) * this.audio.currentTime;
            this.barWidth = width + "%";
            this.circleLeft = width + "%";
            let durmin = Math.floor(this.audio.duration / 60);
            let dursec = Math.floor(this.audio.duration - durmin * 60);
            let curmin = Math.floor(this.audio.currentTime / 60);
            let cursec = Math.floor(this.audio.currentTime - curmin * 60);
            if (durmin < 10) {
                durmin = "0" + durmin;
            }
            if (dursec < 10) {
                dursec = "0" + dursec;
            }
            if (curmin < 10) {
                curmin = "0" + curmin;
            }
            if (cursec < 10) {
                cursec = "0" + cursec;
            }
            this.duration = durmin + ":" + dursec;
            this.currentTime = curmin + ":" + cursec;
        },
        updateBar(x) {
            let progress = this.$refs.progress;
            let maxduration = this.audio.duration;
            let position = x - progress.offsetLeft;
            let percentage = (100 * position) / progress.offsetWidth;
            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }
            this.barWidth = percentage + "%";
            this.circleLeft = percentage + "%";
            this.audio.currentTime = (maxduration * percentage) / 100;
            this.audio.play();

        },
        clickProgress(e) {
            this.isTimerPlaying = true;
            this.audio.pause();
            this.updateBar(e.pageX);
        },
        prevTrack() {
            this.transitionName = "scale-in";
            this.isShowCover = false;
            if (this.currentTrackIndex > 0) {
                this.currentTrackIndex--;
            } else {
                this.currentTrackIndex = this.tracks.length - 1;
            }
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.resetPlayer();
        },
        nextTrack() {
            this.transitionName = "scale-out";
            this.isShowCover = false;
            if (this.currentTrackIndex < this.tracks.length - 1) {
                this.currentTrackIndex++;
            } else {
                this.currentTrackIndex = 0;
            }
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.resetPlayer();
            this.currentCover = this.currentTrack.cover;
        },
        toggleLoop() {
            this.isLooping = !this.isLooping;
            this.audio.loop = this.isLooping;
        },
        resetPlayer() {
            this.barWidth = 0;
            this.circleLeft = 0;
            this.audio.currentTime = 0;
            this.audio.src = this.currentTrack.source;
            setTimeout(() => {
                if(this.isTimerPlaying) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            }, 300);
        },
        favorite() {
            this.tracks[this.currentTrackIndex].favorited = !this.tracks[
                this.currentTrackIndex
                ].favorited;
        }
    },
    created() {
        let player = this;

        this.currentTrack = this.tracks[0];
        this.currentCover = this.currentTrack.cover;
        this.audio = new Audio();
        this.audio.src = this.currentTrack.source;
        this.audio.ontimeupdate = function() {
            player.generateTime();
        };
        this.audio.onloadedmetadata = function() {
            player.generateTime();
        };
        this.audio.onended = function() {
            player.nextTrack();
            this.isTimerPlaying = true;
        };

    },


});
App.mount("#app");