export const GET_REFUND_DETAILS = `query refund($orderId: String!) {
  refund {
    userBeneficiariesDetail(orderId: $orderId) {
        show_beneficiary_details
        beneficiaries {
            account_holder
            account_no
            address
            bank_name
            beneficiary_id
            branch_name
            comment
            created_on
            delights_user_name
            display_name
            email
            id
            ifsc_code
            is_active
            mobile
            modified_on
            subtitle
            title
            transfer_mode
        }
    }
  }
}`;

export const GET_ACTVE_REFUND_MODE = `query refund($orderId: String!) {
   refund { 
        userBeneficiariesDetail(orderId: $orderId) {
            show_beneficiary_details
            beneficiaries {
                account_holder
                account_no
                address
                bank_name
                beneficiary_id
                branch_name
                comment
                created_on
                delights_user_name
                display_name
                email
                id
                ifsc_code
                is_active
                mobile
                modified_on
                subtitle
                title
                transfer_mode
            }
        }
        activeRefundTransferModes {
            data {
                display_name
                items {
                    id
                    display_name
                    logo_large
                    logo_small
                    name
                }
            }
        }
    }
}`;

export const VERIFY_IFSC_CODE = `query Payment($ifscCode: String!) {
   payment { 
        verifyIFSCCode(ifscCode: $ifscCode) {
            bank_name
            branch_name
            success
            ADDRESS
            BANK
            BANKCODE
            BRANCH
            CENTRE
            CITY
            DISTRICT
            IFSC
            IMPS
            ISO3166
            MICR
            NEFT
            RTGS
            STATE
            UPI
        }
    }
}`;

export const ADD_BENEFICIARY_DETAILS = `mutation addBeneficiaryDetails(
  $addBeneficiaryDetailsRequestInput: AddBeneficiaryDetailsRequestInput
) {
  addBeneficiaryDetails(
    addBeneficiaryDetailsRequestInput: $addBeneficiaryDetailsRequestInput
  ) {
    data
    is_verified_flag
    message
    success
  }
}`;

export const VERIFY_OTP_FOR_WALLET = `mutation verifyOtpAndAddBeneficiaryForWallet(
  $walletOtpRequestInput: WalletOtpRequestInput
) {
  verifyOtpAndAddBeneficiaryForWallet(
    walletOtpRequestInput: $walletOtpRequestInput
  ) {
    is_verified_flag
    request_id
    success
  }
}`;

export const VERIFY_OTP_FOR_BANK = `mutation verifyOtpAndAddBeneficiaryForBank(
  $addBeneficiaryViaOtpVerificationRequestInput: AddBeneficiaryViaOtpVerificationRequestInput
) {
  verifyOtpAndAddBeneficiaryForBank(
    addBeneficiaryViaOtpVerificationRequestInput: $addBeneficiaryViaOtpVerificationRequestInput
  ) {
    message
    success
  }
}`;
