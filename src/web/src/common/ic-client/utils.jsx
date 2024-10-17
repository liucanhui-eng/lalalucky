import BigNumber from "bignumber.js";

// 1 ICP = 10^8 e8s
const E8S_BASE = new BigNumber(10).pow(new BigNumber(8));

/** 将e8s转为显示到界面上的 */
export function e8sToIcp(e8s) {
  if (!e8s) {
    return "0";
  }
  return new BigNumber(e8s.toString(10)).div(E8S_BASE).toString(10);
}

/** 将icp转换成e8s */
export function icpToE8s(amount) {
  if (!amount) {
    return "0";
  }
  return new BigNumber(amount.toString(10)).times(E8S_BASE).toString(10);
}