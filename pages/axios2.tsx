import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";

function Axios() {
  // useEffect(() => {
  //   axios.defaults.headers.common["Authorization"] = "Bearer";
  // }, []);
  return (
    <div>
      Axios2
      <Link href="/axios1">To Axios1</Link>
      <button
        onClick={async () => {
          const res = await axios.get("/api/axios?from=axios2");
          console.log({ res });
        }}
      >
        Fetch
      </button>
    </div>
  );
}

export default Axios;
