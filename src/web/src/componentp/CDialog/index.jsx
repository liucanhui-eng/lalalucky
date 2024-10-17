import "./index.scss";
import imgTop from "./assets/imgTop.png";
import imgCenter from "./assets/imgCenter.png";
import imgBottom from "./assets/imgBottom.png";
import iconClose from "./assets/iconClose.svg";

import { Dialog, Overlay } from "@nutui/nutui-react";

/*

const [isVisible, setIsVisible] = useState(false);

  const handleOpen = () => setIsVisible(true);
  const handleClose = () => setIsVisible(false);

  const handleConfirm = () => {
    console.log("Confirmed");
    handleClose();
  };

  const handleCancel = () => {
    console.log("Cancelled");
    handleClose();
  };

  <button onClick={handleOpen}>Open Dialog</button>
      <CDialog
        visible={isVisible}
        height={200}
        title="My Custom Dialog"
        onClose={handleClose}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        <p>This is the content of the dialog.</p>
      </CDialog>
*/

const Index = ({
  visible,
  children,
  height,
  onClose,
  title,
  onConfirm,
  onCancel,
  okText = "Ok",
  cancelText = "Cancel",
  confirmText = "Confirm",
}) => {
  return (
    <Overlay visible={visible} closeOnOverlayClick={false}>
      <Dialog
        closeOnOverlayClick={onClose}
        onClose={onClose}
        title=""
        visible={visible}
        footer={null}
      >
        <div className="flex flex-col w-full">
          {/* 头部 */}
          <div
            className="w-full h-16 bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url("${imgTop}")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              width: "330px",
              height: "51px",
            }}
          >
            <div className="dialog-title">
              <div className="w-[20px]"></div>
              <div className="dialog-title-info">{title}</div>
              <div className="w-[20px] mt-[4px] mr-[8px] cursor-pointer "> 
                <img width="20" height="20" src={iconClose} onClick={()=>{
                  console.log('11')
                  if(onClose){
                    onClose();
                  }else if(onCancel){
                    onCancel();
                  }else{
                    onConfirm();
                  }
                }} />
              </div>
            </div>
          </div>

          {/* 中间部分，随内容高度变化 */}
          <div
            className="w-full flex-grow bg-repeat-y flex flex-col justify-between"
            style={{
              backgroundImage: `url("${imgCenter}")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              width: "330px",
              height: `${height}px`,
              marginTop: "-1px",
              marginBottom: "-1px",
              paddingLeft: "4px",
              paddingRight: "24px",
            }}
          >
            <div className="dialog-content-box">{children}</div>
            <div className="dialog-btn-box">
              {!onCancel && (
                <div onClick={onConfirm} className="dialog-btn-ok">
                  {okText}
                </div>
              )}
              {onCancel && (
                <>
                  {/* <div onClick={onCancel} className="dialog-btn-cancel">
                    {cancelText}
                  </div> */}
                  <div onClick={onConfirm} className="dialog-btn-confirm">
                    {confirmText}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 尾部 */}
          <div
            className="w-full h-16 bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url("${imgBottom}")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              width: "330px",
              height: "43px",
            }}
          ></div>
        </div>
      </Dialog>
    </Overlay>
  );
};

export default Index;
