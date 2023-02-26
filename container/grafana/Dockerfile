# Grafana v9.3.6
FROM grafana/grafana@sha256:e5a9655dabef50b04847ee75da8bb9cf46f16480117b7a1d955d5648c1d6e5ba

# Setting to use anonymous access for grafana
USER root
COPY ./grafana.ini /etc/grafana/
USER grafana

# Install OpenSearch Plugin
ARG GF_INSTALL_PLUGINS="grafana-opensearch-datasource"
RUN if [ ! -z "${GF_INSTALL_PLUGINS}" ]; then \
      OLDIFS=$IFS; \
      IFS=','; \
      for plugin in ${GF_INSTALL_PLUGINS}; do \
        IFS=$OLDIFS; \
        if expr match "$plugin" '.*\;.*'; then \
          pluginUrl=$(echo "$plugin" | cut -d';' -f 1); \
          pluginInstallFolder=$(echo "$plugin" | cut -d';' -f 2); \
          grafana-cli --pluginUrl ${pluginUrl} --pluginsDir "${GF_PATHS_PLUGINS}" plugins install "${pluginInstallFolder}"; \
        else \
          grafana-cli --pluginsDir "${GF_PATHS_PLUGINS}" plugins install ${plugin}; \
        fi \
      done \
    fi

