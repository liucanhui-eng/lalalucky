import { e8sToIcp, icpToE8s } from './utils';
import { kvStorage } from "../kv-storage";
import { useUser } from "../../componentp/UserProvider";
import { getUserInfo } from "./identity";
import { Notify } from "@nutui/nutui-react";
import { icp_ledger_canister } from './open-canisters/icp_ledger_canister';
import { pay_center } from "declarations/pay_center";
import BigNumber from "bignumber.js";
const DEPOSIT_ERROR_RECORDS = '__DEPOSIT_ERROR_RECORDS__';

// error records structure
// {
//   ic_account_id: string, // 用户IC账户ID
//   blockIndex: bigint, // IC交易记录唯一标识
// }

// 错误重试间隔时间
const ERROR_RETRY_INTERVAL = 5000;
const TRASTER_FEES = { e8s: BigInt(icpToE8s('0.0001')) };

let user;

class ErrorRecordManager {
  ic_account_id = '';
  errorRecords = [];
  // 正在处理错误记录的标识
  errorProcessing = false;
  retryRecord = null;

  constructor() { }

  getErrorCacheKey() {
    return `${DEPOSIT_ERROR_RECORDS}_${this.ic_account_id}`;
  }

  /** 从本地存储中取出错误记录 */
  async getErrorRecordsFromCache() {
    if (!this.ic_account_id) {
      return [];
    }

    return kvStorage.getItem(this.getErrorCacheKey()) || [];
  }

  /** 将错误记录同步到本地存储中 */
  async syncErrorRecordsToCache() {
    if (!this.ic_account_id) {
      return;
    }

    return kvStorage.setItem(this.getErrorCacheKey(), this.errorRecords);
  }

  async setICAccountId(ic_account_id) {
    this.ic_account_id = ic_account_id;
    this.errorRecords = await this.getErrorRecordsFromCache();
  }

  async doFlashErrorRecords() {
    // 如果错误队列正在清理中，则不要重复调度
    if (this.errorProcessing) {
      return;
    }

    // 如果没有错误记录，则不需要处理
    if (!this.errorRecords?.length) return;
    // 开始处理错误记录
    this.errorProcessing = true;

    // 取出第一条错误记录进行重试
    this.retryRecord = this.errorRecords.shift();
    let isSuccess = false;

    try {
      // TODO: 执行提交交易记录
      // pay_center.deposit();
      const { blockIndex, tokens } = this.retryRecord;
      const a = await pay_center.deposit(blockIndex, tokens.e8s);// todo
      isSuccess = true;
      
    } catch (error) {
      console.error('重试转账失败', error);
      this.addErrorRecord(this.retryRecord);
    } finally {
      this.flasingError = false;
      
    }

    if(isSuccess) {
      this.flashErrors();
      // 如果提交成功，同步当前错误记录到本地存储中
      await syncErrorRecordsToCache();
      // 因为有记录被同步，因此需要更新用户信息
      await user.update();
    }
  }

  flashErrors() {
    setTimeout(() => {
      this.doFlashErrorRecords();
    }, ERROR_RETRY_INTERVAL);
  }

  async addErrorRecord(record) {
    this.errorRecords.push(record);
    await this.syncErrorRecordsToCache();
    this.flashErrors();
  }
}

const errorRecordManager = new ErrorRecordManager();

// const xx = useDepositManager();
// xx.updateBlance();

export function useDepositManager() {
  user = useUser();

  // 用户点击更新余额按钮时，调用此方法
  const updateBlance = async () => {
    // 1. 从这里获取用户信息，确保用户已登录，并获取到用户的最新信息
    const userInfo = await getUserInfo().catch((e) => {
      console.error('获取用户信息失败', e);
      Notify.warn('Please login first');
    });
    console.log('--------------用户信息', userInfo)
    // 无法获取用户信息，说明用户没有II会话，则直接终止
    if (!userInfo) {
      return;
    }

    // 更新全局上下文中的用户信息
    user.updateFromCache();

    // 2.1 尝试清理错误记录
    // 2.1.1 设置当前错误记录管理器执行错误处理的IC账号ID
    await errorRecordManager.setICAccountId(userInfo.ic_account_id);
   
    // 2.1.2 执行错误记录处理
    errorRecordManager.flashErrors();

    // 2.2 获取用户ICP余额
    const tokens = await icp_ledger_canister.account_balance_dfx({ account: userInfo.ic_account_id });
    console.log('--------------获取用户ICP余额', tokens, tokens.e8s)
    const icpCount = e8sToIcp(tokens.e8s);
    console.log('--------------获取用户ICP余额 icpCount', icpCount)


    // 3. 判断用户余额是否小于0.001，如果小于0.001，则不转账
    // todo 测试 之前是0.001
    if (BigNumber(icpCount).lt('0.001')) {
      console.log('--------------用户余额是否小于0.001')
      return;
    }

    // 4. 执行转账
    // 4.1 获取支付中心账户地址
    // TODO: 获取支付中心账户地址
    // const payCenterAddress = await pay_center.getAccountAddress({});  
    console.log('--------------获取支付中心账户地址 参数', 'lucky_win')
    const payCenterAddress = await pay_center.get_address();//todo
    console.log('--------------获取支付中心账户地址 返回', payCenterAddress)
    
    // 4.1 将用户账户中的ICP转给支付中心账户
    console.log('--------------将用户账户中的ICP转给支付中心账户  入参', {
      to: payCenterAddress,
      fee: { e8s: 10000n },
      memo: 0n,
      from_subaccount: [],
      created_at_time: [],
      amount: {e8s: tokens.e8s -10000n},// todo e8sToIcp(tokens.e8s - 10000)
    })

    const blockIndex = await icp_ledger_canister.send_dfx({
      to: payCenterAddress,
      fee: { e8s: 10000n },
      memo: 0n,
      from_subaccount: [],
      created_at_time: [],
      amount: {e8s: tokens.e8s -10000n},// todo e8sToIcp(tokens.e8s - 10000)
    });

    console.log('--------------将用户账户中的ICP转给支付中心账户  返回', blockIndex)
    let isRecordSuccess = false;
    // 4.2 将转账记录到支付中心
    try {
      // TODO: 4.2.1 将转账记录到支付中心 
      console.log('--------------将转账记录到支付中心  入参', blockIndex, tokens.e8s)
      const pdeposit = await pay_center.deposit(blockIndex, tokens.e8s);// todo

      console.log('--------------将转账记录到支付中心  返回', pdeposit)

      isRecordSuccess = true;
    } catch (error) {
      // 4.2.2 如果转账失败，则记录错误
      const errorRecord = {
        blockIndex: blockIndex,
        amount: tokens
      };
      errorRecordManager.addErrorRecord(errorRecord);
    }

    if(isRecordSuccess) {
      // 4.2.3 记录转账成功，则更新用户信息
      await user.update();
    }
  }

  return {
    updateBlance,
  };
}