import { useSocket } from "@/src/scripts/SocketProvider";
import useEditorSocket from "@/src/scripts/useEditorSocket";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

function Editor({ myId, projectId }: { myId: string; projectId: string }) {
  const {
    isConnected,
    subscribeEditor,
    editorSubscribed,
    publishEditor,
    editorData,
  } = useEditorSocket();

  return (
    <div>
      Editor Inside - My Id : {myId}
      <div>isConnected : {isConnected ? "true" : "false"}</div>
      <button
        onClick={() => {
          subscribeEditor(projectId);
        }}
      >
        Subscribe to {projectId}
      </button>
      <div>editorSubscribed: {editorSubscribed ? "true" : "false"}</div>
      <div>
        <button
          onClick={() => {
            publishEditor({ x: 100, y: 200 });
          }}
        >
          Publish
        </button>
      </div>
      <div>
        {editorData.map((data, i) => (
          <div key={i}>{JSON.stringify(data)}</div>
        ))}
      </div>
      <Link href={`/editor`}>Back to editor main</Link>
    </div>
  );
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  const { id: myId, projectId } = query;

  return {
    props: {
      myId,
      projectId,
    },
  };
};

export default Editor;
