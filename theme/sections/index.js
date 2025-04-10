import loadable from '@loadable/component';
import React from "react";

const ApplicationBannerSectionChunk = loadable(() => import(/* webpackChunkName:"ApplicationBannerSectionChunk" */ './application-banner.jsx'));

const BrandListingSectionChunk = loadable(() => import(/* webpackChunkName:"BrandListingSectionChunk" */ './brand-listing.jsx'));

const CartLandingSectionChunk = loadable(() => import(/* webpackChunkName:"CartLandingSectionChunk" */ './cart-landing.jsx'));

const CategoriesListingSectionChunk = loadable(() => import(/* webpackChunkName:"CategoriesListingSectionChunk" */ './categories-listing.jsx'));

const CollectionsListingSectionChunk = loadable(() => import(/* webpackChunkName:"CollectionsListingSectionChunk" */ './collections-listing.jsx'));

const FeatureBlogSectionChunk = loadable(() => import(/* webpackChunkName:"FeatureBlogSectionChunk" */ './feature-blog.jsx'));

const FeaturedCollectionSectionChunk = loadable(() => import(/* webpackChunkName:"FeaturedCollectionSectionChunk" */ './featured-collection.jsx'));

const FeaturedProductsSectionChunk = loadable(() => import(/* webpackChunkName:"FeaturedProductsSectionChunk" */ './featured-products.jsx'));

const HeroImageSectionChunk = loadable(() => import(/* webpackChunkName:"HeroImageSectionChunk" */ './hero-image.jsx'));

const HeroVideoSectionChunk = loadable(() => import(/* webpackChunkName:"HeroVideoSectionChunk" */ './hero-video.jsx'));

const ImageGallerySectionChunk = loadable(() => import(/* webpackChunkName:"ImageGallerySectionChunk" */ './image-gallery.jsx'));

const ImageSlideshowSectionChunk = loadable(() => import(/* webpackChunkName:"ImageSlideshowSectionChunk" */ './image-slideshow.jsx'));

const LinkSectionChunk = loadable(() => import(/* webpackChunkName:"LinkSectionChunk" */ './link.jsx'));

const MediaWithTextSectionChunk = loadable(() => import(/* webpackChunkName:"MediaWithTextSectionChunk" */ './media-with-text.jsx'));

const MultiCollectionProductListSectionChunk = loadable(() => import(/* webpackChunkName:"MultiCollectionProductListSectionChunk" */ './multi-collection-product-list.jsx'));

const OrderDetailsSectionChunk = loadable(() => import(/* webpackChunkName:"OrderDetailsSectionChunk" */ './order-details.jsx'));

const ProductDescriptionSectionChunk = loadable(() => import(/* webpackChunkName:"ProductDescriptionSectionChunk" */ './product-description.jsx'));

const RawHtmlSectionChunk = loadable(() => import(/* webpackChunkName:"RawHtmlSectionChunk" */ './raw-html.jsx'));

const TestimonialsSectionChunk = loadable(() => import(/* webpackChunkName:"TestimonialsSectionChunk" */ './testimonials.jsx'));

const TrustMarkerSectionChunk = loadable(() => import(/* webpackChunkName:"TrustMarkerSectionChunk" */ './trust-marker.jsx'));


const getbundle = (type) => {
        switch(type) {
            case 'application-banner':
            return (props) => <ApplicationBannerSectionChunk {...props}/>;
        case 'brand-listing':
            return (props) => <BrandListingSectionChunk {...props}/>;
        case 'cart-landing':
            return (props) => <CartLandingSectionChunk {...props}/>;
        case 'categories-listing':
            return (props) => <CategoriesListingSectionChunk {...props}/>;
        case 'collections-listing':
            return (props) => <CollectionsListingSectionChunk {...props}/>;
        case 'feature-blog':
            return (props) => <FeatureBlogSectionChunk {...props}/>;
        case 'featured-collection':
            return (props) => <FeaturedCollectionSectionChunk {...props}/>;
        case 'featured-products':
            return (props) => <FeaturedProductsSectionChunk {...props}/>;
        case 'hero-image':
            return (props) => <HeroImageSectionChunk {...props}/>;
        case 'hero-video':
            return (props) => <HeroVideoSectionChunk {...props}/>;
        case 'image-gallery':
            return (props) => <ImageGallerySectionChunk {...props}/>;
        case 'image-slideshow':
            return (props) => <ImageSlideshowSectionChunk {...props}/>;
        case 'link':
            return (props) => <LinkSectionChunk {...props}/>;
        case 'media-with-text':
            return (props) => <MediaWithTextSectionChunk {...props}/>;
        case 'multi-collection-product-list':
            return (props) => <MultiCollectionProductListSectionChunk {...props}/>;
        case 'order-details':
            return (props) => <OrderDetailsSectionChunk {...props}/>;
        case 'product-description':
            return (props) => <ProductDescriptionSectionChunk {...props}/>;
        case 'raw-html':
            return (props) => <RawHtmlSectionChunk {...props}/>;
        case 'testimonials':
            return (props) => <TestimonialsSectionChunk {...props}/>;
        case 'trust-marker':
            return (props) => <TrustMarkerSectionChunk {...props}/>;
            default:
                return null;
        }
    };


export default {
            'application-banner': { ...ApplicationBannerSectionChunk, Component: getbundle('application-banner') },
        'brand-listing': { ...BrandListingSectionChunk, Component: getbundle('brand-listing') },
        'cart-landing': { ...CartLandingSectionChunk, Component: getbundle('cart-landing') },
        'categories-listing': { ...CategoriesListingSectionChunk, Component: getbundle('categories-listing') },
        'collections-listing': { ...CollectionsListingSectionChunk, Component: getbundle('collections-listing') },
        'feature-blog': { ...FeatureBlogSectionChunk, Component: getbundle('feature-blog') },
        'featured-collection': { ...FeaturedCollectionSectionChunk, Component: getbundle('featured-collection') },
        'featured-products': { ...FeaturedProductsSectionChunk, Component: getbundle('featured-products') },
        'hero-image': { ...HeroImageSectionChunk, Component: getbundle('hero-image') },
        'hero-video': { ...HeroVideoSectionChunk, Component: getbundle('hero-video') },
        'image-gallery': { ...ImageGallerySectionChunk, Component: getbundle('image-gallery') },
        'image-slideshow': { ...ImageSlideshowSectionChunk, Component: getbundle('image-slideshow') },
        'link': { ...LinkSectionChunk, Component: getbundle('link') },
        'media-with-text': { ...MediaWithTextSectionChunk, Component: getbundle('media-with-text') },
        'multi-collection-product-list': { ...MultiCollectionProductListSectionChunk, Component: getbundle('multi-collection-product-list') },
        'order-details': { ...OrderDetailsSectionChunk, Component: getbundle('order-details') },
        'product-description': { ...ProductDescriptionSectionChunk, Component: getbundle('product-description') },
        'raw-html': { ...RawHtmlSectionChunk, Component: getbundle('raw-html') },
        'testimonials': { ...TestimonialsSectionChunk, Component: getbundle('testimonials') },
        'trust-marker': { ...TrustMarkerSectionChunk, Component: getbundle('trust-marker') },
        };