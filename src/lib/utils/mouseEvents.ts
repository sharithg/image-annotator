import {
    CurrentlyInteractingAnnotation,
    LineAnnotation,
    LineCoordinate,
    XYCoordinate,
} from '../types'
import { distanceBetweenPoints } from './interactions'
import { getOffsetToCenterOfLine } from './line'

export const calculateLineCoordinatesForMouseMove = (
    currentInteractionAnnotation: CurrentlyInteractingAnnotation,
    interactionCoordinates: XYCoordinate
): LineCoordinate => {
    const annotationSide = currentInteractionAnnotation.annotationSide

    if (annotationSide === 'lineStart' || annotationSide === 'lineEnd') {
        const currentAnnotation =
            currentInteractionAnnotation.annotation as LineAnnotation

        const isInteractingWithStart = annotationSide === 'lineStart'

        if (isInteractingWithStart) {
            return {
                x1: interactionCoordinates.x,
                y1: interactionCoordinates.y,
                x2: currentAnnotation.x2,
                y2: currentAnnotation.y2,
            }
        }
        return {
            x1: currentAnnotation.x1,
            y1: currentAnnotation.y1,
            x2: interactionCoordinates.x,
            y2: interactionCoordinates.y,
        }
    }

    if (annotationSide === 'line') {
        const currentAnnotation =
            currentInteractionAnnotation.annotation as LineAnnotation

        const lineLength = distanceBetweenPoints(
            currentAnnotation.x1,
            currentAnnotation.y1,
            currentAnnotation.x2,
            currentAnnotation.y2
        )

        const dx = interactionCoordinates.x - currentAnnotation.x1
        const dy = interactionCoordinates.y - currentAnnotation.y1

        return getOffsetToCenterOfLine(
            currentAnnotation,
            {
                dx,
                dy,
            },
            lineLength
        )
    }

    throw new Error('Invalid annotation side')
}
