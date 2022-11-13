import React, { useContext, createContext, useReducer } from "react";
import { annotationImageReducer } from "./annotationImageReducer";
import {
  AnnotationAction,
  AnnotationState,
  BBAnnotationStyles,
  LineAnnotationStyles,
} from "./types";

type Props = {
  children: React.ReactNode;
  defaultBoundingBoxStyles: BBAnnotationStyles;
  defaultLineStyles: LineAnnotationStyles;
  imageFetchHeaders?: HeadersInit;
};

interface Context {
  dispatchAnnotation: React.Dispatch<AnnotationAction>;
  imageFetchHeaders: HeadersInit | null;
  activeAnnotations: AnnotationState;
}

const AnnotationsContext = createContext({} as Context);

export const AnnotationsProvider = ({
  children,
  defaultBoundingBoxStyles,
  defaultLineStyles,
  imageFetchHeaders,
}: Props) => {
  const [activeAnnotations, dispatchAnnotation] = useReducer(
    annotationImageReducer({
      defaultBoundingBoxStyles,
      defaultLineStyles,
    }),
    {
      boundingBoxes: [],
      lines: [],
      currentAnnotationIds: new Set<string>(),
    }
  );

  const value: Context = {
    dispatchAnnotation,
    imageFetchHeaders: imageFetchHeaders ?? null,
    activeAnnotations,
  };

  return (
    <AnnotationsContext.Provider value={value}>
      {children}
    </AnnotationsContext.Provider>
  );
};

export const useAnnotations = () => useContext(AnnotationsContext);
