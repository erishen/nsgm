import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import jaJP from "antd/locale/ja_JP";

// Antd locale mapping
export const getAntdLocale = (locale: string) => {
  switch (locale) {
    case "zh-CN":
      return zhCN;
    case "en-US":
      return enUS;
    case "ja-JP":
      return jaJP;
    default:
      return zhCN;
  }
};

// Custom hook for translation with namespace
export const useI18n = (namespace = "common") => {
  const { t, i18n } = useTranslation(namespace);
  const router = useRouter();

  return {
    t,
    locale: typeof window !== "undefined" ? router.locale || "zh-CN" : "zh-CN",
    language: i18n.language,
    changeLanguage: (lng: string) => {
      if (typeof window !== "undefined") {
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale: lng });
      }
    },
    isRTL: false, // Add RTL support if needed
  };
};

// Format currency based on locale
export const formatCurrency = (amount: number, locale = "zh-CN") => {
  const currencyMap: Record<string, string> = {
    "zh-CN": "CNY",
    "en-US": "USD",
    "ja-JP": "JPY",
  };

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyMap[locale] || "CNY",
  }).format(amount);
};

// Format date based on locale
export const formatDate = (date: Date | string, locale = "zh-CN") => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
};

// Format number based on locale
export const formatNumber = (number: number, locale = "zh-CN") => {
  return new Intl.NumberFormat(locale).format(number);
};
