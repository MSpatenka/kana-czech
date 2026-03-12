import React from "react";
import { Anchor, List, Text } from "@mantine/core";
import TitledCard from "./TitledCard";
import { IconArrowNarrowRight } from "@tabler/icons-react";

function ExplanationCard() {
  const RightArrow = <IconArrowNarrowRight style={{ verticalAlign: "middle" }} />;

  return (
    <TitledCard title="Vysvětlení" titleOrder={3} collapsible>
      <div
        dangerouslySetInnerHTML={{ __html: "<!-- This information was taken/paraphrased from the DJT kana page. -->" }}
      />
      <Text>
        Některé znaky kana mají vedle sebe dvě tečky (◌゙,{" "}
        <Anchor href="https://en.wikipedia.org/wiki/Dakuten" italic>
          dakuten
        </Anchor>
        ) k označení, že souhláska je &quot;změkčena&quot;. Například z か (ka) se stane が (ga). Souhlásky se transformují takto:
      </Text>
      <List sx={{ display: "flex", flexWrap: "wrap", columnGap: "2.5rem" }}>
        <List.Item>k {RightArrow} g</List.Item>
        <List.Item>t {RightArrow} d</List.Item>
        <List.Item>h/f {RightArrow} b</List.Item>
        <List.Item>s/c {RightArrow} z</List.Item>
        <List.Item>š/č {RightArrow} dž</List.Item>
      </List>
      <Text>
        Některé další znaky kana přidávají kroužek (◌゚) pro označení &quot;p&quot; transformace. Například ほ (ho) se změní na ぽ
        (po).
      </Text>
      <Text mt="sm">
        Menší znaky kana (ゅ, ょ, ゃ, ...) se používají ke kombinování zvuků kany. Například v ぎゃ se souhláska
        ぎ (gi) kombinuje se zvukem z や (ja) a vznikne &quot;gja&quot;. Malé っ (odlišné od つ/cu) se samo o
        sobě nevyslovuje, ale prodlužuje následující souhlásku, jako v にっぽん (ni
        <Text span weight={700}>
          pp
        </Text>
        on).
      </Text>
      <Text italic mt="sm">
        Další informace naleznete v příslušných sekcích na webu{" "}
        <Anchor href="https://www.japonstina.osu.cz/index.php">
          Ostravské univerzity
        </Anchor>
        .
      </Text>
    </TitledCard>
  );
}

export default ExplanationCard;
