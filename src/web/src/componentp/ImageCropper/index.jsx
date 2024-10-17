import { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import CPopup from '../CPopup';

export default function ImageCropper({ children, onChange, toSize = 160 }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [replaceVisible, setReplaceVisible] = useState(false);
  const imageCropper = useRef(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const fileInput = useRef(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1.5)

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        setPopupVisible(true);
        fileInput.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    const imageElement = imageCropper.current.imageRef.current;
    const {
      width: cropWidth,
      height: cropHeight,
      x: cropX,
      y: cropY,
    } = imageCropper.current.getCropData().croppedAreaPixels;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = toSize;
    canvas.height = toSize;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cropWidth, cropHeight);

    ctx.drawImage(
      imageElement,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      toSize,
      toSize,
    );
    onChange?.(canvas.toDataURL('image/jpeg', 1.0));
    setPopupVisible(false);
  };

  return (
    <>
      <div className='w-fit h-fit bg-transparent inline-block relative'>
        {children}
        <input ref={fileInput} type="file" accept="image/*" className="absolute inset-0 opacity-0 z-[10] h-[80px] cursor-pointer" title="" onChange={onFileChange} onMouseEnter={() => setReplaceVisible(true)} onMouseLeave={() => setReplaceVisible(false)} />
        <div 
          className="font-pfsc absolute inset-0 z-[9] h-[80px] w-[80px] bg-[#000]/[0.25] rounded-full text-[#fff] flex items-center justify-center text-[14px] font-semibold transition-opacity duration-500"
          style={{ textShadow: 'rgba(0, 0, 0, 0.65) -1px -1px 2px', opacity: replaceVisible ? '1' : '0' }}
        >Replace</div>
      </div>
      <CPopup 
        visible={popupVisible}
        position="bottom" 
        title="Image Crop" 
        className="px-0"
        closeOnOverlayClick={false}
        onClose={() => setPopupVisible(false)}
      >
        <div className='w-full h-[240px] mt-[21px] flex items-center justify-center position: relative'>
          <Cropper
            ref={imageCropper}
            image={imageUrl}
            crop={crop}
            aspect={1}
            minZoom={0.5}
            maxZoom={3}
            zoom={zoom}
            cropShape='round'
            cropSize={{width: 240, height: 240}}
            onCropChange={setCrop}
            onZoomChange={setZoom}
          />
        </div>
        <div className='pt-[32px] pb-[40px] flex items-center justify-center gap-[8px]'>
          <div 
            onClick={() => setPopupVisible(false)}
            className="retro-button"
          >
            CANCEL
          </div>
          <div 
            onClick={handleCrop}
            className="retro-button retro-button-primary"
          >
            SAVE
          </div>
        </div>
      </CPopup>
    </>
  );
}