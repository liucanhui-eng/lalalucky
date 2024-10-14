import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import Odometer from 'react-odometerjs';
import 'odometer/themes/odometer-theme-default.css';

// 封装的独立组件
const ThreeDigitOdometer = forwardRef(({ initialSpeed = 1000 }, ref) => {
  const [odometerValues, setOdometerValues] = useState([0, 0, 0,0]);  // 三个独立数字的初始值
  const [rolling, setRolling] = useState(false);
  const [targetValues, setTargetValues] = useState([0, 0, 0,0]); // 目标值设为 0-9
  const [speed, setSpeed] = useState(initialSpeed);  // 滚动速度由外部控制

  const intervalRef = useRef([]);  // 用于存储 setInterval 的引用
  const timeoutRef = useRef([]);   // 用于存储 setTimeout 的引用

  const startRolling = useCallback(() => {
    // 清除之前的所有定时器和超时
    timeoutRef.current.forEach(timeout => clearTimeout(timeout));
    intervalRef.current.forEach(interval => clearInterval(interval));

    // 为每个数字应用不同的延迟
    timeoutRef.current = [
      setTimeout(() => {
        intervalRef.current[0] = setInterval(() => {
          setOdometerValues(prevValues => [
            (prevValues[0] + 1) % 10,
            prevValues[1],
            prevValues[2],
            prevValues[3],
          ]);
        }, speed);
      }, Math.random() * 1000), // 第一个数字有 0-500ms 的随机延迟

      setTimeout(() => {
        intervalRef.current[1] = setInterval(() => {
          setOdometerValues(prevValues => [
            prevValues[0],
            (prevValues[1] + 1) % 10,
            prevValues[2],
            prevValues[3],
          ]);
        }, speed);
      }, Math.random() * 1000), // 第二个数字有 0-500ms 的随机延迟

      setTimeout(() => {
        intervalRef.current[2] = setInterval(() => {
          setOdometerValues(prevValues => [
            prevValues[0],
            prevValues[1],
            (prevValues[2] + 1) % 10,
            prevValues[3],
          ]);
        }, speed);
      }, Math.random() * 1000), // 第三个数字有 0-500ms 的随机延迟

      setTimeout(() => {
        intervalRef.current[3] = setInterval(() => {
          setOdometerValues(prevValues => [
            prevValues[0],
            prevValues[1],
            prevValues[2],
            (prevValues[3] + 1) % 10,
          ]);
        }, speed);
      }, Math.random() * 1000), // 第三个数字有 0-500ms 的随机延迟

    ];
  }, [speed]);

  const stopRolling = useCallback(() => {
    // 清除所有超时和定时器
    timeoutRef.current.forEach(timeout => clearTimeout(timeout));
    intervalRef.current.forEach(interval => clearInterval(interval));

    // 停止时设置每个数字为目标值
    setOdometerValues(targetValues);
  }, [targetValues]);

  useImperativeHandle(ref, () => ({
    start: () => setRolling(true),
    stop: () => setRolling(false),
    setTargetValues: (values) => setTargetValues(values),
    setSpeed: (newSpeed) => setSpeed(newSpeed) // 允许外部设置速度
  }));

  useEffect(() => {
    if (rolling) {
      startRolling();
    } else {
      stopRolling();
    }
    return () => stopRolling(); // 清理定时器
  }, [rolling, startRolling, stopRolling]);

  return (
    <div className="flex space-x-4">
      <Odometer value={odometerValues[0]} format="d" duration={speed / 1000} />
      <Odometer value={odometerValues[1]} format="d" duration={speed / 1000} />
      <Odometer value={odometerValues[2]} format="d" duration={speed / 1000} />
      <Odometer value={odometerValues[3]} format="d" duration={speed / 1000} />
    </div>
  );
});

export default ThreeDigitOdometer;