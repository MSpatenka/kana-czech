import { Text } from "@mantine/core";
import React from "react";
import { browserIsMobile } from "../utilities/mobile";

function KanaAnswerTooltipHint() {
  return (
    <Text c="dimmed" fz="xs" opacity={0.35}>
      {browserIsMobile ? "Klepnutím na" : "Přejetím myší přes"} kanu odhalíte odpověď
    </Text>
  );
}

export default KanaAnswerTooltipHint;
