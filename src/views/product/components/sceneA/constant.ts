import i18n from 'i18next';

interface Opt {
  name: string;
  value: string;
}

export const proSpecs: Opt[] = [
  {
    name: i18n.t('specifications.dimensions'),
    value: "293*288*155mm",
  },
  {
    name: i18n.t('specifications.productWeight'),
    value: "8KG",
  },
  {
    name: i18n.t('specifications.outputVoltage'),
    value: i18n.t('desc.220VAC'),
  },
  {
    name: i18n.t('specifications.batteryCellCapacity'),
    value: "1kWh",
  },
  {
    name: i18n.t('specifications.ratedOutputPower'),
    value: "200W",
  },
  {
    name: i18n.t('specifications.chargingMode'),
    value: i18n.t('desc.ttzVACInputPhotovoltaicCharging'),
  },
  {
    name: i18n.t('specifications.ratedChargingPower'),
    value: i18n.t('desc.maximum200W'),
  },
  {
    name: i18n.t('specifications.protectionLevel'),
    value: "IP43",
  },
  {
    name: i18n.t('specifications.cycleLife'),
    value: i18n.t('desc.tenThousandChargeAndDischargeCycles'),
  },
  {
    name: i18n.t('specifications.operatingTemp'),
    value: "-10°C-45°C",
  },
];

export const photovoltaicPanelSpecs: Opt[] = [
  {
    name: i18n.t('specifications.batteryTypes'),
    value: i18n.t('specifications.monocrystalline'),
  },
  {
    name: i18n.t('specifications.panelSize'),
    value: '2278±2mmX1134±2mmX30±1mm'
  },
  {
    name: i18n.t('specifications.productWeight'),
    value: '27.3KG'
  },
  {
    name: i18n.t('specifications.numberOfCells'),
    value: '144(6X24)'
  },
  {
    name: `${i18n.t('specifications.maximumPower')}(Pmax)`,
    value: '530W'
  },
  {
    name: i18n.t('specifications.powerTolerance'),
    value: '0~+5W'
  }
];
