import ObjectViewer from "@/src/components/ObjectViewer";
import fetcher from "@/src/scripts/fetcher";
import React from "react";

function FetchTest() {
  const [check, setCheck] = React.useState({});

  return (
    <div>
      FetchTest
      <button
        onClick={async () => {
          const res = await fetcher.get("/api/test/ok");
          console.log({ res });
          setCheck(res.data);
        }}
      >
        Server health check
      </button>
      <button
        onClick={async () => {
          const res = await fetcher.post("/api/v2/s/auth/login", {
            email: "stan",
            password: "stan",
          });
          console.log({ res });
          setCheck(res.data);
        }}
      >
        Login with id:stan, pw:stan
      </button>
      <div>
        <ObjectViewer objectData={check}></ObjectViewer>
      </div>
    </div>
  );
}

export default FetchTest;
