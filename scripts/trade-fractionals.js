// `npx hardhat run <script>`
const { ethers } = require("hardhat");
const SwapRouterABI = require("../abis/SwapRouter.json");
const hre = require("hardhat");

const SWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

const botAccounts = [
  process.env.ETHLISBON_1,
  process.env.ETHLISBON_2,
  process.env.ETHLISBON_3,
];

const tokenIn = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
const tokenOut = "0x92fB912B99a6dFe72e5b6e05EcD63b0E6E71059d";
const fee = ethers.BigNumber.from(10000);
const recipient = "0x1e36c297A70f94559c3Eb79381e03B77816dc4fF";
const deadline = Date.now() + 60;

async function main() {
  const provider = new ethers.providers.InfuraProvider(
    "rinkeby",
    process.env.RINKEBY_INFURA_KEY
  );

  const wallets = botAccounts.map(
    (account) => new ethers.Wallet(account, provider)
  );
  const signers = wallets.map((wallet) => wallet.connect(provider));
  const contracts = signers.map(
    (signer) => new ethers.Contract(SWAP_ROUTER_ADDRESS, SwapRouterABI, signer)
  );

  // const wallet = new ethers.Wallet(RINKEBY_ACCOUNT_1, provider);
  // const signer = wallet.connect(provider);
  // const contract = new ethers.Contract(
  //   SWAP_ROUTER_ADDRESS,
  //   SwapRouterABI,
  //   signer
  // );

  const gasPrice = await provider.getGasPrice();

  const possibleBuyPrices = [
    '0.001',
    '0.002',
    '0.003',
    '0.004',
    '0.005',
    '0.007',
    '0.008',
    '0.009',
    '0.02',
    '0.03',
  ];

  const buyPrices = botAccounts.map((account, idx) => possibleBuyPrices[Math.floor(Math.random() * 10)]);
  console.log(buyPrices);

  const options = {
    gasLimit: 200000,
    gasPrice,
  };

  console.log({ options });

  const txns = contracts.map(
    (contract, idx) =>
      console.log(`sending transaction for account ${idx}`) ||
      contract.exactInputSingle(
        {
          tokenIn,
          tokenOut,
          fee,
          recipient: wallets[idx].address,
          deadline,
          amountIn: ethers.utils.parseEther(buyPrices[idx]),
          amountOutMinimum: 0,
          sqrtPriceLimitX96: 0,
        },
        {
          gasLimit: 200000,
          gasPrice,
          value: ethers.utils.parseEther(buyPrices[idx]),
        }
      )
  );

  console.log("all sent! waiting for the receipt");

  const receipts = await Promise.allSettled(txns);

  receipts.forEach((receipt) => console.log(receipt));

  // const txn = contract.exactInputSingle({
  //   tokenIn,
  //   tokenOut,
  //   fee,
  //   recipient,
  //   deadline,
  //   amountIn: options.value,
  //   amountOutMinimum: 0,
  //   sqrtPriceLimitX96: 0,
  // }, options);

  // console.log("waiting for the receipt");
  // const receipt = await txn;

  // console.log("got the receipt");
  // console.log(receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
