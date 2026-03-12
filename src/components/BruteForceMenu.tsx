import { Button, ButtonProps, Container, Group, List, Text, Title } from "@mantine/core";
import React, { useState } from "react";
import { KanaNames } from "../utilities/kana";
import BruteForcePractice from "./BruteForcePractice";

function BruteForceMenu() {
  const buttonProps: ButtonProps = {
    variant: "light",
    fullWidth: true,
    styles: {
      label: { display: "block", textAlign: "center", padding: "0.8rem" },
      root: { height: "unset", flex: "1" },
    },
  };

  const [kanaType, setKanaType] = useState<KanaNames | null>(null);

  if (kanaType) return <BruteForcePractice kanaType={kanaType} />;

  return (
    <Container px={0}>
      <Text>
        V tomto režimu projdete fázemi učení, které vás pokaždé seznámí s novou sadou kany. Odpověď pro nově nalezenou kanu se zobrazí automaticky, věnujte zvláštní pozornost tvaru těchto znaků kana. Po každé fázi učení následuje fáze opakování všech znaků kana, které jste se dosud naučili. Každá fáze má určitý požadavek na splnění, jak sami uvidíte.
      </Text>
      <Title order={4} mt="sm">
        Tipy
      </Title>
      <List pr={16}>
        <List.Item>
          Neciťte se pod tlakem, abyste okamžitě přešli do další fáze, když k tomu budete vyzváni, odhadněte své síly.
        </List.Item>
        <List.Item>Můžete pokračovat z libovolné fáze, kterou chcete, v nabídce možností.</List.Item>
        <List.Item>Měli byste počítat s tím, že ke splnění všech fází budete potřebovat celkem ~1600 správných odpovědí.</List.Item>
        <List.Item>
          Učení kany zde vás nutně nenaučí ji <Text span>psát</Text>. Jedinou zárukou je, že budete schopni rozeznat kanu od pohledu, což je pro většinu lidí dostatečné (nebo alespoň dobrý začátek).
        </List.Item>
      </List>
      <Text mt="sm">
        Měli byste se naučit{" "}
        <Text span italic>
          hiraganu
        </Text>{" "}
        jako první.
      </Text>

      <Group mt="sm">
        <Button {...buttonProps} onClick={() => setKanaType("hiragana")}>
          <Title order={3}>Hiragana</Title>
          <Text weight="normal">ひらがな</Text>
        </Button>
        <Button {...buttonProps} onClick={() => setKanaType("katakana")}>
          <Title order={3}>Katakana</Title>
          <Text weight="normal">カタカナ</Text>
        </Button>
      </Group>
    </Container>
  );
}

export default BruteForceMenu;
