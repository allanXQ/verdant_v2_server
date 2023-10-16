const { peerOrders } = require("@models");
// const { peerEscrow } = require("@models");

// userId;
// ("f35108397b93");

// userId;
// ("539cda572db0");

const buys = [
  {
    orderId: "b00",
    userId: "539cda572db0",
    assetName: "verdant",
    orderType: "buyp2p",
    amount: 10,
    price: 100,
    totalAssetValue: 100,
  },
  {
    orderId: "b22",
    userId: "539cda572db0",
    assetName: "verdant",
    orderType: "buyp2p",
    amount: 10,
    price: 100,
    totalAssetValue: 100,
  },
  {
    orderId: "b3",
    userId: "539cda572db0",
    assetName: "verdant",
    orderType: "buyp2p",
    amount: 10,
    price: 100,
    totalAssetValue: 100,
  },
  {
    orderId: "b4",
    userId: "539cda572db0",
    assetName: "verdant",
    orderType: "buyp2p",
    amount: 10,
    price: 100,
    totalAssetValue: 100,
  },
];

const sells = [
  {
    orderId: "s1",
    userId: "f35108397b93",
    assetName: "verdant",
    orderType: "sellp2p",
    amount: 10,
    price: 100,
    totalAssetValue: 100,
  },
  {
    orderId: "s2",
    userId: "f35108397b93",
    assetName: "verdant",
    orderType: "sellp2p",
    amount: 10,
    price: 100,
    totalAssetValue: 100,
  },
  {
    orderId: "s3",
    userId: "f35108397b93",
    assetName: "verdant",
    orderType: "sellp2p",
    amount: 10,
    price: 100,
    totalAssetValue: 100,
  },
  {
    orderId: "s4",
    userId: "f35108397b93",
    assetName: "verdant",
    orderType: "sellp2p",
    amount: 10,
    price: 100,
    totalAssetValue: 100,
  },
];

// const peerEscrow = [
//   {
//     orderId: "s1",
//     orderType: "sellp2p",
//     userId: "f35108397b93",
//     assetName: "verdant",
//     amount: 10,
//   },
// ];

const createTrades = async () => {
  await peerOrders.insertMany([...buys, ...sells]);
};

module.exports = createTrades;

// createTrades();
