import axios from "axios";

const getDashboard = async (_userAddress: string, _dashboardUrl: string, _setDashboardUrl: any, _dashboardType: string) => {
  const headers = {
    user_address: _userAddress,
    dashboard_url: _dashboardUrl,
    dashboard_type: _dashboardType,
  };

  axios
    .get("/api/get-grafana-dashboard", { headers: headers })
    .then((response) => {
      console.log("Response: ", response);
      _setDashboardUrl(response.data.dashboardUrl);
    })
    .catch((error) => {
      console.log(`error: ${JSON.stringify(error)}`);
    });
};

export default getDashboard;
