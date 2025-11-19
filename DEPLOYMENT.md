# Deployment Checklist

This document contains important information for deploying your photography portfolio website.

## Pre-Deployment Checklist

### 1. Content Customization
- [ ] Update `index.html` line 36: Change "Your Name" to your actual name
- [ ] Update `index.html` line 54-55: Customize hero title and subtitle
- [ ] Update `index.html` lines 83-85: Update About section with your bio
- [ ] Update `index.html` line 108: Add your contact email
- [ ] Update `index.html` lines 113-115: Add your social media links
- [ ] Update `index.html` line 126: Change footer copyright text

### 2. SEO & Metadata
- [ ] Update meta tags in `index.html` (lines 6-8) with your info
- [ ] Update Open Graph tags (lines 11-15) with your website URL
- [ ] Update Twitter card tags (lines 18-22) with your website URL
- [ ] Create an og-image.jpg (1200x630px recommended) for social sharing
- [ ] Add a favicon.ico file to the root directory

### 3. Photos & Content
- [ ] Remove sample photos or add your own via admin panel
- [ ] Test that all photo URLs are working
- [ ] Ensure photos are optimized (compressed) for web
- [ ] Verify all categories are displaying correctly

### 4. Lightroom API (Optional)
If using Adobe Lightroom integration:
- [ ] Get API credentials from Adobe Developer Console
- [ ] Test API connection in admin panel
- [ ] Verify photos sync correctly
- [ ] **IMPORTANT**: Never commit actual credentials to Git
- [ ] Keep `config.js` in `.gitignore`

### 5. Security Review
✅ XSS protection implemented (HTML escaping)
✅ URL validation for all photo URLs
✅ Input sanitization on all forms
✅ HTTP status code checking on API calls
✅ Error handling for all async operations

### 6. Performance
- [ ] Compress all images before uploading
- [ ] Consider using a CDN for image hosting
- [ ] Test page load speed with browser dev tools
- [ ] Verify lazy loading is working for images

### 7. Browser Testing
Test the website in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 8. Responsive Design Testing
Test on different screen sizes:
- [ ] Desktop (1920px and wider)
- [ ] Laptop (1366px - 1920px)
- [ ] Tablet portrait (768px - 1024px)
- [ ] Mobile landscape (480px - 768px)
- [ ] Mobile portrait (320px - 480px)

## Deployment Options

### Option 1: GitHub Pages (Free)
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select branch (usually `main` or `master`)
4. Click Save
5. Your site will be live at `https://yourusername.github.io/repository-name/`

**Pros:**
- Free hosting
- Automatic HTTPS
- Easy deployment
- Good for personal portfolios

**Cons:**
- No server-side code (static only)
- Limited to 1GB storage
- Public repositories only (for free tier)

### Option 2: Netlify (Free + Paid)
1. Create account at netlify.com
2. Connect your Git repository OR drag and drop files
3. Configure build settings (none needed for this project)
4. Deploy!

**Pros:**
- Free tier includes custom domains
- Automatic HTTPS
- Continuous deployment from Git
- Form handling available
- Serverless functions support

**Cons:**
- Build minutes limited on free tier

### Option 3: Vercel (Free + Paid)
1. Create account at vercel.com
2. Import Git repository
3. Deploy with one click

**Pros:**
- Free tier is generous
- Automatic HTTPS
- Edge network (fast globally)
- Great DX (developer experience)

**Cons:**
- Primarily focused on Next.js/React

### Option 4: AWS S3 + CloudFront
1. Create S3 bucket
2. Enable static website hosting
3. Upload files
4. Configure CloudFront for CDN (optional)

**Pros:**
- Highly scalable
- Professional solution
- Full control

**Cons:**
- More complex setup
- Costs money (though minimal for small sites)
- Requires AWS knowledge

### Option 5: Traditional Web Hosting
Upload files via FTP to any web hosting provider (Bluehost, HostGator, SiteGround, etc.)

## Custom Domain Setup

### After Deployment:
1. Purchase domain from registrar (Namecheap, Google Domains, etc.)
2. Add custom domain in hosting provider settings
3. Update DNS records:
   - For GitHub Pages: Add CNAME or A records
   - For Netlify/Vercel: Follow their custom domain setup
4. Update meta tags in `index.html` with your actual domain
5. Wait for DNS propagation (can take 24-48 hours)

## Post-Deployment

### Verification:
- [ ] Test all links work correctly
- [ ] Verify contact form (currently shows alert)
- [ ] Check mobile responsiveness
- [ ] Test lightbox functionality
- [ ] Verify smooth scrolling
- [ ] Check that hamburger menu works on mobile
- [ ] Test admin panel photo upload
- [ ] Verify photos persist in localStorage

### SEO & Analytics:
- [ ] Submit sitemap to Google Search Console
- [ ] Add Google Analytics (optional)
- [ ] Test social media sharing (Twitter, Facebook)
- [ ] Verify Open Graph tags are working

### Monitoring:
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Monitor page performance (Google PageSpeed Insights)
- [ ] Check for broken links regularly

## Security Best Practices

### DO:
✅ Keep dependencies updated
✅ Use HTTPS (automatic with modern hosts)
✅ Validate all user inputs
✅ Sanitize data before display
✅ Keep API credentials secret
✅ Use `.gitignore` for sensitive files

### DON'T:
❌ Commit API credentials to Git
❌ Use HTTP for API calls
❌ Trust user input without validation
❌ Store sensitive data in localStorage
❌ Use inline JavaScript event handlers extensively

## Backup Strategy

1. **Code**: Keep in Git repository
2. **Photos**:
   - Back up photo URLs if using external hosting
   - Export localStorage data periodically
   - Keep originals in Lightroom or local storage
3. **Configuration**: Document all custom settings

## Support & Maintenance

### Regular Tasks:
- Update photos regularly
- Check for broken image links
- Review analytics
- Update content/bio as needed
- Respond to contact form submissions

### Updates:
This is a static website with no dependencies, so minimal maintenance is required. However:
- Monitor browser compatibility
- Update meta tags if social platforms change requirements
- Refresh design every 1-2 years to stay modern

## Troubleshooting

### Photos not loading:
- Check URL validity
- Verify CORS settings on image host
- Check browser console for errors

### Admin panel not saving:
- Ensure localStorage is enabled
- Check for private/incognito mode
- Verify browser supports localStorage

### Lightroom sync failing:
- Verify API credentials
- Check catalog and album IDs
- Look for CORS errors in console
- Ensure quota limits not exceeded

### Mobile menu not working:
- Check JavaScript console for errors
- Verify hamburger click handler is attached
- Test in different mobile browsers

## Contact

For issues or questions:
- Check browser console for errors
- Review this deployment guide
- Test in different browsers
- Check network tab for failed requests

## License

This project is open source. Feel free to modify and use for personal or commercial purposes.
