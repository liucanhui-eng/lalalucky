import { useState, useEffect } from 'react';
import { product as ProjectL_backend } from "declarations/product";

export const useInventory = () => {
  const [inventory, setInventory] = useState(0);

  const getInventory = async () => {
    try {
      const data = await ProjectL_backend.show_inventory();
      setInventory(Number(data));
    } catch (err) {
      console.error("获取库存信息异常：", err);
    }
  };

  useEffect(() => {
    getInventory();
    const intervalId = setInterval(getInventory, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return inventory;
};
