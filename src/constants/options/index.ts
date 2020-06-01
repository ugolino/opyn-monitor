import * as tokens from '../tokens'
import { optionWithStat } from '../../types'
import BigNumber from 'bignumber.js';

export const blackList = [
  "0x67904e24b071d1406a63eceddea6ba0f4a79ab1e", // testing yDai insurance
]

export const defaultOption: optionWithStat = {
  title: '',
  addr: '',
  type: 'insurance',
  symbol: '',
  name: '',
  decimals: 0,
  oracle: '',
  collateral: tokens.OPYN_ETH,
  underlying: tokens.cDAI,
  strike: tokens.USDC,
  strikePrice: 1,
  minRatio: 1,
  exchange: '',
  uniswapExchange: '',
  expiry: 0,
  totalCollateral: new BigNumber(0),
  totalExercised: new BigNumber(0),
  totalSupply: new BigNumber(0)
}