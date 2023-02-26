const sampleSnapshotBody: object = {
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
  
        "id": 4,
  
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
  
                "field": "method.keyword",
  
                "id": "4",
  
               "settings": {
  
                  "min_doc_count": "0",
  
                  "order": "desc",
  
                  "orderBy": "_term",
  
                  "size": "10"
  
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
  
                "field": "symbol.keyword",
  
                "id": "3",
  
                "type": "cardinality"
  
              }
  
            ],
  
            "query": "from: 0x649be1c4dface544857e54d5c3fbdb8152b84b4e",
  
            "queryType": "lucene",
  
            "refId": "A",
  
            "timeField": "timestamp"
  
          }
  
        ],
  
        "title": "Transaction Method Diversity Score - from : 0xd537c667d491949f0657102f56b077050aa7805f",
  
        "type": "bargauge"
  
      },
    ],
    title: "AccountlDashboard",
    version: 1,
  },
  expires: 3600,
};

export default sampleSnapshotBody;
