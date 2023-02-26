const statisticsSnapshotBody: object = {
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
              "mode": "continuous-GrYlRd"
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
          "h": 9,
          "w": 12,
          "x": 0,
          "y": 8
        },
        "id": 10,
        "options": {
          "displayMode": "lcd",
          "minVizHeight": 10,
          "minVizWidth": 0,
          "orientation": "horizontal",
          "reduceOptions": {
            "calcs": [],
            "fields": "",
            "values": true
          },
          "showUnfilled": true
        },
        "pluginVersion": "9.3.6",
        "targets": [
          {
            "alias": "",
            "bucketAggs": [
              {
                "field": "from.keyword",
                "id": "2",
                "settings": {
                  "min_doc_count": "0",
                  "order": "desc",
                  "orderBy": "1",
                  "size": "20"
                },
                "type": "terms"
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
            "query": "symbol: WASTR",
            "queryType": "lucene",
            "refId": "A",
            "timeField": "timestamp"
          }
        ],
        "title": "UserTransferRanking - Symbol : WASTR",
        "type": "bargauge"
      },
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
                "type": "linear"
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
          "h": 9,
          "w": 12,
          "x": 12,
          "y": 8
        },
        "id": 2,
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
                "field": "symbol.keyword",
                "id": "3",
                "settings": {
                  "min_doc_count": "0",
                  "order": "desc",
                  "orderBy": "_term",
                  "size": "10"
                },
                "type": "terms"
              },
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
                "id": "1",
                "type": "count"
              }
            ],
            "query": "",
            "queryType": "lucene",
            "refId": "A",
            "timeField": "timestamp"
          }
        ],
        "title": "Top10 Token Activity",
        "type": "timeseries"
      },
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
          "h": 11,
          "w": 24,
          "x": 0,
          "y": 17
        },
        "id": 8,
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
                  "interval": "auto",
                  "min_doc_count": "0",
                  "trimEdges": "0"
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
                "type": "avg"
              }
            ],
            "query": "*",
            "queryType": "lucene",
            "refId": "A",
            "timeField": "timestamp"
          }
        ],
        "title": "TotalTradingAmount",
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

export default statisticsSnapshotBody;
