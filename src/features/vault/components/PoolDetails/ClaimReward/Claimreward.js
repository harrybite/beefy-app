/* eslint-disable react/react-in-jsx-scope */

const claimABI = [
  {
    inputs: [],
    name: 'claimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const RewardClaim = async (web3, tokenAddress, userAddress, id) => {
  try {
    const contract = new web3.eth.Contract(claimABI, tokenAddress);
    const data = await contract.methods.claimRewards(id).send({ from: userAddress });
    if (data.status) {
      return true;
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error) {
    throw error;
  }
};
