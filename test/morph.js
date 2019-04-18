const { morphDNA, generateMutationDNA } = require("../util/meta-maker");

const dna = "01-70-81-55-89-64-00-00";
const mutationDna = "00-99-99-00";
const gen = 1;

const res = generateMutationDNA(gen, mutationDna);

console.log(res);
