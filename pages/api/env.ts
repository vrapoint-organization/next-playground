import ENV_PUBLIC from "@/scripts/client/ENV_PUBLIC";
import ENV_SERVER from "@/scripts/server/ENV_SERVER";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.error({ ENV_PUBLIC, ENV_SERVER });
  res.status(200).json({ name: "John Doe" });
}
