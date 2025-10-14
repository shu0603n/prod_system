// ✅ src/pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // 商品とオプションを両方取得
      const [products, options] = await Promise.all([
        prisma.product.findMany({
          include: {
            varieties: true,
            priceRanges: true,
          },
          orderBy: { sortId: "asc" },
        }),
        prisma.option.findMany({
          orderBy: { sortId: "asc" },
        }),
      ]);

      // 両方まとめて返す
      return res.status(200).json({ products, options });
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("データ取得に失敗しました:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
