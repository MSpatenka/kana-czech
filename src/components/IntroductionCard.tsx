import React from "react";
import { Anchor, Text, Title, Tooltip } from "@mantine/core";
import TitledCard from "./TitledCard";
import { tooltipProps } from "../utilities/tooltip";

function IntroductionCard() {
  const bold = (text: string) => (
    <Text span italic weight="bold">
      {text}
    </Text>
  );

  return (
    <TitledCard title="Kana" collapsible>
      <Text>
        Kana je úplně první věc, kterou se člověk studující japonštinu musí naučit. Zahrnuje {bold("hiraganu")} a{" "}
        {bold("katakanu")}, dvě abecedy japonského jazyka. Můžete si také přečíst materiály na stránkách <Anchor href="https://www.japonstina.osu.cz/index.php">Ostravské univerzity</Anchor> a dozvědět se více.
      </Text>

      <Title order={4} mt="sm">
        O aplikaci
      </Title>
      <Text>
        Tato stránka má za cíl být snadným, efektivním a rychlým způsobem, jak se naučit kanu bez utrpení s mnemotechnickými pomůckami a podobně. Vše, co musíte udělat, je strávit nějaký čas s extrémně jednoduchým cvičením níže, ve kterém se budete snažit odpovědět správným{" "}
        <Tooltip {...tooltipProps} label="Přepis japonských znaků do latinky pomocí české výslovnosti">
          <Text span italic c="blue.2" sx={{ textDecoration: "underline dotted" }}>
            českým přepisem
          </Text>
        </Tooltip>{" "}
        pro zobrazenou kanu. Tomuto způsobu učení se také říká drilování, protože to zkoušíte znovu a znovu, dokud si to nezapamatujete. V případě kany si to s touto metodou zapamatujete docela snadno.
      </Text>
      <Text mt="xs" fz="xs">
        Tento projekt je založen na <Anchor href="https://github.com/vedxyz/kana">vedxyz/kana</Anchor>, publikovaném pod <Anchor href="https://github.com/vedxyz/kana/blob/main/LICENSE">MIT licencí</Anchor>, a byl lokalizován do češtiny. Tato lokalizace je dostupná pod stejnou licencí na <Anchor href="https://github.com/MSpatenka/kana-czech">GitHubu</Anchor>.
      </Text>
    </TitledCard>
  );
}

export default IntroductionCard;
