const totalTransferSumSnapshotBody: object = {
  dashboard: {
    id: null,
    hideControls: true,
    panels: [
      {
        gridPos: {
          h: 9,
          w: 12,
          x: 0,
          y: 0,
        },
        type: "gauge",
        title: "Panel Title",
        datasource: {
          type: "grafana-opensearch-datasource",
          uid: "18ysFDbVk",
        },
        pluginVersion: "9.3.6",
        maxDataPoints: 10,
        fieldConfig: {
          defaults: {
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
            color: {
              mode: "thresholds",
            },
          },
          overrides: [],
        },
        options: {
          reduceOptions: {
            values: false,
            calcs: ["lastNotNull"],
            fields: "",
          },
          orientation: "auto",
          showThresholdLabels: false,
          showThresholdMarkers: true,
        },
        targets: [
          {
            alias: "",
            bucketAggs: [
              {
                field: "timestamp",
                id: "4",
                settings: {
                  interval: "auto",
                  min_doc_count: "0",
                  trimEdges: "0",
                },
                type: "date_histogram",
              },
            ],
            datasource: {
              type: "grafana-opensearch-datasource",
              uid: "18ysFDbVk",
            },
            format: "table",
            hide: false,
            metrics: [
              {
                id: "1",
                type: "count",
              },
            ],
            query: "(*:*)",
            queryType: "lucene",
            refId: "B",
            timeField: "timestamp",
          },
        ],
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

export default totalTransferSumSnapshotBody;
