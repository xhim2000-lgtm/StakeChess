import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, G, Text as SvgText, Rect } from 'react-native-svg';

interface Region {
  id: string;
  name: string;
  shortName: string;
  path: string;
  label: { x: number; y: number };
}

const REGIONS: Region[] = [
  {
    id: 'Hauts-de-France',
    name: 'Hauts-de-France',
    shortName: 'HdF',
    path: 'M 200,20 L 260,15 L 290,40 L 285,80 L 250,95 L 215,90 L 190,65 Z',
    label: { x: 240, y: 55 },
  },
  {
    id: 'Normandie',
    name: 'Normandie',
    shortName: 'NOR',
    path: 'M 100,55 L 190,65 L 215,90 L 200,120 L 160,130 L 100,115 L 80,80 Z',
    label: { x: 150, y: 95 },
  },
  {
    id: 'Bretagne',
    name: 'Bretagne',
    shortName: 'BRE',
    path: 'M 15,105 L 80,80 L 100,115 L 100,155 L 70,170 L 20,155 L 5,130 Z',
    label: { x: 55, y: 130 },
  },
  {
    id: 'Pays de la Loire',
    name: 'Pays de la Loire',
    shortName: 'PdL',
    path: 'M 70,170 L 100,155 L 100,115 L 160,130 L 175,165 L 165,210 L 110,220 L 65,200 Z',
    label: { x: 120, y: 175 },
  },
  {
    id: 'Centre-Val de Loire',
    name: 'Centre-Val de Loire',
    shortName: 'CVL',
    path: 'M 160,130 L 200,120 L 230,115 L 250,140 L 255,185 L 230,210 L 175,215 L 165,210 L 175,165 Z',
    label: { x: 210, y: 170 },
  },
  {
    id: 'Ile-de-France',
    name: 'Ile-de-France',
    shortName: 'IdF',
    path: 'M 215,90 L 250,95 L 260,110 L 250,140 L 230,115 L 200,120 Z',
    label: { x: 235, y: 112 },
  },
  {
    id: 'Grand Est',
    name: 'Grand Est',
    shortName: 'GE',
    path: 'M 285,80 L 290,40 L 350,30 L 380,70 L 370,130 L 330,160 L 290,145 L 260,110 L 250,95 Z',
    label: { x: 315, y: 100 },
  },
  {
    id: 'Bourgogne-Franche-Comte',
    name: 'Bourgogne-Franche-Comte',
    shortName: 'BFC',
    path: 'M 250,140 L 260,110 L 290,145 L 330,160 L 340,210 L 315,250 L 270,240 L 255,185 Z',
    label: { x: 295, y: 195 },
  },
  {
    id: 'Nouvelle-Aquitaine',
    name: 'Nouvelle-Aquitaine',
    shortName: 'NAQ',
    path: 'M 65,200 L 110,220 L 165,210 L 175,215 L 195,260 L 210,310 L 180,360 L 130,380 L 80,340 L 60,280 L 55,240 Z',
    label: { x: 130, y: 290 },
  },
  {
    id: 'Auvergne-Rhone-Alpes',
    name: 'Auvergne-Rhone-Alpes',
    shortName: 'ARA',
    path: 'M 230,210 L 255,185 L 270,240 L 315,250 L 345,270 L 340,320 L 300,350 L 260,330 L 230,290 L 210,310 L 195,260 L 175,215 Z',
    label: { x: 270, y: 280 },
  },
  {
    id: 'Occitanie',
    name: 'Occitanie',
    shortName: 'OCC',
    path: 'M 130,380 L 180,360 L 210,310 L 230,290 L 260,330 L 280,380 L 260,420 L 200,435 L 140,420 L 110,400 Z',
    label: { x: 200, y: 385 },
  },
  {
    id: "Provence-Alpes-Cote d'Azur",
    name: 'PACA',
    shortName: 'PACA',
    path: 'M 260,330 L 300,350 L 340,320 L 370,340 L 380,380 L 350,410 L 300,415 L 280,380 Z',
    label: { x: 325, y: 370 },
  },
  {
    id: 'Corse',
    name: 'Corse',
    shortName: 'COR',
    path: 'M 365,400 L 380,395 L 390,420 L 385,460 L 370,470 L 360,445 L 355,420 Z',
    label: { x: 372, y: 435 },
  },
];

interface FranceMapInteractiveProps {
  onRegionSelect: (regionId: string) => void;
  tournoisCounts: Record<string, number>;
}

export function FranceMapInteractive({ onRegionSelect, tournoisCounts }: FranceMapInteractiveProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleRegionPress = (regionId: string) => {
    const newSelection = selectedRegion === regionId ? null : regionId;
    setSelectedRegion(newSelection);
    onRegionSelect(newSelection || '');
  };

  return (
    <View style={mapStyles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 400 490" preserveAspectRatio="xMidYMid meet">
        {REGIONS.map(region => {
          const isSelected = selectedRegion === region.id;
          const count = tournoisCounts[region.id] || 0;

          return (
            <G key={region.id} onPress={() => handleRegionPress(region.id)}>
              <Path
                d={region.path}
                fill={isSelected ? '#D4AF37' : '#F0F0F0'}
                stroke={isSelected ? '#B8960F' : '#CCCCCC'}
                strokeWidth={isSelected ? 2.5 : 1}
              />
              <SvgText
                x={region.label.x}
                y={region.label.y - 6}
                fontSize="9"
                fill={isSelected ? '#000' : '#555'}
                textAnchor="middle"
                fontWeight={isSelected ? 'bold' : 'normal'}
              >
                {region.shortName}
              </SvgText>
              {count > 0 && (
                <>
                  <Rect
                    x={region.label.x - 8}
                    y={region.label.y + 1}
                    width={16}
                    height={14}
                    rx={4}
                    fill={isSelected ? '#000' : '#D4AF37'}
                    opacity={0.85}
                  />
                  <SvgText
                    x={region.label.x}
                    y={region.label.y + 12}
                    fontSize="9"
                    fill="#FFF"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {count}
                  </SvgText>
                </>
              )}
            </G>
          );
        })}
      </Svg>

      <Text style={mapStyles.legend}>
        Cliquez sur une region pour voir les tournois
      </Text>
    </View>
  );
}

export { REGIONS as MAP_REGIONS };

const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});
