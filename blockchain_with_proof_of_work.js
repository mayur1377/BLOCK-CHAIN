const SHA256 = require('crypto-js/sha256');

class block
{
    
    constructor(index , timestamp , data , previoushash='')
    {
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previoushash=previoushash;
        this.hash=this.calculatehash();
        this.nonce=0;
    }
    calculatehash()
    {
        return SHA256(this.index+this.previoushash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
    }
    
    mineblock(difficulty)
    {
        // this.temp=[]
        while(this.hash.substring(0 , difficulty)!==Array(difficulty+1).join("0"))
        {
            this.nonce++;
            // this.temp.push(this.nonce);
            this.hash=this.calculatehash();
        }
        console.log("BLOCK MINED : " + this.hash);
        // console.log(this.temp.join(','));
    }

    
}

/*
ok so basically this hash function works like encryption , except there is no going back
the sha256 converts the plain text to some 160 bits?? cause of the hash function

*/

class blockchain
{
    constructor()
    {
        this.chain=[this.creategenesisblock()];
        this.difficulty=2;
    }

    creategenesisblock()
    {
        return new block(0 , "15/11/2022" , "first block" , "0");
    }

    getlatestblock()
    {
        return this.chain[this.chain.length-1];
    }


    addblock(newblock)
    {
        newblock.previoushash=this.getlatestblock().hash;
        newblock.mineblock(this.difficulty);
        this.chain.push(newblock);
    }

    iscorrect()
    {
        for(let i=1 ; i<this.chain.length ; i++)
        {
            const currentblock=this.chain[i];
            const previousblock=this.chain[i-1];

            if(currentblock.previoushash!==previousblock.hash) return "FALSE";
            if(currentblock.hash!==currentblock.calculatehash()) return "FALSE";
        }
        return "YES";
    }
    
}

let mcoin=new blockchain();
console.log("MINING BLOCK 1 : ");
mcoin.addblock(new block(1 , "14/11/2022" , {amount : 4}));
console.log("MINING BLOCK 2 : ");
mcoin.addblock(new block(2 , "15/11/2022" , {amount : 87}));
console.log("MINING BLOCK 3 : ");
mcoin.addblock(new block(3 , "16/11/2022" , {amount : 10}));




// console.log("IS BLOCK CHAIN VALID ? " + mcoin.iscorrect());
// mcoin.chain[2].data={amount: 100};
// console.log("IS BLOCK CHAIN VALID ? " + mcoin.iscorrect());


/*

checking if tampering with the data will break the chain?? yes , it will cause the hash will change , 

// console.log("IS BLOCK CHAIN VALID ? " + mcoin.iscorrect());
// mcoin.chain[2].data={amount: 100};
// console.log("IS BLOCK CHAIN VALID ? " + mcoin.iscorrect());

because the hash value has been changed , when we check with the previous hash and current hash , it wont be same


// but oh no , what if you recalculate in that block all the hash again and put it in the block?? 
// lets try


 console.log("IS BLOCK CHAIN VALID ? " + mcoin.iscorrect());
 mcoin.chain[2].data={amount: 100};
mcoin.chain[2].hash=mcoin.chain[2].calculatehash();
console.log("IS BLOCK CHAIN VALID ? " + mcoin.iscorrect());


but again it show as not valid , 
casuse even if we calculated the block, but the relationship with the previous block is again broken

so what to do to overcome this , calculate the whole hashes from the blocks after it  ,  then only the 
block chain will be valid


so this is something we dont want , hence we do proof of work , ie mining


*/

 
