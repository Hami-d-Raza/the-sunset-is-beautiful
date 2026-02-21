document.addEventListener('click', function(e) {
    const lantern = document.createElement('div');
    lantern.classList.add('lantern');
    
    // Set position to click coordinates
    lantern.style.left = e.clientX + 'px';
    lantern.style.top = e.clientY + 'px';
    
    // Randomize slight horizontal drift
    const drift = (Math.random() - 0.5) * 50;
    lantern.style.transform = `translateX(${drift}px)`;
    
    document.body.appendChild(lantern);
    
    // Remove after animation completes
    setTimeout(() => {
        lantern.remove();
    }, 10000); // Match animation duration
});

// Sparkles removed per user request (kept fireflies only)

// Generate Clouds
function createCloud(initial = false) {
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');
    
    // Random vertical position (top half of screen)
    cloud.style.top = Math.random() * 40 + 'vh';
    cloud.style.transform = `scale(${Math.random() * 0.5 + 0.7})`;
    cloud.style.left = Math.random() * 90 + 'vw';
    
    // Random speed
    const duration = Math.random() * 20 + 20; // 20s to 40s
    cloud.style.animationDuration = duration + 's';
    
    // If it's an initial cloud, start it mid-way through animation
    if (initial) {
        const randomDelay = Math.random() * duration;
        cloud.style.animationDelay = `-${randomDelay}s`;
    }

    document.body.appendChild(cloud);
    
    // Remove after animation (plus buffer if initial)
    setTimeout(() => {
        cloud.remove();
    }, duration * 1000);
}

// Start with a few clouds already populated
for(let i=0; i<5; i++) {
    createCloud(true);
}

// Spawn a cloud every few seconds
setInterval(() => createCloud(false), 4000);

// Generate Rolling Hills (Option 1)
function generateRollingHills() {
    const svg = document.getElementById('ground-svg');
    
    // Get actual dimensions
    const rect = svg.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Set viewBox to match pixel dimensions to prevent distortion
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Clear previous contents
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    // Configuration for 3 layers of hills - Night Theme Colors with Gradients info
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.appendChild(defs);

    const layers = [
        { id: 'grad1', colorTop: '#6b2737', colorBot: '#4a1a25', amplitude: 20, frequency: 0.005, offset: height * 0.5, zIndex: 1 },
        { id: 'grad2', colorTop: '#591f2e', colorBot: '#3d1420', amplitude: 25, frequency: 0.008, offset: height * 0.6, zIndex: 2 },
        { id: 'grad3', colorTop: '#4a1a25', colorBot: '#2b0f17', amplitude: 30, frequency: 0.012, offset: height * 0.7, zIndex: 3 }
    ];

    layers.forEach(layer => {
        // Create linear gradient for this layer
        const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        grad.id = layer.id;
        grad.setAttribute("x1", "0%");
        grad.setAttribute("y1", "0%");
        grad.setAttribute("x2", "0%");
        grad.setAttribute("y2", "100%");
        
        const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", layer.colorTop);
        
        const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", layer.colorBot);
        
        grad.appendChild(stop1);
        grad.appendChild(stop2);
        defs.appendChild(grad);

        let d = `M0,${height} `; 
        
        // Generate smooth curve points
        for (let x = 0; x <= width; x += 10) {
            const y = layer.offset - Math.sin(x * layer.frequency) * layer.amplitude;
            d += `L${x},${y} `;
        }
        
        // Ensure we end exactly at the right edge
        const finalY = layer.offset - Math.sin(width * layer.frequency) * layer.amplitude;
        d += `L${width},${finalY} `;
        d += `L${width},${height} Z`; 
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("fill", `url(#${layer.id})`);
        // Add a subtle top stroke for rim lighting from the sunset
        path.setAttribute("stroke", "#ff9966"); 
        path.setAttribute("stroke-width", "1.5");
        path.setAttribute("stroke-opacity", "0.6");
        
        svg.appendChild(path);

        // Add trees to this layer
        // Scale tree count by width to keep density consistent
        const treeDensity = width / 200; // approx 1 tree per 200px per layer base
        const treeCount = Math.floor(Math.random() * 3) + treeDensity; 
        
        for(let i = 0; i < treeCount; i++) {
            const treeX = Math.random() * width;
            const treeY = layer.offset - Math.sin(treeX * layer.frequency) * layer.amplitude;
            
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            
            // Add swaying animation
            g.classList.add('tree-sway');
            g.style.animationDuration = (Math.random() * 2 + 3) + 's'; // 3-5s duration
            g.style.animationDelay = (Math.random() * -5) + 's'; // Random start
            
            const scale = (layer.zIndex * 0.2) + 0.5; 
            
            // Trunk
            const trunk = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            trunk.setAttribute("x", treeX - (2 * scale));
            trunk.setAttribute("y", treeY - (10 * scale));
            trunk.setAttribute("width", 4 * scale);
            trunk.setAttribute("height", 10 * scale);
            trunk.setAttribute("fill", "#2b0f17"); // Deep burgundy silhouette
            
            // Foliage
            const foliage = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            foliage.setAttribute("cx", treeX);
            foliage.setAttribute("cy", treeY - (15 * scale));
            foliage.setAttribute("r", 10 * scale);
            
            // Silhouette foliage for sunset - warm burgundy tones
            let foliageColor;
            if (layer.zIndex === 1) foliageColor = "#4a1a25";
            if (layer.zIndex === 2) foliageColor = "#3d1420";
            if (layer.zIndex === 3) foliageColor = "#2b0f17";
            
            foliage.setAttribute("fill", foliageColor);
            
            g.appendChild(trunk);
            g.appendChild(foliage);
            svg.appendChild(g);
        }
    });
}

// Debounce resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(generateRollingHills, 100);
});

// Generate Shooting Stars
function createShootingStar(force = false, startX, startY) {
    if (!force && Math.random() > 0.6) return; 

    const star = document.createElement('div');
    star.classList.add('shooting-star');
    
    // Position
    if (startX !== undefined && startY !== undefined) {
        // Random offset from click
        const offsetX = (Math.random() - 0.5) * 200;
        const offsetY = (Math.random() - 0.5) * 100;
        star.style.left = (startX + offsetX) + 'px';
        star.style.top = (startY + offsetY) + 'px';
    } else {
        // Default top right quadrant
        star.style.left = (Math.random() * 50 + 50) + 'vw';
        star.style.top = (Math.random() * 30) + 'vh';
    }
    
    // Vary size slightly
    if (force) {
        star.style.width = (Math.random() * 100 + 50) + 'px';
        star.style.animationDuration = (Math.random() * 1 + 1) + 's';
    }
    
    document.body.appendChild(star);
    
    setTimeout(() => {
        star.remove();
    }, 2000);
}

setInterval(() => createShootingStar(), 1500); 

// Meteor Shower Click Handler
let lastBurstTime = 0;
const BURST_COOLDOWN = 2000; // 2 seconds between bursts

document.addEventListener('click', (e) => {
    // Ignore interactive elements or if dragging a line just ended
    if (e.target.closest('button') || e.target.closest('.star') || isDragging) return;
    
    const now = Date.now();
    
    // Check cooldown
    if (now - lastBurstTime > BURST_COOLDOWN) {
        lastBurstTime = now;
        
        // Spawn a burst from a RANDOM location (not mouse)
        const burstX = Math.random() * window.innerWidth;
        const burstY = Math.random() * (window.innerHeight * 0.4); 
        
        const count = Math.floor(Math.random() * 8) + 5; // 5-12 stars
        for(let i=0; i<count; i++) {
            setTimeout(() => {
                createShootingStar(true, burstX, burstY);
            }, i * 100); 
        }
    }
}); 

// --- Audio System (Music) ---
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

function toggleAudio() {
    const btn = document.getElementById('audio-btn');
    
    if (!isPlaying) {
        bgMusic.play().then(() => {
            console.log("Audio playing");
        }).catch(e => console.error("Audio play failed:", e));
        
        btn.innerText = "⏸️ Pause Music";
        isPlaying = true;
    } else {
        bgMusic.pause();
        btn.innerText = "🎵 Play Music";
        isPlaying = false;
    }
}

document.getElementById('audio-btn').addEventListener('click', toggleAudio);

document.getElementById('audio-btn').addEventListener('click', toggleAudio);

// --- Interactive Constellations ---
const canvas = document.getElementById('constellation-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
let lines = [];
let isDragging = false;
let startStar = null;
let currentMousePos = { x: 0, y: 0 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Generate Stars & Store Positions
function createStars() {
    // Clear old stars if any
    const existingStars = document.querySelectorAll('.star');
    existingStars.forEach(s => s.remove());
    stars = [];

    for(let i=0; i<100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random pos
        const x = Math.random() * 100; // vw
        const y = Math.random() * 60; // vh
        
        star.style.left = x + 'vw';
        star.style.top = y + 'vh'; 
        star.style.animationDuration = (Math.random() * 2 + 1) + 's'; 
        
        document.body.appendChild(star);
        
        // Store pixel coordinates for interaction
        stars.push({
            element: star,
            x: (x / 100) * window.innerWidth,
            y: (y / 100) * window.innerHeight,
            vx: x, // store relative for resize recalc (optional, for now just static)
            vy: y
        });
    }
}

// Update star positions on resize
window.addEventListener('resize', () => {
    stars.forEach(star => {
        star.x = (star.vx / 100) * window.innerWidth;
        star.y = (star.vy / 100) * window.innerHeight;
    });
});

// Interaction
document.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Check if clicked near a star (tolerance 15px)
    const clickedStar = stars.find(s => Math.hypot(s.x - mouseX, s.y - mouseY) < 20);
    
    if (clickedStar) {
        isDragging = true;
        startStar = clickedStar;
        currentMousePos = { x: mouseX, y: mouseY };
        
        // Highlight start star
        startStar.element.style.boxShadow = "0 0 15px white";
        startStar.element.style.transform = "scale(1.5)";
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        currentMousePos = { x: e.clientX, y: e.clientY };
    }
});

document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Check if released near another star
    const endStar = stars.find(s => Math.hypot(s.x - mouseX, s.y - mouseY) < 20);
    
    if (endStar && endStar !== startStar) {
        // Create permanent line
        lines.push({ x1: startStar.x, y1: startStar.y, x2: endStar.x, y2: endStar.y, alpha: 1.0 });
        
        // Flash end star
        endStar.element.style.boxShadow = "0 0 15px white";
        endStar.element.style.transform = "scale(1.5)";
        setTimeout(() => {
            endStar.element.style.boxShadow = "none";
            endStar.element.style.transform = "scale(1)";
        }, 500);
    }
    
    // Reset start star style
    if (startStar) {
        startStar.element.style.boxShadow = "none";
        startStar.element.style.transform = "scale(1)";
    }
    
    isDragging = false;
    startStar = null;
});

// Animation Loop for Canvas
function animateConstellations() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw existing lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1;
    
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${line.alpha})`;
        ctx.stroke();
        
        // Fade out very slowly
        line.alpha -= 0.002;
        if (line.alpha <= 0) lines.splice(i, 1);
    }
    
    // Draw drag line
    if (isDragging && startStar) {
        ctx.beginPath();
        ctx.moveTo(startStar.x, startStar.y);
        ctx.lineTo(currentMousePos.x, currentMousePos.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.setLineDash([5, 5]); // Dashed for dragging
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    requestAnimationFrame(animateConstellations);
}
animateConstellations();

// Generate Stars (Original call)
// createStars(); -> Called at init

// Generate Fireflies
let fireflies = [];

function createFirefly() {
    const firefly = document.createElement('div');
    firefly.classList.add('firefly');
    
    // Start random pos
    const startX = Math.random() * 100; // vw
    const startY = Math.random() * 30; // vh from bottom
    
    firefly.style.left = startX + 'vw';
    firefly.style.bottom = startY + 'vh';
    
    // Store subtle movement state
    const ffObj = {
        element: firefly,
        x: (startX / 100) * window.innerWidth,
        y: window.innerHeight - ((startY / 100) * window.innerHeight), // convert bottom vh to top px
        vx: (Math.random() - 0.5) * 0.5, // random velocity
        vy: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: Math.random() * 300 + 200 // frames
    };
    
    document.body.appendChild(firefly);
    fireflies.push(ffObj);
}

// Animate Fireflies (Game Loop style for interaction)
function updateFireflies() {
    for (let i = fireflies.length - 1; i >= 0; i--) {
        const ff = fireflies[i];
        
        // Attraction to mouse
        const dx = currentMousePos.x - ff.x;
        const dy = currentMousePos.y - ff.y;
        const dist = Math.hypot(dx, dy);
        
        // If mouse is close (within 200px), gently steer towards it
        if (dist < 200 && dist > 10) {
            ff.vx += (dx / dist) * 0.05;
            ff.vy += (dy / dist) * 0.05;
        }
        
        // Random wandering noise
        ff.vx += (Math.random() - 0.5) * 0.1;
        ff.vy += (Math.random() - 0.5) * 0.1;
        
        // Drag/Friction
        ff.vx *= 0.98;
        ff.vy *= 0.98;
        
        // Update pos
        ff.x += ff.vx;
        ff.y += ff.vy;
        
        // Apply to DOM
        ff.element.style.left = ff.x + 'px';
        ff.element.style.top = ff.y + 'px'; // Switch to top positioning for control
        ff.element.style.bottom = 'auto';
        
        // Life cycle
        ff.life++;
        if (ff.life > ff.maxLife) {
            ff.element.remove();
            fireflies.splice(i, 1);
        }
    }
    
    requestAnimationFrame(updateFireflies);
}
updateFireflies();

setInterval(createFirefly, 1000);

// Init
generateRollingHills();
createStars();
