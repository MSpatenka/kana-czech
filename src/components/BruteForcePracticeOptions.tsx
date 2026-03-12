import { Checkbox, Container, Title } from "@mantine/core";
import React from "react";
import { bruteForce, BruteForcePracticeStage } from "../utilities/bruteforce";
import { KanaNames } from "../utilities/kana";
import BruteForcePracticeStageOption from "./BruteForcePracticeStageOption";
import { MiscPracticeOptions } from "./PracticeCard";

export interface BruteForcePracticeOptionsProps {
  kanaType: KanaNames;
  current: BruteForcePracticeStage;
  onStageChange: (newStage: BruteForcePracticeStage) => void;
  miscOptions: MiscPracticeOptions;
  onMiscChange: (options: MiscPracticeOptions) => void;
}

function BruteForcePracticeOptions({
  kanaType,
  current,
  onStageChange,
  miscOptions,
  onMiscChange,
}: BruteForcePracticeOptionsProps) {
  return (
    <>
      <Container px={0} py="md">
        <Title order={6} mb="sm">
          Obecné
        </Title>
        <Checkbox
          label="Zobrazit správnou odpověď při zadání špatné odpovědi"
          checked={miscOptions.showCorrectAnswer}
          onChange={() => {
            onMiscChange({
              ...miscOptions,
              showCorrectAnswer: !miscOptions.showCorrectAnswer,
            });
          }}
        />
      </Container>

      <Title order={6} mb="sm">
        Fáze
      </Title>
      {bruteForce.stages.map((stage) => (
        <BruteForcePracticeStageOption
          key={stage.name}
          kanaType={kanaType}
          stage={stage}
          current={current.name === stage.name}
          onStageChange={onStageChange}
        />
      ))}
    </>
  );
}

export default BruteForcePracticeOptions;
