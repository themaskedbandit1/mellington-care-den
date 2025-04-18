document.addEventListener('DOMContentLoaded', function() {
    // Add current date to the certificate
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Print button functionality
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Add animation to the certificate
    const certificate = document.querySelector('.certificate');
    if (certificate) {
        // Add a subtle glow effect
        setTimeout(() => {
            certificate.style.transition = 'box-shadow 1.5s ease-in-out';
            certificate.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)';
        }, 500);
    }
    
    // Add animation to the seal
    const seal = document.querySelector('.seal');
    if (seal) {
        seal.style.transition = 'transform 1s ease-in-out';
        seal.addEventListener('mouseover', function() {
            this.style.transform = 'rotate(10deg) scale(1.1)';
        });
        seal.addEventListener('mouseout', function() {
            this.style.transform = 'rotate(0) scale(1)';
        });
    }
    
    // Add hover effect to signature
    const signature = document.querySelector('.signature p:first-child');
    if (signature) {
        signature.style.transition = 'transform 0.5s ease, color 0.5s ease';
        signature.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
            this.style.color = '#d4af37';
        });
        signature.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.color = '#8b4513';
        });
    }
    
    // Add a fun confetti effect when the page loads
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '1000';
        document.body.appendChild(confettiContainer);
        
        const colors = ['#ffd700', '#8b4513', '#3498db', '#e74c3c', '#2ecc71'];
        
        for (let i = 0; i < 100; i++) {
            createConfettiPiece(confettiContainer, colors);
        }
        
        // Remove confetti after animation completes
        setTimeout(() => {
            confettiContainer.style.transition = 'opacity 1s ease';
            confettiContainer.style.opacity = '0';
            setTimeout(() => {
                confettiContainer.remove();
            }, 1000);
        }, 5000);
    }
    
    function createConfettiPiece(container, colors) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.top = '-50px';
        confetti.style.left = Math.random() * 100 + 'vw';
        
        const duration = Math.random() * 3 + 2 + 's';
        const delay = Math.random() * 2 + 's';
        
        confetti.style.animation = `fall ${duration} ease-in ${delay} forwards`;
        
        const keyframes = `
        @keyframes fall {
            from {
                transform: translateY(0) rotate(0deg);
            }
            to {
                transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            }
        }`;
        
        const style = document.createElement('style');
        style.innerHTML = keyframes;
        document.head.appendChild(style);
        
        container.appendChild(confetti);
    }
    
    // Start confetti animation
    createConfetti();
});
