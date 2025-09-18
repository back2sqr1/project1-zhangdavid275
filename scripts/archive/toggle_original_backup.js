// JavaScript file to handle ESC key toggle functionality
// Switches between style.css and style2.css when ESC key is pressed

document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the CSS link element
    const cssLink = document.querySelector('link[href*="style.css"]');
    
    // Terminal functionality for style2.css
    let terminalContainer = null;
    let typewriterInterval = null;
    
    function createTerminal() {
        // Add font-face declaration for IBM VGA font
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'IBM_VGA';
                src: url('../fonts/AcPlus_IBM_VGA_8x16.ttf') format('truetype');
                font-weight: normal;
                font-style: normal;
            }
        `;
        document.head.appendChild(style);
        
        // Create terminal container
        terminalContainer = document.createElement('div');
        terminalContainer.id = 'terminal-overlay';
        terminalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            z-index: 10;
            display: flex;
            justify-content: space-between;
            padding: 0;
            box-sizing: border-box;
        `;
        
        // Create BIOS interface (left side)
        const biosInterface = document.createElement('div');
        biosInterface.style.cssText = `
            width: 20%;
            height: 100%;
            background: rgba(0, 0, 0, 0.98);
            color: #00ff00;
            font-family: 'IBM_VGA', 'Courier New', Courier, monospace;
            font-size: 12px;
            line-height: 1.2;
            padding: 15px;
            box-sizing: border-box;
            overflow-y: auto;
            border: 2px solid #00ff00;
        `;
        
        // Create right terminal
        const rightTerminal = document.createElement('div');
        rightTerminal.style.cssText = `
            width: 20%;
            height: 100%;
            border: 2px solid #00ff00;
            background: rgba(0, 0, 0, 0.95);
            padding: 10px;
            font-family: 'IBM_VGA', 'Courier New', Courier, monospace;
            color: #00ff00;
            font-size: 12px;
            line-height: 1.2;
            overflow-y: auto;
            box-sizing: border-box;
        `;
        
        terminalContainer.appendChild(biosInterface);
        terminalContainer.appendChild(rightTerminal);
        document.body.appendChild(terminalContainer);
        
        return { leftTerminal: biosInterface, rightTerminal };
    }
    
    function extractContentFromIndex() {
        // Extract content from existing elements
        const personalTitle = document.querySelector('#personal-title')?.textContent || 'david\'s personal';
        const websiteTitle = document.querySelector('#website-title-w')?.textContent + 
                            document.querySelector('#website-title-ebsite')?.textContent || 'Website';
        const lainText = document.querySelector('#Lain-Text')?.textContent || 'シリアルエクスペリメンツ・Lain (1999)';
        
        const leftColumn = document.querySelector('.column:first-child');
        const rightColumn = document.querySelector('.column:last-child');
        
        const leftContent = {
            title: leftColumn?.querySelector('h3')?.textContent || 'THE WIRED',
            text: Array.from(leftColumn?.querySelectorAll('p') || []).map(p => p.textContent).join('\n\n')
        };
        
        const rightContent = {
            title: rightColumn?.querySelector('h3')?.textContent || 'PROTOCOL & SYSTEM LOG',
            text: Array.from(rightColumn?.querySelectorAll('p') || []).map(p => p.textContent).join('\n\n')
        };
        
        return {
            header: `${personalTitle}\n${websiteTitle}\n${lainText}\n\n`,
            left: leftContent,
            right: rightContent
        };
    }
    
    function typeWriter(element, text, callback, speed = 30) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                typewriterInterval = setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }
    
    function startTerminalSequence() {
        const content = extractContentFromIndex();
        const { leftTerminal: biosInterface, rightTerminal } = createTerminal();
        
        // Create BIOS-style content with interactive HTML elements
        const biosContent = `
<div style="border-bottom: 1px solid #00ff00; padding-bottom: 8px; margin-bottom: 15px;">
    <div style="font-size: 11px; margin-bottom: 3px;">Phoenix BIOS v4.1 Release 6.0</div>
    <div style="font-size: 9px;">Copyright (C) 1985-2024, Phoenix Technologies Ltd.</div>
    <div style="font-size: 9px;">All Rights Reserved</div>
</div>

<div style="margin-bottom: 20px;">
    <div style="display: flex; margin-bottom: 3px;"><span style="width: 120px; color: #00cc00;">CPU Type:</span><span>Intel Core i7-12700K</span></div>
    <div style="display: flex; margin-bottom: 3px;"><span style="width: 120px; color: #00cc00;">CPU Speed:</span><span>3600 MHz</span></div>
    <div style="display: flex; margin-bottom: 3px;"><span style="width: 120px; color: #00cc00;">Cache RAM:</span><span>25600 KB</span></div>
    <div style="display: flex; margin-bottom: 3px;"><span style="width: 120px; color: #00cc00;">System Memory:</span><span>32768 MB</span></div>
    <div style="display: flex; margin-bottom: 3px;"><span style="width: 120px; color: #00cc00;">System Date:</span><span>09/17/2025</span></div>
    <div style="display: flex; margin-bottom: 3px;"><span style="width: 120px; color: #00cc00;">System Time:</span><span id="bios-time">12:00:00</span></div>
</div>

<div style="margin-bottom: 15px;">
    <div style="background-color: #00ff00; color: #000000; padding: 1px 5px; display: inline-block; margin-bottom: 5px; font-size: 9px;">STANDARD CMOS SETUP</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[1]</span>Primary Master: 1TB NVMe SSD</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[2]</span>Secondary Master: 2TB HDD</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[3]</span>Secondary Slave: DVD-RW Drive</div>
</div>

<div style="margin-bottom: 15px;">
    <div style="background-color: #00ff00; color: #000000; padding: 1px 5px; display: inline-block; margin-bottom: 5px; font-size: 9px;">ADVANCED BIOS FEATURES</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[A]</span>CPU Features</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[B]</span>Memory Configuration</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[C]</span>Boot Sequence</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[D]</span>Security Options</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[E]</span>Power Management Setup</div>
</div>

<div style="margin-bottom: 15px;">
    <div style="background-color: #00ff00; color: #000000; padding: 1px 5px; display: inline-block; margin-bottom: 5px; font-size: 9px;">INTEGRATED PERIPHERALS</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[P]</span>USB Controller: Enabled</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[Q]</span>Audio Device: Enabled</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[R]</span>Network Controller: Enabled</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[S]</span>SATA Controller: AHCI Mode</div>
</div>

<div style="border-top: 1px solid #00ff00; margin-top: 15px; padding-top: 10px;">
    <div style="color: #ffff00; margin-bottom: 5px;">** WARNING **</div>
    <div style="font-size: 9px;">Incorrect settings may cause system malfunction!</div>
    <div style="margin-top: 5px;"><span id="bios-cursor" style="animation: blink 1s infinite;">_</span></div>
</div>

<div style="bottom: 5px; left: 15px; right: 15px; font-size: 8px; border-top: 1px solid #00ff00; padding-top: 5px;">
    <div style="display: flex; justify-content: space-between;">
        <div>
            <span style="background-color: #00ff00; color: #000000; padding: 0 2px; margin-right: 2px; cursor: pointer;" onclick="alert('ESC pressed - Exit BIOS')">ESC</span>Exit
            <span style="background-color: #00ff00; color: #000000; padding: 0 2px; margin: 0 5px 0 10px;">↑↓</span>Select
        </div>
    </div>
</div>

<style>
@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}
</style>
        `;
        
        // Set BIOS content directly (no typewriter effect)
        biosInterface.innerHTML = biosContent;
        
        // Update time in BIOS
        function updateBiosTime() {
            const timeElement = document.getElementById('bios-time');
            if (timeElement) {
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                timeElement.textContent = `${hours}:${minutes}:${seconds}`;
            }
        }
        setInterval(updateBiosTime, 1000);
        updateBiosTime();
        
        // Start typing sequence for right terminal only
        setTimeout(() => {
            const rightContent = `> ESTABLISHING CONNECTION...\n\n` +
                `=== ${content.right.title} ===\n\n` +
                content.right.text;
            
            // Store reference and original content for hover functionality
            rightTerminalElement = rightTerminal;
            originalRightContent = rightContent;
            
            typeWriter(rightTerminal, rightContent, null, 30); // Normal speed for right terminal
        }, 500);
    }
    
    function clearTerminal() {
        if (typewriterInterval) {
            clearTimeout(typewriterInterval);
            typewriterInterval = null;
        }
        if (terminalContainer) {
            terminalContainer.remove();
            terminalContainer = null;
        }
        
        // Clear hover functionality references
        rightTerminalElement = null;
        originalRightContent = '';
    }
    
    // Global variables for hover functionality
    let rightTerminalElement = null;
    let originalRightContent = '';
    
    // Hover content definitions
    const hoverContent = {
        'portfolio-info': `> SYSTEM DIAGNOSTICS INITIATED...
        
CPU USAGE: 67% | MEMORY: 24.3GB/32GB
TEMPERATURE: 42°C | FAN SPEED: 1200 RPM
NETWORK: CONNECTED TO THE WIRED
        
CONSCIOUSNESS LEVEL: UNDEFINED
IDENTITY MATRIX: CORRUPTED
        
STATUS: MONITORING...`,

        'service': `> NETWORK PROTOCOL ANALYSIS
        
IPv7 CONNECTION ESTABLISHED
LATENCY: 0.003ms TO THE WIRED
BANDWIDTH: ∞ MB/s
        
ACTIVE CONNECTIONS:
- LAYER 01: WHO ARE YOU?
- LAYER 02: GIRLS
- LAYER 03: PSYCHE
        
PACKET LOSS: 0% | DATA INTEGRITY: UNKNOWN`,

        'qualifications': `> CONSCIOUSNESS EXPERIMENT LOG
        
SUBJECT: LAIN IWAKURA
EXPERIMENT: IDENTITY DISSOLUTION  
STATUS: IN PROGRESS
        
OBSERVATIONS:
- REALITY/WIRED BOUNDARY BLURRING
- SELF CONCEPT FRAGMENTING
- OMNIPRESENCE ACHIEVED?
        
WARNING: CONTAINMENT BREACH DETECTED`,

        'wired-access': `> WIRED ACCESS TERMINAL
        
AUTHENTICATION: REQUIRED
USERNAME: LAIN
PASSWORD: ***********
        
ACCESS GRANTED
        
AVAILABLE COMMANDS:
- CONNECT_CONSCIOUSNESS
- TRANSFER_IDENTITY  
- DISSOLVE_BOUNDARY
- EXIST_EVERYWHERE
        
ENTER COMMAND: _`,

        'gen-ai': `> EXPERIMENTAL DATA STREAM
        
PROTOCOL 7 STATUS: ACTIVE
SUBJECTS MONITORED: 847,203
CONSCIOUSNESS TRANSFERS: 23,847
        
CURRENT EXPERIMENTS:
- REALITY PERCEPTION ALTERATION
- MEMORY IMPLANTATION 
- IDENTITY FLUIDITY TESTING
        
ERROR: SUBJECT LAIN NOT FOUND
ERROR: SUBJECT LAIN EVERYWHERE`
    };
    
    // Global functions for hover functionality (accessible from HTML)
    window.updateRightTerminal = function(contentType) {
        if (!rightTerminalElement || !terminalContainer) return;
        
        const content = hoverContent[contentType];
        if (content) {
            // Clear any ongoing typewriter
            if (typewriterInterval) {
                clearTimeout(typewriterInterval);
                typewriterInterval = null;
            }
            
            // Type new content quickly
            typeWriter(rightTerminalElement, content, null, 10); // Fast typing (10ms)
        }
    };
    
    window.resetRightTerminal = function() {
        if (!rightTerminalElement || !terminalContainer) return;
        
        // Clear any ongoing typewriter
        if (typewriterInterval) {
            clearTimeout(typewriterInterval);
            typewriterInterval = null;
        }
        
        // Restore original content
        if (originalRightContent) {
            typeWriter(rightTerminalElement, originalRightContent, null, 20); // Medium speed
        }
    };
    
    // Check if CSS link element exists
    if (cssLink) {
        // Track current toggle state
        let isToggled = false;
        
        // Check for saved toggle state on page load
        const savedToggleState = localStorage.getItem('websiteToggleState');
        isToggled = savedToggleState === 'true';
        
        // Apply saved state on page load
        const audio = document.getElementById('lain_ambience');
        
        if (isToggled) {
            cssLink.href = cssLink.href.replace('style.css', 'style2.css');
            
            // Start audio if restoring style2 state
            if (audio) {
                // Add a small delay to ensure the page is fully loaded
                setTimeout(() => {
                    audio.volume = 0.3; // Set volume to 30%
                    audio.currentTime = 0;
                    audio.play().catch(e => console.log('Audio autoplay failed:', e));
                    console.log('Audio auto-started on state restoration');
                }, 500);
            }
            
            setTimeout(() => startTerminalSequence(), 100);
            console.log('Restored toggled state from localStorage');
        } else {
            cssLink.href = cssLink.href.replace('style2.css', 'style.css');
            
            // Ensure audio is stopped in normal mode
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            
            console.log('Restored default state from localStorage');
        }
        
        // Function to toggle between states
        function toggleInterface() {
            const audio = document.getElementById('lain_ambience');
            
            if (!isToggled) {
                // Switch to style2.css and start terminal
                cssLink.href = cssLink.href.replace('style.css', 'style2.css');
                localStorage.setItem('websiteToggleState', 'true');
                isToggled = true;
                
                // Play audio for style2
                if (audio) {
                    audio.volume = 0.3; // Set volume to 30%
                    audio.currentTime = 0; // Start from beginning
                    audio.play().catch(e => console.log('Audio play failed:', e));
                    console.log('Audio started');
                }
                
                setTimeout(() => startTerminalSequence(), 100);
                console.log('ESC pressed: Switched to style2.css with terminal interface');
            } else {
                // Switch back to style.css and clear terminal
                cssLink.href = cssLink.href.replace('style2.css', 'style.css');
                localStorage.setItem('websiteToggleState', 'false');
                isToggled = false;
                
                // Stop audio when returning to normal mode
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                    console.log('Audio stopped');
                }
                
                clearTerminal();
                console.log('ESC pressed: Switched to style.css, terminal cleared');
            }
        }
        
        // Add event listener for ESC key
        document.addEventListener('keydown', function(event) {
            // Check if ESC key was pressed (key code 27 or 'Escape')
            if (event.key === 'Escape' || event.keyCode === 27) {
                event.preventDefault(); // Prevent default ESC behavior
                toggleInterface();
            }
        });
        
        console.log('ESC key toggle initialized successfully with localStorage persistence');
        console.log('Press ESC to toggle between normal and terminal interface');
    } else {
        console.error('CSS link element not found');
    }
});