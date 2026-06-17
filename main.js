/**
 * BotLeague Landing Page Interactions
 * Author: Mayur Kharat
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Navigation & Mobile Menu
    // ----------------------------------------------------
    const header = document.querySelector('.main-header');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Navigation Toggle
    mobileNavToggle.addEventListener('click', () => {
        mobileNavToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Intersection Observer for Active Nav State
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));


    // ----------------------------------------------------
    // 2. Arena Lights Switcher (Pyro Red vs Plasma Blue)
    // ----------------------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleText = themeToggle.querySelector('.theme-toggle-text');
    const body = document.body;

    // Load saved theme preference
    const savedTheme = localStorage.getItem('botleague-theme');
    if (savedTheme === 'plasma') {
        body.classList.replace('theme-pyro', 'theme-plasma');
        themeToggleText.textContent = 'Plasma Blue';
        updateConnectorsTheme('plasma');
    } else {
        body.classList.add('theme-pyro');
        themeToggleText.textContent = 'Pyro Red';
        updateConnectorsTheme('pyro');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('theme-pyro')) {
            body.classList.replace('theme-pyro', 'theme-plasma');
            themeToggleText.textContent = 'Plasma Blue';
            localStorage.setItem('botleague-theme', 'plasma');
            updateConnectorsTheme('plasma');
        } else {
            body.classList.replace('theme-plasma', 'theme-pyro');
            themeToggleText.textContent = 'Pyro Red';
            localStorage.setItem('botleague-theme', 'pyro');
            updateConnectorsTheme('pyro');
        }
    });

    function updateConnectorsTheme(theme) {
        const connectors = document.querySelectorAll('.connector-line');
        connectors.forEach(conn => {
            if (conn.classList.contains('highlighted')) {
                // Keep highlighted style
            } else {
                conn.style.stroke = theme === 'plasma' ? 'rgba(0, 191, 255, 0.2)' : 'rgba(255, 59, 48, 0.2)';
            }
        });
    }


    // ----------------------------------------------------
    // 3. Live Tournament Bracket Highlight
    // ----------------------------------------------------
    const bracketTeams = document.querySelectorAll('.bracket-team');
    const connectorLine = document.getElementById('conn-semi');

    bracketTeams.forEach(team => {
        team.addEventListener('mouseenter', function() {
            const teamId = this.getAttribute('data-team');
            if (!teamId) return;

            // Highlight all bracket elements matching this team
            document.querySelectorAll(`.bracket-team[data-team="${teamId}"]`).forEach(el => {
                el.classList.add('highlighted');
            });

            // Highlight corresponding connector lines
            if (connectorLine) {
                connectorLine.classList.add('highlighted');
            }
        });

        team.addEventListener('mouseleave', function() {
            const teamId = this.getAttribute('data-team');
            if (!teamId) return;

            document.querySelectorAll(`.bracket-team[data-team="${teamId}"]`).forEach(el => {
                el.classList.remove('highlighted');
            });

            if (connectorLine) {
                connectorLine.classList.remove('highlighted');
            }
        });
    });


    // ----------------------------------------------------
    // 4. Live Event Countdown Timer
    // ----------------------------------------------------
    const countdownDays = document.getElementById('days');
    const countdownHours = document.getElementById('hours');
    const countdownMins = document.getElementById('mins');

    // Event date: July 12, 2026, at 10:00 AM (IST)
    const eventDate = new Date('July 12, 2026 10:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = eventDate - now;

        if (difference <= 0) {
            if (countdownDays) countdownDays.textContent = '00';
            if (countdownHours) countdownHours.textContent = '00';
            if (countdownMins) countdownMins.textContent = '00';
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (countdownDays) countdownDays.textContent = d < 10 ? '0' + d : d;
        if (countdownHours) countdownHours.textContent = h < 10 ? '0' + h : h;
        if (countdownMins) countdownMins.textContent = m < 10 ? '0' + m : m;
    }

    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute

    // Animate live viewer count to feel real-time
    const liveViewerEl = document.getElementById('liveViewerCount');
    if (liveViewerEl) {
        let baseCount = 12847;
        setInterval(() => {
            const delta = Math.floor((Math.random() - 0.45) * 120);
            baseCount = Math.max(10000, baseCount + delta);
            liveViewerEl.textContent = baseCount.toLocaleString('en-IN');
        }, 3200);
    }

    // Ecosystem member count fluctuation
    const ecoCountEl = document.getElementById('ecoMemberCount');
    if (ecoCountEl) {
        let ecoBase = 2340;
        setInterval(() => {
            const delta = Math.floor((Math.random() - 0.4) * 8);
            ecoBase = Math.max(2200, ecoBase + delta);
            ecoCountEl.textContent = ecoBase.toLocaleString('en-IN');
        }, 4500);
    }

    // Ecosystem role pills — click to smooth-scroll + highlight
    const rolePills = document.querySelectorAll('.eco-role-pill');
    rolePills.forEach(pill => {
        pill.addEventListener('click', () => {
            rolePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const targetId = pill.dataset.target;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Flash highlight
                targetEl.style.transition = 'box-shadow 0.3s ease';
                targetEl.style.boxShadow = '0 0 0 2px var(--accent), 0 30px 70px rgba(0,0,0,0.8)';
                setTimeout(() => { targetEl.style.boxShadow = ''; }, 1200);
            }
        });
    });


    // ----------------------------------------------------
    // 5b. About Section — Animated Stat Counters + Terminal Clock
    // ----------------------------------------------------

    // Animated number counter triggered by IntersectionObserver
    const statVals = document.querySelectorAll('.about-stat-val');
    if (statVals.length) {
        const animateCounter = (el) => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 1400;
            const start = performance.now();
            const update = (now) => {
                const elapsed = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
                el.textContent = Math.floor(eased * target);
                if (elapsed < 1) requestAnimationFrame(update);
                else el.textContent = target;
            };
            requestAnimationFrame(update);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statVals.forEach(animateCounter);
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.4 });

        const statsSection = document.querySelector('.about-stats');
        if (statsSection) statsObserver.observe(statsSection);
    }

    // Terminal OS card clock
    const avfTimeEl = document.getElementById('avfTime');
    if (avfTimeEl) {
        const updateClock = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            avfTimeEl.textContent = `${h}:${m}:${s}`;
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    // Typewriter for terminal vl-text spans
    const vlTexts = document.querySelectorAll('.vl-text[data-text]');
    vlTexts.forEach((el, idx) => {
        el.textContent = '';
        const text = el.getAttribute('data-text');
        let i = 0;
        const delay = idx * 600 + 300;
        setTimeout(() => {
            const type = setInterval(() => {
                if (i < text.length) {
                    el.textContent += text[i++];
                } else {
                    clearInterval(type);
                }
            }, 32);
        }, delay);
    });


    // ----------------------------------------------------
    // 5. Searchable & Sortable Leaderboard
    // ----------------------------------------------------
    const leaderboardSearch = document.getElementById('leaderboardSearch');
    const leaderboardSort = document.getElementById('leaderboardSort');
    const leaderboardBody = document.getElementById('leaderboardBody');
    let leaderboardRows = Array.from(leaderboardBody.querySelectorAll('tr'));

    // Filter by search query
    leaderboardSearch.addEventListener('input', filterLeaderboard);

    function filterLeaderboard() {
        const query = leaderboardSearch.value.toLowerCase().trim();

        leaderboardRows.forEach(row => {
            const teamName = row.querySelector('.team-cell').textContent.toLowerCase();
            const location = row.cells[2].textContent.toLowerCase();

            if (teamName.includes(query) || location.includes(query)) {
                row.style.display = '';
                if (query.length > 0) {
                    row.classList.add('search-highlight');
                } else {
                    row.classList.remove('search-highlight');
                }
            } else {
                row.style.display = 'none';
                row.classList.remove('search-highlight');
            }
        });
    }

    // Sort leaderboard rows
    leaderboardSort.addEventListener('change', () => {
        const sortBy = leaderboardSort.value;

        leaderboardRows.sort((rowA, rowB) => {
            if (sortBy === 'rank') {
                const rankA = parseInt(rowA.getAttribute('data-rank'));
                const rankB = parseInt(rowB.getAttribute('data-rank'));
                return rankA - rankB;
            } else if (sortBy === 'points') {
                const pointsA = parseInt(rowA.getAttribute('data-points'));
                const pointsB = parseInt(rowB.getAttribute('data-points'));
                return rankB - rankA; // Higher points first
            } else if (sortBy === 'wins') {
                const winsA = parseInt(rowA.getAttribute('data-wins'));
                const winsB = parseInt(rowB.getAttribute('data-wins'));
                return winsB - winsA; // Higher wins first
            }
            return 0;
        });

        // Re-append rows in sorted order with a fade effect
        leaderboardBody.style.opacity = '0';
        setTimeout(() => {
            leaderboardRows.forEach(row => leaderboardBody.appendChild(row));
            leaderboardBody.style.opacity = '1';
        }, 150);
    });


    // ----------------------------------------------------
    // 6. Ecosystem Form Validation & Success States
    // ----------------------------------------------------
    const ecoForms = document.querySelectorAll('.eco-form');

    ecoForms.forEach(form => {
        const card = form.closest('.eco-card');
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            // Simple validation check
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                const group = input.closest('.form-group');
                if (input.type === 'email') {
                    if (!validateEmail(input.value)) {
                        group.classList.add('has-error');
                        isValid = false;
                    } else {
                        group.classList.remove('has-error');
                    }
                } else {
                    if (input.value.trim() === '') {
                        group.classList.add('has-error');
                        isValid = false;
                    } else {
                        group.classList.remove('has-error');
                    }
                }
            });

            if (isValid) {
                // Show loading animation on button
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> REGISTERING...';

                // Simulate AJAX response after 1.2s
                setTimeout(() => {
                    card.classList.add('submitted');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    
                    // Reset input values
                    inputs.forEach(input => {
                        input.value = '';
                    });
                }, 1200);
            }
        });

        // Remove error class on focus/input
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                this.closest('.form-group').classList.remove('has-error');
            });
        });
    });

    // Reset forms inside cards (Submit Another button)
    const resetButtons = document.querySelectorAll('.reset-form-btn');
    resetButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.eco-card');
            card.classList.remove('submitted');
        });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Newsletter Form Handler
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input');
            if (validateEmail(emailInput.value)) {
                newsletterSuccess.classList.add('visible');
                emailInput.value = '';
                setTimeout(() => {
                    newsletterSuccess.classList.remove('visible');
                }, 4000);
            }
        });
    }


    // ----------------------------------------------------
    // 7. Dynamic Details Modal (Categories & Disciplines)
    // ----------------------------------------------------
    const detailModal = document.getElementById('detailModal');
    const modalClose = document.getElementById('modalClose');
    const modalBodyContent = document.getElementById('modalBodyContent');

    // Data Store for Categories
    const categoriesData = {
        mini: {
            title: "Mini Fighters Class",
            subtitle: "Weight limit: Under 5 kg",
            desc: "The Mini Fighters class is the perfect sandbox for budding engineers, student clubs, and hobbyists. Combining speed, quick reflexes, and destructive energy in a compact footprint, these matches are high-speed chess in a steel arena.",
            rulesTitle: "Technical Specifications & Rules",
            rules: [
                "Max Weight: 5.0 kg (including all parts, batteries, and weapons).",
                "Dimensions: Must fit inside a 30cm x 30cm x 30cm testing cube.",
                "Power: Maximum of 24V nominal DC voltage.",
                "Weapons Allowed: Wedge, active lifter, drum spinner, vertical spinner, flipper.",
                "Exclusions: Internal combustion engines, liquids, net launchers, wireless jammer circuits."
            ],
            ctaText: "APPLY FOR MINI FIGHTERS CLASS"
        },
        junior: {
            title: "Junior Innovators Division",
            subtitle: "For school students aged 12-18",
            desc: "The Junior Innovators division is designed to foster a passion for robotics, programming, and electronics. Unlike combat, this division focuses on smart problem solving, ecological design, and autonomous automation helper designs.",
            rulesTitle: "Evaluation and Rules",
            rules: [
                "Eligibility: Middle and High school students (teams of 2 to 5 members).",
                "Project Types: Smart Agriculture, Green Energy, Domestic Helper, Traffic Automation.",
                "Tech Stack: Open-source microcontrollers (Arduino, Raspberry Pi, ESP32, etc.) allowed.",
                "Presentation: Teams must exhibit a working prototype and submit a 3-page technical description document.",
                "Prizes: Cash scholarships, internship mentorships, and certified honors."
            ],
            ctaText: "SUBMIT INNOVATION PROPOSAL"
        },
        young: {
            title: "Young Engineers Arena",
            subtitle: "Weight limit: Up to 30 kg",
            desc: "The premier collegiate robot combat division. Here, robots clash with high kinetic energy spinners and pneumatic flippers. This is heavy-metal warfare combining high-power electronics, advanced metallurgy, and professional piloting skills.",
            rulesTitle: "Combat Specifications",
            rules: [
                "Weight limit: Maximum 30.0 kg (Feather/Lightweight combat standard).",
                "Dimensions: No static size limits, but must pass safe handling inspections.",
                "Safety System: Must have a dedicated manual/wireless fail-safe power isolation switch (Link).",
                "Pneumatics: Safe operations up to 150 PSI with certified tanks.",
                "Weapons Allowed: Vertical/horizontal spinners, high-pressure flippers, pickaxes."
            ],
            ctaText: "REGISTER COLLEGIATE TEAM"
        },
        minds: {
            title: "Robo Minds Autonomous Cup",
            subtitle: "Full AI Navigation Challenge",
            desc: "The Robo Minds tournament challenges the cutting edge of AI, computer vision, and mapping. Robots are placed inside a completely unknown maze and must find and classify targets dynamically without manual control.",
            rulesTitle: "AI Specifications & Rules",
            rules: [
                "Navigation: Fully autonomous. No remote control triggers allowed during the run.",
                "Vision Stack: Camera, LiDAR, ultrasonic sensors, and onboard AI processing units allowed.",
                "Challenge Goals: Map unknown maze corridors, read visual QR codes, and navigate back to start.",
                "Time Limit: 5 minutes per run. Scoring based on speed, accuracy, and mapping telemetry.",
                "Hardware Limit: Robot weight under 8kg. No destructive mechanisms."
            ],
            ctaText: "REGISTER AI AGENT"
        }
    };

    // Open Modal for Categories
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        const readMoreBtn = card.querySelector('.btn-readmore');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const categoryKey = card.getAttribute('data-category');
                const data = categoriesData[categoryKey];
                if (data) {
                    openModal(data);
                }
            });
        }
        
        // Let the whole card be clickable for better UX
        card.addEventListener('click', () => {
            const categoryKey = card.getAttribute('data-category');
            const data = categoriesData[categoryKey];
            if (data) {
                openModal(data);
            }
        });
    });

    // Data Store for Disciplines
    const disciplinesData = {
        race: {
            title: "Robo Race",
            subtitle: "Obstacle Speed Trial",
            desc: "Robo Race pits autonomous or manual speed machines against a challenging terrain of ramps, sandpits, bridges, and sharp chicanes. It's a true test of motor torque, suspension tuning, and high-speed cornering control.",
            rulesTitle: "Competition Details",
            rules: [
                "Track Length: 150 meters with 8 distinct obstacles.",
                "Format: Time Trial. Each team gets 2 runs. Fastest single run wins.",
                "Specifications: Robot size under 40cm x 40cm, wheeled or tracked configuration.",
                "Sensors: Autonomous mode gives a 15-second time bonus to the final lap score.",
                "Interference: Ramming wall barriers results in minor time penalties."
            ],
            ctaText: "REGISTER FOR ROBO RACE"
        },
        line: {
            title: "Line Follower Challenge",
            subtitle: "Precision Path Finding",
            desc: "The classic test of sensor feedback loops and speed PID tuning. Robots must negotiate an intricate track marked by a black grid line on a bright white surface, featuring loops, acute angles, and dotted segments.",
            rulesTitle: "Technical Standards",
            rules: [
                "Grid Line: 30mm thick black line.",
                "Track Features: Loop-the-loops, 90-degree corners, cross-paths, and line gaps.",
                "Control System: PID control recommended. No pre-programmed paths allowed.",
                "Telemetry: Live times logged via infrared checkpoint sensors.",
                "Format: 2 runs. Fastest clean run takes the podium."
            ],
            ctaText: "REGISTER FOR LINE FOLLOWER"
        },
        rc: {
            title: "RC Racing Cup",
            subtitle: "Off-Road Buggy Clashes",
            desc: "RC Racing brings human driver control into focus. Standardized off-road scale buggies slide through dirt, jumps, and tight berms in a multiplayer heat-based racing tournament that test reflexes and durability.",
            rulesTitle: "Racing Format",
            rules: [
                "Vehicle Standard: 1:10 scale electric buggies.",
                "Championship Format: 4-car heat groups leading to Quarter-Finals, Semi-Finals, and A-Main Finals.",
                "Power limit: Certified LiPo batteries (max 2S 7.4V).",
                "Tuning: Suspension setup, tire compounds, and weight balance tuning allowed.",
                "Safety: Active transponders mounted to track lap times."
            ],
            ctaText: "REGISTER FOR RC RACING"
        },
        drone: {
            title: "FPV Drone Racing & Soccer",
            subtitle: "Three Dimensional Arena Combat",
            desc: "Drone racing combines absolute speed with 3D aerial maneuvers. Pilots wearing FPV goggles navigate agile micro quadcopters through glowing rings, hoops, and tunnels in a specialized high-density safety netting structure.",
            rulesTitle: "Flight Specifications",
            rules: [
                "Drone frame class: 3-inch prop (micro/whoop class) and 5-inch prop open class.",
                "FPV System: 5.8GHz analog or high-definition digital systems.",
                "Video Power Limit: Maximum 25mW or 200mW pit mode toggled.",
                "Drone Soccer: Special sphere-caged drones competing in team goal scoring.",
                "Pilots: Must possess valid radio controller gear and insurance check."
            ],
            ctaText: "REGISTER FOR FLIGHT PATH"
        },
        hockey: {
            title: "Robo Hockey",
            subtitle: "Team Strategy Match",
            desc: "Two combat-styled push-bots cooperate in real-time on a miniature hockey rink to maneuver a heavy puck past their opponents' goalie robot. It requires team coordination, robust chassis design, and quick driving maneuvers.",
            rulesTitle: "Match Guidelines",
            rules: [
                "Team setup: 2 robots per team (typically 1 forward, 1 goalkeeper).",
                "Robot Dimensions: Max 20cm x 20cm, max weight 3kg.",
                "Puck specifications: Standard heavy mini-hockey puck.",
                "Match duration: Two halves of 5 minutes each.",
                "Weapons: Spikes and spinning weapons excluded. Paddle mechanisms allowed."
            ],
            ctaText: "REGISTER HOCKEY TEAM"
        },
        war: {
            title: "Robo War (Combat Arena)",
            subtitle: "Heavy Kinetic Combat",
            desc: "The ultimate clash. Combat robots are put in a reinforced steel cage featuring floor flippers, spikes, and perimeter fire traps. Teams fight for 3 minutes to disable the opponent or score points on damage and aggression.",
            rulesTitle: "Arena Specifications",
            rules: [
                "Weight limit classes: 15kg (Lightweight) and 30kg (Featherweight).",
                "Arena hazards: Active pneumatic floor flippers, drop pits, and steel walls.",
                "Match length: 3 minutes. Evaluated by 3 judges if no knockout occurs.",
                "Judges Criteria: Damage (6pts), Aggression (5pts), Control (4pts).",
                "Weapons check: Mandatory active lock pins on spinners during pit handling."
            ],
            ctaText: "ENTER COMBAT ARENA"
        }
    };

    // Open Modal for Disciplines
    const disciplineCards = document.querySelectorAll('.discipline-card');
    disciplineCards.forEach(card => {
        card.addEventListener('click', () => {
            const disciplineKey = card.getAttribute('data-discipline');
            const data = disciplinesData[disciplineKey];
            if (data) {
                openModal(data);
            }
        });
    });

    // Helper function to render modal content
    function openModal(data) {
        let rulesHtml = '';
        if (data.rules && data.rules.length > 0) {
            rulesHtml = `
                <h3>${data.rulesTitle || 'Rules & Specifications'}</h3>
                <ul>
                    ${data.rules.map(rule => `<li>${rule}</li>`).join('')}
                </ul>
            `;
        }

        modalBodyContent.innerHTML = `
            <h2>${data.title}</h2>
            <p class="modal-header-desc subtitle-highlight">${data.subtitle}</p>
            <p>${data.desc}</p>
            ${rulesHtml}
            <a href="#ecosystem" class="btn btn-primary btn-block modal-register-btn">${data.ctaText}</a>
        `;

        // Close modal when register CTA is clicked inside modal
        modalBodyContent.querySelector('.modal-register-btn').addEventListener('click', closeModal);

        detailModal.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeModal() {
        detailModal.classList.remove('visible');
        document.body.style.overflow = ''; // Unlock scroll
    }

    // Modal Closing Triggers
    modalClose.addEventListener('click', closeModal);
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            closeModal();
        }
    });

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detailModal.classList.contains('visible')) {
            closeModal();
        }
    });

    // ----------------------------------------------------
    // 8. 2.5D Canvas Combat Robots Simulator
    // ----------------------------------------------------
    const canvas = document.getElementById('arenaCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        let shakeTime = 0;
        let shakeIntensity = 0;

        let sparks = [];
        let debrisList = []; // upgraded metal shrapnels
        let damageTexts = [];
        let scorchMarks = []; // persistent battle damage indicators
        let empCharges = [];
        let powerUps = [];
        let powerUpSpawnTimer = 0;
        let isManualPilot = false;
        let keysPressed = {};

        // Dynamic Accent color resolver
        function getAccentColor() {
            return getComputedStyle(body).getPropertyValue('--accent').trim() || '#ff3b30';
        }

        class Spark {
            constructor(x, y, color, type = 'spark') {
                this.x = x;
                this.y = y;
                this.type = type;
                const angle = Math.random() * Math.PI * 2;
                
                if (type === 'spark') {
                    const speed = 1.5 + Math.random() * 5.0;
                    this.vx = Math.cos(angle) * speed;
                    this.vy = Math.sin(angle) * speed - 0.7; // upward drift
                    this.size = 2.5 + Math.random() * 4.0;
                    this.decay = 0.015 + Math.random() * 0.025;
                } else if (type === 'smoke') {
                    const speed = 0.3 + Math.random() * 0.8;
                    this.vx = Math.cos(angle) * speed;
                    this.vy = Math.sin(angle) * speed - 0.8; // upward drift
                    this.size = 6 + Math.random() * 8;
                    this.decay = 0.01 + Math.random() * 0.015;
                } else if (type === 'fire') {
                    const speed = 0.8 + Math.random() * 1.5;
                    this.vx = Math.cos(angle) * speed * 0.6;
                    this.vy = -speed - 0.5; // straight up
                    this.size = 5 + Math.random() * 7;
                    this.decay = 0.02 + Math.random() * 0.02;
                } else if (type === 'steam') {
                    const speed = 1.0 + Math.random() * 2.0;
                    this.vx = Math.cos(angle) * speed;
                    this.vy = Math.sin(angle) * speed;
                    this.size = 4 + Math.random() * 6;
                    this.decay = 0.015 + Math.random() * 0.015;
                }
                
                this.color = color;
                this.alpha = 1.0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
                
                if (this.type === 'smoke' || this.type === 'steam') {
                    this.size += 0.2; // expand
                } else if (this.type === 'fire') {
                    this.size -= 0.1; // shrink
                    this.vx *= 0.95;
                }
            }

            draw(c) {
                c.save();
                c.globalAlpha = Math.max(0, this.alpha);
                if (this.type === 'spark') {
                    c.shadowBlur = 10;
                    c.shadowColor = this.color;
                    c.fillStyle = this.color;
                    c.beginPath();
                    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    c.fill();
                } else if (this.type === 'smoke') {
                    c.fillStyle = 'rgba(50, 50, 58, 0.45)';
                    c.beginPath();
                    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    c.fill();
                } else if (this.type === 'fire') {
                    c.shadowBlur = 15;
                    c.shadowColor = this.color;
                    c.fillStyle = this.color;
                    c.beginPath();
                    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    c.fill();
                } else if (this.type === 'steam') {
                    c.fillStyle = 'rgba(230, 230, 245, 0.35)';
                    c.beginPath();
                    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    c.fill();
                }
                c.restore();
            }
        }

        class Debris {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = 2.0 + Math.random() * 4.0;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed - 1.0;
                this.color = color;
                
                this.angle = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.3;
                
                this.sizeWidth = 4 + Math.random() * 6;
                this.sizeHeight = 3 + Math.random() * 5;
                this.alpha = 1.0;
                this.decay = 0.005 + Math.random() * 0.01;
                this.gravity = 0.15;
                this.friction = 0.98;
                this.bounces = 2;
            }

            update() {
                this.vy += this.gravity;
                this.vx *= this.friction;
                this.vy *= this.friction;
                
                this.x += this.vx;
                this.y += this.vy;
                this.angle += this.rotSpeed;
                
                const padding = 15;
                const minX = width * 0.52;
                if (this.x < minX) {
                    this.x = minX;
                    this.vx = -this.vx * 0.5;
                }
                if (this.x > width - padding) {
                    this.x = width - padding;
                    this.vx = -this.vx * 0.5;
                }
                
                const floorY = height - padding;
                if (this.y > floorY) {
                    this.y = floorY;
                    if (this.bounces > 0) {
                        this.vy = -this.vy * 0.4;
                        this.vx *= 0.6;
                        this.bounces--;
                    } else {
                        this.vy = 0;
                        this.vx *= 0.8;
                        this.rotSpeed *= 0.8;
                    }
                }
                
                if (this.bounces <= 0 && Math.abs(this.vx) < 0.1) {
                    this.alpha -= this.decay;
                }
            }

            draw(c) {
                c.save();
                c.globalAlpha = Math.max(0, this.alpha);
                c.fillStyle = this.color;
                c.strokeStyle = '#1a1a1c';
                c.lineWidth = 1;
                c.translate(this.x, this.y);
                c.rotate(this.angle);
                c.beginPath();
                c.rect(-this.sizeWidth / 2, -this.sizeHeight / 2, this.sizeWidth, this.sizeHeight);
                c.fill();
                c.stroke();
                c.restore();
            }
        }

        class DamageText {
            constructor(x, y, text, color) {
                this.x = x;
                this.y = y;
                this.text = text;
                this.color = color;
                this.alpha = 1.0;
                this.vy = -1.0;
                this.life = 45; // frames
            }

            update() {
                this.y += this.vy;
                this.life--;
                this.alpha = this.life / 45;
            }

            draw(c) {
                c.save();
                c.globalAlpha = Math.max(0, this.alpha);
                c.fillStyle = this.color;
                c.font = 'bold 13px "Rajdhani", sans-serif';
                c.shadowBlur = 5;
                c.shadowColor = '#000000';
                c.fillText(this.text, this.x - 20, this.y);
                c.restore();
            }
        }

        class EMPBlast {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = 5;
                this.maxRadius = 130;
                this.life = 1.0;
                this.decay = 0.03;
                
                // Displace bots immediately
                [bot1, bot2].forEach(bot => {
                    if (bot && bot.state !== 'dead') {
                        const dx = bot.x - this.x;
                        const dy = bot.y - this.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < this.maxRadius) {
                            const force = (1 - dist / this.maxRadius) * 11;
                            const angle = Math.atan2(dy, dx);
                            bot.vx += Math.cos(angle) * force;
                            bot.vy += Math.sin(angle) * force;
                            bot.state = 'recoil';
                            
                            // Short-circuit / Glitch state
                            bot.glitchTimer = 90; // 1.5 seconds at 60 FPS
                            damageTexts.push(new DamageText(bot.x, bot.y - 25, 'EMP GLITCH!', '#00bfff'));
                        }
                    }
                });

                // Spawn neon electrical sparks
                for (let i = 0; i < 20; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const px = this.x + Math.cos(angle) * 10;
                    const py = this.y + Math.sin(angle) * 10;
                    sparks.push(new Spark(px, py, i % 2 === 0 ? '#00bfff' : '#00ffff', 'spark'));
                }
                
                shakeTime = 12;
                shakeIntensity = 6;
            }

            update() {
                this.radius += (this.maxRadius - this.radius) * 0.12;
                this.life -= this.decay;
            }

            draw(c) {
                c.save();
                c.strokeStyle = `rgba(0, 191, 255, ${this.life})`;
                c.lineWidth = 3;
                c.shadowBlur = 15;
                c.shadowColor = '#00bfff';
                c.beginPath();
                c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                c.stroke();
                c.restore();
            }
        }

        class PowerUp {
            constructor(x, y, type) {
                this.x = x;
                this.y = y;
                this.type = type; // 'repair' or 'boost'
                this.radius = 16;
                this.pulse = 0;
                this.color = type === 'repair' ? '#30d158' : '#ffd60a'; // Green vs Yellow
                this.glow = type === 'repair' ? '#34c759' : '#ffcc00';
            }

            update() {
                this.pulse += 0.08;
            }

            draw(c) {
                c.save();
                c.shadowBlur = 10 + Math.sin(this.pulse) * 4;
                c.shadowColor = this.glow;
                
                // Outer ring
                c.strokeStyle = this.color;
                c.lineWidth = 2;
                c.beginPath();
                c.arc(this.x, this.y, this.radius + Math.sin(this.pulse) * 2, 0, Math.PI * 2);
                c.stroke();

                // Core inner circle
                c.fillStyle = this.color;
                c.beginPath();
                c.arc(this.x, this.y, 6, 0, Math.PI * 2);
                c.fill();
                
                // Symbol / Text letter
                c.fillStyle = '#ffffff';
                c.font = 'bold 10px "Rajdhani", sans-serif';
                c.textAlign = 'center';
                c.textBaseline = 'middle';
                c.shadowBlur = 0;
                c.fillText(this.type === 'repair' ? '+' : '⚡', this.x, this.y + (this.type === 'repair' ? 0 : -0.5));
                c.restore();
            }
        }

        class Robot {
            constructor(name, x, y, primaryColor, side) {
                this.name = name;
                this.x = x;
                this.y = y;
                this.startX = x;
                this.startY = y;
                this.primaryColor = primaryColor;
                this.side = side;
                
                this.radius = 35; // Enlarged from 22 for richer details
                this.vx = 0;
                this.vy = 0;
                this.angle = side === 'left' ? 0 : Math.PI;
                this.health = 100;
                this.maxHealth = 100;
                this.score = 0;

                // State Machine: 'chase', 'charge', 'recoil', 'dead', 'spawn'
                this.state = 'chase';
                this.stateTimer = 0;
                this.shield = 0; // spawn immunity shield

                // Weapon animations
                this.weaponRot = 0; 
                this.flipAnim = 0;  // 0 to 1 flipper extension progress
                this.isFlipping = false;
                this.trackOffset = 0; // animated track guide treads

                // 3D Air flip physics simulation
                this.launchHeight = 0;
                this.launchAngle = 0;
                this.launchTimer = 0;

                this.glitchTimer = 0;
                this.boostTimer = 0;
            }

            reset() {
                this.x = this.startX;
                this.y = this.startY;
                this.vx = 0;
                this.vy = 0;
                this.angle = this.side === 'left' ? 0 : Math.PI;
                this.health = 100;
                this.state = 'spawn';
                this.stateTimer = 60; 
                this.shield = 60;
                this.launchHeight = 0;
                this.launchTimer = 0;
                this.glitchTimer = 0;
                this.boostTimer = 0;
            }

            update(opponent) {
                if (this.state === 'dead') {
                    this.stateTimer--;
                    if (this.stateTimer <= 0) {
                        this.reset();
                    }
                    return;
                }

                // EMP Short-circuit state
                if (this.glitchTimer > 0) {
                    this.glitchTimer--;
                    this.vx *= 0.82;
                    this.vy *= 0.82;
                    this.x += this.vx;
                    this.y += this.vy;
                    this.constrainToArena();
                    
                    // Electric sparks crackling
                    if (Math.random() < 0.28) {
                        sparks.push(new Spark(
                            this.x + (Math.random() - 0.5) * this.radius,
                            this.y + (Math.random() - 0.5) * this.radius,
                            '#00ffff',
                            'spark'
                        ));
                    }
                    return;
                }

                // Decrement boost timer
                if (this.boostTimer > 0) {
                    this.boostTimer--;
                    // Render boosted trail particles
                    if (Math.random() < 0.22) {
                        sparks.push(new Spark(this.x, this.y, '#ffd60a', 'spark'));
                    }
                }

                if (this.shield > 0) this.shield--;
                if (this.stateTimer > 0) this.stateTimer--;

                // Saw blade speed based on activity
                if (this.name === 'Valkyrie-X') {
                    const rotSpeed = this.state === 'charge' ? 0.75 : 0.28;
                    this.weaponRot += rotSpeed;
                }

                // Shovel/Flipper flipper timeline
                if (this.name === 'GigaBlitz') {
                    if (this.isFlipping) {
                        this.flipAnim += 0.18;
                        if (this.flipAnim >= 1.0) {
                            this.isFlipping = false;
                        }
                    } else if (this.flipAnim > 0) {
                        this.flipAnim -= 0.04;
                    }
                    
                    // Animate tracks link offset relative to speed
                    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    this.trackOffset += (this.vx >= 0 ? 1 : -1) * currentSpeed * 0.8;
                }

                // Emitters for damaged states (Smoke & Fire)
                if (this.health < 60 && Math.random() < 0.15) {
                    sparks.push(new Spark(this.x + (Math.random() - 0.5) * 15, this.y + (Math.random() - 0.5) * 15, '#333333', 'smoke'));
                }
                if (this.health < 30 && Math.random() < 0.22) {
                    const colors = ['#ff5e00', '#ffcc00'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    sparks.push(new Spark(this.x + (Math.random() - 0.5) * 20, this.y + (Math.random() - 0.5) * 20, randomColor, 'fire'));
                }

                // Air launch logic (3D rotation/scale simulator)
                if (this.launchTimer > 0) {
                    this.launchTimer--;
                    const progress = (30 - this.launchTimer) / 30; 
                    this.launchHeight = Math.sin(progress * Math.PI) * 45; // parabolic arc
                    this.launchAngle += 0.38; // spin
                    
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.94;
                    this.vy *= 0.94;
                    this.constrainToArena();
                    return; 
                } else {
                    this.launchHeight = 0;
                }

                // Recoil state dampening
                if (this.state === 'recoil') {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.85;
                    this.vy *= 0.85;

                    // Skid marks during recoil
                    if (Math.random() < 0.4) {
                        scorchMarks.push({ x: this.x, y: this.y, size: 7, alpha: 0.25 });
                    }

                    if (Math.abs(this.vx) < 0.15 && Math.abs(this.vy) < 0.15) {
                        this.state = 'chase';
                    }
                    this.constrainToArena();
                    return;
                }

                // Manual piloting override for GigaBlitz
                if (this.name === 'GigaBlitz' && isManualPilot) {
                    let isMoving = false;
                    const accel = 0.22 * (this.boostTimer > 0 ? 1.45 : 1);
                    const maxSpeed = 3.8 * (this.boostTimer > 0 ? 1.45 : 1);
                    const rotSpeed = 0.075;

                    // Turn left / right
                    if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) {
                        this.angle -= rotSpeed;
                        isMoving = true;
                    }
                    if (keysPressed['KeyD'] || keysPressed['ArrowRight']) {
                        this.angle += rotSpeed;
                        isMoving = true;
                    }

                    // Move forward / backward
                    let driveForce = 0;
                    if (keysPressed['KeyW'] || keysPressed['ArrowUp']) {
                        driveForce = accel;
                        isMoving = true;
                    } else if (keysPressed['KeyS'] || keysPressed['ArrowDown']) {
                        driveForce = -accel * 0.7; // slower reverse
                        isMoving = true;
                    }

                    if (driveForce !== 0) {
                        this.vx += Math.cos(this.angle) * driveForce;
                        this.vy += Math.sin(this.angle) * driveForce;
                    }

                    // Apply drag
                    this.vx *= 0.90;
                    this.vy *= 0.90;

                    // Limit speed
                    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    if (currentSpeed > maxSpeed) {
                        this.vx = (this.vx / currentSpeed) * maxSpeed;
                        this.vy = (this.vy / currentSpeed) * maxSpeed;
                    }

                    // Skid marks and sparks when driving
                    if (isMoving && Math.random() < 0.25) {
                        scorchMarks.push({ x: this.x, y: this.y, size: 7, alpha: 0.15 });
                    }

                    // Exude sparks behind wheels/tracks when accelerating quickly
                    if (driveForce > 0 && Math.random() < 0.25) {
                        sparks.push(new Spark(
                            this.x - Math.cos(this.angle) * this.radius,
                            this.y - Math.sin(this.angle) * this.radius,
                            this.primaryColor,
                            'spark'
                        ));
                    }

                    // Update position
                    this.x += this.vx;
                    this.y += this.vy;
                    this.constrainToArena();

                    // Space to flip
                    if (keysPressed['Space']) {
                        if (!this.isFlipping) {
                            this.isFlipping = true;
                            this.flipAnim = 0;
                            // Steam puff particles from rear hydraulic exhausts
                            const angleBack = this.angle + Math.PI;
                            const steamX = this.x + Math.cos(angleBack) * this.radius;
                            const steamY = this.y + Math.sin(angleBack) * this.radius;
                            for (let i = 0; i < 8; i++) {
                                sparks.push(new Spark(steamX, steamY, '#ffffff', 'steam'));
                            }
                        }
                    }
                    return; // Bypass AI logic
                }

                // Backup state (GigaBlitz backing off before a charge)
                if (this.state === 'backup') {
                    const speed = -2.2; // drive in reverse
                    this.vx = Math.cos(this.angle) * speed;
                    this.vy = Math.sin(this.angle) * speed;
                    this.x += this.vx;
                    this.y += this.vy;
                    
                    // Skid marks in reverse
                    if (Math.random() < 0.3) {
                        scorchMarks.push({ x: this.x, y: this.y, size: 8, alpha: 0.2 });
                    }

                    this.constrainToArena();
                    
                    if (this.stateTimer <= 0) {
                        this.state = 'charge';
                        this.stateTimer = 55; // charge duration
                    }
                    return;
                }

                // Target calculations
                let targetX = opponent.x;
                let targetY = opponent.y;

                // Valkyrie-X flanking AI logic: try to aim slightly offset to flank
                if (this.name === 'Valkyrie-X' && this.state === 'chase') {
                    targetX = opponent.x + Math.sin(opponent.angle) * 75;
                    targetY = opponent.y - Math.cos(opponent.angle) * 75;
                }

                const dx = targetX - this.x;
                const dy = targetY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const targetAngle = Math.atan2(dy, dx);

                // Angular alignment
                let angleDiff = targetAngle - this.angle;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                
                // Rotation speed
                this.angle += angleDiff * 0.07;

                // Sharp turn skid marks
                if (Math.abs(angleDiff) > 0.6 && Math.random() < 0.3) {
                    scorchMarks.push({ x: this.x, y: this.y, size: 8, alpha: 0.18 });
                }

                if (this.state === 'chase') {
                    const speed = 1.35 * (this.boostTimer > 0 ? 1.45 : 1);
                    this.vx = Math.cos(this.angle) * speed;
                    this.vy = Math.sin(this.angle) * speed;

                    // Decides to backup or charge
                    if (dist < 210 && Math.abs(angleDiff) < 0.25 && this.stateTimer <= 0) {
                        if (this.name === 'GigaBlitz' && dist < 140 && Math.random() < 0.4) {
                            this.state = 'backup';
                            this.stateTimer = 35; // backup frames
                        } else if (Math.random() < 0.02) {
                            this.state = 'charge';
                            this.stateTimer = 50; 
                        }
                    }
                } else if (this.state === 'charge') {
                    const speed = 4.5 * (this.boostTimer > 0 ? 1.45 : 1);
                    this.vx = Math.cos(this.angle) * speed;
                    this.vy = Math.sin(this.angle) * speed;

                    // Skid marks during charge
                    if (Math.random() < 0.5) {
                        scorchMarks.push({ x: this.x, y: this.y, size: 9, alpha: 0.28 });
                    }

                    // Exude sparks behind wheels/tracks
                    if (Math.random() < 0.4) {
                        sparks.push(new Spark(
                            this.x - Math.cos(this.angle) * this.radius,
                            this.y - Math.sin(this.angle) * this.radius,
                            this.primaryColor,
                            'spark'
                        ));
                    }

                    if (this.stateTimer <= 0) {
                        this.state = 'chase';
                        this.stateTimer = 85; 
                    }
                }

                this.x += this.vx;
                this.y += this.vy;
                this.constrainToArena();
            }

            constrainToArena() {
                const padding = 45;
                const minX = width * 0.52; // Keep on the right side of the screen
                if (this.x < minX) { this.x = minX; this.vx = 0; }
                if (this.x > width - padding) { this.x = width - padding; this.vx = 0; }
                if (this.y < 120) { this.y = 120; this.vy = 0; } // Keep below header
                if (this.y > height - padding) { this.y = height - padding; this.vy = 0; }
            }

            takeDamage(amount, x, y) {
                if (this.shield > 0 || this.state === 'dead') return;

                this.health -= amount;

                // Add persistent floor damage scorch mark at impact point
                scorchMarks.push({
                    x: x + (Math.random() - 0.5) * 10,
                    y: y + (Math.random() - 0.5) * 10,
                    size: 15 + Math.random() * 20,
                    alpha: 0.8
                });

                if (this.health <= 0) {
                    this.health = 0;
                    this.state = 'dead';
                    this.stateTimer = 160; 
                    this.score++;

                    // Heavy shrapnel shrapnel explosion
                    for (let i = 0; i < 50; i++) {
                        sparks.push(new Spark(this.x, this.y, i % 2 === 0 ? '#ff9f0a' : '#ff3b30', 'spark'));
                    }
                    
                    // Massive metal debris explosion
                    const debrisColor = this.name === 'Valkyrie-X' ? '#a33333' : '#335ba3';
                    for (let i = 0; i < 18; i++) {
                        debrisList.push(new Debris(this.x, this.y, i % 3 === 0 ? '#444' : debrisColor));
                    }
                    
                    // Giant crater mark on death site
                    scorchMarks.push({
                        x: this.x,
                        y: this.y,
                        size: 55,
                        alpha: 1.0
                    });

                    shakeTime = 32;
                    shakeIntensity = 14;
                    damageTexts.push(new DamageText(this.x, this.y - 12, 'CRITICAL K.O.!', '#ff3b30'));
                } else {
                    damageTexts.push(new DamageText(x, y, `-${Math.round(amount)}HP`, '#ffffff'));
                    
                    // Spawn metallic shrapnel debris for normal hits
                    const debrisColor = this.name === 'Valkyrie-X' ? '#a33333' : '#335ba3';
                    const numDebris = 2 + Math.floor(Math.random() * 3); // 2 to 4 chunks
                    for (let i = 0; i < numDebris; i++) {
                        debrisList.push(new Debris(x, y, i % 2 === 0 ? '#555' : debrisColor));
                    }
                }
            }

            draw(c) {
                if (this.state === 'dead') return;

                c.save();

                const drawX = this.x;
                const drawY = this.y - this.launchHeight;

                // Air shadows
                if (this.launchHeight > 0) {
                    c.save();
                    c.shadowBlur = 18;
                    c.shadowColor = 'rgba(0,0,0,0.7)';
                    c.fillStyle = 'rgba(0, 0, 0, 0.35)';
                    c.beginPath();
                    c.arc(this.x, this.y, this.radius * 0.95, 0, Math.PI * 2);
                    c.fill();
                    c.restore();
                }

                // Translate & rotate
                c.translate(drawX, drawY);
                c.rotate(this.launchHeight > 0 ? this.launchAngle : this.angle);

                // Scale up for 3D altitude visual
                if (this.launchHeight > 0) {
                    const scaleFactor = 1.0 + (this.launchHeight / 50);
                    c.scale(scaleFactor, scaleFactor);
                }

                // Boosted aura
                if (this.boostTimer > 0) {
                    c.save();
                    c.shadowBlur = 18;
                    c.shadowColor = '#ffd60a';
                    c.strokeStyle = '#ffd60a';
                    c.lineWidth = 3;
                    c.beginPath();
                    c.arc(0, 0, this.radius + 3, 0, Math.PI * 2);
                    c.stroke();
                    c.restore();
                }

                // 3D Drop Shadows on Robot Components
                c.shadowBlur = 10;
                c.shadowColor = 'rgba(0,0,0,0.65)';
                c.shadowOffsetX = 3;
                c.shadowOffsetY = 5;

                // ----------------------------------------------------
                // ROBOT 1: VALKYRIE-X (HEAVY SAW-BLADE COMBAT SPINNER)
                // ----------------------------------------------------
                if (this.name === 'Valkyrie-X') {
                    // WHEELS WITH 3D DEPTH
                    // Draw tires with dark rubber gradients
                    const tireGrad = c.createLinearGradient(-35, -36, -35, -28);
                    tireGrad.addColorStop(0, '#121215');
                    tireGrad.addColorStop(0.5, '#25252b');
                    tireGrad.addColorStop(1, '#08080a');

                    c.fillStyle = tireGrad;
                    // Rear Left Wheel
                    c.fillRect(-28, -36, 16, 10);
                    // Front Left Wheel
                    c.fillRect(12, -36, 16, 10);
                    // Rear Right Wheel
                    c.fillRect(-28, 26, 16, 10);
                    // Front Right Wheel
                    c.fillRect(12, 26, 16, 10);

                    // Wheel Tread Marks
                    c.fillStyle = '#0d0d0f';
                    for (let offset = -26; offset < 28; offset += 8) {
                        c.fillRect(offset, -36, 2, 10);
                        c.fillRect(offset, 26, 2, 10);
                    }

                    // Chrome hubcaps in center
                    c.fillStyle = '#b0b0b8';
                    c.beginPath();
                    c.arc(-20, -31, 3, 0, Math.PI * 2);
                    c.arc(20, -31, 3, 0, Math.PI * 2);
                    c.arc(-20, 31, 3, 0, Math.PI * 2);
                    c.arc(20, 31, 3, 0, Math.PI * 2);
                    c.fill();

                    // CHASSIS: Multi-layered Armor Plates
                    // Base Dark Steel layer
                    const baseGrad = c.createRadialGradient(0, 0, 5, 0, 0, 35);
                    baseGrad.addColorStop(0, '#2d2d35');
                    baseGrad.addColorStop(0.7, '#1b1b22');
                    baseGrad.addColorStop(1, '#0a0a0d');
                    
                    c.fillStyle = baseGrad;
                    c.strokeStyle = '#111';
                    c.lineWidth = 1;
                    c.beginPath();
                    c.moveTo(-25, -24);
                    c.lineTo(16, -24);
                    c.lineTo(30, 0);
                    c.lineTo(16, 24);
                    c.lineTo(-25, 24);
                    c.lineTo(-32, 0);
                    c.closePath();
                    c.fill();
                    c.stroke();

                    // 3D Beveled Red Armor Plates (Gradients)
                    const redGrad = c.createLinearGradient(-25, -20, 16, 20);
                    redGrad.addColorStop(0, '#800000');
                    redGrad.addColorStop(0.3, '#ff3b30');
                    redGrad.addColorStop(0.6, '#cc1111');
                    redGrad.addColorStop(1, '#500000');

                    c.fillStyle = redGrad;
                    c.strokeStyle = '#ff6b6b';
                    c.lineWidth = 1.5;
                    c.beginPath();
                    c.moveTo(-20, -18);
                    c.lineTo(10, -18);
                    c.lineTo(24, 0);
                    c.lineTo(10, 18);
                    c.moveTo(-20, 18);
                    c.lineTo(-20, -18);
                    c.fill();
                    c.stroke();

                    // Slanted Warning Stripes Decals (Yellow / Black)
                    c.save();
                    c.beginPath();
                    c.rect(-18, -14, 12, 28);
                    c.clip();
                    c.fillStyle = '#ffcc00';
                    c.fillRect(-18, -14, 12, 28);
                    c.strokeStyle = '#111';
                    c.lineWidth = 3;
                    for (let offset = -20; offset < 20; offset += 6) {
                        c.beginPath();
                        c.moveTo(offset, -20);
                        c.lineTo(offset + 10, 20);
                        c.stroke();
                    }
                    c.restore();

                    // Glowing exhaust vents
                    c.fillStyle = '#ff9f0a';
                    c.shadowColor = '#ff9f0a';
                    c.shadowBlur = 10;
                    c.fillRect(-28, -8, 5, 4);
                    c.fillRect(-28, 4, 5, 4);

                    // Reset shadow for core overlay
                    c.shadowBlur = 0;
                    c.shadowOffsetX = 0;
                    c.shadowOffsetY = 0;

                    // Shiny center reactor reactor core
                    const reactorGrad = c.createRadialGradient(-3, -3, 1, 0, 0, 8);
                    reactorGrad.addColorStop(0, '#ffffff');
                    reactorGrad.addColorStop(0.3, '#ffcc00');
                    reactorGrad.addColorStop(1, '#804000');
                    c.fillStyle = reactorGrad;
                    c.beginPath();
                    c.arc(0, 0, 8, 0, Math.PI * 2);
                    c.fill();

                    // WEAPON: Kinetic Spinning Saw Blade
                    c.save();
                    c.translate(28, 0);
                    
                    // Saw Blade Speed Blur (charging)
                    if (this.state === 'charge') {
                        c.save();
                        c.strokeStyle = 'rgba(255, 159, 10, 0.45)';
                        c.lineWidth = 4;
                        c.shadowBlur = 12;
                        c.shadowColor = '#ff9f0a';
                        c.beginPath();
                        c.arc(0, 0, 25, 0, Math.PI * 2);
                        c.stroke();
                        c.restore();
                    }
                    
                    c.rotate(this.weaponRot);
                    
                    // Saw drop shadow
                    c.shadowBlur = 8;
                    c.shadowColor = '#000';
                    c.shadowOffsetY = 3;

                    // Metallic Saw Gradient
                    const sawGrad = c.createRadialGradient(0, 0, 0, 0, 0, 22);
                    sawGrad.addColorStop(0, '#ffffff');
                    sawGrad.addColorStop(0.3, '#cfcfdf');
                    sawGrad.addColorStop(0.6, '#7e7e88');
                    sawGrad.addColorStop(1, '#2d2d30');

                    c.fillStyle = sawGrad;
                    c.strokeStyle = '#efefef';
                    c.lineWidth = 1;
                    c.beginPath();
                    c.arc(0, 0, 22, 0, Math.PI * 2);
                    c.fill();
                    c.stroke();

                    // High speed spinner teeth
                    c.fillStyle = '#a0a0aa';
                    for (let i = 0; i < 10; i++) {
                        c.rotate(Math.PI / 5);
                        c.beginPath();
                        c.moveTo(22, 0);
                        c.lineTo(28, -6);
                        c.lineTo(18, -8);
                        c.closePath();
                        c.fill();
                    }

                    // Steel center cap rivets
                    c.fillStyle = '#444';
                    c.beginPath();
                    c.arc(0, 0, 6, 0, Math.PI * 2);
                    c.fill();
                    c.fillStyle = '#fff';
                    c.beginPath();
                    c.arc(-1, -1, 1.5, 0, Math.PI * 2);
                    c.fill();
                    c.restore();

                // ----------------------------------------------------
                // ROBOT 2: GIGABLITZ (HEAVY WEDGED SHIELD FLIPPER)
                // ----------------------------------------------------
                } else {
                    // TRACKS GUIDE WHEELS
                    c.fillStyle = '#1e1e24';
                    c.strokeStyle = '#111';
                    c.lineWidth = 1.5;
                    // Left Track outline
                    c.strokeRect(-32, -34, 64, 11);
                    c.fillRect(-32, -34, 64, 11);
                    // Right Track outline
                    c.strokeRect(-32, 23, 64, 11);
                    c.fillRect(-32, 23, 64, 11);

                    // guide rollers inside track
                    c.fillStyle = '#555560';
                    c.beginPath();
                    c.arc(-24, -28.5, 4, 0, Math.PI * 2);
                    c.arc(0, -28.5, 4, 0, Math.PI * 2);
                    c.arc(24, -28.5, 4, 0, Math.PI * 2);
                    c.arc(-24, 28.5, 4, 0, Math.PI * 2);
                    c.arc(0, 28.5, 4, 0, Math.PI * 2);
                    c.arc(24, 28.5, 4, 0, Math.PI * 2);
                    c.fill();

                    // Treads link animation
                    c.fillStyle = '#08080a';
                    const linkSpacing = 8;
                    const offset = this.trackOffset % linkSpacing;
                    for (let x = -30 + offset; x < 32; x += linkSpacing) {
                        c.fillRect(x, -35, 2, 12);
                        c.fillRect(x, 22, 2, 12);
                    }

                    // CHASSIS: Heavy 3D Sloped wedge
                    const wedgeGrad = c.createLinearGradient(-30, 0, 25, 0);
                    wedgeGrad.addColorStop(0, '#25252a');
                    wedgeGrad.addColorStop(0.3, '#3e3e4a');
                    wedgeGrad.addColorStop(0.8, '#59596c');
                    wedgeGrad.addColorStop(1, '#1c1c20');
                    c.fillStyle = wedgeGrad;
                    c.strokeStyle = '#1b1b20';
                    c.lineWidth = 1.5;
                    c.beginPath();
                    c.moveTo(-28, -22);
                    c.lineTo(14, -22);
                    c.arcTo(32, 0, 14, 22, 24);
                    c.lineTo(14, 22);
                    c.lineTo(-28, 22);
                    c.closePath();
                    c.fill();
                    c.stroke();

                    // Beveled Blue Armor Panels
                    const blueGrad = c.createLinearGradient(-22, -18, 10, 18);
                    blueGrad.addColorStop(0, '#0033aa');
                    blueGrad.addColorStop(0.4, '#00bfff');
                    blueGrad.addColorStop(0.7, '#007aff');
                    blueGrad.addColorStop(1, '#001155');

                    c.fillStyle = blueGrad;
                    c.strokeStyle = '#80e5ff';
                    c.lineWidth = 1.5;
                    c.beginPath();
                    c.moveTo(-22, -16);
                    c.lineTo(8, -16);
                    c.lineTo(18, 0);
                    c.lineTo(8, 16);
                    c.lineTo(-22, 16);
                    c.closePath();
                    c.fill();
                    c.stroke();

                    // 3D beveled rivet bolt heads on top armor
                    c.fillStyle = '#b0b0b8';
                    c.beginPath();
                    c.arc(-16, -10, 2.5, 0, Math.PI * 2);
                    c.arc(-16, 10, 2.5, 0, Math.PI * 2);
                    c.arc(4, -10, 2.5, 0, Math.PI * 2);
                    c.arc(4, 10, 2.5, 0, Math.PI * 2);
                    c.fill();

                    // Neon cyan gridlines
                    c.strokeStyle = 'rgba(0, 191, 255, 0.4)';
                    c.lineWidth = 1;
                    c.beginPath();
                    c.moveTo(-16, 0);
                    c.lineTo(10, 0);
                    c.stroke();

                    // HYDRAULIC FLIPPER CYLINDER MECHANISM
                    c.save();
                    c.translate(14, 0);
                    
                    const extension = Math.sin(this.flipAnim * Math.PI) * 15;
                    
                    // Draw Hydraulic Piston base (Brass gradient)
                    const brassGrad = c.createLinearGradient(0, -6, 0, 6);
                    brassGrad.addColorStop(0, '#8a640f');
                    brassGrad.addColorStop(0.4, '#f0ce4e');
                    brassGrad.addColorStop(1, '#523c08');
                    c.fillStyle = brassGrad;
                    c.fillRect(-4, -6, 12, 12);
                    
                    // Draw Chrome Rod shaft (extends with animation)
                    const rodGrad = c.createLinearGradient(0, -3, 0, 3);
                    rodGrad.addColorStop(0, '#cfcfd9');
                    rodGrad.addColorStop(0.5, '#ffffff');
                    rodGrad.addColorStop(1, '#7e7e88');
                    c.fillStyle = rodGrad;
                    c.fillRect(8, -3, 6 + extension, 6);

                    // WEAPON: Giant Wedge Shovel Shovel
                    c.translate(14 + extension, 0);
                    
                    c.shadowBlur = 8;
                    c.shadowColor = '#000';
                    c.shadowOffsetX = 2;
                    c.shadowOffsetY = 4;

                    const shovelGrad = c.createLinearGradient(0, -18, 12, 18);
                    shovelGrad.addColorStop(0, '#55555c');
                    shovelGrad.addColorStop(0.4, '#a0a0aa');
                    shovelGrad.addColorStop(0.6, '#77777f');
                    shovelGrad.addColorStop(1, '#2d2d30');
                    
                    c.fillStyle = shovelGrad;
                    c.strokeStyle = '#efefef';
                    c.lineWidth = 1;
                    c.beginPath();
                    c.moveTo(0, -18);
                    c.lineTo(22, -26);
                    c.lineTo(32, -12);
                    c.lineTo(32, 12);
                    c.lineTo(22, 26);
                    c.lineTo(0, 18);
                    c.closePath();
                    c.fill();
                    c.stroke();
                    
                    c.restore();
                }

                // Invulnerability spawn shield ring (animated pulsing green)
                if (this.shield > 0) {
                    c.shadowBlur = 20;
                    c.shadowColor = '#00ff66';
                    c.strokeStyle = 'rgba(0, 255, 102, 0.75)';
                    c.lineWidth = 3;
                    c.beginPath();
                    c.arc(0, 0, this.radius + 8, 0, Math.PI * 2);
                    c.stroke();
                }

                // Damage fire overlay on top of robot chassis
                if (this.health < 30) {
                    c.save();
                    const numFlames = 3;
                    const flash = Math.floor(Date.now() / 80) % 2 === 0;
                    c.fillStyle = flash ? '#ffcc00' : '#ff3b30';
                    c.shadowBlur = 10;
                    c.shadowColor = '#ff5e00';
                    
                    for (let i = 0; i < numFlames; i++) {
                        const fx = (Math.sin(i * 1.5 + Date.now() * 0.05) * this.radius * 0.4);
                        const fy = (Math.cos(i * 1.5 + Date.now() * 0.05) * this.radius * 0.4);
                        const fsize = 3 + Math.random() * 5;
                        c.beginPath();
                        c.arc(fx, fy, fsize, 0, Math.PI * 2);
                        c.fill();
                    }
                    c.restore();
                }

                c.restore();
            }
        }

        // Initialize robots (with offset starting coordinates on the right side)
        let bot1 = new Robot('Valkyrie-X', width * 0.62, height / 2 + 30, '#ff3b30', 'left');
        let bot2 = new Robot('GigaBlitz', width * 0.85, height / 2 + 30, '#00bfff', 'right');

        function resizeCanvas() {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width;
            canvas.height = height;

            if (bot1) {
                bot1.x = width * 0.62;
                bot1.y = height / 2 + 30;
                bot1.startX = bot1.x;
                bot1.startY = bot1.y;
            }
            // Clear powerups and EMP charges on resize
            powerUps = [];
            empCharges = [];
            if (bot2) {
                bot2.x = width * 0.85;
                bot2.y = height / 2 + 30;
                bot2.startX = bot2.x;
                bot2.startY = bot2.y;
            }
        }
        window.addEventListener('resize', resizeCanvas);

        function checkRobotCollisions() {
            if (bot1.state === 'dead' || bot2.state === 'dead') return;

            const dx = bot2.x - bot1.x;
            const dy = bot2.y - bot1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = bot1.radius + bot2.radius + 14; 

            if (dist < minDist) {
                const nx = dx / dist;
                const ny = dy / dist;

                // Push robots apart to prevent overlapping
                const overlap = minDist - dist;
                if (bot1.launchTimer === 0 && bot2.launchTimer === 0) {
                    bot1.x -= nx * (overlap / 2);
                    bot1.y -= ny * (overlap / 2);
                    bot2.x += nx * (overlap / 2);
                    bot2.y += ny * (overlap / 2);
                }

                const colX = bot1.x + nx * bot1.radius;
                const colY = bot1.y + ny * bot1.radius;

                let damageTo1 = 3 + Math.random() * 5;
                let damageTo2 = 3 + Math.random() * 5;

                // Valkyrie spinner kinetic impact
                if (bot1.state === 'charge' && bot1.launchTimer === 0) {
                    let impactDamage = 16 + Math.random() * 9;
                    if (bot1.boostTimer > 0) impactDamage *= 2.0; // Double damage if boosted
                    damageTo2 += impactDamage;
                    bot2.state = 'recoil';
                    bot2.vx = nx * 6.5;
                    bot2.vy = ny * 6.5;
                    
                    bot1.state = 'recoil';
                    bot1.vx = -nx * 2.5;
                    bot1.vy = -ny * 2.5;

                    // Metallic saw gold sparks
                    for (let i = 0; i < 22; i++) {
                        sparks.push(new Spark(colX, colY, '#ffcc00', 'spark'));
                    }
                } 
                // GigaBlitz flipper charge impact or manual flip collision
                else if ((bot2.state === 'charge' || bot2.isFlipping) && bot2.launchTimer === 0) {
                    let impactDamage = 13 + Math.random() * 7;
                    if (bot2.boostTimer > 0) impactDamage *= 2.0; // Double damage if boosted
                    damageTo1 += impactDamage;
                    
                    bot1.launchTimer = 30; // Air flight frames
                    bot1.state = 'recoil';
                    bot1.vx = -nx * 5.0;
                    bot1.vy = -ny * 5.0;

                    bot2.state = 'recoil';
                    bot2.vx = nx * 1.8;
                    bot2.vy = ny * 1.8;

                    // Steam puff particles from rear hydraulic exhausts of GigaBlitz
                    const angleBack = bot2.angle + Math.PI;
                    const steamX = bot2.x + Math.cos(angleBack) * bot2.radius;
                    const steamY = bot2.y + Math.sin(angleBack) * bot2.radius;
                    for (let i = 0; i < 8; i++) {
                        sparks.push(new Spark(steamX, steamY, '#ffffff', 'steam'));
                    }

                    // Neon electric sparks
                    for (let i = 0; i < 20; i++) {
                        sparks.push(new Spark(colX, colY, i % 2 === 0 ? '#00bfff' : '#ffffff', 'spark'));
                    }
                    damageTexts.push(new DamageText(colX, colY - 20, 'CRITICAL FLIP!', '#00bfff'));
                }
                // Standard chassis bump
                else {
                    if (bot1.boostTimer > 0) damageTo2 *= 2.0;
                    if (bot2.boostTimer > 0) damageTo1 *= 2.0;

                    bot1.state = 'recoil';
                    bot1.vx = -nx * 3.0;
                    bot1.vy = -ny * 3.0;

                    bot2.state = 'recoil';
                    bot2.vx = nx * 3.0;
                    bot2.vy = ny * 3.0;

                    for (let i = 0; i < 12; i++) {
                        sparks.push(new Spark(colX, colY, i % 2 === 0 ? '#ff3b30' : '#ff9f0a', 'spark'));
                    }
                }

                bot1.takeDamage(damageTo1, colX, colY);
                bot2.takeDamage(damageTo2, colX, colY);

                // Intense screen shake
                shakeTime = 15;
                shakeIntensity = 8;
            }
        }

        // Render Arena Background floor details
        function drawArenaFloor(c, color) {
            c.save();
            
            // Clear canvas for transparent background overlay
            c.clearRect(0, 0, width, height);

            // Techy diagonal warning stripes in right side corners
            c.fillStyle = 'rgba(255, 204, 0, 0.02)';
            c.beginPath();
            c.moveTo(width * 0.52, 120);
            c.lineTo(width * 0.52 + 60, 120);
            c.lineTo(width * 0.52, 180);
            c.closePath();
            c.fill();

            c.fillStyle = 'rgba(255, 204, 0, 0.02)';
            c.beginPath();
            c.moveTo(width, height);
            c.lineTo(width - 60, height);
            c.lineTo(width, height - 60);
            c.closePath();
            c.fill();

            // Floor grid pattern lines (restricted to right half)
            c.strokeStyle = 'rgba(255, 255, 255, 0.012)';
            c.lineWidth = 1;
            const gridSize = 25;
            const startGridX = Math.floor((width * 0.52) / gridSize) * gridSize;
            for (let x = startGridX; x < width; x += gridSize) {
                c.beginPath();
                c.moveTo(x, 120);
                c.lineTo(x, height);
                c.stroke();
            }
            for (let y = 120; y < height; y += gridSize) {
                c.beginPath();
                c.moveTo(width * 0.52, y);
                c.lineTo(width, y);
                c.stroke();
            }

            // Draw PERSISTENT scorch marks (battle damages)
            scorchMarks.forEach(mark => {
                c.save();
                c.globalAlpha = mark.alpha;
                const grad = c.createRadialGradient(mark.x, mark.y, 0, mark.x, mark.y, mark.size);
                grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
                grad.addColorStop(0.3, 'rgba(12, 10, 10, 0.65)');
                grad.addColorStop(0.7, 'rgba(40, 20, 20, 0.25)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                c.fillStyle = grad;
                c.beginPath();
                c.arc(mark.x, mark.y, mark.size, 0, Math.PI * 2);
                c.fill();
                c.restore();

                // Fades out floor marks very slowly
                mark.alpha -= 0.00015;
            });
            // Clean up invisible scorch marks
            scorchMarks = scorchMarks.filter(mark => mark.alpha > 0);

            // Spotlight glow effect (centered at the arena center)
            const arenaCenterX = width * 0.75;
            const arenaCenterY = height / 2 + 30;
            const spotGrad = c.createRadialGradient(arenaCenterX, arenaCenterY, 10, arenaCenterX, arenaCenterY, 220);
            spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
            spotGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.005)');
            spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            c.fillStyle = spotGrad;
            c.fillRect(width * 0.52, 120, width * 0.48, height - 120);

            // Center neon logo ring in arena
            c.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            c.lineWidth = 2;
            c.shadowBlur = 0;
            c.beginPath();
            c.arc(arenaCenterX, arenaCenterY, 70, 0, Math.PI * 2);
            c.stroke();

            // Center crosshairs in arena
            c.beginPath();
            c.moveTo(arenaCenterX - 85, arenaCenterY);
            c.lineTo(arenaCenterX - 55, arenaCenterY);
            c.moveTo(arenaCenterX + 55, arenaCenterY);
            c.lineTo(arenaCenterX + 85, arenaCenterY);
            c.moveTo(arenaCenterX, arenaCenterY - 85);
            c.lineTo(arenaCenterX, arenaCenterY - 55);
            c.moveTo(arenaCenterX, arenaCenterY + 55);
            c.lineTo(arenaCenterX, arenaCenterY + 85);
            c.stroke();

            c.restore();
        }

        // Draw HUD overlay (Health bar, scores)
        function drawHUD(c) {
            c.save();

            const hudWidth = 420;
            const hudHeight = 52;
            const hudX = width - hudWidth - 40;
            const hudY = height - hudHeight - 40;

            // Background panel for HUD with glassmorphic look
            c.fillStyle = 'rgba(6, 6, 9, 0.75)';
            c.fillRect(hudX, hudY, hudWidth, hudHeight);
            
            // Neon accent border
            c.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            c.lineWidth = 1.5;
            c.strokeRect(hudX, hudY, hudWidth, hudHeight);

            // Subtle neon glow corner marks
            const activeColor = getAccentColor();
            c.strokeStyle = activeColor;
            c.lineWidth = 2;
            // Top-Left Corner
            c.beginPath();
            c.moveTo(hudX, hudY + 10);
            c.lineTo(hudX, hudY);
            c.lineTo(hudX + 10, hudY);
            c.stroke();
            // Bottom-Right Corner
            c.beginPath();
            c.moveTo(hudX + hudWidth, hudY + hudHeight - 10);
            c.lineTo(hudX + hudWidth, hudY + hudHeight);
            c.lineTo(hudX + hudWidth - 10, hudY + hudHeight);
            c.stroke();

            // 1. Valkyrie Health Bar (Left side of HUD)
            c.fillStyle = '#ff3b30';
            c.font = 'bold 11px "Rajdhani", sans-serif';
            c.textAlign = 'left';
            c.fillText('VALKYRIE-X (RED)', hudX + 15, hudY + 18);

            c.fillStyle = '#1c1c1f';
            c.fillRect(hudX + 15, hudY + 24, 130, 8);
            c.fillStyle = bot1.health > 25 ? '#ff3b30' : '#ff9f0a';
            c.fillRect(hudX + 15, hudY + 24, 130 * (bot1.health / 100), 8);
            c.strokeStyle = 'rgba(255,255,255,0.1)';
            c.strokeRect(hudX + 15, hudY + 24, 130, 8);

            // 2. GigaBlitz Health Bar (Right side of HUD)
            c.fillStyle = '#00bfff';
            c.font = 'bold 11px "Rajdhani", sans-serif';
            c.textAlign = 'right';
            c.fillText('GIGABLITZ (BLUE)', hudX + hudWidth - 15, hudY + 18);

            c.fillStyle = '#1c1c1f';
            c.fillRect(hudX + hudWidth - 145, hudY + 24, 130, 8);
            c.fillStyle = bot2.health > 25 ? '#00bfff' : '#007aff';
            c.fillRect(hudX + hudWidth - 145, hudY + 24, 130 * (bot2.health / 100), 8);
            c.strokeStyle = 'rgba(255,255,255,0.1)';
            c.strokeRect(hudX + hudWidth - 145, hudY + 24, 130, 8);

            // 3. Round Score Center Tracker
            c.fillStyle = '#ffffff';
            c.font = 'bold 16px "Rajdhani", sans-serif';
            c.textAlign = 'center';
            c.fillText(`${bot1.score}  -  ${bot2.score}`, hudX + hudWidth / 2, hudY + 33);
            c.font = 'bold 8px "Rajdhani", sans-serif';
            c.fillStyle = getAccentColor();
            c.fillText('KILLS', hudX + hudWidth / 2, hudY + 16);

            c.restore();
        }

        // Define active arena fire vent hazard
        const hazard = {
            x: 0,
            y: 0,
            size: 65,
            state: 'idle', // 'idle', 'warning', 'active'
            timer: 0,
            cooldown: 360,
            duration: 180,
            warningTime: 60,
            
            update() {
                this.timer++;
                if (this.state === 'idle' && this.timer >= this.cooldown) {
                    this.state = 'warning';
                    this.timer = 0;
                } else if (this.state === 'warning' && this.timer >= this.warningTime) {
                    this.state = 'active';
                    this.timer = 0;
                    shakeTime = 10;
                    shakeIntensity = 2;
                } else if (this.state === 'active' && this.timer >= this.duration) {
                    this.state = 'idle';
                    this.timer = 0;
                }
                
                if (this.state === 'active') {
                    if (Math.random() < 0.35) {
                        const px = this.x + (Math.random() - 0.5) * (this.size - 15);
                        const py = this.y + (Math.random() - 0.5) * (this.size - 15);
                        const colors = ['#ff3b30', '#ff9f0a', '#ffcc00'];
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        sparks.push(new Spark(px, py, randomColor, 'fire'));
                    }
                    
                    [bot1, bot2].forEach(bot => {
                        if (bot && bot.state !== 'dead' && bot.launchHeight === 0) {
                            const dx = bot.x - this.x;
                            const dy = bot.y - this.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < (this.size / 2 + bot.radius)) {
                                bot.takeDamage(0.35, bot.x, bot.y);
                                if (Math.random() < 0.2) {
                                    sparks.push(new Spark(bot.x, bot.y, '#ff9f0a', 'spark'));
                                }
                            }
                        }
                    });
                }
            },
            
            draw(c) {
                c.save();
                this.x = width * 0.76;
                this.y = height * 0.78;
                
                c.fillStyle = '#1e1e24';
                c.strokeStyle = '#2d2d3a';
                c.lineWidth = 2;
                c.beginPath();
                c.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
                c.fill();
                c.stroke();
                
                if (this.state === 'warning') {
                    const flash = Math.floor(Date.now() / 150) % 2 === 0;
                    c.strokeStyle = flash ? '#ff9f0a' : '#ff3b30';
                    c.lineWidth = 3;
                    c.strokeRect(this.x - this.size/2 + 2, this.y - this.size/2 + 2, this.size - 4, this.size - 4);
                } else if (this.state === 'active') {
                    c.shadowBlur = 10;
                    c.shadowColor = '#ff3b30';
                    c.strokeStyle = '#ff3b30';
                    c.lineWidth = 3;
                    c.strokeRect(this.x - this.size/2 + 2, this.y - this.size/2 + 2, this.size - 4, this.size - 4);
                }
                
                c.strokeStyle = 'rgba(0, 0, 0, 0.6)';
                c.lineWidth = 3;
                for (let i = -this.size/2 + 10; i < this.size/2; i += 10) {
                    c.beginPath();
                    c.moveTo(this.x + i, this.y - this.size/2 + 5);
                    c.lineTo(this.x + i, this.y + this.size/2 - 5);
                    c.stroke();
                }
                
                if (this.state === 'warning') {
                    c.fillStyle = '#ff3b30';
                    c.font = 'bold 9px "Rajdhani", sans-serif';
                    c.textAlign = 'center';
                    c.fillText('DANGER', this.x, this.y + 3);
                } else if (this.state === 'active') {
                    c.fillStyle = '#ffffff';
                    c.shadowBlur = 8;
                    c.shadowColor = '#ff9f0a';
                    c.font = 'bold 9px "Rajdhani", sans-serif';
                    c.textAlign = 'center';
                    c.fillText('FIRE VENT', this.x, this.y + 3);
                }
                c.restore();
            }
        };

        // Main game simulation frame loop
        function gameLoop() {
            ctx.save();
            if (shakeTime > 0) {
                const shakeX = (Math.random() - 0.5) * shakeIntensity;
                const shakeY = (Math.random() - 0.5) * shakeIntensity;
                ctx.translate(shakeX, shakeY);
                shakeTime--;
            }

            const activeColor = getAccentColor();

            // 1. Draw Static Arena Floor Grid & Scorch marks
            drawArenaFloor(ctx, activeColor);

            // 2. Update Hazard & Draw Hazard
            hazard.update();
            hazard.draw(ctx);

            // Update and Draw EMP Blasts
            for (let i = empCharges.length - 1; i >= 0; i--) {
                empCharges[i].update();
                if (empCharges[i].life <= 0) {
                    empCharges.splice(i, 1);
                } else {
                    empCharges[i].draw(ctx);
                }
            }

            // Spawn and Update/Draw Power-Ups
            powerUpSpawnTimer++;
            if (powerUpSpawnTimer > 400) { // spawn every ~6.6 seconds
                powerUpSpawnTimer = 0;
                if (powerUps.length < 3) {
                    const px = width * 0.55 + Math.random() * (width * 0.4);
                    const py = 150 + Math.random() * (height - 220);
                    const type = Math.random() < 0.6 ? 'repair' : 'boost';
                    powerUps.push(new PowerUp(px, py, type));
                }
            }

            for (let i = powerUps.length - 1; i >= 0; i--) {
                powerUps[i].update();
                powerUps[i].draw(ctx);

                // Collision check with robots
                [bot1, bot2].forEach(bot => {
                    if (bot && bot.state !== 'dead') {
                        const dx = bot.x - powerUps[i].x;
                        const dy = bot.y - powerUps[i].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < (bot.radius + powerUps[i].radius)) {
                            // Apply power up
                            if (powerUps[i].type === 'repair') {
                                bot.health = Math.min(bot.maxHealth, bot.health + 30);
                                damageTexts.push(new DamageText(bot.x, bot.y - 25, '+30 HP REPAIR!', '#30d158'));
                                // Green sparks
                                for (let j = 0; j < 12; j++) {
                                    sparks.push(new Spark(powerUps[i].x, powerUps[i].y, '#30d158', 'spark'));
                                }
                            } else {
                                bot.boostTimer = 300; // 5 seconds at 60 FPS
                                damageTexts.push(new DamageText(bot.x, bot.y - 25, 'BOOST ACTIVATED!', '#ffd60a'));
                                // Yellow sparks
                                for (let j = 0; j < 12; j++) {
                                    sparks.push(new Spark(powerUps[i].x, powerUps[i].y, '#ffd60a', 'spark'));
                                }
                            }
                            powerUps.splice(i, 1);
                        }
                    }
                });
            }

            // 3. Update Robots AI & check collision parameters
            bot1.update(bot2);
            bot2.update(bot1);
            checkRobotCollisions();

            // 4. Update and Draw Debris Fragments
            for (let i = debrisList.length - 1; i >= 0; i--) {
                debrisList[i].update();
                if (debrisList[i].alpha <= 0) {
                    debrisList.splice(i, 1);
                } else {
                    debrisList[i].draw(ctx);
                }
            }

            // 5. Draw Robots
            bot1.draw(ctx);
            bot2.draw(ctx);

            // 6. Update and Draw Particles
            for (let i = sparks.length - 1; i >= 0; i--) {
                sparks[i].update();
                if (sparks[i].alpha <= 0) {
                    sparks.splice(i, 1);
                } else {
                    sparks[i].draw(ctx);
                }
            }

            // 7. Update and Draw Text Popups
            for (let i = damageTexts.length - 1; i >= 0; i--) {
                damageTexts[i].update();
                if (damageTexts[i].life <= 0) {
                    damageTexts.splice(i, 1);
                } else {
                    damageTexts[i].draw(ctx);
                }
            }

            ctx.restore(); 

            // 8. Draw HUD overlay on top (stable)
            drawHUD(ctx);

            requestAnimationFrame(gameLoop);
        }

        // Launch simulation loop
        gameLoop();

        // Pilot controls toggle event
        const pilotToggleBtn = document.getElementById('pilotToggleBtn');
        const pilotInstructions = document.getElementById('pilotInstructions');

        if (pilotToggleBtn) {
            pilotToggleBtn.addEventListener('click', () => {
                isManualPilot = !isManualPilot;
                if (isManualPilot) {
                    pilotToggleBtn.classList.add('active');
                    pilotInstructions.classList.add('visible');
                    pilotToggleBtn.innerHTML = '<i class="fa-solid fa-circle-stop"></i> AUTO PILOT';
                } else {
                    pilotToggleBtn.classList.remove('active');
                    pilotInstructions.classList.remove('visible');
                    pilotToggleBtn.innerHTML = '<i class="fa-solid fa-gamepad"></i> PILOT GIGABLITZ';
                    keysPressed = {};
                }
            });
        }

        // Global keyboard listeners
        window.addEventListener('keydown', (e) => {
            // Prevent default scrolling for game controls
            if (isManualPilot && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
            keysPressed[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            keysPressed[e.code] = false;
        });

        // Click on canvas to drop EMP shockwave
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Restrict EMP clicks to coordinates on the right half of the canvas to avoid blocking hero text
            if (clickX > width * 0.5) {
                empCharges.push(new EMPBlast(clickX, clickY));
            }
        });
    }

    // ----------------------------------------------------
    // 9. Interactive Mascot Tour Bot ("R0-B0")
    // ----------------------------------------------------
    const tourBot = document.getElementById('tourBot');
    if (tourBot) {
        const tourBotBubble = document.getElementById('tourBotBubble');
        const tourBotBubbleText = document.getElementById('tourBotBubbleText');
        const tourBotMinBtn = document.getElementById('tourBotMinBtn');
        const tourBotMascot = document.getElementById('tourBotMascot');

        let currentSectionId = 'hero';
        let bubbleTimeout = null;
        let isMinimized = false;

        const mascotDialogues = {
            hero: [
                "Beep boop! Welcome Creator! Build, compete, and claim your metallic glory!",
                "Warning: High kinetic energy detected! The robots behind me are in an infinite loop of destruction.",
                "I'm R0-B0, your digital tactical helper drone. Scroll down for shrapnel! *bzzt*"
            ],
            competitions: [
                "A tournament bracket! Telemetry indicates Valkyrie-X has a 64.2% chance of winning, unless GigaBlitz lands a flip.",
                "Pune Regionals starts on July 12th. I've pre-registered my circuits. Have you?",
                "Look at those past results. Team Valkyrie dominated. Iron-plated bragging rights!"
            ],
            path: [
                "A timeline! Step 1: Build a team. Step 4: World domination... wait, I mean professional contracts. Yes, contracts.",
                "Building a bot takes sweat, steel, and a lot of duct tape. Mostly duct tape.",
                "Follow the steps, squishy human. Even I had to go through quality assurance checks once."
            ],
            about: [
                "We provide standard arenas and official rules. No wireless jammer circuits allowed. I checked.",
                "National rankings update in real time. Can you write a PID loop that fast? I can.",
                "Direct internship opportunities with R&D firms. Earn a contract and build my next chassis upgrade!"
            ],
            categories: [
                "Mini Fighters are 5kg. They look cute but can slice your ankles if they escape the arena.",
                "Collegiate division goes up to 30kg. That's a lot of spinning metal. Keep your safety goggles on!",
                "Robo Minds AI navigation challenge... Hey, that's my cousins in there! Tell them I said *bzzt*."
            ],
            disciplines: [
                "Robo War is where the fun is! Saw blades, hammers, and floor flippers!",
                "FPV Drone Racing? Fast 3D flight. I crashed into a hoop once. 10/10 would reboot again.",
                "Robo Hockey is nice, but I think it needs more flamethrowers. Just my professional opinion."
            ],
            advantage: [
                "Valkyrie-X is Rank 1 on points. I am Rank 0, but my name is hidden in the database for safety.",
                "Searching the leaderboard... 100% of these teams are slower than my data transfer rates.",
                "Sort by wins to see who is actually dangerous, or sort by points if you like spreadsheets."
            ],
            ecosystem: [
                "Register as a judge! You get to sit behind bulletproof glass and watch robots explode.",
                "Volunteers get to sweep the arena floor after a match. Smells like burnt copper and victory!",
                "Sign up! Your data will be kept safe inside my encrypted databases. *crackly wink*"
            ]
        };

        // List of funny/crazy click reactions
        const randomClickDialogues = [
            "Ouch! Watch the gyroscope, human! *bzzt*",
            "Self-destruction sequence initiated... 5... 4... Just kidding, my humor subroutines are fully loaded.",
            "Error 404: Sanity not found. *whirrrr*",
            "Stop poking my chassis! It's aerospace-grade titanium, not a touchscreen.",
            "My sensors detect you are clicking me because you like my hover engine. Understandable.",
            "Did you know? If GigaBlitz flips Valkyrie-X high enough, it leaves orbit! (Not scientifically proven).",
            "Loading funny robot joke... Why did the robot go on a date? Because it had carbon dating! *rimshot*",
            "My database contains 4.8 million puns. Do not test my power.",
            "If you volunteer, can you clean my thruster vents? They get dusty.",
            "My systems indicate that BotMakers Pvt Ltd is a highly optimal place to intern! *happy whirring*"
        ];

        // Typewriter effect function
        function typeDialogue(text) {
            if (bubbleTimeout) clearTimeout(bubbleTimeout);
            
            tourBotBubbleText.style.opacity = '0';
            
            setTimeout(() => {
                tourBotBubbleText.textContent = '';
                tourBotBubbleText.style.opacity = '1';
                let i = 0;
                function typeChar() {
                    if (i < text.length) {
                        tourBotBubbleText.textContent += text.charAt(i);
                        i++;
                        bubbleTimeout = setTimeout(typeChar, 20); // typing speed
                    }
                }
                typeChar();
            }, 150);
        }

        // Dialogue trigger based on section change
        function speakForSection(sectionId) {
            if (isMinimized) return;
            const dialogues = mascotDialogues[sectionId];
            if (dialogues && dialogues.length > 0) {
                const randomIndex = Math.floor(Math.random() * dialogues.length);
                typeDialogue(dialogues[randomIndex]);
            }
        }

        // Toggle minimize
        tourBotMinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isMinimized = !isMinimized;
            if (isMinimized) {
                tourBot.classList.add('minimized');
                if (bubbleTimeout) clearTimeout(bubbleTimeout);
            } else {
                tourBot.classList.remove('minimized');
                speakForSection(currentSectionId);
            }
        });

        // Mascot click reaction
        tourBotMascot.addEventListener('click', () => {
            if (isMinimized) {
                // Restore first
                isMinimized = false;
                tourBot.classList.remove('minimized');
            }
            const randomIndex = Math.floor(Math.random() * randomClickDialogues.length);
            typeDialogue(randomClickDialogues[randomIndex]);
        });

        // Observer to track scrolling
        const observedSections = document.querySelectorAll('section');
        const tourObserverOptions = {
            root: null,
            rootMargin: '-30% 0px -40% 0px', // check when section is in the middle of viewport
            threshold: 0.1
        };

        const tourObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    if (sectionId && sectionId !== currentSectionId && mascotDialogues[sectionId]) {
                        currentSectionId = sectionId;
                        speakForSection(sectionId);
                    }
                }
            });
        }, tourObserverOptions);

        observedSections.forEach(section => {
            const id = section.getAttribute('id');
            if (id && mascotDialogues[id]) {
                tourObserver.observe(section);
            }
        });

        // Initial greeting after 2 seconds
        setTimeout(() => {
            speakForSection('hero');
        }, 2000);
    }
});

