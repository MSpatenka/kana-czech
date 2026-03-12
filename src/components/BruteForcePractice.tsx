import { Button, Container, Group, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useRef, useState } from "react";
import { bruteForce } from "../utilities/bruteforce";
import { getDefaultRomaji, KanaChars, KanaLetter, KanaNames, spacedRepetitionStream } from "../utilities/kana";
import { tooltipProps } from "../utilities/tooltip";
import BruteForcePracticeOptions from "./BruteForcePracticeOptions";
import KanaAnswerTooltipHint from "./KanaAnswerTooltipHint";
import PlayKanaSoundButton from "./PlayKanaSoundButton";
import { MiscPracticeOptions } from "./PracticeCard";
import PracticeKanaInput from "./PracticeKanaInput";
import PracticeOptions from "./PracticeOptions";

const defaultStatThresholds = Object.freeze({
  learning: {
    perKanaLimit: 5,
    rollingWindowSize: 20,
    rollingWindowCorrectLimit: 17,
  },
  reviewing: {
    perKanaLimit: 1,
    rollingWindowSize: 20,
    rollingWindowCorrectLimit: 17,
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const devStatThresholds = Object.freeze({
  learning: {
    perKanaLimit: 3,
    rollingWindowSize: 6,
    rollingWindowCorrectLimit: 4,
  },
  reviewing: {
    perKanaLimit: 1,
    rollingWindowSize: 6,
    rollingWindowCorrectLimit: 4,
  },
});

const statThresholds = defaultStatThresholds;

const buildRemainingKanaLimits = (kanaArray: KanaLetter[], limit: number) => {
  if (limit <= 0) throw Error();
  return Object.assign({}, ...kanaArray.map((kana) => ({ [kana.kana]: limit })));
};

const countStatGoals = (stats: BruteForcePracticeStats) => {
  const rollingCorrectCount = stats.rollingWindow.reduce((acc, val) => acc + (val ? 1 : 0), 0);

  const remainingLimitsCount = Object.keys(stats.remainingLimits).length;

  return { remainingLimitsCount, rollingCorrectCount };
};

interface BruteForcePracticeStats {
  correctCount: number;
  totalCount: number;
  remainingLimits: { [key: string]: number };
  rollingWindow: boolean[];
  rollingWindowInEffect: boolean;
}

export interface BruteForcePracticeProps {
  kanaType: KanaNames;
}

function BruteForcePractice({ kanaType }: BruteForcePracticeProps) {
  const [openedOptions, { toggle: toggleOptions }] = useDisclosure(true);

  const [stage, setStage] = useState({ stage: bruteForce.stages[0], learning: true });
  const [stageSatisfied, setStageSatisfied] = useState(false);
  const nextStage = bruteForce.getNextStage(stage.stage);
  const kanaOfStage = bruteForce.buildKanaOfStage(kanaType, stage.stage, stage.learning);

  const [stats, setStats] = useState<BruteForcePracticeStats>({
    correctCount: 0,
    totalCount: 0,
    remainingLimits: buildRemainingKanaLimits(kanaOfStage, statThresholds.learning.perKanaLimit),
    rollingWindow: [],
    rollingWindowInEffect: false,
  });
  const effectiveStatThresholds = statThresholds[stage.learning ? "learning" : "reviewing"];
  const statCounts = {
    ...countStatGoals(stats),
    remainingLimitsTotal: Object.values(stats.remainingLimits).reduce<number>((acc, val) => acc + val, 0),
  };

  const [miscOptions, setMiscOptions] = useState<MiscPracticeOptions>({ showCorrectAnswer: true });

  const streamRef = useRef(spacedRepetitionStream(kanaOfStage));

  const [currentKana, setCurrentKana] = useState(streamRef.current.current());

  const [firstEncounterKana, setFirstEncounterKana] = useState<KanaChars[]>(kanaOfStage.map((k) => k.kana));
  const firstEncounter = firstEncounterKana.includes(currentKana.kana);

  const computeNewStats = (correct: boolean): BruteForcePracticeStats => {
    const newRemainingLimits = { ...stats.remainingLimits };
    if (correct && Object.prototype.hasOwnProperty.call(newRemainingLimits, currentKana.kana)) {
      newRemainingLimits[currentKana.kana]--;

      if (newRemainingLimits[currentKana.kana] === 0) {
        delete newRemainingLimits[currentKana.kana];
      }
    }

    let newRollingWindow: boolean[] = [];
    if (stats.rollingWindowInEffect) {
      newRollingWindow = [...stats.rollingWindow];
      if (newRollingWindow.push(correct) > effectiveStatThresholds.rollingWindowSize) newRollingWindow.shift();
    }

    return {
      correctCount: correct ? stats.correctCount + 1 : stats.correctCount,
      totalCount: stats.totalCount + 1,
      remainingLimits: newRemainingLimits,
      rollingWindow: newRollingWindow,
      rollingWindowInEffect: Object.keys(newRemainingLimits).length === 0,
    };
  };

  const onAnswer = (correct: boolean) => {
    const newStats = computeNewStats(correct);
    setStats(newStats);

    const counts = countStatGoals(newStats);
    if (
      counts.remainingLimitsCount === 0 &&
      counts.rollingCorrectCount >= effectiveStatThresholds.rollingWindowCorrectLimit
    ) {
      setStageSatisfied(true);
    }

    if (stage.learning && firstEncounter) {
      setFirstEncounterKana([...firstEncounterKana.filter((kana) => kana !== currentKana.kana)]);
    }

    if (!correct) {
      streamRef.current.onFail();
    }
    streamRef.current.next();

    setCurrentKana(streamRef.current.current());
  };

  const computeNextStageState = (): typeof stage =>
    stage.learning
      ? {
          stage: stage.stage,
          learning: false,
        }
      : {
          stage: nextStage,
          learning: true,
        };

  const handleStageChange = (newStage: typeof stage) => {
    setStageSatisfied(false);
    setStage(newStage);

    const newKanaOfStage = bruteForce.buildKanaOfStage(kanaType, newStage.stage, newStage.learning);

    streamRef.current = spacedRepetitionStream(newKanaOfStage);
    setCurrentKana(streamRef.current.current());

    setFirstEncounterKana(newStage.learning ? newKanaOfStage.map((k) => k.kana) : []);

    setStats((prev) => ({
      correctCount: prev.correctCount,
      totalCount: prev.totalCount,
      remainingLimits: buildRemainingKanaLimits(
        newKanaOfStage,
        statThresholds[newStage.learning ? "learning" : "reviewing"].perKanaLimit,
      ),
      rollingWindow: [],
      rollingWindowInEffect: false,
    }));
  };

  const handleMiscOptionsChange = (newOptions: typeof miscOptions) => {
    setMiscOptions(newOptions);
  };

  return (
    <Container px={0}>
      <PracticeKanaInput
        kana={currentKana}
        showAnswer={firstEncounter ? true : undefined}
        onAnswer={onAnswer}
        showCorrectAnswer={miscOptions.showCorrectAnswer}
      />

      {bruteForce.isFinalStage(stage.stage) && !stage.learning && stageSatisfied ? (
        <Container mt="3rem" fz="sm" px={0}>
          <Text>Gratulujeme! Naučili jste se {kanaType}! </Text>
          <Text>
            Pokud vám stále chybí {kanaType === "hiragana" ? "katakana" : "hiragana"}, můžete se ji naučit teď. Můžete také využít Volný režim a Režim slov.
          </Text>
        </Container>
      ) : (
        <Group position="apart" mt="3rem" align="end">
          <div>
            <Text c="dimmed" fz="sm">
              {stage.learning ? "Učení" : "Opakování do fáze"} {stage.stage.name}
            </Text>
            <Text c="dimmed" fz="xs">
              {!stageSatisfied
                ? statCounts.remainingLimitsCount > 0
                  ? `${statCounts.remainingLimitsCount} různých znaků kana k vyřazení (celkem ${statCounts.remainingLimitsTotal})`
                  : `k dokončení fáze chybí ${
                      effectiveStatThresholds.rollingWindowCorrectLimit - statCounts.rollingCorrectCount
                    } správných odpovědí`
                : "Fáze dokončena! Pokud se cítíte jistě, přejděte do další fáze"}
            </Text>
          </div>
          {stageSatisfied ? (
            <Button variant="light" onClick={() => handleStageChange(computeNextStageState())}>
              Další fáze ({stage.learning ? "Opakování" : nextStage.name})
            </Button>
          ) : (
            <Text c="dimmed" fz="xs">
              {nextStage || stage.learning
                ? `Další fáze (${stage.learning ? "Opakování" : nextStage.name})`
                : "Závěrečná fáze"}
            </Text>
          )}
        </Group>
      )}

      <Group mt="md" position="apart" align="end">
        <Group>
          <PlayKanaSoundButton key={getDefaultRomaji(currentKana.romaji)} romaji={currentKana.romaji} />
          <PracticeOptions.CollapseButton opened={openedOptions} onClick={toggleOptions} />
          <KanaAnswerTooltipHint />
        </Group>
        <Group>
          <Tooltip {...tooltipProps} label="Správně / Celkem">
            <Text c="dimmed" fz="sm">{`${stats.correctCount} / ${stats.totalCount}`}</Text>
          </Tooltip>
        </Group>
      </Group>

      <PracticeOptions opened={openedOptions}>
        <BruteForcePracticeOptions
          key={stage.stage.name}
          kanaType={kanaType}
          current={stage.stage}
          onStageChange={(newStage) => handleStageChange({ stage: newStage, learning: true })}
          miscOptions={miscOptions}
          onMiscChange={handleMiscOptionsChange}
        />
      </PracticeOptions>
    </Container>
  );
}

export default BruteForcePractice;
