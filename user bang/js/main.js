/**
 * Main Javascript File
 * Handles common operations like loading shared components (Navbar, Footer).
 */

document.addEventListener("DOMContentLoaded", () => {
    loadSharedComponents();
});

/**
 * Fetches HTML from a given path and injects it into the selector
 */
async function loadComponent(selector, file) {
    const element = document.querySelector(selector);
    if (!element) return; // Skip if the page doesn't have this placeholder

    try {
        const response = await fetch(file);
        if (response.ok) {
            const html = await response.text();
            element.innerHTML = html;
        } else {
            console.error(`Failed to load ${file}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
    }
}

async function loadSharedComponents() {
    await loadComponent('#navbar-placeholder', 'components/navbar.html');
    await loadComponent('#footer-placeholder', 'components/footer.html');
    
    // Initialize Scroll behavior after Navbar is loaded
    initNavbarScroll();
    
    // Refresh ScrollSpy
    setTimeout(() => {
        const bodyTag = document.body;
        if(bodyTag) {
            const scrollSpy = bootstrap.ScrollSpy.getInstance(bodyTag);
            if (scrollSpy) {
                scrollSpy.refresh();
            } else {
                new bootstrap.ScrollSpy(document.body, {
                    target: '#mainNav',
                    offset: 80
                });
            }
        }
    }, 500);
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar-custom');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initial check
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }
}

// Handle Splash Screen Exit
window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            // Add class to trigger the CSS slide-out animation (translateX)
            splashScreen.classList.add('hide-splash');
            
            // Remove from DOM entirely after the transition completes
            setTimeout(() => {
                splashScreen.remove();
            }, 1000); // 1000ms safety buffer for 0.8s transition
        }, 2200); // syncs with the duration of swimCross animation
    }
    
    // Google Apps Script Integration for Join Form
    const joinForm = document.getElementById('joinForm');
    if (joinForm) {
        const formURL = 'https://script.google.com/macros/s/AKfycbygEZx3xuW8UME1hqxPJ97beV5njRMBY-8OhBqzxkTm05-bAVwA5jyJ8DvEFrnhYD6Z/exec';
        const submitBtn = joinForm.querySelector('button[type="submit"]');

        joinForm.addEventListener('submit', e => {
            e.preventDefault();
            submitBtn.innerHTML = 'Submitting... <i class="fas fa-spinner fa-spin ms-2"></i>';
            submitBtn.disabled = true;

            const data = new FormData(joinForm);
            
            fetch(formURL, { method: 'POST', body: data })
            .then(response => {
                joinForm.reset();
                
                // Hide Join Modal gracefully
                const modalEl = document.getElementById('joinModal');
                if (modalEl) {
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                }
                
                // Show glowing Success Modal
                const successModalEl = document.getElementById('successModal');
                if (successModalEl) {
                    const successModal = new bootstrap.Modal(successModalEl);
                    successModal.show();
                    
                    const btn = document.getElementById('successCloseBtn');
                    if(btn) {
                        let count = 3;
                        btn.innerHTML = `Closing in ${count}...`;
                        
                        const t = setInterval(() => {
                            count--;
                            if(count > 0) {
                                btn.innerHTML = `Closing in ${count}...`;
                            } else {
                                clearInterval(t);
                                successModal.hide();
                            }
                        }, 1000);

                        // If user clicks it manually, stop the timer so it doesn't conflict
                        btn.onclick = () => clearInterval(t);
                    }
                
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert("Oops, something went wrong. Please try again.");
            })
            .finally(() => {
                submitBtn.innerHTML = 'Submit Registration <i class="fas fa-arrow-right ms-2"></i>';
                submitBtn.disabled = false;
            });
        });
    }

    // Google Apps Script Integration for Live Comments (Community Pulse)
    const appScriptURL = 'https://script.google.com/macros/s/AKfycbygEZx3xuW8UME1hqxPJ97beV5njRMBY-8OhBqzxkTm05-bAVwA5jyJ8DvEFrnhYD6Z/exec';
    
    // 1. Post new Comment
    const shoutoutForm = document.getElementById('shoutoutForm');
    if (shoutoutForm) {
        const shoutBtn = shoutoutForm.querySelector('button[type="submit"]');
        shoutoutForm.addEventListener('submit', e => {
            e.preventDefault();
            shoutBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin ms-2"></i>';
            shoutBtn.disabled = true;

            const data = new FormData(shoutoutForm);
            
            fetch(appScriptURL, { method: 'POST', body: data })
            .then(response => {
                // Succeeded, reset and pop back up
                shoutoutForm.reset();
                // Refresh comments!
                loadComments();
                
                // Show floating alert briefly
                const toast = document.createElement('div');
                toast.className = 'position-fixed bottom-0 end-0 p-3 z-3';
                toast.innerHTML = `<div class="toast show bg-success text-white border-0"><div class="toast-body d-flex align-items-center"><i class="fas fa-check-circle me-2"></i> Comment posted successfully!</div></div>`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            })
            .catch(error => console.error('Error post comment:', error.message))
            .finally(() => {
                shoutBtn.innerHTML = 'Send Shoutout <i class="fas fa-paper-plane ms-2"></i>';
                shoutBtn.disabled = false;
            });
        });
    }

    // 2. Fetch live comments on load
    const commentFeed = document.getElementById('commentFeed');
    if (commentFeed) {
        loadComments();
    }

    function loadComments() {
        // Fetch comments using GET
        fetch(appScriptURL)
        .then(res => res.json())
        .then(data => {
            if(data && data.length > 0) {
                commentFeed.innerHTML = '';
                data.forEach(item => {
                    // Make a nice date
                    let dateStr = "Just now";
                    if(item.timestamp) {
                        try {
                           const d = new Date(item.timestamp);
                           dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        } catch(e) {}
                    }
                    
                    const html = `
                    <div class="glass-card p-4 mb-4 rounded-4" style="background: rgba(13, 202, 240, 0.05); border-left: 4px solid var(--aqua); animation: fadeIn 0.5s ease forwards;">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-center">
                          <div class="rounded-circle bg-dark d-flex align-items-center justify-content-center text-info shadow-sm" style="width: 45px; height: 45px; flex-shrink: 0;">
                            <i class="fas fa-user"></i>
                          </div>
                          <div class="ms-3 overflow-hidden">
                            <h5 class="text-white fw-bold mb-0 text-truncate">${item.name || item.senderName || 'Anonymous'}</h5>
                            <small class="text-muted" style="font-size: 0.8rem;">${dateStr}</small>
                          </div>
                        </div>
                      </div>
                      <p class="text-light mb-0 fw-light" style="line-height: 1.6;">${item.message}</p>
                    </div>`;
                    commentFeed.innerHTML += html;
                });
            } else {
                commentFeed.innerHTML = '<div class="text-center py-5 text-white-50"><i class="fas fa-comment-slash fs-1 mb-3 opacity-50"></i><p>No comments yet. Be the first to share your thoughts!</p></div>';
            }
        })
        .catch(err => {
            console.error('Error fetching comments:', err);
            commentFeed.innerHTML = '<div class="text-danger text-center py-4">Failed to load comments.</div>';
        });
    }

});
