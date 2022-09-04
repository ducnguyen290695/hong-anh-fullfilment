import { gql } from '@apollo/client';

export const GET_ORDERS_QUERY = gql`
  query GetOrders($filters: OrdersFilters!, $pagination: PaginationRequest!, $sort: [OrderSort!]) {
    order {
      pagination(filters: $filters, sort: $sort, pagination: $pagination) {
        paginationData {
          total
          offset
          limit
        }
        orders {
          id
          createdAt
          number
          subTotal
          exportedWarehouse {
            name
          }
          receiverContactName
          receiverContactAddress
          orderPriority
          shippingType
          paymentMethod
          status
          createdBy {
            email
          }
          fullStockRequired
          remainingDeliverTime
          vat
          promisedDeliverTime
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
            }
            urbanConfig {
              fee
            }
          }
          internalNote
          stockStatus
          completedAt
          fileURLs
          senderAddress
          shipperTelephone
          receiverContactPhone
        }
      }
    }
  }
`;

export const GET_WAREHOUSES = gql`
  query {
    warehouse {
      list {
        warehouses {
          name
          id
        }
      }
    }
  }
`;

export const GET_WAREHOUSES_WITH_IDS = gql`
  query GetWarehouseWithIds($request: WarehouseRequest) {
    warehouse {
      list(request: $request) {
        warehouses {
          name
          id
        }
      }
    }
  }
`;

export const GET_CREATED_BY = gql`
  query GetCreatedBy($pagination: PaginationRequest) {
    user {
      pagination(pagination: $pagination) {
        paginationData {
          total
          offset
          limit
        }
        users {
          id
          email
        }
      }
    }
  }
`;

export const GET_ORDER_DETAIL_QUERY = gql`
  query GetOrder($id: ID!) {
    order {
      get(id: $id) {
        id
        status
        number
        vatTaxIDNumber
        vatCompanyName
        vatEmail
        vatAddress
        items {
          id
          productName
          productCode
          quantity
          price
          total
          maxDaysOfDebt
          productWarranty
          inStock
          product {
            uom {
              name
            }
          }
        }
        sellerID
        seller {
          shortName
          telephone
          address
          debtLimit
          availabilityLimit
          vatInfo {
            address
            email
            taxIDNumber
            businessName
          }
          companyWallet {
            balance
          }
        }
        createdByID
        note
        internalNote
        shippingType
        shippingConfiguration {
          busConfig {
            busName
            telephone
            location
            busStation
            fee
          }
          deliver3PartyConfig {
            name
          }
        }
        orderPriority
        promisedDeliverTime
        remainingDeliverTime
        fullStockRequired
        shippingFee
        serviceFee
        discount
        exportedWarehouseID
        vat
        discount
        subTotal
        senderName
        senderPhone
        senderAddress
        receiverContactName
        receiverContactPhone
        receiverContactAddress
        total
        totalProduct
        subTotal
        cashPayment
        stockStatus
        paymentMethod
        fileURLs
        fullEvents {
          state
          name
          createdAt
          createdBy {
            fullname
          }
        }
      }
    }
  }
`;

export const GET_SUMMARY_TABS = gql`
  query GetSummaryTabs {
    order {
      totalByStatus {
        all
        waitingForApproval
        waitingForEnoughStock
        waitingForPayment
        waitingForExporting
        waitingForShipping
        delivering
        completed
        canceled
      }
    }
  }
`;

export const GET_CREATED_BY_WITH_IDS = gql`
  query GetCreatedByWithIds($filters: UsersFilters) {
    user {
      pagination(filters: $filters) {
        users {
          id
          email
        }
      }
    }
  }
`;
