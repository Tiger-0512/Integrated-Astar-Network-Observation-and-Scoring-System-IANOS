const lastBlockNumberScoreSnapshotBody: object = {
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
              mode: "thresholds",
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
          w: 12,
          x: 0,
          y: 8,
        },
        id: 4,
        options: {
          orientation: "auto",
          reduceOptions: {
            calcs: ["lastNotNull"],
            fields: "",
            values: false,
          },
          showThresholdLabels: false,
          showThresholdMarkers: true,
        },
        pluginVersion: "9.3.6",
        targets: [
          {
            alias: "",
            bucketAggs: [
              {
                field: "timestamp",
                id: "2",
                settings: {
                  interval: "auto",
                },
                type: "date_histogram",
              },
            ],
            datasource: {
              type: "grafana-opensearch-datasource",
              uid: "18ysFDbVk",
            },
            format: "table",
            metrics: [
              {
                field: "block",
                id: "1",
                type: "max",
              },
            ],
            query: "from: 0x649be1c4dface544857e54d5c3fbdb8152b84b4e",
            queryType: "lucene",
            refId: "A",
            timeField: "timestamp",
          },
        ],
        title: "Latest Block Number Score - from : 0x649be1c4dface544857e54d5c3fbdb8152b84b4e",
        type: "gauge",
      },
    ],
    time: {
      from: "2022-01-09T15:00:00.000Z",
      to: "2022-04-15T14:59:59.000Z",
    },
    title: "DiamondHandScorelDashboard",
    version: 1,
  },
  expires: 3600,
};

export default lastBlockNumberScoreSnapshotBody;
