import { MnemonicKey, LCDClient } from "@terra-money/terra.js";

function checkseed(seed, address, blockchain = "Terra"){
    
    var chain, possaddress, wallet;

    if (blockchain === "Terra"){
        chain = new LCDClient("https://pisco-lcd.terra.dev/", "pisco-1");
    }

    const key = new MnemonicKey({mnemonic: seed});
    wallet = chain.wallet(key);
    possaddress = wallet.key.accAddress;

    if (possaddress === address){
        return true;
    }
    else{
        return false;
    }
}

async function one_error_allwords(seed, words, address, callback){
    let iteration = 0;
    const allcombo = 24 * 24;
    var possword, poss_seed, seedword, seed_list, wordslist, i, j;
    wordslist = words.split(' ');
    seed_list = seed.split(' ');
    for (i = 0; i<wordslist.length; i++){
        possword = wordslist[i];
        for (j = 0; j<seed_list.length; j++){
            iteration += 1;
            callback(Math.floor(iteration * 100 / allcombo));
            seedword = seed_list[j];
            poss_seed = seed.replace(seedword, possword);
            if (checkseed(poss_seed, address)){
                return poss_seed;
            }
        }
    }

    return false;
}

export { one_error_allwords };