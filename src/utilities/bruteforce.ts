import {
  getBaseKanaConfiguration,
  kana,
  KanaConfiguration,
  KanaLetter,
  kanaMapToArray,
  KanaNames,
  KanaRowNames,
} from "../utilities/kana";

export interface BruteForcePracticeStage {
  name: string;
  kana: KanaRowNames[];
}

const bruteForcePracticeStages: readonly BruteForcePracticeStage[] = Object.freeze([
  {
    name: "Samohlásky",
    kana: ["regular_vowel"],
  },
  {
    name: "Souhláska K",
    kana: ["regular_k"],
  },
  {
    name: "Souhláska S",
    kana: ["regular_s"],
  },
  {
    name: "Souhláska T",
    kana: ["regular_t"],
  },
  {
    name: "Souhláska N",
    kana: ["regular_n"],
  },
  {
    name: "Souhláska H",
    kana: ["regular_h"],
  },
  {
    name: "Souhláska M",
    kana: ["regular_m"],
  },
  {
    name: "Souhláska Y",
    kana: ["regular_y"],
  },
  {
    name: "Souhláska R",
    kana: ["regular_r"],
  },
  {
    name: "Souhláska W",
    kana: ["regular_w"],
  },
  {
    name: "Souhláska N (samostatná)",
    kana: ["regular_nn"],
  },
  {
    name: "Dakuten",
    kana: ["dakuten_g", "dakuten_z", "dakuten_d", "dakuten_b", "dakuten_p"],
  },
  {
    name: "Kombinace",
    kana: [
      "combination_k",
      "combination_s",
      "combination_c",
      "combination_n",
      "combination_h",
      "combination_m",
      "combination_r",
      "combination_g",
      "combination_j1",
      "combination_j2",
      "combination_b",
      "combination_p",
    ],
  },
]);

const getNextStage = (stage: BruteForcePracticeStage) =>
  bruteForcePracticeStages[bruteForcePracticeStages.findIndex((s) => s.name === stage.name) + 1];

const isFinalStage = (stage: BruteForcePracticeStage) =>
  bruteForcePracticeStages.findIndex((s) => s.name === stage.name) === bruteForcePracticeStages.length - 1;

const getKanaOfStage = (kanaType: KanaNames, stage: BruteForcePracticeStage): KanaLetter[] => {
  return stage.kana.reduce<KanaLetter[]>((acc, key) => acc.concat(kanaMapToArray(kana[kanaType][key])), []);
};

const getAllKanaForStage = (kanaType: KanaNames, stage: BruteForcePracticeStage): KanaLetter[] => {
  const stageIndex = bruteForcePracticeStages.findIndex((s) => s.name === stage.name);
  if (stageIndex === -1) throw Error("Invalid state");

  const allKana: KanaLetter[] = [];

  for (let i = 0; i <= stageIndex; i++) {
    allKana.push(...getKanaOfStage(kanaType, bruteForcePracticeStages[i]));
  }

  return allKana;
};

const buildKanaOfStage = (kanaType: KanaNames, stage: BruteForcePracticeStage, learning: boolean) =>
  learning ? bruteForce.getKanaOfStage(kanaType, stage) : bruteForce.getAllKanaForStage(kanaType, stage);

const getKanaConfigurationForStage = (
  kanaType: KanaNames,
  stage: BruteForcePracticeStage,
  includePrevious: boolean,
): KanaConfiguration => {
  const config = getBaseKanaConfiguration();

  const keys: KanaRowNames[] = [];
  keys.push(...stage.kana);

  if (includePrevious) {
    const stageIndex = bruteForcePracticeStages.findIndex((s) => s.name === stage.name);

    for (let i = 0; i < stageIndex; i++) {
      keys.push(...bruteForcePracticeStages[i].kana);
    }
  }

  keys.forEach((key) => (config[kanaType][key] = true));

  return config;
};

export const bruteForce = {
  stages: bruteForcePracticeStages,
  getNextStage,
  isFinalStage,
  getKanaOfStage,
  getAllKanaForStage,
  buildKanaOfStage,
  getKanaConfigurationForStage,
};
