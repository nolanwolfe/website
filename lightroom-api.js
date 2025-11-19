// Adobe Lightroom API Integration
// Documentation: https://developer.adobe.com/lightroom/lightroom-api-docs/

class LightroomAPI {
    constructor(apiKey, clientId, clientSecret) {
        this.apiKey = apiKey;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.accessToken = null;
        this.baseURL = 'https://lr.adobe.io';
    }

    // Authenticate with Adobe Lightroom API
    async authenticate() {
        try {
            // Note: In production, OAuth should be handled server-side for security
            // This is a simplified example
            const response = await fetch('https://ims-na1.adobelogin.com/ims/token/v3', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    scope: 'openid,lr_partner_apis,lr_partner_rendition_read'
                })
            });

            const data = await response.json();
            this.accessToken = data.access_token;
            return this.accessToken;
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    // Get catalog information
    async getCatalog() {
        if (!this.accessToken) {
            await this.authenticate();
        }

        try {
            const response = await fetch(`${this.baseURL}/v2/catalog`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'X-API-Key': this.apiKey
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Error fetching catalog:', error);
            throw error;
        }
    }

    // Get assets from a specific album
    async getAlbumAssets(catalogId, albumId, options = {}) {
        if (!this.accessToken) {
            await this.authenticate();
        }

        const { limit = 50, offset = 0 } = options;

        try {
            const response = await fetch(
                `${this.baseURL}/v2/catalogs/${catalogId}/albums/${albumId}/assets?limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'X-API-Key': this.apiKey
                    }
                }
            );

            return await response.json();
        } catch (error) {
            console.error('Error fetching album assets:', error);
            throw error;
        }
    }

    // Get asset rendition (image URL)
    async getAssetRendition(catalogId, assetId, renditionType = '2048') {
        if (!this.accessToken) {
            await this.authenticate();
        }

        try {
            const response = await fetch(
                `${this.baseURL}/v2/catalogs/${catalogId}/assets/${assetId}/renditions/${renditionType}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'X-API-Key': this.apiKey
                    }
                }
            );

            return await response.json();
        } catch (error) {
            console.error('Error fetching asset rendition:', error);
            throw error;
        }
    }

    // Get albums from catalog
    async getAlbums(catalogId, options = {}) {
        if (!this.accessToken) {
            await this.authenticate();
        }

        const { limit = 50, offset = 0 } = options;

        try {
            const response = await fetch(
                `${this.baseURL}/v2/catalogs/${catalogId}/albums?limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'X-API-Key': this.apiKey
                    }
                }
            );

            return await response.json();
        } catch (error) {
            console.error('Error fetching albums:', error);
            throw error;
        }
    }

    // Sync photos from Lightroom to portfolio
    async syncPhotosToPortfolio(catalogId, albumId) {
        try {
            const assets = await this.getAlbumAssets(catalogId, albumId);
            const photos = [];

            for (const asset of assets.resources || []) {
                try {
                    const rendition = await this.getAssetRendition(catalogId, asset.id, '2048');
                    const thumbnail = await this.getAssetRendition(catalogId, asset.id, '640');

                    photos.push({
                        id: asset.id,
                        title: asset.payload?.captureDate || asset.id,
                        category: this.extractCategoryFromKeywords(asset.payload?.keywords),
                        url: rendition.href || rendition.url,
                        thumbnail: thumbnail.href || thumbnail.url,
                        metadata: asset.payload
                    });
                } catch (err) {
                    console.warn(`Error processing asset ${asset.id}:`, err);
                }
            }

            // Update portfolio with new photos
            if (typeof window.updatePhotos === 'function') {
                window.updatePhotos(photos);
            }

            return photos;
        } catch (error) {
            console.error('Error syncing photos:', error);
            throw error;
        }
    }

    // Helper function to extract category from keywords
    extractCategoryFromKeywords(keywords = []) {
        const categoryKeywords = {
            portrait: ['portrait', 'people', 'person', 'headshot'],
            landscape: ['landscape', 'nature', 'mountain', 'sunset', 'sunrise'],
            street: ['street', 'urban', 'city', 'architecture'],
            nature: ['nature', 'wildlife', 'flora', 'fauna', 'forest']
        };

        for (const [category, words] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword =>
                words.some(word => keyword.toLowerCase().includes(word))
            )) {
                return category;
            }
        }

        return 'all';
    }
}

// Initialize API (will be configured from config.js)
let lightroomAPI = null;

// Function to initialize the Lightroom API with credentials
function initializeLightroomAPI(apiKey, clientId, clientSecret) {
    lightroomAPI = new LightroomAPI(apiKey, clientId, clientSecret);
    return lightroomAPI;
}

// Export for use in admin panel
if (typeof window !== 'undefined') {
    window.LightroomAPI = LightroomAPI;
    window.initializeLightroomAPI = initializeLightroomAPI;
    window.lightroomAPI = lightroomAPI;
}
