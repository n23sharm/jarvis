# Setting Up Cloud Sync for Ruminations

Cloud sync allows your thoughts to be saved to GitHub and accessed from any device.

## Setup Steps

1. **Create a GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens/new
   - Give your token a descriptive name (e.g., "Ruminations App")
   - Select expiration (or "No expiration" for permanent access)
   - Check only the `gist` scope checkbox
   - Click "Generate token"
   - **Important**: Copy the token immediately (you won't see it again!)

2. **Configure the App**
   - Open `config.js` in your project
   - Paste your token in the `githubToken` field
   - Set `enableCloudSync` to `true`
   
   Example:
   ```javascript
   window.RUMINATIONS_CONFIG = {
       githubToken: 'ghp_yourTokenHere123456',
       gistId: '',
       enableCloudSync: true
   };
   ```

3. **First Run**
   - Open the app in your browser
   - You should see "☁️ Cloud sync active" in the bottom right
   - The app will automatically create a private Gist for your thoughts
   - Any existing local thoughts will be uploaded

## How It Works

- **Automatic Sync**: Thoughts are saved to both local storage and GitHub
- **Cross-Device**: Access your thoughts from any device with the same token
- **Offline Support**: Falls back to local storage when offline
- **Private Storage**: Your Gist is private (unlisted) by default

## Security Notes

- **Never commit your token**: Add `config.js` to `.gitignore`
- **Token permissions**: Only needs `gist` scope, nothing else
- **Private by default**: Your thoughts are stored in a private Gist

## Troubleshooting

- **"Cloud sync failed"**: Check your token is correct and has `gist` scope
- **Can't see thoughts on another device**: Make sure you're using the same token
- **Lost your token**: Create a new one and update `config.js`

## Finding Your Gist

After first sync, you can find your Gist ID in the browser console or at:
https://gist.github.com (look for "Ruminations - Personal Thoughts Storage")