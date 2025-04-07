export const SKUs = {
  ios: {
    annual: "zoul_annual_plan",
    monthly: "Zoul_monthly_plan",
    lifetime: "zoul_life_time",
    annual_promo: "zoul_annual_promo_code_plan",
    monthly_promo: "zoul_monthly_promo_code_plan",
    lifetime_promo: "zoul_life_time_promo_subscription",
  },
  android: {
    annual: "zoul_meditation:zoul-sub-annual",
    monthly: "zoul_meditation:zoul-sub-plan",
    lifetime: "zoul_life_time",
    annual_promo: "zoul_annual_promo_code_plan",
    monthly_promo: "zoul_monthly_promo_code_plan",
    lifetime_promo: "zoul_life_time_promo_subscription",
  },
};

// Mapping object to map Android plan IDs to iOS plan IDs and vice versa
export const planIdMapping = {
  "zoul_meditation:zoul-sub-annual": "zoul_annual_plan",
  "zoul_meditation:zoul-sub-plan": "Zoul_monthly_plan",
  zoul_life_time: "zoul_life_time",
  zoul_annual_promo_code_plan: "zoul_annual_promo_code_plan",
  zoul_monthly_promo_code_plan: "zoul_monthly_promo_code_plan",
  zoul_life_time_promo_subscription: "zoul_life_time_promo_subscription",
  zoul_annual_plan: "zoul_meditation:zoul-sub-annual",
  Zoul_monthly_plan: "zoul_meditation:zoul-sub-plan",
};

export const AppID = {
  ios: "appl_aBeslFTBJrlMyttHIyOeVrYXWmz",
  android: "goog_pNquGubnPZPLWUPEfAnjRpqNCgv",
};

export const PROMO_CODE_LINKs = {
  ios: "https://apps.apple.com/redeem?ctx=offercodes&id=6502774439&code=",
  android: "https://play.google.com/redeem?code=",
};

export const MONTHLY = "monthly";
export const YEARLY = "annual";
export const ONE_TIME = "lifetime";
export const MONTHLY_PROMO = "monthly_promo";
export const YEARLY_PROMO = "annual_promo";
export const ONE_TIME_PROMO = "lifetime_promo";

export const priceByCurrency = {
  GBP: {
    monthly: {
      Original: "£20",
      "Full price": "£9.9",
      "Promo code": "£8",
    },
    annual: {
      Original: "£180",
      "Full price": "£48",
      "Promo code": "£36",
    },
    lifetime: {
      Original: "£999",
      "Full price": "£199",
      "Promo code": "£189",
    },
  },
  USD: {
    monthly: {
      Original: "$26",
      "Full price": "$12.9",
      "Promo code": "$9.9",
    },
    annual: {
      Original: "$240",
      "Full price": "$59",
      "Promo code": "$48",
    },
    lifetime: {
      Original: "$1300",
      "Full price": "$260",
      "Promo code": "$250",
    },
  },
  EUR: {
    monthly: {
      Original: "€25",
      "Full price": "€12",
      "Promo code": "€9",
    },
    annual: {
      Original: "€230",
      "Full price": "€56",
      "Promo code": "€45",
    },
    lifetime: {
      Original: "€1250",
      "Full price": "€250",
      "Promo code": "€239",
    },
  },
  THB: {
    monthly: {
      Original: "฿950",
      "Full price": "฿445",
      "Promo code": "฿390",
    },
    annual: {
      Original: "฿8800",
      "Full price": "฿1800",
      "Promo code": "฿1450",
    },
    lifetime: {
      Original: "฿48000",
      "Full price": "฿9999",
      "Promo code": "฿8888",
    },
  },
  KRW: {
    monthly: {
      Original: "₩35000",
      "Full price": "₩17000",
      "Promo code": "₩12900",
    },
    annual: {
      Original: "₩330000",
      "Full price": "₩79000",
      "Promo code": "₩65000",
    },
    lifetime: {
      Original: "₩1735000",
      "Full price": "₩350000",
      "Promo code": "₩333000",
    },
  },
  IDR: {
    monthly: {
      Original: "Rp406000",
      "Full price": "Rp200000",
      "Promo code": "Rp149000",
    },
    annual: {
      Original: "Rp3800000",
      "Full price": "Rp920000",
      "Promo code": "Rp749000",
    },
    lifetime: {
      Original: "Rp20300000",
      "Full price": "Rp4060000",
      "Promo code": "Rp3900000",
    },
  },
  JPY: {
    monthly: {
      Original: "¥4000",
      "Full price": "¥2000",
      "Promo code": "¥1490",
    },
    annual: {
      Original: "¥36000",
      "Full price": "¥8000",
      "Promo code": "¥7200",
    },
    lifetime: {
      Original: "¥195000",
      "Full price": "¥39000",
      "Promo code": "¥35000",
    },
  },
  RUB: {
    monthly: {
      Original: "RUB 2500",
      "Full price": "₽1240",
      "Promo code": "₽949",
    },
    annual: {
      Original: "RUB 23000",
      "Full price": "₽5700",
      "Promo code": "₽4590",
    },
    lifetime: {
      Original: "RUB 125000",
      "Full price": "₽25000",
      "Promo code": "₽24000",
    },
  },
  ILS: {
    monthly: {
      Original: "₪99",
      "Full price": "₪49",
      "Promo code": "₪39",
    },
    annual: {
      Original: "₪920",
      "Full price": "₪230",
      "Promo code": "₪180",
    },
    lifetime: {
      Original: "₪4990",
      "Full price": "₪999",
      "Promo code": "₪909",
    },
  },
  AED: {
    monthly: {
      Original: "د.إ95",
      "Full price": "د.إ49",
      "Promo code": "د.إ39",
    },
    annual: {
      Original: "د.إ880",
      "Full price": "د.إ220",
      "Promo code": "د.إ174",
    },
    lifetime: {
      Original: "د.إ4800",
      "Full price": "د.إ999",
      "Promo code": "د.إ909",
    },
  },
  INR: {
    monthly: {
      Original: "₹2200",
      "Full price": "₹1075",
      "Promo code": "₹799",
    },
    annual: {
      Original: "₹20000",
      "Full price": "₹4900",
      "Promo code": "₹3990",
    },
    lifetime: {
      Original: "₹108000",
      "Full price": "₹22000",
      "Promo code": "₹20000",
    },
  },
  CNY: {
    monthly: {
      Original: "¥8",
      "Full price": "¥95",
      "Promo code": "¥69",
    },
    annual: {
      Original: "¥1800",
      "Full price": "¥430",
      "Promo code": "¥350",
    },
    lifetime: {
      Original: "¥9500",
      "Full price": "¥1900",
      "Promo code": "¥1800",
    },
  },
};

export const UXCAM_API_KEY = "cnq51wotb1v30nm";
