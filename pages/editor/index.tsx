import { useSocket } from "@/src/scripts/SocketProvider";
import useEditorSocket from "@/src/scripts/useEditorSocket";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Editor({ myId }: { myId: string }) {
  const { connect, isConnected } = useEditorSocket();
  const router = useRouter();

  return (
    <div>
      Editor Main - My id : {myId}
      <button
        onClick={() => {
          connect(myId).then((res) => {
            if (res) {
              router.push("/editor/some_project?id=" + myId);
            } else {
              alert("Failed to connect");
            }
          });
        }}
      >
        Connect
      </button>
      <div>isConnected : {isConnected ? "true" : "false"}</div>
      <Link href={`/editor/some_project?id=${myId}`}>To editor</Link>
    </div>
  );
}

export const getServerSideProps = () => {
  let num = Math.random();
  while (num < 10) {
    num = num * 10;
  }
  num = Math.round(num);
  return {
    props: {
      myId: "MASTER" + num,
    },
  };
};

export default Editor;
