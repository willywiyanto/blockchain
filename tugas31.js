const crypto = require("crypto");

class Block {
    constructor(timestamp = "", data = []) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.getHash();
        this.prevHash = "";
        this.nonce = 0;
    }

 getHash() {
        return crypto
         .createHash("sha256")
         .update(JSON.stringify(this.data) + this.timestamp + this.prevHash + this.nonce)
         .digest("hex");
        }

    mine(difficulty) {
        while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
            this.nonce++;
            this.hash = this.getHash();
        }
    }
}

class Blockchain {
    constructor() {
        this.chain = [new Block(Date.now().toString())];
        this.difficulty = 1;
        this.blockTime = 30000;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.prevHash = this.getLastBlock().hash;
        block.hash = block.getHash();

        block.mine(this.difficulty);

        this.difficulty += Date.now() - parseInt(this.getLastBlock().timestamp) < this.blockTime ? 1 : -1;

        this.chain.push(block);
    }

    isValid(blockchain = this) {
        for (let i = 1; i < blockchain.chain.length; i++) {
            const currentBlock = blockchain.chain[i];
            const prevBlock = blockchain.chain[i - 1];

            if (currentBlock.hash !== currentBlock.getHash() || currentBlock.prevHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

const testchain = new Blockchain();
testchain.addBlock(new Block(Date.now().toString(), ["hello BUILDLERS1"]));
testchain.addBlock(new Block(Date.now().toString(), ["hello BUILDLERS2"]));
testchain.addBlock(new Block(Date.now().toString(), ["hello BUILDLERS3"]));

console.log(testchain);