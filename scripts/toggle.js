// JavaScript file to handle toggle switch functionality
// Hides/shows the website title div when switch is toggled




document.addEventListener('DOMContentLoaded', function() {
    // Get references to the toggle switch and the heading div
    const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
    const heading = document.getElementById('heading');
    
    // Check if both elements exist
    if (toggleSwitch && heading) {
        // Add event listener to the toggle switch
        toggleSwitch.addEventListener('change', function() {
            if (this.checked) {
                // Hide the heading div with smooth transition
                heading.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                heading.style.opacity = '0';
                heading.style.transform = 'translateY(-20px)';
                
                // After transition, set display to none to remove from layout
                setTimeout(() => {
                    heading.style.display = 'none';
                }, 300);
            } else {
                // Show the heading div
                heading.style.display = 'block';
                // Small delay to ensure display change takes effect
                setTimeout(() => {
                    heading.style.opacity = '1';
                    heading.style.transform = 'translateY(0)';
                }, 10);
            }
        });
        
        console.log('Toggle switch initialized successfully');
    } else {
        console.error('Toggle switch or heading element not found');
    }
});