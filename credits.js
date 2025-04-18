document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const playerContainer = document.getElementById('player-container');
    const lastLine = document.getElementById('last-line');
    const creditsContainer = document.querySelector('.credits-container');
    
    // YouTube API variables
    let player;
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // Flag to track if user has scrolled to the bottom
    let hasReachedEnd = false;
    
    // Initialize YouTube player when API is ready
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
            height: '0',  // Hidden video
            width: '0',   // Hidden video
            videoId: 'iuztXKx-sBo',  // Daði Freyr – Think About Things
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'showinfo': 0,
                'rel': 0,
                'fs': 0,
                'modestbranding': 1
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    };
    
    // Player is ready
    function onPlayerReady(event) {
        // Now the player is ready for action
        yesBtn.addEventListener('click', function() {
            player.playVideo();
            // Change button states
            yesBtn.classList.add('active');
            noBtn.classList.remove('active');
            
            // Show success message
            showToast('Music started! Enjoy the credits!', 'success');
        });
        
        noBtn.addEventListener('click', function() {
            player.pauseVideo();
            // Change button states
            noBtn.classList.add('active');
            yesBtn.classList.remove('active');
            
            // Show info message
            showToast('No music. Scroll through the credits in silence.', 'info');
        });
    }
    
    // Function to show toast notifications
    function showToast(message, type) {
        // Create toast container if it doesn't exist
        if (!document.querySelector('.toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        const toastContainer = document.querySelector('.toast-container');
        
        // Create toast element
        const toastElement = document.createElement('div');
        toastElement.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'primary'} border-0`;
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        
        // Toast content
        toastElement.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        // Add to container
        toastContainer.appendChild(toastElement);
        
        // Initialize and show the toast
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
        toast.show();
        
        // Remove toast after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    }
    
    // Function to check if scrolled to bottom
    function isScrolledToBottom() {
        return creditsContainer.scrollHeight - creditsContainer.clientHeight <= creditsContainer.scrollTop + 50;
    }
    
    // Easter egg trigger - when user scrolls to the end
    creditsContainer.addEventListener('scroll', function() {
        if (isScrolledToBottom() && !hasReachedEnd) {
            hasReachedEnd = true;
            
            // Add special effect to the last line
            lastLine.classList.add('animate__animated', 'animate__pulse');
            
            // Show an initial hint
            showToast('You made it to the end! Click on the last line for a surprise!', 'success');
        }
    });
    
    // Easter egg - Certificate modal
    lastLine.addEventListener('click', function() {
        if (hasReachedEnd) {
            const certificateModal = new bootstrap.Modal(document.getElementById('certificateModal'));
            certificateModal.show();
        }
    });
    
    // Add some fun animations to credits lines while scrolling
    const creditLines = document.querySelectorAll('.credits-scroll p');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateX(0)';
                entry.target.style.opacity = '1';
            } else {
                entry.target.style.transform = entry.target.getBoundingClientRect().top > 0 ? 
                    'translateX(-20px)' : 'translateX(20px)';
                entry.target.style.opacity = '0.5';
            }
        });
    }, { threshold: 0.5 });
    
    creditLines.forEach(line => {
        line.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        line.style.opacity = '0.5';
        line.style.transform = 'translateX(-20px)';
        observer.observe(line);
    });
});
