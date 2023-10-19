import i18n from 'i18next';

const t = i18n.t;

export const serviceList = [
  {
    price: 12,
    currencySign: t('currencySign'),
    name: t('desc.energyStorageKitWeeklyLease'),
    desc: '按周付费订阅使用设备',
    canCancel: t('desc.unsubscribeAtAnytime'),
    billingCycle: '周付',
    package: t('desc.leaseSystem')
  },
  {
    price: 49,
    currencySign: t('currencySign'),
    name: t('desc.monthlyPaymentToUseTheKit'),
    desc: '按月付费订阅使用设备',
    canCancel: t('desc.unsubscribeAtAnytime'),
    billingCycle: '月付',
    package: t('desc.leaseSystem')
  },
  {
    price: 588,
    currencySign: t('currencySign'),
    name: t('desc.annualPaymentToUseTheKit'),
    desc: '按年付费订阅使用设备',
    canCancel: t('desc.unsubscribeAtAnytime'),
    billingCycle: '年付',
    package: t('desc.leaseSystem')
  },
  {
    price: 1999,
    currencySign: t('currencySign'),
    name: t('desc.energyStorageKits'),
    desc: '以一次性方式直接购入设备',
    canCancel: '',
    billingCycle: t('desc.onetimePayment'),
    package: t('desc.oneOff')
  }
];
