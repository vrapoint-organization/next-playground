import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";

function Axios() {
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = "Bearer";
  }, []);
  return (
    <div>
      Axios1
      <Link href="/axios2">To Axios2</Link>
      <button
        onClick={async () => {
          const res = await axios.get("/api/axios?from=axios1");
          console.log({ res });
        }}
      >
        Fetch
      </button>
    </div>
  );
}

export default Axios;
