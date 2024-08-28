import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import React, { useEffect } from "react";

function Axios() {
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = "Bearer";
  }, []);
  const [cookieEchoFromServer, setCookieEchoFromServer] = React.useState("");
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
      <button
        onClick={async () => {
          // servers/rewrite_cookie폴더의 간이 서버 참조
          // next.config.mjs의 rewrites 참조
          setCookie("cookie_rewrite_test", "cookie from client");
          const res = await axios.get("/api/rewrite_cookie_test");
          console.log({ res });
          setCookieEchoFromServer(res.data);
        }}
      >
        check if rewriting sends cookies as well
      </button>
      <div>Cookie echo from Server : {cookieEchoFromServer}</div>
    </div>
  );
}

export default Axios;
