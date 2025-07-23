# Claude Project Context: Ruminations App

## Project Overview
Ruminations is a personal thought collection and daily inspiration app. Users can view curated philosophical insights from Oliver Burkeman's "Meditations for Mortals" and add their own thoughts which are randomly displayed alongside the default content.

## Key Features
- **Daily Inspiration**: Display random thoughts/quotes with "Inspire Me Again" button
- **Personal Collection**: Add custom thoughts that persist and sync across devices  
- **Cloud Sync**: GitHub Gist integration for cross-device synchronization
- **Thought Management**: Modal interface to view and delete custom thoughts
- **Offline Support**: localStorage fallback when cloud sync unavailable
- **Read-Only Sharing**: Share your wisdom collection via URL parameters for public viewing

## Architecture & Files

### Core Files
- `index.html` - Main app structure with modal for thought management
- `script.js` - Primary application logic, storage, and UI interactions
- `style.css` - Complete styling including modal and responsive design
- `gist-storage.js` - GitHub Gist API integration class
- `config.js` - User configuration (gitignored, contains GitHub token)
- `config.js.example` - Template for user setup

### Documentation
- `SETUP_CLOUD_SYNC.md` - Complete GitHub token setup instructions
- `README.md` - Project description and usage
- `CLAUDE.md` - This file (project context for Claude)

### Development Tools  
- `run_app.js` - Playwright script to launch app in headed browser mode
- `package.json` - Node.js dependencies (playwright)

## Technical Architecture

### Data Storage Strategy
1. **Primary**: localStorage for immediate persistence
2. **Secondary**: GitHub Gist for cloud sync across devices
3. **Fallback**: Graceful degradation when cloud unavailable

### Content Structure
- `defaultSnippets[]` - Oliver Burkeman quotes (20 insights)
- `customThoughts[]` - User-added thoughts (stored separately)
- Combined randomly for display via `getAllSnippets()`

### Key JavaScript Functions
- `initStorage()` - Initialize cloud sync on app load
- `saveCustomThoughts(thoughts)` - Save to both local + cloud with sync status
- `loadCustomThoughts()` - Load from localStorage
- `renderThoughtsList()` - Display thoughts in manage modal
- `deleteThought(index)` - Remove specific thought with sync
- `checkReadOnlyMode()` - Detect URL parameters for read-only viewing

## Cloud Sync Implementation

### GitHub Gist Integration
- Uses GitHub Personal Access Token with 'gist' scope
- Creates private gist: "Ruminations - Personal Thoughts Storage"
- Auto-finds existing gist or creates new one
- Handles online/offline states gracefully

### Sync Status Indicators
- `☁️ Cloud sync active` - Connected and working
- `🔄 Syncing...` - Upload in progress  
- `💾 Local storage only` - No cloud config
- `⚠️ Sync failed` - Error state

## Sharing Mode

### Read-Only Access
- **URL Parameters**: `?readonly=true` or `?mode=share` enables read-only mode
- **Interface Changes**: Hides add/manage buttons, shows "Daily Inspiration" title
- **Use Cases**: Share your wisdom collection publicly without edit access
- **Status Indicator**: Shows "Read-only mode" instead of sync status

### Operation Modes
1. **Personal Mode**: Full editing capabilities with cloud sync (default)
2. **Shared Mode**: Clean read-only experience for public viewing

## UI/UX Design Philosophy

### Layout Priorities
1. **Thought display**: Large, centered, prominent (main focus)
2. **Inspiration button**: Clear call-to-action for new thoughts
3. **Add section**: Subtle, appears on hover (secondary in personal mode, hidden in shared mode)
4. **Management**: Hidden in modal (occasional use, personal mode only)

### Visual Hierarchy
- Title: Small, muted (RUMINATIONS)
- Thought card: Large text, decorative quote mark, shadow
- Buttons: "Inspire Me Again" (primary), "Add/Manage" (secondary)
- Status: Small indicator in corner

## Development Workflow

### Running Locally
```bash
node run_app.js  # Launches in browser with Playwright
```

### Enabling Cloud Sync
1. Copy `config.js.example` to `config.js`
2. Get GitHub token from https://github.com/settings/tokens/new
3. Add token to config.js and set `enableCloudSync: true`

### Common Tasks
- **Add new default quotes**: Update `defaultSnippets` array in script.js
- **UI changes**: Modify style.css (responsive design included)  
- **Storage logic**: Update save/load functions in script.js
- **Cloud sync**: Modify gist-storage.js class methods

## Security Considerations
- `config.js` is gitignored to protect GitHub tokens
- Gists are private by default
- Token only needs 'gist' scope (minimal permissions)
- No sensitive data in public repository

## Browser Compatibility
- Modern browsers (ES6+ features used)
- localStorage and fetch API required
- Responsive design for mobile/desktop
- Backdrop-filter used (may need fallback for older browsers)

## Dependencies
- **Playwright**: For local development server
- **GitHub API**: For cloud sync functionality
- **No frontend frameworks**: Vanilla HTML/CSS/JS

## Future Enhancement Ideas
- Export thoughts to various formats
- Search/filter functionality in manage view
- Categories or tags for thoughts  
- Import from other sources
- Offline sync queue when reconnecting
- Multiple theme options
- Custom sharing URLs with specific thought collections
- Analytics for shared links

## Deployment Notes
- Static files only (can deploy anywhere)
- Users must configure their own GitHub tokens
- No server-side components required
- Works offline with localStorage only

## Testing Strategy
- Manual testing via Playwright headed mode
- Test cloud sync with actual GitHub account
- Verify offline/online state transitions
- Cross-device sync validation with same token
- Test read-only mode with various URL parameters
- Verify UI elements properly hide in shared mode

This architecture prioritizes simplicity, data ownership (user's GitHub), and progressive enhancement (works without cloud sync).