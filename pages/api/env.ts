import ENV_PUBLIC from "@/src/scripts/ENV_PUBLIC";
import ENV_SERVER from "@/src/serverscripts/ENV_SERVER";
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
