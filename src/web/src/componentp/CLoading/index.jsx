import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PagPlayer from '../PagPlayer';
import LoadingAnimateFile from './loading.pag?arraybuffer';

export default function CLoading({ register }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    register({
      show: () => {
        setVisible(true);
      },
      hide: () => {
        setVisible(false);
      },
    });
  }, []);
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-[#000]/[.25] z-[9999] items-center justify-center' style={{display: visible ? 'flex' : 'none'}}>
      {visible && <div className='w-fit h-fit flex flex-col items-center justify-center gap-[6px] mt-[-98px]'>
        <PagPlayer src={LoadingAnimateFile} />
        <div className='font-pfsc text-[#fff] text-center text-[12px] font-semibold' style={{textShadow: '0px 1px 2px rgba(0, 0, 0, 0.65)'}}>LOADING...</div>
      </div>}
    </div>
  )
}
let loadingControl = null;

const init = () => {
  if (!loadingControl) {
    const loadingContainer = document.createElement('div');
    loadingContainer.style.cssText = 'width: 0;height: 0;padding:0;margin:0;';
    document.body.appendChild(loadingContainer);
    createRoot(loadingContainer).render(createPortal(<CLoading register={(control) => {loadingControl = control}}/>, document.body));
  }
}

/** 初始化加载动画 */
init();

CLoading.show = () => {
  if (!loadingControl) {
    init();
  } else {
    loadingControl.show();
  }
};

CLoading.hide = () => {
  if (loadingControl) {
    loadingControl.hide();
  }
}

