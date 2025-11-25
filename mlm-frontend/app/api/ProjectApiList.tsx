import BASE_URL from "./BaseUrl";

const ProjectApiList = {
  // AUTH
  USER: `${BASE_URL}/user`,
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,

  // KYC api
  KYC_STORE: `${BASE_URL}/kyc/store`,
  KYC_USER: `${BASE_URL}/kyc/user`,
  KYC_UPDATE: `${BASE_URL}/kyc/update`,

  // User api
  USERS: `${BASE_URL}/users`,
  UPDATE_USER: `${BASE_URL}/users/update`,
  DELETE_USER: `${BASE_URL}/users/delete`,
  SET_TRANSACTION_PASSWORD: `${BASE_URL}/set-transaction-password`,
  USER_SHOW: `${BASE_URL}/users/show`,

  // events api
  createEvent: `${BASE_URL}/events/store`,
  eventsList: `${BASE_URL}/events`,
  updateEvent: `${BASE_URL}/events/update`,
  deleteEvent: `${BASE_URL}/events/delete`,

  // training api
  training: `${BASE_URL}/trainings`,
  createTraining: `${BASE_URL}/trainings/store`,
  updateTraining: `${BASE_URL}/trainings/update`,
  deleteTraining: `${BASE_URL}/trainings/delete`,
  joinTraining: `${BASE_URL}/trainings/join`,

  // products api
  createProduct: `${BASE_URL}/products/store`,
  productsList: `${BASE_URL}/products`,
  deleteProduct: `${BASE_URL}/products/delete`,
  updateProduct: `${BASE_URL}/products/update`,
  singleProduct: `${BASE_URL}/products/show`,

  // products api
  createOrder: `${BASE_URL}/orders/store`,
  getAllOrder: `${BASE_URL}/orders`,
  orderStatusUpdated: `${BASE_URL}/orders/status`,


  // Roles
  api_getRoles: `${BASE_URL}/roles`,
  api_createRoles: `${BASE_URL}/roles/store`,
  api_deleteRole: `${BASE_URL}/roles/delete`,
  api_updateRole: `${BASE_URL}/roles/update`,
  api_getRolesById: `${BASE_URL}/roles/show`,
  
  // BV-History
  api_getBVHistoryofUser: `${BASE_URL}/bv-history/show`,
  
  
  // BV-History
  MLM_HIERARCHY: `${BASE_URL}/users/mlm-hierarchy`,
  
  // Teams
  MLM_HIERARCHY_LIST: `${BASE_URL}/users/mlm-hierarchy-list`,
  SPONSORED_USERS: `${BASE_URL}/users/sponsored-users`,
  
  
  // Wallet transaction 
  WALLET_TRANSACTION_ADD: `${BASE_URL}/wallet-transactions/store`,
  WALLET_TRANSACTION_LIST: `${BASE_URL}/wallet-transactions`,
  WALLET_TRANSACTION_APPROVE: `${BASE_URL}/wallet-transactions/approve`,
  WALLET_TRANSACTION_SUMMARY: `${BASE_URL}/wallet-history`,
};

export default ProjectApiList;
