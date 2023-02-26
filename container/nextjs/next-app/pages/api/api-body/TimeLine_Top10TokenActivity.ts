const top10TokenActivitySnapshotBody: object = {
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
              mode: "palette-classic",
            },
            custom: {
              axisCenteredZero: false,
              axisColorMode: "text",
              axisLabel: "",
              axisPlacement: "auto",
              barAlignment: 0,
              drawStyle: "line",
              fillOpacity: 0,
              gradientMode: "none",
              hideFrom: {
                legend: false,
                tooltip: false,
                viz: false,
              },
              lineInterpolation: "linear",
              lineWidth: 1,
              pointSize: 5,
              scaleDistribution: {
                type: "linear",
              },
              showPoints: "auto",
              spanNulls: false,
              stacking: {
                group: "A",
                mode: "none",
              },
              thresholdsStyle: {
                mode: "off",
              },
            },
            mappings: [],
            thresholds: {
              mode: "percentage",
              steps: [
                {
                  color: "green",
                  value: null,
                },
                {
                  color: "orange",
                  value: 70,
                },
                {
                  color: "red",
                  value: 85,
                },
              ],
            },
          },
          overrides: [],
        },
        gridPos: {
          h: 8,
          w: 12,
          x: 0,
          y: 11,
        },
        id: 7,
        options: {
          legend: {
            calcs: [],
            displayMode: "list",
            placement: "bottom",
            showLegend: true,
          },
          tooltip: {
            mode: "single",
            sort: "none",
          },
        },
        pluginVersion: "9.3.6",
        targets: [
          {
            alias: "",
            bucketAggs: [
              {
                field: "type",
                id: "2",
                settings: {
                  min_doc_count: "0",
                  order: "desc",
                  orderBy: "_term",
                  size: "10",
                },
                type: "terms",
              },
              {
                field: "symbol.keyword",
                id: "3",
                settings: {
                  min_doc_count: "0",
                  order: "desc",
                  orderBy: "_term",
                  size: "10",
                },
                type: "terms",
              },
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
            metrics: [
              {
                id: "1",
                type: "count",
              },
            ],
            query: "",
            queryType: "lucene",
            refId: "A",
            timeField: "timestamp",
          },
        ],
        title: "Top 10 Token Activity",
        type: "timeseries",
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

export default top10TokenActivitySnapshotBody;
