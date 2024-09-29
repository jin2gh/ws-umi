import { useEffect, useRef } from 'react';
import { parseGif } from './render'


export default function Index () {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loadGif = async (url: string): Promise<void> => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    parseGif(canvasRef.current as HTMLCanvasElement, new Uint8Array(arrayBuffer))
  };
  
  useEffect(() => {
    if (canvasRef.current) {
      loadGif('https://img.soogif.com/0ebEmyQqYYkDiFhMlJgsLpU9LRX6SxAw.gif')
    }
  }, [canvasRef.current])
  return (
    <canvas ref={canvasRef}></canvas>
  )
}