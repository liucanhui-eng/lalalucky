import CAvatar from "../CAvatar";
import ImageCropper from "../ImageCropper";

export default function AvatarEditor({ avatar, onChange }) {

  const onFileChange = (newUrl) => {
    onChange(newUrl);
  };

  return (
    <ImageCropper onChange={onFileChange}>
      <CAvatar className='!w-[80px] !h-[80px] border-[2px] border-solid border-[#000]' size="large" avatar={avatar} />
    </ImageCropper>
  );
}