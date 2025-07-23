# iOS PWA Update Behavior

## How iOS PWAs Handle Updates

### The Challenge
- iOS PWAs cache aggressively for offline use
- Changes you deploy won't automatically appear
- Users need to manually refresh to get updates

### Update Methods

#### 1. Manual Refresh (Current)
Users must:
- Open the PWA
- Pull down to refresh (swipe down from top)
- Or close and reopen the app completely

#### 2. Service Worker (Recommended Solution)
Add a service worker to control caching and updates:

```javascript
// sw.js - Basic service worker with update strategy
const CACHE_NAME = 'ruminations-v1';

self.addEventListener('install', event => {
    self.skipWaiting(); // Force update
});

self.addEventListener('activate', event => {
    // Clear old caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    // Network first strategy for updates
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache the fresh response
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Fall back to cache if offline
                return caches.match(event.request);
            })
    );
});
```

#### 3. Version Detection (User-Friendly)
Add version checking to notify users:

```javascript
// In script.js
const APP_VERSION = '1.0.1'; // Increment when deploying

// Check for updates
async function checkForUpdates() {
    try {
        const response = await fetch('version.json');
        const data = await response.json();
        
        if (data.version !== APP_VERSION) {
            // Show update notification
            if (confirm('A new version is available! Refresh to update?')) {
                window.location.reload(true);
            }
        }
    } catch (error) {
        // Ignore if offline
    }
}

// Check on load and periodically
window.addEventListener('load', checkForUpdates);
setInterval(checkForUpdates, 300000); // Every 5 minutes
```

### Quick Implementation

1. **Add to index.html:**
```html
<script>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
</script>
```

2. **Create version.json:**
```json
{
    "version": "1.0.1"
}
```

3. **Update version.json** whenever you deploy changes

### iOS-Specific Quirks

- Service workers have limited background functionality
- PWA must be opened for updates to download
- Force refresh: Close app → Clear Safari cache → Reopen
- Some updates require re-adding to home screen

### Best Practices

1. **Visible Version Number**: Show version in app footer
2. **Update Button**: Add manual refresh button in settings
3. **Change Log**: Track what's new in each version
4. **Cache Busting**: Use versioned file names (e.g., `script.v2.js`)

### Testing Updates

1. Make a visible change (e.g., background color)
2. Deploy the change
3. Increment version in version.json
4. Open PWA on iOS
5. Pull to refresh or wait for auto-check
6. Verify change appears

Without a service worker, users must manually refresh to see updates!