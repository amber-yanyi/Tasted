# PWA Icons Setup

Your app needs two icon files to be fully installable as a PWA:

## Required Icons

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

## Quick Setup Options

### Option 1: Use a Favicon Generator (Easiest)
1. Go to https://realfavicongenerator.net/
2. Upload a simple wine glass icon or text logo
3. Download the generated icons
4. Rename them to `icon-192.png` and `icon-512.png`
5. Place them in this `/public` folder

### Option 2: Create Simple Icons
You can create simple colored squares with your app initial:
- Background: Purple (#7c3aed)
- Text: White "T" for Tasted
- Export as PNG at 192x192 and 512x512

### Option 3: Use Canva
1. Create a 512x512 design in Canva
2. Add a wine glass icon or the letter "T"
3. Download as PNG
4. Resize to create both versions

## Temporary Workaround

Until you add proper icons, the app will still work but won't have a custom icon when installed. It will use the browser's default icon.

## Testing

After adding icons:
1. Deploy your app
2. Open on mobile Safari/Chrome
3. Tap "Share" → "Add to Home Screen"
4. Your custom icon should appear!
