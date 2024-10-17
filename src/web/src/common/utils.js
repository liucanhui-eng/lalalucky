// utils.js

export const ctime = (timestamp, type = 1) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  // 获取年、月、日、时、分、秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，因此需要+1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  if (type && type == 2) {
    return `${month}-${day} ${hours}:${minutes}`;
  }
  // 拼接为“年-月-日 时:分:秒”格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


  // const date = new Date(t * 1000);
  // const Y = date.getFullYear();
  // const M = (date.getMonth() + 1).toString().padStart(2, "0");
  // const D = date.getDate().toString().padStart(2, "0");
  // const h = date.getHours().toString().padStart(2, "0");
  // const m = date.getMinutes().toString().padStart(2, "0");
  // const s = date.getSeconds().toString().padStart(2, "0");
  // if (type && type == 2) {
  //   return `${M}/${D} ${h}:${m}`;
  // }
  // return `${Y}/${M}/${D} ${h}:${m}:${s}`;
};

export const maskString = (username) => {
  if (!username) return "";
  username = username.trim();
  const length = username.length;

  if (length <= 7) {
    return username.slice(0, -2) + "**"; // 长度小于等于7，替换最后两位
  }

  if (length <= 15) {
    return username.slice(0, 5) + "*".repeat(length - 5); // 长度大于7小于等于15，替换第6位之后的字符
  }

  return `${username.slice(0, 5)}...${username.slice(-5)}`; // 长度大于15，保留前5位和最后5位
};

export const formatNumber0 = (number) => {
  const num = parseFloat(number);

  // 如果输入无效数字，返回 '0'
  if (isNaN(num)) return "0";

 

  // 定义单位和对应的阈值
  const units = [
    { value: 10000000, symbol: "W" }, // 百万单位
    { value: 1000, symbol: "K" }, // 千单位
  ];

  // 处理大数值的单位转换
  for (const unit of units) {
    if (num >= unit.value) {
      const formatted = (num / unit.value).toString();
      return removeTrailingZeros(formatted) + unit.symbol;
    }
  }

  // 小于 1000 的数值处理，保留原有小数位，不做四舍五入
  return removeTrailingZeros(num.toString());
};

// 去掉小数点后的无效零
const removeTrailingZeros = (str) => {
  if (!str.includes('.')) return str; // 如果没有小数点，直接返回
  return str.replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1'); // 移除末尾的无效零
};

export const formatNumber1 = (number) => {
  const num = parseFloat(number);

  // 如果输入无效数字，返回 '0'
  if (isNaN(num)) return "--";

  // 如果数值非常小（小于0.001），直接返回'0'
  if (num < 0.001) {
    return "0";
  }

  // 定义单位和对应的阈值
  const units = [
    { value: 10000000, symbol: "W" }, // 百万单位
    { value: 1000, symbol: "K" }, // 千单位
  ];

  // 处理大数值的单位转换
  for (const unit of units) {
    if (num >= unit.value) {
      return (
        (num / unit.value).toFixed(3).replace(/(\.0+|(?<=\.\d{1,3})0+)$/, "") +
        unit.symbol
      );
    }
  }

  // 小于1000的数值处理，不做四舍五入，保留有效小数位
  if (num % 1 === 0) {
    // 如果是整数，直接返回
    return num.toString();
  } else {
    // 不是整数时，精确处理小数位，不做四舍五入，保留最多3位有效小数
    const strNum = num.toString();
    const [integerPart, decimalPart = ""] = strNum.split(".");

    // 去掉无效的末尾零
    let trimmedDecimal = decimalPart.substring(0, 3); // 截取前3位
    while (trimmedDecimal.endsWith("0")) {
      trimmedDecimal = trimmedDecimal.slice(0, -1);
    }

    // 组合整数部分和处理后的小数部分
    return trimmedDecimal ? `${integerPart}.${trimmedDecimal}` : integerPart;
  }
};


export const formatNumber = (number) => {
  const num = parseFloat(number);

  // 如果输入无效数字，返回 '0'
  if (isNaN(num)) return "0";

  // 如果数值非常小（小于0.001），直接返回'0'
  if (num < 0.001) {
    return "0";
  }

  // 定义单位和对应的阈值
  const units = [
    { value: 10000000, symbol: "W" }, // 百万单位
    { value: 1000, symbol: "K" }, // 千单位
  ];

  // 处理大数值的单位转换
  for (const unit of units) {
    if (num >= unit.value) {
      return (
        (num / unit.value).toFixed(3).replace(/(\.0+|(?<=\.\d{1,3})0+)$/, "") +
        unit.symbol
      );
    }
  }

  // 小于1000的数值处理，不做四舍五入，保留有效小数位
  if (num % 1 === 0) {
    // 如果是整数，直接返回
    return num.toString();
  } else {
    // 不是整数时，精确处理小数位，不做四舍五入，保留最多3位有效小数
    const strNum = num.toString();
    const [integerPart, decimalPart = ""] = strNum.split(".");

    // 去掉无效的末尾零
    let trimmedDecimal = decimalPart.substring(0, 3); // 截取前3位
    while (trimmedDecimal.endsWith("0")) {
      trimmedDecimal = trimmedDecimal.slice(0, -1);
    }

    // 组合整数部分和处理后的小数部分
    return trimmedDecimal ? `${integerPart}.${trimmedDecimal}` : integerPart;
  }
};

// 格式化过去时间的函数，支持传入时间对象或时间戳
export const formatPast = (date, type = "default", zeroFillFlag = true) => {
  const now = Date.now(); // 获取当前时间戳

  // 判断输入的类型，如果是数字并小于当前时间戳，则认为是时间戳
  let afferentTime;

  if (typeof date === "number") {
    // 判断是否是秒级时间戳（通常长度为10位）
    afferentTime = date > 1e12 ? date : date * 1000; // 秒级转毫秒
  } else if (date instanceof Date) {
    afferentTime = date.getTime(); // Date 对象转换为时间戳
  } else {
    // 尝试将字符串转换为时间戳
    afferentTime = new Date(date).getTime();
  }

  // 计算时间差
  const timeDiff = now - afferentTime;

  // 时间差判断并返回对应的格式
  if (timeDiff < 10000) return "JUST NOW"; // 10秒内
  if (timeDiff < 60000) return `${Math.floor(timeDiff / 1000)}s ago`; // 超过10秒少于1分钟
  if (timeDiff < 3600000) return `${Math.floor(timeDiff / 60000)}min ago`; // 超过1分钟少于1小时
  if (timeDiff < 86400000) return `${Math.floor(timeDiff / 3600000)}h ago`; // 超过1小时少于24小时

  const days = Math.floor(timeDiff / 86400000);

  if (type === "default") {
    if (days >= 365) return `${Math.floor(days / 365)} year ago`; // 大于等于365天
    if (days >= 30) return `${Math.floor(days / 30)} month ago`; // 大于等于30天
    return `${days} day ago`; // 其他情况返回天数
  }

  // 根据格式类型，格式化日期
  const dateObj = new Date(afferentTime);
  const Y = dateObj.getFullYear();
  const M = dateObj.getMonth() + 1;
  const D = dateObj.getDate();

  // 数字补零函数
  const zeroFill = (num) => (num > 9 ? num : `0${num}`);

  const zeroFillM = zeroFillFlag ? zeroFill(M) : M;
  const zeroFillD = zeroFillFlag ? zeroFill(D) : D;

  // 根据不同格式类型返回对应的日期格式
  switch (type) {
    case "-":
    case "/":
    case ".":
      return `${Y}${type}${zeroFillM}${type}${zeroFillD}`;
    case "年月日":
      return `${Y}${type[0]}${zeroFillM}${type[1]}${zeroFillD}${type[2]}`;
    case "月日":
      return `${zeroFillM}${type[0]}${zeroFillD}${type[1]}`;
    case "年":
      return `${Y}${type}`;
    default:
      return ""; // 处理其他不支持的格式类型
  }
};
