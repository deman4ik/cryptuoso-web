import { Text, useMantineTheme } from "@mantine/core";
import { createChart, ColorType, SingleValueData, WhitespaceData, LineWidth } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

//TODO: switch colors with apply
//https://jsfiddle.net/TradingView/6yLzrbtd/
const AreaChart = (props: { data?: (SingleValueData | WhitespaceData)[]; className?: string | undefined }) => {
    const { data, className, ...other } = props;

    const theme = useMantineTheme();

    const backgroundColor = theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0];
    const lineColor = theme.colors.indigo[6];
    const textColor = theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6];
    const gridColor = theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1];
    const areaTopColor = theme.colors.indigo[5];
    const areaBottomColor = backgroundColor;

    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartContainerRef && chartContainerRef.current) {
            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
            };

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor: textColor
                },
                grid: {
                    vertLines: {
                        color: gridColor
                    },
                    horzLines: {
                        color: gridColor
                    }
                },
                crosshair: {
                    vertLine: {
                        visible: true,
                        labelVisible: true
                    },
                    horzLine: {
                        visible: true,
                        labelVisible: true
                    }
                },
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight,
                rightPriceScale: {
                    borderVisible: false
                    /*scaleMargins: {
                        top: 0,
                        bottom: 0
                    }*/
                },
                timeScale: {
                    borderVisible: false,
                    timeVisible: true,
                    secondsVisible: false
                },
                localization: {
                    locale: "en-US"
                }
            });
            chart.timeScale().fitContent();

            const newSeries = chart.addAreaSeries({
                lineColor: lineColor,
                topColor: areaTopColor,
                bottomColor: areaBottomColor,
                lineStyle: 0,
                lineWidth: 2,
                crosshairMarkerVisible: true,
                crosshairMarkerRadius: 2,
                priceLineVisible: false
            });
            if (data && Array.isArray(data) && data.length) newSeries.setData(data);

            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);

                chart.remove();
            };
        }
    }, [data, backgroundColor, lineColor, textColor, gridColor, areaTopColor, areaBottomColor]);

    if (!data || !Array.isArray(data) || data.length === 0)
        return (
            <div className={className} {...other}>
                <Text color="dimmed">No chart data available</Text>
            </div>
        );
    return <div ref={chartContainerRef} className={className} style={{ maxWidth: "97%" }} {...other} />;
};

export default AreaChart;
