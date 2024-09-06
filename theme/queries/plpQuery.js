export const PRODUCTS = `query products(
  $search: String
  $filterQuery: String
  $enableFilter: Boolean
  $sortOn: String
  $first: Int
  $pageNo: Int
  $after: String
  $pageType: String
) {
  products(
    search: $search
    filterQuery: $filterQuery
    enableFilter: $enableFilter
    sortOn: $sortOn
    first: $first
    pageNo: $pageNo
    after: $after
    pageType: $pageType
  ) {
    filters
    sortOn
    page {
      current
      next_id
      has_previous
      has_next
      item_total
      type
      size
    }
    items {
      brand {
        custom_config
        banners {
          landscape {
            alt
            type
            url
          }
          portrait {
            alt
            type
            url
          }
        }
        description
        logo {
          alt
          type
          url
        }
        name
        uid
        departments
        discount
        slug
      }
      color
      item_code
      item_type
      has_variant
      uid
      grouped_attributes {
        title
        details {
          key
          type
          value
        }
      }
      attributes
      custom_config
      media {
        alt
        meta {
          source
        }
        type
        url
      }
      sizes {
        slug
        discount
        multi_size
        sellable
        size_chart {
          description
          headers {
            col_1 {
              convertable
              value
            }
            col_2 {
              convertable
              value
            }
            col_3 {
              convertable
              value
            }
            col_4 {
              convertable
              value
            }
            col_5 {
              convertable
              value
            }
            col_6 {
              convertable
              value
            }
          }
          image
          size_tip
          sizes {
            col_1
            col_2
            col_3
            col_4
            col_5
            col_6
          }
          title
          unit
        }
        size_details {
          dimension {
            height
            is_default
            length
            unit
            width
          }
          display
          is_available
          quantity
          seller_identifiers
          value
          weight {
            is_default
            shipping
            unit
          }
        }
        stores {
          count
        }
      }
      custom_order {
        is_custom_order
        manufacturing_time
        manufacturing_time_unit
      }
      custom_meta {
        key
        value
      }
      description
      discount
      highlights
      image_nature
      is_dependent
      moq {
        increment_unit
        maximum
        minimum
      }
      name
      net_quantity {
        unit
        value
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
      product_group_tag
      product_online_date
      rating
      rating_count
      seo {
        description
        title
      }
      short_description
      similars
      slug
      tags
      teaser_tag
      tryouts
      type
      variants {
        display_type
        header
        items {
          _custom_meta {
            key
            value
          }
          color
          color_name
          is_available
          medias {
            alt
            type
            url
          }
          name
          slug
          uid
          value
        }
        key
        total
      }
      action {
        page {
          params
          query
          type
          url
        }
        type
      }
      categories {
        description
        name
        uid
      }
      category_map {
        l1 {
          description
          name
          uid
        }
        l2 {
          description
          name
          uid
        }
        l3 {
          description
          name
          uid
        }
      }
      sellable
    }
    message
  }
}
`;
