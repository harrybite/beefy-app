import React, { memo, useCallback, useEffect, useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import BigNumber from 'bignumber.js';

import { byDecimals } from 'features/helpers/bignumber';
import PoolSummary from '../PoolSummary/PoolSummary';
import styles from './styles';
import { useSelector } from 'react-redux';
import PoolActions from '../PoolActions/PoolActions';
import AccordionDetails from '@material-ui/core/AccordionActions';
import { useLaunchpoolSubscriptions } from '../../../stake/redux/hooks';
import { launchpools } from '../../../helpers/getNetworkData';
import { getSingleTVL, getSingleAPY } from '../Materchef/connection';

const useStyles = makeStyles(styles);

const Pool = ({
  pool,
  index,
  tokens,
  apy,
  fetchBalancesDone,
  fetchApysDone,
  fetchVaultsDataDone,
}) => {
  const classes = useStyles();

  // console.log('Tokens ', tokens);

  const [isOpen, setIsOpen] = useState(false);
  const [tvl, setTVL] = useState(0);
  const [singleapy, setSingleAPY] = useState(0);
  const toggleCard = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const { subscribe } = useLaunchpoolSubscriptions();
  const balanceSingle = byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals);
  const sharesBalance = tokens[pool.earnedToken].launchpoolTokenBalance
    ? new BigNumber.sum(
        tokens[pool.earnedToken].launchpoolTokenBalance,
        tokens[pool.earnedToken].tokenBalance
      )
    : new BigNumber(tokens[pool.earnedToken].tokenBalance);
  const launchpoolId = useSelector(state => state.vault.vaultLaunchpool[pool.id]);
  const launchpool = launchpoolId ? launchpools[launchpoolId] : null;
  const activeLaunchpools = useSelector(state => state.vault.vaultLaunchpools[pool.id]);
  const multipleLaunchpools = activeLaunchpools.length > 1;

  useEffect(() => {
    const unsubscribes = activeLaunchpools.map(launchpoolId =>
      subscribe(launchpoolId, {
        poolApr: true,
        poolFinish: true,
      })
    );

    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  }, [subscribe, activeLaunchpools]);

  useEffect(() => {
    const init = async () => {
      const tvl = await getSingleTVL(pool.index);
      setTVL(tvl);

      const sapy = await getSingleAPY(pool.index);
      setSingleAPY(sapy);
    };
    init();
  }, [pool]);

  return (
    <Grid item xs={12} container key={index} className={classes.container} spacing={0}>
      <Accordion
        expanded={isOpen}
        className={classes.accordion}
        square={true}
        TransitionProps={{ unmountOnExit: true }}
      >
        <PoolSummary
          pool={pool}
          launchpool={launchpool}
          balanceSingle={balanceSingle}
          toggleCard={toggleCard}
          sharesBalance={sharesBalance}
          apy={apy}
          tvl={tvl}
          singleapy={singleapy}
          fetchBalancesDone={fetchBalancesDone}
          fetchApysDone={fetchApysDone}
          fetchVaultsDataDone={fetchVaultsDataDone}
          multipleLaunchpools={multipleLaunchpools}
        />
        <Divider variant="middle" className={classes.divider} />
        <AccordionDetails style={{ justifyContent: 'space-between' }}>
          <PoolActions pool={pool} balanceSingle={balanceSingle} sharesBalance={sharesBalance} />
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default memo(Pool);
