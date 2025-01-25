import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import crypto from 'crypto';

// Define types for Amazon Product API
export interface ProductSearchParams {
  keywords: string;
  category?: string;
  page?: number;
  itemsPerPage?: number;
}

export interface ProductResult {
  asin: string;
  title: string;
  price: number;
  imageUrl: string;
  productUrl: string;
}

// Amazon API Response Types
export interface AmazonApiResponseItem {
  ASIN: string;
  ItemInfo?: {
    Title?: {
      DisplayValue?: string;
    };
  };
  Offers?: {
    Listings?: Array<{
      Price?: {
        Amount?: number;
      };
    }>;
  };
  Images?: {
    Primary?: {
      Large?: {
        URL?: string;
      };
    };
  };
  DetailPageURL?: string;
}

interface AmazonApiResponse {
  SearchResult: {
    Items: AmazonApiResponseItem[];
    TotalResultCount: number;
  };
}

export class AmazonProductService {
  private client: AxiosInstance;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly partnerTag: string;
  private readonly region: string = 'us-east-1';
  private readonly service: string = 'ProductAdvertisingAPI';

  constructor() {
    // Validate environment variables, but allow skipping in development
    this.validateEnvironmentVariables();

    // Use empty strings as fallback in development
    this.accessKey = import.meta.env.VITE_AMAZON_ACCESS_KEY || '';
    this.secretKey = import.meta.env.VITE_AMAZON_SECRET_KEY || '';
    this.partnerTag = import.meta.env.VITE_AMAZON_PARTNER_TAG || '';

    this.client = axios.create({
      baseURL: 'https://webservices.amazon.com',
      timeout: 10000,
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(this.addAuthenticationHeaders.bind(this));
  }

  private validateEnvironmentVariables(): void {
    const missingVars: string[] = [];

    // Only validate environment variables in production
    if (import.meta.env.PROD) {
      if (!import.meta.env.VITE_AMAZON_ACCESS_KEY) missingVars.push('VITE_AMAZON_ACCESS_KEY');
      if (!import.meta.env.VITE_AMAZON_SECRET_KEY) missingVars.push('VITE_AMAZON_SECRET_KEY');
      if (!import.meta.env.VITE_AMAZON_PARTNER_TAG) missingVars.push('VITE_AMAZON_PARTNER_TAG');

      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }
    } else {
      // In development, log a warning but don't throw an error
      console.warn('Running in development mode. Amazon API keys not required.');
    }
  }

  private generateSignature(stringToSign: string, date: string): string {
    const dateKey = crypto.createHmac('sha256', 'AWS4' + this.secretKey)
      .update(date).digest();
    const dateRegionKey = crypto.createHmac('sha256', dateKey)
      .update(this.region).digest();
    const dateRegionServiceKey = crypto.createHmac('sha256', dateRegionKey)
      .update(this.service).digest();
    const signingKey = crypto.createHmac('sha256', dateRegionServiceKey)
      .update('aws4_request').digest();
    
    return crypto.createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex');
  }

  private addAuthenticationHeaders(config: AxiosRequestConfig) {
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const date = timestamp.slice(0, 8);

    const canonicalRequest = [
      'POST',
      '/paapi5/searchitems',
      '',
      'content-type:application/json',
      `host:${new URL(config.baseURL).host}`,
      `x-amz-date:${timestamp}`,
      '',
      'content-type;host;x-amz-date',
      crypto.createHash('sha256').update(JSON.stringify(config.data) || '').digest('hex')
    ].join('\n');

    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timestamp,
      `${date}/${this.region}/${this.service}/aws4_request`,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    const signature = this.generateSignature(stringToSign, date);

    const authHeader = [
      `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${date}/${this.region}/${this.service}/aws4_request`,
      `SignedHeaders=content-type;host;x-amz-date`,
      `Signature=${signature}`
    ].join(', ');

    config.headers = {
      ...config.headers,
      'X-Amz-Date': timestamp,
      'Authorization': authHeader
    };

    return config;
  }

  private generateMockProducts(params: ProductSearchParams): ProductResult[] {
    const mockProducts: ProductResult[] = [
      {
        asin: 'B08N5KWB9V',
        title: 'Mock Wireless Earbuds',
        price: 79.99,
        imageUrl: 'https://example.com/mock-earbuds.jpg',
        productUrl: 'https://example.com/product/mock-earbuds'
      },
      {
        asin: 'A01B2C3D4E',
        title: 'Mock Smart Watch',
        price: 199.99,
        imageUrl: 'https://example.com/mock-smartwatch.jpg',
        productUrl: 'https://example.com/product/mock-smartwatch'
      },
      {
        asin: 'X09Y8Z7W6V',
        title: 'Mock Portable Speaker',
        price: 129.99,
        imageUrl: 'https://example.com/mock-speaker.jpg',
        productUrl: 'https://example.com/product/mock-speaker'
      }
    ];

    // Filter mock products based on keywords if provided
    return params.keywords 
      ? mockProducts.filter(product => 
          product.title.toLowerCase().includes(params.keywords?.toLowerCase() || '')
        )
      : mockProducts;
  }

  async searchProducts(params: ProductSearchParams): Promise<ProductResult[]> {
    // Check if API keys are available
    if (!this.accessKey || !this.secretKey || !this.partnerTag) {
      console.warn('Amazon API keys not found. Using mock product data.');
      return this.generateMockProducts(params);
    }

    try {
      const response = await this.client.post<AmazonApiResponse>('/paapi5/searchitems', {
        Keywords: params.keywords,
        SearchIndex: params.category || 'All',
        ItemPage: params.page || 1,
        ItemCount: params.itemsPerPage || 10,
        PartnerTag: this.partnerTag,
        PartnerType: 'Associates',
        Resources: [
          'Images.Primary.Large',
          'ItemInfo.Title',
          'Offers.Listings.Price'
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Amazon-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems'
        }
      });

      return this.transformResponse(response.data);
    } catch (error) {
      // If API call fails, fall back to mock data
      console.error('Amazon API search failed:', error);
      return this.generateMockProducts(params);
    }
  }

  private transformResponse(data: AmazonApiResponse): ProductResult[] {
    return data.SearchResult.Items.map(item => ({
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || 'No Title',
      price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
      imageUrl: item.Images?.Primary?.Large?.URL || '',
      productUrl: item.DetailPageURL || ''
    }));
  }

  private handleError(error: AxiosError): never {
    if (error.response) {
      console.error('Amazon API Error Response:', {
        status: error.response.status,
        data: error.response.data
      });
      throw new Error(`Amazon API Error: ${error.response.status}`);
    }
    if (error.request) {
      console.error('Amazon API Request Error:', error.request);
      throw new Error('Failed to reach Amazon API');
    }
    console.error('Amazon API Setup Error:', error.message);
    throw new Error('Amazon API Setup Error');
  }
}

// Export a singleton instance
export const amazonProductService = new AmazonProductService();
