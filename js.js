
        //============ COMPLETE BOOKING SYSTEM WITH LOCALSTORAGE ============

// Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !nav.contains(event.target)) {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effects to cards
document.querySelectorAll('.language-card, .feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = 'var(--hover-glow)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        const scrolled = window.pageYOffset;
        const opacity = Math.min(scrolled / 100, 0.95);
        header.style.background = `rgba(34, 40, 49, ${0.8 + opacity * 0.15})`;
    }
});

// ============ LOCALSTORAGE BOOKING SYSTEM ============

// All machine specifications database
const machineDatabase = {
    'Corner Taping Machine': {
        model: 'NDS-CTM-2024',
        speed: 'Up to 120 boxes/min',
        size: '40mm x 40mm x 10mm',
        power: '0.4 kW',
        weight: '170 kg',
        voltage: 'AC 220V',
        system: 'Manual',
        description: 'Box corner pasting machine with easy operation and fast working speed.'
    },
    'Case Making Machine': {
        model: 'NDS-CMA-2021',
        speed: 'Up to 120 boxes/min',
        size: '95mm x 95mm',
        power: '0.4 kW',
        weight: '170 kg',
        voltage: 'AC 220V',
        system: 'Hot/Cold Glue',
        description: 'Semi-automatic case making machine with dual gluing capability.'
    },
    'Half Body Gluing Machine': {
        model: 'NDS-CGT-2023',
        speed: 'Up to 150 boxes/min',
        size: '524mm',
        power: '2 kW',
        weight: '200 kg',
        voltage: 'AC Single Phase',
        system: 'Bottom Gluing System',
        description: 'Board gluing machine for duplex and thick paper.'
    },
    'Table top Gluing Machine': {
        model: 'NDS-s4-2023',
        speed: 'Up to 150 boxes/min',
        size: '524mm',
        power: '2 kW',
        weight: '200 kg',
        voltage: 'AC Single Phase',
        system: 'Bottom Gluing System',
        description: 'Compact board gluing machine with hot melt system.'
    },
    'Top Gluing Conveyor Machine': {
        model: 'NDS-Top-2024',
        speed: 'Up to 150 boxes/min',
        size: '524mm',
        power: '2 kW',
        weight: '200 kg',
        voltage: 'AC Single Phase',
        system: 'Top Gluing System with Conveyor',
        description: 'Stable machine with stainless steel glue roller and conveyor system.'
    }
};

// Handle booking buttons on product page
document.querySelectorAll('.booking-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const machineName = this.getAttribute('data-machine');
        const specs = this.getAttribute('data-specs');
        
        // Store in localStorage
        localStorage.setItem('selectedMachine', machineName);
        localStorage.setItem('machineSpecs', specs);
        
        // Redirect to booking page
        window.location.href = 'booking.html';
    });
});

// Load machine data on booking page
function loadMachineData() {
    const selectedMachine = localStorage.getItem('selectedMachine');
    const machineSpecs = localStorage.getItem('machineSpecs');
    
    if (selectedMachine && machineDatabase[selectedMachine]) {
        const machine = machineDatabase[selectedMachine];
        
        // Set dropdown value
        const dropdown = document.getElementById('machinery');
        if (dropdown) {
            dropdown.value = selectedMachine;
            // Only disable if coming from product page with data-specs
            if (machineSpecs) {
                dropdown.disabled = true; // Lock the dropdown if pre-selected from product page
            }
        }
        
        // Display machine details in right box
        displayMachineDetailsBox(selectedMachine);
    }
}

// Display machine details in the right side box
function displayMachineDetailsBox(machineName) {
    const displayBox = document.getElementById('machineDetailsDisplay');
    if (!displayBox) return;

    const machine = machineDatabase[machineName];
    if (!machine) {
        displayBox.innerHTML = '<p class="placeholder-text">Machine details not found</p>';
        return;
    }

    let html = `
        <div class="machine-detail-row">
            <span class="detail-label">Model</span>
            <span class="detail-value">${machine.model}</span>
        </div>
        <div class="machine-detail-row">
            <span class="detail-label">Speed</span>
            <span class="detail-value">${machine.speed}</span>
        </div>
        <div class="machine-detail-row">
            <span class="detail-label">Size</span>
            <span class="detail-value">${machine.size}</span>
        </div>
        <div class="machine-detail-row">
            <span class="detail-label">Power</span>
            <span class="detail-value">${machine.power}</span>
        </div>
        <div class="machine-detail-row">
            <span class="detail-label">Weight</span>
            <span class="detail-value">${machine.weight}</span>
        </div>
        <div class="machine-detail-row">
            <span class="detail-label">Voltage</span>
            <span class="detail-value">${machine.voltage}</span>
        </div>
        <div class="machine-detail-row">
            <span class="detail-label">System</span>
            <span class="detail-value">${machine.system}</span>
        </div>
        <div style="padding: 1rem; background: rgba(217, 91, 60, 0.1); border-radius: 0.375rem; margin-top: 0.5rem;">
            <p style="font-size: 0.85rem; color: var(--muted-foreground); margin: 0;">${machine.description}</p>
        </div>
    `;

    displayBox.innerHTML = html;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load machine data if on booking page
    if (document.getElementById('bookingForm')) {
        loadMachineData();
        
        // Add change event listener to machinery dropdown for home page flow
        const machineryDropdown = document.getElementById('machinery');
        if (machineryDropdown) {
            machineryDropdown.addEventListener('change', function(e) {
                const selectedMachine = this.value;
                if (selectedMachine && machineDatabase[selectedMachine]) {
                    localStorage.setItem('selectedMachine', selectedMachine);
                    displayMachineDetailsBox(selectedMachine);
                } else {
                    const displayBox = document.getElementById('machineDetailsDisplay');
                    if (displayBox) {
                        displayBox.innerHTML = '<p class="placeholder-text">Machine details will appear here...</p>';
                    }
                }
            });
        }
        
        // Handle form submission
        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const address = document.getElementById('address').value.trim();
            const machinery = document.getElementById('machinery').value;
            const message = document.getElementById('message').value.trim();
            
            // Validate required fields
            if (!firstName || !lastName || !phone || !email || !address || !machinery) {
                alert('Please fill all required fields!');
                return;
            }
            
            // Get machine details from database
            const machine = machineDatabase[machinery];
            if (!machine) {
                alert('Machine error!');
                return;
            }
            
            // Build WhatsApp message
            let whatsappMessage = `🎯 *NEW BOOKING REQUEST*\n\n`;
            whatsappMessage += `👤 *CUSTOMER INFORMATION*\n`;
            whatsappMessage += `Name: ${firstName} ${lastName}\n`;
            whatsappMessage += `Phone: ${phone}\n`;
            whatsappMessage += `Email: ${email}\n`;
            whatsappMessage += `Address: ${address}\n\n`;
            whatsappMessage += `🔧 *MACHINE DETAILS*\n`;
            whatsappMessage += `Machine: ${machinery}\n`;
            whatsappMessage += `Model: ${machine.model}\n`;
            whatsappMessage += `Speed: ${machine.speed}\n`;
            whatsappMessage += `Size: ${machine.size}\n`;
            whatsappMessage += `Power: ${machine.power}\n`;
            whatsappMessage += `Weight: ${machine.weight}\n`;
            whatsappMessage += `Voltage: ${machine.voltage}\n`;
            whatsappMessage += `System: ${machine.system}\n\n`;
            
            if (message) {
                whatsappMessage += `📝 *SPECIAL REQUEST*\n${message}\n\n`;
            }
            
            whatsappMessage += `_Sent from NDS Manufacturer Booking System_`;
            
            // Send to WhatsApp
            const whatsappNumber = '9310666519'; // Update this with your WhatsApp number
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappLink, '_blank');
            
            // Show success message
            alert('Booking request sent! Check your WhatsApp.');
            
            // Optional: Clear localStorage after successful submission
            localStorage.removeItem('selectedMachine');
            localStorage.removeItem('machineSpecs');
            
            // Optional: Reset form
            this.reset();
        });
    }
});