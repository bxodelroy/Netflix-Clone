/*const videos = [
  "vid/vid1.mp4", // for p1
  "vid/vid2.mp4", // for p2
  "vid/vid3.mp4", // for p3
  "vid/vid4.mp4", // for p4
  "vid/vid5.mp4"  // for p5
];

const posts = document.querySelectorAll(".posts");
const videoSpace = document.querySelector(".video-space");
videoSpace.innerHTML = `<video muted autoplay playsinline width="100%" height="100%"></video>`;


const video = videoSpace.querySelector("video");

posts.forEach((post, index) => {
    
    post.addEventListener("mouseenter", () => {
        videoSpace.classList.remove("hidden");      // show area
        video.src = videos[index];                  // load correct video
        video.play();
    });

    post.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;                      // reset
        videoSpace.classList.add("hidden");         // hide area
    });

});*/


// script.js - improved multi-video hover logic
document.addEventListener("DOMContentLoaded", () => {

    const posts = document.querySelectorAll(".posts");

    posts.forEach(post => {

        const videoSpace = post.querySelector(".video-space");
        const video = videoSpace.querySelector("video");

        function safePlay(video) {
            video.muted = false;

            video.play().catch(() => {
                // If autoplay with sound is blocked
                video.muted = true; // play muted first
                video.play().then(() => {
                    // unmute shortly later
                    setTimeout(() => video.muted = false, 200);
                }).catch(() => { });
            });
        }


        // keep track whether we moved videoSpace out to body
        let isDetached = false;

        let showTimeout;

        function showNearPost() {
            const rect = post.getBoundingClientRect();

            if (!isDetached) {
                document.body.appendChild(videoSpace);
                isDetached = true;
            }

            const gap = 16;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Position above the poster
            let top = rect.top - videoSpace.offsetHeight - gap; // move above
            if (top < 10) top = 10; // clamp so it doesn’t go above viewport

            // Align left edge with poster
            let left = rect.left;
            if (left + videoSpace.offsetWidth > vw - 10) {
                left = Math.max(10, vw - videoSpace.offsetWidth - 10); // clamp within viewport
            }


            videoSpace.style.top = Math.round(top) + "px";
            videoSpace.style.left = Math.round(left) + "px";

            clearTimeout(showTimeout);

            // ⏳ 1 second delay + blur fade in
            showTimeout = setTimeout(() => {
                videoSpace.classList.remove("hidden");
                videoSpace.classList.add("show");

                safePlay(video);

            }, 1000);
        }


        function hideAndReturn() {
            clearTimeout(showTimeout);

            video.pause();
            try { video.currentTime = 0; } catch (e) { }

            videoSpace.classList.remove("show");

            setTimeout(() => {
                if (!videoSpace.classList.contains("show")) {
                    videoSpace.classList.add("hidden");
                }
            }, 250);

            if (isDetached) {
                post.appendChild(videoSpace);
                isDetached = false;
                videoSpace.style.top = "";
                videoSpace.style.left = "";
            }
        }


        // When user enters poster: show video near it
        post.addEventListener("mouseenter", () => {
            showNearPost();
        });

        // When user leaves poster: hide only if pointer not over video-space
        post.addEventListener("mouseleave", () => {
            // small delay to allow pointer to move to video-space without hiding it immediately
            setTimeout(() => {
                if (!post.matches(":hover") && !videoSpace.matches(":hover")) {
                    hideAndReturn();
                }
            }, 60);
        });

        // When pointer leaves the floating video-space: hide if not over post
        videoSpace.addEventListener("mouseleave", () => {
            setTimeout(() => {
                if (!post.matches(":hover") && !videoSpace.matches(":hover")) {
                    hideAndReturn();
                }
            }, 60);
        });

        // If pointer enters the floating video-space, keep it visible
        videoSpace.addEventListener("mouseenter", () => {
            // no-op; presence of :hover prevents hide
        });

        // Also handle window resize / scroll to reposition or hide safely
        window.addEventListener("scroll", () => {
            if (!videoSpace.classList.contains("hidden")) {
                // recalc position (if visible)
                const rect = post.getBoundingClientRect();
                const top = Math.max(10, Math.min(window.innerHeight - 10 - videoSpace.offsetHeight, rect.top));
                const leftTry = rect.right + 16;
                const left = (leftTry + videoSpace.offsetWidth > window.innerWidth) ? Math.max(10, rect.left - 16 - videoSpace.offsetWidth) : leftTry;
                videoSpace.style.top = Math.round(top) + "px";
                videoSpace.style.left = Math.round(Math.max(10, Math.min(left, window.innerWidth - 10 - videoSpace.offsetWidth))) + "px";
            }
        }, { passive: true });

        window.addEventListener("resize", () => {
            if (!videoSpace.classList.contains("hidden")) {
                // simply hide on resize to avoid layout glitches (or reposition)
                hideAndReturn();
            }
        });

    }); // posts.forEach

}); // DOMContentLoaded







