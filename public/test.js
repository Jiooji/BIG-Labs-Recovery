const words = "decline ignore great ostrich piano torch whip scorpion actor hard path riot ancient sleep zero dial present insane vivid embark combine pulse latin tuition";

onmessage = (message) => {
    let iteration = 0;
    const allcombo = 24 * 24;
    let possword, poss_seed, seedword;
    const wordslist = words.split(' ');
    const seed_list = message.data.seed.split(' ');
    for (let i = 0; i < wordslist.length; i++) {
        possword = wordslist[i];
        for (let j = 0; j < seed_list.length; j++) {
            iteration += 1;
            console.log(iteration);
            //TODO fare il postMessage solo se la percentuale cambia (es: da 1% a 2%)
            postMessage({percentage: Math.floor(iteration * 100 / allcombo)});
            seedword = seed_list[j];
            poss_seed = message.data.seed.replace(seedword, possword);
            postMessage({seed: poss_seed});
        }
    }

    postMessage({result: false});
}
