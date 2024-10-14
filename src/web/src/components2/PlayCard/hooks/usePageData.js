import { useState, useCallback } from "react";
import { product as ProjectL_backend } from "declarations/product";

// 自定义 hook：用于管理页面数据和库存
export const usePageData = () => {
  const [data, setData] = useState({ dataType: 1, totalCount: 0, ticketNum: 0 });
  const [inventory, setInventory] = useState(0);

  // 获取页面数据
  const getPageData = useCallback(async () => {
    try {
      const result = await ProjectL_backend.show();
      const playCardData = {
        dataType: 1,
        ticketNum: 0,
        inventory: Number(result.inventory),
        totalCount: Number(result.total_count),
        rate: String(result.rate),
      };
      setData(playCardData);
    } catch (err) {
      console.error("Error fetching page data:", err);
    }
  }, []);

  // 获取库存
  const getInventory = useCallback(async () => {
    try {
      const data = await ProjectL_backend.show_inventory();
      setInventory(Number(data));
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  }, []);

  return { data, inventory, getPageData, getInventory };
};
