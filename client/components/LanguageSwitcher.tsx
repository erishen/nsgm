import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useRouter } from "next/router";
import { GlobalOutlined } from "@ant-design/icons";

const { Option } = Select;

interface LanguageSwitcherProps {
  style?: React.CSSProperties;
  size?: "small" | "middle" | "large";
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ style, size = "middle" }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("zh-CN");

  useEffect(() => {
    setMounted(true);
    // 只在客户端获取当前语言
    if (typeof window !== "undefined" && router.locale) {
      setCurrentLocale(router.locale);
    }
  }, [router.locale]);

  const languages = [
    { code: "zh-CN", name: "中文", flag: "🇨🇳" },
    { code: "en-US", name: "English", flag: "🇺🇸" },
    { code: "ja-JP", name: "日本語", flag: "🇯🇵" },
  ];

  const handleLanguageChange = (locale: string) => {
    if (mounted && typeof window !== "undefined") {
      const { pathname, asPath, query } = router;
      router.push({ pathname, query }, asPath, { locale });
    }
  };

  return (
    <Select
      value={currentLocale}
      onChange={handleLanguageChange}
      style={{ minWidth: 120, ...style }}
      size={size}
      suffixIcon={<GlobalOutlined />}
      placeholder="Language"
      disabled={!mounted}
    >
      {languages.map((language) => (
        <Option key={language.code} value={language.code}>
          <span style={{ marginRight: 8 }}>{language.flag}</span>
          {language.name}
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;
