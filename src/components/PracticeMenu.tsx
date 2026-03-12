import React from "react";
import { Button, ButtonProps, Container, Text, Title } from "@mantine/core";
import { PracticeCardPages } from "./PracticeCard";

export interface PracticeMenuProps {
  onPageChange: (newPage: PracticeCardPages) => void;
}

function PracticeMenu({ onPageChange }: PracticeMenuProps) {
  const buttonProps: ButtonProps = {
    variant: "light",
    fullWidth: true,
    styles: {
      label: { display: "block", textAlign: "center", padding: "0.8rem", whiteSpace: "normal" },
      root: { height: "unset" },
    },
  };

  return (
    <Container px={0}>
      <Button {...buttonProps} onClick={() => onPageChange("bruteforce")}>
        <Title order={3}>Vedený režim</Title>
        <Text weight="normal">Postupujte podle strukturované cesty a naučte se kanu od nuly, jednu řadu po druhé</Text>
      </Button>
      <Button {...buttonProps} mt="sm" onClick={() => onPageChange("free")}>
        <Title order={3}>Volný režim</Title>
        <Text weight="normal">Procvičujte sami s jakoukoliv kanou a možnostmi, které preferujete</Text>
      </Button>
      <Button {...buttonProps} mt="sm" onClick={() => onPageChange("word")}>
        <Title order={3}>Režim slov</Title>
        <Text weight="normal">Procvičujte spojování kany se slovy z balíčků N5/N4</Text>
      </Button>
    </Container>
  );
}

export default PracticeMenu;
