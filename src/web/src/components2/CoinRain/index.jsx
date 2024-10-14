// CoinRain.jsx
import React, { useState, useEffect } from 'react';
import { useSprings, animated } from '@react-spring/web';

import imgIcon from './assets/OIP.jpeg'

const CoinRain = ({ trigger }) => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    if (trigger) {
      // 创建 30 个金币
      const newCoins = Array.from({ length: 30 }, () => ({
        x: Math.random() * window.innerWidth, // 金币的随机初始横向位置
        y: -50, // 初始位置（从屏幕顶部开始）
        rotation: Math.random() * 360, // 初始随机旋转
        delay: Math.random() * 700, // 随机延迟
      }));
      setCoins((prevCoins) => [...prevCoins, ...newCoins]); // 将新生成的金币追加到现有金币数组中
    }
  }, [trigger]);

  // 使用 useSprings 创建多个动画
  const springs = useSprings(
    coins.length,
    coins.map((coin) => ({
      from: { transform: `translate(${coin.x}px, ${coin.y}px) rotate(${coin.rotation}deg)` },
      to: {
        transform: `translate(${coin.x + (Math.random() - 0.5) * 200}px, ${window.innerHeight + 100}px) rotate(${coin.rotation + 360}deg)`,
      },
      config: { tension: 50, friction: 20 }, // 控制下落速度
      delay: coin.delay,
      loop: false,
    }))
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // 禁止交互
        overflow: 'hidden',
      }}
    >
      {springs.map((props, index) => (
        <animated.div
          key={index}
          style={{
            ...props,
            position: 'absolute',
            width: '30px',
            height: '30px',
            backgroundImage: `url(${imgIcon})`, // 你可以用自己的金币图片链接
            backgroundSize: 'cover',
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
};

export default CoinRain;
