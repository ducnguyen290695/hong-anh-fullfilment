const convertSourceType = (value) =>
  value > 0 ? 'accountant.walletType.bank' : 'accountant.walletType.virtual';

function parseWalletType(type) {
  switch (type) {
    case 'SELLER_PERSONAL':
      return 'accountant.walletType.personal';

    case 'SELLER_COMPANY':
      return 'accountant.walletType.company';

    case 'WAREHOUSE_ACCOUNTANT':
      return 'accountant.walletType.virtual';

    case 'BANK_ACCOUNT ':
      return 'accountant.walletType.bank';

    default:
      return '';
  }
}

function parseBankTransferType(type) {
  switch (type) {
    case 'COMPANY_TO_COMPANY':
      return 'accountant.transactionType.companyToCompany';

    case 'COMPANY_TO_PERSONAL':
      return 'accountant.transactionType.companyToPersonal';

    case 'PERSONAL_TO_PERSONAL':
      return 'accountant.transactionType.personalToPersonal';

    case 'PERSONAL_TO_COMPANY':
      return 'accountant.transactionType.personalToCompany';

    default:
      return '';
  }
}

export const convertDataSeller = (data) =>
  data?.map((record) => ({
    createdAt: record.createdAt,
    sellerId: record.wallet.seller?.id,
    sellerCode: record.wallet.seller?.code,
    sellerName: record.wallet.seller?.fullName,
    billId: record.id,
    sourceWallet: record.walletTransfer?.sourceWallet?.type,
    walletType: parseWalletType(record.wallet.type),
    amount: record.amount,
    createdBy: record.walletTransfer?.createdBy?.email,
    orderID: record.walletTransfer?.orderID,
    description: record.walletTransfer?.description,
    fileURLs: record.walletTransfer?.fileURLs,
    bankTransferType: parseBankTransferType(record.transferType),
  }));

export const convertDataWarehouseAccountantTransaction = (data) =>
  data?.map((record) => ({
    createdAt: record?.createdAt, // Thơi gian
    idAgent: record?.walletTransfer?.targetWallet?.seller
      ? record?.walletTransfer?.targetWallet?.seller?.id
      : record?.walletTransfer?.targetWallet?.user?.id, //Mã tài khoản
    nameAccountantWarehouse: record?.walletTransfer?.createdBy?.fullname, // Tên kế toán kho
    id: record?.id, // Mã giao dịch
    sourceType: convertSourceType(record?.amount), // Nguồn tiền
    targetWallet: parseWalletType(record?.walletTransfer?.targetWallet?.type), //Ví giao dịch
    amount: record.amount, //Số tiền
    executor: record.walletTransfer?.createdBy?.email, // Người thực hiện
    description: record.walletTransfer?.description, // Ghi chú
    fileURLs: record.walletTransfer?.fileURLs || [], // File
    isSeller: record.walletTransfer?.targetWallet?.seller ? true : false, // Xem có phải đại lý hay không
    sellerCode: record.walletTransfer?.targetWallet?.seller?.code, // mã đại lý
  }));
