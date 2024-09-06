export const COLLECTIONS = `query collections($pageNo: Int,$pageSize: Int) {
    collections(pageNo: $pageNo, pageSize: $pageSize) {
      items {
        uid
        type
        name
        published
        description
        is_active
        slug
        allow_facets
        allow_sort
        sortOn
        priority
        schedule {
          start
          end
          next_schedule {
            start
            end
          }
        }
        seo {
          description
          image {
            url
          }
          title
        }
        badge {
          text
          color
        }
        visible_facets_keys
        tags
        logo {
          type
          url
        }
        banners {
          landscape {
            alt
            meta {
              source
            }
            type
            url
          }
          portrait {
            alt
            type
            url
          }
        }
        query {
          attribute
          op
          value
        }
      }
      page {
        current
        next_id
        has_previous
        has_next
        item_total
        type
        size
      }
    }
  }`;

export const COLLECTION = `query collection(
  $slug: String!
) {
  collection(slug: $slug) {
    uid
    type
    name
    published
    description
    is_active
    slug
    sortOn
  }
}
`;

export const COLLECTION_ITEMS = `query collectionItems(
  $slug: String!
  $search: String
  $filters: Boolean
  $first: Int
  $after: String
  $pageNo: Int
  $pageType: String
  $query: String
  $sortOn: Sort_on
) {
  collectionItems(
    slug: $slug
    search: $search
    filters: $filters
    first: $first
    after: $after
    pageNo: $pageNo
    pageType: $pageType
    query: $query
    sortOn: $sortOn
  ) {
    filters {
      key {
        display
        kind
        logo
        name
      }
      values {
        count
        currency_code
        currency_symbol
        display
        display_format
        is_selected
        max
        min
        query_format
        selected_max
        selected_min
        value
      }
    }
    items {
      item_code
      item_type
      has_variant
      uid
      discount
      image_nature
      is_dependent
      name
      product_group_tag
      rating
      rating_count
      slug
      tags
      teaser_tag
      type
      sellable
      no_of_boxes
      promo_meta
      brand {
        name
        uid
        slug
      }
      media {
        alt
        type
        url
      }
      price {
        effective {
          currency_code
          currency_symbol
          max
          min
        }
        marked {
          currency_code
          currency_symbol
          max
          min
        }
      }
    }
    page {
      current
      next_id
      has_previous
      has_next
      item_total
      type
      size
    }
    sort_on {
      display
      is_selected
      logo
      name
      value
    }
  }
}
`;

export const FEATURED_COLLECTION = `query Collection($slug: String!, $first:Int, $pageNo: Int) {
  collection(slug: $slug) {
    uid
    name
    is_active
    description
    slug
    logo {
      type
      url
    }
    banners {
      portrait {
        alt
        type
        url
      }
    }
    products(first: $first, pageNo: $pageNo) {
      items {
        uid
        slug
        media {
          alt
          type
          url
        }
        teaser_tag
        sellable
        discount
        name
        price {
          effective {
            currency_code
            currency_symbol
            max
            min
          }
          marked {
            currency_code
            currency_symbol
            max
            min
          }
        }
      }
    }
  }
}
`;
