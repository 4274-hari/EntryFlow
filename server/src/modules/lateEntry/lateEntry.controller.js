const lateEntryService = require("./lateEntry.service");

const markLate = async (req, res, next) => {
  try {

    const entry = await lateEntryService.markLateEntry(
      req.body,
      req.user._id
    );

    res.status(201).json({
      success: true,
      data: entry
    });

  } catch (error) {
    next(error);
  }
};

const getByDate = async (req, res, next) => {
  try {

    const { date } = req.query;
    if (!date) throw new Error("Date is required");

    const entries = await lateEntryService.getLateByDate(date);

    res.json({
      success: true,
      count: entries.length,
      data: entries
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  markLate,
  getByDate
};