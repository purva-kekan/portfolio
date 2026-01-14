// ===== NAVIGATION & PAGE SWITCHING =====
const navLinks = document.querySelectorAll(".nav-link");

// Single, unified click handler for navigation
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    
    const targetId = link.getAttribute("href").substring(1);
    console.log('Navigation clicked:', targetId);

    // Update active state in sidebar
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    // Scroll to the section smoothly
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update URL hash
      window.location.hash = `#${targetId}`;
    }

    // Reset "Show More" projects when navigating away from projects
    const moreProjects = document.querySelector('.accordion-more-projects');
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (moreProjects && showMoreBtn && moreProjects.style.display === 'flex') {
      console.log('Resetting projects on navigation...');
      showMoreBtn.click(); // Collapse back to 4
    }
  });
});

// ===== INITIAL LOAD =====
window.addEventListener("DOMContentLoaded", () => {
  console.log('Page loaded, initializing...');
  
  // Handle URL hash on page load
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const matchingLink = document.querySelector(`.nav-link[href="#${hash}"]`);
    if (matchingLink) {
      navLinks.forEach((l) => l.classList.remove("active"));
      matchingLink.classList.add("active");
      
      // Scroll to section
      const targetSection = document.getElementById(hash);
      if (targetSection) {
        setTimeout(() => {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  } else {
    // Default: activate overview
    const overviewLink = document.querySelector('.nav-link[href="#overview"]');
    if (overviewLink) {
      overviewLink.classList.add("active");
    }
  }
});

// ===== PROJECTS SECTION ACCORDION =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== PROJECTS SCRIPT LOADING ===');
  
  // ===== 1. ACCORDION CLICKS =====
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  console.log('Found accordion headers:', accordionHeaders.length);
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      console.log('Accordion clicked!');
      const accordionItem = this.parentElement;
      accordionItem.classList.toggle('active');
    });
  });

  // ===== 2. SHOW MORE BUTTON =====
  const showMoreBtn = document.getElementById('showMoreBtn');
  const moreProjects = document.querySelector('.accordion-more-projects');
  
  console.log('Show More Button found:', !!showMoreBtn);
  console.log('More Projects section found:', !!moreProjects);
  
  if (showMoreBtn && moreProjects) {
    showMoreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      console.log('Show More clicked!');
      
      const isExpanded = moreProjects.style.display === 'flex';
      
      if (isExpanded) {
        // Collapse
        moreProjects.style.display = 'none';
        showMoreBtn.querySelector('.btn-text').textContent = 'Show More Projects';
        showMoreBtn.querySelector('.btn-count').textContent = '(+4)';
        showMoreBtn.classList.remove('expanded');
        console.log('Collapsed to 4 projects');
      } else {
        // Expand
        moreProjects.style.display = 'flex';
        showMoreBtn.querySelector('.btn-text').textContent = 'Show Less Projects';
        showMoreBtn.querySelector('.btn-count').textContent = '(-4)';
        showMoreBtn.classList.add('expanded');
        console.log('Expanded to 8 projects');
      }
    });
  } else {
    console.error('ERROR: Show More button or More Projects section not found!');
  }

  // ===== 3. BUBBLE CLICK TO SCROLL =====
  const bubbles = document.querySelectorAll('.bubble');
  console.log('Found bubbles:', bubbles.length);
  
  bubbles.forEach(bubble => {
    bubble.addEventListener('click', function(e) {
      e.preventDefault();
      const projectId = this.getAttribute('data-project');
      console.log('Bubble clicked! Project ID:', projectId);
      
      const projectElement = document.getElementById('project-' + projectId);
      
      if (projectElement) {
        // If project is in hidden section (5-8), expand it first
        if (parseInt(projectId) > 4) {
          const moreProjects = document.querySelector('.accordion-more-projects');
          if (moreProjects && moreProjects.style.display !== 'flex') {
            console.log('Expanding hidden projects first...');
            showMoreBtn.click();
          }
        }
        
        // Wait a moment for expansion animation, then scroll
        setTimeout(() => {
          projectElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Open the accordion if not already open
          setTimeout(() => {
            if (!projectElement.classList.contains('active')) {
              projectElement.querySelector('.accordion-header').click();
            }
            
            // Add highlight effect
            projectElement.style.transition = 'box-shadow 0.3s ease';
            projectElement.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.8)';
            setTimeout(() => {
              projectElement.style.boxShadow = '';
            }, 2000);
          }, 300);
        }, 300);
      } else {
        console.error('Project element not found:', 'project-' + projectId);
      }
    });
  });

  console.log('=== PROJECTS FUNCTIONALITY INITIALIZED ===');
});

document.addEventListener('DOMContentLoaded', function() {
  console.log('=== TESTIMONIALS CAROUSEL LOADING ===');
  
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  
  console.log('Found slides:', slides.length);
  console.log('Found indicators:', indicators.length);
  
  if (slides.length === 0) {
    console.warn('No carousel slides found');
    return;
  }
  
  let currentSlide = 0;
  
  // Function to show specific slide
  function showSlide(index) {
    console.log('Showing slide:', index);
    
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Remove active from all indicators
    indicators.forEach(indicator => {
      indicator.classList.remove('active');
    });
    
    // Show current slide
    if (slides[index]) {
      slides[index].classList.add('active');
    }
    
    // Activate current indicator
    if (indicators[index]) {
      indicators[index].classList.add('active');
    }
    
    currentSlide = index;
  }
  
  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      console.log('Next clicked');
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    });
  }
  
  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      console.log('Prev clicked');
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    });
  }
  
  // Indicator dots click
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function() {
      console.log('Indicator clicked:', index);
      showSlide(index);
    });
  });
  
  // Optional: Auto-advance every 3 seconds
  let autoAdvance = setInterval(function() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }, 3000); // Change to 8000 for 8 seconds, or remove this block to disable auto-advance
  
  // Pause auto-advance on hover
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', function() {
      clearInterval(autoAdvance);
      console.log('Auto-advance paused');
    });
    
    carousel.addEventListener('mouseleave', function() {
      autoAdvance = setInterval(function() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
      }, 3000);
      console.log('Auto-advance resumed');
    });
  } 
  
  // Keyboard navigation (optional)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      nextBtn.click();
    }
  });
  
  console.log('=== TESTIMONIALS CAROUSEL INITIALIZED ===');
});

// ============================================================
// ADD THIS TO YOUR script.js FILE
// Resume Viewer Toggle Functionality
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('=== RESUME VIEWER LOADING ===');
  
  const resumeBtn = document.getElementById('resumeToggleBtn');
  const resumeViewer = document.querySelector('.resume-viewer');
  const mainContent = document.querySelector('.main');
  const allSections = document.querySelectorAll('.main > section:not(.resume-viewer)');
  const navLinks = document.querySelectorAll('.nav-link');
  const resumeCloseBtn = document.getElementById('resumeCloseBtn');
  
  console.log('Resume button:', resumeBtn);
  console.log('Resume viewer:', resumeViewer);
  console.log('Regular sections:', allSections.length);
  
  let isResumeOpen = false;
  let lastActiveSection = 'overview'; // Default section to return to
  
  // Function to open resume viewer
  function openResumeViewer() {
    console.log('Opening resume viewer...');
    
    // Hide all regular sections
    allSections.forEach(section => {
      section.style.display = 'none';
    });
    
    // Show resume viewer
    if (resumeViewer) {
      resumeViewer.style.display = 'block';
      resumeViewer.classList.add('active');
    }
    
    // Update button text and style
    if (resumeBtn) {
      const btnText = resumeBtn.querySelector('.resume-btn-text');
      if (btnText) {
        btnText.textContent = 'Back';
      }
      resumeBtn.classList.add('active-resume');
    }
    
    // Remove active from all nav links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Mark main as resume-active
    if (mainContent) {
      mainContent.classList.add('resume-active');
    }
    
    isResumeOpen = true;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Function to close resume viewer
  function closeResumeViewer(targetSection = null) {
    console.log('Closing resume viewer...');
    
    // Hide resume viewer
    if (resumeViewer) {
      resumeViewer.style.display = 'none';
      resumeViewer.classList.remove('active');
    }
    
    // Show all regular sections
    allSections.forEach(section => {
      section.style.display = 'block';
    });
    
    // Update button text back
    if (resumeBtn) {
      const btnText = resumeBtn.querySelector('.resume-btn-text');
      if (btnText) {
        btnText.textContent = 'Resume';
      }
      resumeBtn.classList.remove('active-resume');
    }
    
    // Remove resume-active from main
    if (mainContent) {
      mainContent.classList.remove('resume-active');
    }
    
    isResumeOpen = false;
    
    // If a target section was specified, scroll to it
    if (targetSection) {
      const section = document.getElementById(targetSection);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // Update active nav link
        const targetLink = document.querySelector(`.nav-link[href="#${targetSection}"]`);
        if (targetLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    } else {
      // Return to last active section
      const section = document.getElementById(lastActiveSection);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }
  
  // Resume button click
  if (resumeBtn) {
    resumeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Resume button clicked. Current state:', isResumeOpen);
      
      if (isResumeOpen) {
        // Close resume and go back
        closeResumeViewer();
      } else {
        // Save current active section
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
          lastActiveSection = activeLink.getAttribute('href').substring(1);
        }
        
        // Open resume viewer
        openResumeViewer();
      }
    });
  }
  
  // Close button in resume viewer
  if (resumeCloseBtn) {
    resumeCloseBtn.addEventListener('click', function() {
      console.log('Resume close button clicked');
      closeResumeViewer();
    });
  }
  
  // Intercept navigation clicks when resume is open
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (isResumeOpen) {
        console.log('Nav link clicked while resume open');
        e.preventDefault();
        
        const targetSection = this.getAttribute('href').substring(1);
        console.log('Closing resume and navigating to:', targetSection);
        
        // Close resume and navigate to clicked section
        closeResumeViewer(targetSection);
      }
      // If resume is not open, normal navigation handles it
    });
  });
  
  console.log('=== RESUME VIEWER INITIALIZED ===');
});

document.addEventListener('DOMContentLoaded', function() {
  console.log('=== 3D FLIP CARD LOADING ===');
  
  const flipCard = document.querySelector('.flip-card-3d');
  
  if (flipCard) {
    let isFlipped = false;
    
    // Click to flip (useful for mobile/touch devices)
    flipCard.addEventListener('click', function() {
      console.log('Flip card clicked');
      
      if (isFlipped) {
        this.style.transform = 'rotateY(0deg)';
        isFlipped = false;
      } else {
        this.style.transform = 'rotateY(180deg)';
        isFlipped = true;
      }
    });
    
    // Reset flip when navigating away
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (isFlipped) {
          flipCard.style.transform = 'rotateY(0deg)';
          isFlipped = false;
        }
      });
    });
    
    console.log('=== FLIP CARD INITIALIZED ===');
  }
});