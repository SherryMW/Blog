---
category: 健康
article: false
---

# 作息

## 2024

| 月份 | 平均睡眠时间 |
|:--:|:------:|
| 9  |  6小时   |
| 10 |        |
| 11 |        |
| 12 |        |

::: echarts 10月

```js
const option = {
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            return params[0].value.substring(11);
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [21]
    },
    yAxis: {
        type: 'time',
        axisLine: {
            show: true
        },
        min: '2024-10-01 22:00',
        max: '2024-10-02 3:00',
        axisLabel: {
            formatter: '{HH}:{mm}'
        }
    },
    series: [
        {
            data: [
                '2024-10-02 00:15'
            ],
            type: 'line',
            markLine: {
                label: {
                    show: true,
                    formatter: function (value) {
                        let date = new Date(value.value);
                        return date.getHours() + ":" + date.getMinutes();
                    }
                },
                data: [{
                    type: 'average',
                    name: '平均值'
                }]
            }
        }
    ]
}
```

:::