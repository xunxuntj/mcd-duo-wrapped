export interface OrderItem {
  productCode: string;
  productName: string;
  quantity: number;
  comboItemList?: Array<{ productCode: string; name: string; quantity: number }>;
}

export interface OrderRecord {
  orderId: string;
  orderType: string;
  createTime: string;
  storeCode: string;
  storeName: string;
  orderStatus: string;
  realTotalAmount: string;
  orderProductList: OrderItem[];
}

/** 脱敏后的个人画像，安全可分享，不含任何手机号、姓名、地址 */
export interface UserTasteProfile {
  version: "1.0";
  timestamp: string;
  alias: string;
  totalOrders: number;
  dateRange: { start: string; end: string };
  totalSpend: number;
  timeDistribution: {
    breakfast: number; // 05:00 - 10:30
    lunch: number;     // 10:30 - 14:00
    afternoon: number; // 14:00 - 17:00
    dinner: number;    // 17:00 - 21:00
    night: number;     // 21:00 - 05:00
  };
  favoriteCategory: string; // 汉堡忠实粉 / 炸鸡大师 / 咖啡常客 / 甜品爱好者
  topProducts: Array<{ name: string; count: number }>;
  storesVisited: string[];
  dietaryTags: string[]; // 如 ["高蛋白偏好", "夜宵党", "辣味爱好者"]
}

export interface DuoSyncReport {
  userA: string;
  userB: string;
  matchScore: number; // 0 - 100 默契指数
  chemistryTitle: string; // 如 "麦门灵魂饭搭子" / "双倍快乐合谋者"
  sharedFavorites: string[]; // 共同偏好餐品
  contrastingFavorites: { userA: string[]; userB: string[] }; // 各自专有
  timeSyncRate: number; // 比如都在夜宵或都在午餐的同频比率
  topStoreOverlap: string[]; // 共同光顾过的门店
  combinedStats: {
    totalOrders: number;
    totalBurgers: number;
    nightOwlScore: string;
  };
  sharedMealRecommendation: {
    title: string;
    description: string;
    suggestedCombo: string[];
  };
}
