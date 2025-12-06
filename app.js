document.addEventListener('DOMContentLoaded', function() {
    const video1 = document.getElementById('projectVideo1');
    const video2 = document.getElementById('projectVideo2');
    const video3 = document.getElementById('projectVideo3');

    // Sidebar elements - Select using correct classes from index.html
    const sideBar = document.querySelector('.tq-sidebar');
    const closeIcon = document.querySelector('.tq-close-icon');
    const hoverSign = document.querySelector('.tq-hover-sign');

    const videoList = [video1, video2, video3];

    videoList.forEach(function(video) {
        if (!video) return; 
        video.addEventListener("mouseover", function() {
            video.play();
            if (hoverSign) hoverSign.classList.add("active");
        });
        video.addEventListener("mouseout", function() {
            video.pause();
            if (hoverSign) hoverSign.classList.remove("active");
        });
    });

    // Event Delegation for Sidebar Toggle
    // This handles clicks on elements that might be loaded dynamically (like the header menu icon)
    document.addEventListener('click', function(e) {
        // Check if clicked element or its parent is the menu icon
        const menuIcon = e.target.closest('.menu-icon');
        const closeBtn = e.target.closest('.tq-close-icon');

        if (menuIcon) {
            if (sideBar) {
                sideBar.classList.remove("close-sidebar");
                sideBar.classList.add("open-sidebar");
            }
        }

        if (closeBtn) {
            if (sideBar) {
                sideBar.classList.remove("open-sidebar");
                sideBar.classList.add("close-sidebar");
            }
        }
    });
});