import ObjectViewer from "@/src/components/ObjectViewer";
import { useSession } from "next-auth/react";
import React from "react";

function checksignin() {
  const { data } = useSession();
  console.log({ data });
  if (!data) {
    return <div>not signed in</div>;
  }
  return <ObjectViewer objectData={data}></ObjectViewer>;
}

export default checksignin;
