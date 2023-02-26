const userRankingSnapshotBody: object = {
  dashboard: {
    id: null,
    hideControls: true,
    panels: [
      {
        "datasource": {
          "type": "grafana-opensearch-datasource",
          "uid": "18ysFDbVk"
        },
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "palette-classic"
            },
            "custom": {
              "axisCenteredZero": false,
              "axisColorMode": "text",
              "axisLabel": "",
              "axisPlacement": "auto",
              "barAlignment": 0,
              "drawStyle": "line",
              "fillOpacity": 0,
              "gradientMode": "none",
              "hideFrom": {
                "legend": false,
                "tooltip": false,
                "viz": false
              },
              "lineInterpolation": "linear",
              "lineWidth": 1,
              "pointSize": 5,
              "scaleDistribution": {
                "log": 10,
                "type": "log"
              },
              "showPoints": "auto",
              "spanNulls": false,
              "stacking": {
                "group": "A",
                "mode": "none"
              },
              "thresholdsStyle": {
                "mode": "off"
              }
            },
            "mappings": [],
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {
                  "color": "green",
                  "value": null
                },
                {
                  "color": "red",
                  "value": 80
                }
              ]
            }
          },
          "overrides": []
        },
        "gridPos": {
          "h": 13,
          "w": 12,
          "x": 0,
          "y": 19
        },
        "id": 3,
        "interval": "1h",
        "maxDataPoints": 10000,
        "options": {
          "legend": {
            "calcs": [],
            "displayMode": "list",
            "placement": "bottom",
            "showLegend": true
          },
          "tooltip": {
            "mode": "single",
            "sort": "none"
          }
        },
        "targets": [
          {
            "alias": "",
            "bucketAggs": [
              {
                "field": "timestamp",
                "id": "2",
                "settings": {
                  "interval": "auto"
                },
                "type": "date_histogram"
              }
            ],
            "datasource": {
              "type": "grafana-opensearch-datasource",
              "uid": "18ysFDbVk"
            },
            "format": "table",
            "metrics": [
              {
                "field": "amount",
                "id": "1",
                "type": "sum"
              }
            ],
            "query": "*",
            "queryType": "lucene",
            "refId": "A",
            "timeField": "timestamp"
          }
        ],
        "title": "TimeLine Total Sum",
        "type": "timeseries"
      }
    ],
    "time": {
      "from": "2022-01-09T15:00:00.000Z",
      "to": "2022-04-15T14:59:59.000Z"
    },
    title: "AccountlDashboard",
    version: 1,
  },
  expires: 3600,
};

export default userRankingSnapshotBody;
