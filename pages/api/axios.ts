// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("From : ", req.query.from);
  console.log(req.headers.authorization);
  //   return res.status(200).json(req.body);
  return res.status(200).json({ name: "asdf" });
}
