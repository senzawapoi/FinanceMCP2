#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ✅ 引入你自定义的财经工具（你要把它放在 src/tools/financeNews.ts 并 build）
import { financeNews } from "./tools/financeNews.js";
import { stockData } from "./tools/stockData.js";
import { indexData } from "./tools/indexData.js";
import { macroEcon } from "./tools/macroEcon.js";

// 模拟笔记数据
type Note = { title: string, content: string };
const notes: { [id: string]: Note } = {
  "1": { title: "First Note", content: "This is note 1" },
  "2": { title: "Second Note", content: "This is note 2" }
};

// 创建 MCP server
const server = new Server(
  {
    name: "my-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

// 📘 资源：列出所有笔记
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.entries(notes).map(([id, note]) => ({
      uri: `note:///${id}`,
      mimeType: "text/plain",
      name: note.title,
      description: `A text note: ${note.title}`
    }))
  };
});

// 📘 资源：读取单条笔记
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const id = url.pathname.replace(/^\//, '');
  const note = notes[id];

  if (!note) {
    throw new Error(`Note ${id} not found`);
  }

  return {
    contents: [{
      uri: request.params.uri,
      mimeType: "text/plain",
      text: note.content
    }]
  };
});

// 🛠️ 工具：列出工具（包括 create_note、finance_news、stock_data、index_data 和 macro_econ）
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_note",
        description: "Create a new note",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Title of the note" },
            content: { type: "string", description: "Text content of the note" }
          },
          required: ["title", "content"]
        }
      },
      {
        name: financeNews.name,
        description: financeNews.description,
        inputSchema: financeNews.parameters
      },
      {
        name: stockData.name,
        description: stockData.description,
        inputSchema: stockData.parameters
      },
      {
        name: indexData.name,
        description: indexData.description,
        inputSchema: indexData.parameters
      },
      {
        name: macroEcon.name,
        description: macroEcon.description,
        inputSchema: macroEcon.parameters
      }
    ]
  };
});

// 🛠️ 工具：执行工具
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "create_note": {
      const title = String(request.params.arguments?.title);
      const content = String(request.params.arguments?.content);
      if (!title || !content) throw new Error("Title and content are required");

      const id = String(Object.keys(notes).length + 1);
      notes[id] = { title, content };

      return {
        content: [{ type: "text", text: `Created note ${id}: ${title}` }]
      };
    }

    case "finance_news": {
      const count = request.params.arguments?.count ? Number(request.params.arguments.count) : undefined;
      const source = request.params.arguments?.source ? String(request.params.arguments.source) : undefined;
      return await financeNews.run({ count, source });
    }

    case "stock_data": {
      const code = String(request.params.arguments?.code);
      const market_type = String(request.params.arguments?.market_type);
      const start_date = request.params.arguments?.start_date ? String(request.params.arguments.start_date) : undefined;
      const end_date = request.params.arguments?.end_date ? String(request.params.arguments.end_date) : undefined;
      const fields = request.params.arguments?.fields ? String(request.params.arguments.fields) : undefined;
      return await stockData.run({ code, market_type, start_date, end_date, fields });
    }

    case "index_data": {
      const code = String(request.params.arguments?.code);
      const start_date = request.params.arguments?.start_date ? String(request.params.arguments.start_date) : undefined;
      const end_date = request.params.arguments?.end_date ? String(request.params.arguments.end_date) : undefined;
      return await indexData.run({ code, start_date, end_date });
    }

    case "macro_econ": {
      const indicator = String(request.params.arguments?.indicator);
      const start_date = request.params.arguments?.start_date ? String(request.params.arguments.start_date) : undefined;
      const end_date = request.params.arguments?.end_date ? String(request.params.arguments.end_date) : undefined;
      return await macroEcon.run({ indicator, start_date, end_date });
    }

    default:
      throw new Error("Unknown tool");
  }
});

// 💬 Prompt：列出 prompt
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "summarize_notes",
        description: "Summarize all notes",
      }
    ]
  };
});

// 💬 Prompt：返回总结 prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "summarize_notes") {
    throw new Error("Unknown prompt");
  }

  const embeddedNotes = Object.entries(notes).map(([id, note]) => ({
    type: "resource" as const,
    resource: {
      uri: `note:///${id}`,
      mimeType: "text/plain",
      text: note.content
    }
  }));

  return {
    messages: [
      { role: "user", content: { type: "text", text: "Please summarize the following notes:" } },
      ...embeddedNotes.map(note => ({ role: "user" as const, content: note })),
      { role: "user", content: { type: "text", text: "Provide a concise summary of all the notes above." } }
    ]
  };
});

// 启动 server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
