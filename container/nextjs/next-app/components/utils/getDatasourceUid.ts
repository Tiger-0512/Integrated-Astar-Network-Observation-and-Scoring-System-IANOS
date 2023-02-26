import axios from "axios";
import { maxHeaderSize } from "http";

const getDatasourceUid = async (_datasourceUid: string) => {
  const headers = {
    datasource_uid: _datasourceUid,
  };

  axios
    .get("/api/get-datasource-uid", { headers: headers })
    .then((response) => {
      console.log("Response: ", response);
      console.log(response.data.datasourceUid);
    })
    .catch((error) => {
      console.log(`error: ${JSON.stringify(error)}`);
    });
};

export default getDatasourceUid;
