const diversityScoreSnapshotBody: object = {
  dashboard: {
    id: null,
    hideControls: true,
    panels: [
      {
        datasource: {
          type: "grafana-opensearch-datasource",
          uid: "18ysFDbVk",
        },
        fieldConfig: {
          defaults: {
            color: {
              mode: "continuous-GrYlRd",
            },
            mappings: [],
            thresholds: {
              mode: "absolute",
              steps: [
                {
                  color: "green",
                  value: null,
                },
                {
                  color: "red",
                  value: 80,
                },
              ],
            },
          },
          overrides: [],
        },
        gridPos: {
          h: 9,
          w: 24,
          x: 0,
          y: 8,
        },
        id: 4,
        options: {
          displayMode: "lcd",
          minVizHeight: 10,
          minVizWidth: 0,
          orientation: "horizontal",
          reduceOptions: {
            calcs: [],
            fields: "",
            values: true,
          },
          showUnfilled: true,
        },
        pluginVersion: "9.3.6",
        targets: [
          {
            alias: "",
            bucketAggs: [
              {
                field: "method.keyword",
                id: "4",
                settings: {
                  min_doc_count: "0",
                  order: "desc",
                  orderBy: "_term",
                  size: "10",
                },
                type: "terms",
              },
            ],
            datasource: {
              type: "grafana-opensearch-datasource",
              uid: "18ysFDbVk",
            },
            format: "table",
            metrics: [
              {
                field: "symbol.keyword",
                id: "3",
                type: "cardinality",
              },
            ],
            // 今回は動作確認のため既にトランザクションを行っているアドレスを指定します
            // 通常の運用では、Local Storage に格納した address を格納してください
            query: "from: 0x649be1c4dface544857e54d5c3fbdb8152b84b4e",
            queryType: "lucene",
            refId: "A",
            timeField: "timestamp",
          },
        ],
        title:
          "Transaction Method Diversity Score - from : 0x649be1c4dface544857e54d5c3fbdb8152b84b4e",
        type: "bargauge",
      },
    ],
    time: {
      from: "2022-01-09T15:00:00.000Z",
      to: "2022-04-15T14:59:59.000Z",
    },
    title: "AccountlDashboard",
    version: 1,
  },
  expires: 3600,
};

export default diversityScoreSnapshotBody;
