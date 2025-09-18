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
                src: url('fonts/AcPlus_IBM_VGA_8x16.ttf') format('truetype');
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
    
    // Utility function to get clean text content from any element
    function getElementText(selector, defaultText = '', context = document) {
        const element = context.querySelector(selector);
        return element ? element.textContent.trim() : defaultText;
    }
    
    // Utility function to get text from multiple elements
    function getMultipleElementsText(selector, separator = '\n', context = document) {
        const elements = context.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent.trim()).join(separator);
    }
    
    // Main content extraction function that can be called externally
    window.extractPageContent = function(pageType = null) {
        const currentPage = pageType || window.location.pathname.split('/').pop() || 'index.html';
        const personalTitle = getElementText('#personal-title', 'david\'s personal');
        
        if (currentPage === 'qualifications.html') {
            return {
                pageType: 'qualifications',
                title: personalTitle,
                obiText: getElementText('.obi-text', '資格・技能証明書'),
                education: {
                    title: getElementText('.qualification-section .qualification-header', 'Educational Background'),
                    items: Array.from(document.querySelectorAll('.qualification-section:first-of-type .qualification-item')).map(item => ({
                        title: getElementText('.qualification-title', '', item),
                        details: getMultipleElementsText('.qualification-details', ' | ', item),
                        date: getElementText('.qualification-date', '', item)
                    }))
                },
                experience: Array.from(document.querySelectorAll('.qualification-section')).slice(1).map(section => ({
                    header: getElementText('.qualification-header', '', section),
                    items: Array.from(section.querySelectorAll('.qualification-item')).map(item => ({
                        title: getElementText('.qualification-title', '', item),
                        details: getMultipleElementsText('.qualification-details', ' | ', item),
                        date: getElementText('.qualification-date', '', item)
                    }))
                })),
                description: getElementText('.qualifications-right-column p', '')
            };
        } else if (currentPage === 'portfolio.html') {
            return {
                pageType: 'portfolio',
                title: personalTitle,
                projects: Array.from(document.querySelectorAll('.file-folder')).map(item => {
                    const fileTab = item.querySelector('.file-tab');
                    return {
                        title: getElementText('.file-title', '', item),
                        status: getElementText('.file-status', '', item),
                        description: getMultipleElementsText('.file-details', ' | ', item),
                        tech: getElementText('.file-tech', '', item),
                        url: fileTab?.dataset?.url || getElementText('a.file-link-btn', '', item)?.href || ''
                    };
                })
            };
        } else if (currentPage === 'service.html') {
            return {
                pageType: 'service',
                title: personalTitle,
                serviceTitle: getElementText('.service-title', 'SERVICE'),
                description: getElementText('.bottom-section p', ''),
                fullContent: `> SERVICE PROTOCOL INITIATED...\n\n=== SINGING CADETS DATABASE ===\n\nORGANIZATION: Texas A&M Singing Cadets\nROLE: Former Social Chairman / Event Coordinator\nSTATUS: Active Member\nNICKNAME: "Flower Boy"\n\nPERFORMANCE HISTORY:\n- University Donation Ceremonies\n- Country Music Events (George Strait)\n- Campus-wide Performances\n- Arts Engagement Programs\n\nCURRENT RESPONSIBILITIES:\n- Event Planning & Coordination\n- Vendor Relations (Houston Florists)\n- Community Outreach\n- Artistic Leadership\n\nCONTRIBUTION STATUS: SIGNIFICANT\nPRIDE LEVEL: MAXIMUM\nARTISTIC IMPACT: ONGOING\n\n> BRIDGING DIGITAL AND ANALOG WORLDS...\n> WHERE CONSCIOUSNESS MEETS CREATIVITY...\n> THE WIRED EXTENDS TO EVERY ASPECT OF BEING...`
            };    
        } else {
            // Default index.html content
            return {
                pageType: 'index',
                title: personalTitle,
                websiteTitle: getElementText('#website-title-w', '') + getElementText('#website-title-ebsite', ''),
                lainText: getElementText('#Lain-Text', 'シリアルエクスペリメンツ・Lain (1999)'),
                leftColumn: {
                    title: getElementText('.column:first-child h3', 'THE WIRED'),
                    content: getMultipleElementsText('.column:first-child p', '\n\n')
                },
                rightColumn: {
                    title: getElementText('.column:last-child h3', 'PROTOCOL & SYSTEM LOG'),
                    content: getMultipleElementsText('.column:last-child p', '\n\n')
                }
            };
        }
    };

    function extractContentFromPage() {
        // Use the utility function and format for terminal display
        const content = window.extractPageContent();
        
        // Debug logging to see what page is being detected
        console.log('Page type detected:', content.pageType);
        console.log('Full content object:', content);
        
        if (content.pageType === 'qualifications') {
            // Format qualifications data for terminal display
            const educationText = content.education.items.map(item => 
                `${item.title}\n${item.details}\n${item.date}`
            ).join('\n\n');
            
            const experienceText = content.experience.map(section => 
                `=== ${section.header} ===\n` + 
                section.items.map(item => `${item.title}\n${item.details}\n${item.date}`).join('\n\n')
            ).join('\n\n');
            
            return {
                header: `${content.title}\n${content.obiText}\n\n`,
                left: {
                    title: 'QUALIFICATIONS DATABASE',
                    text: `${educationText}\n\n${experienceText}`
                },
                right: {
                    title: 'SUBJECT ANALYSIS',
                    text: content.description
                }
            };
        } else if (content.pageType === 'portfolio') {
            // Format portfolio data for terminal display
            const projectsText = content.projects.map(project => 
                `${project.title} - ${project.status}\n${project.description}\n${project.tech}`
            ).join('\n\n');
            
            return {
                header: `${content.title}\nPORTFOLIO DATABASE\n\n`,
                left: {
                    title: 'BIOS INTERFACE',
                    text: 'SYSTEM READY'
                },
                right: {
                    title: 'PROJECT ARCHIVE',
                    text: projectsText
                }
            };
        } else if (content.pageType === 'service') {
            // Format service data for terminal display - no hover zones needed
            return {
                header: `${content.title}\n${content.serviceTitle}\n\n`,
                left: {
                    title: 'BIOS INTERFACE',
                    text: 'SYSTEM READY'
                },
                right: {
                    title: 'SERVICE MODULE',
                    text: content.fullContent
                }
            };
        } else {
            // Default index.html formatting
            return {
                header: `${content.title}\n${content.websiteTitle}\n${content.lainText}\n\n`,
                left: {
                    title: content.leftColumn.title,
                    text: content.leftColumn.content
                },
                right: {
                    title: content.rightColumn.title,
                    text: content.rightColumn.content
                }
            };
        }
    }
    
    function typeWriter(element, text, callback, speed = 30) {
        let i = 0;
        element.innerHTML = '';
        
        // Convert newlines to HTML breaks for proper display
        const formattedText = text.replace(/\n/g, '<br>');
        
        function type() {
            if (i < formattedText.length) {
                // Handle HTML tags properly - don't break them during typing
                if (formattedText.charAt(i) === '<') {
                    // Find the end of the HTML tag
                    let tagEnd = formattedText.indexOf('>', i);
                    if (tagEnd !== -1) {
                        // Add the complete tag at once
                        element.innerHTML += formattedText.substring(i, tagEnd + 1);
                        i = tagEnd + 1;
                    } else {
                        element.innerHTML += formattedText.charAt(i);
                        i++;
                    }
                } else {
                    element.innerHTML += formattedText.charAt(i);
                    i++;
                }
                typewriterInterval = setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }
    
    function startTerminalSequence() {
        const content = extractContentFromPage();
        const { leftTerminal: biosInterface, rightTerminal } = createTerminal();
        
        // Create BIOS-style content with interactive HTML elements
        const biosContent = `
<div style="border-bottom: 1px solid #00ff00; padding-bottom: 8px; margin-bottom: 15px;">
    <div style="font-size: 11px; margin-bottom: 3px;">David's Personal website v4.1 Release 6.0</div>
    <div style="font-size: 9px;">Copyright (C) 1985-2025, Dev MODE</div>
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
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[F]</span>USB Controller: Enabled</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[G]</span>Audio Device: Enabled</div>
    <div style="margin-bottom: 2px; cursor: pointer; padding: 1px 0;" onmouseover="this.style.backgroundColor='#00ff00'; this.style.color='#000000'; this.style.paddingLeft='5px'" onmouseout="this.style.backgroundColor=''; this.style.color=''; this.style.paddingLeft='1px'" onclick="this.style.backgroundColor='#ffff00'; setTimeout(() => this.style.backgroundColor='#00ff00', 100);"><span style="color: #ffff00; margin-right: 5px;">[H]</span>Network Controller: Enabled</div>
</div>

<div style="border-top: 1px solid #00ff00; margin-top: 15px; padding-top: 10px;">
    <div style="color: #ffff00; margin-bottom: 5px;">** WARNING **</div>
    <div style="font-size: 9px;">Incorrect settings may cause system malfunction!</div>
    <div style="margin-top: 5px;"><span id="bios-cursor" style="animation: blink 1s infinite;">_</span></div>
</div>

<div style="bottom: 5px; left: 15px; right: 15px; font-size: 8px; border-top: 1px solid #00ff00; padding-top: 5px;">
    <div style="display: flex; justify-content: space-between;">
        <div>
            <span style="background-color: #00ff00; color: #000000; padding: 0 2px; margin-right: 2px; cursor: pointer;"">ESC</span>Exit Dev Mode
            <span style="background-color: #00ff00; color: #000000; padding: 0 2px; margin: 0 5px 0 10px;">Q</span>Go to Landing Page
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
ERROR: SUBJECT LAIN EVERYWHERE`,

        'education-info': `> EDUCATIONAL DATABASE ACCESS
        
INSTITUTION: TEXAS A&M UNIVERSITY
DEGREE: BACHELOR OF ARTS - COMPUTER SCIENCE
MINOR: ENGLISH LITERATURE
        
ACADEMIC STATUS: IN PROGRESS
COMPLETION: MAY 2027
CURRENT STANDING: JUNIOR
        
SPECIALIZATIONS:
- SYSTEMS PROGRAMMING
- ALGORITHMS & DATA STRUCTURES
- SOFTWARE ENGINEERING
- LITERARY ANALYSIS
        
GPA: CLASSIFIED`,

        'scale-ai-intern': `> SCALE AI PERSONNEL FILE
        
POSITION: TECHNICAL ADVISOR INTERN
DEPARTMENT: ARTIFICIAL INTELLIGENCE
CLEARANCE LEVEL: ACTIVE
        
PROJECT: ARC-AGI DATASET ANALYSIS
COLLABORATION: GOOGLE DEEPMIND
MISSION: HUMANITY'S LAST EXAM
        
RESPONSIBILITIES:
- DATASET EVALUATION
- AI SAFETY PROTOCOLS
- CONSCIOUSNESS RESEARCH
        
STATUS: CURRENT ASSIGNMENT
THREAT LEVEL: MINIMAL`,

        'robotics-researcher': `> ROBOTICS RESEARCH PROTOCOL
        
PROJECT: MULTI-AGENT TASK ALLOCATION
INSTITUTION: TEXAS A&M UNIVERSITY
DURATION: MAY 2025 - AUG 2025
        
ALGORITHM STATUS: PATENT PENDING
SIMULATION PLATFORM: GAZEBO + ROS2
APPLICATION: WAREHOUSE OPTIMIZATION
        
RESEARCH OUTCOMES:
- EFFICIENCY IMPROVEMENT: 35%
- COLLISION REDUCTION: 89%
- TASK COMPLETION: OPTIMIZED
        
ACHIEVEMENT: BREAKTHROUGH`,

        'daikin-intern': `> DAIKIN SYSTEMS ACCESS LOG
        
POSITION: SOFTWARE ENGINEERING INTERN
COMPANY: DAIKIN NORTH AMERICA
PERIOD: MAY 2023 - AUG 2023
        
PROJECT: HISTORICAL DATA PROCESSING
ARCHITECTURE: MVC ADMINISTRATIVE APP
DATA VOLUME: 20TB+ PROCESSED
        
TECHNOLOGIES:
- PYTHON AUTOMATION SCRIPTS
- AWS S3 DATA RETRIEVAL  
- AWS LAMBDA INTEGRATION
        
EFFICIENCY GAIN: +300%
LEGACY SYSTEMS: MODERNIZED`
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
        
        // Add event listener for ESC key and Q key
        document.addEventListener('keydown', function(event) {
            // Check if ESC key was pressed (key code 27 or 'Escape')
            if (event.key === 'Escape' || event.keyCode === 27) {
                event.preventDefault(); // Prevent default ESC behavior
                toggleInterface();
            }
            // Check if Q key was pressed
            else if (event.key === 'q' || event.key === 'Q') {
                event.preventDefault(); // Prevent default Q behavior
                window.location.href = 'index.html';
            }
        });
        
        console.log('ESC key toggle initialized successfully with localStorage persistence');
        console.log('Press ESC to toggle between normal and terminal interface');
    } else {
        console.error('CSS link element not found');
    }
});