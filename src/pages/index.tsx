import { useState, useMemo, useRef } from "react";
import styled from "styled-components";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { ChromePicker } from "react-color";
import { produce } from "immer";
import { saveAs } from "file-saver";

import {
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Button,
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

const Page = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
  align-self: center;
  min-height: 100vh;
  width: 850px;
`;

const Banner = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 5rem;
  display: flex;
  align-self: start;
  font-family: HudsonNYPro, sans-serif;
  img {
    height: 100%;
    width: auto;
  }
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const CanvasContainer = styled.div`
  border: 1px solid;
  position: relative;
  display: flex;
  flex-direction: row;
`;

const Controls = styled.div`
  width: fit-content;
  padding: 1rem;
`;

const SliderBox = styled.div``;

const LayersContainer = styled.div`
  height: fit-content;
`;

const Layers = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Layer = styled.img`
  width: 100%;
  cursor: pointer;
`;

const constructLayers = (layers: string[]) =>
  layers.map((layer) => `url(/assets/${layer}.png)`).join(",");

enum LayerType {
  Hair,
  Body,
}

enum ColorType {
  Background,
  Stroke,
}

const LAYERS = {
  body: [
    "x_alien_01",
    "y_alien_01",
    "x_kaiju_01",
    "y_kaiju_01",
    "x_kong_01",
    "y_kong_01",
    "x_kraken_01",
    "y_kraken_01",
    "x_shark_01",
    "y_shark_01",
    "x_human_01",
    "x_human_02",
    "x_human_03",
    "x_human_04",
    "x_human_05",
    "x_human_06",
    "y_human_01",
    "y_human_02",
    "y_human_03",
    "y_human_04",
    "y_human_05",
    "y_human_06",
  ],
  hair: [
    "x_alien_hair_01",
    "y_alien_hair_01",
    "x_kaiju_hair_01",
    "y_kaiju_hair_01",
    "x_kong_hair_01",
    "y_kong_hair_01",
    "x_kraken_hair_01",
    "y_kraken_hair_01",
    "x_shark_hair_01",
    "y_shark_hair_01",
    "x_human_hair_01",
    "y_human_hair_01",
  ],
};

export default function Main() {
  const canvasRef = useRef<any>(null);
  const [eraseActive, setEraseActive] = useState(false);
  const [colors, setColors] = useState({
    stroke: { hex: "#000" },
    background: { hex: "transparent" },
  });
  const [strokeWidth, setStrokeWidth] = useState(12);
  const [layers, setLayers] = useState({
    hair: "y_kraken_hair_01",
    body: "x_kaiju_01",
  });
  const {
    isOpen: isControlsOpen,
    onOpen: onOpenControls,
    onClose: onCloseControls,
  } = useDisclosure({ defaultIsOpen: true });

  const onEraseMode = () => {
    if (canvasRef.current) {
      const newMode = !eraseActive;
      canvasRef.current.eraseMode(newMode);
      setEraseActive(newMode);
    }
  };

  const onClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const onUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const onRedo = () => {
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  };

  const onExport = () => {
    if (canvasRef.current) {
      canvasRef.current
        .exportImage("png")
        .then((data: any) => {
          saveAs(data, "traits.png");
        })
        .catch((e: any) => {
          console.log(e);
        });
    }
  };

  const handleColorChange = (color: any, type: ColorType) => {
    setColors(
      produce((colors) => {
        if (type === ColorType.Background) {
          colors.background = color;
        } else if (type === ColorType.Stroke) {
          colors.stroke = color;
        }
      }),
    );
  };

  const setLayer = (layer: string, type: LayerType) => {
    setLayers(
      produce((layers) => {
        if (type === LayerType.Hair) {
          layers.hair = layer;
        } else if (type === LayerType.Body) {
          layers.body = layer;
        }
      }),
    );
  };

  return (
    <Page>
      <Banner>
        <img src="/memeland-logo-moving.gif" />
        <img src="/memeland-text.png" />
      </Banner>
      <CanvasContainer>
        <Controls>
          <Buttons>
            <Button onClick={onClear}>Clear</Button>
            <Button onClick={onEraseMode}>
              {eraseActive ? "Draw" : "Erase"}
            </Button>
            <Button onClick={onUndo}>Undo</Button>
            <Button onClick={onRedo}>Redo</Button>
            <Button onClick={onOpenControls}>Change Base</Button>
            <Button onClick={onExport}>Export</Button>
          </Buttons>
          <SliderBox>
            <Text mt={"2"}>Stroke width: {strokeWidth}px</Text>
            <Slider
              id="point-size-slider"
              defaultValue={12}
              min={0}
              max={100}
              colorScheme=""
              onChange={(v: number) => setStrokeWidth(v)}
            >
              <SliderTrack bg="red.100">
                <SliderFilledTrack bg="tomato" />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box as="img" src="/memeland-logo.png" />
              </SliderThumb>
            </Slider>
          </SliderBox>
          <Text>Stroke Color</Text>
          <ChromePicker
            color={colors.stroke}
            onChange={(color: any) =>
              handleColorChange(color, ColorType.Stroke)
            }
          />
        </Controls>
        <ReactSketchCanvas
          canvasColor={"transparent"}
          svgStyle={{
            backgroundSize: "cover",
            backgroundColor: colors.background?.hex ?? "transparent",
            backgroundImage: constructLayers([layers.hair, layers.body]),
          }}
          width={"600px"}
          height={"600px"}
          ref={canvasRef}
          strokeWidth={strokeWidth}
          strokeColor={colors.stroke?.hex ?? "black"}
          eraserWidth={strokeWidth}
        />
      </CanvasContainer>
      <Drawer
        placement={"right"}
        onClose={onCloseControls}
        isOpen={isControlsOpen}
        size="xs"
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Select Base</DrawerHeader>
          <DrawerBody>
            <LayersContainer>
              <Tabs align="start" variant="enclosed">
                <TabList>
                  <Tab>Hair</Tab>
                  <Tab>Body</Tab>
                  <Tab>Background</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Layers>
                      {LAYERS.hair.map((layer) => (
                        <Layer
                          key={layer}
                          onClick={() => setLayer(layer, LayerType.Hair)}
                          alt={layer}
                          src={`/assets/${layer}.png`}
                        />
                      ))}
                    </Layers>
                  </TabPanel>
                  <TabPanel>
                    <Layers>
                      {LAYERS.body.map((layer) => (
                        <Layer
                          key={layer}
                          onClick={() => setLayer(layer, LayerType.Body)}
                          alt={layer}
                          src={`/assets/${layer}.png`}
                        />
                      ))}
                    </Layers>
                  </TabPanel>
                  <TabPanel>
                    <ChromePicker
                      id={"background-picker"}
                      color={colors.background}
                      onChange={(color: any) =>
                        handleColorChange(color, ColorType.Background)
                      }
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </LayersContainer>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Text align="right" width="full">
        A community company. Built with love. El Capo.
      </Text>
    </Page>
  );
}
