import React, { useRef } from "react";

const AccordionItem = ({ title, content, isOpen, toggleOpen }) => {
  const itemRef = useRef(null);

  const handleToggle = () => {
    toggleOpen();
    if (!isOpen && itemRef.current) {
      // 获取手风琴项相对窗口的位置信息
      const rect = itemRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // 滚动到手风琴项的位置（修正顶部留白高度，例如标题的高度）
      const offset = 60; // 这里的 60 是预留的顶部留白距离，你可以根据需求调整
      window.scrollTo({
        top: scrollTop + rect.top - offset,
        behavior: "smooth", // 平滑滚动
      });
    }
  };

  return (
    <div ref={itemRef} className="border-b">
      <button
        onClick={handleToggle}
        className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 sticky top-0 z-10"
        style={{ top: "60px" }} // 设置标题固定时距离页面顶部的高度（与 offset 一致）
      >
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <span>{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {content}
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
