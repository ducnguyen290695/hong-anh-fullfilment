import { gql } from '@apollo/client';

export const GET_SELLER_WALLETS_TRANSACTION = gql`
  query GetWalletsTransaction($filters: WalletTransactionFilters, $pagination: PaginationRequest) {
    walletTransaction {
      pagination(filters: $filters, pagination: $pagination) {
        transactions {
          createdAt # thời gian giao dịch
          id # mã giao dịch
          amount # số tiền
          wallet {
            type # loại ví giao dịch
            seller {
              id
              code # mã đại lý
              fullName # tên đại lý
            }
          }
          walletTransfer {
            sourceWallet {
              type # nguồn tiền nạp
            }
            createdBy {
              email # người thực hiện
            }
            orderID # mã đơn hàng
            description # ghi chú
            fileURLs # file
          }
          walletTransferID
          walletID #mã tài khoản
          id # mã giao dịch
          amount # số tiền
          sourceType
          transferType #loại giao dịch
        }
        paginationData {
          total
        }
      }
    }
  }
`;

export const GET_WAREHOUSE_ACCOUNTANT_WALLETS_TRANSACTION = gql`
  query GetWalletsTransaction($filters: WalletTransactionFilters, $pagination: PaginationRequest) {
    walletTransaction {
      pagination(filters: $filters, pagination: $pagination) {
        transactions {
          createdAt #thời gian giao dịch
          walletID #mã tài khoản
          walletTransfer {
            createdBy {
              fullname #Tên kế toán kho
              email #Người thực hiện
            }
            description #Ghi chú
            fileURLs #list url
            targetWallet {
              type
              seller {
                id
                code
              }
              user {
                id
              }
            }
            sourceWallet {
              type
            }
          }
          id #Mã giao dịch
          sourceType #Nguồn tiền
          amount #Số tiền
        }
        paginationData {
          total
        }
      }
    }
  }
`;
