import type { ReactNode } from "react";
import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

export type JotaiSSRProviderProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // atomValues: Iterable<
  //   readonly [WritableAtom<unknown, [any], unknown>, unknown]
  // >;
  atomValues: Iterable<any[]>; // [ [atom1, value1], [atom2, value2], ... ]
  children: ReactNode;
};

// AtomsHydrator : 최초 jotai 스테이트에 값이 반드시 존재해야할 때 사용
// 다음에서 복사
// https://jotai.org/docs/guides/initialize-atom-on-render
function AtomsHydrator({ atomValues, children }: JotaiSSRProviderProps) {
  //@ts-ignore
  useHydrateAtoms(new Map(atomValues));
  return children;
}

// atomValues : [ [atom1, value1], [atom2, value2], ... ]
export default function JotaiSSRProvider({
  children,
  atomValues,
}: JotaiSSRProviderProps) {
  return (
    <Provider>
      <AtomsHydrator atomValues={atomValues}>{children}</AtomsHydrator>
    </Provider>
  );
}
