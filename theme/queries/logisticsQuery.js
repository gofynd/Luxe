export const LOCALITY = `query locality(
  $locality: LocalityEnum!
  $localityValue: String!
) {
  locality(
    locality: $locality
    localityValue: $localityValue
  ) {
    display_name
    id
    name
    parent_ids
    type
    localities {
      id
      name
      display_name
      parent_ids
      type
    }
  }
}`;
