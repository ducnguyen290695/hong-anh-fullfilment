import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation create($cartID: ID!) {
    order {
      create(cartID: $cartID) {
        id
      }
    }
  }
`;

export const UPDATE_STATUS = gql`
  mutation updateStatus($orderIDs: [ID!]!, $newStatus: OrderStatus!) {
    order {
      updateStatus(orderIDs: $orderIDs, newStatus: $newStatus)
    }
  }
`;

export const APPROVE_STOCK = gql`
  mutation approveStock($orderIDs: [ID!]!) {
    order {
      approveStock(orderIDs: $orderIDs)
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation cancelOrder($orderIDs: [ID!]!, $reason: String) {
    order {
      cancel(orderIDs: $orderIDs, reason: $reason)
    }
  }
`;

export const CONFIRM_PAYMENT = gql`
  mutation confirmPayment($orderIDs: [ID!]!) {
    order {
      confirmPayment(orderIDs: $orderIDs)
    }
  }
`;

export const CONFIRM_EXPORT_ORDER = gql`
  mutation confirmExportOrder($orderIDs: [ID!]!) {
    order {
      export(orderIDs: $orderIDs)
    }
  }
`;

export const COMPLETED_ORDER = gql`
  mutation completedOrder($orderID: ID!, $imageURLs: [String!]) {
    order {
      complete(orderID: $orderID, imageURLs: $imageURLs)
    }
  }
`;

export const CONFIRM_DELIVER = gql`
  mutation confirmDeliver($orderID: ID!, $shipperID: ID!) {
    order {
      deliver(orderID: $orderID, shipperID: $shipperID)
    }
  }
`;

export const WAITING_FOR_ENOUGH_STOCK = gql`
  mutation waitingStock($orderIDs: [ID!]!) {
    order {
      waitStock(orderIDs: $orderIDs)
    }
  }
`;

export const DENY_STOCK = gql`
  mutation denyStock($orderIDs: [ID!]!) {
    order {
      denyStock(orderIDs: $orderIDs)
    }
  }
`;

export const EXPORT_ORDER = gql`
  mutation exportOrder($orderID: Int64!, $fileType: ExportFileType!) {
    order {
      exportFile(orderID: $orderID, fileType: $fileType) {
        url
      }
    }
  }
`;
