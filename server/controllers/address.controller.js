const { getIndexerData } = require("../common/utils");

const getBrc20Balance = async (req = request, res = response) => {
  try {
    const resp = await getIndexerData(
      `/address/${req.params.address}/brc20/summary`
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
  getBrc20Balance,
};
