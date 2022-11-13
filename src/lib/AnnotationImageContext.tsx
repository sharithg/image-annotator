import React, { useContext, createContext, useReducer } from "react";
import { annotationImageReducer } from "./annotationReducer";
import { AnnotationAction } from "./annotationReducer/types";
import {
  AnnotationsStateInternal,
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
  defaultBoundingBoxStyles: BBAnnotationStyles;
  defaultLineStyles: LineAnnotationStyles;
  userAnnotationState: AnnotationsStateInternal;
}

const AnnotationsContext = createContext({} as Context);

export const AnnotationsProvider = ({
  children,
  defaultBoundingBoxStyles,
  defaultLineStyles,
  imageFetchHeaders,
}: Props) => {
  const [userAnnotationState, dispatchAnnotation] = useReducer(
    annotationImageReducer,
    {
      boundingBoxes: [],
      lines: [],
    }
  );

  const value: Context = {
    dispatchAnnotation,
    imageFetchHeaders: imageFetchHeaders ?? null,
    defaultBoundingBoxStyles,
    defaultLineStyles,
    userAnnotationState,
  };

  return (
    <AnnotationsContext.Provider value={value}>
      {children}
    </AnnotationsContext.Provider>
  );
};

export const useAnnotations = () => useContext(AnnotationsContext);
