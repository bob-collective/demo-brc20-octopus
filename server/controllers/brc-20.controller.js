const { getIndexerData } = require("../common/utils");

const getList = async (req = request, res = response) => {
  try {
    const resp = await getIndexerData(
      "/brc20/status?start=0&limit=20&sort=deploy"
    );
    res.status(200).json({
      status: "OK",
      data: resp.data.data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      data: { error },
    });
  }
};

module.exports = {
  getList,
};
