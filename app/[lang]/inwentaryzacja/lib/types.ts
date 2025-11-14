export type EmployeeType = {
  identifier: string;
  firstName: string;
  lastName: string;
  pin: string;
  roles: string[];
};

export type PositionType = {
  position: number;
  identifier: string;
  time: string;
  articleNumber: string;
  articleName: string;
  quantity: number;
  unit: string;
  wip: boolean;
  bin: string;
  deliveryDate: Date;
};

export type CardPositionsTableDataType = PositionType & {
  timeLocaleString: string;
  deliveryDateLocaleString: string;
};

export type CardType = {
  number: number;
  creators: string[];
  warehouse: string;
  sector: string;
  time: string;
  positions: PositionType[];
};

export type CardTableDataType = CardType & {
  positionsLength: number;
};
