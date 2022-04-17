const run = require("../index.js");
const simpleSample = require("./samples/simple.json");
const withDataSample = require("./samples/withdata.json");
const { test, expect, describe } = require("@jest/globals");
const fs = require("fs");
const { BigNumber } = require("ethers");
const log = require("why-is-node-running");
const fromBlock = 14555003;
const toBlock = 14555203;
const rpc = process.env.MAINNET_RPC || "homestead";
const pagination = 300;
const contractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("Basic Tests", () => {
  test("reset", () => {
    fs.writeFileSync("tests/results.json", JSON.stringify({}));

    return;
  });

  test("simple", async () => {
    const balances = await run(
      contractAddress,
      rpc,
      fromBlock,
      toBlock,
      undefined,
      undefined,
      true
    );

    fs.writeFileSync("tests/samples/simple.json", JSON.stringify(balances));
    check(balances, simpleSample, "without pagination and data");

    return;
  });

  test.skip("Should work properly with pagination", async () => {
    const balances = await run(
      contractAddress,
      rpc,
      fromBlock,
      toBlock,
      {},
      pagination,
      true
    );

    check(balances, require("./samples/simple.json"), "simple pagination");

    return;
  });
  let x = require("./samples/simple.json");

  test.skip("Should work properly with data provided beforehand", async () => {
    const balances = await run(
      contractAddress,
      rpc,
      fromBlock,
      toBlock,
      JSON.parse(fs.readFileSync("tests/samples/simple.json", "utf8")),
      undefined,
      true
    );

    check(balances, withDataSample, "when data provided beforehand");
    fs.writeFileSync("tests/samples/withdata.json", JSON.stringify(balances));
    return;
  });

  test.skip("Should work properly with data provided beforehand + pagination", async () => {
    const balances = await run(
      contractAddress,
      rpc,
      fromBlock,
      toBlock,
      JSON.parse(fs.readFileSync("tests/samples/simple.json", "utf8")),
      50,
      true
    );

    check(
      balances,
      withDataSample,
      "when data provided beforehand + pagination"
    );
    return;
  });

  test("check errors", async () => {
    Object.keys(require("./results.json")).forEach((key) => {
      if (key === "lastUpdate") return;
      expect(require("./results.json")[key]).toBe(0);
    });
    console.log(process._getActiveHandles());

    return;
  });
  return;
});

function check(balances, sample, name) {
  let errors = 0;
  Object.keys(balances).forEach((key) => {
    try {
      const diff = BigNumber.from(balances[key]).sub(
        BigNumber.from(sample[key])
      );
      expect(diff.gt(0)).toBe(false);
      expect(diff.lt(0)).toBe(false);
    } catch (e) {
      errors++;
    }
  });
  const data = JSON.parse(fs.readFileSync("tests/results.json"));
  data[name] = errors;
  data["lastUpdate"] = Date.now();
  fs.writeFileSync("tests/results.json", JSON.stringify(data));
}
