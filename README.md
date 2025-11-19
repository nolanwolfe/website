# Photography Portfolio Website

A modern, responsive portfolio website for photographers with Adobe Lightroom API integration.

## Features

- Modern, clean, and responsive design
- Photo gallery with category filtering
- Lightbox viewer with keyboard navigation
- Adobe Lightroom API integration for automatic photo sync
- Admin panel for easy photo management
- Mobile-friendly navigation
- Smooth scrolling and animations
- LocalStorage for photo persistence

## Project Structure

```
website/
├── index.html          # Main portfolio page
├── admin.html          # Admin panel for managing photos
├── styles.css          # All styling
├── script.js           # Main JavaScript functionality
├── lightroom-api.js    # Adobe Lightroom API integration
├── config.example.js   # Configuration template
└── README.md           # This file
```

## Quick Start

### 1. Basic Setup (No Lightroom API)

Simply open `index.html` in your browser. The site comes with sample photos to demonstrate the gallery.

To add your own photos manually:
1. Open `admin.html` in your browser
2. Use the "Manual Photo Upload" section
3. Enter photo details and URL
4. Click "Add Photo"

### 2. Advanced Setup (With Adobe Lightroom API)

#### Prerequisites

- Adobe Developer account
- Lightroom subscription with photos in your catalog

#### Getting Adobe Lightroom API Credentials

1. Go to [Adobe Developer Console](https://developer.adobe.com/console)
2. Create a new project or select an existing one
3. Add the Lightroom API to your project
4. Note down your:
   - API Key
   - Client ID
   - Client Secret
5. Find your Catalog ID and Album ID from Lightroom

#### Configuration

1. Copy the configuration template:
   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` and fill in your credentials:
   ```javascript
   lightroom: {
       apiKey: 'your-api-key',
       clientId: 'your-client-id',
       clientSecret: 'your-client-secret',
       catalogId: 'your-catalog-id',
       albumId: 'your-album-id'
   }
   ```

3. Update site information:
   ```javascript
   site: {
       title: 'Your Name - Photography Portfolio',
       author: 'Your Name',
       email: 'your@email.com'
   }
   ```

#### Syncing Photos from Lightroom

1. Open `admin.html` in your browser
2. Fill in your Lightroom API credentials
3. Enter your Catalog ID and Album ID
4. Click "Sync Photos from Lightroom"
5. Your photos will automatically be imported to the gallery

## Customization

### Updating Personal Information

Edit `index.html` and update:
- Line 11: `<title>` tag
- Line 16: Your name in the logo
- Line 42: Hero title and subtitle
- Lines 68-71: About section text
- Line 89: Contact email
- Lines 92-96: Social media links

### Changing Colors

Edit `styles.css` and modify the CSS variables in the `:root` selector (lines 9-16):

```css
:root {
    --primary-color: #2c3e50;     /* Main dark color */
    --secondary-color: #34495e;   /* Secondary dark color */
    --accent-color: #3498db;      /* Accent/link color */
    --text-color: #333;           /* Body text color */
    --light-bg: #f8f9fa;          /* Light background */
    --white: #ffffff;             /* White */
}
```

### Adding/Removing Categories

1. Edit the filter buttons in `index.html` (lines 55-60)
2. Update the category options in `admin.html` (lines 191-196)
3. Modify category keywords in `lightroom-api.js` (lines 105-110)

## Photo Management

### Manual Upload

1. Access the admin panel at `admin.html`
2. Fill in the photo details:
   - Title
   - Category
   - Photo URL
   - Thumbnail URL (optional)
3. Click "Add Photo"

### Photo Format

Photos are stored in localStorage with this structure:

```javascript
{
    id: unique_id,
    title: "Photo Title",
    category: "landscape",
    url: "full-size-image-url",
    thumbnail: "thumbnail-url"
}
```

### Clearing Photos

Use the "Clear All Photos" button in the admin panel to remove all photos from the gallery.

## Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to Settings > Pages
3. Select your branch and save
4. Your site will be live at `https://yourusername.github.io/repository-name/`

### Netlify

1. Create a Netlify account
2. Drag and drop your project folder
3. Your site will be deployed instantly

### Custom Domain

Update the domain settings in your hosting provider's dashboard.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Security Notes

- **Never commit `config.js`** with real API credentials to a public repository
- API credentials should ideally be stored server-side for production
- The current implementation is suitable for personal portfolios
- For public sites, consider implementing a backend API

## Lightroom API Documentation

For more information about the Adobe Lightroom API:
- [Lightroom API Documentation](https://developer.adobe.com/lightroom/lightroom-api-docs/)
- [Adobe Developer Console](https://developer.adobe.com/console)

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please refer to:
- Adobe Lightroom API: [Adobe Developer Console](https://developer.adobe.com/console)
- HTML/CSS/JavaScript: [MDN Web Docs](https://developer.mozilla.org/)

## Future Enhancements

Potential features to add:
- Image upload from local files
- Photo editing capabilities
- Comments section
- Search functionality
- Photo metadata display
- EXIF data extraction
- Bulk operations
- Export gallery to different formats