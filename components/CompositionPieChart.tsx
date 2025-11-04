import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CompositionResult } from '../types';

interface CompositionPieChartProps {
  data: CompositionResult[];
}

// --- START: Color mapping logic ---

// Define colors for chemical families
const familyColors = {
  MONOTERPENES: '#ffc107', // Amber
  MONOTERPENOLS: '#4caf50', // Green
  ESTERS: '#e91e63', // Pink
  OXIDES: '#2196f3', // Blue
  KETONES: '#00bcd4', // Cyan
  PHENOLS: '#f44336', // Red
  SESQUITERPENES: '#795548', // Brown
  SESQUITERPENOLS: '#673ab7', // Deep Purple
  ALDEHYDES: '#8bc34a', // Light Green
  OTHER: '#9e9e9e', // Grey
};

// Map specific chemicals to families
const chemicalFamilyMap: { [key: string]: keyof typeof familyColors } = {
  // Monoterpenes
  'Limonene': 'MONOTERPENES', 'α-Pinene': 'MONOTERPENES', 'β-Pinene': 'MONOTERPENES', 'γ-Terpinene': 'MONOTERPENES', 'Sabinene': 'MONOTERPENES', 'Myrcene': 'MONOTERPENES', 'Ocimene': 'MONOTERPENES', 'δ-3-Carene': 'MONOTERPENES', 'Camphene': 'MONOTERPENES', 'p-Cymene': 'MONOTERPENES', 'α-Terpinene': 'MONOTERPENES', 'β-Phellandrene': 'MONOTERPENES',

  // Monoterpenols
  'Linalool': 'MONOTERPENOLS', 'Menthol': 'MONOTERPENOLS', 'Terpinen-4-ol': 'MONOTERPENOLS', 'Geraniol': 'MONOTERPENOLS', 'Citronellol': 'MONOTERPENOLS', 'α-Terpineol': 'MONOTERPENOLS', 'Nerol': 'MONOTERPENOLS', 'Sabinene hydrate': 'MONOTERPENOLS',

  // Esters
  'Linalyl acetate': 'ESTERS', 'Lavandulyl acetate': 'ESTERS', 'Menthyl acetate': 'ESTERS', 'Geranyl acetate': 'ESTERS', 'Isobutyl angelate': 'ESTERS', 'Angelica tiglate': 'ESTERS', 'Terpinyl acetate': 'ESTERS', 'Benzyl acetate': 'ESTERS', 'Neryl acetate': 'ESTERS', 'Bornyl acetate': 'ESTERS', 'Citronellyl formate': 'ESTERS', 'Methyl salicylate': 'ESTERS',

  // Oxides
  '1,8-Cineole': 'OXIDES', 'Rose oxide': 'OXIDES',

  // Ketones
  'Menthone': 'KETONES', 'Camphor': 'KETONES', 'Pinocarvone': 'KETONES', 'Isomenthone': 'KETONES', 'Fenchone': 'KETONES', 'Carvone': 'KETONES', 'Valeranone': 'KETONES', 'Jasmone': 'KETONES', 'Vetivone': 'KETONES',

  // Phenols
  'Thymol': 'PHENOLS', 'Carvacrol': 'PHENOLS', 'Eugenol': 'PHENOLS',

  // Sesquiterpenes
  'β-Caryophyllene': 'SESQUITERPENES', 'Germacrene': 'SESQUITERPENES', 'Zingiberene': 'SESQUITERPENES', 'ar-Curcumene': 'SESQUITERPENES', 'β-Sesquiphellandrene': 'SESQUITERPENES', 'α-Bulnesene': 'SESQUITERPENES', 'α-Guaiene': 'SESQUITERPENES', 'Seychellene': 'SESQUITERPENES', 'Elemene': 'SESQUITERPENES', 'γ-Curcumene': 'SESQUITERPENES', 'Italicene': 'SESQUITERPENES', 'Santalenes': 'SESQUITERPENES', 'Cedrene': 'SESQUITERPENES', 'Thujopsene': 'SESQUITERPENES', 'β-Gurjunene': 'SESQUITERPENES', 'Aristolene': 'SESQUITERPENES', 'Calarene': 'SESQUITERPENES', 'Germacrene D': 'SESQUITERPENES',

  // Sesquiterpenols
  'Cedrol': 'SESQUITERPENOLS', 'Globulol': 'SESQUITERPENOLS', 'α-Santalol': 'SESQUITERPENOLS', 'β-Santalol': 'SESQUITERPENOLS', 'Widdrol': 'SESQUITERPENOLS', 'Patchoulol': 'SESQUITERPENOLS', 'Khusimol': 'SESQUITERPENOLS', 'Vetiselinenol': 'SESQUITERPENOLS', 'Isovalencenol': 'SESQUITERPENOLS', 'Viridiflorol': 'SESQUITERPENOLS', 'Nerolidol': 'SESQUITERPENOLS',

  // Aldehydes
  'Geranial': 'ALDEHYDES', 'Neral': 'ALDEHYDES', 'Citronellal': 'ALDEHYDES', 'Cinnamaldehyde': 'ALDEHYDES',
  
  // Other / Phenylpropanoids etc.
  'trans-Anethole': 'OTHER', 'Sclareol': 'OTHER', 'Indole': 'OTHER', 'Furanoeudesma-1,3-diene': 'OTHER', 'Valerenic acid': 'OTHER', 'Lindestrene': 'OTHER', 'Curzerene': 'OTHER', 'Benzyl alcohol': 'OTHER',

  // Generic "Others"
  '기타': 'OTHER', '기타 성분': 'OTHER',
};

const getChemicalColor = (chemicalName: string): string => {
  const family = chemicalFamilyMap[chemicalName];
  if (family) {
    return familyColors[family];
  }
  // A fallback color for any unmapped chemicals.
  return familyColors.OTHER; // Default to grey
};

// --- END: Color mapping logic ---


const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800">{`${payload[0].name}`}</p>
        <p className="text-emerald-600">{`비율: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};


const CompositionPieChart: React.FC<CompositionPieChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center text-gray-500">
        블렌드를 구성하면 화학 구성 비율을<br/>여기에 표시합니다.
      </div>
    );
  }

  // Show top N components in chart, group rest as "기타"
  const topN = 10;
  const visibleData = data.slice(0, topN);
  const otherValue = data.slice(topN).reduce((acc, curr) => acc + curr.value, 0);

  if (otherValue > 0) {
    visibleData.push({ name: '기타 성분', value: parseFloat(otherValue.toFixed(2)) });
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    // Hide label for very small slices to avoid clutter
    if (percent * 100 < 5) {
      return null;
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14px"
        fontWeight="bold"
        style={{ textShadow: '0px 0px 4px rgba(0, 0, 0, 0.6)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={visibleData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          animationDuration={800}
        >
          {visibleData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getChemicalColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
            iconSize={10} 
            layout="vertical" 
            verticalAlign="middle" 
            align="right" 
            wrapperStyle={{fontSize: '14px', lineHeight: '20px'}}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CompositionPieChart;