import { Finding, FindingSeverity, FindingType } from "forta-agent";
import { isZeroAddress } from "ethereumjs-util";
import Web3 from "web3";
import {
  CONTROLLER_ABI,
  AddressListABI,
  PoolABI,
  Accountant_ABI,
  Strategy_ABI,
  CM_ABI
} from "./abi";
import { FindingGenerator } from "forta-agent-tools";

const CONTROLLER_CONTRACT = "0xa4F1671d3Aee73C05b552d57f2d16d3cfcBd0217";

export const JUG_DRIP_FUNCTION_SIGNATURE = "drip(bytes32)";
export const JUG_CONTRACT = "0x19c0976f590D67707E62397C87829d896Dc0f1F1";

export const createFindingStabilityFee = (
  _strategy: string
): FindingGenerator => {
  return (metadata): Finding => {
    return Finding.fromObject({
      name: "Stability Fee Update Detection",
      description: "stability Fee is changed for related strategy's collateral",
      severity: FindingSeverity.High,
      type: FindingType.Info,
      alertId: "Vesper-1-3",
      protocol: "Vesper",
      metadata: {
        strategy: _strategy,
        collateralType: metadata?.arguments[0]
      }
    });
  };
};

export const createFindingIsUnderWater = (_strategy: string): Finding => {
  return Finding.fromObject({
    name: "Maker Type Strategy isUnderWater Detection",
    description: "IsUnderWater returned True for a Maker Strategy",
    severity: FindingSeverity.High,
    type: FindingType.Suspicious,
    alertId: "Vesper-1-2",
    protocol: "Vesper",
    metadata: {
      strategy: _strategy
    }
  });
};

export const createFindingLowWater = (
  _strategy: string,
  _collateralRatio: string,
  _lowWater: string
): Finding => {
  return Finding.fromObject({
    name: "Maker Type Strategy Collateral Ratio < lowWater Detection",
    description: "Collateral Ratio is below lowWater",
    severity: FindingSeverity.Critical,
    type: FindingType.Suspicious,
    alertId: "Vesper-1-1",
    protocol: "Vesper",
    metadata: {
      strategy: _strategy,
      collateralRatio: _collateralRatio,
      lowWater: _lowWater
    }
  });
};

export const createFindingHighWater = (
  _strategy: string,
  _collateralRatio: string,
  _highWater: string
): Finding => {
  return Finding.fromObject({
    name: "Maker Type Strategy Collateral Ratio > highWater Detection",
    description: "Collateral Ratio is above highWater",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    alertId: "Vesper-1-1",
    protocol: "Vesper",
    metadata: {
      strategy: _strategy,
      collateralRatio: _collateralRatio,
      highWater: _highWater
    }
  });
};

export const checkIsUnderWaterTrue = async (
  web3: Web3,
  address: string,
  blockNumber: string | number = "latest"
): Promise<boolean> => {
  const Strategy = new web3.eth.Contract(Strategy_ABI, address);

  const isUnderwater = await Strategy.methods
    .isUnderwater()
    .call({}, blockNumber);

  return isUnderwater;
};

export const getCollateralRatio = async (
  web3: Web3,
  address: string,
  blockNumber: string | number = "latest"
) => {
  const Strategy = new web3.eth.Contract(Strategy_ABI, address);
  const CM_ADDRESS = await Strategy.methods.cm().call({}, blockNumber);

  const CM = new web3.eth.Contract(CM_ABI, CM_ADDRESS);
  const collateralRatio = await CM.methods
    .getVaultInfo(address)
    .call({}, blockNumber);

  return collateralRatio;
};

export const getLowWater = async (
  web3: Web3,
  address: string,
  blockNumber: string | number = "latest"
): Promise<number> => {
  const Strategy = new web3.eth.Contract(Strategy_ABI, address);

  const lowWater = await Strategy.methods.lowWater().call({}, blockNumber);

  return lowWater;
};

export const getHighWater = async (
  web3: Web3,
  address: string,
  blockNumber: string | number = "latest"
): Promise<number> => {
  const Strategy = new web3.eth.Contract(Strategy_ABI, address);
  const highWater = await Strategy.methods.highWater().call({}, blockNumber);

  return highWater;
};

export const getCollateralType = async (
  web3: Web3,
  address: string,
  blockNumber: string | number = "latest"
): Promise<string> => {
  const Strategy = new web3.eth.Contract(Strategy_ABI, address);
  const collateralType = await Strategy.methods
    .collateralType()
    .call({}, blockNumber);

  return collateralType;
};
