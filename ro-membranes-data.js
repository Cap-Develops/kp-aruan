// ro-membranes-data.js - база мембран Vontron для модуля RO-проектирования.
// СГЕНЕРИРОВАНО скриптом gen_ro_data.py из Dat/ оригинальной Vontron RO Design 6.1
// + стандартные тестовые условия из открытых datasheet. Вручную не редактировать.
// Единицы: м3/ч, м3/сут, м2, л/(м2*ч) [LMH], бар, мг/л.

const RO_WATER_TYPES = [
  {
    "key": "ro_permeate",
    "label": "Пермеат RO, SDI < 1"
  },
  {
    "key": "well",
    "label": "Скважинная вода, SDI < 3"
  },
  {
    "key": "tap",
    "label": "Водопроводная вода, SDI < 3"
  },
  {
    "key": "surface_sdi3",
    "label": "Поверхностная вода, SDI < 3"
  },
  {
    "key": "surface_sdi5",
    "label": "Поверхностная вода, SDI < 5"
  },
  {
    "key": "wastewater_mfuf",
    "label": "Сточная вода (после MF/UF), SDI < 3"
  },
  {
    "key": "wastewater_conv",
    "label": "Сточная вода (классич. очистка), SDI < 5"
  },
  {
    "key": "seawater_mfuf",
    "label": "Морская вода (после MF/UF), SDI < 3"
  },
  {
    "key": "seawater_conv",
    "label": "Морская вода (открытый водозабор), SDI < 5"
  }
];

const RO_MEMBRANES = [
  {
    "name": "XLP12-8040",
    "form": "8040",
    "flow_m3d": 48.45,
    "flow_gpd": 12800.0,
    "rejection": 99.2,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "28",
    "coef_src": 0.36,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.735,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.262,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.262,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "XLP",
      "nacl_mgl": 500,
      "p_bar": 6.89,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "ULP22-8040",
    "form": "8040",
    "flow_m3d": 45.8,
    "flow_gpd": 12100.0,
    "rejection": 99.0,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "28",
    "coef_src": 0.257,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.908,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.814,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.814,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.814,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.735,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.814,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "ULP",
      "nacl_mgl": 1500,
      "p_bar": 10.34,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "ULP32-8040",
    "form": "8040",
    "flow_m3d": 39.75,
    "flow_gpd": 10500.0,
    "rejection": 99.5,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "28",
    "coef_src": 0.227,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "ULP",
      "nacl_mgl": 1500,
      "p_bar": 10.34,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "ULP32-8040/31",
    "form": "8040",
    "flow_m3d": 39.75,
    "flow_gpd": 10500.0,
    "rejection": 99.5,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "31",
    "coef_src": 0.227,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "ULP",
      "nacl_mgl": 1500,
      "p_bar": 10.34,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "ULP32-8040-440",
    "form": "8040",
    "flow_m3d": 47.89,
    "flow_gpd": 12650.0,
    "rejection": 99.3,
    "area_m2": 40.88,
    "area_ft2": 440.0,
    "spacer_mil": "28",
    "coef_src": 8.8e-05,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.908,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.597,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.505,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.471,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "ULP",
      "nacl_mgl": 1500,
      "p_bar": 10.34,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "ULP400-LD",
    "form": "8040",
    "flow_m3d": 39.75,
    "flow_gpd": 10500.0,
    "rejection": 99.5,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "34-LD",
    "coef_src": 0.227,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "ULP",
      "nacl_mgl": 1500,
      "p_bar": 10.34,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "ULP440-MAX",
    "form": "8040",
    "flow_m3d": 45.42,
    "flow_gpd": 12000.0,
    "rejection": 99.5,
    "area_m2": 40.88,
    "area_ft2": 440.0,
    "spacer_mil": "28",
    "coef_src": 0.227,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.908,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.644,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.597,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.505,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.471,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "ULP",
      "nacl_mgl": 1500,
      "p_bar": 10.34,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "LP22-8040",
    "form": "8040",
    "flow_m3d": 39.75,
    "flow_gpd": 10500.0,
    "rejection": 99.7,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "28",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "LP",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "LP22-8040/31",
    "form": "8040",
    "flow_m3d": 39.75,
    "flow_gpd": 10500.0,
    "rejection": 99.7,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "31",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "LP",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "LP22-8040PRO",
    "form": "8040",
    "flow_m3d": 41.64,
    "flow_gpd": 11000.0,
    "rejection": 99.7,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "28",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "LP",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "LP22-8040-440",
    "form": "8040",
    "flow_m3d": 43.53,
    "flow_gpd": 11500.0,
    "rejection": 99.7,
    "area_m2": 40.88,
    "area_ft2": 440.0,
    "spacer_mil": "28",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.908,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.644,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.597,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.505,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.471,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "LP",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "LP400-LD",
    "form": "8040",
    "flow_m3d": 39.75,
    "flow_gpd": 10500.0,
    "rejection": 99.7,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "34-LD",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "LP",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "LP440-MAX",
    "form": "8040",
    "flow_m3d": 47.32,
    "flow_gpd": 12500.0,
    "rejection": 99.7,
    "area_m2": 40.88,
    "area_ft2": 440.0,
    "spacer_mil": "28",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.908,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.644,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.597,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.505,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.471,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "LP",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "FR12-8040",
    "form": "8040",
    "flow_m3d": 39.75,
    "flow_gpd": 10500.0,
    "rejection": 99.5,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "34",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "FR",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "FR22-8040PRO",
    "form": "8040",
    "flow_m3d": 41.64,
    "flow_gpd": 11000.0,
    "rejection": 99.7,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "34",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "FR",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "PURO-I",
    "form": "8040",
    "flow_m3d": 39.75,
    "flow_gpd": 10500.0,
    "rejection": 99.75,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "34",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "PURO",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "PURO-II",
    "form": "8040",
    "flow_m3d": 43.53,
    "flow_gpd": 11500.0,
    "rejection": 99.8,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "34-LD",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "PURO",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "PURO-FRLE",
    "form": "8040",
    "flow_m3d": 39.75,
    "flow_gpd": 10500.0,
    "rejection": 99.6,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "34-LD",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "PURO",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "HOR22-8040",
    "form": "8040",
    "flow_m3d": 34.07,
    "flow_gpd": 9000.0,
    "rejection": 99.5,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "28",
    "coef_src": 0.136,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.656,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 17.034,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 15.217,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.498,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 1.42,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.855,
        "qConcMin_m3h": 4.542,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 16.58,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.577,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.341,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "HOR",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5,
      "assumed": true
    }
  },
  {
    "name": "SW8040FR-380",
    "form": "8040",
    "flow_m3d": 25.36,
    "flow_gpd": 6700.0,
    "rejection": 99.8,
    "area_m2": 35.3,
    "area_ft2": 380.0,
    "spacer_mil": "34",
    "coef_src": 0.057,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.678,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 82.7
      },
      "well": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.378,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 82.7
      },
      "tap": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 14.536,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.079,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 3.634,
        "qPermMax_m3h": 0.989,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 0.869,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.139,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 82.7
      }
    },
    "test": {
      "series": "SW",
      "nacl_mgl": 32000,
      "p_bar": 55.16,
      "recovery": 0.08,
      "tempC": 25,
      "ph": 8.0
    }
  },
  {
    "name": "SW8040HR-400",
    "form": "8040",
    "flow_m3d": 28.39,
    "flow_gpd": 7500.0,
    "rejection": 99.8,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "28",
    "coef_src": 0.057,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.678,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 82.7
      },
      "well": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.378,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 82.7
      },
      "tap": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 14.536,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.079,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 3.634,
        "qPermMax_m3h": 0.989,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 0.869,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.139,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 82.7
      }
    },
    "test": {
      "series": "SW",
      "nacl_mgl": 32000,
      "p_bar": 55.16,
      "recovery": 0.08,
      "tempC": 25,
      "ph": 8.0
    }
  },
  {
    "name": "SW8040HR-440",
    "form": "8040",
    "flow_m3d": 31.23,
    "flow_gpd": 8250.0,
    "rejection": 99.8,
    "area_m2": 40.88,
    "area_ft2": 440.0,
    "spacer_mil": "28",
    "coef_src": 0.041,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.908,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 82.7
      },
      "well": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.435,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 82.7
      },
      "tap": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.372,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.372,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 14.536,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.184,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 3.634,
        "qPermMax_m3h": 1.113,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 0.976,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.32,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.25,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 82.7
      }
    },
    "test": {
      "series": "SW",
      "nacl_mgl": 32000,
      "p_bar": 55.16,
      "recovery": 0.08,
      "tempC": 25,
      "ph": 8.0
    }
  },
  {
    "name": "SW8040LE-400",
    "form": "8040",
    "flow_m3d": 34.07,
    "flow_gpd": 9000.0,
    "rejection": 99.8,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "34",
    "coef_src": 0.057,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.678,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 82.7
      },
      "well": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.378,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 82.7
      },
      "tap": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 14.536,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.079,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 3.634,
        "qPermMax_m3h": 0.989,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 0.869,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.139,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 82.7
      }
    },
    "test": {
      "series": "SW",
      "nacl_mgl": 32000,
      "p_bar": 55.16,
      "recovery": 0.08,
      "tempC": 25,
      "ph": 8.0
    }
  },
  {
    "name": "SW8040LE-440",
    "form": "8040",
    "flow_m3d": 35.96,
    "flow_gpd": 9500.0,
    "rejection": 99.8,
    "area_m2": 40.88,
    "area_ft2": 440.0,
    "spacer_mil": "28",
    "coef_src": 0.041,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.908,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 82.7
      },
      "well": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.435,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 82.7
      },
      "tap": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.372,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.372,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 14.536,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.184,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 3.634,
        "qPermMax_m3h": 1.113,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 0.976,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.32,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.25,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 82.7
      }
    },
    "test": {
      "series": "SW",
      "nacl_mgl": 32000,
      "p_bar": 55.16,
      "recovery": 0.08,
      "tempC": 25,
      "ph": 8.0
    }
  },
  {
    "name": "SW8040XLE-400",
    "form": "8040",
    "flow_m3d": 41.64,
    "flow_gpd": 11000.0,
    "rejection": 99.7,
    "area_m2": 37.16,
    "area_ft2": 400.0,
    "spacer_mil": "28",
    "coef_src": 0.057,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.678,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 82.7
      },
      "well": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.378,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 82.7
      },
      "tap": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 14.536,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.079,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 3.634,
        "qPermMax_m3h": 0.989,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 0.869,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.199,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.139,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 82.7
      }
    },
    "test": {
      "series": "SW",
      "nacl_mgl": 32000,
      "p_bar": 55.16,
      "recovery": 0.08,
      "tempC": 25,
      "ph": 8.0
    }
  },
  {
    "name": "SW8040XLE-440",
    "form": "8040",
    "flow_m3d": 45.8,
    "flow_gpd": 12100.0,
    "rejection": 99.7,
    "area_m2": 40.88,
    "area_ft2": 440.0,
    "spacer_mil": "28",
    "coef_src": 0.041,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.271,
        "qPermMax_m3h": 1.908,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 82.7
      },
      "well": {
        "qFeedMax_m3h": 16.353,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.435,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 82.7
      },
      "tap": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.372,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.372,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 14.536,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.184,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 3.634,
        "qPermMax_m3h": 1.113,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 13.173,
        "qConcMin_m3h": 4.088,
        "qPermMax_m3h": 0.976,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 15.899,
        "qConcMin_m3h": 2.953,
        "qPermMax_m3h": 1.32,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 82.7
      },
      "seawater_conv": {
        "qFeedMax_m3h": 14.082,
        "qConcMin_m3h": 3.407,
        "qPermMax_m3h": 1.25,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 82.7
      }
    },
    "test": {
      "series": "SW",
      "nacl_mgl": 32000,
      "p_bar": 55.16,
      "recovery": 0.08,
      "tempC": 25,
      "ph": 8.0
    }
  },
  {
    "name": "XLP11-4040",
    "form": "4040",
    "flow_m3d": 9.84,
    "flow_gpd": 2600.0,
    "rejection": 99.2,
    "area_m2": 9.29,
    "area_ft2": 100.0,
    "spacer_mil": "28",
    "coef_src": 0.36,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.3,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.268,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.252,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.237,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.237,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "XLP",
      "nacl_mgl": 500,
      "p_bar": 6.89,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "ULP21-4040",
    "form": "4040",
    "flow_m3d": 9.84,
    "flow_gpd": 2600.0,
    "rejection": 99.5,
    "area_m2": 9.29,
    "area_ft2": 100.0,
    "spacer_mil": "28",
    "coef_src": 0.257,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.394,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.379,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.379,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.379,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.363,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.347,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.379,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "ULP",
      "nacl_mgl": 1500,
      "p_bar": 10.34,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "ULP31-4040",
    "form": "4040",
    "flow_m3d": 7.57,
    "flow_gpd": 2000.0,
    "rejection": 99.6,
    "area_m2": 9.29,
    "area_ft2": 100.0,
    "spacer_mil": "28",
    "coef_src": 0.201,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.3,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.268,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.252,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.237,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.237,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "ULP",
      "nacl_mgl": 1500,
      "p_bar": 10.34,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "ULP100",
    "form": "4040",
    "flow_m3d": 10.6,
    "flow_gpd": 2800.0,
    "rejection": 99.5,
    "area_m2": 9.29,
    "area_ft2": 100.0,
    "spacer_mil": "28",
    "coef_src": 0.201,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.3,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.268,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.252,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.237,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.237,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "ULP",
      "nacl_mgl": 1500,
      "p_bar": 10.34,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "ULP4040-PRO",
    "form": "4040",
    "flow_m3d": 7.57,
    "flow_gpd": 2000.0,
    "rejection": 99.7,
    "area_m2": 9.29,
    "area_ft2": 100.0,
    "spacer_mil": "28",
    "coef_src": 0.201,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.3,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.268,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.252,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.237,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.237,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "ULP",
      "nacl_mgl": 1500,
      "p_bar": 10.34,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "LP21-4040",
    "form": "4040",
    "flow_m3d": 10.6,
    "flow_gpd": 2800.0,
    "rejection": 99.6,
    "area_m2": 9.29,
    "area_ft2": 100.0,
    "spacer_mil": "28",
    "coef_src": 0.165,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.347,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.315,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.3,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "LP",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "LP100",
    "form": "4040",
    "flow_m3d": 9.46,
    "flow_gpd": 2500.0,
    "rejection": 99.7,
    "area_m2": 9.29,
    "area_ft2": 100.0,
    "spacer_mil": "28",
    "coef_src": 0.165,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.347,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.315,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.3,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "LP",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "FR11-4040",
    "form": "4040",
    "flow_m3d": 8.33,
    "flow_gpd": 2200.0,
    "rejection": 99.5,
    "area_m2": 8.36,
    "area_ft2": 90.0,
    "spacer_mil": "34",
    "coef_src": 0.142,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.347,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.315,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.315,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.315,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.3,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.315,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "FR",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5
    }
  },
  {
    "name": "HOR21-4040",
    "form": "4040",
    "flow_m3d": 8.33,
    "flow_gpd": 2200.0,
    "rejection": 99.5,
    "area_m2": 9.29,
    "area_ft2": 100.0,
    "spacer_mil": "28",
    "coef_src": 0.142,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.347,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 41.4
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.331,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 41.4
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.315,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.315,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.315,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 41.4
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.3,
        "fluxMax_lmh": 23.8,
        "pMax_bar": 41.4
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 20.4,
        "pMax_bar": 41.4
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.315,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 41.4
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.284,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 41.4
      }
    },
    "test": {
      "series": "HOR",
      "nacl_mgl": 2000,
      "p_bar": 15.51,
      "recovery": 0.15,
      "tempC": 25,
      "ph": 7.5,
      "assumed": true
    }
  },
  {
    "name": "SW4040HR",
    "form": "4040",
    "flow_m3d": 6.06,
    "flow_gpd": 1600.0,
    "rejection": 99.8,
    "area_m2": 8.83,
    "area_ft2": 95.0,
    "spacer_mil": "28",
    "coef_src": 0.058,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 82.7
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 82.7
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 68.9
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 68.9
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 68.9
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.205,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 82.7
      }
    },
    "test": {
      "series": "SW",
      "nacl_mgl": 32000,
      "p_bar": 55.16,
      "recovery": 0.08,
      "tempC": 25,
      "ph": 8.0
    }
  },
  {
    "name": "SW4040LE",
    "form": "4040",
    "flow_m3d": 6.06,
    "flow_gpd": 1600.0,
    "rejection": 99.7,
    "area_m2": 8.83,
    "area_ft2": 95.0,
    "spacer_mil": "28",
    "coef_src": 0.058,
    "limits": {
      "ro_permeate": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.454,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 51.0,
        "pMax_bar": 82.7
      },
      "well": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 32.3,
        "pMax_bar": 82.7
      },
      "tap": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 68.9
      },
      "surface_sdi3": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 68.9
      },
      "surface_sdi5": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "wastewater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 1.136,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 25.5,
        "pMax_bar": 82.7
      },
      "seawater_mfuf": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.681,
        "qPermMax_m3h": 0.213,
        "fluxMax_lmh": 28.9,
        "pMax_bar": 68.9
      },
      "seawater_conv": {
        "qFeedMax_m3h": 3.634,
        "qConcMin_m3h": 0.908,
        "qPermMax_m3h": 0.205,
        "fluxMax_lmh": 22.1,
        "pMax_bar": 82.7
      }
    },
    "test": {
      "series": "SW",
      "nacl_mgl": 32000,
      "p_bar": 55.16,
      "recovery": 0.08,
      "tempC": 25,
      "ph": 8.0
    }
  }
];
