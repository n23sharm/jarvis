// GitHub Gist Storage Module
class GistStorage {
    constructor() {
        this.gistId = null;
        this.token = null;
        this.gistFileName = 'ruminations.json';
        this.isOnline = navigator.onLine;
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.isOnline = true);
        window.addEventListener('offline', () => this.isOnline = false);
    }

    // Initialize with token and optional existing gist ID
    async init(token, gistId = null) {
        this.token = token;
        
        if (gistId) {
            this.gistId = gistId;
        } else {
            // Try to find existing gist or create new one
            this.gistId = await this.findOrCreateGist();
        }
        
        return this.gistId;
    }

    // Find existing Ruminations gist or create a new one
    async findOrCreateGist() {
        try {
            // First, try to get all user's gists
            const response = await fetch('https://api.github.com/gists', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch gists');

            const gists = await response.json();
            
            // Look for existing Ruminations gist
            const existingGist = gists.find(gist => 
                gist.description === 'Ruminations - Personal Thoughts Storage' &&
                gist.files && gist.files[this.gistFileName]
            );

            if (existingGist) {
                return existingGist.id;
            }

            // Create new gist
            return await this.createGist();
        } catch (error) {
            console.error('Error finding/creating gist:', error);
            throw error;
        }
    }

    // Create a new gist
    async createGist() {
        const response = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: 'Ruminations - Personal Thoughts Storage',
                public: false,
                files: {
                    [this.gistFileName]: {
                        content: JSON.stringify({ thoughts: [] }, null, 2)
                    }
                }
            })
        });

        if (!response.ok) throw new Error('Failed to create gist');

        const gist = await response.json();
        return gist.id;
    }

    // Load thoughts from Gist
    async loadThoughts() {
        if (!this.isOnline || !this.gistId) {
            return null; // Fallback to localStorage will handle this
        }

        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch gist');

            const gist = await response.json();
            const content = gist.files[this.gistFileName].content;
            const data = JSON.parse(content);
            
            return data.thoughts || [];
        } catch (error) {
            console.error('Error loading from Gist:', error);
            return null;
        }
    }

    // Save thoughts to Gist
    async saveThoughts(thoughts) {
        if (!this.isOnline || !this.gistId) {
            return false; // Indicate save failed, use localStorage fallback
        }

        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        [this.gistFileName]: {
                            content: JSON.stringify({ 
                                thoughts: thoughts,
                                lastUpdated: new Date().toISOString()
                            }, null, 2)
                        }
                    }
                })
            });

            return response.ok;
        } catch (error) {
            console.error('Error saving to Gist:', error);
            return false;
        }
    }

    // Check if we have valid configuration
    isConfigured() {
        return this.token && this.gistId;
    }
}

// Export for use in main script
window.GistStorage = GistStorage;