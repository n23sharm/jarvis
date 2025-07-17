const snippets = [
    "The present moment is the only time over which we have dominion.",
    "We suffer more in imagination than in reality.",
    "You have power over your mind - not outside events. Realize this, and you will find strength.",
    "The happiness of your life depends upon the quality of your thoughts.",
    "The best revenge is to be unlike him who performed the injury.",
    "Accept the things to which fate binds you, and love the people with whom fate brings you together.",
    "When you arise in the morning, think of what a precious privilege it is to be alive - to breathe, to think, to enjoy, to love.",
    "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
    "The soul becomes dyed with the color of its thoughts.",
    "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.",
    "Waste no more time arguing about what a good person should be. Be one.",
    "The impediment to action advances action. What stands in the way becomes the way.",
    "Be like the rocky headland on which the waves constantly break. It stands firm, and round it the seething waters are laid to rest.",
    "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it.",
    "The universe is change; our life is what our thoughts make it.",
    "Loss is nothing else but change, and change is Nature's delight.",
    "Confine yourself to the present.",
    "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly.",
    "How much trouble he avoids who does not look to see what his neighbor says or does.",
    "Adapt yourself to the things among which your lot has been cast and love sincerely the fellow creatures with whom destiny has ordained that you shall live."
];

const snippetElement = document.getElementById('snippet');
const refreshBtn = document.getElementById('refreshBtn');

function getRandomSnippet() {
    const randomIndex = Math.floor(Math.random() * snippets.length);
    return snippets[randomIndex];
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