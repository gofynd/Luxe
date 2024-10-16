export const PLP_PRODUCTS = `query products(
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
    sort_on {
      display
      is_selected
      logo
      name
      value
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
    items {
        brand {
            name
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
        media {
            alt
            type
            url
        }
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
        slug
        uid
        sellable
        teaser_tag
        discount
        name
    }
  }
}
`;
