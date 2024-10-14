import { PAGInit } from 'libpag';
import libpagWasm from 'libpag/lib/libpag.wasm?arraybuffer';
import { useEffect, useState, useRef } from 'react';

// page实例全局唯一即可，因此单例化
let pagInstance = null;
const getPagInstance = async () => {
  if (!pagInstance) {
    const pagWASMUrl = URL.createObjectURL(new Blob([libpagWasm], { type: 'application/wasm' }));
    pagInstance = await PAGInit({ locateFile: () => pagWASMUrl });
    pagWASMUrl && URL.revokeObjectURL(pagWASMUrl);
  }
  return pagInstance;
};

// 提前缓存PAG实例，避免用到时再初始化
getPagInstance();

export default function PagPlayer({ src }) {
  const [pagView, setPagView] = useState(null);
  const canvasRef = useRef(null);
  const initPAGPlayer = async () => {
    const { PAGView, PAGFile } = await getPagInstance();
    const pagFile = await PAGFile.load(src);
    canvasRef.current.width = pagFile.width();
    canvasRef.current.height = pagFile.height();
    const pagView = await PAGView.init(pagFile, canvasRef.current);
    setPagView(pagView);

    pagView.setRepeatCount(0);
    await pagView.play();
  };

  useEffect(() => {
    console.log('PagPlayer src: ', src, src && src.byteLength > 0);
    if (src && src.byteLength > 0) {
      console.log('PagPlayer initPAGPlayer');
      initPAGPlayer();
    }
    return () => {
      pagView?.destroy();
    }
  }, [src]);

  return (<canvas ref={canvasRef}></canvas>);
}