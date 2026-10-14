import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { OrderRecord } from "./types.js";

export const MCD_MCP_URL = process.env.MCD_MCP_URL ?? "https://mcp.mcd.cn";

export function getToken(): string {
  const token = process.env.MCD_MCP_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "未检测到环境变量 MCD_MCP_TOKEN。请先设置环境变量 MCD_MCP_TOKEN（支持在 .env 或操作系统环境变量中配置）。",
    );
  }
  return token;
}

export async function connectMcd(): Promise<Client> {
  const transport = new StreamableHTTPClientTransport(new URL(MCD_MCP_URL), {
    requestInit: { headers: { Authorization: `Bearer ${getToken()}` } },
  });
  const client = new Client({ name: "mcd-duo-wrapped", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

export async function fetchOrderList(client: Client): Promise<OrderRecord[]> {
  const res = await client.callTool({ name: "order-list", arguments: {} });
  const content = (res.content ?? []) as Array<{ type: string; text?: string }>;
  const text = content
    .filter((c) => c.type === "text" && c.text)
    .map((c) => c.text)
    .join("\n");

  if (res.isError) {
    throw new Error(`order-list 调用失败: ${text}`);
  }

  // 提取响应中的 JSON 部分
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return [];
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.data && Array.isArray(parsed.data.list)) {
      return parsed.data.list as OrderRecord[];
    }
  } catch (err) {
    console.error("解析订单列表失败:", err);
  }

  return [];
}
