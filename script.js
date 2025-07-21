// Insights from "Meditations for Mortals" by Oliver Burkeman
const defaultSnippets = [
    "It's worse than you think → liberation: once you grasp that finishing everything is impossible, anxiety loosens and purposeful action begins.",
    "Imperfectionism: stop waiting to be \"on top of things\"; live and work meaningfully amid mess today.",
    "Against productivity debt: keep a done-list to celebrate completed value instead of chasing infinite to-dos.",
    "Only trade-offs exist: always ask the price and whether it's worth paying—there are no perfect solutions.",
    "Choose the vital few: abandon the unwinnable struggle to do everything; pour finite attention into what counts.",
    "River-not-bucket rule for information: treat backlogs like streams—pick a few gems, let the rest flow by.",
    "Finish things: the \"magic of completion\" delivers momentum and clarity that endless tinkering never will.",
    "Daily-ish discipline: flexible, forgiving routines outlast rigid perfection and keep you moving forward.",
    "Look for the life-task: attend to what reality wants from you, not just self-generated ambitions.",
    "Pay yourself first: ring-fence prime time and energy for personally meaningful work before obligations intrude.",
    "Stop being so kind to \"Future You\": quit deferring hard choices; act now and own the consequences.",
    "Ask \"What if this were easy?\"—drop the romance of effort; many meaningful actions require less strain than assumed.",
    "Scruffy hospitality: invite people into your imperfect life; authenticity forges deeper bonds than polished façades.",
    "You can't hoard life: moments must pass—grasping at them only blunts their richness.",
    "Develop a taste for problems: aim for interesting challenges rather than fantasising about a problem-free future.",
    "Decision-hunting: make small, concrete choices to escape analysis paralysis and gain real-world feedback.",
    "Let the future be the future: cross bridges when you reach them; worry is futile scenario-planning.",
    "Radical freedom: you're largely free to do as you like—you just have to face the consequences.",
    "Reverse golden rule: stop treating yourself in ways you'd consider cruel if aimed at a friend.",
    "Everyone's messed up inside: don't compare your messy interior to others' curated outsides."
];

// Initialize cloud storage
let gistStorage = null;
let useCloudSync = false;
let syncStatus = 'local';

// Initialize storage system
async function initStorage() {
    const statusEl = document.getElementById('syncStatus');
    
    if (window.RUMINATIONS_CONFIG && 
        window.RUMINATIONS_CONFIG.enableCloudSync && 
        window.RUMINATIONS_CONFIG.githubToken) {
        
        try {
            gistStorage = new GistStorage();
            await gistStorage.init(
                window.RUMINATIONS_CONFIG.githubToken,
                window.RUMINATIONS_CONFIG.gistId
            );
            useCloudSync = true;
            syncStatus = 'cloud';
            statusEl.innerHTML = '☁️ Cloud sync active';
            statusEl.classList.add('cloud');
            
            // Try to sync from cloud on startup
            await syncFromCloud();
        } catch (error) {
            console.error('Failed to initialize cloud sync:', error);
            statusEl.innerHTML = '⚠️ Cloud sync failed, using local storage';
            statusEl.classList.add('error');
            setTimeout(() => {
                statusEl.innerHTML = '💾 Local storage only';
                statusEl.classList.remove('error');
            }, 3000);
        }
    } else {
        statusEl.innerHTML = '💾 Local storage only';
    }
}

// Sync from cloud to local
async function syncFromCloud() {
    if (!useCloudSync || !gistStorage) return;
    
    const cloudThoughts = await gistStorage.loadThoughts();
    if (cloudThoughts !== null) {
        localStorage.setItem('customThoughts', JSON.stringify(cloudThoughts));
    }
}

// Load custom thoughts from localStorage
function loadCustomThoughts() {
    const saved = localStorage.getItem('customThoughts');
    return saved ? JSON.parse(saved) : [];
}

// Save custom thoughts with cloud sync
async function saveCustomThoughts(thoughts) {
    // Always save to localStorage first
    localStorage.setItem('customThoughts', JSON.stringify(thoughts));
    
    // Then try cloud sync if enabled
    if (useCloudSync && gistStorage) {
        const statusEl = document.getElementById('syncStatus');
        statusEl.innerHTML = '🔄 Syncing...';
        
        const success = await gistStorage.saveThoughts(thoughts);
        if (success) {
            statusEl.innerHTML = '☁️ Synced';
            setTimeout(() => {
                statusEl.innerHTML = '☁️ Cloud sync active';
            }, 2000);
        } else {
            statusEl.innerHTML = '⚠️ Sync failed';
            setTimeout(() => {
                statusEl.innerHTML = '☁️ Cloud sync active';
            }, 3000);
        }
    }
}

// Get all snippets (default + custom)
function getAllSnippets() {
    const customThoughts = loadCustomThoughts();
    return [...defaultSnippets, ...customThoughts];
}

const snippetElement = document.getElementById('snippet');
const refreshBtn = document.getElementById('refreshBtn');
const thoughtInput = document.getElementById('thoughtInput');
const addBtn = document.getElementById('addBtn');
const manageBtn = document.getElementById('manageBtn');
const manageModal = document.getElementById('manageModal');
const closeBtn = document.querySelector('.close-btn');
const thoughtsList = document.getElementById('thoughtsList');
const thoughtCount = document.getElementById('thoughtCount');

function getRandomSnippet() {
    const allSnippets = getAllSnippets();
    const randomIndex = Math.floor(Math.random() * allSnippets.length);
    return allSnippets[randomIndex];
}

function displaySnippet() {
    snippetElement.style.opacity = '0';
    setTimeout(() => {
        snippetElement.textContent = getRandomSnippet();
        snippetElement.style.opacity = '1';
    }, 300);
}

snippetElement.style.transition = 'opacity 0.3s ease-in-out';

// Initialize storage and display first snippet
initStorage().then(() => {
    displaySnippet();
});

refreshBtn.addEventListener('click', displaySnippet);

// Add new thought functionality
addBtn.addEventListener('click', async () => {
    const newThought = thoughtInput.value.trim();
    
    if (newThought) {
        const customThoughts = loadCustomThoughts();
        customThoughts.push(newThought);
        await saveCustomThoughts(customThoughts);
        
        // Clear the input
        thoughtInput.value = '';
        
        // Show success feedback
        addBtn.textContent = 'Saved';
        addBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            addBtn.textContent = 'Add Thought';
            addBtn.style.backgroundColor = '';
        }, 2000);
        
        // Display the new thought
        snippetElement.style.opacity = '0';
        setTimeout(() => {
            snippetElement.textContent = newThought;
            snippetElement.style.opacity = '1';
        }, 300);
    }
});

// Allow adding thought with Enter key (Ctrl/Cmd + Enter)
thoughtInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        addBtn.click();
    }
});

// Manage Thoughts functionality
function renderThoughtsList() {
    const customThoughts = loadCustomThoughts();
    thoughtCount.textContent = customThoughts.length;
    
    if (customThoughts.length === 0) {
        thoughtsList.innerHTML = '<div class="empty-thoughts">No custom thoughts yet.<br>Add some thoughts to see them here!</div>';
        return;
    }
    
    thoughtsList.innerHTML = customThoughts.map((thought, index) => `
        <div class="thought-item">
            <div class="thought-text">${thought}</div>
            <button class="delete-thought-btn" data-index="${index}">Delete</button>
        </div>
    `).join('');
    
    // Add delete event listeners
    document.querySelectorAll('.delete-thought-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const index = parseInt(e.target.dataset.index);
            await deleteThought(index);
        });
    });
}

// Delete a specific thought
async function deleteThought(index) {
    const customThoughts = loadCustomThoughts();
    
    if (index >= 0 && index < customThoughts.length) {
        customThoughts.splice(index, 1);
        await saveCustomThoughts(customThoughts);
        renderThoughtsList(); // Refresh the list
    }
}

// Modal event listeners
manageBtn.addEventListener('click', () => {
    renderThoughtsList();
    manageModal.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    manageModal.classList.remove('show');
});

// Close modal when clicking outside
manageModal.addEventListener('click', (e) => {
    if (e.target === manageModal) {
        manageModal.classList.remove('show');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && manageModal.classList.contains('show')) {
        manageModal.classList.remove('show');
    }
});