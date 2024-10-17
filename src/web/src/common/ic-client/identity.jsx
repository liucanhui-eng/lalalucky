'use client';
import { product as project_backend } from "declarations/product";
import { product as project_backend2 } from "declarations/product";
import { product as project_backend3 } from "declarations/product";
import { pay_center } from "declarations/pay_center";
import { icp_ledger_canister } from "./open-canisters/icp_ledger_canister";
import { Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { cacheUserInfo, clearCachedUserInfo, getCachedUserInfo } from "./storage";

import { Notify } from '@nutui/nutui-react'
import CLoading from "../../componentp/CLoading";
import { MILLISECOND, YEAR } from "./time";

const backendAgent = Actor.agentOf(project_backend);
const backend2Agent = Actor.agentOf(project_backend2);
const backend3Agent = Actor.agentOf(project_backend3);
const payCenterAgent = Actor.agentOf(pay_center);
const icpLedgerAgent = Actor.agentOf(icp_ledger_canister);

export function getBackend() {
  const path = location.pathname;
  if (path.startsWith('/v2')) {
    return project_backend2;
  }
  return project_backend;
}

async function replaceIdentity(authClient) {
  const identity = authClient.getIdentity();
  if(authClient.settedIdentity === identity) return;

  const expireTime = identity.getDelegation().delegations[0].delegation.expiration;

  console.log('登录成功，会话有效期至：', identity.getDelegation().delegations[0].delegation, expireTime, new Date(Number(expireTime / 1000000n)));

  backendAgent?.replaceIdentity?.(identity);
  backend2Agent?.replaceIdentity?.(identity);
  backend3Agent?.replaceIdentity?.(identity);
  payCenterAgent?.replaceIdentity?.(identity);
  icpLedgerAgent?.replaceIdentity?.(identity);
  authClient.settedIdentity = identity;
}

function onIISessionExpires() {
  console.log('----onExpires----');
}

async function onIILoginSuccess() {
  const authClient = await getAuthClient();
  await replaceIdentity(authClient);

  authClient.idleManager.registerCallback(onIISessionExpires);
  console.log('----onIILoginSuccess----');
}

let authClient = null;

async function getAuthClient() {
  if (!authClient) {
    authClient = AuthClient.create({
      idleOptions: {
        idleTimeout: Number(YEAR / MILLISECOND),
        disableDefaultIdleCallback: true,
        onIdle: onIISessionExpires,
      },
    });
  }

  return authClient;
}

export async function isIIAuthenticated() {
  const authClient = await getAuthClient();

  const isAuthenticated = await authClient.isAuthenticated();

  if (isAuthenticated) {
    await replaceIdentity(authClient);
  }

  return isAuthenticated;
}

export async function iiLogin() {
  const authClient = await getAuthClient();
  
  return new Promise((resolve, reject) => {
    authClient.login({
      maxTimeToLive: YEAR,
      identityProvider: process.env.DFX_NETWORK === 'local' ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/` : 'https://identity.ic0.app',
      onSuccess: resolve,
      onError: reject,
    });
  })
  .then(() => {
    return onIILoginSuccess();
  }).catch((err) => {
    console.error('Internet Computer Identity登录失败', err);
    throw err;
  });
}

/** 获取用户信息，如果没有认证登录的话，会强制认证登录 */
export async function getUserInfo(showLoading = false) {
  let isAuthenticated = await isIIAuthenticated();

  if(!isAuthenticated){
    // 如果没有认证会话，则进行认证
    await iiLogin();
    isAuthenticated = await isIIAuthenticated();
  }

  // 如果认证成功了，则已替换完agent中的身份信息，接着调用后端接口进行
  if (isAuthenticated) {
    if (showLoading) {
      CLoading.show();
    }

    const userInfo = await pay_center.show_user().catch((err) => {
      console.error('获取用户信息失败', err);
      Notify.warn('Get user info failed：' + err.message);
      CLoading.hide();
      throw err;
    });
    console.log('获取用户信息成功', userInfo);
    await cacheUserInfo(userInfo);
    CLoading.hide();
    return userInfo;
  }

  return null;
}

/** 获取当前用户的Principal */
export async function getPricipal() {
  const isAuthenticated = await isIIAuthenticated();
  if (!isAuthenticated) {
    await getUserInfo();
  }

  const authClient = await getAuthClient();

  return authClient.getIdentity().getPrincipal();
}


export async function iiLogout() {
  const authClient = await getAuthClient();
  const res = await authClient?.logout();
  clearCachedUserInfo();
  console.log('iiLogout', res);
  return res;
}