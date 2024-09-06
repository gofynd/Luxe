import * as ApplicationBannerSection from './application-banner.jsx';
import * as BrandListingSection from './brand-listing.jsx';
import * as CategoriesListingSection from './categories-listing.jsx';
import * as CollectionsListingSection from './collections-listing.jsx';
import * as FeaturedCollectionSection from './featured-collection.jsx';
import * as FeaturedProductsSection from './featured-products.jsx';
import * as HeroImageSection from './hero-image.jsx';
import * as HeroVideoSection from './hero-video.jsx';
import * as ImageGallerySection from './image-gallery.section.jsx';
import * as ImageSlideshowSection from './image-slideshow.jsx';
import * as LinkSection from './link.section.jsx';
import * as MediaWithTextSection from './media-with-text.jsx';
import * as RawHtmlSection from './raw-html.section.jsx';
import * as TestimonialsSection from './testimonials.section.jsx';
import * as TrustMarkerSection from './trust-marker.jsx';

export default {
            'application-banner': { ...ApplicationBannerSection, },
            'brand-listing': { ...BrandListingSection, },
            'categories-listing': { ...CategoriesListingSection, },
            'collections-listing': { ...CollectionsListingSection, },
            'featured-collection': { ...FeaturedCollectionSection, },
            'featured-products': { ...FeaturedProductsSection, },
            'hero-image': { ...HeroImageSection, },
            'hero-video': { ...HeroVideoSection, },
            'image-gallery': { ...ImageGallerySection, },
            'image-slideshow': { ...ImageSlideshowSection, },
            'link': { ...LinkSection, },
            'media-with-text': { ...MediaWithTextSection, },
            'raw-html': { ...RawHtmlSection, },
            'testimonials': { ...TestimonialsSection, },
            'trust-marker': { ...TrustMarkerSection, },
        }