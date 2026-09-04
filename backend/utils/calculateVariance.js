
const calculateVariance = (expected, actual) => {
  const variance = actual - expected;

  let status;

  if (variance === 0) {
    status = "MATCHED";
  } else if (variance < 0) {
    status = "SHORT";
  } else {
    status = "OVER";
  }

  return {
    variance,
    status,
  };
};

module.exports = calculateVariance;

