export const FETCH_ALL_COUNTRIES = `query AllCountries {
    allCountries {
        results {
            display_name
            is_active
            name
            parent_id
            sub_type
            type
            uid
            meta {
                country_code
                isd_code
            }
            logistics {
                dp {
                    fm_priority
                    lm_priority
                    rvp_priority
                    payment_mode
                    operations
                    area_code
                    assign_dp_from_sb
                    internal_account_id
                    external_account_id
                    transport_mode
                }
            }
        }
    }
}
`;

export const FETCH_ALL_CURRENCIES = `query Currencies {
    currencies {
        id
        code
        created_at
        decimal_digits
        is_active
        name
        symbol
        updated_at
    }
}
`;

export const FETCH_DEFAULT_CURRENCIES = `query ApplicationConfiguration {
    applicationConfiguration {
        app_currencies {
            application
            default_currency {
                code
                ref
            }
        }
    }
}`;

export const FETCH_COUNTRY_DETAILS = `query Country(
  $countryIsoCode: String!
) {
  country(countryIsoCode: $countryIsoCode) {
     display_name
        iso2
        iso3
        name
        phone_code
        timezones
        id
        latitude
        longitude
        type
        fields {
            serviceability_fields
            address {
                display_name
                edit
                error_text
                input
                required
                slug
                validation {
                    type
                    regex {
                        value
                    }
                }
            }
            address_template {
                checkout_form
            }
        }
        currency {
            code
            symbol
            name
        }
    }
}`;

export const FETCH_COUNTRIES = `query Countries {
    countries(pageSize: 200, pageNo: 1) {
        items {
            display_name
            iso2
            iso3
            name
            phone_code
            timezones
            id
            latitude
            longitude
            type
            currency {
                code
                symbol
                name
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
}
`;

export const FETCH_LOCALITIES = `query Localities (
  $locality: LocalityType!
  $pageNo: Int
  $pageSize: Int
  $country: String!
  $city:String!
){
    localities(
    locality: $locality, 
    pageNo: $pageNo
    pageSize: $pageSize
    country: $country
    city: $city) {
        items {
            display_name
            id
            name
            parent_ids
            type
            custom_meta
            parent_uid
            meta
            code
            localities {
                id
                name
                display_name
                parent_ids
                type
                custom_meta
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
}
`;
