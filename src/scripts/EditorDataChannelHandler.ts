import { DataSkeleton, EditorReview } from "@/types/EditorType";
import { IMessage } from "@stomp/stompjs";
import { setEditorReviewAtom } from "../jotai/editor";
// import { getEditorUserAtom } from "../jotai/editor";

export interface DataFunction {
  DEFAULT: (data: any) => void;
  BROADCAST: (data: any) => void;
  CAMERA: (data: any) => void;
  DATA_TRANSFER: (data: any) => void;
  REVIEW: (data: any) => void;
}

// useEditorSocket에서 Data채널 데이터 핸들링
const EditorDataChannelHandler = (msg: IMessage) => {
  const data = JSON.parse(msg.body);
  // handler
  console.log({ EditorDataChannelHandler: data });
  // console.log({ getUser: getEditorUserAtom() });
  if (data.type === "DATA_TRANSFER") {
    const contained = data.data as DataSkeleton;

    if (contained.type === "REVIEW") {
      const review = contained.data as EditorReview;
      console.log({ review });
      setEditorReviewAtom((prev) => {
        return {
          ...prev,
          reviews: [...prev.reviews, review],
        };
      });
    }
  }
};

export default EditorDataChannelHandler;
