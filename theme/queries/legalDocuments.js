export const LEGAL_DATA = `
query applicationContent {
  applicationContent {
    legalInformation {
      id
      application
      created_at
      policy
      returns
      shipping
      tnc
      updated_at
    }
    tags
  }
}

`;
