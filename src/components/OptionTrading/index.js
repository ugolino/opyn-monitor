import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Header } from '@aragon/ui';

import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import OptionBoard from './OptionBoard';
import TabBoard from './TabBoard';
import BuyAndSell from './BuyAndSell';

import { getTokenBalance } from '../../utils/infura';
import { getOrderBook, isValid } from '../../utils/0x';
import { getVault } from '../../utils/graph';
import { eth_puts, eth_calls } from '../../constants/options';

const quoteAsset = {
  symbol: 'WETH',
  addr: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  decimals: 18,
}; // WETH

function OptionTrading({ user, theme }) {
  const [baseAsset, setBaseAsset] = useState(eth_puts[1]); // put 100

  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);

  const [tradeType, setTradeType] = useState('buy');
  const [selectedOrders, setSelectedOrders] = useState([]);

  // user balance
  // const [userETHBalance, setUserETHBalance] = useState(BigNumber(0)); // in eth
  const [baseAssetBalance, setBaseAssetBalance] = useState(BigNumber(0));
  const [quoteAssetBalance, setQuoteAssetBalance] = useState(BigNumber(0));

  const [vault, setVault] = useState({});


  // BaseAsset changeed: Update orderbook and base asset
  useEffect(() => {
    let isCancelled = false;

    // update orderbook
    const updateOrderBook = async () => {
      const res = await getOrderBook(baseAsset.addr, quoteAsset.addr);
      if (!isCancelled) {
        setAsks(res.asks.records.filter((record) => isValid(record)));
        setBids(res.bids.records.filter((record) => isValid(record)));
      }
    };

    // update baseAsset Balance
    const updateBaseBalance = async () => {
      const baseBalance = await getTokenBalance(baseAsset.addr, user);
      if (!isCancelled) {
        setBaseAssetBalance(new BigNumber(baseBalance));
      }
    };

    const updateVaultData = async () => {
      if (user === '') return;
      const userVault = await getVault(user, baseAsset.addr);
      if (!isCancelled) setVault(userVault);
    };
    updateOrderBook();
    updateBaseBalance();
    updateVaultData();
    const idOrderBook = setInterval(updateOrderBook, 1000);
    const idBaseBalance = setInterval(updateBaseBalance, 30000);
    const idUpdateVault = setInterval(updateVaultData, 10000);
    return () => {
      isCancelled = true;
      clearInterval(idOrderBook);
      clearInterval(idBaseBalance);
      clearInterval(idUpdateVault);
    };
  }, [baseAsset, user]);

  // update quote asset
  useEffect(() => {
    let isCancelled = false;
    const updateQuoteBalance = async () => {
      if (user === '') return;
      const quoteBalance = await getTokenBalance(quoteAsset.addr, user);
      if (!isCancelled) {
        setQuoteAssetBalance(new BigNumber(quoteBalance));
      }
    };
    updateQuoteBalance();
    const idQuoteAssetBalance = setInterval(updateQuoteBalance, 20000);
    return () => {
      isCancelled = true;
      clearInterval(idQuoteAssetBalance);
    };
  }, [user]);

  return (
    <WholeScreen>
      <FlexWrapper>
        <LeftPart>
          <Header />
          <Header />

          <BuyAndSell
            user={user}
            baseAsset={baseAsset}
            quoteAsset={quoteAsset}
            collateral={baseAsset.collateral}

            baseAssetBalance={baseAssetBalance}
            quoteAssetBalance={quoteAssetBalance}

            vault={vault}
            theme={theme}

            tradeType={tradeType}
            setTradeType={setTradeType}

            selectedOrders={selectedOrders}
            setSelectedOrders={setSelectedOrders}
          />
        </LeftPart>
        <RightPart>
          <Header primary="Trade ETH Options" />
          <OptionBoard
            puts={eth_puts}
            calls={eth_calls}
            baseAsset={baseAsset}
            setBaseAsset={setBaseAsset}
            setTradeType={setTradeType}
            setSelectedOrders={setSelectedOrders}
          />
          <br />
          {/* <FixBottom> */}
          <TabBoard
            asks={asks}
            bids={bids}
            user={user}
            option={baseAsset}
            quoteAsset={quoteAsset}
            tradeType={tradeType}
            selectedOrders={selectedOrders}
            setTradeType={setTradeType}
            setSelectedOrders={setSelectedOrders}
          />
          {/* </FixBottom> */}
        </RightPart>
      </FlexWrapper>
    </WholeScreen>
  );
}

OptionTrading.propTypes = {
  user: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
};


const LeftPart = styled.div`
  width: 20%;
  padding-right: 1.5%;
`;

const RightPart = styled.div`
  width: 80%;
`;

const WholeScreen = styled.div`
  textAlign: center;
  padding-left: 7%;
  padding-right: 7%;
  position: fixed;
  left: 0;
  right: 0;
  top: 6%;
  width: 100%;
  height: 100%;
`;

const FlexWrapper = styled.div`
  display: flex;
  height:87%
`;

export default OptionTrading;
