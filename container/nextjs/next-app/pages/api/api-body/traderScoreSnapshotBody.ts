const traderScoreSnapshotBody: object = {
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
              "mode": "thresholds"
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
        "id": 1,
        "maxDataPoints": 10,
        "options": {
          "orientation": "auto",
          "reduceOptions": {
            "calcs": [
              "lastNotNull"
            ],
            "fields": "",
            "values": false
          },
          "showThresholdLabels": false,
          "showThresholdMarkers": true
        },
        "pluginVersion": "9.3.6",
        "targets": [
          {
            "alias": "",
            "bucketAggs": [
              {
                "field": "amount",
                "id": "2",
                "settings": {
                  "min_doc_count": "0",
                  "order": "desc",
                  "orderBy": "_term",
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
            "hide": false,
            "metrics": [
              {
                "field": "amount",
                "id": "1",
                "type": "avg"
              }
            ],
            "query": "from:0x649be1c4dface544857e54d5c3fbdb8152b84b4e",
            "queryType": "lucene",
            "refId": "A",
            "timeField": "timestamp"
          }
        ],
        "title": "Trader Score 📈 : 0x649be1c4dface544857e54d5c3fbdb8152b84b4e",
        "type": "gauge"
      },
    ],
    "time": {
      "from": "2022-01-09T15:00:00.000Z",
      "to": "2022-04-15T14:59:59.000Z"
    },
    title: "TraderScorelDashboard",
    version: 1,
  },
  expires: 3600,
};

export default traderScoreSnapshotBody;
