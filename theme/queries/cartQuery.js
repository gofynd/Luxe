export const CART_DETAILS = `query Cart($areaCode: String, $assignCardId: Int, $includeBreakup: Boolean, $buyNow: Boolean, $includeAllItems: Boolean, $includeCodCharges: Boolean, $cartId: String) {
  cart(areaCode: $areaCode, assignCardId: $assignCardId, includeBreakup: $includeBreakup, buyNow: $buyNow, includeAllItems: $includeAllItems, includeCodCharges: $includeCodCharges, id: $cartId) {
    buy_now
    cart_id
    checkout_mode
    comment
    coupon_text
    delivery_charge_info
    gstin
    id
    is_valid
    message
    restrict_checkout
    user_cart_items_count
    uid
    items {
      bulk_offer
      coupon_message
      custom_order
      discount
      is_set
      key
      message
      moq
      parent_item_identifiers
      product_ean_id
      quantity
      availability {
        deliverable
        is_valid
        other_store_quantity
        out_of_stock
        sizes
        available_sizes {
          display
          is_available
          value
        }
      }
      article {
        _custom_json
        cart_item_meta
        extra_meta
        gift_card
        identifier
        is_gift_visible
        meta
        mto_quantity
        parent_item_identifiers
        product_group_tags
        quantity
        seller_identifier
        size
        tags
        uid
        seller {
          name
          uid
        }
        price {
          base {
            currency_code
            currency_symbol
            effective
            marked
          }
          converted {
            currency_code
            currency_symbol
            effective
            marked
          }
        }
      }
      price_per_unit {
        base {
          currency_code
          currency_symbol
          effective
          marked
          selling_price
        }
        converted {
          currency_code
          currency_symbol
          effective
          marked
          selling_price
        }
      }
      product {
        _custom_json
        attributes
        item_code
        name
        slug
        tags
        type
        uid
        brand {
          name
          uid
        }
        action {
          type
          url
        }
        categories {
          name
          uid
        }
        images {
          aspect_ratio
          secure_url
          url
        }
      }
      promo_meta {
        message
      }
      promotions_applied {
        amount
        article_quantity
        code
        meta
        mrp_promotion
        offer_text
        promo_id
        promotion_group
        promotion_name
        promotion_type
        applied_free_articles {
          article_id
          parent_item_identifier
          quantity
          free_gift_item_details {
              item_brand_name
              item_id
              item_images_url
              item_name
              item_price_details {
                currency
                marked {
                    min
                    max
                }
                effective {
                    min
                    max
                }
              }
              item_slug
          }
      }
        discount_rules {
          item_criteria
          matched_buy_rules
          offer
          raw_offer
        }
      }
      charges {
        meta
        name
        allow_refund
        code
        type
        amount {
          currency
          value
        }
      }
      coupon {
        code
        discount_single_quantity
        discount_total_quantity
      }
      identifiers {
        identifier
      }
      price {
        base {
          currency_code
          currency_symbol
          effective
          marked
        }
        converted {
          currency_code
          currency_symbol
          effective
          marked
        }
      }
      delivery_promise {
        formatted {
          max
          min
        }
        timestamp {
          max
          min
        }
        iso {
          max
          min
        }
      }
    }
    breakup_values {
      coupon {
        code
        coupon_type
        coupon_value
        description
        is_applied
        message
        minimum_cart_value
        sub_title
        title
        type
        uid
        value
      }
      display {
        currency_code
        currency_symbol
        display
        key
        message
        value
        preset
      }
      loyalty_points {
        applicable
        description
        is_applied
        total
      }
      raw {
        cod_charge
        convenience_fee
        coupon
        delivery_charge
        discount
        fynd_cash
        gift_card
        gst_charges
        mop_total
        mrp_total
        subtotal
        total
        vog
        you_saved
        total_charge
      }
    }
    coupon {
      cashback_amount
      cashback_message_primary
      cashback_message_secondary
      coupon_code
      coupon_description
      coupon_id
      coupon_subtitle
      coupon_title
      coupon_type
      coupon_value
      discount
      is_applied
      is_valid
      message
      minimum_cart_value
    }
    delivery_promise {
      formatted {
        max
        min
      }
      timestamp {
        max
        min
      }
      iso {
        max
        min
      }
    }
    applied_promo_details {
      amount
      article_quantity
      code
      meta
      mrp_promotion
      offer_text
      promo_id
      promotion_group
      promotion_name
      promotion_type
    }
    currency {
      code
      symbol
    }
    success
  }

  coupons {
    available_coupon_list {
      coupon_amount
      coupon_applicable_message
      coupon_code
      coupon_type
      coupon_value
      description
      end_date
      expires_on
      is_applicable
      is_applied
      is_bank_offer
      max_discount_value
      message
      minimum_cart_value
      offer_text
      start_date
      sub_title
      title
    }
    page {
      current
      has_next
      has_previous
      total
      total_item_count
    }
  }
}
`;

export const CART_UPDATE = `mutation UpdateCart($areaCode: String, $b: Boolean, $buyNow: Boolean, $i: Boolean, $updateCartId: String, $updateCartRequestInput: UpdateCartRequestInput, $cartType: String) {
  updateCart(areaCode: $areaCode, b: $b, buyNow: $buyNow, i: $i, id: $updateCartId, updateCartRequestInput: $updateCartRequestInput, cartType: $cartType) {
      message
      success
      cart {
        buy_now
        cart_id
        checkout_mode
        comment
        coupon_text
        delivery_charge_info
        gstin
        id
        is_valid
        last_modified
        message
        pan_config
        pan_no
        restrict_checkout
        uid
        breakup_values {
          coupon {
            code
            coupon_type
            coupon_value
            description
            is_applied
            message
            minimum_cart_value
            sub_title
            title
            type
            uid
            value
          }
          display {
            currency_code
            currency_symbol
            display
            key
            message
            value
            preset
          }
          loyalty_points {
            applicable
            description
            is_applied
            total
          }
        }
        delivery_promise {
          formatted {
            max
            min
          }
          timestamp {
            max
            min
          }
        }
        coupon {
          cashback_amount
          cashback_message_primary
          cashback_message_secondary
          coupon_code
          coupon_description
          coupon_id
          coupon_subtitle
          coupon_title
          coupon_type
          coupon_value
          discount
          is_applied
          is_valid
          message
          minimum_cart_value
        }
        applied_promo_details {
          amount
          article_quantity
          code
          meta
          mrp_promotion
          offer_text
          promo_id
          promotion_group
          promotion_name
          promotion_type
         applied_free_articles {
              article_id
              parent_item_identifier
              quantity
              free_gift_item_details {
                  item_brand_name
                  item_id
                  item_images_url
                  item_name
                  item_price_details {
                    currency
                    marked {
                        min
                        max
                    }
                    effective {
                        min
                        max
                    }
                  }
                  item_slug
              }
          }
        }
        currency {
          code
          symbol
        }
        items {
          bulk_offer
          coupon_message
          custom_order
          discount
          is_set
          key
          message
          moq
          parent_item_identifiers
          product_ean_id
          quantity
          article {
            _custom_json
            cart_item_meta
            extra_meta
            gift_card
            identifier
            is_gift_visible
            meta
            mto_quantity
            parent_item_identifiers
            product_group_tags
            quantity
            seller_identifier
            size
            tags
            type
            uid
            seller {
              name
              uid
            }
            price {
              base {
                currency_code
                currency_symbol
                effective
                marked
              }
              converted {
                currency_code
                currency_symbol
                effective
                marked
              }
            }
          }
          coupon {
            code
            discount_single_quantity
            discount_total_quantity
          }
          charges {
            meta
            name
            allow_refund
            code
            type
            amount {
              currency
              value
            }
          }
          identifiers {
            identifier
          }
          delivery_promise {
            formatted {
              max
              min
            }
            timestamp {
              max
              min
            }
            iso {
              max
              min
            }
          }
          availability {
            deliverable
            is_valid
            other_store_quantity
            out_of_stock
            sizes
            available_sizes {
              display
              is_available
              value
            }
          }
          price {
            base {
              currency_code
              currency_symbol
              effective
              marked
            }
            converted {
              currency_code
              currency_symbol
              effective
              marked
            }
          }
          price_per_unit {
            base {
              currency_code
              currency_symbol
              effective
              marked
              selling_price
            }
          }
          product {
            _custom_json
            attributes
            item_code
            name
            slug
            tags
            type
            uid
            action {
              type
              url
              query {
                product_slug
              }
            }
            brand {
              name
              uid
            }
            categories {
              name
              uid
            }
            images {
              aspect_ratio
              secure_url
              url
            }
          }
          promo_meta {
            message
          }
        }
      }
  }
}`;

export const APPLY_COUPON = `mutation ApplyCoupon($buyNow: Boolean, $applyCouponRequestInput: ApplyCouponRequestInput, $b: Boolean, $i: Boolean, $applyCouponId: String, $p: Boolean, $cartType: String) {
  applyCoupon(applyCouponRequestInput: $applyCouponRequestInput, b: $b, i: $i, id: $applyCouponId, p: $p, buyNow: $buyNow, cartType: $cartType) {
    buy_now
    cart_id
    checkout_mode
    comment
    coupon_text
    delivery_charge_info
    gstin
    id
    is_valid
    last_modified
    message
    notification
    pan_config
    pan_no
    restrict_checkout
    staff_user_id
    success
    uid
    applied_promo_details {
      amount
      article_quantity
      code
      meta
      mrp_promotion
      offer_text
      promo_id
      promotion_group
      promotion_name
      promotion_type
      applied_free_articles {
          article_id
          parent_item_identifier
          quantity
          free_gift_item_details {
              item_brand_name
              item_id
              item_images_url
              item_name
              item_price_details {
                currency
                marked {
                    min
                    max
                }
                effective {
                    min
                    max
                }
              }
              item_slug
          }
      }
    }
    breakup_values {
      coupon {
        code
        coupon_type
        coupon_value
        description
        is_applied
        message
        minimum_cart_value
        sub_title
        title
        type
        uid
        value
      }
      display {
        currency_code
        currency_symbol
        display
        key
        message
        value
        preset
      }
      loyalty_points {
        applicable
        description
        is_applied
        total
      }
    }
    coupon {
      cashback_amount
      cashback_message_primary
      cashback_message_secondary
      coupon_code
      coupon_description
      coupon_id
      coupon_subtitle
      coupon_title
      coupon_type
      coupon_value
      discount
      is_applied
      is_valid
      message
      minimum_cart_value
    }
    currency {
      code
      symbol
    }
    delivery_promise {
      timestamp {
        max
        min
      }
      formatted {
        max
        min
      }
      iso {
        max
        min
      }
    }
    items {
      bulk_offer
      coupon_message
      custom_order
      discount
      is_set
      key
      message
      moq
      parent_item_identifiers
      product_ean_id
      quantity
      article {
        _custom_json
        cart_item_meta
        extra_meta
        gift_card
        identifier
        is_gift_visible
        meta
        mto_quantity
        parent_item_identifiers
        product_group_tags
        quantity
        seller_identifier
        size
        tags
        type
        uid
        price {
          base {
            currency_code
            currency_symbol
            effective
            marked
          }
          converted {
            currency_code
            currency_symbol
            effective
            marked
          }
        }
        seller {
          name
          uid
        }
        store {
          name
          store_code
          uid
        }
      }
      availability {
        deliverable
        is_valid
        other_store_quantity
        out_of_stock
        sizes
        available_sizes {
          display
          is_available
          value
        }
      }
      charges {
        meta
        name
        allow_refund
        code
        type
        amount {
          currency
          value
        }
      }
      coupon {
        code
        discount_single_quantity
        discount_total_quantity
      }
      delivery_promise {
        formatted {
          max
          min
        }
        timestamp {
          max
          min
        }
        iso {
          max
          min
        }
      }
      identifiers {
        identifier
      }
      price {
        base {
          currency_code
          currency_symbol
          effective
          marked
        }
        converted {
          currency_code
          currency_symbol
          effective
          marked
        }
      }
      price_per_unit {
        base {
          currency_code
          currency_symbol
          effective
          marked
          selling_price
        }
        converted {
          currency_code
          currency_symbol
          effective
          marked
          selling_price
        }
      }
      product {
        _custom_json
        attributes
        item_code
        name
        slug
        tags
        type
        uid
        action {
          query {
            product_slug
          }
          type
          url
        }
        brand {
          name
          uid
        }
        categories {
          name
          uid
        }
        images {
          aspect_ratio
          secure_url
          url
        }
      }
      promo_meta {
        message
      }
    }
  }
}`;

export const REMOVE_COUPON = `mutation RemoveCoupon($buyNow: Boolean, $removeCouponId: String) {
  removeCoupon(buyNow: $buyNow, id: $removeCouponId) {
    buy_now
    cart_id
    checkout_mode
    comment
    coupon_text
    delivery_charge_info
    gstin
    id
    is_valid
    last_modified
    message
    notification
    pan_config
    pan_no
    restrict_checkout
    staff_user_id
    success
    uid
    applied_promo_details {
      amount
      article_quantity
      code
      meta
      mrp_promotion
      offer_text
      promo_id
      promotion_group
      promotion_name
      promotion_type
    }
    breakup_values {
      coupon {
        code
        coupon_type
        coupon_value
        description
        is_applied
        message
        minimum_cart_value
        sub_title
        title
        type
        uid
        value
      }
      display {
        currency_code
        currency_symbol
        display
        key
        message
        value
        preset
      }
      loyalty_points {
        applicable
        description
        is_applied
        total
      }
      raw {
        cod_charge
        convenience_fee
        coupon
        delivery_charge
        discount
        fynd_cash
        gift_card
        gst_charges
        mop_total
        mrp_total
        subtotal
        total
        vog
        you_saved
        total_charge
      }
    }
    coupon {
      cashback_amount
      cashback_message_primary
      cashback_message_secondary
      coupon_code
      coupon_description
      coupon_id
      coupon_subtitle
      coupon_title
      coupon_type
      coupon_value
      discount
      is_applied
      is_valid
      message
      minimum_cart_value
    }
    currency {
      code
      symbol
    }
    delivery_promise {
      formatted {
        max
        min
      }
      timestamp {
        max
        min
      }
      iso {
        max
        min
      }
    }
    items {
      bulk_offer
      coupon_message
      custom_order
      discount
      is_set
      key
      message
      moq
      parent_item_identifiers
      product_ean_id
      quantity
      article {
        _custom_json
        cart_item_meta
        extra_meta
        gift_card
        identifier
        is_gift_visible
        meta
        mto_quantity
        parent_item_identifiers
        product_group_tags
        quantity
        seller_identifier
        size
        tags
        type
        uid
        price {
          base {
            currency_code
            currency_symbol
            effective
            marked
          }
          converted {
            currency_code
            currency_symbol
            effective
            marked
          }
        }
        seller {
          name
          uid
        }
        store {
          name
          store_code
          uid
        }
      }
      availability {
        deliverable
        is_valid
        other_store_quantity
        out_of_stock
        sizes
        available_sizes {
          display
          is_available
          value
        }
      }
      charges {
        meta
        name
        allow_refund
        code
        type
        amount {
          currency
          value
        }
      }
      coupon {
        code
        discount_single_quantity
        discount_total_quantity
      }
      delivery_promise {
        formatted {
          max
          min
        }
        timestamp {
          max
          min
        }
        iso {
          max
          min
        }
      }
      identifiers {
        identifier
      }
      price {
        base {
          currency_code
          currency_symbol
          effective
          marked
        }
        converted {
          currency_code
          currency_symbol
          effective
          marked
        }
      }
      price_per_unit {
        base {
          currency_code
          currency_symbol
          effective
          marked
          selling_price
        }
        converted {
          currency_code
          currency_symbol
          effective
          marked
          selling_price
        }
      }
      product {
        _custom_json
        attributes
        item_code
        name
        slug
        tags
        type
        uid
        action {
          type
          url
          query {
            product_slug
          }
        }
        brand {
          name
          uid
        }
        categories {
          name
          uid
        }
        images {
          aspect_ratio
          secure_url
          url
        }
      }
      promo_meta {
        message
      }
    }
  }
}`;

export const CART_META_UPDATE = `mutation UpdateCartMeta($buyNow: Boolean, $updateCartMetaId: String, $cartMetaRequestInput: CartMetaRequestInput) {
  updateCartMeta(buyNow: $buyNow, id: $updateCartMetaId, cartMetaRequestInput: $cartMetaRequestInput) {
    is_valid
    message
  }
}`;

export const GET_CART_SHARE_LINK = `mutation getCartShareLink($getShareCartLinkRequestInput: GetShareCartLinkRequestInput) {
  getCartShareLink(getShareCartLinkRequestInput: $getShareCartLinkRequestInput) {
    share_url
    token
  }
}`;

export const GET_URL_QR_CODE = `mutation getUrlQRCode($url: String!) {
  getUrlQRCode(url: $url) {
    link
    svg
  }
}`;
