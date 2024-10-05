import React, { useEffect, useRef, useState } from 'react'
import AnnotationImage from './AnnotationImage'
import { useAnnotations } from './AnnotationImageContext'
import { rotateImage } from './imageManipulations'
import { DegreeRotations } from './types'
import { SharedComponentProps } from './types/props'
import { drawImage } from './utils/image'

type Props = {
    height?: number
    width?: number
    degreeRotation?: DegreeRotations
} & SharedComponentProps

const Annotator: React.FC<Props> = ({
    imageSrc,
    annotations,
    drawMode,
    height,
    width,
    degreeRotation,
    onAnnotationDraw,
    onAnnotationMoving,
    onAnnotationUpdate,
}) => {
    const [xOffset, setXOffset] = useState(0)
    const [yOffset, setYOffset] = useState(0)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [imageLoaded, setImageLoaded] = useState(false)
    const { imageFetchHeaders } = useAnnotations()
    const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(
        null
    )

    const offsets = {
        dx: xOffset,
        dy: yOffset,
    }

    const canvasHeightAndWidth = {
        height: height ?? 600,
        width: width ?? 1000,
    }

    useEffect(() => {
        if (imageLoaded) {
            return
        }
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d') as CanvasRenderingContext2D
        context.fillStyle = '#000000'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)

        drawImage(
            context,
            canvas as HTMLCanvasElement,
            imageSrc,
            imageFetchHeaders ?? null,
            (dx, dy, image) => {
                setImageLoaded(true)
                setXOffset(dx + 5)
                setYOffset(dy + 5)
                setCurrentImage(image)
            }
        )
    }, [imageLoaded])

    console.log('degreeRotation', degreeRotation)

    useEffect(() => {
        const canvas = canvasRef.current
        if (currentImage && canvas && degreeRotation) {
            const context = canvas.getContext('2d') as CanvasRenderingContext2D

            rotateImage(degreeRotation, canvas, context, currentImage)
        }
    }, [currentImage, imageLoaded, degreeRotation])

    return (
        <div
            style={{
                position: 'relative',
                height: canvasHeightAndWidth.height,
                width: canvasHeightAndWidth.width,
            }}
        >
            <canvas
                {...canvasHeightAndWidth}
                style={{
                    position: 'absolute',
                    backgroundColor: 'black',
                }}
            />
            <canvas
                ref={canvasRef}
                {...canvasHeightAndWidth}
                style={{
                    position: 'absolute',
                }}
            />
            {imageLoaded && (
                <AnnotationImage
                    annotations={annotations}
                    drawMode={drawMode}
                    canvasHeightAndWidth={canvasHeightAndWidth}
                    imageSrc={imageSrc}
                    offsets={offsets}
                    onAnnotationMoving={onAnnotationMoving}
                    onAnnotationDraw={onAnnotationDraw}
                    onAnnotationUpdate={onAnnotationUpdate}
                />
            )}
        </div>
    )
}

export default Annotator
