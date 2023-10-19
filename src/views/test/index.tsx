import React, { useRef, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { useTranslation, Trans } from "react-i18next";
import { Charge } from '@/views/product/intro/apply-scene/components/battery';
import { DatePicker } from 'antd';

const Test = () => {
  // const PIE_COLOR = ['#E8EAF2', '#73DEB3', '#73A0FA', '#C1C7D0'];

  const total = 1000;
  const recentGoal = 300;
  const monthGoal = 600;
  const awardAmt = 2323.23;
  const opt = {
    title: [
      {
        text: "奖金",
        subtext: "￥" + awardAmt,
        subtextStyle: {
          color: "#000",
          fontSize: 20,
        },
        textAlign: "center",
        left: "49%",
        top: "42%",
        // textStyle: {
        //   color: PIE_COLOR[3],
        // },
      },
    ],
    legend: {
      orient: "vertical",
      // top: 'middle',
      // left: '50%',
      icon: "circle",
      itemHeight: 10,
      itemWidth: 10,
      itemGap: 20,
    },
    tooltip: {
      show: false,
    },
    series: [
      {
        name: "近期目标-背景",
        type: "pie",
        radius: ["56%", "57%"],
        labelLine: {
          show: false,
        },
        emphasis: {
          disabled: true,
        },
        // itemStyle: {
        //   color: PIE_COLOR[0]
        // },
        data: [
          {
            value: total,
          },
        ],
      },
      {
        name: "近期目标",
        type: "pie",
        zlevel: 1,
        //起始角度
        startAngle: 90,
        radius: ["52%", "60%"],
        avoidLabelOverlap: false,
        labelLine: {
          show: false,
        },
        emphasis: {
          disabled: true,
        },
        data: [
          {
            value: recentGoal,
            name: "近期目标",
            itemStyle: {
              // color: PIE_COLOR[1],
              borderRadius: 10,
            },
            label: {
              show: false,
            },
          },
          {
            name: "",
            label: {
              show: false,
            },
            itemStyle: {
              color: "rgba(0,0,0,0)",
            },
            value: total - recentGoal,
          },
        ],
      },

      {
        name: "月度目标-背景",
        type: "pie",
        radius: ["76%", "77%"],
        labelLine: {
          show: false,
        },
        emphasis: {
          disabled: true,
        },
        // itemStyle: {
        //   color: PIE_COLOR[0]
        // },
        data: [
          {
            value: total,
          },
        ],
      },
      {
        name: "月度目标",
        type: "pie",
        zlevel: 1,
        //起始角度
        startAngle: 90,
        radius: ["72%", "80%"],
        avoidLabelOverlap: false,
        labelLine: {
          show: false,
        },
        emphasis: {
          disabled: true,
        },
        data: [
          {
            value: monthGoal,
            name: "月度目标",
            itemStyle: {
              // color: PIE_COLOR[2],
              borderRadius: 10,
            },
            label: {
              show: false,
            },
          },
          {
            name: "",
            label: {
              show: false,
            },
            itemStyle: {
              color: "rgba(0,0,0,0)",
            },
            value: total - recentGoal,
          },
        ],
      },
    ],
  };

  const { t } = useTranslation();

  const d = useRef<HTMLDivElement>();

  useEffect(() => {
    d.current?.addEventListener(
      "touchstart",
      (e) => {
        console.log(111, e);
      },
      false
    );
  }, []);

  return (
    <>
      <h2>{t("welcome")}</h2>
      <div>
        <ReactECharts
          option={opt}
          style={{ height: "300px", width: "400px" }}
          className="echarts-for-echarts"
          theme="vintage"
        />
      </div>
      <DatePicker />
      <Charge />
    </>
  );
};

export default Test;
