import Web3 from 'web3';
import { materchef, materchefabi } from './MsterChef';
const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org'));

export const getContract = async () => {
  try {
    const contract = new web3.eth.Contract(materchefabi, materchef);
    return contract;
  } catch (error) {
    console.log('error', error);
  }
};

export const getSingleTVL = async id => {
  try {
    const contract = await getContract();
    const tvl = await contract.methods.totalValueLocked(id).call();
    return Number(tvl) / 10 ** 18;
  } catch (error) {
    console.log('error', error);
  }
};

export const getSingleAPY = async id => {
  try {
    const contract = await getContract();

    const tvl = await contract.methods.calculateAPR(id).call();

    return Number(tvl) / 10 ** 18;
  } catch (error) {
    console.log('error', error);
  }
};

export const totaltvl = async () => {
  try {
    const contract = await getContract();
    const tvl = await contract.methods.totalValueLockedAllPools().call();
    return Number(tvl) / 10 ** 18;
  } catch (error) {
    console.log('error', error);
  }
};

export const userValuePoolLocked = async (id, address) => {
  try {
    const contract = await getContract();
    const tvl = await contract.methods.userValueLocked(id, address).call();
    return Number(tvl) / 10 ** 18;
  } catch (error) {
    console.log('error', error);
  }
};

export const userReward = async (id, address) => {
  try {
    const contract = await getContract();
    const tvl = await contract.methods.calculatePendingRewards(id, address).call();
    return Number(tvl) / 10 ** 18;
  } catch (error) {
    // console.log('error', error);
  }
};

export const userValuePoolLockedWitDecimal = async (id, address) => {
  try {
    const contract = await getContract();
    const tvl = await contract.methods.userValueLocked(id, address).call();
    return tvl;
  } catch (error) {
    console.log('error', error);
  }
};
