// #1. 인터랙션 중 업데이트 막기

const { Subscriptions } = require("@mui/icons-material");

if (isInteracting && interactingModel.id === updatedModel.id) {
  queue.push(updatedModel);
}
onInteractionEnd = async () => {
  updateStates(await Promise.all(queue));
};

// #2. 내가 업데이트한 상태보다 서버가 업데이트한 상태가 늦으면 막기
// @ state update function
setNewState((prev) => {
  newStates.forEach((state) => {
    // 같으면 업데이트한다
    if (prev[state.id].updatedAt <= state.updatedAt) {
      prev[state.id] = state;
    }
  });
});

// #3. 섭, 펍
const functions = {
  ASSET: (asset) => {},
  REVIEW: (review) => {},
};
function subscribeFlow(pid, functions) {
  Subscriptions.onMessage((msg) => {
    const body = msg;
    const dataPromiseArray = {};

    // 전역 스토어의 최신 데이터 id,hash 업데이트
    updateGlobalStore(body);

    // 1. 일단 데이터를 가져온다.
    Object.entries(body).forEach(([key, value]) => {
      // key = "asset", "user" ...
      // value = {id:string; hash:string; type:string; data:any|null; }[]
      dataPromiseArray[key] = value.map(async (item) => {
        // item = {id:string; hash:string; type:string; data:any|null; }
        // case #1. 데이터가 있는 경우
        if (item.data) {
          await setLocalData(item.id, item.hash, item.data);
          return item.data;
        }

        // case #2. 데이터가 없지만 로컬에 있는 경우
        const localData = await getLocalData(item.id, item.hash);
        if (localData) {
          return localData;
        }

        // case #3. 데이터가 없고 로컬에도 없는 경우
        // 페치 후 로컬 업데이트, 이후 리턴
        if (isFetching(item.id)) {
          // TODO
          // 계속 데이터가 들어오다가 중간에 캔슬되면 데이터는 영원히 받아지지 않는다?
          cancelFetching(item.id);
        }
        const remoteData = await getRemoteData(item.id, item.type);
        setLocalData(item.id, item.hash, remoteData);
        return remoteData;
      });
    });

    // 2. 데이터를 함수에 넣어서 실행
    const keys = Object.keys(dataPromiseArray);
    keys.forEach((key) => {
      Promise.all(dataPromiseArray[key]).then((data) => {
        functions[key](data);
      });
    });
  });
}
