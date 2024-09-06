export const USER_DATA_QUERY = `query User {
  user {
    loggedInUser {
      id
      account_type
      active
      application_id
      created_at
      dob
      first_name
      gender
      last_name
      meta
      profile_pic_url
      updated_at
      user_id
      username
      has_old_password_hash
      uid
      emails {
        active
        email
        primary
        verified
      }
      phone_numbers {
        active
        country_code
        phone
        primary
        verified
      }
    }
    activeSessions {
        sessions
    }
    hasPassword {
        result
    }
  }
  followedListing(
    collectionType: "products"
  ) {
    items {
      color
      item_code
      item_type
      has_variant
      uid
      attributes
      custom_config
      country_of_origin
      department
      description
      discount
      highlights
      image_nature
      is_dependent
      name
      product_group_tag
      product_online_date
      rating
      rating_count
      slug
      tags
      teaser_tag
      tryouts
      type
      sellable
      no_of_boxes
      promo_meta
      brand {
        custom_config
        description
        name
        uid
        departments
        discount
        slug
        action {
          type
        }
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
      variants {
        display_type
        group_id
        header
        key
        logo
        total
      }
      action {
        type
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

export const THEME_DATA = `query Theme($themeId: String!, $pageValue: String!){
  theme(themeId: $themeId) {
    themePageDetail(pageValue: $pageValue) {
      id
      path
      props
      sections {
        blocks
        label
        name
        predicate {
          route {
            exact_url
            query
            selected
          }
          screen {
            desktop
            mobile
            tablet
          }
          user {
            anonymous
            authenticated
          }
        }
        preset
        props
      }
      sections_meta {
        attributes
      }
      seo {
        description
        title
      }
      text
      theme
      type
      value
    }
  }
}`;

export const GLOBAL_DATA = `query ApplicationConfiguration {
  platformConfig {
    id
    active
    created_at
    delete_account_consent
    delete_account_day
    delete_account_reasons {
      reason_id
      reason_text
      show_text_area
    }
    desktop_image
    display
    flash_card {
      background_color
      text
      text_color
    }
    forgot_password
    login {
      otp
      password
    }
    look_and_feel {
      background_color
      card_position
    }
    meta {
      fynd_default
    }
    mobile_image
    name
    register
    register_required_fields {
      email {
        is_required
        level
      }
      mobile {
        is_required
        level
      }
    }
    required_fields {
      email {
        is_required
        level
      }
      mobile {
        is_required
        level
      }
    }
    session_config
    skip_captcha
    skip_login
    social {
      account_kit
      apple
      facebook
      google
    }
    social_tokens {
      account_kit {
        app_id
      }
      facebook {
        app_id
      }
      google {
        app_id
      }
    }
    subtext
    updated_at
  }
  applicationConfiguration {
    integrationTokens {
      id
      application
      created_at
      updated_at
      tokens {
        fynd_rewards {
          credentials {
            public_key
          }
        }
        google_map {
          credentials {
            api_key
          }
        }
      }
    }
    contactInfo {
      id
      address {
        address_line
        city
        country
        loc {
          coordinates
          type
        }
        phone {
          code
          number
        }
        pincode
      }
      business_highlights {
        id
        icon
        sub_title
        title
      }
      application
      support {
        email {
          key
          value
        }
        phone {
          code
          key
          number
        }
        timing
      }
      social_links {
        blog_link {
          icon
          link
          title
        }
        facebook {
          icon
          link
          title
        }
        google_plus {
          icon
          link
          title
        }
        instagram {
          icon
          link
          title
        }
        linked_in {
          icon
          link
          title
        }
        pinterest {
          icon
          link
          title
        }
        twitter {
          icon
          link
          title
        }
        vimeo {
          icon
          link
          title
        }
        youtube {
          icon
          link
          title
        }
      }
      links {
        link
        title
      }
      copyright_text
      created_at
      updated_at
      version
    }
    appDetails {
      id
      banner {
        secure_url
      }
      description
      domains {
        id
        is_predefined
        is_primary
        is_shortlink
        name
        verified
      }
      favicon {
        secure_url
      }
      logo {
        secure_url
      }
      mobile_logo {
        secure_url
      }
      name
      app_type
      auth {
        enabled
      }
      cache_ttl
      channel_type
      company_id
      cors {
        domains
      }
      is_active
      is_internal
      token
      website {
        basepath
        enabled
      }
    }
    features {
      id
      app
      landing_page {
        continue_as_guest
        launch_page {
          page_type
          params
          query
        }
        login_btn_text
        show_domain_textbox
        show_register_btn
      }
      product_detail {
        request_product
        seller_selection
        similar
        update_product_meta
      }
      cart {
        google_map
        gst_input
        placing_for_customer
        revenue_engine_coupon
        staff_selection
      }
    }
  }
  applicationContent {
    supportInformation {
      id
      application
      created
      created_at
      updated_at
      contact {
        email {
          active
          email {
            key
            value
          }
        }
        phone {
          active
          phone {
            code
            key
            number
            phone_type
          }
        }
      }
    }
    navigations {
      items {
        id
        archived
        name
        navigation {
          action {
            page {
              params
              query
              type
              url
            }
            type
          }
          active
          display
          image
          sort_order
          sub_navigation {
            active
            display
            image
            sort_order
            tags
            type
            action {
              page {
                params
                query
                type
                url
              }
              popup {
                params
                query
                type
                url
              }
              type
            }
            sub_navigation {
              acl
              active
              display
              image
              sort_order
              tags
              type
              action {
                page {
                  params
                  query
                  type
                  url
                }
                type
              }
            }
          }
          tags
          type
        }
        orientation {
          landscape
          portrait
        }
        platform
        slug
        version
      }
    }
  }
}`;
