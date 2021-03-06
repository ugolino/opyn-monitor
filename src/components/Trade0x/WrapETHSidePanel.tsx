import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';


import {
  SidePanel, Button, TextInput, useTheme,
} from '@aragon/ui';
import { BalanceBlock, SectionTitle, Comment } from '../common/index';

import { wrapETH, unwrapETH } from '../../utils/web3';
import { toBaseUnitBN, toTokenUnitsBN } from '../../utils/number';
import { getBalance } from '../../utils/infura';



type WrapETHModalProps = {
  user: string,
  helperText: string,
  setHelperText: Function,
  wethBalance: BigNumber,
  opened: boolean,
  setOpen: Function,
};

function WrapETHModal({
  user, wethBalance, opened, setOpen, helperText, setHelperText,
}: WrapETHModalProps) {
  const theme = useTheme();
  const [wrapAmount, setWrapAmount] = useState(new BigNumber(0));
  const [unWrapAmount, setUnwrapAmount] = useState(new BigNumber(0));

  const [ethBalance, setETHBalance] = useState(new BigNumber(0));

  const onChangeWrapAmount = (event) => {
    const amount = event.target.value;
    if (!amount) {
      setWrapAmount(new BigNumber(0));
      return;
    }
    setWrapAmount(new BigNumber(amount));
  };

  const onChangeUnWrapAmount = (event) => {
    const amount = event.target.value;
    if (!amount) {
      setUnwrapAmount(new BigNumber(0));
      return;
    }
    setUnwrapAmount(new BigNumber(amount));
  };

  useEffect(() => {
    if (!opened || !user) return;
    let isCancelled = false;

    const updateETHBalance = async () => {
      if (user === '') return;
      const quoteBalance = await getBalance(user);
      if (!isCancelled) {
        setETHBalance(new BigNumber(quoteBalance));
      }
    };
    updateETHBalance();
    const idETHBalance = setInterval(updateETHBalance, 20000);
    return () => {
      isCancelled = true;
      clearInterval(idETHBalance);
    };
  }, [opened, user]);

  return (
    <SidePanel
      title=""
      opened={opened}
      onClose={() => {
        setOpen(false);
        setHelperText('');
      }}
    >
      <br />

      <div style={{ color: theme.warning }}>
        {helperText}
      </div>

      <SectionTitle title="Wrap WETH" />
      <div style={{ padding: '2%' }}>
        <BalanceBlock asset="Your ETH Balance" balance={ethBalance.toNumber()} />
      </div>

      {/* </div> */}
      <div style={{ display: 'flex' }}>
        <div style={{ width: '60%' }}>
          <TextInput wide type="number" value={wrapAmount.toNumber()} onChange={onChangeWrapAmount} />
        </div>
        <div style={{ width: '30%' }}>
          <Button
            onClick={() => {
              wrapETH(toBaseUnitBN(wrapAmount, 18).toString());
            }}
            label="Wrap"
          />
        </div>
      </div>

      <Comment text="After you wrap your ETH to WETH, you can unwrap them back to ETH anytime." />
      <br />
      <SectionTitle title="Unwrap WETH" />
      <div style={{ padding: '2%' }}>
        <BalanceBlock asset="Your WETH Balance" balance={toTokenUnitsBN(wethBalance, 18).toNumber()} />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '60%' }}>
          <TextInput wide type="number" value={unWrapAmount.toNumber()} onChange={onChangeUnWrapAmount} />
        </div>
        <div style={{ width: '30%' }}>
          <Button
            onClick={() => {
              unwrapETH(toBaseUnitBN(unWrapAmount, 18).toString());
            }}
            label="Unwrap"
          />
        </div>
      </div>
    </SidePanel>
  );
}

export default WrapETHModal;
