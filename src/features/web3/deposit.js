import { vaultABI } from '../configure';
import { enqueueSnackbar } from '../common/redux/actions';

export const deposit = async ({
  web3,
  address,
  isAll,
  amount,
  poolID,
  contractAddress,
  dispatch,
}) => {
  const contract = new web3.eth.Contract(vaultABI, contractAddress);
  const data = await _deposit({ web3, contract, isAll, amount, poolID, address, dispatch });
  return data;
};

const _deposit = ({ web3, contract, amount, isAll, poolID, address, dispatch }) => {
  return new Promise((resolve, reject) => {
    if (isAll) {
      console.log('Vault deposit tokenAddress ALL', poolID);
      contract.methods
        .depositAll(poolID)
        .send({ from: address })
        .on('transactionHash', function (hash) {
          dispatch(
            enqueueSnackbar({
              message: hash,
              options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
              },
              hash,
            })
          );
        })
        .on('receipt', function (receipt) {
          resolve();
        })
        .on('error', function (error) {
          reject(error);
        })
        .catch(error => {
          reject(error);
        });
    } else {
      console.log('Vault deposit tokenAddress ALLNot', poolID);
      contract.methods
        .deposit(poolID, amount)
        .send({ from: address })
        .on('transactionHash', function (hash) {
          console.log(hash);
          dispatch(
            enqueueSnackbar({
              message: hash,
              options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
              },
              hash,
            })
          );
        })
        .on('receipt', function (receipt) {
          console.log(receipt);
          resolve();
        })
        .on('error', function (error) {
          console.log(error);
          reject(error);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    }
  });
};
