import React from 'react';
import BigNumber from 'bignumber.js'

import { BalanceBlock, RatioTag, HelperText } from '../common/index';
import { formatDigits, toTokenUnitsBN } from '../../utils/number';
import * as types from '../../types';

type HeaderDashboardProps = {
  option: types.option
  ratio: number,
  vault: types.vault,
  newRatio: number,
  useCollateral: boolean,
  multiplier: BigNumber
};

const HeaderDashboard = ({
  option,
  ratio,
  vault,
  newRatio,
  useCollateral,
  multiplier
}: HeaderDashboardProps) => {

  const tokenInUnit = vault.oTokensIssued
    ? toTokenUnitsBN(vault.oTokensIssued, option.decimals)
      .div(multiplier)
      .toString()
    : '0';
  const collateralBalance = vault.collateral
    ? toTokenUnitsBN(vault.collateral, option.collateral.decimals).toString()
    : '0';

  return (
    <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '30%' }}>
        <BalanceBlock asset="Total Collateral" balance={formatDigits(collateralBalance, 6)} />
      </div>
      <div style={{ width: '50%' }}>
        <BalanceBlock asset={`${option.symbol} Issued`} balance={tokenInUnit.toString()} />
      </div>
      <div style={{ width: '20%' }}>
        <>
          <div style={{ fontSize: 14, padding: 3 }}>
            Current Ratio
            {' '}
            {ratio > 0 ? (
              <RatioTag
                isSafe={ratio >= option.minRatio}
                ratio={ratio}
                useCollateral={useCollateral}
              />
            ) : (
                <></>
              )}
          </div>
          <div style={{ fontSize: 24, padding: 3 }}>
            <span style={{ fontSize: 24 }}>{formatDigits(ratio, 5).split('.')[0]}</span>
            .
            <span style={{ fontSize: 18 }}>
              {formatDigits(ratio, 5).split('.')[1]}
              {' '}
            </span>
            {option.minRatio > 0 &&
              <span style={{ fontSize: 16 }}>
                {' '}
                /
                {' '}
                {option.minRatio}
                {' '}
              </span>
            }
          </div>
          <>
            {' '}
            {newRatio !== ratio &&
              <HelperText label="New Ratio" amt={newRatio.toString()} />
            }
          </>
        </>
      </div>
    </div>
  );
};

export default HeaderDashboard;
