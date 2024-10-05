import {
    AnnotationsState,
    ClientCoordinate,
    Offest,
    XYCoordinate,
} from '../types'

const MIN_INTERACTION_STROKE_WIDTH = 7

export const getClientCoordinatesOnCanvas = (
    event: ClientCoordinate,
    offset: Offest,
    mousePointOffset: DOMRect
): XYCoordinate => {
    const { clientX, clientY } = event
    const x = clientX - offset.dx - mousePointOffset.left
    const y = clientY - offset.dy - mousePointOffset.top
    return { x, y }
}

/**
 * Calculates the perpendicular distance from a point (x0, y0)
 * to a line segment defined by two points (x1, y1) and (x2, y2).
 * This distance is calculated using the formula for the distance from a point to a line in a 2D plane.
 */
export const distancePointFromLine = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
) => {
    return (
        Math.abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1)) /
        Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    )
}

function isPointOnLine(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number
) {
    // calculate the distance from the point to the infinite line
    const distance = distancePointFromLine(px, py, x1, y1, x2, y2)

    // check if the point is within 'width / 2' distance of the line
    if (distance > width / 2) {
        return false
    }

    // make sure the point is within the bounding box of the line segment
    const minX = Math.min(x1, x2)
    const maxX = Math.max(x1, x2)
    const minY = Math.min(y1, y2)
    const maxY = Math.max(y1, y2)

    return px >= minX && px <= maxX && py >= minY && py <= maxY
}

export const distanceBetweenPoints = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
) => {
    return {
        xDistance: Math.abs(x1 - x2),
        yDistance: Math.abs(y1 - y2),
    }
}

export const isHoveringOnBoxAnnotation = (
    currentAnnotations: AnnotationsState,
    coordinates: { x: number; y: number }
) => {
    const { x: interactionX, y: interactionY } = coordinates

    return currentAnnotations.boundingBoxes.find((box) => {
        const { y, x, height, width } = box

        const isInteractingWithLeftSide =
            interactionX >= x + width &&
            interactionX <= x + width + box.styles.strokeWidth &&
            interactionY >= y &&
            interactionY <= y + height + box.styles.strokeWidth

        const isInteractingWithRightSide =
            interactionX >= x &&
            interactionX <= x + box.styles.strokeWidth &&
            interactionY >= y &&
            interactionY <= y + height + box.styles.strokeWidth

        const isInteractingWithTopSide =
            interactionX >= x &&
            interactionX <= x + width + box.styles.strokeWidth &&
            interactionY >= y &&
            interactionY <= y + box.styles.strokeWidth

        const isInteractingWithBottomSide =
            interactionX >= x &&
            interactionX <= x + width + box.styles.strokeWidth &&
            interactionY >= y + height &&
            interactionY <= y + height + box.styles.strokeWidth

        const isInteractingWithBox =
            isInteractingWithLeftSide ||
            isInteractingWithRightSide ||
            isInteractingWithTopSide ||
            isInteractingWithBottomSide

        return isInteractingWithBox
    })
}

export const isHoveringOnLineAnnotation = (
    currentAnnotations: AnnotationsState,
    coordinates: { x: number; y: number }
) => {
    const { x: interactionX, y: interactionY } = coordinates

    for (const line of currentAnnotations.lines) {
        const { x1, x2, y1, y2, styles } = line

        const handleWidth = styles.strokeWidth + MIN_INTERACTION_STROKE_WIDTH

        if (styles.showHandles) {
            const isInteractingWithFirstHandle =
                interactionX >= x1 - handleWidth &&
                interactionX <= x1 + handleWidth &&
                interactionY >= y1 - handleWidth &&
                interactionY <= y1 + handleWidth

            const isInteractingWithSecondHandle =
                interactionX >= x2 - handleWidth &&
                interactionX <= x2 + handleWidth &&
                interactionY >= y2 - handleWidth &&
                interactionY <= y2 + handleWidth

            const isInteractingWithLine =
                isInteractingWithFirstHandle || isInteractingWithSecondHandle

            if (isInteractingWithLine) {
                return {
                    annotaion: line,
                    handle: isInteractingWithFirstHandle ? 'first' : 'second',
                }
            }
        }

        const isInteractingWithLine = isPointOnLine(
            interactionX,
            interactionY,
            x1,
            y1,
            x2,
            y2,
            styles.strokeWidth > MIN_INTERACTION_STROKE_WIDTH
                ? styles.strokeWidth
                : MIN_INTERACTION_STROKE_WIDTH
        )

        if (isInteractingWithLine) {
            return {
                annotaion: line,
                handle: 'line',
            }
        }
    }
}
