
export interface ChemicalComponent {
  name: string;
  percentage: number;
}

export interface EssentialOil {
  id: string;
  name: string;
  composition: ChemicalComponent[];
}

export interface BlendItem {
  oil: EssentialOil;
  drops: number;
}

export interface CompositionResult {
  name: string;
  value: number;
}
