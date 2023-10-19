export interface Device {
  isMobile: boolean;
  isTablet: boolean; // 平板
  isPc: boolean;
}

export const getDevice = (): Device => {
  const ua = navigator.userAgent;
  const isWindowsPhone = /(?:Windows Phone)/.test(ua);
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
  const isAndroid = /(?:Android)/.test(ua);
  const isFireFox = /(?:Firefox)/.test(ua);
  const isChrome = /(?:Chrome|CriOS)/.test(ua);
  const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua));
  const isPhone = /(?:iPhone)/.test(ua) && !isTablet;
  const isPc = !isPhone && !isAndroid && !isSymbian;

  return {
    isMobile: isAndroid || isPhone,
    isTablet,
    isPc
  }
}
export const getDeviceClassname = (device: Device): string => {
  return device.isPc ? (device.isMobile ? 'mobile' : 'tablet') : ''
}


