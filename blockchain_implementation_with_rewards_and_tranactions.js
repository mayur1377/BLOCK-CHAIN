const SHA256 = require('crypto-js/sha256');

/*
so , this , na , basically instead of using index and all that , its actually on no values , 
and the data part wasnt much "fulfilling" , 
so well have something called as transactions , 
in that from addres , where we getting money 
to adresss , where we sending it 
amoutn , how much "from address" is sending to "to address"
these are actually public key of someones walllet
*/
class transactions
{
    constructor(fromaddress , toaddress , amount)
    {
    this.fromaddress=fromaddress;
    this.toaddress=toaddress;
    this.amount=amount;
    }
}




class block
{
    
    constructor(timestamp , transactions , previoushash='')
    {
        this.timestamp=timestamp;
        this.transactions=transactions;
        this.previoushash=previoushash;
        this.hash=this.calculatehash();
        this.nonce=0;
    }
    /*
    here na , nonce this is just some number which we are taking 
    that we add it as one of the parameters in the "calculate hash"
    
    that we keep of calculating until we get some specified number of zero
    , specified number of zeroes matllab we setting it by "difficulty" basically
    */
    calculatehash()
    {
        return SHA256(this.previoushash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
    }
   
    //ade doing the proof of work here , until we get some specified nummber of zeroes , we keep on calculatin

    mineblock(difficulty) //proof of work
    {
        while(this.hash.substring(0 , difficulty)!==Array(difficulty+1).join("0"))
        {
            this.nonce++;
            this.hash=this.calculatehash();
        }
        console.log("BLOCK MINED : " + this.hash);
    }

    
}


class blockchain
{
    constructor()
    {
        this.chain=[this.creategenesisblock()];
        this.difficulty=2;
        this.pendingtracsactions=[]; //transactions stored are temp stored in this array and then included in the next block
        this.miningreward=100;
    }

    creategenesisblock()
    {
        return new block( "15/11/2022" , "first block" , "0");
    }

    getlatestblock()
    {
        return this.chain[this.chain.length-1];
    }

    /*
    mine pending transactions:
    will revice a mining reward address
    if sucessfully mined a block, send the reward to the miningaddress
    used for mining a block
    then push that block to chain
    reset pending transactions array and create new transactions to give the miner his reward
    */
    minependingtransactions(miningrewardaddress)
    {
        let b=new block(Date.now() , this.pendingtracsactions);
        b.mineblock(this.difficulty);
        console.log("BLOCK SUCESSFULLY MINED");
        this.chain.push(b);
        this.pendingtracsactions=[new transactions(null , miningrewardaddress , this.miningreward)];
    }


    /*
    sends all the transactions to a pending transactions

    */
    createtransaction(transactions)
    {
        this.pendingtracsactions.push(transactions);
    }


    /*
    what does this function do?
    basically the get balance function that a parameter "address"
    the it just goes through all the blocks to and check the from and to address of all the transactions in that particular block
    if toaddress==address , total amount adds up , 
    else decreases 
    then return the total address 
    */

    getbalance(address)
    {
        let sum=0;
        for(const block of this.chain)
        {
                for(const trans of block.transactions)
                {
                    if(address==trans.toaddress)
                    {
                        sum+=trans.amount;
                    } 
                    if(address==trans.fromaddress)
                    {
                        sum-=trans.amount;
                    }

                }
        }
        return sum;
    }

    /*
    check if the block chain is modified or uk , tampered basically
    how so??
    if iterates through the loop 
    */

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
/*
add1 and add2 are basically like public key of someone wallet irl when compared to cryto
*/
mcoin.createtransaction(new transactions('add1' , 'add2' , 100));
mcoin.createtransaction(new transactions('add2' , 'add1' , 50));

console.log("STARTING MINING");
/*
now after transactions are over they will be stored in that pending transaction array na , 
take those pending transactions  and mine it
*/
mcoin.minependingtransactions('MAYUR');// addresss  to whom to send , address of a person 


console.log("BALANCE IS EQUAL TO : " , mcoin.getbalance('MAYUR'));
//this na , when u check itll be 0 , since the transactions will be stored in pending transactions array
console.log("STARTING MINING AGAIN");
mcoin.minependingtransactions('MAYUR');

console.log("BALANCE IS EQUAL TO : " , mcoin.getbalance('MAYUR'));



