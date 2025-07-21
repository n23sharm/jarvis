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

// Load custom thoughts from localStorage
function loadCustomThoughts() {
    const saved = localStorage.getItem('customThoughts');
    return saved ? JSON.parse(saved) : [];
}

// Save custom thoughts to localStorage
function saveCustomThoughts(thoughts) {
    localStorage.setItem('customThoughts', JSON.stringify(thoughts));
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

displaySnippet();

refreshBtn.addEventListener('click', displaySnippet);

// Add new thought functionality
addBtn.addEventListener('click', () => {
    const newThought = thoughtInput.value.trim();
    
    if (newThought) {
        const customThoughts = loadCustomThoughts();
        customThoughts.push(newThought);
        saveCustomThoughts(customThoughts);
        
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