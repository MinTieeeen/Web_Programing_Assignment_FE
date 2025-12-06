
* {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

 body {
    margin: 0;
    padding: 0;
    background: #0f1f2b;
    background-image: url('../images/starry-night-sky 1.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    color: #e6edf3;
    position: relative;
    min-height: 100vh;
}

body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 31, 43, 0.3);
    z-index: -1;
    pointer-events: none;
}

body>* {
    position: relative;
}

body {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: lightgray;
}


html {
    scroll-behavior: smooth;
}

.container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 100px;
    background-color: #001f7c38;
}

.back-vid {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: -1;
    mix-blend-mode: overlay;
}

.blackhole-box {
    position: absolute;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: -1;
    mix-blend-mode: lighten;
}

.blackhole-box video {
    width: 100%;
    margin-top: -27%;
}

.hero {
    position: relative;
    display: flex;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: space-between;
}

.hero-info {
    position: absolute;
    left: 5%;
    top: 15%;
}

.hero-info .hero-info-title {
    color: #72a1de;
    padding: 8px 5px;
    border-radius: 50px;
    border: 1px solid #72a1de94;
    width: 100px;
    background-color: #2200493d;
    box-shadow: 0 0 5px #72a1de84;

}

.hero-info h1 {
    font-size: 45px;
    max-width: 550px;
    font-weight: 700;
    line-height: 70px;
    margin-top: 20px;
    margin-bottom: 30px;
}

.hero-info p {
    max-width: 550px;
    line-height: 25px;
    margin-bottom: 40px;
    font-size: 17px;
}

.hero-info button {
    color: white;
    padding: 15px 35px;
    border-radius: 10px;
    border: 1px solid #72a1de81;
    background-color: #2200493d;
    box-shadow: 0 0 5px #72a1de81;
    cursor: pointer;
    transition: 0.3s;
}

.hero-info button:hover {
    box-shadow: 0 0 15px #72a1de81;
}

/* Gradient Animation */
/* .gradient {
    font-size: 45px;
    background: linear-gradient(to right, #00aaa7, #7e42a7, #6600c5, #6070fd, #2a46ff, #0099ff, #008ead);
    background-size: 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: animate-gradient 2.5s linear infinite;
} */

/* .gradient-small {
    font-size: 25px;
    background: linear-gradient(to right, #00aaa7, #7e42a7, #6600c5, #6070fd, #2a46ff, #0099ff, #008ead);
    background-size: 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: animate-gradient 2.5s linear infinite;
}

@keyframes animate-gradient {
    to {
        background-position: 200%;
    }
}

.skills-video-box {
    position: absolute;
    right: -5%;
}

.skills-video {
    height: 500px;
    mix-blend-mode: lighten;
}


.scroll-down {
    height: 50px;
    width: 30px;
    border: 2px solid lightgray;
    position: absolute;
    left: 49%;
    bottom: 8%;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.626);
}

.scroll-down::before,
.scroll-down::after {
    content: "";
    position: absolute;
    top: 20%;
    left: 50%;
    height: 10px;
    width: 10px;
    transform: translate(-50%, -100%) rotate(45deg);
    border: 2px solid lightgray;
    border-top: transparent;
    border-left: transparent;
    animation: scroll-down 2s ease-in-out infinite;
}

.scroll-down::before {
    top: 30%;
    animation-delay: 0.5s;
}

@keyframes scroll-down {
    0% {
        
        opacity: 0;
    }

    30% {
        opacity: 1;
    }

    60% {
        opacity: 1;
    }

    100% {
        top: 90%;
        opacity: 0;
    }
} */

.featured {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 90%;
    max-width: 1400px;
}

.section-title {
    font-size: 40px;
    align-self: center;
    font-weight: 700;
    margin-bottom: 40px;
}

.featured-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 4 cột ngang hàng */
    gap: 24px;
    width: 100%;
}

.card {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 380px;
    /* Chiều cao cố định cho tất cả cards */
    overflow: hidden;
    border: 1px solid rgba(114, 161, 222, 0.3);
    background-color: #080020b7;
    border-radius: 20px;
    transition: all 0.5s ease;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 0 30px rgba(114, 161, 222, 0.6);
    border-color: rgba(114, 161, 222, 0.8);
}

.card-img-top {
    width: 100%;
    height: 70%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.card:hover .card-img-top {
    transform: scale(1.1);
}

.card-body {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, rgba(8, 0, 32, 0.95) 0%, rgba(8, 0, 32, 0.8) 70%, transparent 100%);
    z-index: 2;
}

.card-title {
    font-size: 22px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px 0;
}

.card-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* ==== Stats Section ==== */
.stats {
    width: 90%;
    max-width: 1400px;
    margin: 80px auto;
    text-align: center;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    width: 100%;
}

.stat-item {
    border-radius: 20px;
    padding: 40px 20px;
    transition: all 0.4s ease;
    cursor: default;
}

.stat-item:hover {
    transform: translateY(-6px);

    border-color: rgba(114, 161, 222, 0.8);
}

.stat-item h3 {
    font-size: 42px;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(90deg, #72a1de, #c182ff);
    -webkit-background-clip: text;
    color: transparent;
}

.stat-item p {
    margin-top: 10px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 0.5px;
}

/* Responsive */
@media screen and (max-width: 1200px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        /* 2 cột */
    }
}

@media screen and (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
        /* 1 cột */
    }

    .stat-item {
        padding: 30px;
    }

    .stat-item h3 {
        font-size: 36px;
    }
}


/* Responsive */
@media screen and (max-width: 1200px) {
    .featured-grid {
        grid-template-columns: repeat(2, 1fr);
        /* 2 cột trên tablet */
    }
}

@media screen and (max-width: 768px) {
    .featured-grid {
        grid-template-columns: 1fr;
        /* 1 cột trên mobile */
    }
}


.how-it-works {
    display: flex;
    flex-direction: column;
    gap: 10%;
    align-items: center;
    position: relative;
    width: 80%;
    height: 100vh;
    margin-top: 200px;
    margin-bottom: 700px;
}

.project-card {
    display: flex;
    width: 100%;
    height: 40%;
    align-items: center;
    gap: 10%;
    justify-content: center;
}

.project-vidbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    mix-blend-mode: exclusion;
    position: relative;
    cursor: pointer;
    transition: 0.5s;
    min-width: 400px;

}

.project-vidbox video {
    object-fit: cover;
    width: 100%;
    box-shadow: 0 0 10px lightgray;
    border-radius: 20px;
    transition: 0.5s;
}

.project-card video:hover {
    box-shadow: 0 0 25px rgb(255, 255, 255);
}

.project-info {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    width: 50%;
    padding-left: 10%;
}

.project-info h1 {
    width: 90%;
    font-size: 25px;
    font-weight: bold;
    text-wrap: nowrap;
    margin-top: 0;
    margin-bottom: 10px;
    max-width: 450px;
}

.project-info p {
    width: 90%;
    max-width: 400px;
    min-width: 300px;
    margin-bottom: 50px;
    margin-top: 0;
}

.project-info button {
    color: white;
    padding: 15px 35px;
    border-radius: 10px;
    border: 1px solid #72a1de81;
    background-color: #2200493d;
    box-shadow: 0 0 5px #72a1de81;
    cursor: pointer;
    transition: 0.3s;
}

.project-info button:hover {
    opacity: 0.8;
    box-shadow: 0 0 15px #72a1de81;
}

.project-vidbox .hover-sign {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30%;
    height: 100px;
}

.hover-sign::before,
.hover-sign::after {
    content: "👆";
    text-align: center;
    position: absolute;
    font-size: 50px;
    top: 20%;
    left: 40%;
    border-radius: 40px;
    animation: hover-animation 4s ease-in-out infinite;

}

.hover-sign.active {
    display: none;
}

@keyframes hover-animation {
    0% {
        /* top:20%; */
        box-shadow: 0 0 5px rgb(255, 255, 255);
        transform: translate(100%, 50%) rotate(30deg);
    }

    100% {
        box-shadow: 0 0 5px rgb(255, 255, 255);
        transform: translateX(80%, 80%) rotate(20deg);
    }
}


.service-section {
    width: 100%;
    padding: 80px 0;
    display: flex;
    flex-direction: column;
}

.service-box {
    width: 100%;
    margin: auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;

    padding: 0 20px;
}

/* Cột chung */
.col {
    text-align: left;
}

/* Ảnh + slider */
.center-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.skills-image {
    width: 100%;
    max-width: 300px;
    object-fit: contain;
}

/* Text (trái & phải) */
.Designer h1,
.coder h1 {
    font-size: 36px;
    margin-bottom: 18px;
}

.Designer p,
.coder p {
    max-width: 280px;
    margin: 0 auto;
    line-height: 1.6;
    opacity: 0.9;
}

/* Slider chỉ nằm trong cột giữa */
.slider {
    width: 60%;
    height: var(--height);
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
}

.slider .list {
    display: flex;
    min-width: calc(var(--width) * var(--quantity));
    width: 100%;
    position: relative;
}

.slider .list .item {
    width: var(--width);
    height: var(--height);
    left: 100%;
    animation: autoRun 10s linear infinite;
    transition: filter 0.5s;
    position: absolute;
    animation-delay: calc((10s / var(--quantity)) * (var(--position) - 1) - 10s) !important;
}

.slider .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

@keyframes autoRun {
    from {
        left: 100%;
    }

    to {
        left: calc(var(--width) * -1);
    }
}

.slider:hover .item {
    animation-play-state: paused !important;
    filter: grayscale(1);
}

.slider .item:hover {
    filter: grayscale(0);
}

/* BLUR EFFECT ANIMAION */

.autoBlur {
    animation: autoBlurAnimation linear both;
    animation-timeline: view();

}

@keyframes autoBlurAnimation {
    0% {
        filter: blur(40px);
    }

    35%,
    65% {
        filter: blur(0);
        opacity: 1;
    }

    100% {
        filter: blur(40px);
        opacity: 0;
    }
}


/* AUTO DISPLAY ANIMAION */
.autoDisplay {
    animation: autoDisplayAnimation both;
    animation-timeline: view();

}

@keyframes autoDisplayAnimation {
    from {
        filter: blur(10px);
        transform: translateY(-200px) scale(0);
    }

    50% {
        opacity: 1;
        filter: blur(0px);
        transform: translateX(0) scale(1);
    }
}


/* FADEIN_LEFT */

.fadein-left {
    animation: fadeInLeftAnimation both;
    animation-timeline: view();
}

@keyframes fadeInLeftAnimation {
    0% {
        opacity: 0;
        transform: translateX(-500px) scale(0.2);
        filter: blur(10px);
    }

    35%,
    65% {
        opacity: 1;
        transform: translateX(0) scale(1);
        filter: blur(0px);
    }

    100% {
        filter: blur(10px);
    }
}

/* Sidebar */

.menu-icon {
    font-size: 35px;
    cursor: pointer;
    display: none;
}


.sidebar {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 70%;
    width: 0%;
    background-color: #000000b8;
    z-index: 999;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.479);
    backdrop-filter: blur(10px);
    opacity: 0;
    border-bottom-left-radius: 100%;

}

.close-icon {
    font-size: 50px;
    color: lightgray;
    padding-left: 10px;
    cursor: pointer;
}

.sidebar ul {
    padding-left: 20px;
}

.sidebar ul li {
    list-style: none;
    margin-bottom: 30px;
}

.sidebar ul li a {
    text-decoration: none;
    color: lightgray;
    font-size: 30px;
    font-weight: 900;
    text-shadow: 0 0 15px #4c4c4c;
}

.social-sidebar {
    padding-left: 20px;
    margin-top: 60px;
    text-wrap: nowrap;
}

.social-sidebar a {
    font-size: 35px;
    padding: 5px 5px;
    cursor: pointer;
    transition: 0.5s;
}

/* Sidebar Open ANimation */
.sidebar.open-sidebar {
    animation: openSideBarAnimation 1.5s forwards;
}

@keyframes openSideBarAnimation {
    to {
        width: 80%;
        opacity: 1;
        bottom: 0;
        border-radius: 0;
    }
}

.box-icons a,
.social-sidebar a {
    color: inherit;
    text-decoration: none;
}

/* Sidebar close ANimation */

.sidebar.close-sidebar {
    animation: closeSideBarAnimation 1.5s forwards;
}

@keyframes closeSideBarAnimation {
    from {
        width: 80%;
        opacity: 1;
        bottom: 0;
        border-radius: 0;
    }

    to {
        width: 0;
        opacity: 0;
        bottom: 70%;
        border-bottom-left-radius: 50%;
    }
}


/* Service Section Responsive */
@media screen and (max-width: 992px) {
    .service-box {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .skills-image {
        max-width: 250px;
    }
}

@media screen and (max-width: 768px) {
    .service-section {
        padding: 60px 15px;
    }

    .Designer h1,
    .coder h1 {
        font-size: 28px;
    }

    .Designer p,
    .coder p {
        font-size: 14px;
    }
}


@media (max-aspect-ratio: 16/9) {
    .back-vid {
        width: auto;
        height: 100%;
    }
}

@media (min-aspect-ratio: 16/9) {
    .back-vid {
        width: 100%;
        height: auto;
    }
}


@media screen and (max-width: 1200px) {
    .blackhole-box video {
        margin-top: -20%;
    }

    .hero-info h1 {
        font-size: 40px;
        max-width: 400px;
        line-height: 40px;
    }

    .hero-info P {
        max-width: 300px;
    }

    .skills-video-box {
        right: 0%;
    }

    .skills-video-box video {
        height: 500px;
    }

    .info-cards {
        grid-template-columns: auto;
    }

    .card:nth-child(3) {
        grid-column: span 2;
        height: 70vh;
    }

    .info-cards .card h1 {
        font-size: 20px;
    }

    .info-cards .card:nth-child(3) h1 {
        bottom: 25%;
    }

    .card video {
        height: 60%;

        margin-top: 5%;
    }

    .my-project {
        margin-bottom: 200px;
        scale: 0.8;
    }

    .contact-section .section-title {
        left: 30%;
    }
}

@media screen and (max-width: 700px) {
    header {
        position: fixed;
        height: 50px;
    }

    header ul {
        display: none;
    }

    header .box-icons {
        display: none;
    }

    .menu-icon {
        display: inline;
    }

    .blackhole-box video {
        width: 100%;
        margin-top: -15%;
    }

    .autoBlur {
        animation: none;
    }

    .hero {
        flex-direction: column;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

    }

    .hero-info {
        bottom: 5%;
    }

    .scroll-down {
        bottom: 5%;
    }

    .hero .skills-video-box {
        height: 200px;
        top: 5%;
    }



    .info-cards {
        grid-template-columns: auto;
    }

    .card:nth-child(3) {
        grid-column: span 2;
        height: 70vh;
    }

    .card video {
        width: 100%;
    }

    .container {
        height: 100%;
    }

    .project-vidbox video {
        width: 250px;
        margin-left: -100px;
    }

    .project-info {
        overflow: hidden;
        padding-left: 0;
        margin-left: -50px;
    }

    .project-info h1 {
        font-size: 20px;
        max-width: 200px;
        text-wrap: wrap;
    }

    .project-info p {
        font-size: 10px;
        text-wrap: wrap;
        max-width: 200px;
        min-width: 0;
    }

    .project-info button {
        padding: 5px 10px;
    }

    .my-project {
        margin-bottom: 600px;
    }

    .project-card {
        flex-direction: column;
        margin-left: 25%;
        gap: 30px;
    }

    .project-vidbox {
        min-width: 200px;
    }

    .project-info {
        width: 85%;
    }

    .project-info h1 {
        text-wrap: nowrap;
    }

    .project-info p {
        max-width: 300px;
    }

    .Designer {
        top: 15%;
        left: 18%;
    }

    .Designer h1 {
        margin-bottom: 0;
        margin-top: 70px;
    }

    .coder {
        top: 50%;
        left: 18%;
    }

    .coder h1 {
        margin-bottom: 0;
    }

    .slider .list .item img {
        width: 70%;
    }

    .contact-section {
        flex-direction: column;
        margin-top: 100px;
        margin-bottom: 50px;
    }

    .footer {
        font-size: 10px;
    }

    .social-box {
        margin-left: -90px;
    }
}


@media screen and (max-width: 480px) {

    .hero .skills-video-box {
        display: none;

    }

    .blackhole-box {
        overflow: hidden;
    }

    .blackhole-box video {
        width: 140%;
        margin-top: -27%;

    }

    .left {
        scale: 0.9;
        margin-left: -30px;
    }

    .left h2 {
        font-size: 20px;
    }

    .hero {
        scale: 0.9;
    }

    .hero-info {
        bottom: 15%;
    }

    .hero-info h1 {
        font-size: 35px;
    }

    .scroll-down {
        bottom: 15%;
        left: 60%;
    }

    .section-title {
        font-size: 25px;
    }

    .info-cards {
        display: flex;
        flex-direction: column;
    }

    .card {
        min-height: 20rem;
    }

    .card h1 {
        bottom: 30%;
        font-size: 5px;
    }

    .project-card {
        height: 50%;
    }

    .project-info p {
        margin-bottom: 15px;
    }

    .project-info {
        margin-left: -80px;
    }

    .skills-box {
        height: 120vh;
        margin-right: 30px;
    }

    .slider {
        bottom: 0%;
    }

    .contact-section {
        scale: 0.9;
        height: 120vh;
    }

    .contact-section .section-title {
        top: -30px;
        left: 25%;
    }

    .footer h1 {
        max-width: 150px;
    }

    .footer .box-icons {
        gap: 10px;
    }


}

