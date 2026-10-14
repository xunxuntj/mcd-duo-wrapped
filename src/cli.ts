import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { connectMcd, fetchOrderList } from "./mcp.js";
import { buildProfile, calculateDuoSync } from "./analyzer.js";
import { renderHtmlReport } from "./renderer.js";
import { UserTasteProfile } from "./types.js";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "demo";

  if (command === "export") {
    const alias = args[1] || "麦麦搭子A";
    console.log(`[1/3] 正在连接麦当劳官方 MCP 服务...`);
    const client = await connectMcd();
    console.log(`[2/3] 读取个人历史订单数据 (order-list)...`);
    const orders = await fetchOrderList(client);
    await client.close();

    console.log(`[3/3] 正在进行脱敏画像计算 (共分析 ${orders.length} 笔订单)...`);
    const profile = buildProfile(orders, alias);

    const filename = `profile_${Date.now()}.json`;
    writeFileSync(filename, JSON.stringify(profile, null, 2), "utf-8");
    console.log(`\n🎉 个人脱敏特征文件已导出: ${filename}`);
    console.log(`你可以把这个 JSON 文件安全发送给朋友（已完全去除手机号、地址与姓名等隐私）！\n`);
    console.log(`- 最爱餐品: ${profile.topProducts.map((p) => p.name).join(", ")}`);
    console.log(`- 麦门标签: ${profile.dietaryTags.join(" / ")}`);
  } else if (command === "compare") {
    const fileA = args[1];
    const fileB = args[2];
    if (!fileA || !fileB) {
      console.error("用法: npx tsx src/cli.ts compare <profileA.json> <profileB.json>");
      process.exit(1);
    }

    const pA = JSON.parse(readFileSync(fileA, "utf-8")) as UserTasteProfile;
    const pB = JSON.parse(readFileSync(fileB, "utf-8")) as UserTasteProfile;

    console.log(`正在计算 ${pA.alias} 与 ${pB.alias} 的麦门契合度...`);
    const report = calculateDuoSync(pA, pB);
    const html = renderHtmlReport(report);
    const outName = `duo_report_${Date.now()}.html`;
    writeFileSync(outName, html, "utf-8");

    console.log(`\n============== 麦麦搭子契合度报告 ==============`);
    console.log(`合体称号: ${report.chemistryTitle}`);
    console.log(`默契指数: ${report.matchScore}%`);
    console.log(`用餐时段同步率: ${report.timeSyncRate}% (${report.combinedStats.nightOwlScore})`);
    console.log(`共同偏好: ${report.sharedFavorites.join("、")}`);
    console.log(`已生成高颜值网页海报报告: ${outName}`);
    console.log(`=================================================\n`);
  } else {
    // demo 模式：使用当前真实账户数据与一个预置好友画像进行现场合体
    console.log(`[DEMO 模式] 正在连接麦当劳官方 MCP 服务获取你的真实画像...`);
    const client = await connectMcd();
    const orders = await fetchOrderList(client);
    await client.close();

    const myProfile = buildProfile(orders, "我 (麦门信徒)");

    // 模拟搭子 B 的画像（例如一个喜欢麦乐鸡和拿铁的下午茶/夜宵搭子）
    const buddyProfile: UserTasteProfile = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      alias: "工位搭子 (小王)",
      totalOrders: 18,
      dateRange: { start: "2026-08-01", end: "2026-10-10" },
      totalSpend: 420.5,
      timeDistribution: { breakfast: 1, lunch: 7, afternoon: 4, dinner: 3, night: 3 },
      favoriteCategory: "板烧鸡腿堡铁粉",
      topProducts: [
        { name: "板烧鸡腿堡", count: 8 },
        { name: "麦乐鸡5块", count: 6 },
        { name: "拿铁中杯", count: 5 },
        { name: "中薯条", count: 4 },
      ],
      storesVisited: ["麦当劳上海天山百盛餐厅", "麦当劳上海静安寺餐厅"],
      dietaryTags: ["高蛋白偏好", "咖啡因续命", "小食狂热粉"],
    };

    console.log(`[DEMO 模式] 正在将你的真实麦麦足迹与搭子小王进行合体分析...`);
    const report = calculateDuoSync(myProfile, buddyProfile);
    const html = renderHtmlReport(report);
    const demoOut = `duo_report_demo.html`;
    writeFileSync(demoOut, html, "utf-8");

    console.log(`\n🎉 体验生成成功！`);
    console.log(`合体称号: ${report.chemistryTitle}`);
    console.log(`默契得分: ${report.matchScore}%`);
    console.log(`已输出测试报告: ${demoOut}\n`);
  }
}

main().catch((err) => {
  console.error("执行失败:", err);
  process.exit(1);
});
