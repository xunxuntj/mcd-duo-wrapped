import { DuoSyncReport } from "./types.js";

export function renderHtmlReport(report: DuoSyncReport): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>麦麦搭子契合度报告 · Duo Wrapped</title>
  <style>
    :root {
      --mcd-red: #DA291C;
      --mcd-yellow: #FFBC0D;
      --mcd-black: #27251F;
      --bg: #FAFAF8;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      background: var(--bg);
      color: var(--mcd-black);
      margin: 0;
      padding: 24px 16px;
      display: flex;
      justify-content: center;
    }
    .card {
      max-width: 520px;
      width: 100%;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 12px 36px rgba(218, 41, 28, 0.08), 0 2px 8px rgba(0,0,0,0.04);
      overflow: hidden;
      border: 2px solid #F1EFEA;
    }
    .header {
      background: var(--mcd-red);
      color: white;
      padding: 32px 24px;
      text-align: center;
      position: relative;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      letter-spacing: 1px;
    }
    .header .subtitle {
      font-size: 14px;
      opacity: 0.9;
    }
    .score-badge {
      display: inline-block;
      background: var(--mcd-yellow);
      color: var(--mcd-black);
      font-size: 44px;
      font-weight: 800;
      padding: 10px 24px;
      border-radius: 50px;
      margin-top: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .score-label {
      font-size: 13px;
      margin-top: 6px;
      font-weight: bold;
    }
    .content {
      padding: 24px;
    }
    .section {
      margin-bottom: 24px;
      background: #FFFDF7;
      padding: 16px;
      border-radius: 14px;
      border-left: 4px solid var(--mcd-yellow);
    }
    .section-title {
      font-size: 15px;
      font-weight: bold;
      color: var(--mcd-red);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .pair-names {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin: 12px 0 20px 0;
    }
    .pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .pill {
      background: #FFF0ED;
      color: var(--mcd-red);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }
    .combo-box {
      background: #F8F9FA;
      border: 1px dashed #D2D2D7;
      border-radius: 12px;
      padding: 14px;
      margin-top: 10px;
    }
    .combo-item {
      font-size: 14px;
      margin: 6px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #86868B;
      border-top: 1px solid #F1EFEA;
    }
    .badge-tag {
      display: inline-block;
      background: #27251F;
      color: #FFBC0D;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      margin-left: 6px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="subtitle">🍔 麦当劳 MCP 双人合体回忆与默契报告</div>
      <h1>${report.chemistryTitle}</h1>
      <div class="score-badge">${report.matchScore}<span style="font-size:20px">%</span></div>
      <div class="score-label">麦门契合指数</div>
    </div>

    <div class="content">
      <div class="pair-names">
        <span>${report.userA}</span>
        <span style="color:var(--mcd-red);margin:0 8px;">✕</span>
        <span>${report.userB}</span>
      </div>

      <div class="section">
        <div class="section-title">🍟 双方最爱最大公约数 (共同心头好)</div>
        <div class="pill-list">
          ${report.sharedFavorites.map((f) => `<span class="pill">❤️ ${f}</span>`).join("")}
        </div>
      </div>

      <div class="section">
        <div class="section-title">⏱️ 点餐时段与生活同频度</div>
        <p style="font-size:14px;margin:4px 0 8px 0;">用餐作息相似度：<strong>${report.timeSyncRate}%</strong> (${report.combinedStats.nightOwlScore})</p>
        <p style="font-size:13px;color:#666;margin:0;">双方累计消费频次达 <strong>${report.combinedStats.totalOrders}</strong> 顿，消灭汉堡与主食约 <strong>${report.combinedStats.totalBurgers}</strong> 份！</p>
      </div>

      <div class="section">
        <div class="section-title">✨ 下次约饭专属合体餐单推荐</div>
        <div style="font-size:13px;color:#555;">${report.sharedMealRecommendation.description}</div>
        <div class="combo-box">
          ${report.sharedMealRecommendation.suggestedCombo.map((c) => `<div class="combo-item">🍔 ${c}</div>`).join("")}
        </div>
      </div>
    </div>

    <div class="footer">
      <div>基于麦当劳中国官方 MCP 服务真实数据脱敏生成</div>
      <div style="margin-top:4px;">参与 1024 麦当劳程序员创意开发大赛 · 开源项目</div>
    </div>
  </div>
</body>
</html>`;
}
