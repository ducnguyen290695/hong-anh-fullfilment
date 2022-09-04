import { gql } from '@apollo/client';

export const GET_ALL_CARTS = gql`
  query GetAllCarts {
    cart {
      all {
        id
      }
    }
  }
`;

export const GET_CART = gql`
  query GetCart($id: ID!) {
    cart {
      get(id: $id) {
        sellerID
        seller {
          id
          fullName
          telephone
          code
          address
          ward {
            name
          }
          district {
            name
          }
          city {
            name
          }
          debtLimit
          companyWallet {
            balance
          }
          companyWallet {
            balance
          }
        }
        exportedWarehouse {
          id
        }

        items {
          id
          product {
            id
            code
            name
            warranty
            vat
          }
          vat
          price
          quantity
          total
          maxDaysOfDebt
          inStock
        }
        subTotal
        totalProduct

        senderName
        senderPhone
        senderAddress

        allSenders {
          id
          fullName
          telephone
          address
          wardID
          districtID
          cityID
          ward {
            name
          }
          district {
            name
          }
          city {
            name
          }
          isDefault
        }

        shippingContact {
          id
          fullName
          telephone
          address
          ward {
            name
            id
          }
          district {
            name
          }
          city {
            name
          }
          wardID
          districtID
          cityID
        }

        note
        internalNote

        shippingType
        orderPriority
        shippingConfiguration {
          busConfig {
            busName
            busStation
            telephone
            location
            fee
          }
          deliver3PartyConfig {
            name
            weight
            length
            width
            height
            fee
            serviceCode
            customFeeEnabled
            customFee
            providerID
          }
          urbanConfig {
            fee
          }
        }
        promisedDeliverTime
        fullStockRequired

        paymentMethod

        vat
        vatAllOrder
        vatTaxIDNumber
        vatCompanyName
        vatEmail
        vatAddress

        shippingFee
        serviceFee
        total
        discountAmount
        sendingWard {
          id
          district {
            id
            cityID
          }
        }
      }
    }
  }
`;

export const GET_SENDER = gql`
  query GetSender {
    user {
      me {
        senderContacts {
          id
          fullName
          address
          ward {
            name
          }
          district {
            name
          }
          city {
            name
          }
          telephone
          isDefault
        }
      }
    }
  }
`;

export const GET_SHIPPING_PROVIDER = gql`
  query GetShippingProvider($input: GetShippingFeeInput) {
    shippingProvider {
      list {
        id
        name
        getServiceFee(input: $input) {
          totalFee
          code
          name
        }
      }
    }
  }
`;
