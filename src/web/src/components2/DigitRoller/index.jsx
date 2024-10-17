import React, { useEffect } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { easeCubicInOut } from 'd3-ease';  // 使用d3中的缓动函数库

const DigitRoller = ({ targetNumbers = [0, 0, 0], duration = 3000,isStart }) => {
  const digits = [...Array(10).keys()]; // 数字0-9

  // 使用useSprings来管理每个数字的滚动状态
  const [springs, api] = useSprings(3, index => ({
    from: { y: 0 },
    to: { y: 0 },
    config: { tension: 120, friction: 30 },  // 更平滑的tension和friction配置
  }));

  // 当目标数字改变时，触发滚动
  useEffect(() => {
    api.start(index => {
      const targetDigit = targetNumbers[index];
      const rounds = 5; // 固定滚动5圈
      const totalDistance = rounds * digits.length * 40 + targetDigit * 40; // 计算滚动距离

      return {
        from: { y: 0 },  // 每次点击按钮，y值会重置为0
        to: { y: totalDistance },  // 目标y值
        config: { duration: duration + index * 500, easing: easeCubicInOut }, // 使用更丝滑的缓动函数
        reset: true,  // 使动画能够从头开始
      };
    });
  }, [targetNumbers, api, duration,isStart]);



  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      {springs.map((style, index) => (
        <div
          key={index}
          style={{
            width: '40px',
            height: '40px',  // 只显示一个数字的高度
            overflow: 'hidden',
            border: '1px solid gray',
            margin: '0 10px',
            position: 'relative',
          }}
        >
          <animated.div
            style={{
              position: 'absolute',
              willChange: 'transform',
              transform: style.y.to(y => `translateY(-${y % (digits.length * 40)}px)`), // 滚动的y值修正为0-360之间
            }}
          >
            {/* 循环数字，确保滚动连续 */}
            {[...digits, ...digits, ...digits].map((digit, i) => (
              <div
                key={i}
                style={{
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '32px',
                }}
              >
                {digit}
              </div>
            ))}
          </animated.div>
        </div>
      ))}
    </div>
  );
};

export default DigitRoller;
