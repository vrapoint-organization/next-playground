import ObjectViewer from "@/src/components/ObjectViewer";
import { useEffect, useState } from "react";

function ServerHealthCheck() {
  const [status, setStatus] = useState({});
  useEffect(() => {
    fetch("/apis/test/ok")
      .then((res) => res.json())
      .then((res) => {
        setStatus(res);
      });
  }, []);
  return (
    <div>
      ServerHealthCheck
      <div>
        <ObjectViewer objectData={status}></ObjectViewer>
      </div>
    </div>
  );
}

export default ServerHealthCheck;
