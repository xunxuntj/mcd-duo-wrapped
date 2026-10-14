import { OrderRecord, UserTasteProfile, DuoSyncReport } from "./types.js";

/** 将原始订单流水抽象计算为完全脱敏的口味特征画像 */
export function buildProfile(orders: OrderRecord[], alias: string = "麦麦信徒"): UserTasteProfile {
  const productCount: Record<string, number> = {};
  const storeSet = new Set<string>();
  let totalSpend = 0;

  const timeDist = {
    breakfast: 0,
    lunch: 0,
    afternoon: 0,
    dinner: 0,
    night: 0,
  };

  const dates: string[] = [];

  for (const order of orders) {
    if (order.createTime) {
      dates.push(order.createTime);
      const hour = parseInt(order.createTime.split(" ")[1]?.split(":")[0] || "12", 10);
      if (hour >= 5 && hour < 10) timeDist.breakfast++;
      else if (hour >= 10 && hour < 14) timeDist.lunch++;
      else if (hour >= 14 && hour < 17) timeDist.afternoon++;
      else if (hour >= 17 && hour < 21) timeDist.dinner++;
      else timeDist.night++;
    }

    if (order.storeName) {
      storeSet.add(order.storeName);
    }

    if (order.realTotalAmount) {
      totalSpend += parseFloat(order.realTotalAmount) || 0;
    }

    for (const prod of order.orderProductList || []) {
      const name = prod.productName;
      productCount[name] = (productCount[name] || 0) + (prod.quantity || 1);
      // 展开套餐子项
      if (prod.comboItemList) {
        for (const sub of prod.comboItemList) {
          productCount[sub.name] = (productCount[sub.name] || 0) + (sub.quantity || 1);
        }
      }
    }
  }

  dates.sort();
  const sortedProds = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  // 计算特征标签
  const dietaryTags: string[] = [];
  if (timeDist.night > 1 || (timeDist.night / (orders.length || 1)) > 0.3) {
    dietaryTags.push("夜宵守护者");
  }
  if (timeDist.breakfast > 2) {
    dietaryTags.push("早餐打卡达人");
  }

  const topItems = sortedProds.map((p) => p.name).join(" ");
  if (topItems.includes("板烧") || topItems.includes("牛") || topItems.includes("鸡")) {
    dietaryTags.push("食肉派");
  }
  if (topItems.includes("薯条") || topItems.includes("麦乐鸡")) {
    dietaryTags.push("小食狂热粉");
  }
  if (topItems.includes("咖啡") || topItems.includes("拿铁")) {
    dietaryTags.push("咖啡因续命");
  }

  return {
    version: "1.0",
    timestamp: new Date().toISOString(),
    alias,
    totalOrders: orders.length,
    dateRange: {
      start: dates[0] || "近期",
      end: dates[dates.length - 1] || "近期",
    },
    totalSpend: Math.round(totalSpend * 10) / 10,
    timeDistribution: timeDist,
    favoriteCategory: sortedProds[0]?.name ? `${sortedProds[0].name}铁粉` : "全能麦客",
    topProducts: sortedProds.slice(0, 5),
    storesVisited: Array.from(storeSet),
    dietaryTags: dietaryTags.length ? dietaryTags : ["经典麦门搭子"],
  };
}

/** 比较两个人的脱敏画像，生成合体回忆与契合度报告 */
export function calculateDuoSync(profileA: UserTasteProfile, profileB: UserTasteProfile): DuoSyncReport {
  const prodsA = new Set(profileA.topProducts.map((p) => p.name));
  const prodsB = new Set(profileB.topProducts.map((p) => p.name));

  const shared = Array.from(prodsA).filter((p) => prodsB.has(p));
  const onlyA = Array.from(prodsA).filter((p) => !prodsB.has(p));
  const onlyB = Array.from(prodsB).filter((p) => !prodsA.has(p));

  // 门店重合
  const storesA = new Set(profileA.storesVisited);
  const storeOverlap = profileB.storesVisited.filter((s) => storesA.has(s));

  // 时段相似度 (向量余弦近似)
  const times = ["breakfast", "lunch", "afternoon", "dinner", "night"] as const;
  let dot = 0, normA = 0, normB = 0;
  for (const t of times) {
    const a = profileA.timeDistribution[t] || 0;
    const b = profileB.timeDistribution[t] || 0;
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }
  const timeSync = normA && normB ? Math.round((dot / (Math.sqrt(normA) * Math.sqrt(normB))) * 100) : 75;

  // 综合默契指数
  const tasteOverlapScore = (shared.length / Math.max(prodsA.size, prodsB.size, 1)) * 50;
  const matchScore = Math.min(99, Math.max(60, Math.round(45 + tasteOverlapScore + timeSync * 0.3 + (storeOverlap.length ? 10 : 0))));

  let chemistryTitle = "麦门灵魂饭搭子";
  if (matchScore >= 90) chemistryTitle = "麦门双子星 · 绝配神仙搭子";
  else if (matchScore >= 80) chemistryTitle = "默契饭搭子 · 一见如故";
  else if (matchScore >= 70) chemistryTitle = "互补型饭搭子 · 快乐翻倍";
  else chemistryTitle = "探索型饭搭子 · 互相种草";

  // 双人餐组合推荐
  const favoriteBurgers = shared.length ? shared[0] : (profileA.topProducts[0]?.name || "板烧鸡腿堡");
  const compMealA = onlyA[0] || profileA.topProducts[1]?.name || "中薯条";
  const compMealB = onlyB[0] || profileB.topProducts[1]?.name || "麦乐鸡5块";

  return {
    userA: profileA.alias,
    userB: profileB.alias,
    matchScore,
    chemistryTitle,
    sharedFavorites: shared.length ? shared : [profileA.topProducts[0]?.name || "板烧鸡腿堡"],
    contrastingFavorites: { userA: onlyA, userB: onlyB },
    timeSyncRate: timeSync,
    topStoreOverlap: storeOverlap,
    combinedStats: {
      totalOrders: profileA.totalOrders + profileB.totalOrders,
      totalBurgers: Math.round((profileA.totalOrders + profileB.totalOrders) * 1.6),
      nightOwlScore: (profileA.timeDistribution.night + profileB.timeDistribution.night) > 1 ? "重度夜宵合谋者" : "日间阳光搭子",
    },
    sharedMealRecommendation: {
      title: `麦麦搭子【${chemistryTitle.split("·")[0].trim()}】专属双人合单`,
      description: `结合 ${profileA.alias} 与 ${profileB.alias} 的口味交集与互补特性，最不容易踩雷的拼单组合：`,
      suggestedCombo: [
        `${favoriteBurgers} x2份 (双方最爱公约数)`,
        `${compMealA} (来自 ${profileA.alias} 的专属口味)`,
        `${compMealB} (来自 ${profileB.alias} 的专属推荐)`,
        "可乐中杯 x2 (经典麦门套餐搭档)",
      ],
    },
  };
}
